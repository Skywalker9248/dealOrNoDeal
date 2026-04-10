const { v4: uuidv4 } = require("uuid");

const prizes = [
  0.1, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000,
  25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000,
];

// Free models tried in race order — fastest responder wins per session
const FREE_MODELS = [
  "z-ai/glm-4.5-air:free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
];

const sessions = {};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Ping all models in parallel and return them sorted by response latency.
// Models that fail the ping are appended at the end as fallback candidates.
async function pingModelRace() {
  const results = await Promise.allSettled(
    FREE_MODELS.map(async (model) => {
      const start = Date.now();
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 4000);
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            signal: ac.signal,
            body: JSON.stringify({
              model,
              max_tokens: 5,
              messages: [{ role: "user", content: "Reply with one word: ready" }],
            }),
          },
        );
        clearTimeout(t);
        if (!res.ok) throw new Error(`${res.status}`);
        await res.json();
        return { model, latency: Date.now() - start };
      } finally {
        clearTimeout(t);
      }
    }),
  );

  const winners = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .sort((a, b) => a.latency - b.latency)
    .map((r) => r.model);

  console.log(
    "Model ping results:",
    winners.map((m, i) => `${i + 1}. ${m}`).join(", ") || "none responded",
  );

  // Append any models that failed the ping — still worth trying for the real call
  const failed = FREE_MODELS.filter((m) => !winners.includes(m));
  return [...winners, ...failed];
}

// Attempt a banker offer with a single model. Returns { offer, message } or null.
async function tryBankerModel(model, remainingValues, baseOffer) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: ac.signal,
      body: JSON.stringify({
        model,
        max_tokens: 60,
        messages: [
          {
            role: "user",
            content: `You are the Banker from Deal or No Deal. The offer is $${baseOffer}. Remaining values: ${remainingValues.join(", ")}. Write ONE short persuasive sentence (under 20 words) urging the player to accept $${baseOffer}. Reply with ONLY the sentence.`,
          },
        ],
      }),
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    const message = data?.choices?.[0]?.message?.content?.trim();
    if (!message || typeof message !== "string" || message.length > 300)
      return null;
    return { offer: baseOffer, message };
  } catch {
    clearTimeout(t);
    return null;
  }
}

// --- HTTP handlers ---

exports.createSession = (c) => {
  const gamePrizes = [...prizes];
  shuffleArray(gamePrizes);

  const cases = gamePrizes.map((prize, index) => ({
    caseNumber: index + 1,
    value: prize,
    opened: false,
  }));

  const sessionId = uuidv4();
  sessions[sessionId] = {
    id: sessionId,
    cases,
    gameState: "PLAYING",
    selectedCase: 0,
    // Kick off model ping race immediately — non-blocking
    modelRacePromise: pingModelRace(),
  };

  return c.json({ sessionId });
};

exports.getSession = (c) => {
  const sessionId = c.req.valid("query").id;
  const currentSession = sessions[sessionId];

  if (!currentSession) {
    return c.json({ error: "Session not found" }, 404);
  }

  const revealedCases = currentSession.cases.filter((c) => c.opened === true);

  return c.json({
    id: currentSession.id,
    gameState: currentSession.gameState,
    openedCases: revealedCases,
    selectedCase: currentSession.selectedCase,
  });
};

exports.updateSelectedCase = async (c) => {
  const { sessionId, caseNumber } = c.req.valid("json");
  const currentSession = sessions[sessionId];

  if (!currentSession) {
    return c.json({ error: "Session not found" }, 404);
  }

  currentSession.selectedCase = caseNumber;
  currentSession.gameState = "PLAYING";
  return c.body(null, 200);
};

exports.deleteSession = async (c) => {
  const { sessionId } = c.req.valid("json");

  if (!sessions[sessionId]) {
    return c.json({ error: "Session not found" }, 404);
  }

  delete sessions[sessionId];
  return c.json({ message: "Session deleted" });
};

// --- Internal helpers used by Socket.io handlers ---

exports.getCurrentSession = (sessionId) => sessions[sessionId];

exports.getBankerOffer = async (sessionId) => {
  const session = sessions[sessionId];
  if (!session) return null;

  const remainingValues = session.cases
    .filter((c) => !c.opened)
    .map((c) => c.value);

  const average =
    remainingValues.reduce((a, b) => a + b, 0) / remainingValues.length;

  const roundNumber = session.cases.filter((c) => c.opened).length;
  let percentage = 0.15;
  if (roundNumber >= 11) percentage = 0.4;
  if (roundNumber >= 18) percentage = 0.75;
  if (roundNumber >= 22) percentage = 0.95;

  const baseOffer = Math.floor(average * percentage);

  // Await the pre-computed ping race (usually already resolved by now)
  const orderedModels = await session.modelRacePromise;

  for (const model of orderedModels) {
    const result = await tryBankerModel(model, remainingValues, baseOffer);
    if (result) {
      session.bankOffer = result.offer;
      console.log(`Banker offer via ${model}: $${result.offer}`);
      return result;
    }
  }

  // All models failed — return correct offer with static message
  console.error("getBankerOffer: all models failed, using static fallback");
  return { offer: baseOffer, message: "This is my final offer. Take it or leave it." };
};

exports.getSelectedCaseValue = (sessionId) => {
  const session = sessions[sessionId];
  if (!session) return null;

  const selectedCaseData = session.cases.find(
    (c) => c.caseNumber === session.selectedCase,
  );
  return selectedCaseData ? selectedCaseData.value : null;
};

const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const prizes = [
  0.1, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000,
  25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000,
];

const sessions = {};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

exports.createSession = (req, res) => {
  // 1. Shuffle
  const gamePrizes = [...prizes];
  shuffleArray(gamePrizes);

  // 2. Create Cases
  const cases = gamePrizes.map((prize, index) => {
    return {
      caseNumber: index + 1,
      value: prize,
      opened: false,
    };
  });

  // 3. Save Session
  const sessionId = uuidv4(); // Generate the ID
  sessions[sessionId] = {
    // Save the game state using that ID as the key
    id: sessionId,
    cases: cases,
    gameState: "PLAYING",
    selectedCase: 0,
  };

  // 4. Send response
  res.json({ sessionId });
  // console.log("Created session:", sessionId); // Debug
};

exports.getSession = (req, res) => {
  const sessionId = req.query.id;
  const currentSession = sessions[sessionId];

  if (!currentSession) {
    return res.status(404).json({ error: "Session not found" });
  }

  const revealedCases = currentSession.cases.filter((c) => c.opened === true);

  res.json({
    id: currentSession.id,
    gameState: currentSession.gameState,
    openedCases: revealedCases,
    selectedCase: currentSession.selectedCase,
  });
};

exports.updateSelectedCase = (req, res) => {
  const sessionId = req.body.sessionId;
  const currentSession = sessions[sessionId];
  const caseNumber = req.body.caseNumber;
  currentSession.selectedCase = caseNumber;
  currentSession.gameState = "PLAYING";
  res.status(200).send();
};

exports.getCurrentSession = (sessionId) => {
  const currentSession = sessions[sessionId];
  return currentSession;
};

exports.getBankerOffer = async (sessionId) => {
  const session = sessions[sessionId];
  if (!session) return null;

  const remainingValues = session.cases
    .filter((c) => !c.opened) // Fixed: using 'opened' property instead of 'isOpened' to match Create Cases
    .map((c) => c.value);

  const average =
    remainingValues.reduce((a, b) => a + b, 0) / remainingValues.length;

  // Determining Banker's aggression
  const roundNumber = session.cases.filter((c) => c.opened).length; // Calculate revealed count
  let percentage = 0.15;
  if (roundNumber >= 11) percentage = 0.4;
  if (roundNumber >= 18) percentage = 0.75;
  if (roundNumber >= 22) percentage = 0.95; // Final round generosity

  const baseOffer = Math.floor(average * percentage);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-1b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are the Banker from Deal or No Deal. Your goal is to convince the player to take a deal. Respond ONLY with a valid JSON object containing 'offer' (number) and 'message' (string).",
          },
          {
            role: "user",
            content: `Remaining case values: ${remainingValues.join(", ")}. Average: $${average.toFixed(0)}. Suggested offer around: $${baseOffer}. 
Respond with JSON: {"offer": <your_offer_number>, "message": "<your_persuasive_message>"}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
          "X-Title": "Deal or No Deal Game",
        },
      },
    );

    // OpenRouter returns the content as a string, we parse it
    const aiResult = JSON.parse(response.data.choices[0].message.content);

    session.bankOffer = aiResult.offer;
    return aiResult;
  } catch (error) {
    console.error("Gemma API Error:", error.message);
    // Safety fallback if the free model is rate-limited
    return {
      offer: baseOffer,
      message: "This is my final offer. Take it or leave it.",
    };
  }
};

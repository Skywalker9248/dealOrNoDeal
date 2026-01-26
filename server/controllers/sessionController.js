const { v4: uuidv4 } = require("uuid");

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

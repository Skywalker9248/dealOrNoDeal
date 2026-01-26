import styled, { keyframes } from "styled-components";
import { useGameContext } from "../../../context/gameContext";

interface GameEndModalProps {
  isVisible?: boolean;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  const { gameEndWinnings, gameEndType, selectedCaseValue, restartGame } =
    useGameContext();

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getMessage = () => {
    if (gameEndType === "deal_accepted") {
      return "You took the deal!";
    }
    return "You opened all the cases!";
  };

  const getSubMessage = () => {
    if (gameEndType === "deal_accepted" && selectedCaseValue !== null) {
      return `Your case contained: ${formatAmount(selectedCaseValue)}`;
    }
    return "This was inside your case";
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ConfettiContainer>
          {[...Array(20)].map((_, i) => (
            <Confetti key={i} $delay={i * 0.1} $left={Math.random() * 100} />
          ))}
        </ConfettiContainer>

        <Title>🎉 Congratulations! 🎉</Title>
        <SubTitle>{getMessage()}</SubTitle>

        <WinningsContainer>
          <WinningsLabel>You Won</WinningsLabel>
          <WinningsAmount>{formatAmount(gameEndWinnings)}</WinningsAmount>
        </WinningsContainer>

        {gameEndType === "deal_accepted" && selectedCaseValue !== null && (
          <CaseReveal>
            <CaseRevealText>{getSubMessage()}</CaseRevealText>
          </CaseReveal>
        )}

        <StartAgainButton onClick={restartGame}>Play Again</StartAgainButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default GameEndModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const confettiAnimation = keyframes`
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Confetti = styled.div<{ $delay: number; $left: number }>`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${() => {
    const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];
    return colors[Math.floor(Math.random() * colors.length)];
  }};
  left: ${(props) => props.$left}%;
  animation: ${confettiAnimation} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;
`;

const ModalContainer = styled.div`
  position: relative;
  background: linear-gradient(180deg, #1a3a5c 0%, #0d2840 50%, #061a2e 100%);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 40px 60px;
  text-align: center;
  box-shadow:
    0 0 50px rgba(255, 215, 0, 0.3),
    0 0 100px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 400px;
  max-width: 500px;
`;

const Title = styled.h1`
  color: #ffd700;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

const SubTitle = styled.p`
  color: #b0c4de;
  font-size: 1.2rem;
  margin: 0 0 25px 0;
`;

const WinningsContainer = styled.div`
  background: linear-gradient(180deg, #2a5a8a 0%, #1a3a5c 100%);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
`;

const WinningsLabel = styled.p`
  color: #b0c4de;
  font-size: 1rem;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const pulseGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5),
                 0 0 20px rgba(255, 215, 0, 0.3),
                 0 0 30px rgba(255, 215, 0, 0.1);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8),
                 0 0 40px rgba(255, 215, 0, 0.5),
                 0 0 60px rgba(255, 215, 0, 0.3);
  }
`;

const WinningsAmount = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: #ffd700;
  font-family: "Arial Black", sans-serif;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const CaseReveal = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 25px;
`;

const CaseRevealText = styled.p`
  color: #87ceeb;
  font-size: 1.1rem;
  margin: 0;
  font-style: italic;
`;

const StartAgainButton = styled.button`
  padding: 15px 50px;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(180deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  box-shadow:
    0 4px 0 #1b5e20,
    0 6px 15px rgba(0, 0, 0, 0.4);

  &:hover {
    background: linear-gradient(180deg, #66bb6a 0%, #43a047 100%);
    transform: translateY(-3px);
    box-shadow:
      0 7px 0 #1b5e20,
      0 10px 20px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 #1b5e20,
      0 3px 5px rgba(0, 0, 0, 0.4);
  }
`;

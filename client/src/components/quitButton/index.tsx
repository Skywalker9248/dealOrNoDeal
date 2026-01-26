import styled from "styled-components";
import { useGameContext } from "../../../context/gameContext";

const QuitButton: React.FC = () => {
  const { selectedCase, restartGame } = useGameContext();

  // Only show when a case has been selected (game is in progress)
  if (!selectedCase || selectedCase === 0) return null;

  return (
    <QuitButtonContainer>
      <StyledQuitButton onClick={restartGame}>✕ Quit</StyledQuitButton>
    </QuitButtonContainer>
  );
};

export default QuitButton;

const QuitButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const StyledQuitButton = styled.button`
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    border-color: #f44336;
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

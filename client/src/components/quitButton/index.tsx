import styled from "styled-components";
import { useGameContext } from "../../../context/gameContext";
import { GAME_STATE } from "../../../helpers/constants";

const QuitButton: React.FC = () => {
  const { gameState, restartGame } = useGameContext();

  // Only show during PLAYING state
  if (gameState !== GAME_STATE.PLAYING) return null;

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
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.8);
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

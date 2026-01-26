import styled from "styled-components";
import { useGameContext } from "../../../hooks/useGameContext";

const SelectedCaseDisplay: React.FC = () => {
  const { selectedCase } = useGameContext();

  if (!selectedCase || selectedCase === 0) return null;

  return (
    <SelectedCaseContainer>
      <SelectedCaseLabel>Your Case</SelectedCaseLabel>
      <CaseBox>
        <Handle />
        <LatchLeft />
        <LatchRight />
        <CaseNumber>{selectedCase}</CaseNumber>
      </CaseBox>
    </SelectedCaseContainer>
  );
};

export default SelectedCaseDisplay;

const SelectedCaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
`;

const SelectedCaseLabel = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
`;

const CaseBox = styled.div`
  width: 120px;
  aspect-ratio: 1.4;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 4px
    ),
    linear-gradient(180deg, #4a5a6a 0%, #2c3e50 40%, #1a2a3a 100%);
  border: 4px solid #ffd700;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  position: relative;
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.6),
    inset 0 0 10px rgba(0, 0, 0, 0.8),
    0 4px 6px rgba(0, 0, 0, 0.5);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    pointer-events: none;
  }
`;

const Handle = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 10px;
  background: linear-gradient(to bottom, #d0d0d0, #909090);
  border-radius: 4px 4px 0 0;
  border: 2px solid #555;
  border-bottom: none;
  z-index: 0;
`;

const LatchLeft = styled.div`
  position: absolute;
  top: 8px;
  left: 10%;
  width: 8px;
  height: 12px;
  background: linear-gradient(to bottom, #fff, #999);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const LatchRight = styled.div`
  position: absolute;
  top: 8px;
  right: 10%;
  width: 8px;
  height: 12px;
  background: linear-gradient(to bottom, #fff, #999);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const CaseNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-family: "Arial Black", "Arial", sans-serif;
  z-index: 1;
`;

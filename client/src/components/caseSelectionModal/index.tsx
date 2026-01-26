import styled from "styled-components";
import { useGameContext } from "../../../hooks/useGameContext";
import { sessionApi } from "../../api";

const CaseSelectionModal: React.FC = () => {
  const { showSelectCaseModal, updateShowSelectCaseModal, updateSelectedCase } =
    useGameContext();

  const cases = Array.from({ length: 26 }, (_, i) => i + 1);

  const updateSelectedCaseInServer = async (caseNumber: number) => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      console.error("No session ID found");
      return;
    }
    try {
      await sessionApi.updateSelectedCase(sessionId, caseNumber);
    } catch (error) {
      console.error("Error updating selected case:", error);
    }
  };

  const handleSelectCase = async (caseNumber: number) => {
    await updateSelectedCaseInServer(caseNumber);
    updateSelectedCase(caseNumber);
    updateShowSelectCaseModal(false);
  };

  if (!showSelectCaseModal) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>Choose Your Case</Title>
        <Subtitle>Select a case from 1 to 26</Subtitle>
        <CaseGrid>
          {cases.map((caseNumber) => (
            <CaseButton
              key={caseNumber}
              onClick={() => handleSelectCase(caseNumber)}
            >
              {caseNumber}
            </CaseButton>
          ))}
        </CaseGrid>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CaseSelectionModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: linear-gradient(180deg, #1a3a5c 0%, #0d2840 50%, #061a2e 100%);
  border: 3px solid #2a5a8a;
  border-radius: 16px;
  padding: 30px 40px;
  text-align: center;
  box-shadow:
    0 0 40px rgba(0, 100, 200, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 90%;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 3px;
  margin: 0 0 25px 0;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled.p`
  color: #a0c4e8;
  font-size: 1rem;
  margin: 0 0 20px 0;
  letter-spacing: 1px;
`;

const CaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
`;

const CaseButton = styled.button`
  background: linear-gradient(180deg, #2a5a8a 0%, #1a3a5c 100%);
  border: 2px solid #3a7aba;
  border-radius: 8px;
  color: #ffd700;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 15px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    0 4px 0 #0d2840,
    0 6px 10px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

  &:hover {
    background: linear-gradient(180deg, #3a7aba 0%, #2a5a8a 100%);
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 #0d2840,
      0 8px 15px rgba(0, 0, 0, 0.3);
    border-color: #5a9ada;
  }

  &:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 #0d2840,
      0 3px 5px rgba(0, 0, 0, 0.3);
  }
`;

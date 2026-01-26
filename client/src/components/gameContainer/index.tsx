import styled from "styled-components";
import SilverTower from "../silverTower";
import GoldTower from "../goldTower";
import CaseBoard from "../caseBoard";
import BankerModal from "../bankerModal";
import { useGameContext } from "../../../hooks/useGameContext";
import CaseSelectionModal from "../caseSelectionModal";

const GameContainer = () => {
  const { showBankerModal } = useGameContext();
  const bankerOffer = 163000;

  return (
    <GameWrapper>
      <LeftPanel>
        <SilverTower />
      </LeftPanel>

      <CenterPanel>
        <CaseBoard />
        <PhoneIcon title="Call the Banker" />
        <CaseSelectionModal />
        {showBankerModal && (
          <BankerModal
            offer={bankerOffer}
            onDeal={() => console.log("Deal accepted!")}
            onNoDeal={() => console.log("No deal!")}
          />
        )}
      </CenterPanel>

      <RightPanel>
        <GoldTower />
      </RightPanel>
    </GameWrapper>
  );
};

export default GameContainer;

const GameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  padding: 10px 0;
  box-sizing: border-box;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 20vw;
  padding-left: 10px;
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 1;
  max-width: 600px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 20vw;
  padding-right: 10px;
`;

const PhoneIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(180deg, #3a3a4a 0%, #2a2a3a 100%);
  border: 2px solid #4a4a5a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: linear-gradient(180deg, #4a4a5a 0%, #3a3a4a 100%);
    box-shadow: 0 0 15px rgba(255, 200, 0, 0.3);
  }

  &::before {
    content: "📞";
    font-size: 24px;
  }
`;

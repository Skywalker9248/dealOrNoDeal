import styled from "styled-components";
import SilverTower from "../silverTower";
import GoldTower from "../goldTower";
import CaseBoard from "../caseBoard";
import BankerModal from "../bankerModal";
import { useGameContext } from "../../../hooks/useGameContext";
import CaseSelectionModal from "../caseSelectionModal";
import SelectedCaseDisplay from "../selectedCaseDisplay";

const GameContainer = () => {
  const { showBankerModal, bankOffer } = useGameContext();

  return (
    <GameWrapper>
      <LeftPanel>
        <SilverTower />
      </LeftPanel>

      <CenterPanel>
        <CaseBoard />
        <CaseSelectionModal />
        {showBankerModal && <BankerModal offer={bankOffer} />}
        <SelectedCaseDisplay />
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

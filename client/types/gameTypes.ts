type gameContextType = {
  selectedCase: number;
  openedCases: number[];
  bankOffer: number;
  gameState: string;
  showSelectCaseModal: boolean;
  showBankerModal: boolean;
  updateBankOffer: (newOffer: number) => void;
  updateSelectedCase: (newCase: number) => void;
  updateOpenedCases: (newCases: number[]) => void;
  updateGameState: (newGameState: string) => void;
  updateShowSelectCaseModal: (newShowSelectCaseModal: boolean) => void;
  updateShowBankerModal: (newShowBankerModal: boolean) => void;
};

export type { gameContextType };
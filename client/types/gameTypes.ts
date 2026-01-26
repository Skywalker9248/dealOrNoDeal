type gameContextType = {
  selectedCase: number;
  openedCases: number[];
  caseValues: Map<number, number>;
  recentlyOpenedCase: number | null;
  bankOffer: number;
  bankOfferMessage: string;
  gameState: string;
  showSelectCaseModal: boolean;
  showBankerModal: boolean;
  bankerLoading: boolean;
  showGameEndModal: boolean;
  gameEndWinnings: number;
  gameEndType: 'deal_accepted' | 'all_opened' | null;
  selectedCaseValue: number | null;
  updateBankOffer: (newOffer: number) => void;
  updateSelectedCase: (newCase: number) => void;
  updateOpenedCases: (newCases: number[]) => void;
  updateGameState: (newGameState: string) => void;
  updateShowSelectCaseModal: (newShowSelectCaseModal: boolean) => void;
  updateShowBankerModal: (newShowBankerModal: boolean) => void;
  openCase: (caseNumber: number) => void;
  acceptDeal: () => void;
  restartGame: () => void;
};

export type { gameContextType };
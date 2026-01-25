type gameContextType = {
  selectedCase: number;
  openedCases: number[];
  bankOffer: number;
  updateBankOffer: (newOffer: number) => void;
  updateSelectedCase: (newCase: number) => void;
  updateOpenedCases: (newCases: number[]) => void;
};

export type { gameContextType };
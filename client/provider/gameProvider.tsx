import { GameContext } from "../context/gameContext";
import { useState } from "react";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const [openedCases, setOpenedCases] = useState<number[]>([]);
  const [bankOffer, setBankOffer] = useState<number>(0);

  const updateBankOffer = (newOffer: number) => {
    setBankOffer(newOffer);
  };

  const updateSelectedCase = (newCase: number) => {
    setSelectedCase(newCase);
  };

  const updateOpenedCases = (newCases: number[]) => {
    setOpenedCases(newCases);
  };

  return (
    <GameContext.Provider
      value={{
        selectedCase,
        openedCases,
        bankOffer,
        updateBankOffer,
        updateSelectedCase,
        updateOpenedCases,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

import { createContext, useContext } from "react";
import type { gameContextType } from "../types/gameTypes";

const GameContext = createContext<gameContextType | undefined>(undefined);

const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
      throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
  };

export { GameContext, useGameContext };
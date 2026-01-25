import { useContext } from "react";
import { GameContext } from "../context/gameContext";
import type { gameContextType } from "../types/gameTypes";

export const useGameContext = () => {
  const context = useContext(GameContext) as gameContextType;
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

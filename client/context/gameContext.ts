import { createContext } from "react";
import type { gameContextType } from "../types/gameTypes";

const GameContext = createContext<gameContextType | undefined>(undefined);

export { GameContext };
import { GameContext } from "../context/gameContext";
import { useEffect, useState } from "react";
import { sessionApi } from "../src/api";
import { GAME_STATE } from "../helpers/constants";
import { transformSessionData } from "../helpers/utils";
import Loader from "../src/components/loader";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<string>(GAME_STATE.NEW_GAME);
  const [showSelectCaseModal, setShowSelectCaseModal] =
    useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const [openedCases, setOpenedCases] = useState<number[]>([]);
  const [bankOffer, setBankOffer] = useState<number>(0);
  const [showBankerModal, setShowBankerModal] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const updateExistingSession = (sessionData: any) => {
    setGameState(sessionData.gameState);
    setSelectedCase(sessionData.selectedCase);
    setOpenedCases(sessionData.openedCases);
  };

  const createNewSession = async () => {
    try {
      const sessionData = await sessionApi.createSession();
      sessionStorage.setItem("sessionId", sessionData.data.sessionId);
      setShowSelectCaseModal(true);
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    setShowLoader(true);
    const getSession = async () => {
      const sessionStorageSessionId = sessionStorage.getItem("sessionId");
      if (sessionStorageSessionId) {
        //get session data from api
        try {
          const sessionData = await sessionApi.getSession(
            sessionStorageSessionId,
          );
          const transformedSessionData = transformSessionData(sessionData);
          if (
            !transformedSessionData ||
            !transformedSessionData.gameState ||
            !transformedSessionData.selectedCase ||
            !transformedSessionData.openedCases
          ) {
            await createNewSession();
            return;
          } else {
            updateExistingSession(transformedSessionData);
          }
        } catch (error) {
          console.error("Error fetching session data:", error);
        } finally {
          setShowLoader(false);
        }
      } else {
        //create new session
        await createNewSession();
      }
    };
    getSession();
  }, []);

  const updateBankOffer = (newOffer: number) => {
    setBankOffer(newOffer);
  };

  const updateSelectedCase = (newCase: number) => {
    setSelectedCase(newCase);
  };

  const updateOpenedCases = (newCases: number[]) => {
    setOpenedCases(newCases);
  };

  const updateGameState = (newGameState: string) => {
    setGameState(newGameState);
  };

  const updateShowSelectCaseModal = (newShowSelectCaseModal: boolean) => {
    setShowSelectCaseModal(newShowSelectCaseModal);
  };

  const updateShowBankerModal = (newShowBankerModal: boolean) => {
    setShowBankerModal(newShowBankerModal);
  };

  return (
    <GameContext.Provider
      value={{
        selectedCase,
        openedCases,
        bankOffer,
        gameState,
        showSelectCaseModal,
        showBankerModal,
        updateBankOffer,
        updateSelectedCase,
        updateOpenedCases,
        updateGameState,
        updateShowSelectCaseModal,
        updateShowBankerModal,
      }}
    >
      {showLoader && <Loader />}
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

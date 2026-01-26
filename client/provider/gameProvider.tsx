import { GameContext } from "../context/gameContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { sessionApi } from "../src/api";
import { BANKER_OFFER_TRIGGERS, GAME_STATE } from "../helpers/constants";
import { transformSessionData } from "../helpers/utils";
import Loader from "../src/components/loader";
import {
  joinSession,
  leaveSession,
  emitCaseOpened,
  onCaseOpened,
  offCaseOpened,
  disconnectSocket,
  socket,
} from "../src/socket";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<string>(GAME_STATE.NEW_GAME);
  const [showSelectCaseModal, setShowSelectCaseModal] =
    useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const [openedCases, setOpenedCases] = useState<number[]>([]);
  const [caseValues, setCaseValues] = useState<Map<number, number>>(new Map());
  const [recentlyOpenedCase, setRecentlyOpenedCase] = useState<number | null>(
    null,
  );
  const [bankOffer, setBankOffer] = useState<number>(0);
  const [bankOfferMessage, setBankOfferMessage] = useState<string>("");
  const [showBankerModal, setShowBankerModal] = useState<boolean>(false);
  const [bankerLoading, setBankerLoading] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const updateExistingSession = (sessionData: any) => {
    setGameState(GAME_STATE.PLAYING);
    setSelectedCase(sessionData.selectedCase);
    setOpenedCases(sessionData.openedCases);
    if (sessionData.caseValues) {
      setCaseValues(sessionData.caseValues);
    }
  };

  const createNewSession = async () => {
    try {
      const sessionData = await sessionApi.createSession();
      const newSessionId = sessionData.data.sessionId;
      sessionStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
      setShowSelectCaseModal(true);
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setShowLoader(false);
    }
  };

  // Initialize session
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
            !transformedSessionData.openedCases ||
            !transformedSessionData.caseValues
          ) {
            await createNewSession();
            return;
          } else {
            setSessionId(sessionStorageSessionId);
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

  const openedCasesRef = useRef<number[]>([]);

  useEffect(() => {
    openedCasesRef.current = openedCases;
  }, [openedCases]);

  // Socket connection and listeners
  useEffect(() => {
    if (!sessionId) return;

    // Join the session channel
    joinSession(sessionId);

    // Listen for case opened events from the server
    onCaseOpened((updatedSession: any) => {
      console.log("[Socket] Received case_opened event:", updatedSession);
      if (updatedSession && updatedSession.cases) {
        // Extract opened case numbers and values from the cases array
        const openedCasesData = updatedSession.cases.filter(
          (c: any) => c.opened === true,
        );
        const openedCaseNumbers = openedCasesData.map((c: any) => c.caseNumber);

        // Build case values map
        const newCaseValues = new Map<number, number>();
        openedCasesData.forEach((c: any) => {
          newCaseValues.set(c.caseNumber, c.value);
        });

        // Find the newly opened case (the one that wasn't in openedCases before)
        const newlyOpened = openedCaseNumbers.find(
          (num: number) => !openedCasesRef.current.includes(num),
        );

        if (newlyOpened) {
          setRecentlyOpenedCase(newlyOpened);
          // Clear recently opened case after 10 seconds
          setTimeout(() => {
            setRecentlyOpenedCase(null);
          }, 10000);

          // Check for Banker Offer Triggers logic (only on NEW opens)
          if (BANKER_OFFER_TRIGGERS.includes(openedCaseNumbers.length)) {
            setBankerLoading(true);
            socket.emit("request_banker_offer", { sessionId });
            setTimeout(() => {
              setShowBankerModal(true);
            }, 150);
          }
        }

        setOpenedCases(openedCaseNumbers);
        setCaseValues(newCaseValues);
      }
    });

    socket.on("banker_called", (offerData: any) => {
      console.log("[Socket] Received banker_called event:", offerData);
      setBankOffer(offerData.offer);
      setBankOfferMessage(offerData.message);
      setBankerLoading(false);
    });

    // Cleanup on unmount or sessionId change
    return () => {
      leaveSession(sessionId);
      offCaseOpened();
      disconnectSocket();
    };
  }, [sessionId]);

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

  // Open a case by emitting socket event
  const openCase = useCallback(
    (caseNumber: number) => {
      if (!sessionId) {
        console.error("[Socket] Cannot open case: no session ID");
        return;
      }
      if (openedCases.includes(caseNumber)) {
        console.log("[Socket] Case already opened:", caseNumber);
        return;
      }
      emitCaseOpened(sessionId, caseNumber);
    },
    [sessionId, openedCases],
  );

  return (
    <GameContext.Provider
      value={{
        selectedCase,
        openedCases,
        caseValues,
        recentlyOpenedCase,
        bankOffer,
        bankOfferMessage,
        gameState,
        showSelectCaseModal,
        showBankerModal,
        bankerLoading,
        updateBankOffer,
        updateSelectedCase,
        updateOpenedCases,
        updateGameState,
        updateShowSelectCaseModal,
        updateShowBankerModal,
        openCase,
      }}
    >
      {showLoader && <Loader />}
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

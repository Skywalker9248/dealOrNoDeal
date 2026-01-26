const transformSessionData = (sessionData: any) => {
  return {
    selectedCase: sessionData.selectedCase,
    openedCases: sessionData.openedCases,
    gameState: sessionData.gameState,
  };
};

export { transformSessionData };

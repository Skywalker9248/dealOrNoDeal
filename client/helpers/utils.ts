const transformSessionData = (sessionData: any) => {
  const data = sessionData.data;
  return {
    selectedCase: data.selectedCase,
    openedCases: data.openedCases?.map((c: any) => c.caseNumber) || [],
    gameState: data.gameState,
  };
};

export { transformSessionData };

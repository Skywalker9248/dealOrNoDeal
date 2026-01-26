const transformSessionData = (sessionData: any) => {
  const data = sessionData.data;
  
  const openedCasesData = data.openedCases || [];
  const caseValues = new Map<number, number>();
  
  openedCasesData.forEach((c: any) => {
    caseValues.set(c.caseNumber, c.value);
  });

  return {
    selectedCase: data.selectedCase,
    openedCases: openedCasesData.map((c: any) => c.caseNumber),
    caseValues: caseValues,
    gameState: data.gameState,
  };
};

export { transformSessionData };

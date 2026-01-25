import styled from "styled-components";

const CaseBoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 15px;
  max-width: 550px;
  margin: 0 auto;
`;

const CaseBox = styled.div<{ $isSelected?: boolean; $isOpened?: boolean }>`
  aspect-ratio: 1.1;
  background: linear-gradient(
    180deg,
    #4a4a4a 0%,
    #3a3a3a 20%,
    #2a2a2a 50%,
    #1a1a1a 80%,
    #252525 100%
  );
  border: 2px solid #1a1a1a;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.15s ease;

  /* Top highlight edge */
  &::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 4px;
    right: 4px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    border-radius: 2px;
  }

  /* Bottom shadow edge */
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 4px;
    right: 4px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.3),
      transparent
    );
    border-radius: 2px;
  }

  &:hover {
    background: linear-gradient(
      180deg,
      #555555 0%,
      #454545 20%,
      #353535 50%,
      #252525 80%,
      #303030 100%
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    border-color: #2d5a2d;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      0 0 8px rgba(0, 255, 0, 0.2),
      0 2px 4px rgba(0, 0, 0, 0.5);
  `}

  ${({ $isOpened }) =>
    $isOpened &&
    `
    opacity: 0.5;
    cursor: default;
    &:hover {
      background: linear-gradient(
        180deg,
        #4a4a4a 0%,
        #3a3a3a 20%,
        #2a2a2a 50%,
        #1a1a1a 80%,
        #252525 100%
      );
    }
  `}
`;

const CaseNumber = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #b0b0b0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-family: "Arial", sans-serif;
`;

const CaseValue = styled.span`
  font-size: 0.7rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
  margin-top: 2px;
`;

interface CaseBoardProps {
  selectedCase?: number;
  openedCases?: number[];
  caseValues?: Map<number, number>;
  onCaseClick?: (caseNumber: number) => void;
}

const CaseBoard: React.FC<CaseBoardProps> = ({
  selectedCase,
  openedCases = [],
  caseValues,
  onCaseClick,
}) => {
  const cases = Array.from({ length: 26 }, (_, i) => i + 1);

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <CaseBoardContainer>
      {cases.map((caseNumber) => {
        const isOpened = openedCases.includes(caseNumber);
        const isSelected = selectedCase === caseNumber;
        const value = caseValues?.get(caseNumber);

        return (
          <CaseBox
            key={caseNumber}
            $isSelected={isSelected}
            $isOpened={isOpened}
            onClick={() => onCaseClick?.(caseNumber)}
          >
            <CaseNumber>{caseNumber}</CaseNumber>
            {isOpened && value !== undefined && (
              <CaseValue>{formatValue(value)}</CaseValue>
            )}
          </CaseBox>
        );
      })}
    </CaseBoardContainer>
  );
};

export default CaseBoard;

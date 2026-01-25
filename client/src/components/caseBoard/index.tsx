import styled from "styled-components";

const CaseBoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const CaseBox = styled.div<{ $isSelected?: boolean; $isOpened?: boolean }>`
  aspect-ratio: 1.4; /* More rectangular */
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 4px
    ),
    linear-gradient(
      180deg,
      #4a5a6a 0%,
      /* Blue-ish grey top */ #2c3e50 40%,
      /* Darker middle */ #1a2a3a 100% /* Darkest bottom */
    );
  border: 4px solid #c0c0c0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  cursor: pointer;
  position: relative;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.8),
    /* Inner depth */ 0 4px 6px rgba(0, 0, 0, 0.5); /* Outer drop shadow */
  transition: all 0.15s ease;

  /* Metallic Border Highlight */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px; /* Slightly smaller radius than parent */
    pointer-events: none;
  }

  /* Handle */
  &::after {
    content: "";
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 10px;
    background: linear-gradient(to bottom, #d0d0d0, #909090);
    border-radius: 4px 4px 0 0;
    border: 2px solid #555;
    border-bottom: none;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    border-color: #ffd700; /* Gold highlight for selection */
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  `}

  ${({ $isOpened }) =>
    $isOpened &&
    `
    opacity: 0.6;
    cursor: default;
    background: #111; /* Dark interior when open */
    border-color: #555;
    background-image: none;
    box-shadow: inset 0 0 20px #000;
  `}
`;

/* Latch (Left) */
const LatchLeft = styled.div`
  position: absolute;
  top: 8px;
  left: 10%;
  width: 8px;
  height: 12px;
  background: linear-gradient(to bottom, #fff, #999);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

/* Latch (Right) */
const LatchRight = styled.div`
  position: absolute;
  top: 8px;
  right: 10%;
  width: 8px;
  height: 12px;
  background: linear-gradient(to bottom, #fff, #999);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const CaseNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-family: "Arial Black", "Arial", sans-serif;
  z-index: 1;
`;

const CaseValue = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  margin-top: 5px;
  z-index: 1;
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
            <LatchLeft />
            <LatchRight />
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

import styled from "styled-components";
import { useGameContext } from "../../../context/gameContext";

const TowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%);
  padding: 10px 8px;
  border-radius: 8px;
  gap: 4px;
  width: 100%;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  height: 85vh;
  justify-content: space-evenly;
`;

interface PrizeRowProps {
  $isActive: boolean;
}

const PrizeRow = styled.div<PrizeRowProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 30px;
  min-width: 120px;
  border-radius: 12px;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  font-size: 12px;
  transition: all 0.3s ease;

  ${({ $isActive }) =>
    $isActive
      ? `
    background: linear-gradient(180deg, rgba(0, 80, 180, 0.4) 0%, rgba(0, 40, 100, 0.6) 100%);
    border: 2px solid #0088ff;
    box-shadow: 
      0 0 10px rgba(0, 136, 255, 0.5),
      inset 0 0 8px rgba(0, 136, 255, 0.3);
    color: #00ccff;
    text-shadow: 0 0 8px rgba(0, 200, 255, 0.8);
  `
      : `
    background: linear-gradient(180deg, rgba(40, 40, 50, 0.6) 0%, rgba(25, 25, 35, 0.8) 100%);
    border: 2px solid #3a3a4a;
    color: #8a8a9a;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  `}
`;

const SilverTower = () => {
  const { caseValues } = useGameContext();

  const silverPrizes = [
    0.1, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750,
  ];

  // Get all opened prize values from the caseValues map
  const openedPrizeValues = Array.from(caseValues.values());

  // A prize is active if it has NOT been opened (not in caseValues)
  const isPrizeActive = (prize: number) => !openedPrizeValues.includes(prize);

  return (
    <TowerContainer>
      {silverPrizes.map((prize, index) => (
        <PrizeRow key={index} $isActive={isPrizeActive(prize)}>
          ${prize < 1 ? prize.toFixed(2) : prize.toLocaleString()}
        </PrizeRow>
      ))}
    </TowerContainer>
  );
};

export default SilverTower;

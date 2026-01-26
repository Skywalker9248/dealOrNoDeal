import styled from "styled-components";

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
    background: linear-gradient(180deg, rgba(180, 140, 0, 0.4) 0%, rgba(120, 90, 0, 0.6) 100%);
    border: 2px solid #d4a818;
    box-shadow: 
      0 0 10px rgba(212, 168, 24, 0.5),
      inset 0 0 8px rgba(212, 168, 24, 0.3);
    color: #ffd700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
  `
      : `
    background: linear-gradient(180deg, rgba(40, 40, 50, 0.6) 0%, rgba(25, 25, 35, 0.8) 100%);
    border: 2px solid #3a3a4a;
    color: #8a8a9a;
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  `}
`;

const GoldTower = () => {
  const goldPrizes = [
    1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000,
    500000, 750000, 1000000,
  ];

  const activeThreshold = 500000;

  return (
    <TowerContainer>
      {goldPrizes.map((prize, index) => (
        <PrizeRow key={index} $isActive={prize <= activeThreshold}>
          ${prize.toLocaleString()}
        </PrizeRow>
      ))}
    </TowerContainer>
  );
};

export default GoldTower;

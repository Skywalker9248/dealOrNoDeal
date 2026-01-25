import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: linear-gradient(180deg, #1a3a5c 0%, #0d2840 50%, #061a2e 100%);
  border: 3px solid #2a5a8a;
  border-radius: 12px;
  padding: 30px 50px;
  text-align: center;
  box-shadow:
    0 0 30px rgba(0, 100, 200, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 350px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const OfferAmount = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.5);
  margin: 20px 0 30px 0;
  font-family: "Arial Black", sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button<{ $variant: "deal" | "noDeal" }>`
  padding: 12px 35px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 1px;

  ${({ $variant }) =>
    $variant === "deal"
      ? `
    background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    box-shadow: 
      0 4px 0 #1B5E20,
      0 6px 10px rgba(0, 0, 0, 0.3);
    
    &:hover {
      background: linear-gradient(180deg, #66BB6A 0%, #43A047 100%);
      transform: translateY(-2px);
      box-shadow: 
        0 6px 0 #1B5E20,
        0 8px 15px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: translateY(2px);
      box-shadow: 
        0 2px 0 #1B5E20,
        0 3px 5px rgba(0, 0, 0, 0.3);
    }
  `
      : `
    background: linear-gradient(180deg, #f44336 0%, #c62828 100%);
    color: white;
    box-shadow: 
      0 4px 0 #8B0000,
      0 6px 10px rgba(0, 0, 0, 0.3);
    
    &:hover {
      background: linear-gradient(180deg, #ef5350 0%, #e53935 100%);
      transform: translateY(-2px);
      box-shadow: 
        0 6px 0 #8B0000,
        0 8px 15px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: translateY(2px);
      box-shadow: 
        0 2px 0 #8B0000,
        0 3px 5px rgba(0, 0, 0, 0.3);
    }
  `}
`;

interface BankerModalProps {
  offer: number;
  onDeal: () => void;
  onNoDeal: () => void;
  isVisible?: boolean;
}

const BankerModal: React.FC<BankerModalProps> = ({
  offer,
  onDeal,
  onNoDeal,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  const formatOffer = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>The Banker's Offer</Title>
        <OfferAmount>{formatOffer(offer)}</OfferAmount>
        <ButtonContainer>
          <Button $variant="deal" onClick={onDeal}>
            Deal
          </Button>
          <Button $variant="noDeal" onClick={onNoDeal}>
            No Deal
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BankerModal;

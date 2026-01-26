import styled, { keyframes } from "styled-components";

const Loader = () => {
  return (
    <LoaderContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
      <LoadingText>Loading...</LoadingText>
    </LoaderContainer>
  );
};

export default Loader;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #e94560;
  border-right-color: #f39c12;
  animation: ${spin} 1s linear infinite;
  box-shadow:
    0 0 20px rgba(233, 69, 96, 0.4),
    inset 0 0 20px rgba(243, 156, 18, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #f39c12;
    border-left-color: #e94560;
    animation: ${spin} 0.8s linear infinite reverse;
  }

  &::after {
    content: "";
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    bottom: 16px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-bottom-color: #00d9ff;
    animation: ${spin} 1.2s linear infinite;
  }
`;

const LoadingText = styled.p`
  margin-top: 24px;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
`;

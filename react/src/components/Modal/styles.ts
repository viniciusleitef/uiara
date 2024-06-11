import styled from "styled-components";
import colors from "../../styles/colors";

export const ModalContainer = styled.div`
  position: fixed;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 70px 100px rgba(0, 0, 0, 0.1);
  min-height: 310px;
  min-width: 450px;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 40px;
  color: ${colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 24px;

  img {
    width: 44px;
    height: 44px;
    padding-top: 8px;
  }
`;

export const Developer = styled.p`
  font-size: 24px;
  color: ${colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 128px;

  img {
    width: 64px;
    height: 64px;
  }
`;

import styled from "styled-components";
import colors from "../../styles/colors";

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const ModalContent = styled.div`
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 70px 100px rgba(0, 0, 0, 0.1);
  min-height: 310px;
  max-height: 500px;
  min-width: 450px;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 30px;
  color: ${colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 12px 0;

  img {
    width: 44px;
    height: 44px;
    padding-top: 8px;
  }
`;

export const Developer = styled.p`
  font-size: 16px;
  color: ${colors.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 40px;

  img {
    width: 48px;
    height: 48px;
  }
`;

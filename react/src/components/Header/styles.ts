import styled from "styled-components";
import colors from "../../styles/colors";

export const HeaderContainer = styled.header`
  width: 100%;
  height: 85px;
  display: flex;
  flex-direction: column;
`;

export const BlueHeader = styled.div`
  background-color: ${colors.primary};
  height: 35px;
`;

export const WhiteHeader = styled.div`
  background-color: ${colors.white};
  height: 50px;

  > div {
    width: 100%;
    max-width: 1140px;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
    display: flex;
    align-items: center;

    @media (max-width: 1200px) {
      max-width: 960px;
    }

    @media (max-width: 992px) {
      max-width: 720px;
    }

    @media (max-width: 768px) {
      max-width: 540px;
    }

    @media (max-width: 576px) {
      width: 100%;
      padding: 0 15px;
    }
  }
`;

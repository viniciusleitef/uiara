import styled from "styled-components";
import colors from "../../styles/colors";

export const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const BlueHeader = styled.div`
  background-color: ${colors.primary};
  height: 15px;
`;

export const WhiteHeader = styled.div`
  background-color: ${colors.white};
  height: 50px;
  display: flex;
  flex-direction: row;

  > div {
    width: 100%;
    max-width: 1140px;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 3em;
    padding-right: 3em;



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
      img{
        width: 85px;
      }
    }
  }

  .logout-div {
    display: flex;
    justify-content: flex-end;
  }

  .confirmation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .5em;
  }

  button {
    background-color: ${colors.primary};
    color: ${colors.white};
    height: 30px;
    display: flex;
    justify-content: center;
    align-items:center;
    font-size: .8em;
    cursor: pointer;
    z-index: 20;
  }
`;

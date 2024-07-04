import styled from "styled-components";
import colors from "../../styles/colors";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  form {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.5em;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
      padding: 0.5em;
    }

    button {
      margin: 0.5em 0.5em 0 3em;
      background-color: ${colors.secondary};
      font-weight: bold;
      padding: 1em;
      cursor: pointer;
      display: flex;
      justify-content: center;
      position: relative;

      svg {
        position: absolute;
        left: 0.7em;
      }
    }
  }
`;

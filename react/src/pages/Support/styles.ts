import styled from "styled-components";
import colors from "../../styles/colors";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  form {
    height: 100%;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;

    button {
      margin-top: 1rem;
      width: 100%;
      background-color: ${colors.primary};
    }
  }
`;

import styled from "styled-components";
import colors from "../../styles/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  gap: 0.2em;
  cursor: pointer;

  &:hover {
    color: ${colors.secondary};
    svg {
      fill: ${colors.secondary};
    }
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  svg {
    width: 32px;
    height: 32px;
    transition: fill 0.3s;
  }
`;

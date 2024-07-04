import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  gap: 0.2em;

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

import styled from "styled-components";
import colors from "./colors";

export const StyledTextarea = styled.textarea`
  background-color: ${colors.white};
  padding: 15px 15px;
  border-radius: 6px;
  border: 1px solid ${colors.lightGray};
  width: 100%;
  color: ${colors.primary};
  font-weight: 600;
  font-size: 0.9em;
  resize: vertical; /* Permite redimensionar verticalmente */
  min-height: 100px; /* Altura mínima */
  line-height: 1.5;
`;

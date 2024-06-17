import styled from "styled-components";
import colors from "../../styles/colors";

export const BackPageContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px 8px;
  transition: background-color 0.3s;

  p {
    margin: 0;
  }

  &:hover {
    background-color: ${colors.secondary}10;
  }
`;

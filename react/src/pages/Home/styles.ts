import styled from "styled-components";
import colors from "../../styles/colors";

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const HomeButton = styled.button`
  background-color: ${colors.primary};
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

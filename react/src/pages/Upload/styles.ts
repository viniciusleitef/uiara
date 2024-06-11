import styled from "styled-components";
import colors from "../../styles/colors";

export const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  margin-top: 24px;

  p {
    color: ${colors.primary});  
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
  }
`;

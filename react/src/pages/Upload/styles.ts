import styled from "styled-components";
import colors from "../../styles/colors";

export const UploadContainer = styled.div`
  width: 100%;
  min-height: 285px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: 700;

  p {
    color: ${colors.primary});  
  }

  .upload {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
  }
`;

export const ButtonFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

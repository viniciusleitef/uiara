import styled from "styled-components";
import colors from "../../styles/colors";

export const PopUpContainer = styled.div`

  .popUp-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    }
    
  .popUp-content{
    position: relative;
    box-sizing: border-box;
    width: 500px;
    height: 300px;
    background-color: ${colors.white};
    border-radius: 10px;
    padding: 32px;
  }

  .button-box{
    position: absolute;
    width: 100%;  
    bottom: 20px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .button-delete{
    background-color: red;
    color: white;
  }
`;

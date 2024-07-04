import styled from "styled-components";
import colors from "../../styles/colors";

export const ResultAudio = styled.div`
  background-color: #eee;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin: 10px 0px;
  border-radius: 6px;
  justify-content: space-between;
  position: relative;

  .audio {
    display: flex;
    align-items: center;
    width: 40%;

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .classification {
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 5px 10px;
    color: ${colors.textWhite};
    position: absolute;
    left: 50%;
  }

  .classification.true {
    background-color: green;
  }

  .classification.false {
    background-color: red;
  }

  .accuracy {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: ${colors.textWhite};
    background-color: ${colors.secondary};
  }
`;

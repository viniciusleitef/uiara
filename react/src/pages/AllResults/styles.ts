import styled from "styled-components";
import colors from "../../styles/colors";

export const ResultsContainer = styled.div`
  overflow-y: auto;

  .teste {
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

  .teste-content {
    width: 500px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
  }

  .info-box {
    display: flex;
    justify-content: space-between;
  }

  .trash-icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 300ms;
  }

  .trash-icon-box:hover {
    color: blue;
  }

  .infos {
    display: flex;
    flex-direction: column;

    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 1rem;
    }

    p {
      font-size: 0.8rem;
    }
  }

  > div {
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    margin-bottom: 15px;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
`;

export const Audio = styled.div`
  background-color: #eee;
  display: flex;
  align-items: center;
  padding: 20px 15px;
  margin: 10px 0px;
  border-radius: 6px;
  justify-content: flex-start;
  position: relative;

  .audio {
    display: flex;
    align-items: center;
    width: 60%;
    overflow: hidden;
    margin-right: 10px;

    .audio-info {
      width: 100%;
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 95%;
      }

      p {
        margin: 0;
        font-size: 0.7rem;
      }
    }
  }

  .classification {
    background-color: #f5f5f5;
    border-radius: 6px;
    padding: 5px 10px;
    color: ${colors.textWhite};
    width: 100px;
    text-align: center;
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
    position: absolute;
    right: 10px;
  }
`;

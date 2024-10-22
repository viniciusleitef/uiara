import styled from "styled-components";
import colors from "../../styles/colors";

export const ResultsContainer = styled.div`
  overflow-y: auto;

  .search-bar{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    }
    
  .search-bar input{
    color: black;
    border: 2px solid #1b305a;
    border-radius: 10px;
    padding: 5px;
    background: unset;
  }

  .info-box {
    display: flex;
    justify-content: space-between;
  }

  .configs-buttons-box{
    display: flex;
    justify-content: flex;
    align-items: center;
    gap: 10px;
  }

  .icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 300ms;
  }

  .icon-box:hover {
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

   @media (max-width: 500px) {
    .info-box{
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
   }
`;

export const Audio = styled.div`
  background-color: #eee;
  border-radius: 6px;
  
  .audio-container {
    display: flex;
    align-items: center;
    padding: 20px 15px 0 15px;
    margin: 10px 0px 0px 0px;
    justify-content: flex-start;
    position: relative;
    gap: 10px;
  }

  .audio-container-result{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
    margin: 10px 0px 0px 0px;
    border-radius: 6px;
  }

  .audio {
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-right: 10px;

    .audio-info {
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

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
    text-align: center;
    margin-left: auto;
    margin-right: 15px;
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

  .audioPlayer{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px
  }

  .playerButton{
    margin: 10px
  }
  
  @media (max-width: 500px) {
    .audio-container{
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
      
    .audio-container-result{
      flex-direction: column;
      gap: 20px;
    }
  }

  .classification{
    margin: 0;
  }

  .audioPlayer{
    flex-direction: column;
  }
`;


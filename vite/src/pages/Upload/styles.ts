import styled from "styled-components";
import colors from "../../styles/colors";

export const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: 700;

  p {
    color: ${colors.primary};
  }

  .upload {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
  }
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  padding: 10px 10px 0 10px;
  
`;

export const LoadedAudioContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  margin-bottom: 20px;
  padding-right: 4px;
`;

export const LoadedAudio = styled.div`
  background-color: #eee;
  display: flex;
  align-items: center;
  margin: 10px 0;
  border-radius: 6px;

  p {
    margin-left: 10px;
  }
`;

export const ButtonFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

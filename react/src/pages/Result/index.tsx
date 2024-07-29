import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import audiosService from "../../app/services/audios";
import { ErrorAudio } from "../../types"
import { AudioProps } from "../../types";
import { AudioFile } from "@mui/icons-material";
import { BackPage } from "../../components/BackPage";
import { Audio } from "../AllResults/styles";
import { useLocation } from 'react-router-dom';''

export const Result = () => {
  const { numProcess } = useParams();
  const [audios, setAudios] = useState<AudioProps[]>([]);
  const location = useLocation();

  const { audioResponseData } = location.state || {};
  const hasErrors = audioResponseData && audioResponseData.errors && audioResponseData.errors.length > 0;

  useEffect(() => {
    const fetchAudios = async () => {
      console.log("numProcess", numProcess);
      const response = await audiosService.getAudios(Number(numProcess));
      if (response) {
        setAudios(response.data);
      }
    };
    fetchAudios();
  }, [numProcess]);

  return (
    <>
      <BackPage to="/results" />
      <div>
        <p>Número do Processo: #{numProcess}</p>
        {audios.map((audio, index) => (
          <Audio key={index}>
            <div className="audio">
              <AudioFile />
              <span>{audio.title}</span>
            </div>
            <div
              className={`classification ${
                audio.classification ? "true" : "false"
              }`}
            >
              {audio.classification ? "Verdadeiro" : "Falso"}
            </div>
            <div className="accuracy">{audio.accuracy}%</div>
          </Audio>
        ))}
      </div>
      
      {hasErrors && (
        <div className="error-container">
          {audioResponseData.errors.map((error: ErrorAudio, index: number) => (
            <div key={index}>
              <p> Erro ao carregar o arquivo: {error.file} -- {error.error}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
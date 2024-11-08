import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import audiosService from "../../app/services/audios";
import { ErrorAudio } from "../../types"
import { AudioProps } from "../../types";
import { AudioFile } from "@mui/icons-material";
import { BackPage } from "../../components/BackPage";
import { Audio} from "../AllResults/styles";
import { useLocation, useNavigate } from 'react-router-dom';''

export const Result = () => {
  const { numProcess } = useParams();
  const [audios, setAudios] = useState<AudioProps[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { audioResponseData } = location.state || {};
  const hasErrors = audioResponseData && audioResponseData.errors && audioResponseData.errors.length > 0;

  useEffect(() => {
    const fetchAudios = async () => {
      if (numProcess) { 
        console.log("numProcess", numProcess);
        try {
          const response = await audiosService.getAudios(numProcess);
          if (response) {
            setAudios(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar áudios:", error);
        }
      }
    };
    fetchAudios();
  }, [numProcess]);

  const formatProcessNumber = (numProcess: string): string => {
    console.log(numProcess);
    
    if (numProcess.length !== 20) {
      throw new Error('Número do processo deve conter exatamente 20 dígitos.');
    }

    const formatted = `${numProcess.slice(0, 7)}-${numProcess.slice(7, 9)}.${numProcess.slice(9, 13)}.${numProcess.slice(13, 14)}.${numProcess.slice(14, 16)}.${numProcess.slice(16, 20)}`;
  
    return formatted;
  };

  return (
    <>
      <BackPage to="/upload" />
      <div>
      <p>Número do Processo: #{numProcess ? formatProcessNumber(numProcess) : 'N/A'}</p>
        {audios.map((audio) => (
          <Audio key={audio.id}>
          <div className="audio-container-result"> 
            <div className="audio">
              <AudioFile />
              <div className="audio-info">
                <span>{audio.title}</span>
              </div>
            </div>

            <div
              className={`classification ${
                audio.classification ? "true" : "false"
              }`}
            >
              {audio.classification ? "Humano" : "Sintético"}
            </div>
            <div className="accuracy">{audio.accuracy}%</div>

          </div>
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
      <Audio>
        <div className="visualizar-processos" onClick={() => navigate('/results')}>
            <p>Visualizar processos</p>
        </div>
      </Audio>
    </>
  );
};
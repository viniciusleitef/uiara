import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import audiosService from "../../app/services/audios";
import { AudioProps } from "../../types";
import { ResultAudio } from "./styles";
import { AudioFile } from "@mui/icons-material";

export const Result = () => {
  const { numProcess } = useParams();
  const [audios, setAudios] = useState<AudioProps[]>([]);

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

  const extractFileName = (url: string) => {
    return url.split("/").pop();
  };

  return (
    <div>
      <p>Número do Processo: #{numProcess}</p>
      {audios.map((audio, index) => (
        <ResultAudio key={index}>
          <div className="audio">
            <AudioFile />
            <span>{extractFileName(audio.url)}</span>
          </div>
          <div
            className={`classification ${
              audio.classification ? "true" : "false"
            }`}
          >
            {audio.classification ? "Verdadeiro" : "Falso"}
          </div>
          <div className="accuracy">{(audio.accuracy * 100).toFixed(2)}%</div>
        </ResultAudio>
      ))}
    </div>
  );
};

import { useState, useEffect } from "react";
import { ProcessProps } from "../../types";
import audioService from "../../app/services/audios";
import { Audio, ResultsContainer } from "./styles";
import { AudioFile } from "@mui/icons-material";

export const AllResults = () => {
  const [processes, setProcesses] = useState<ProcessProps[]>([]);

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    try {
      const response = await audioService.getAllAudios();
      setProcesses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const extractFileName = (url: string) => {
    return url.split("/").pop();
  };

  return (
    <ResultsContainer>
      {processes.map((process) => (
        <div key={process.id}>
          <div className="infos">
            <h2>Processo #{process.num_process}</h2>
            <p>
              Responsável: {process.responsible} - Data de Criação:{" "}
              {process.date_of_creation}
            </p>
          </div>
          {process.audios.map((audio) => (
            <Audio key={audio.id}>
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
              <div className="accuracy">
                {(audio.accuracy * 100).toFixed(2)}%
              </div>
            </Audio>
          ))}
        </div>
      ))}
    </ResultsContainer>
  );
};

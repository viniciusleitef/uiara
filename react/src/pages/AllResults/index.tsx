import { useState, useEffect } from "react";
import { ProcessProps } from "../../types";
import audioService from "../../app/services/audios";
import { Audio, ResultsContainer } from "./styles";
import { AudioFile } from "@mui/icons-material";
import { BackPage } from "../../components/BackPage";
import CircularProgress from "@mui/material/CircularProgress";

export const AllResults = () => {
  const [processes, setProcesses] = useState<ProcessProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    setIsLoading(true);
    try {
      const response = await audioService.getAllAudios();
      setProcesses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackPage />
      <ResultsContainer>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          processes.map((process) => (
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
                    <span>{audio.title}</span>
                  </div>
                  <div
                    className={`classification ${
                      audio.classification ? "true" : "false"
                    }`}
                  >
                    {audio.classification ? "Verdadeiro" : "Falso"}
                  </div>
                  <div className="accuracy">
                    {(
                      (audio.classification
                        ? 1 - audio.accuracy
                        : audio.accuracy) * 100
                    ).toFixed(2)}
                    %
                  </div>
                </Audio>
              ))}
            </div>
          ))
        )}
      </ResultsContainer>
    </>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProcessProps } from "../../types";
import audioService from "../../app/services/audios";
import { Audio, ResultsContainer } from "./styles";
import { AudioFile } from "@mui/icons-material";
import { BackPage } from "../../components/BackPage";
import CircularProgress from "@mui/material/CircularProgress";
import { formatDuration } from "../../utils/formatDuration";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import processService from "../../app/services/process";
import { PopUp } from "../../components/PopUp";

export const AllResults = () => {
  const [processes, setProcesses] = useState<ProcessProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleDeleteClick = (num_process: string) => {
    setSelectedProcess(num_process);
    setPopupVisible(true);
  };

  const handleEditClick = (num_process: string) => {
    setSelectedProcess(num_process);
    const process = processes.find(p => p.num_process === num_process);
    if (process) {
      navigate('/upload', { state: { process } });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedProcess) {
      try {
        await processService.deleteProcess(selectedProcess);
        setProcesses((prevProcesses) =>
          prevProcesses.filter(
            (process) => process.num_process !== selectedProcess
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        handleClosePopup();
      }
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedProcess(null);
  };

  const formatProcessNumber = (numProcess: string): string => {
    if (numProcess.length !== 20) {
      throw new Error('Número do processo deve conter exatamente 20 dígitos.');
    }
    const formatted = `${numProcess.slice(0, 7)}-${numProcess.slice(7, 9)}.${numProcess.slice(9, 13)}.${numProcess.slice(13, 14)}.${numProcess.slice(14, 16)}.${numProcess.slice(16, 20)}`;
    return formatted;
  };

  return (
    <>
      <BackPage to="/home" />
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
              <div className="info-box">
                <div className="infos">
                  <h2>{process.title} #{formatProcessNumber(process.num_process)}</h2>
                  <p>
                    Responsável: {process.responsible} - Data de Criação:{" "}
                    {process.created_at}
                  </p>
                </div>

                <div className="configs-buttons-box">
                  <div 
                    className="icon-box"
                    onClick={() => handleEditClick(process.num_process)}
                  >
                    <MdOutlineEdit size={28}/>
                  </div>

                  <div
                    className="trash icon-box"
                    onClick={() => handleDeleteClick(process.num_process)}
                  >
                    <FaRegTrashAlt size={25} />
                  </div>
                </div>
              </div>
              {process.audios.map((audio) => (
                <Audio key={audio.id}>
                  <div className="audio">
                    <AudioFile />
                    <div className="audio-info">
                      <span>{audio.title}</span>
                      <p>Duração {formatDuration(audio.audio_duration)}</p>
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
                </Audio>
              ))}
            </div>
          ))
        )}
      </ResultsContainer>
      <PopUp
        visible={popupVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleClosePopup}
      />
    </>
  );
};

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
import { FaCloudDownloadAlt } from "react-icons/fa";
import processService from "../../app/services/process";
import pdfService from "../../app/services/pdf";
import { PopUp } from "../../components/PopUp";

export const AllResults = () => {
  const [processes, setProcesses] = useState<ProcessProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProcesses();
  }, []);

  const getProcesses = async () => {
    setIsLoading(true);
    try {
      const response = await audioService.getAllAudios();
      console.log(response.data);
      setProcesses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDownloadClick = async (num_process: string) => {
    setSelectedProcess(num_process);
    try {
      const response = await pdfService.getPdf(num_process);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `process_${num_process}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
  }
  }

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

  const formatDate = (dateString: string): string => {
    // Cria um objeto Date a partir da string recebida
    const date = new Date(dateString);
    
    // Extrai o ano, mês e dia
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
  
    // Retorna a data formatada no formato 'ano-mes-dia'
    return `${year}-${month}-${day}`;
  }

  const handlePlayClick = async (audioId: number) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
      setAudioURL(null); // Pausar o áudio
      return;
    }
  
    // Definindo o novo áudio a ser reproduzido
    const newAudioURL = `http://0.0.0.0:8302/audioFile/${audioId}`; // URL do back-end diretamente para streaming
    
    // Atualiza o ID do áudio que está sendo reproduzido e a URL do áudio
    setPlayingAudioId(audioId);
    setAudioURL(newAudioURL);
    console.log(newAudioURL);
  };

  const filteredProcesses = processes.filter(
    (process) =>
      process.num_process.includes(search)
  );

  return (
    <>
      <BackPage to="/home" />
      <ResultsContainer>
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar processo" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
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
          filteredProcesses.map((process) => (
            <div key={process.id}>
              <div className="info-box">
                <div className="infos">
                  <h2>{process.title} #{formatProcessNumber(process.num_process)}</h2>
                  <p>
                    Responsável: {process.responsible} - Data de Criação:{" "}
                    {formatDate(process.created_at)}
                  </p>
                </div>

                <div className="configs-buttons-box">

                  <div
                    title="Baixar PDF"
                    className="trash icon-box"
                    onClick={() => handleDownloadClick(process.num_process)}
                  >
                    <FaCloudDownloadAlt size={25}/>
                  </div>

                  <div 
                    title="Editar processo"
                    className="icon-box"
                    onClick={() => handleEditClick(process.num_process)}
                  >
                    <MdOutlineEdit size={28}/>
                  </div>

                  <div
                    title="Apagar Processo"
                    className="trash icon-box"
                    onClick={() => handleDeleteClick(process.num_process)}
                  >
                    <FaRegTrashAlt size={25} />
                  </div>
                  
                </div>
              </div>
              {process.audios.map((audio) => (
                <Audio key={audio.id}>
                  <div className="audio-container"> 
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

                  </div>

                  <div className="audioPlayer">
                    
                    <button onClick={() => handlePlayClick(audio.id)} className="playerButton">
                      {playingAudioId === audio.id ? 'Parar' : 'Reproduzir'}
                    </button>

                    {playingAudioId === audio.id && audioURL && (
                      <audio className="teste" src={audioURL} controls autoPlay preload=""/>
                        )}
                  </div>    
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

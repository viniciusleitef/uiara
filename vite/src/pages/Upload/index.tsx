import { ReactNode, useEffect, useState } from "react";
import {
  ButtonFooter,
  Fields,
  LoadedAudio,
  LoadedAudioContainer,
  UploadContainer,
} from "./styles";
import UploadIcon from "@mui/icons-material/Upload";
import { useLocation } from 'react-router-dom';
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProcessPayload } from "../../app/services/process/types";
import processService from "../../app/services/process";
import audioService from "../../app/services/audios";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BackPage } from "../../components/BackPage";
import { AudioProps } from "../../types";
import InputMask from 'react-input-mask';
import React from 'react';

export const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<AudioProps[]>([]);
  const [audiosToDelete, setAudiosToDelete] = useState<AudioProps[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [processNumber, setProcessNumber] = useState("");
  const [responsible, setResponsible] = useState("");
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { process } = location.state || {};

  useEffect(() => {
    if (process) {
      setProcessNumber(process.num_process);
      setResponsible(process.responsible);
      setTitle(process.title);
      setExistingFiles(process.audios);
    }
  }, [process]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
    setIsModified(true);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setIsModified(true);
  };

  const removeExistingFile = (id: number) => {
    if (process){
      const audio = existingFiles.find((file) => file.id === id);
      if (audio) {
        setAudiosToDelete((prevAudios) => [...prevAudios, audio]);
        setExistingFiles((prevFiles) => prevFiles.filter((audio) => audio.id !== id));
        setIsModified(true);
      } else {
        setErrorMessage(`Arquivo com ID ${id} não encontrado.`);
      }
    }
    setExistingFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setIsModified(true);
  };

  const checkIfProcessExists = async (processNumber: string) => {
    try {
      const response = await processService.getProcesses();
      const processes = response.data;
      return processes.some(
        (process: { num_process: string }) =>
          process.num_process === processNumber
      );
    } catch (error) {
      console.error("Error checking process number:", error);
      setErrorMessage("Erro ao verificar o número do processo");
      throw error;
    }
  };

  const cleanProcessNumber = (processNumber: string) => {
    return processNumber.replace(/\D/g, '');
  };

  const uploadAllFiles = async () => {
    
    const cleanedProcessNumber = cleanProcessNumber(processNumber);

    if (process){
      console.log(audiosToDelete)
      setIsUploading(true);
      let audioResponseData

      if (audiosToDelete.length > 0) {
        try {
          const deletePromises = audiosToDelete.map(audio => audioService.deleteAudio(audio.id));
          const audioResponses = await Promise.all(deletePromises);
          console.log(audioResponses)
        } catch (error) {
          console.error("Error deleting audio files:", error);
          setErrorMessage("Erro ao excluir os arquivos");
        }
      }
      
      if(files.length > 0){
        try {
          const formData = new FormData();
          formData.append('num_process', cleanedProcessNumber);
          files.forEach((file) => {
            formData.append('files', file);
          });
    
          const audioResponse = await audioService.postAudio(formData);
          audioResponseData = audioResponse.data
  
        } catch (error) {
          setErrorMessage("Erro ao enviar todos os arquivos");
        } finally {
          setIsUploading(false);
        }
      }

      processService.updateProcessTitle(process.num_process, title)
      navigate(`/result/${cleanedProcessNumber}`, { state: { audioResponseData } });
      setFiles([]);
      setTotalProgress(0);
      setErrorMessage("");

      return
    }

    if (!files.length || !cleanedProcessNumber || !responsible || !title) {
      setErrorMessage(
        "Todos os campos devem ser preenchidos e deve haver pelo menos um arquivo para enviar."
      );
      return;
    }


    setIsUploading(true);

    try {
      setErrorMessage("Carregando arquivos...");
      const processExists = await checkIfProcessExists(cleanedProcessNumber);
      if (processExists) {
        setErrorMessage("Um processo com este número já existe.");
        setIsUploading(false);
        return;
      }
      const processPayLoad: ProcessPayload = {
        title: title,
        num_process: cleanedProcessNumber,
        responsible: responsible,
      }

      await processService.postProcess(processPayLoad);

      const formData = new FormData();
      formData.append('num_process', cleanedProcessNumber);
      files.forEach((file) => {
        formData.append('files', file);
      });

      const audioResponse = await audioService.postAudio(formData);
      const audioResponseData = audioResponse.data

      navigate(`/result/${cleanedProcessNumber}`, { state: { audioResponseData } });
      setFiles([]);
      setTotalProgress(0);
      setErrorMessage("");
    } catch {
      setErrorMessage("Erro ao enviar todos os arquivos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProcessNumber(cleanProcessNumber(e.target.value));
  };

  return (
    <>
      <BackPage />
      <UploadContainer>
        <Fields>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
          <InputMask
              mask="9999999-99.9999.9.99.9999"
              value={processNumber}
              onChange={handleChange}
              disabled={process}
            >
              {((inputProps: any): ReactNode => (
                <TextField
                  {...inputProps}
                  label="Número do Processo"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={process}
                />
              ))as unknown as ReactNode}
            </InputMask>
            
            <TextField
              label="Responsável"
              variant="outlined"
              fullWidth
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              disabled={process}
            />
          </Box>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsModified(true);
            }}
          />
        </Fields>

        <div className="upload">
          <p>Insira o áudio para análise</p>
          <input
            type="file"
            accept="audio/*"
            id="file-upload"
            hidden
            multiple
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              disabled={isUploading}
            >
              Upload
            </Button>
          </label>
          
          {isUploading && (
            <Box mt={2} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
        </div>

        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
        
        {(existingFiles.length > 0 || files.length > 0) && (
          <LoadedAudioContainer>
            {existingFiles.map((file) => (
              <LoadedAudio key={file.id}>
                <AudioFileIcon />
                <Typography
                  variant="body2"
                  style={{ flexGrow: 1, marginRight: 20 }}
                >
                  {file.title}
                </Typography>
        
                <IconButton
                  title="Deletar áudio"
                  onClick={() => removeExistingFile(file.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </LoadedAudio>
            ))}
            {files.map((file, index) => (
              <LoadedAudio key={index}>
                <AudioFileIcon />
                <Typography
                  variant="body2"
                  style={{ flexGrow: 1, marginRight: 20 }}
                >
                  {file.name}
                </Typography>
                <audio controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the audio element.
                </audio>

                <IconButton
                  onClick={() => removeFile(index)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </LoadedAudio>
            ))}
          </LoadedAudioContainer>
        )}

        {totalProgress > 0 && (
          <>
            <LinearProgress variant="determinate" value={totalProgress} />
            <Typography
              variant="body2"
              color="textSecondary"
            >{`Total progress: ${Math.round(totalProgress)}%`}</Typography>
          </>
        )}

        <ButtonFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadAllFiles}
            disabled={
              !isModified || !((processNumber).length==20) || !responsible || !title || !(files.length || existingFiles.length)
            }
          >
            Enviar Processo
          </Button>
        </ButtonFooter>
      </UploadContainer>
    </>
  );
};
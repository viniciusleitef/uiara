import { useState } from "react";
import {
  ButtonFooter,
  LoadedAudio,
  LoadedAudioContainer,
  UploadContainer,
} from "./styles";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProcessoPayload } from "../../app/services/processos/types";
import processoService from "../../app/services/processos";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { InputAdornment, TextField } from "@mui/material";

export const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [processNumber, setProcessNumber] = useState("");
  const [responsible, setResponsible] = useState("");
  const [title, setTitle] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const uploadAllFiles = async () => {
    const currentDate = getCurrentDate();

    for (let i = 0; i < files.length; i++) {
      try {
        const formData: ProcessoPayload = {
          file: files[i],
          title: "Análise de Áudio",
          num_process: processNumber,
          responsible,
          date_of_creation: currentDate,
        };
        await processoService.postProcess(formData);
        setTotalProgress((prevProgress) => prevProgress + 100 / files.length);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    setFiles([]);
    setTotalProgress(0);
  };

  return (
    <UploadContainer>
      <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Número do Processo"
            variant="outlined"
            fullWidth
            value={processNumber}
            onChange={(e) => setProcessNumber(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">#</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Responsável"
            variant="outlined"
            fullWidth
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
          />
        </Box>
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>

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
          >
            Upload
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <LoadedAudioContainer>
          {files.map((file, index) => (
            <LoadedAudio>
              <AudioFileIcon />
              <Typography
                variant="body2"
                style={{ flexGrow: 1, marginRight: 20 }}
              >
                {file.name}
              </Typography>
              <IconButton onClick={() => removeFile(index)} aria-label="delete">
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
        <ButtonFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadAllFiles}
            disabled={!files.length || !processNumber || !responsible || !title}
          >
            Enviar Processos
          </Button>
        </ButtonFooter>
      </ButtonFooter>
    </UploadContainer>
  );
};

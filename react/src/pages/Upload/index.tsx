import { useState } from "react";
import { UploadContainer } from "./styles";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ProcessoPayload } from "../../app/services/processos/types";
import processoService from "../../app/services/processos";

export const Upload = () => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      simulateFileUpload(file);
    }
  };

  const simulateFileUpload = (file: File) => {
    const totalSize = file.size;
    let loaded = 0;
    const step = totalSize / 100;

    const interval = setInterval(() => {
      if (loaded < totalSize) {
        loaded += step;
        setProgress((loaded / totalSize) * 100);
      } else {
        clearInterval(interval);
        setProgress(100);
        uploadFile(file);
      }
    }, 10);
  };

  const uploadFile = async (file: File) => {
    try {
      const formData: ProcessoPayload = {
        file,
        title: "teste",
        num_process: "1",
        responsible: "1",
        date_of_creation: "1",
      };

      const response = await processoService.postProcesso(formData);
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <UploadContainer>
      <div>
        <p>Insira o áudio para análise</p>
        <input
          type="file"
          accept="audio/*"
          id="file-upload"
          hidden
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
      {file && (
        <Box display="flex" alignItems="center" width="100%" mt={2}>
          <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
              progress
            )}%`}</Typography>
          </Box>
        </Box>
      )}
    </UploadContainer>
  );
};

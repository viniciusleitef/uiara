import { useState } from "react";
import { ButtonFooter, UploadContainer } from "./styles";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProcessoPayload } from "../../app/services/processos/types";
import processoService from "../../app/services/processos";

export const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const generateProcessNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const uploadAllFiles = async () => {
    const currentDate = getCurrentDate();
    const processNumber = generateProcessNumber();
    const title = "Análise de Áudio";
    const responsible = "João Silva";

    for (let i = 0; i < files.length; i++) {
      try {
        const formData: ProcessoPayload = {
          file: files[i],
          title,
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
      <Typography variant="body2" style={{ marginTop: 20 }}>
        Número de processo: #{generateProcessNumber()}
      </Typography>

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

      {files.map((file, index) => (
        <Box display="flex" alignItems="center" width="100%" mt={2} key={index}>
          <Typography variant="body2" style={{ flexGrow: 1, marginRight: 20 }}>
            {file.name}
          </Typography>
          <IconButton onClick={() => removeFile(index)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

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
          disabled={!files.length}
        >
          Enviar Processos
        </Button>
      </ButtonFooter>
    </UploadContainer>
  );
};

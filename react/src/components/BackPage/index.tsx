import { ArrowBack } from "@mui/icons-material";
import { BackPageContainer } from "./styles";
import { useNavigate } from "react-router-dom";

export const BackPage = () => {
  const navigate = useNavigate();
  return (
    <BackPageContainer onClick={() => navigate("/upload")}>
      <ArrowBack sx={{ fontSize: 16 }} />
      <p>Voltar</p>
    </BackPageContainer>
  );
};

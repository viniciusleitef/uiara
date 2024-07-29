import { ArrowBack } from "@mui/icons-material";
import { BackPageContainer } from "./styles";
import { useNavigate } from "react-router-dom";

type BackPageProps = {
  to?: string;
};

export const BackPage: React.FC<BackPageProps> = ({ to }) => {
  const navigate = useNavigate();
  return (
    <BackPageContainer onClick={() => to ? navigate(to) : navigate(-1)}>
      <ArrowBack sx={{ fontSize: 16 }} />
      <p>Voltar</p>
    </BackPageContainer>
  );
};

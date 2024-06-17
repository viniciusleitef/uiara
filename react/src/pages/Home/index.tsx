import { useNavigate } from "react-router-dom";
import { HomeContainer, HomeButton } from "./styles";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <HomeButton onClick={() => navigate("/upload")}>Enviar Áudios</HomeButton>
      <HomeButton onClick={() => navigate("/results")}>
        Ver Resultados
      </HomeButton>
    </HomeContainer>
  );
};

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Container } from "./styles";
import { useNavigate } from "react-router-dom";

export const ContactUs = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/support");
  };

  return (
    <Container onClick={handleClick}>
      <p>Precisa de ajuda? Fale conosco aqui</p>
      <ContactSupportIcon />
    </Container>
  );
};

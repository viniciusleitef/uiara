import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Container } from "./styles";

export const ContactUs = () => {
  return (
    <Container>
      <p>Precisa de ajuda? Fale conosco aqui</p>
      <ContactSupportIcon sx={{ fontSize: 50 }} />
    </Container>
  );
};

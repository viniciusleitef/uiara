import { Developer, ModalContainer, ModalContent, Title } from "./styles";
import tre_icon from "../../assets/tre-icon.png";
import laser_logo from "../../assets/laser-logo.png";
import { ContactUs } from "../ContactUs";
interface ModalProps {
  children?: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <ModalContainer>
      <Title>
        <img src={tre_icon} alt="logo" />
        IAra
      </Title>
      <ModalContent>{children}</ModalContent>
      <ContactUs />
      <Developer
        href="https://sites.google.com/view/laser-ufpb/in%C3%ADcio"
        target="_blank"
        rel="noopener noreferrer"
      >
        Desenvolvido por <img src={laser_logo} alt="logo" />
      </Developer>
    </ModalContainer>
  );
};

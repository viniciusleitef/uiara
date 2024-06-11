import { Developer, ModalContainer, ModalContent, Title } from "./styles";
import tre_icon from "../../assets/tre-icon.png";
import laser_logo from "../../assets/laser-logo.png";
interface ModalProps {
  children?: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <ModalContainer>
      <Title>
        <img src={tre_icon} alt="logo" />
        TRE DetectAi
      </Title>
      <ModalContent>{children}</ModalContent>
      <Developer>
        Desenvolvido por <img src={laser_logo} alt="logo" />
      </Developer>
    </ModalContainer>
  );
};

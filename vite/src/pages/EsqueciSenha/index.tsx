import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EsqueciContainer, ModalContainer } from "./styles";
import Person from "@mui/icons-material/Person";
import { AuthContext } from "../../app/context/AuthContext";
import { StyledInput } from "../../styles/input";
import SendIcon from '@mui/icons-material/Send';
import { Modal } from "../../components/Modal";

export const EsqueciSenha = () => {
    const { user, forgotPasswordStepOne, forgotPasswordStepTwo, forgotPasswordStepThree } = useContext(AuthContext);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotVerificationCode, setForgotVerificationCode] = useState<string>("");
    const [forgotNewPassword, setForgotNewPassword] = useState<string>("");
    const [forgotConfirmNewPassword, setForgotConfirmNewPassword] = useState<string>("");


    const [forgotPasswordModalSecondStep, setForgotPasswordModalSecondStep] = useState<boolean>(false);

    const [forgotPasswordModalThirdStep, setForgotPasswordModalThirdStep] = useState<boolean>(false);

    const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        console.log("GOING TO BASE")
        navigate("/");
    }
  }, [user, navigate]);

  const handleSubmitForgotPasswordStepOne = async (event: { preventDefault: () => void; }) => {
    // Logic to send code to email
    event.preventDefault()

    console.log("STEP ONE")

    setLoading(true);
    
    try {
        await forgotPasswordStepOne(forgotEmail);
        setError(null);
        setForgotPasswordModalSecondStep(true);
    } catch (err) {
        const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmitForgotPasswordStepTwo = async (event: { preventDefault: () => void; }) => {
    // Logic to check if code is correct
    event.preventDefault()

    console.log("STEP TWO")

    setLoading(true);

    try {
        await forgotPasswordStepTwo(forgotEmail, forgotVerificationCode);
        setError(null);
        setForgotPasswordModalThirdStep(true);
        setForgotPasswordModalSecondStep(false);
    } catch (err) {
        const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmitForgotPasswordStepThree = async (event: { preventDefault: () => void; }) => {
    event.preventDefault()

    console.log("STEP THREE")

    setLoading(true);

    try {
        await forgotPasswordStepThree(forgotEmail, forgotNewPassword);
        setError(null);
        setForgotPasswordModalThirdStep(false);
    } catch (err) {
        const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
        setError(errorMessage);
    } finally {
        setLoading(false);
        navigate("/login")
    }
  };

  return (
    <EsqueciContainer>
        <form onSubmit={handleSubmitForgotPasswordStepOne}>
            <p>Digite o email da sua conta. Enviaremos um código para você redefinir a senha.</p>
            <div>
            <Person />
            <StyledInput 
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
            />
            </div>
            <button type="submit">
                <SendIcon />
                Enviar
            </button>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}
            <div onClick={() => navigate('/login')} className="voltarContainer">
                <p className="voltarText">Voltar ao início</p>
            </div>
        </form>
        {forgotPasswordModalSecondStep &&
        <Modal>
          <ModalContainer>
          <form onSubmit={handleSubmitForgotPasswordStepTwo}>
          <p>Um código foi enviado ao email {forgotEmail}. Insira ele abaixo para continuar.</p>
            <StyledInput 
              placeholder="Código de verificação"
              value={forgotVerificationCode}
              onChange={(e) => setForgotVerificationCode(e.target.value)}
            />
            <button type="submit">
              <SendIcon />
              Continuar
            </button>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}
          </form>
          </ModalContainer>
        </Modal>
        }
        {forgotPasswordModalThirdStep &&
        <Modal>
          <ModalContainer>
          <form onSubmit={handleSubmitForgotPasswordStepThree}>
          <p>Pronto! Digite a nova senha e redefinirimos sua senha.</p>
            <StyledInput 
              placeholder="Nova senha"
              value={forgotNewPassword}
              onChange={(e) => setForgotNewPassword(e.target.value)}
            />
            <StyledInput 
              placeholder="Confirmar nova senha"
              value={forgotConfirmNewPassword}
              onChange={(e) => setForgotConfirmNewPassword(e.target.value)}
            />
            <button type="submit">
              <SendIcon />
              Confirmar
            </button>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}
          </form>
          </ModalContainer>
        </Modal>
        }
        
    </EsqueciContainer>
  );
};

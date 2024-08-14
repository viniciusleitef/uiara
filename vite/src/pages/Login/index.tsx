import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContainer, ModalContainer } from "./styles";
import Person from "@mui/icons-material/Person";
import VpnKey from "@mui/icons-material/VpnKey";
import { AuthContext } from "../../app/context/AuthContext";
import { StyledInput } from "../../styles/input";
import LoginIcon from "@mui/icons-material/Login";
import ReCAPTCHA from "react-google-recaptcha";
import { Modal } from "../../components/Modal";

const chave_do_site = "6LcNWSIqAAAAAFpJrPF6iRt6ZIO5t9Oo1jLnl7FY"

export const Login = () => {
  const { user, signInStepOne, signInStepTwo } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>("null"); // NULL
  const [loading, setLoading] = useState<boolean>(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [secondStep, setSecondStep] = useState<boolean>(false);
  const [errorVerification, setErrorVerification] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmitStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Por favor complete o CAPTCHA");
      return;
    }
    setLoading(true);
    try {
      await signInStepOne(email, password, captchaToken);
      setError(null);
      setSecondStep(true);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
      setError(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  const handleSubmitStepTwo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInStepTwo(email, password, verificationCode);
      setErrorVerification(null);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
      setErrorVerification(errorMessage);
    } 
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleForgotPassword = () => {
    navigate('/esqueci-senha')
  }

  return (
    <LoginContainer>
      <form onSubmit={handleSubmitStepOne}>
        <div>
          <Person />
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <VpnKey />
          <StyledInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="forgotPasswordOuterContainer">
          <div onClick={handleForgotPassword} className="forgotPasswordContainer">
            <p className="forgotPasswordText">Esqueci a senha / Primeiro acesso</p>
          </div>
        </div>
        <ReCAPTCHA
          sitekey={chave_do_site}
          onChange={handleCaptchaChange}
        />
        {loading && <p>Carregando...</p>} 
        {error && <p>{error}</p>}
        <button type="submit">
          <LoginIcon />
          Entrar
        </button>
      </form>
      {secondStep &&
        <Modal>
          <ModalContainer>
          <form onSubmit={handleSubmitStepTwo}>
            <p>Um código de verificação foi enviado ao email {email}. Insira ele abaixo para entrar.</p>
            <StyledInput 
              placeholder="Código de verificação"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button type="submit">
              <LoginIcon />
              Entrar
            </button>
            {errorVerification && <p>{errorVerification}</p>}
          </form>
          </ModalContainer>
        </Modal>
        }      
    </LoginContainer>
  );
};

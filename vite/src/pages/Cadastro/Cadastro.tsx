import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContainer, ModalContainer } from './styles';
import Person from "@mui/icons-material/Person";
import VpnKey from "@mui/icons-material/VpnKey";
import Mail from "@mui/icons-material/Mail";
import { AuthContext } from "../../app/context/AuthContext";
import { StyledInput } from "../../styles/input";
import LoginIcon from "@mui/icons-material/Login";
// @ts-ignore
import { Modal } from "../../components/Modal";
// @ts-ignore
const chave_do_site = "6LcNWSIqAAAAAFpJrPF6iRt6ZIO5t9Oo1jLnl7FY"

export const Cadastro = () => {
  const { user, signUp, validateUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>("null"); // NULL
  const [loading, setLoading] = useState<boolean>(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [secondStep, setSecondStep] = useState<boolean>(false);

  const [errorVerification, setErrorVerification] = useState<string | null>(null);

  const navigate = useNavigate();

  const emailDomainCheck = false;
  const allowedDomains = ["jus.br"];

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const isPasswordValid = (password: string) => {
    const hasMinimumLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoRepeatingChars = !/(.)\1/.test(password);

    return hasMinimumLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasNoRepeatingChars;
  };

  const isEmailValid = (email: string) => {
    if (!emailDomainCheck) return true;

    const domain = email.split("@")[1];
    return allowedDomains.some((allowedDomain) => domain.endsWith(allowedDomain));
  };

  const handleSubmitStepOne = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Por favor complete o CAPTCHA");
      return;
    }

    if (password !== password2) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "A senha deve conter pelo menos 6 dígitos, incluindo letras maiúsculas, minúsculas, números e caracteres especiais, e não incluir repetições sequenciais."
      );
      return;
    }

    if (!isEmailValid(email)) {
      setError("O email deve terminar com 'jus.br'.");
      return;
    }

    setError(null)
    setErrorVerification(null);
    setLoading(true);
    try {
      await signUp(name, email, password);
      setError(null);
      setSecondStep(true);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // @ts-ignore
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleVerificateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorVerification(null);
    setLoading(true);
    try {
      await validateUser(email, verificationCode);
      setError(null);
      setSecondStep(false);
      navigate('/login')
    } catch (err) {
      const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
      setErrorVerification(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <LoginContainer>
      <Modal>
        <ModalContainer>
          <form onSubmit={handleSubmitStepOne}>
            <div>
              <Person />
              <StyledInput
                type="name"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Mail />
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
            <div>
              <VpnKey />
              <StyledInput
                type="password"
                placeholder="Confirmar Senha"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}
            <button type="submit">
              <LoginIcon />
              Cadastrar
            </button>

            <div className="signUpOuterContainer">
              <div onClick={handleLogin} className="signUpContainer">
                <p className="signUpText">Fazer Login</p>
              </div>
            </div>

          </form>
        </ModalContainer>
      </Modal>
      {secondStep &&
        <Modal>
          <ModalContainer>
            <form onSubmit={handleVerificateAccount}>
              <p>Um código de verificação foi enviado ao email {email}. Insira ele abaixo para validar sua conta.</p>
              <StyledInput
                placeholder="Código de verificação"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button type="submit">
                <LoginIcon />
                Confirmar
              </button>
              {errorVerification && <p>{errorVerification}</p>}
            </form>
          </ModalContainer>
        </Modal>
      }
    </LoginContainer>
  );
};

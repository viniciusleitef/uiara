import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EsqueciContainer, ModalContainer } from "./styles";
import Person from "@mui/icons-material/Person";
import VpnKey from "@mui/icons-material/VpnKey";
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
            navigate("/");
        }
    }, [user, navigate]);

    const isPasswordValid = (password: string) => {
        const hasMinimumLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasMinimumLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    const handleSubmitForgotPasswordStepOne = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
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
        event.preventDefault();
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
        event.preventDefault();
        setError(null);

        if (forgotNewPassword !== forgotConfirmNewPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        if (!isPasswordValid(forgotNewPassword)) {
            setError(
                "A senha deve conter pelo menos 8 dígitos, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
            );
            return;
        }

        setLoading(true);

        try {
            await forgotPasswordStepThree(forgotEmail, forgotNewPassword);
            setError(null);
            setForgotPasswordModalThirdStep(false);
            navigate("/login");
        } catch (err) {
            const errorMessage = (err as any).response?.data?.detail || "Um erro ocorreu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <EsqueciContainer>
            <Modal>
                <ModalContainer>
                    <form onSubmit={handleSubmitForgotPasswordStepOne}>
                        <p>Digite o email da sua conta. Enviaremos um código para você redefinir a senha.</p>
                        <div>
                            <Person />
                            <StyledInput
                                type="email"
                                placeholder="Email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
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
                </ModalContainer>
            </Modal>

            {forgotPasswordModalSecondStep &&
                <Modal>
                    <ModalContainer>
                        <form onSubmit={handleSubmitForgotPasswordStepTwo}>
                            <p>Um código foi enviado ao email {forgotEmail}. Insira ele abaixo para continuar.</p>
                            <StyledInput
                                type="text"
                                placeholder="Código de verificação"
                                value={forgotVerificationCode}
                                onChange={(e) => setForgotVerificationCode(e.target.value)}
                                required
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
                            <p>Pronto! Digite a nova senha e redefiniremos sua senha.</p>
                            <div>
                                <VpnKey />
                                <StyledInput
                                    type="password"
                                    placeholder="Nova senha"
                                    value={forgotNewPassword}
                                    onChange={(e) => setForgotNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <VpnKey />
                                <StyledInput
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    value={forgotConfirmNewPassword}
                                    onChange={(e) => setForgotConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </div>
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

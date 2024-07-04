import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContainer } from "./styles";
import Person from "@mui/icons-material/Person";
import VpnKey from "@mui/icons-material/VpnKey";
import { AuthContext } from "../../app/context/AuthContext";
import { StyledInput } from "../../styles/input";
import LoginIcon from "@mui/icons-material/Login";

export const Login = () => {
  const { user, signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setError(null);
    } catch (err) {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
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
        {error && <p>{error}</p>}
        <button type="submit">
          <LoginIcon />
          Entrar
        </button>
      </form>
    </LoginContainer>
  );
};

import React, { useState } from "react";
import { Container } from "./styles";
import { StyledInput } from "../../styles/input";
import { StyledTextarea } from "../../styles/textarea";

export const Support = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar o e-mail aqui
    console.log("Email enviado:", email, message);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <StyledInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mensagem:</label>
          <StyledTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></StyledTextarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </Container>
  );
};

import React from 'react';
import { PopUpContainer } from "./styles";

interface PopUpProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PopUp: React.FC<PopUpProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <PopUpContainer>
        <div onClick={onCancel} style={{ display: visible ? 'flex' : 'none'}} className="popUp-box">
        <div className="popUp-content">
            <h2>Aviso Importante!</h2>
            <p>Ao clicar em deletar, o processo será <strong>excluído permanentemente</strong> junto com todos os áudios atrelados a ele. Você tem certeza que deseja fazer isso?</p>

            <div className="button-box">
            <button onClick={onConfirm} className="button-delete">Deletar</button>
            <button onClick={onCancel}>Cancelar</button>
            </div>
        </div>
        </div>
    </PopUpContainer>
  );
};
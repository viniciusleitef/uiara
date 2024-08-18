import { BlueHeader, HeaderContainer, WhiteHeader } from "./styles";
import trelogo from "../../assets/tre-pb.png";
import LogoutIcon from '@mui/icons-material/Logout';

import { AuthContext } from "../../app/context/AuthContext";
import { useContext, useState } from "react";

export const Header = () => {
  const { user, signOut } = useContext(AuthContext);

  function logoutElements() {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleLogoutClick = () => {
      setShowConfirmation(true);
    };

    const handleConfirmLogout = () => {
      signOut(); 
      setShowConfirmation(false); 
    };

    const handleCancelLogout = () => {
      setShowConfirmation(false); 
    };

    if (user) {
      return (
        <div className="logout-div">
          <LogoutIcon onClick={handleLogoutClick} style={{ cursor: "pointer", zIndex: 10, }} />
          {showConfirmation && (
            <div className="confirmation">
              <span>Deseja sair?</span>
              <button onClick={handleConfirmLogout}>Sim</button>
              <button onClick={handleCancelLogout}>Cancelar</button>
            </div>
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <HeaderContainer>
      <BlueHeader />
      <WhiteHeader>
        <div className="tre-div">
          <img src={trelogo} alt="logo" />
        </div>
        {logoutElements()}
      </WhiteHeader>
    </HeaderContainer>
  );
};

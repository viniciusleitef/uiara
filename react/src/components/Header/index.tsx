import { BlueHeader, HeaderContainer, WhiteHeader } from "./styles";
import trelogo from "../../assets/tre-pb.png";

export const Header = () => {
  return (
    <HeaderContainer>
      <BlueHeader />
      <WhiteHeader>
        <div>
          <img src={trelogo} alt="logo" />
        </div>
      </WhiteHeader>
    </HeaderContainer>
  );
};

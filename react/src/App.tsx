import { Modal } from "./components/Modal";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./app/router";
import { Header } from "./components/Header";
import { AuthProvider } from "./app/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Modal>
          <Routes />
        </Modal>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

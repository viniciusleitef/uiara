import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { Routes } from "./app/router";
import { Modal } from "./components/Modal";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Modal>
        <Routes />
      </Modal>
    </BrowserRouter>
  );
}

export default App;

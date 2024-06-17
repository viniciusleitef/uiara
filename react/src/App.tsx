import { Modal } from "./components/Modal";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./app/router";
import { Header } from "./components/Header";

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

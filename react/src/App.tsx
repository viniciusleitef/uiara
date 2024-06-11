import { useState } from "react";
import { Modal } from "./components/Modal";
import { Upload } from "./pages/Upload";

function App() {
  const [step] = useState("Upload");
  return <Modal>{step === "Upload" && <Upload></Upload>}</Modal>;
}

export default App;

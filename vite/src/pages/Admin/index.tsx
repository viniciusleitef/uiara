import { useEffect, useState } from "react";
import { AdminContainer } from "./styles";
import modelService from "../../app/services/model";
import { Model } from "../../types";


export const Admin = () => {

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedModelDelete, setSelectedModelDelete] = useState<Model | null>(null);
  const [actualModel, setActualModel] = useState<Model | null>(null);
  const [fileName, setFileName] = useState('Nenhum arquivo selecionado');
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {
    getActualModel(); 
  }, [models]);

  const getModels = async () => {
    const response = await modelService.getModels();
    console.log(response);
    setModels(response);
  };
  
  const getActualModel = () => {
    const model = models.find((model) => model.status === true);
    if (!model) {
      return setActualModel(null);
    }
    setActualModel(model);
  }

  const handleModelSubmit = async () => {
    console.log(selectedModel)
    if (!selectedModel) {
      alert("Selecione um modelo para o sistema");
      return;
    }
    const modelPayload = { status: true };
    await modelService.updateModel(selectedModel.id, modelPayload);
  }

  const handleModelDelete = async () => {
    if (!selectedModelDelete) {
      alert("Selecione um modelo para o sistema");
      return;
    }
    await modelService.deleteModel(selectedModelDelete.id);
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selected = models.find((model) => model.model_name === selectedName) || null;
    setSelectedModel(selected);
  };

  const handleSelectChangeDelete = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selected = models.find((model) => model.model_name === selectedName) || null;
    setSelectedModelDelete(selected);
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
    setFileName(selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado');
  };

  const handleFileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
        alert("Selecione um arquivo para enviar");
        return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("version", version);
    formData.append("description", description);

    try {
      await modelService.postModelFile(formData);

    } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Erro ao enviar o arquivo";
        setError(errorMessage);
    }
};


  const handleVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(event.target.value);
  }

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }

  return (
    <>
      <AdminContainer>
        <h1>Admin</h1> 

        <form onSubmit={handleModelSubmit}>
          <div>
            <label><span className="bold">Escolha um modelo para o sistema:</span></label>
            <select onChange={handleSelectChange} defaultValue="">
              <option value="" disabled>Selecione um modelo</option>
              {models.map((model) => (
                <option key={model.model_name} value={model.model_name}>
                  {model.model_name}
                </option>
              ))}
            </select>
          </div>
          <div className="button-box">
            <button type="submit">Enviar</button>
          </div>

          <div className="actual-model">Modelo atual: 
            <span>
              {actualModel ? actualModel.model_name : "Nenhum modelo selecionado"}
            </span>
          </div>
        </form>
        

        <form onSubmit={handleModelDelete}>
          <div>
            <label><span className="bold">Escolha um modelo para excluir do sistema:</span></label>
            <select onChange={handleSelectChangeDelete} defaultValue="">
              <option value="" disabled>Selecione um modelo</option>
              {models.map((model) => (
                <option key={model.model_name} value={model.model_name}>
                  {model.model_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Enviar</button>
        </form>


        <form onSubmit={handleFileSubmit} className="file-input-wrapper">
          <div className="label-box">
            <label><span className="bold">Envie um modelo para o sistema</span></label>
            <input type="file" id="file" className="file-input" onChange={handleFileChange} />
            <div>
              <span className="file-name">{fileName}</span>
            </div>
          </div>
          <label htmlFor="file" className="file-label">
            Escolher Arquivo
          </label>
          
          <div className="label-box">
            <label htmlFor="version">Versão:</label>
            <input className="text-input" id="version" type="text" onChange={handleVersion} />
          </div>

          <div className="label-box">
            <label htmlFor="descricao">Descrição:</label>
            <input className="text-input" id="descricao" type="text" onChange={handleDescription}/>
          </div>


          <button type="submit">Enviar</button>

          {error}

        </form>
      </AdminContainer>
    </>

  );
};
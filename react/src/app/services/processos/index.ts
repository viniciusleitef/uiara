import { api } from "..";
import { ProcessoPayload } from "./types";

class ProcessoService {
  async postProcess(formData: ProcessoPayload) {
    try {
      const response = await api.post("/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const processoService = new ProcessoService();
export default processoService;

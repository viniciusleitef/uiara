import { api } from "..";
import { ProcessPayload } from "./types";

class ProcessService {
  async postProcess(formData: ProcessPayload) {
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

const processService = new ProcessService();
export default processService;

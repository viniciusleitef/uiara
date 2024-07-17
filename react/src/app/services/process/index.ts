import { api } from "..";
import { ProcessPayload } from "./types";

class ProcessService {
  async getProcesses() {
    try {
      const response = await api.get("/processes");
      return response;
    } catch (error) {
      throw error;
    }
  }

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

  async deleteProcess(num_process: string) {
    try {
      console.log(`processo deleted ${num_process}`);
      const response = await api.delete(`/process/${num_process}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const processService = new ProcessService();
export default processService;

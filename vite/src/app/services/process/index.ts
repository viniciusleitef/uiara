import api from "..";
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

  async postProcess(processPayload: ProcessPayload) {
    try {
      const response = await api.post("/process", processPayload, {
        headers: {
          "Content-Type": "application/json",
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

  async updateProcessTitle(num_process: string, new_title: string) {
    try {
      const response = await api.put(`/process/${num_process}?new_title=${encodeURIComponent(new_title)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const processService = new ProcessService();
export default processService;
import { api } from "..";

class AudioService {
  async getAudios(numProcess: number) {
    try {
      const response = await api.get(`/audios/${numProcess}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const audioService = new AudioService();
export default audioService;

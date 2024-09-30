import api from "..";

class AudioService {
  async getAudios(numProcess: string) {
    try {
      console.log("numProcess", numProcess);
      const response = await api.get(`/audios/${numProcess}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAudioFile(audio_id: number) {
    try {
      const response = await api.get(`/audioFile/${audio_id}`, { responseType: 'blob' });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllAudios() {
    try {
      const response = await api.get("/processesWithAudios");
      return response;
    } catch (error) {
      throw error;
    }
  }

  async postAudio(formData: FormData){
    try {
      const response = await api.post("/upload-audios", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error in postAudio", error);
      throw error;
    }
  }

  async deleteAudio(id: number){
    try {
      const response = await api.delete(`/delete-audio/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const audioService = new AudioService();
export default audioService;

import { api } from "..";
import { ModelPayload } from "./types";

class ModelService {
   async getModels(){
      try{
         const response = await api.get("/model_versions");
         return response.data;
      }catch(error){
         throw error;
      }
   }

   async updateModel(id: number, modelPayload: ModelPayload){
      try{
         const response = await api.put(`/model_versions/${id}`, modelPayload);
         return response.data;
      }catch(error){
         throw error;
      }
   }

   async deleteModel(id: number){
      try{
         const response = await api.delete(`/model_versions/${id}`);
         return response.data;
      }catch(error){
         throw error;
      }
   }

   async postModelFile(formData: FormData) {
      try {
         const response = await api.post("/model_versions/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         return response.data;
      } catch (error: any) {
         console.log(error.status)
         throw error;
      }
   }
}

const modelService = new ModelService();
export default modelService ;
import { api } from "..";

class PdfService {
    async getPdf(num_process: string) {
        try{
            const response = await api.get(`/generate-pdf/${num_process}`, {
                responseType: 'blob'
            });
            return response;
        } catch(error) {
          throw error;
        }

    }
}

const pdfservice = new PdfService();
export default pdfservice;
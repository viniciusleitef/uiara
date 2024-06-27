export interface AudioProps {
  title: string;
  classification: boolean;
  id: number;
  accuracy: number;
}

export interface ProcessProps {
  num_process: string;
  status_id: number;
  date_of_creation: string;
  id: number;
  responsible: string;
  audios: AudioProps[];
}

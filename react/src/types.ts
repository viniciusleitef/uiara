export interface AudioProps {
  title: string;
  process_id: number;
  classification: boolean;
  url: string;
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

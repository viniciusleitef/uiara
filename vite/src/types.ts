export interface AudioProps {
  title: string;
  classification: boolean;
  id: number;
  accuracy: number;
  audio_duration: number;
  sample_rate: number;
  snr: number;
}

export interface ProcessProps {
  num_process: string;
  status_id: number;
  title: string;
  created_at: string;
  id: number;
  responsible: string;
  audios: AudioProps[];
}

export interface AudioFileProps {
  id: number;
  url: string;
  filename: string;
  contentType: string;
  contentLength: number;
  dateCreated: string;
  lastModified: string;
  server: string;
}

export interface ErrorAudio{
  file: string;
  error: string;
  status_code: number;
}

export interface Model {
  id: number;
  model_name: string;
  version: string;
  description?: string;
  file_path: string;
  accuracy?: number;
  loss?: number;
  status: boolean;
  created_at: Date;
  updated_at: Date; 
}
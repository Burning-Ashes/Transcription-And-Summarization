
export type UserRole = 'teacher' | 'student';

export interface Content {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'text';
  url: string; 
  dataUri?: string;
  summary?: string;
  transcription?: string;
}

export interface Chapter {
  id: string;
  title: string;
  children: Chapter[];
  lectures: Content[];
  materials: Content[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  chapters: Chapter[];
}

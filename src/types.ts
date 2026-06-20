import frJson from './locales/fr.json';
import enJson from './locales/en.json';

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  descriptionEn: string;
  descriptionFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  tags: string[];
  category: 'frontend' | 'backend' | 'fullstack';
  isFeatured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  periodEn: string;
  periodFr: string;
  roleEn: string;
  roleFr: string;
  company: string;
  descriptionEn: string;
  descriptionFr: string;
  skills: string[];
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  isRead: boolean;
}

export type Language = 'fr' | 'en';

export const TRANSLATIONS = {
  fr: frJson,
  en: enJson
};

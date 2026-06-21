export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'visitor';
  avatar?: string;
}

export interface Profile {
  fullname: string;
  title: string;
  biography: string;
  location: string;
  availability: 'available' | 'busy' | 'rest';
  profilePicture: string;
  cvUrl?: string;
  cvBase64?: string;
  cvFileName?: string;
  cvFileType?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Technology {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'mobile' | 'devops' | 'tools';
  proficiency: number; // 0 to 100
  yearsExperience: number;
}

export interface ProjectCategory {
  id: string;
  nameEn: string;
  nameFr: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  technologies: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  endDate?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string; // Empty if current
}

export interface SoftSkill {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface SEOSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
}

export interface TranslationMessages {
  common: {
    available: string;
    busy: string;
    rest: string;
    downloadCV: string;
    contactMe: string;
    about: string;
    projects: string;
    experience: string;
    skills: string;
    contact: string;
    admin: string;
    french: string;
    english: string;
    loading: string;
    error: string;
    success: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    cancel: string;
    back: string;
    all: string;
    featured: string;
  };
  home: {
    heroGreeting: string;
    heroSubtitle: string;
    heroDescription: string;
    aboutTitle: string;
    aboutPreview: string;
    featuredProjectsTitle: string;
    featuredProjectsSubtitle: string;
    techTitle: string;
    techSubtitle: string;
    expTitle: string;
    skillsTitle: string;
    contactCtaTitle: string;
    contactCtaDesc: string;
    askGrégoire: string;
    askGrégoireDesc: string;
  };
  about: {
    title: string;
    subtitle: string;
    philosophyTitle: string;
    philosophyDesc: string;
    valuesTitle: string;
    valuesDesc1: string;
    valuesDesc2: string;
    objectivesTitle: string;
    objectivesDesc: string;
    statsProjects: string;
    statsExp: string;
    statsTech: string;
    statsCoffee: string;
  };
  projects: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    viewCode: string;
    viewLive: string;
    noProjects: string;
    challenges: string;
    solutions: string;
  };
  experience: {
    title: string;
    subtitle: string;
    present: string;
  };
  skills: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitBtn: string;
    submittingBtn: string;
    successMsg: string;
    errorMsg: string;
  };
  gemini: {
    placeholder: string;
    title: string;
    intro: string;
    send: string;
  };
}

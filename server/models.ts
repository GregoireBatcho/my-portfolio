import mongoose from 'mongoose';

// Schema for projects
export const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  descriptionEn: { type: String, required: true },
  descriptionFr: { type: String, required: true },
  shortDescriptionEn: { type: String, required: true },
  shortDescriptionFr: { type: String, required: true },
  image: { type: String, required: true },
  githubUrl: { type: String },
  liveUrl: { type: String },
  tags: [{ type: String }],
  category: { type: String, enum: ['frontend', 'backend', 'fullstack'], default: 'fullstack' },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Schema for contact messages
export const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Schema for professional experiences
export const ExperienceSchema = new mongoose.Schema({
  periodEn: { type: String, required: true },
  periodFr: { type: String, required: true },
  roleEn: { type: String, required: true },
  roleFr: { type: String, required: true },
  company: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  descriptionFr: { type: String, required: true },
  skills: [{ type: String }],
  type: { type: String, enum: ['work', 'education'], default: 'work' },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Schema for technologies
export const TechnologySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['frontend', 'backend', 'tools', 'database'], required: true },
  icon: { type: String, required: true }, // Lucide icon name or image url
  level: { type: Number, default: 80 },  // Percentage 0 - 100
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Schema for profile info
export const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'Grégoire BATCHO' },
  email: { type: String, default: 'batchogregoire0@gmail.com' },
  titleEn: { type: String, default: 'Junior Full Stack Developer' },
  titleFr: { type: String, default: 'Développeur Full Stack Junior' },
  bioEn: { type: String, default: 'Builder of high-performance, elegant, and user-centric web applications. Inspired by clean, robust, and meaningful design philosophies.' },
  bioFr: { type: String, default: 'Concepteur d’applications web ultra-performantes, élégantes et centrées sur l’expérience utilisateur. Inspiré par les philosophies de design épurées et robustes.' },
  aboutBioEn: { type: String, default: 'Passionate about the synergy between neat code and meticulous user interface design, I build stable, efficient systems. My methodology takes inspiration from Scandinavian simplicity and industrial execution: every line of code must deliver efficiency, and every pixel must serve a purpose.' },
  aboutBioFr: { type: String, default: 'Passionné par la synergie entre un code élégant et un design minutieux, je conçois des systèmes stables et réactifs. Mon approche s’inspire de la simplicité scandinave et de l’efficacité industrielle : chaque ligne de code doit servir la performance, et chaque pixel doit guider l’utilisateur.' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  socialGithub: { type: String, default: 'https://github.com/grg-batcho' },
  socialLinkedin: { type: String, default: 'https://linkedin.com/in/grg-batcho' },
  socialTwitter: { type: String, default: '' },
  phone: { type: String, default: '+33 6 00 00 00 00' },
  cvName: { type: String, default: 'CV_Gregoire_Batcho.pdf' },
  cvData: { type: String, default: '' } // Base64 document content
}, {
  timestamps: true
});

let Project: any;
let ContactMessage: any;
let Experience: any;
let Technology: any;
let Profile: any;

try {
  Project = mongoose.model('Project');
} catch {
  Project = mongoose.model('Project', ProjectSchema);
}

try {
  ContactMessage = mongoose.model('Contact');
} catch {
  ContactMessage = mongoose.model('Contact', ContactMessageSchema);
}

try {
  Experience = mongoose.model('Experience');
} catch {
  Experience = mongoose.model('Experience', ExperienceSchema);
}

try {
  Technology = mongoose.model('Technology');
} catch {
  Technology = mongoose.model('Technology', TechnologySchema);
}

try {
  Profile = mongoose.model('Profile');
} catch {
  Profile = mongoose.model('Profile', ProfileSchema);
}

export { Project, ContactMessage, Experience, Technology, Profile };


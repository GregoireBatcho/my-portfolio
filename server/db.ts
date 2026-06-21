import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import { 
  User, Profile, Technology, Project, Experience, SoftSkill, ContactMessage, SEOSettings, ProjectCategory 
} from '../src/types';

const DATA_FILE = path.join(process.cwd(), 'portfolio-db.json');

// Define default structure
interface DatabaseSchema {
  user: User;
  profile: Profile;
  technologies: Technology[];
  projects: Project[];
  experiences: Experience[];
  softSkills: SoftSkill[];
  messages: ContactMessage[];
  seoSettings: SEOSettings;
  projectCategories: ProjectCategory[];
}

const defaultData: DatabaseSchema = {
  user: {
    id: "admin-id",
    name: "Grégoire BATCHO",
    email: "batchogregoire81@gmail.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80"
  },
  profile: {
    fullname: "Grégoire BATCHO",
    title: "Full Stack Developer Junior",
    biography: "Enthusiastic and detail-oriented Junior Full Stack Developer with a passion for designing pixel-perfect client interfaces and optimized backend systems. Specializing in Node.js, React, TypeScript, and modern database architectures. I thrive on solving complex technical constraints and writing highly structured, maintainable code.",
    location: "Paris, France",
    availability: "available",
    profilePicture: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
    cvUrl: "/api/cv/download", // Self-contained download URL
    socials: {
      github: "https://github.com/gregoire-batcho",
      linkedin: "https://linkedin.com/in/gregoire-batcho",
      twitter: "https://twitter.com/gregoire_batcho",
      email: "batchogregoire81@gmail.com"
    }
  },
  technologies: [
    // Frontend
    { id: "tech-react", name: "React 19 / Next.js", category: "frontend", proficiency: 90, yearsExperience: 2 },
    { id: "tech-ts", name: "TypeScript", category: "frontend", proficiency: 85, yearsExperience: 2 },
    { id: "tech-tailwind", name: "Tailwind CSS", category: "frontend", proficiency: 95, yearsExperience: 2 },
    { id: "tech-motion", name: "Framer Motion", category: "frontend", proficiency: 80, yearsExperience: 1 },
    
    // Backend
    { id: "tech-node", name: "Node.js / Express", category: "backend", proficiency: 85, yearsExperience: 2 },
    { id: "tech-nest", name: "NestJS", category: "backend", proficiency: 70, yearsExperience: 1 },
    { id: "tech-graphql", name: "GraphQL & REST APIs", category: "backend", proficiency: 80, yearsExperience: 2 },
    
    // Databases
    { id: "tech-mongo", name: "MongoDB / Mongoose", category: "database", proficiency: 85, yearsExperience: 2 },
    { id: "tech-postgres", name: "PostgreSQL / Prisma", category: "database", proficiency: 80, yearsExperience: 1 },
    
    // Mobile
    { id: "tech-rn", name: "React Native", category: "mobile", proficiency: 75, yearsExperience: 15 },
    
    // DevOps
    { id: "tech-docker", name: "Docker", category: "devops", proficiency: 75, yearsExperience: 1 },
    { id: "tech-cicd", name: "GitHub Actions", category: "devops", proficiency: 70, yearsExperience: 1 },
    { id: "tech-cloudrun", name: "GCP / Cloud Run", category: "devops", proficiency: 75, yearsExperience: 1 },
    
    // Tools
    { id: "tech-git", name: "Git & Version Control", category: "tools", proficiency: 90, yearsExperience: 3 },
    { id: "tech-figma", name: "Figma (UI Design)", category: "tools", proficiency: 80, yearsExperience: 2 }
  ],
  projects: [
    {
      id: "proj-nova",
      title: "Nova CRM & Analytics Suite",
      slug: "nova-crm-analytics-suite",
      shortDescription: "A luxurious B2B SaaS platform featuring beautiful dark glassmorphic widgets, interactive real-time telemetry, and automated invoice delivery.",
      fullDescription: "Nova is an enterprise-oriented customer relationship and server telemetry platform. Engineered utilizing a robust full-stack architecture, it addresses modern performance requirements with server-rendered layouts and fluid client transitions. Key challenges resolved included the synchronization of live metric charting with low bandwidth, solved by custom D3 layout pooling and virtual caching.",
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=675&q=80"
      ],
      technologies: ["React", "Express", "Node.js", "MongoDB", "Tailwind CSS", "Recharts"],
      category: "saas",
      featured: true,
      githubUrl: "https://github.com/gregoire-batcho/nova-crm",
      liveUrl: "https://nova-crm.example.com",
      startDate: "2025-10-01",
      endDate: "2026-02-15"
    },
    {
      id: "proj-titan",
      title: "Titan Cloud API Security Gateway",
      slug: "titan-cloud-api-gateway",
      shortDescription: "High-performance edge reverse proxy and authentication gateway designed for robust container environments.",
      fullDescription: "Titan provides secure, extremely responsive token verification, rate-limiting, and metric logging at the edge of dockerized services. Built to replace expensive enterprise proxies, it supports millions of daily requests with a memory footprint under 30MB. Includes a beautiful developer dashboard displaying active traffic, IP blocking controls, and automated rate profiles.",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=675&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=675&q=80"
      ],
      technologies: ["TypeScript", "Node.js", "Redis", "Docker", "Express", "Recharts"],
      category: "opensource",
      featured: true,
      githubUrl: "https://github.com/gregoire-batcho/titan-gateway",
      liveUrl: "https://titan-gateway.example.com",
      startDate: "2025-05-10",
      endDate: "2025-09-20"
    },
    {
      id: "proj-aether",
      title: "Aether localized mobile calendar",
      slug: "aether-localized-mobile-calendar",
      shortDescription: "Minimalist cross-platform calendar application showcasing premium iOS-style gesture layouts and local push alarms.",
      fullDescription: "Aether is a gorgeous, tactile mobile application centering layout harmony and gesture control. Configured using React Native and calibrated for extreme visual consistency, it lets freelancers map working calendars, draft invoicing logs, and toggle instant alerts.",
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&h=675&q=80"
      ],
      technologies: ["React Native", "TypeScript", "Node.js", "Tailwind CSS"],
      category: "mobile",
      featured: false,
      githubUrl: "https://github.com/gregoire-batcho/aether-app",
      liveUrl: "https://aether-app.example.com",
      startDate: "2024-11-15",
      endDate: "2025-04-01"
    }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Apex Digital Solutions",
      role: "Junior Full Stack Developer",
      description: "Pioneered backend API endpoints handling transactional logistics. Refactored client dashboard using React 19 and Tailwind CSS, speeding up interactive load speeds by 40%. Implemented responsive mobile layouts and synchronized state pipelines.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      startDate: "2025-06-01"
    },
    {
      id: "exp-2",
      company: "Synapse Labs",
      role: "Full Stack Developer Intern",
      description: "Assisted in the design and prototyping of database schemas via Mongoose models. Crafted automated testing scripts running Mocha/Chai, raising code deployment reliability to 98.5%. Built localized landing layouts and verified cross-device accessibility benchmarks.",
      technologies: ["JavaScript", "Express", "MongoDB", "Git", "Figma"],
      startDate: "2024-09-01",
      endDate: "2025-04-30"
    }
  ],
  softSkills: [
    {
      id: "soft-1",
      title: "Rigor & Precision",
      description: "Committed to robust type safety, comprehensive specification compliance, and neat pixel alignment across responsive viewports.",
      icon: "Shield"
    },
    {
      id: "soft-2",
      title: "Empathetic Communication",
      description: "Thrive inside collaborative tech partnerships. Skilled at matching highly complex engineering choices to human-friendly summaries.",
      icon: "MessageSquareCode"
    },
    {
      id: "soft-3",
      title: "Creative Problem Solving",
      description: "Equipped with a deep learning agility to isolate bottle-necks, model data schemes, and design lightweight standalone utilities.",
      icon: "Cpu"
    }
  ],
  messages: [],
  seoSettings: {
    siteTitle: "Grégoire BATCHO | Junior Full Stack Developer",
    metaDescription: "Professional Full-Stack Developer Portfolio for Grégoire BATCHO. High-end dark theme design showcasing interactive works, timeline, and custom admin controller.",
    keywords: ["Grégoire Batcho", "Batcho", "Full Stack Developer", "Developer", "Paris Developer", "React Portfolio", "Express", "MongoDB"]
  },
  projectCategories: [
    { id: "web", nameEn: "Web App", nameFr: "Application Web" },
    { id: "saas", nameEn: "SaaS Solution", nameFr: "Solution SaaS" },
    { id: "mobile", nameEn: "Mobile Application", nameFr: "Application Mobile" },
    { id: "opensource", nameEn: "Open Source", nameFr: "Open Source" }
  ]
};

// Database class to read and write atomically
class DatabaseStore {
  private data: DatabaseSchema;
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private isMongoConnected: boolean = false;
  private mongoInitPromise: Promise<void> | null = null;

  constructor() {
    this.data = { ...defaultData };
    this.init();
    this.mongoInitPromise = this.initMongo().catch(e => {
      console.warn("MongoDB startup synchronization failed:", e);
    });
  }

  public async ensureConnected(): Promise<void> {
    if (!process.env.MONGODB_URI) {
      return;
    }
    if (this.mongoInitPromise) {
      await this.mongoInitPromise;
    }
  }

  private init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log("Database initialized successfully from existing persistent store.");
      } else {
        this.save();
        console.log("Initialized new database file portfolio-db.json with default sample data.");
      }
    } catch (e) {
      console.error("Failed to load local portfolio-db.json: ", e);
    }
  }

  private async initMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log("No MONGODB_URI found in environment. Operating in Local persistent JSON file mode.");
      return;
    }

    try {
      this.mongoClient = new MongoClient(uri);
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db('portfolio');
      this.isMongoConnected = true;
      console.log("🚀 Successfully connected to MongoDB Atlas! Synchronizing cache...");

      // Fetch Profile
      const remoteProfile = await this.mongoDb.collection('profile').findOne({ id: 'active-profile' });
      if (remoteProfile) {
        const { _id, ...cleanProfile } = remoteProfile as any;
        this.data.profile = cleanProfile as Profile;
      } else {
        await this.mongoDb.collection('profile').updateOne(
          { id: 'active-profile' },
          { $set: { id: 'active-profile', ...this.data.profile } },
          { upsert: true }
        );
      }

      // Fetch Technologies
      const remoteTechs = await this.mongoDb.collection('technologies').find({}).toArray();
      if (remoteTechs.length > 0) {
        this.data.technologies = remoteTechs.map(({ _id, ...rest }) => rest) as any;
      } else {
        await this.mongoDb.collection('technologies').insertMany(this.data.technologies);
      }

      // Fetch Projects
      const remoteProjects = await this.mongoDb.collection('projects').find({}).toArray();
      if (remoteProjects.length > 0) {
        this.data.projects = remoteProjects.map(({ _id, ...rest }) => rest) as any;
      } else {
        await this.mongoDb.collection('projects').insertMany(this.data.projects);
      }

      // Fetch Experiences
      const remoteExp = await this.mongoDb.collection('experiences').find({}).toArray();
      if (remoteExp.length > 0) {
        this.data.experiences = remoteExp.map(({ _id, ...rest }) => rest) as any;
      } else {
        await this.mongoDb.collection('experiences').insertMany(this.data.experiences);
      }

      // Fetch SoftSkills
      const remoteSoft = await this.mongoDb.collection('softskills').find({}).toArray();
      if (remoteSoft.length > 0) {
        this.data.softSkills = remoteSoft.map(({ _id, ...rest }) => rest) as any;
      } else {
        await this.mongoDb.collection('softskills').insertMany(this.data.softSkills);
      }

      // Fetch Messages
      const remoteMsg = await this.mongoDb.collection('messages').find({}).sort({ createdAt: -1 }).toArray();
      if (remoteMsg.length > 0) {
        this.data.messages = remoteMsg.map(({ _id, ...rest }) => rest) as any;
      } else if (this.data.messages.length > 0) {
        await this.mongoDb.collection('messages').insertMany(this.data.messages);
      }

      // Fetch Categories
      const remoteCats = await this.mongoDb.collection('projectCategories').find({}).toArray();
      if (remoteCats.length > 0) {
        this.data.projectCategories = remoteCats.map(({ _id, ...rest }) => rest) as any;
      } else {
        await this.mongoDb.collection('projectCategories').insertMany(this.data.projectCategories);
      }

      // Fetch SEO
      const remoteSEO = await this.mongoDb.collection('seoSettings').findOne({ id: 'active-seo' });
      if (remoteSEO) {
        const { _id, ...cleanSeo } = remoteSEO as any;
        this.data.seoSettings = cleanSeo as SEOSettings;
      } else {
        await this.mongoDb.collection('seoSettings').updateOne(
          { id: 'active-seo' },
          { $set: { id: 'active-seo', ...this.data.seoSettings } },
          { upsert: true }
        );
      }

      this.save();
      console.log("✅ Local cache successfully hot-synchronized with MongoDB Atlas instance.");
    } catch (e) {
      console.error("❌ Failed to bind MongoDB Atlas sync connection. Operating in fallback modes:", e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to write to portfolio-db.json: ", e);
    }
  }

  // Helper helper to write background async to avoid blocking HTTP threads
  private async syncMongoItem(colName: string, query: object, doc: object, isDelete = false) {
    if (!this.isMongoConnected || !this.mongoDb) return;
    try {
      if (isDelete) {
        await this.mongoDb.collection(colName).deleteOne(query);
      } else {
        await this.mongoDb.collection(colName).updateOne(query, { $set: doc }, { upsert: true });
      }
    } catch (err) {
      console.error(`MongoDB update failed for collection ${colName}:`, err);
    }
  }

  // Getters
  public async getProfile(): Promise<Profile> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteProfile = await this.mongoDb.collection('profile').findOne({ id: 'active-profile' });
      if (remoteProfile) {
        const { _id, ...cleanProfile } = remoteProfile as any;
        return cleanProfile as Profile;
      }
    }
    return this.data.profile;
  }

  public async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    await this.ensureConnected();
    this.data.profile = { ...this.data.profile, ...profile };
    this.save();
    await this.syncMongoItem('profile', { id: 'active-profile' }, this.data.profile);
    return this.data.profile;
  }

  public async getTechnologies(): Promise<Technology[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteTechs = await this.mongoDb.collection('technologies').find({}).toArray();
      if (remoteTechs.length > 0) {
        return remoteTechs.map(({ _id, ...rest }) => rest) as any;
      }
    }
    return this.data.technologies;
  }

  public async addTechnology(tech: Omit<Technology, 'id'>): Promise<Technology> {
    await this.ensureConnected();
    const id = `tech-${Date.now()}`;
    const newTech = { id, ...tech };
    this.data.technologies.push(newTech);
    this.save();
    await this.syncMongoItem('technologies', { id }, newTech);
    return newTech;
  }

  public async updateTechnology(id: string, tech: Partial<Technology>): Promise<Technology> {
    await this.ensureConnected();
    const index = this.data.technologies.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Technology not found");
    this.data.technologies[index] = { ...this.data.technologies[index], ...tech };
    this.save();
    await this.syncMongoItem('technologies', { id }, this.data.technologies[index]);
    return this.data.technologies[index];
  }

  public async deleteTechnology(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.technologies = this.data.technologies.filter(t => t.id !== id);
    this.save();
    await this.syncMongoItem('technologies', { id }, {}, true);
  }

  public async getProjects(): Promise<Project[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteProjects = await this.mongoDb.collection('projects').find({}).toArray();
      if (remoteProjects.length > 0) {
        return remoteProjects.map(({ _id, ...rest }) => rest) as any;
      }
    }
    return this.data.projects;
  }

  public async addProject(proj: Omit<Project, 'id'>): Promise<Project> {
    await this.ensureConnected();
    const id = `proj-${Date.now()}`;
    const newProj = { id, ...proj };
    this.data.projects.push(newProj);
    this.save();
    await this.syncMongoItem('projects', { id }, newProj);
    return newProj;
  }

  public async updateProject(id: string, proj: Partial<Project>): Promise<Project> {
    await this.ensureConnected();
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Project not found");
    this.data.projects[index] = { ...this.data.projects[index], ...proj };
    this.save();
    await this.syncMongoItem('projects', { id }, this.data.projects[index]);
    return this.data.projects[index];
  }

  public async deleteProject(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.save();
    await this.syncMongoItem('projects', { id }, {}, true);
  }

  public async getExperiences(): Promise<Experience[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteExp = await this.mongoDb.collection('experiences').find({}).toArray();
      if (remoteExp.length > 0) {
        return remoteExp.map(({ _id, ...rest }) => rest) as any;
      }
    }
    return this.data.experiences;
  }

  public async addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    await this.ensureConnected();
    const id = `exp-${Date.now()}`;
    const newExp = { id, ...exp };
    this.data.experiences.push(newExp);
    this.save();
    await this.syncMongoItem('experiences', { id }, newExp);
    return newExp;
  }

  public async updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
    await this.ensureConnected();
    const index = this.data.experiences.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Experience not found");
    this.data.experiences[index] = { ...this.data.experiences[index], ...exp };
    this.save();
    await this.syncMongoItem('experiences', { id }, this.data.experiences[index]);
    return this.data.experiences[index];
  }

  public async deleteExperience(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.experiences = this.data.experiences.filter(e => e.id !== id);
    this.save();
    await this.syncMongoItem('experiences', { id }, {}, true);
  }

  public async getSoftSkills(): Promise<SoftSkill[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteSoft = await this.mongoDb.collection('softskills').find({}).toArray();
      if (remoteSoft.length > 0) {
        return remoteSoft.map(({ _id, ...rest }) => rest) as any;
      }
    }
    return this.data.softSkills;
  }

  public async addSoftSkill(skill: Omit<SoftSkill, 'id'>): Promise<SoftSkill> {
    await this.ensureConnected();
    const id = `soft-${Date.now()}`;
    const newSkill = { id, ...skill };
    this.data.softSkills.push(newSkill);
    this.save();
    await this.syncMongoItem('softskills', { id }, newSkill);
    return newSkill;
  }

  public async updateSoftSkill(id: string, skill: Partial<SoftSkill>): Promise<SoftSkill> {
    await this.ensureConnected();
    const index = this.data.softSkills.findIndex(s => s.id === id);
    if (index === -1) throw new Error("SoftSkill not found");
    this.data.softSkills[index] = { ...this.data.softSkills[index], ...skill };
    this.save();
    await this.syncMongoItem('softskills', { id }, this.data.softSkills[index]);
    return this.data.softSkills[index];
  }

  public async deleteSoftSkill(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.softSkills = this.data.softSkills.filter(s => s.id !== id);
    this.save();
    await this.syncMongoItem('softskills', { id }, {}, true);
  }

  public async getMessages(): Promise<ContactMessage[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteMsg = await this.mongoDb.collection('messages').find({}).sort({ createdAt: -1 }).toArray();
      return remoteMsg.map(({ _id, ...rest }) => rest) as any;
    }
    return this.data.messages;
  }

  public async addMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    await this.ensureConnected();
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      id,
      ...msg,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    this.data.messages.unshift(newMsg);
    this.save();
    await this.syncMongoItem('messages', { id }, newMsg);
    return newMsg;
  }

  public async markMessageAsRead(id: string): Promise<ContactMessage> {
    await this.ensureConnected();
    const index = this.data.messages.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Message not found");
    this.data.messages[index].status = 'read';
    this.save();
    await this.syncMongoItem('messages', { id }, this.data.messages[index]);
    return this.data.messages[index];
  }

  public async deleteMessage(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    this.save();
    await this.syncMongoItem('messages', { id }, {}, true);
  }

  public async getSEOSettings(): Promise<SEOSettings> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteSEO = await this.mongoDb.collection('seoSettings').findOne({ id: 'active-seo' });
      if (remoteSEO) {
        const { _id, ...cleanSeo } = remoteSEO as any;
        return cleanSeo as SEOSettings;
      }
    }
    return this.data.seoSettings;
  }

  public async updateSEOSettings(settings: Partial<SEOSettings>): Promise<SEOSettings> {
    await this.ensureConnected();
    this.data.seoSettings = { ...this.data.seoSettings, ...settings };
    this.save();
    await this.syncMongoItem('seoSettings', { id: 'active-seo' }, this.data.seoSettings);
    return this.data.seoSettings;
  }

  // Project Categories CRUD
  public async getProjectCategories(): Promise<ProjectCategory[]> {
    await this.ensureConnected();
    if (this.isMongoConnected && this.mongoDb) {
      const remoteCats = await this.mongoDb.collection('projectCategories').find({}).toArray();
      if (remoteCats.length > 0) {
        return remoteCats.map(({ _id, ...rest }) => rest) as any;
      }
    }
    return this.data.projectCategories || [];
  }

  public async addProjectCategory(category: Omit<ProjectCategory, 'id'> & { id?: string }): Promise<ProjectCategory> {
    await this.ensureConnected();
    const id = category.id || `cat-${Date.now()}`;
    const newCat = { id, ...category };
    if (!this.data.projectCategories) this.data.projectCategories = [];
    this.data.projectCategories.push(newCat);
    this.save();
    await this.syncMongoItem('projectCategories', { id }, newCat);
    return newCat;
  }

  public async updateProjectCategory(id: string, category: Partial<ProjectCategory>): Promise<ProjectCategory> {
    await this.ensureConnected();
    const index = this.data.projectCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    this.data.projectCategories[index] = { ...this.data.projectCategories[index], ...category };
    this.save();
    await this.syncMongoItem('projectCategories', { id }, this.data.projectCategories[index]);
    return this.data.projectCategories[index];
  }

  public async deleteProjectCategory(id: string): Promise<void> {
    await this.ensureConnected();
    this.data.projectCategories = (this.data.projectCategories || []).filter(c => c.id !== id);
    this.save();
    await this.syncMongoItem('projectCategories', { id }, {}, true);
  }
}

export const db = new DatabaseStore();

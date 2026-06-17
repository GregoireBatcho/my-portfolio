import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { 
  Project as MongooseProject, 
  ContactMessage as MongooseContact,
  Experience as MongooseExperience,
  Technology as MongooseTechnology,
  Profile as MongooseProfile
} from './server/models.js';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gregoire-batcho-portfolio-jwt-secret-2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'Admin2026Portfolio!';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'batchogregoire0@gmail.com';

app.use(express.json());

// In-memory fallback database for offline/trial development
let memoryProjects = [
  {
    _id: 'mem-proj-1',
    title: 'Aura Canvas',
    slug: 'aura-canvas',
    descriptionFr: 'Une plateforme de collaboration visuelle en temps réel offrant des tableaux blancs partagés, des synchronisations de curseurs fluides à faible latence et une architecture optimisée. Idéale pour les sessions d’idéation d’équipes d’ingénierie distantes.',
    descriptionEn: 'A real-time collaborative visual workspace featuring rich shared whiteboards, low-latency cursor synchronization, and an optimized frame architecture. Built to supercharge remote engineering teams during planning.',
    shortDescriptionFr: 'Tableaux blancs collaboratifs en temps réel avec curseurs dynamiques.',
    shortDescriptionEn: 'Real-time collaborative visual whiteboards with live cursor sync.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/grg-batcho/aura-canvas',
    liveUrl: 'https://aura-canvas.gregoirebatcho.dev',
    tags: ['React', 'TypeScript', 'WebSockets', 'Canvas API', 'Tailwind CSS'],
    category: 'fullstack' as const,
    isFeatured: true,
    order: 1
  },
  {
    _id: 'mem-proj-2',
    title: 'Khepri Ledger',
    slug: 'khepri-ledger',
    descriptionFr: 'Un tableau de bord financier de pointe conçu pour le suivi des actifs spéculatifs et traditionnels. Il intègre des algorithmes de réconciliation automatique de balances, des analyses de tendances par IA et des rapports SVG d’une précision chirurgicale.',
    descriptionEn: 'A high-end financial tracing app tailored for digital and legacy asset portfolios. Equipped with automatic balance reconciliation algorithms, predictive trend calculations, and pixel-perfect SVG visualizers.',
    shortDescriptionFr: 'Suivi de portefeuille d’actifs de pointe avec calculs de tendances.',
    shortDescriptionEn: 'Premium fintech ledger displaying comprehensive asset trends.',
    image: 'https://images.unsplash.com/photo-1642156826620-30894fe9eedc?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/grg-batcho/khepri-ledger',
    liveUrl: 'https://khepri-ledger.gregoirebatcho.dev',
    tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Chart.js', 'Tailwind'],
    category: 'fullstack' as const,
    isFeatured: true,
    order: 2
  },
  {
    _id: 'mem-proj-3',
    title: 'Helios DevTools',
    slug: 'helios-devtools',
    descriptionFr: 'Un bac à sable utilitaire minimaliste affichant la performance des serveurs, des testeurs de paquets réseau, des mesures de latence microseconde et un gestionnaire de schémas d’API. Conçu pour le confort ergonomique des développeurs système.',
    descriptionEn: 'A minimalist utility sandbox reporting backend server loads, system packets, latency rates, and customizable API schemas. Created to optimize developers workflows in terminal-inspired viewports.',
    shortDescriptionFr: 'Environnement sandbox de surveillance et testeurs réseau.',
    shortDescriptionEn: 'Minimalist terminal utility tracker for server performance metrics.',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/grg-batcho/helios-devtools',
    liveUrl: 'https://helios-devtools.gregoirebatcho.dev',
    tags: ['React', 'Vite', 'Node.js', 'Tailwind CSS', 'esbuild', 'TypeScript'],
    category: 'frontend' as const,
    isFeatured: false,
    order: 3
  },
  {
    _id: 'mem-proj-4',
    title: 'Stripe-Inspired CMS',
    slug: 'stripe-cms',
    descriptionFr: 'Un système d’administration épuré doté d’animations fluides de transition d’onglets, de visualisations de schémas de base de données à la volée et d’un éditeur de blocs WYSIWYG ultra réactif pour la gestion d’articles de blog ou d’actifs.',
    descriptionEn: 'An administrator workspace crafted with sleek fluid drawer transitions, dynamic database schema viewports, and highly responsive text layout editors for managing posts and files seamlessly.',
    shortDescriptionFr: 'Interface d’administration et éditeur de contenu inspiré de Stripe.',
    shortDescriptionEn: 'Elegant dashboard & dynamic content editor with high-contrast UI.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/grg-batcho/stripe-cms',
    liveUrl: 'https://stripe-cms.gregoirebatcho.dev',
    tags: ['React', 'Tailwind CSS', 'motion', 'JWT Auth', 'MongoDB'],
    category: 'fullstack' as const,
    isFeatured: true,
    order: 4
  }
];

let memoryMessages = [
  {
    _id: 'mem-msg-1',
    name: 'Sarah Dubreuil',
    email: 'sarah.d@techcorp.fr',
    subject: 'Opportunité Projet Freelance',
    message: 'Bonjour Grégoire, nous avons apprécié la finition visuelle de vos travaux. Avez-vous de la disponibilité pour accompagner notre équipe produit sur la refonte de notre plateforme SaaS le mois prochain ? Au plaisir d’en discuter !',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  },
  {
    _id: 'mem-msg-2',
    name: 'Alexandre Mercer',
    email: 'alex@innovate.tech',
    subject: 'Intéressement Profil Full Stack',
    message: 'Hello Grégoire! I saw your portfolio on GitHub. Your design style is highly clean. Let’s connect to schedule a call about a permanent Developer position in Abidjan / remote. Have a great day!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isRead: true
  }
];

let memoryExperiences = [
  {
    _id: 'mem-exp-1',
    periodEn: '2025 - Present',
    periodFr: '2025 - Présent',
    roleEn: 'Full Stack Developer (Freelance)',
    roleFr: 'Développeur Full Stack (Freelance)',
    company: 'Self-employed / Consulting',
    descriptionEn: 'Architecting custom visual content management systems, responsive landing matrices, and robust database microservices for high-velocity startups. Managing deployment scaling pipelines using Docker containers on Cloud ecosystems.',
    descriptionFr: 'Conception de systèmes de gestion de contenu visuels sur-mesure, de matrices de capture d’audience réactives et de microservices de bases de données sécurisés pour des start-ups. Orchestration des déploiements via des conteneurs Docker.',
    skills: ['React 19', 'Node.js', 'Express', 'Mongoose', 'Tailwind CSS', 'Docker'],
    type: 'work',
    order: 1
  },
  {
    _id: 'mem-exp-2',
    periodEn: '2024 - 2025',
    periodFr: '2024 - 2025',
    roleEn: 'Junior Full Stack Engineer (Apprentice)',
    roleFr: 'Ingénieur Full Stack Junior (Apprenti)',
    company: 'Tech Dynamics SAS',
    descriptionEn: 'Collaborated with engineering squads on designing API gateways, improving security protections, and writing modular frontend state controllers. Reduced bundle sizes by 28% and enhanced SEO ratings across multiple product screens.',
    descriptionFr: 'Collaboration active au sein d’équipes d’ingénierie sur le développement de passerelles d’API, le renforcement de la sécurité des sessions et l’écriture de contrôleurs d’états modulaires. Réduction de taille des bundles de 28%.',
    skills: ['TypeScript', 'Next.js Router', 'PostgreSQL', 'Sequelize', 'REST APIs', 'Git'],
    type: 'work',
    order: 2
  },
  {
    _id: 'mem-exp-3',
    periodEn: '2022 - 2024',
    periodFr: '2022 - 2024',
    roleEn: 'Advanced Degree in Computer Science',
    roleFr: 'Diplôme d’Études Supérieures en Informatique',
    company: 'Institut Technologique Supérieur',
    descriptionEn: 'Rigorous academic research around data complexity limits, relational schema structures, indexing configurations, and object-oriented architectures. Excelled in collaborative hackathons and open source collectives.',
    descriptionFr: 'Formation académique rigoureuse axée sur la complexité algorithmique, la modélisation relationnelle (normalisation SQL), l’écriture d’architectures logicielles orientées objet et des hackathons collectifs.',
    skills: ['Data Structures', 'C++', 'Relational Database', 'Tailwind CSS', 'Software Design'],
    type: 'education',
    order: 3
  }
];

let memoryTechnologies = [
  {
    _id: 'mem-tech-1',
    name: 'React 19',
    category: 'frontend',
    icon: 'Atom',
    level: 95,
    order: 1
  },
  {
    _id: 'mem-tech-2',
    name: 'TypeScript',
    category: 'frontend',
    icon: 'Code',
    level: 90,
    order: 2
  },
  {
    _id: 'mem-tech-3',
    name: 'Tailwind CSS',
    category: 'frontend',
    icon: 'Layers',
    level: 95,
    order: 3
  },
  {
    _id: 'mem-tech-4',
    name: 'Node.js & Express',
    category: 'backend',
    icon: 'Terminal',
    level: 90,
    order: 4
  },
  {
    _id: 'mem-tech-5',
    name: 'MongoDB / Mongoose',
    category: 'database',
    icon: 'Database',
    level: 88,
    order: 5
  },
  {
    _id: 'mem-tech-6',
    name: 'Docker',
    category: 'tools',
    icon: 'Cpu',
    level: 78,
    order: 6
  },
  {
    _id: 'mem-tech-7',
    name: 'Git & CI/CD',
    category: 'tools',
    icon: 'GitBranch',
    level: 85,
    order: 7
  }
];

let memoryProfile = {
  _id: 'mem-prof-1',
  name: 'Grégoire BATCHO',
  email: 'batchogregoire0@gmail.com',
  titleEn: 'Junior Full Stack Developer',
  titleFr: 'Développeur Full Stack Junior',
  bioEn: 'Builder of high-performance, elegant, and user-centric web applications. Inspired by clean, robust, and meaningful design philosophies.',
  bioFr: 'Concepteur d’applications web ultra-performantes, élégantes et centrées sur l’expérience utilisateur. Inspiré par les philosophies de design épurées et robustes.',
  aboutBioEn: 'Passionate about the synergy between neat code and meticulous user interface design, I build stable, efficient systems. My methodology takes inspiration from Scandinavian simplicity and industrial execution: every line of code must deliver efficiency, and every pixel must serve a purpose.',
  aboutBioFr: 'Passionné par la synergie entre un code élégant et un design minutieux, je conçois des systèmes stables et réactifs. Mon approche s’inspire de la simplicité scandinave et de l’efficacité industrielle : chaque ligne de code doit servir la performance, et chaque pixel doit guider l’utilisateur.',
  avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  socialGithub: 'https://github.com/grg-batcho',
  socialLinkedin: 'https://linkedin.com/in/grg-batcho',
  socialTwitter: '',
  phone: '+33 6 00 00 00 00',
  cvName: 'CV_Gregoire_Batcho.pdf',
  cvData: '' // stored Base64
};

// Asynchronous MongoDB connection pool with timeout protection
let isMongoConnected = false;

async function seedDatabase() {
  if (!isMongoConnected) return;
  try {
    // 1. Projects
    const projectsCount = await MongooseProject.countDocuments();
    if (projectsCount === 0) {
      console.log('🌱 Seeding default projects into MongoDB Atlas...');
      await MongooseProject.insertMany(memoryProjects.map(p => {
        const { _id, ...rest } = p;
        return rest;
      }));
    }

    // 2. Profile
    const profileCount = await MongooseProfile.countDocuments();
    if (profileCount === 0) {
      console.log('🌱 Seeding default profile into MongoDB Atlas...');
      const { _id, ...rest } = memoryProfile;
      const newProfile = new MongooseProfile(rest);
      await newProfile.save();
    }

    // 3. Experience
    const expCount = await MongooseExperience.countDocuments();
    if (expCount === 0) {
      console.log('🌱 Seeding default experiences into MongoDB Atlas...');
      await MongooseExperience.insertMany(memoryExperiences.map(e => {
        const { _id, ...rest } = e;
        return rest;
      }));
    }

    // 4. Technology
    const techCount = await MongooseTechnology.countDocuments();
    if (techCount === 0) {
      console.log('🌱 Seeding default technologies into MongoDB Atlas...');
      await MongooseTechnology.insertMany(memoryTechnologies.map(t => {
        const { _id, ...rest } = t;
        return rest;
      }));
    }
    console.log('🌱 MongoDB Atlas database seeding checks completed.');
  } catch (err: any) {
    console.error('Error seeding Atlas database:', err.message);
  }
}

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('username:password')) {
    console.warn('⚠️ MONGO_URI is unset or default. Running in-memory database mode.');
    return;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    await seedDatabase();
  } catch (error: any) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    console.warn('⚠️ Server fallback activated: using high-quality in-memory local state.');
  }
}
connectToMongo();

// Lazy initialization for Resend Service to prevent crash on startup if API key unset
let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      resendClient = new Resend(key);
      console.log('✅ Resend Email module initialized successfully.');
    } else {
      console.warn('⚠️ RESEND_API_KEY is unset or dummy. Emails will be output to server console.');
    }
  }
  return resendClient;
}

// Security Middleware checking JWT Admin authorizations
function authenticateAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or token is invalid.' });
    }
    if (decoded?.role !== 'admin' && decoded?.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Unauthorized credentials.' });
    }
    req.admin = decoded;
    next();
  });
}

/** ----------------------------------------------------
 *                     API ROUTES
 * --------------------------------------------------- */

// Standard Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isMongoConnected ? 'mongodb-atlas' : 'local-memory',
    emailModule: process.env.RESEND_API_KEY ? 'active' : 'simulation',
  });
});

// Admin Authentication login endpoint
app.post('/api/auth/login', (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ error: 'Passcode is required.' });
  }

  if (passcode === ADMIN_PASSCODE) {
    // Session token signed for admin
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({ token, email: ADMIN_EMAIL });
  }

  return res.status(401).json({ error: 'Invalid passcode credentials.' });
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbProjects = await MongooseProject.find().sort({ order: 1 });
      return res.json(dbProjects);
    }
    return res.json(memoryProjects);
  } catch (error: any) {
    console.error('Error fetching projects, falling back to memory:', error);
    return res.json(memoryProjects);
  }
});

// POST create project (admin protected)
app.post('/api/projects', authenticateAdmin, async (req, res) => {
  try {
    const projectData = req.body;
    if (isMongoConnected) {
      const newProject = new MongooseProject(projectData);
      await newProject.save();
      return res.status(201).json(newProject);
    }
    
    const newProject = {
      _id: 'mem-proj-' + Date.now(),
      ...projectData,
      isFeatured: !!projectData.isFeatured,
      order: Number(projectData.order) || 0,
      tags: Array.isArray(projectData.tags) ? projectData.tags : (projectData.tags?.split(',').map((t: string) => t.trim()) || [])
    };
    memoryProjects.push(newProject);
    memoryProjects.sort((a, b) => a.order - b.order);
    return res.status(201).json(newProject);
  } catch (error: any) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: error.message || 'Failed to create project.' });
  }
});

// PUT update project (admin protected)
app.put('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MongooseProject.findByIdAndUpdate(id, projectData, { new: true });
        if (updated) return res.json(updated);
      }
      // If not object id (maybe editing default structure), search by slug / temporary field
      const updatedBySlug = await MongooseProject.findOneAndUpdate({ slug: id }, projectData, { new: true });
      if (updatedBySlug) return res.json(updatedBySlug);
      return res.status(404).json({ error: 'Project not found in Atlas DB' });
    }

    const idx = memoryProjects.findIndex(p => p._id === id || p.slug === id);
    if (idx !== -1) {
      const updated = {
        ...memoryProjects[idx],
        ...projectData,
        isFeatured: projectData.isFeatured !== undefined ? !!projectData.isFeatured : memoryProjects[idx].isFeatured,
        order: projectData.order !== undefined ? Number(projectData.order) : memoryProjects[idx].order,
        tags: Array.isArray(projectData.tags) ? projectData.tags : (projectData.tags?.split(',').map((t: string) => t.trim()) || memoryProjects[idx].tags)
      };
      memoryProjects[idx] = updated;
      memoryProjects.sort((a, b) => a.order - b.order);
      return res.json(updated);
    }

    return res.status(404).json({ error: 'Local project not found.' });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: error.message || 'Failed to update project.' });
  }
});

// DELETE project (admin protected)
app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await MongooseProject.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Deleted from Atlas DB' });
      }
      await MongooseProject.findOneAndDelete({ slug: id });
      return res.json({ success: true, message: 'Deleted by slug from Atlas DB' });
    }

    const idx = memoryProjects.findIndex(p => p._id === id || p.slug === id);
    if (idx !== -1) {
      memoryProjects.splice(idx, 1);
      return res.json({ success: true, message: 'Deleted from in-memory array.' });
    }

    return res.status(404).json({ error: 'Project not found.' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete project.' });
  }
});

// POST Send contact message (captures form submissions)
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are mandatory fields.' });
    }

    let saveResult: any;
    if (isMongoConnected) {
      const dbMessage = new MongooseContact({ name, email, subject, message });
      saveResult = await dbMessage.save();
    } else {
      saveResult = {
        _id: 'mem-msg-' + Date.now(),
        name,
        email,
        subject: subject || 'No Subject',
        message,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      memoryMessages.unshift(saveResult);
    }

    // Try sending email via Resend Service
    const sender = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
    const recipient = process.env.NOTIFICATION_EMAIL || ADMIN_EMAIL;
    const resend = getResend();
    let resendMessage = 'not_attempted';
    let resendErrorDetail: any = null;

    if (resend) {
      try {
        const mailResponse = await resend.emails.send({
          from: `Resend <${sender}>`,
          to: recipient,
          subject: `📩 Portfolio: "${subject || 'Nouveau Contact'}" de ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background-color: #0d0d0c; color: #f5f5f4; border-radius: 8px;">
              <h2 style="color: #d97736; border-bottom: 1px solid #27272a; padding-bottom: 12px; font-weight: 500;">Nouveau Message Portfolio</h2>
              <p style="margin: 16px 0;"><strong>Nom :</strong> ${name}</p>
              <p style="margin: 16px 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #d97736; text-decoration: none;">${email}</a></p>
              <p style="margin: 16px 0;"><strong>Sujet :</strong> ${subject || 'Pas de sujet'}</p>
              <div style="background-color: #18181b; padding: 16px; border-radius: 6px; border-left: 4px solid #d97736; line-height: 1.6; margin-top: 20px;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
              <p style="font-size: 11px; color: #71717a; margin-top: 24px; border-top: 1px solid #27272a; padding-top: 12px;">Email généré par votre portfolio Grégoire BATCHO.</p>
            </div>
          `
        });

        if (mailResponse && mailResponse.error) {
          console.error('❌ Failed sending email via Resend API response error:', mailResponse.error);
          resendMessage = 'error';
          resendErrorDetail = mailResponse.error;
        } else {
          console.log(`📧 Resend email sent successfully to ${recipient}. ID:`, mailResponse?.data?.id);
          resendMessage = 'sent';
        }
      } catch (mailError: any) {
        console.error('❌ Failed sending email notification via Resend service API:', mailError);
        resendMessage = 'exception';
        resendErrorDetail = { message: mailError.message || mailError };
      }
    } else {
      // Direct console log fallback message
      console.log('📬 [SIMULATED EMAIL SENDER]');
      console.log(`FROM: ${name} <${email}>`);
      console.log(`TO: ${recipient}`);
      console.log(`SUBJECT: ${subject || 'No Subject'}`);
      console.log(`MESSAGE:\n---\n${message}\n---`);
      resendMessage = 'simulated';
    }

    return res.status(201).json({ 
      success: true, 
      message: 'Message logged successfully.', 
      messageData: saveResult,
      emailStatus: resendMessage,
      emailError: resendErrorDetail,
      debugInfo: {
        usingOnboardingSender: sender === 'onboarding@resend.dev',
        recipient: recipient
      }
    });
  } catch (error: any) {
    console.error('Error storing contact message:', error);
    return res.status(500).json({ error: error.message || 'Failed storing your contact request.' });
  }
});

// GET all contact messages (admin protected)
app.get('/api/contacts', authenticateAdmin, async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbMessages = await MongooseContact.find().sort({ createdAt: -1 });
      return res.json(dbMessages);
    }
    return res.json(memoryMessages);
  } catch (error: any) {
    console.error('Error fetching contact requests:', error);
    return res.json(memoryMessages);
  }
});

// PUT mark contact message as read (admin protected)
app.put('/api/contacts/:id/read', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MongooseContact.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (updated) return res.json(updated);
      }
      return res.status(404).json({ error: 'Message not found in Atlas DB' });
    }

    const idx = memoryMessages.findIndex(m => m._id === id);
    if (idx !== -1) {
      memoryMessages[idx].isRead = true;
      return res.json(memoryMessages[idx]);
    }
    return res.status(404).json({ error: 'Message not found in local memory.' });
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    return res.status(500).json({ error: error.message || 'Failed making update.' });
  }
});


/** ----------------------------------------------------
 *              EXPERIENCES API ENDPOINTS
 * --------------------------------------------------- */

app.get('/api/experiences', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbExp = await MongooseExperience.find().sort({ order: 1 });
      return res.json(dbExp);
    }
    return res.json(memoryExperiences);
  } catch (error: any) {
    console.error('Error fetching experiences, falling back:', error);
    return res.json(memoryExperiences);
  }
});

app.post('/api/experiences', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (isMongoConnected) {
      const newExp = new MongooseExperience(data);
      await newExp.save();
      return res.status(201).json(newExp);
    }

    const newExp = {
      _id: 'mem-exp-' + Date.now(),
      ...data,
      skills: Array.isArray(data.skills) ? data.skills : (data.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || []),
      order: Number(data.order) || 0
    };
    memoryExperiences.push(newExp);
    memoryExperiences.sort((a, b) => a.order - b.order);
    return res.status(201).json(newExp);
  } catch (error: any) {
    console.error('Error creating experience:', error);
    return res.status(500).json({ error: error.message || 'Failed to create experience.' });
  }
});

app.put('/api/experiences/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MongooseExperience.findByIdAndUpdate(id, data, { new: true });
        if (updated) return res.json(updated);
      }
      return res.status(404).json({ error: 'Experience not found in Atlas DB.' });
    }

    const idx = memoryExperiences.findIndex(e => e._id === id);
    if (idx !== -1) {
      const updated = {
        ...memoryExperiences[idx],
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : (data.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || memoryExperiences[idx].skills),
        order: data.order !== undefined ? Number(data.order) : memoryExperiences[idx].order
      };
      memoryExperiences[idx] = updated;
      memoryExperiences.sort((a, b) => a.order - b.order);
      return res.json(updated);
    }
    return res.status(404).json({ error: 'Experience not found in local memory.' });
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return res.status(500).json({ error: error.message || 'Failed to update experience.' });
  }
});

app.delete('/api/experiences/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await MongooseExperience.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Deleted from Atlas DB' });
      }
      return res.status(404).json({ error: 'Experience not found in Atlas DB' });
    }

    const idx = memoryExperiences.findIndex(e => e._id === id);
    if (idx !== -1) {
      memoryExperiences.splice(idx, 1);
      return res.json({ success: true, message: 'Deleted from in-memory.' });
    }
    return res.status(404).json({ error: 'Experience not found.' });
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete experience.' });
  }
});


/** ----------------------------------------------------
 *              TECHNOLOGIES API ENDPOINTS
 * --------------------------------------------------- */

app.get('/api/technologies', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbTech = await MongooseTechnology.find().sort({ order: 1 });
      return res.json(dbTech);
    }
    return res.json(memoryTechnologies);
  } catch (error: any) {
    console.error('Error fetching technologies, falling back:', error);
    return res.json(memoryTechnologies);
  }
});

app.post('/api/technologies', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (isMongoConnected) {
      const newTech = new MongooseTechnology(data);
      await newTech.save();
      return res.status(201).json(newTech);
    }

    const newTech = {
      _id: 'mem-tech-' + Date.now(),
      ...data,
      level: Number(data.level) || 80,
      order: Number(data.order) || 0
    };
    memoryTechnologies.push(newTech);
    memoryTechnologies.sort((a, b) => a.order - b.order);
    return res.status(201).json(newTech);
  } catch (error: any) {
    console.error('Error creating tech:', error);
    return res.status(500).json({ error: error.message || 'Failed to create tech.' });
  }
});

app.put('/api/technologies/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MongooseTechnology.findByIdAndUpdate(id, data, { new: true });
        if (updated) return res.json(updated);
      }
      return res.status(404).json({ error: 'Tech not found in Atlas DB.' });
    }

    const idx = memoryTechnologies.findIndex(t => t._id === id);
    if (idx !== -1) {
      const updated = {
        ...memoryTechnologies[idx],
        ...data,
        level: data.level !== undefined ? Number(data.level) : memoryTechnologies[idx].level,
        order: data.order !== undefined ? Number(data.order) : memoryTechnologies[idx].order
      };
      memoryTechnologies[idx] = updated;
      memoryTechnologies.sort((a, b) => a.order - b.order);
      return res.json(updated);
    }
    return res.status(404).json({ error: 'Tech not found in local memory.' });
  } catch (error: any) {
    console.error('Error updating tech:', error);
    return res.status(500).json({ error: error.message || 'Failed to update tech.' });
  }
});

app.delete('/api/technologies/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await MongooseTechnology.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Deleted from Atlas DB' });
      }
      return res.status(404).json({ error: 'Tech not found in Atlas DB' });
    }

    const idx = memoryTechnologies.findIndex(t => t._id === id);
    if (idx !== -1) {
      memoryTechnologies.splice(idx, 1);
      return res.json({ success: true, message: 'Deleted from in-memory.' });
    }
    return res.status(404).json({ error: 'Tech not found.' });
  } catch (error: any) {
    console.error('Error deleting tech:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete tech.' });
  }
});


/** ----------------------------------------------------
 *              PERSONAL PROFILE & CV ENDPOINTS
 * --------------------------------------------------- */

app.get('/api/profile', async (req, res) => {
  try {
    if (isMongoConnected) {
      const dbProfile = await MongooseProfile.findOne();
      if (dbProfile) {
        // Exclude cvData bytes for lightweight standard requests unless asked
        const profileObj = dbProfile.toObject();
        delete profileObj.cvData;
        return res.json(profileObj);
      }
    }
    // Return standard memoryProfile without cvData bytes by default
    const { cvData, ...lightweightProfile } = memoryProfile;
    return res.json(lightweightProfile);
  } catch (error: any) {
    console.error('Error fetching profile, fallback:', error);
    const { cvData, ...lightweightProfile } = memoryProfile;
    return res.json(lightweightProfile);
  }
});

app.put('/api/profile', authenticateAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (isMongoConnected) {
      let dbProfile = await MongooseProfile.findOne();
      if (!dbProfile) {
        dbProfile = new MongooseProfile(data);
      } else {
        // Update fields individually to avoid wiping anything
        Object.assign(dbProfile, data);
      }
      await dbProfile.save();
      const returnObj = dbProfile.toObject();
      delete returnObj.cvData;
      return res.json(returnObj);
    }

    // Fallback local memory update
    Object.assign(memoryProfile, data);
    const { cvData, ...lightweightProfile } = memoryProfile;
    return res.json(lightweightProfile);
  } catch (error: any) {
    console.error('Error updating personal profile info:', error);
    return res.status(500).json({ error: error.message || 'Failed to update profile.' });
  }
});

app.get('/api/profile/cv', async (req, res) => {
  try {
    let cvBase64 = memoryProfile.cvData;
    let cvName = memoryProfile.cvName || 'CV_Gregoire_Batcho.pdf';

    if (isMongoConnected) {
      const dbProfile = await MongooseProfile.findOne();
      if (dbProfile && dbProfile.cvData) {
        cvBase64 = dbProfile.cvData;
        cvName = dbProfile.cvName || 'CV_Gregoire_Batcho.pdf';
      }
    }

    if (!cvBase64) {
      // Stream neat dummy plain text attachment with appropriate message if resume hasn't been uploaded yet
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="CV_Gregoire_Batcho_Attente.txt"');
      return res.send(
        `==================================================\n` +
        `       CURRICULUM VITAE - GRÉGOIRE BATCHO         \n` +
        `==================================================\n\n` +
        `Email : batchogregoire0@gmail.com\n` +
        `Titre : Développeur Full Stack Junior\n\n` +
        `Note de l'application :\n` +
        `L'administrateur n'a pas encore chargé de fichier CV au format PDF.\n` +
        `Veuillez vous connecter sur le panneau d'administration pour uploader votre CV PDF officiel.`
      );
    }

    // Safely decode and attachment buffer streams back
    const buffer = Buffer.from(cvBase64, 'base64');
    const isPdf = cvName.toLowerCase().endsWith('.pdf');
    res.setHeader('Content-Type', isPdf ? 'application/pdf' : 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(cvName)}"`);
    return res.send(buffer);
  } catch (error: any) {
    console.error('Error streaming CV file:', error);
    return res.status(500).send('Failed streaming CV file. Please try again.');
  }
});


/** ----------------------------------------------------
 *              VITE AND FRONTEND ROUTING
 * --------------------------------------------------- */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to port 3000 to enable reverse proxy to load correctly
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Elite Portfolio Back-end running on http://localhost:${PORT}`);
  });
}

startServer();

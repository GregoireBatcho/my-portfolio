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
  fr: {
    navHome: 'Accueil',
    navAbout: 'À Propos',
    navProjects: 'Projets',
    navExperience: 'Expérience',
    navContact: 'Contact',
    navAdmin: 'Admin',
    heroGreeting: 'Bonjour, je suis',
    heroTitle: 'Développeur Full Stack Junior',
    heroSubtitle: 'Concepteur d’applications web ultra-performantes, élégantes et centrées sur l’expérience utilisateur. Inspiré par les philosophies de design épurées et robustes.',
    heroCtaProjects: 'Voir mes projets',
    heroCtaContact: 'Me contacter',
    aboutTitle: 'À Propos de Moi',
    aboutBio: 'Passionné par la synergie entre un code élégant et un design minutieux, je conçois des systèmes stables et réactifs. Mon approche s’inspire de la simplicité scandinave et de l’efficacité industrielle : chaque ligne de code doit servir la performance, et chaque pixel doit guider l’utilisateur.',
    aboutPhilosophy: 'Philosophie de Développement',
    aboutPh1Title: 'Code Intuitif',
    aboutPh1Desc: 'Écrire un code auto-documenté, modulaire et hautement lisible pour faciliter l’évolution.',
    aboutPh2Title: 'Performance Optimale',
    aboutPh2Desc: 'Assurer des temps de chargement ultra-rapides et une optimisation SEO sans compromis.',
    aboutPh3Title: 'Collaboration Active',
    aboutPh3Desc: 'Échanger en continu pour concrétiser des exigences complexes avec une rigueur absolue.',
    aboutPh4Title: 'Innovation Utile',
    aboutPh4Desc: 'Adopter de nouveaux paradigmes de développement pour résoudre des défis réels.',
    techStackTitle: 'Mes Technologies Phares',
    techStackSubtitle: 'Les outils et langages sur lesquels je m’appuie au quotidien.',
    projectsTitle: 'Portfolio de Projets',
    projectsSubtitle: 'Une sélection d’applications web réelles gérées et déployées.',
    projectsCategoryAll: 'Tous',
    projectsCategoryFrontend: 'Frontend',
    projectsCategoryBackend: 'Backend',
    projectsCategoryFullstack: 'Full Stack',
    projectFeaturedBadge: 'Sélectionné',
    projectNoImage: 'Pas d’image disponible',
    projectBtnLive: 'Visiter le site',
    projectBtnCode: 'Code source',
    experienceTitle: 'Parcours Professionnel',
    experienceSubtitle: 'L’évolution de mes compétences et de ma rigueur à travers diverses étapes clés.',
    contactTitle: 'Rejoignez-moi',
    contactSubtitle: 'Discutons de vos projets, d’opportunités de recrutement ou simplement de tech.',
    contactFormName: 'Nom Complet',
    contactFormEmail: 'Adresse Email',
    contactFormSubject: 'Sujet',
    contactFormMessage: 'Votre message',
    contactFormSubmit: 'Envoyer le message',
    contactFormSending: 'Envoi en cours...',
    contactFormSuccess: 'Votre message a été envoyé avec succès ! Je vous répondrai très prochainement.',
    contactFormError: 'Une erreur est survenue lors de l’envoi. Veuillez réessayer ou m’écrire directement par email.',
    contactInfoDetails: 'Mes Coordonnées',
    contactInfoLocation: 'Localisation',
    contactInfoAbidjan: 'Abidjan, Côte d\'Ivoire / À distance',
    adminLoginTitle: 'Espace Administration',
    adminLoginPasscode: 'Saisir le code secret',
    adminLoginBtn: 'Se connecter',
    adminLoggingIn: 'Connexion...',
    adminError: 'Identifiants ou passcode incorrects.',
    adminDashboardTitle: 'Tableau de Bord',
    adminWelcome: 'Ravi de vous revoir, Grégoire !',
    adminLogout: 'Déconnexion',
    adminTabProjects: 'Gérer les Projets',
    adminTabMessages: 'Messages Reçus',
    adminMessagesCount: 'messages non lus',
    adminMsgName: 'Expéditeur',
    adminMsgSubject: 'Sujet / Message',
    adminMsgDate: 'Date',
    adminMsgActions: 'Actions',
    adminMsgRead: 'Déjà lu',
    adminMsgMarkRead: 'Marquer comme lu',
    adminProjectAdd: 'Ajouter un Projet',
    adminProjectEdit: 'Modifier le Projet',
    adminProjectTitle: 'Titre du projet',
    adminProjectSlug: 'Slug (ex. mon-projet)',
    adminProjectShortFr: 'Description Courte (FR)',
    adminProjectShortEn: 'Description Courte (EN)',
    adminProjectDescFr: 'Description Détaillée (FR)',
    adminProjectDescEn: 'Description Détaillée (EN)',
    adminProjectImage: 'Lien de l’image',
    adminProjectTags: 'Tags (séparés par des virgules)',
    adminProjectGithub: 'Lien GitHub',
    adminProjectLive: 'Lien Live',
    adminProjectCategory: 'Catégorie',
    adminProjectFeatured: 'Mettre en avant sur la page d’accueil',
    adminProjectOrder: 'Ordre d’affichage (nombre)',
    adminProjectSave: 'Enregistrer le projet',
    adminProjectCancel: 'Annuler',
    adminProjectDeleteWarning: 'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.',
    footerCredits: 'Conçu avec passion par Grégoire BATCHO'
  },
  en: {
    navHome: 'Home',
    navAbout: 'About',
    navProjects: 'Projects',
    navExperience: 'Experience',
    navContact: 'Contact',
    navAdmin: 'Admin',
    heroGreeting: 'Hello, I am',
    heroTitle: 'Junior Full Stack Developer',
    heroSubtitle: 'Builder of high-performance, elegant, and user-centric web applications. Inspired by clean, robust, and meaningful design philosophies.',
    heroCtaProjects: 'View My Projects',
    heroCtaContact: 'Get in Touch',
    aboutTitle: 'About Me',
    aboutBio: 'Passionate about the synergy between neat code and meticulous user interface design, I build stable, efficient systems. My methodology takes inspiration from Scandinavian simplicity and industrial execution: every line of code must deliver efficiency, and every pixel must serve a purpose.',
    aboutPhilosophy: 'Development Philosophy',
    aboutPh1Title: 'Intuitive Code',
    aboutPh1Desc: 'Writing modular, self-documented, and highly-readable code to facilitate future upgrades.',
    aboutPh2Title: 'Optimal Speed',
    aboutPh2Desc: 'Ensuring ultra-fast page speeds, seamless performance, and search engine friendliness.',
    aboutPh3Title: 'Active Sync',
    aboutPh3Desc: 'Exchanging continuous updates to conceptualize challenging requirements with utmost accuracy.',
    aboutPh4Title: 'Meaningful Innovation',
    aboutPh4Desc: 'Adopting the edge of modern technology paradigms to solve real-world problems.',
    techStackTitle: 'Key Tech Stack',
    techStackSubtitle: 'The tools and ecosystems I master and implement every day.',
    projectsTitle: 'Projects Portfolio',
    projectsSubtitle: 'A meticulously curated gallery of real-world applications engineered and deployed.',
    projectsCategoryAll: 'All',
    projectsCategoryFrontend: 'Frontend',
    projectsCategoryBackend: 'Backend',
    projectsCategoryFullstack: 'Full Stack',
    projectFeaturedBadge: 'Featured',
    projectNoImage: 'No preview image available',
    projectBtnLive: 'Live application',
    projectBtnCode: 'Source code',
    experienceTitle: 'Professional Timeline',
    experienceSubtitle: 'The continuous progression of my technology skills and operational rigor.',
    contactTitle: 'Reach Out',
    contactSubtitle: 'Let’s talk about custom opportunities, full-time contracts, or cool technologies.',
    contactFormName: 'Full Name',
    contactFormEmail: 'Email Address',
    contactFormSubject: 'Subject',
    contactFormMessage: 'Your message',
    contactFormSubmit: 'Send Message',
    contactFormSending: 'Delivering...',
    contactFormSuccess: 'Your message has been delivered successfully! I will reach out to you very soon.',
    contactFormError: 'An unexpected issue occurred on delivery. Please try again or contact me directly.',
    contactInfoDetails: 'Direct Channels',
    contactInfoLocation: 'Location',
    contactInfoAbidjan: 'Abidjan, Côte d\'Ivoire / Remote available',
    adminLoginTitle: 'Admin Space',
    adminLoginPasscode: 'Enter custom passcode',
    adminLoginBtn: 'Sign In',
    adminLoggingIn: 'Verifying Security...',
    adminError: 'Incorrect passcode credentials.',
    adminDashboardTitle: 'Admin Dashboard',
    adminWelcome: 'Welcome back, Grégoire!',
    adminLogout: 'Logout',
    adminTabProjects: 'Manage Projects',
    adminTabMessages: 'Received Messages',
    adminMessagesCount: 'unread messages',
    adminMsgName: 'Sender',
    adminMsgSubject: 'Subject / Body',
    adminMsgDate: 'Date',
    adminMsgActions: 'Actions',
    adminMsgRead: 'Read',
    adminMsgMarkRead: 'Mark as read',
    adminProjectAdd: 'Add Project',
    adminProjectEdit: 'Modify Project',
    adminProjectTitle: 'Project Title',
    adminProjectSlug: 'Slug (ex. my-project-slug)',
    adminProjectShortFr: 'Short Description (FR)',
    adminProjectShortEn: 'Short Description (EN)',
    adminProjectDescFr: 'Detailed Description (FR)',
    adminProjectDescEn: 'Detailed Description (EN)',
    adminProjectImage: 'Image URL',
    adminProjectTags: 'Tags (comma-separated)',
    adminProjectGithub: 'GitHub Link',
    adminProjectLive: 'Live Link',
    adminProjectCategory: 'Category',
    adminProjectFeatured: 'Pin to Featured in Hero',
    adminProjectOrder: 'Display order (lower is first)',
    adminProjectSave: 'Save Project Details',
    adminProjectCancel: 'Cancel',
    adminProjectDeleteWarning: 'Are you sure you want to permanently delete this project? This process is irreversible.',
    footerCredits: 'Designed & Engineered by Grégoire BATCHO'
  }
};

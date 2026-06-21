module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/server/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
;
;
;
const DATA_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'portfolio-db.json');
const defaultData = {
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
        cvUrl: "/api/cv/download",
        socials: {
            github: "https://github.com/gregoire-batcho",
            linkedin: "https://linkedin.com/in/gregoire-batcho",
            twitter: "https://twitter.com/gregoire_batcho",
            email: "batchogregoire81@gmail.com"
        }
    },
    technologies: [
        // Frontend
        {
            id: "tech-react",
            name: "React 19 / Next.js",
            category: "frontend",
            proficiency: 90,
            yearsExperience: 2
        },
        {
            id: "tech-ts",
            name: "TypeScript",
            category: "frontend",
            proficiency: 85,
            yearsExperience: 2
        },
        {
            id: "tech-tailwind",
            name: "Tailwind CSS",
            category: "frontend",
            proficiency: 95,
            yearsExperience: 2
        },
        {
            id: "tech-motion",
            name: "Framer Motion",
            category: "frontend",
            proficiency: 80,
            yearsExperience: 1
        },
        // Backend
        {
            id: "tech-node",
            name: "Node.js / Express",
            category: "backend",
            proficiency: 85,
            yearsExperience: 2
        },
        {
            id: "tech-nest",
            name: "NestJS",
            category: "backend",
            proficiency: 70,
            yearsExperience: 1
        },
        {
            id: "tech-graphql",
            name: "GraphQL & REST APIs",
            category: "backend",
            proficiency: 80,
            yearsExperience: 2
        },
        // Databases
        {
            id: "tech-mongo",
            name: "MongoDB / Mongoose",
            category: "database",
            proficiency: 85,
            yearsExperience: 2
        },
        {
            id: "tech-postgres",
            name: "PostgreSQL / Prisma",
            category: "database",
            proficiency: 80,
            yearsExperience: 1
        },
        // Mobile
        {
            id: "tech-rn",
            name: "React Native",
            category: "mobile",
            proficiency: 75,
            yearsExperience: 15
        },
        // DevOps
        {
            id: "tech-docker",
            name: "Docker",
            category: "devops",
            proficiency: 75,
            yearsExperience: 1
        },
        {
            id: "tech-cicd",
            name: "GitHub Actions",
            category: "devops",
            proficiency: 70,
            yearsExperience: 1
        },
        {
            id: "tech-cloudrun",
            name: "GCP / Cloud Run",
            category: "devops",
            proficiency: 75,
            yearsExperience: 1
        },
        // Tools
        {
            id: "tech-git",
            name: "Git & Version Control",
            category: "tools",
            proficiency: 90,
            yearsExperience: 3
        },
        {
            id: "tech-figma",
            name: "Figma (UI Design)",
            category: "tools",
            proficiency: 80,
            yearsExperience: 2
        }
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
            technologies: [
                "React",
                "Express",
                "Node.js",
                "MongoDB",
                "Tailwind CSS",
                "Recharts"
            ],
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
            technologies: [
                "TypeScript",
                "Node.js",
                "Redis",
                "Docker",
                "Express",
                "Recharts"
            ],
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
            technologies: [
                "React Native",
                "TypeScript",
                "Node.js",
                "Tailwind CSS"
            ],
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
            technologies: [
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "Tailwind CSS"
            ],
            startDate: "2025-06-01"
        },
        {
            id: "exp-2",
            company: "Synapse Labs",
            role: "Full Stack Developer Intern",
            description: "Assisted in the design and prototyping of database schemas via Mongoose models. Crafted automated testing scripts running Mocha/Chai, raising code deployment reliability to 98.5%. Built localized landing layouts and verified cross-device accessibility benchmarks.",
            technologies: [
                "JavaScript",
                "Express",
                "MongoDB",
                "Git",
                "Figma"
            ],
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
        keywords: [
            "Grégoire Batcho",
            "Batcho",
            "Full Stack Developer",
            "Developer",
            "Paris Developer",
            "React Portfolio",
            "Express",
            "MongoDB"
        ]
    }
};
// Database class to read and write atomically
class DatabaseStore {
    data;
    mongoClient = null;
    mongoDb = null;
    isMongoConnected = false;
    constructor(){
        this.data = {
            ...defaultData
        };
        this.init();
        this.initMongo().catch((e)=>{
            console.warn("MongoDB startup synchronization failed:", e);
        });
    }
    init() {
        try {
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_FILE)) {
                const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(DATA_FILE, 'utf-8');
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
    async initMongo() {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log("No MONGODB_URI found in environment. Operating in Local persistent JSON file mode.");
            return;
        }
        try {
            this.mongoClient = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__["MongoClient"](uri);
            await this.mongoClient.connect();
            this.mongoDb = this.mongoClient.db('portfolio');
            this.isMongoConnected = true;
            console.log("🚀 Successfully connected to MongoDB Atlas! Synchronizing cache...");
            // Fetch Profile
            const remoteProfile = await this.mongoDb.collection('profile').findOne({
                id: 'active-profile'
            });
            if (remoteProfile) {
                const { _id, ...cleanProfile } = remoteProfile;
                this.data.profile = cleanProfile;
            } else {
                await this.mongoDb.collection('profile').updateOne({
                    id: 'active-profile'
                }, {
                    $set: {
                        id: 'active-profile',
                        ...this.data.profile
                    }
                }, {
                    upsert: true
                });
            }
            // Fetch Technologies
            const remoteTechs = await this.mongoDb.collection('technologies').find({}).toArray();
            if (remoteTechs.length > 0) {
                this.data.technologies = remoteTechs.map(({ _id, ...rest })=>rest);
            } else {
                await this.mongoDb.collection('technologies').insertMany(this.data.technologies);
            }
            // Fetch Projects
            const remoteProjects = await this.mongoDb.collection('projects').find({}).toArray();
            if (remoteProjects.length > 0) {
                this.data.projects = remoteProjects.map(({ _id, ...rest })=>rest);
            } else {
                await this.mongoDb.collection('projects').insertMany(this.data.projects);
            }
            // Fetch Experiences
            const remoteExp = await this.mongoDb.collection('experiences').find({}).toArray();
            if (remoteExp.length > 0) {
                this.data.experiences = remoteExp.map(({ _id, ...rest })=>rest);
            } else {
                await this.mongoDb.collection('experiences').insertMany(this.data.experiences);
            }
            // Fetch SoftSkills
            const remoteSoft = await this.mongoDb.collection('softskills').find({}).toArray();
            if (remoteSoft.length > 0) {
                this.data.softSkills = remoteSoft.map(({ _id, ...rest })=>rest);
            } else {
                await this.mongoDb.collection('softskills').insertMany(this.data.softSkills);
            }
            // Fetch Messages
            const remoteMsg = await this.mongoDb.collection('messages').find({}).sort({
                createdAt: -1
            }).toArray();
            if (remoteMsg.length > 0) {
                this.data.messages = remoteMsg.map(({ _id, ...rest })=>rest);
            } else if (this.data.messages.length > 0) {
                await this.mongoDb.collection('messages').insertMany(this.data.messages);
            }
            // Fetch SEO
            const remoteSEO = await this.mongoDb.collection('seoSettings').findOne({
                id: 'active-seo'
            });
            if (remoteSEO) {
                const { _id, ...cleanSeo } = remoteSEO;
                this.data.seoSettings = cleanSeo;
            } else {
                await this.mongoDb.collection('seoSettings').updateOne({
                    id: 'active-seo'
                }, {
                    $set: {
                        id: 'active-seo',
                        ...this.data.seoSettings
                    }
                }, {
                    upsert: true
                });
            }
            this.save();
            console.log("✅ Local cache successfully hot-synchronized with MongoDB Atlas instance.");
        } catch (e) {
            console.error("❌ Failed to bind MongoDB Atlas sync connection. Operating in fallback modes:", e);
        }
    }
    save() {
        try {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (e) {
            console.error("Failed to write to portfolio-db.json: ", e);
        }
    }
    // Helper helper to write background async to avoid blocking HTTP threads
    syncMongoItem(colName, query, doc, isDelete = false) {
        if (!this.isMongoConnected || !this.mongoDb) return;
        const db = this.mongoDb;
        (async ()=>{
            try {
                if (isDelete) {
                    await db.collection(colName).deleteOne(query);
                } else {
                    await db.collection(colName).updateOne(query, {
                        $set: doc
                    }, {
                        upsert: true
                    });
                }
            } catch (err) {
                console.error(`Background MongoDB update failed for collection ${colName}:`, err);
            }
        })();
    }
    // Getters
    getProfile() {
        return this.data.profile;
    }
    updateProfile(profile) {
        this.data.profile = {
            ...this.data.profile,
            ...profile
        };
        this.save();
        this.syncMongoItem('profile', {
            id: 'active-profile'
        }, this.data.profile);
        return this.data.profile;
    }
    getTechnologies() {
        return this.data.technologies;
    }
    addTechnology(tech) {
        const id = `tech-${Date.now()}`;
        const newTech = {
            id,
            ...tech
        };
        this.data.technologies.push(newTech);
        this.save();
        this.syncMongoItem('technologies', {
            id
        }, newTech);
        return newTech;
    }
    updateTechnology(id, tech) {
        const index = this.data.technologies.findIndex((t)=>t.id === id);
        if (index === -1) throw new Error("Technology not found");
        this.data.technologies[index] = {
            ...this.data.technologies[index],
            ...tech
        };
        this.save();
        this.syncMongoItem('technologies', {
            id
        }, this.data.technologies[index]);
        return this.data.technologies[index];
    }
    deleteTechnology(id) {
        this.data.technologies = this.data.technologies.filter((t)=>t.id !== id);
        this.save();
        this.syncMongoItem('technologies', {
            id
        }, {}, true);
    }
    getProjects() {
        return this.data.projects;
    }
    addProject(proj) {
        const id = `proj-${Date.now()}`;
        const newProj = {
            id,
            ...proj
        };
        this.data.projects.push(newProj);
        this.save();
        this.syncMongoItem('projects', {
            id
        }, newProj);
        return newProj;
    }
    updateProject(id, proj) {
        const index = this.data.projects.findIndex((p)=>p.id === id);
        if (index === -1) throw new Error("Project not found");
        this.data.projects[index] = {
            ...this.data.projects[index],
            ...proj
        };
        this.save();
        this.syncMongoItem('projects', {
            id
        }, this.data.projects[index]);
        return this.data.projects[index];
    }
    deleteProject(id) {
        this.data.projects = this.data.projects.filter((p)=>p.id !== id);
        this.save();
        this.syncMongoItem('projects', {
            id
        }, {}, true);
    }
    getExperiences() {
        return this.data.experiences;
    }
    addExperience(exp) {
        const id = `exp-${Date.now()}`;
        const newExp = {
            id,
            ...exp
        };
        this.data.experiences.push(newExp);
        this.save();
        this.syncMongoItem('experiences', {
            id
        }, newExp);
        return newExp;
    }
    updateExperience(id, exp) {
        const index = this.data.experiences.findIndex((e)=>e.id === id);
        if (index === -1) throw new Error("Experience not found");
        this.data.experiences[index] = {
            ...this.data.experiences[index],
            ...exp
        };
        this.save();
        this.syncMongoItem('experiences', {
            id
        }, this.data.experiences[index]);
        return this.data.experiences[index];
    }
    deleteExperience(id) {
        this.data.experiences = this.data.experiences.filter((e)=>e.id !== id);
        this.save();
        this.syncMongoItem('experiences', {
            id
        }, {}, true);
    }
    getSoftSkills() {
        return this.data.softSkills;
    }
    addSoftSkill(skill) {
        const id = `soft-${Date.now()}`;
        const newSkill = {
            id,
            ...skill
        };
        this.data.softSkills.push(newSkill);
        this.save();
        this.syncMongoItem('softskills', {
            id
        }, newSkill);
        return newSkill;
    }
    updateSoftSkill(id, skill) {
        const index = this.data.softSkills.findIndex((s)=>s.id === id);
        if (index === -1) throw new Error("SoftSkill not found");
        this.data.softSkills[index] = {
            ...this.data.softSkills[index],
            ...skill
        };
        this.save();
        this.syncMongoItem('softskills', {
            id
        }, this.data.softSkills[index]);
        return this.data.softSkills[index];
    }
    deleteSoftSkill(id) {
        this.data.softSkills = this.data.softSkills.filter((s)=>s.id !== id);
        this.save();
        this.syncMongoItem('softskills', {
            id
        }, {}, true);
    }
    getMessages() {
        return this.data.messages;
    }
    addMessage(msg) {
        const id = `msg-${Date.now()}`;
        const newMsg = {
            id,
            ...msg,
            status: 'unread',
            createdAt: new Date().toISOString()
        };
        this.data.messages.unshift(newMsg);
        this.save();
        this.syncMongoItem('messages', {
            id
        }, newMsg);
        return newMsg;
    }
    markMessageAsRead(id) {
        const index = this.data.messages.findIndex((m)=>m.id === id);
        if (index === -1) throw new Error("Message not found");
        this.data.messages[index].status = 'read';
        this.save();
        this.syncMongoItem('messages', {
            id
        }, this.data.messages[index]);
        return this.data.messages[index];
    }
    deleteMessage(id) {
        this.data.messages = this.data.messages.filter((m)=>m.id !== id);
        this.save();
        this.syncMongoItem('messages', {
            id
        }, {}, true);
    }
    getSEOSettings() {
        return this.data.seoSettings;
    }
    updateSEOSettings(settings) {
        this.data.seoSettings = {
            ...this.data.seoSettings,
            ...settings
        };
        this.save();
        this.syncMongoItem('seoSettings', {
            id: 'active-seo'
        }, this.data.seoSettings);
        return this.data.seoSettings;
    }
}
const db = new DatabaseStore();
}),
"[project]/src/app/api/auth/helper.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signToken",
    ()=>signToken,
    "verifyRequest",
    ()=>verifyRequest
]);
const SECRET_SALT = process.env.ADMIN_PASSWORD || "gregoire2026";
function signToken() {
    // 1 day expiry
    const payload = {
        admin: true,
        expiry: Date.now() + 24 * 60 * 60 * 1000
    };
    const serialized = JSON.stringify(payload);
    const base64 = Buffer.from(serialized).toString('base64');
    const signature = Buffer.from(serialized + SECRET_SALT).toString('base64').substring(0, 16);
    return `${base64}.${signature}`;
}
function verifyRequest(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.substring(7);
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    try {
        const serialized = Buffer.from(parts[0], 'base64').toString('utf-8');
        const payload = JSON.parse(serialized);
        if (!payload.admin || payload.expiry < Date.now()) return false;
        const computedSignature = Buffer.from(serialized + SECRET_SALT).toString('base64').substring(0, 16);
        return computedSignature === parts[1];
    } catch (_) {
        return false;
    }
}
}),
"[project]/src/app/api/seo/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$auth$2f$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/auth/helper.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].getSEOSettings());
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$auth$2f$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyRequest"])(req)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized: Admin authentication token required'
        }, {
            status: 401
        });
    }
    try {
        const body = await req.json();
        const updated = __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].updateSEOSettings(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updated);
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0yfox08._.js.map
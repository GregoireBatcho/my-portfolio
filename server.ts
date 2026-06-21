import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const aiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (aiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log(
      "Gemini API client initialized successfully in the server context.",
    );
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.warn(
    "GEMINI_API_KEY is not defined in current environments. AI agent will respond with elegant simulated responses.",
  );
}

// Simple authentication token verification (Session token in-memory store)
const ACTIVE_AUTHENTICATED_SESSIONS = new Set<string>();

function isAdminAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (ACTIVE_AUTHENTICATED_SESSIONS.has(token)) {
      return next();
    }
  }
  res
    .status(401)
    .json({ error: "Unauthorized: Admin authentication token required" });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Built-in JSON body parsing
  app.use(express.json({ limit: "10mb" }));

  // ==================== AUTH ENTRIES ====================
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    // Standard secure developer panel password (can also be configured via process.env.ADMIN_PASSWORD)
    const securePassword = process.env.ADMIN_PASSWORD || "gregoire2026";

    if (password === securePassword) {
      const sessionToken = `session_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      ACTIVE_AUTHENTICATED_SESSIONS.add(sessionToken);
      res.json({
        token: sessionToken,
        user: { name: "Grégoire BATCHO", role: "admin" },
      });
    } else {
      res.status(401).json({ error: "Invalid admin credentials." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      ACTIVE_AUTHENTICATED_SESSIONS.delete(token);
    }
    res.json({ success: true });
  });

  // ==================== PROFILE ENTRIES ====================
  app.get("/api/profile", (req, res) => {
    res.json(db.getProfile());
  });

  app.put("/api/profile", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateProfile(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== TECHNOLOGIES ENTRIES ====================
  app.get("/api/technologies", (req, res) => {
    res.json(db.getTechnologies());
  });

  app.post("/api/technologies", isAdminAuthenticated, (req, res) => {
    try {
      const newTech = db.addTechnology(req.body);
      res.status(201).json(newTech);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/technologies/:id", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateTechnology(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/technologies/:id", isAdminAuthenticated, (req, res) => {
    try {
      db.deleteTechnology(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== PROJECTS ENTRIES ====================
  app.get("/api/projects", (req, res) => {
    res.json(db.getProjects());
  });

  app.post("/api/projects", isAdminAuthenticated, (req, res) => {
    try {
      const newProj = db.addProject(req.body);
      res.status(201).json(newProj);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/projects/:id", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateProject(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/projects/:id", isAdminAuthenticated, (req, res) => {
    try {
      db.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== EXPERIENCES ENTRIES ====================
  app.get("/api/experiences", (req, res) => {
    res.json(db.getExperiences());
  });

  app.post("/api/experiences", isAdminAuthenticated, (req, res) => {
    try {
      const newExp = db.addExperience(req.body);
      res.status(201).json(newExp);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/experiences/:id", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateExperience(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/experiences/:id", isAdminAuthenticated, (req, res) => {
    try {
      db.deleteExperience(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== SOFTSKILLS ENTRIES ====================
  app.get("/api/softskills", (req, res) => {
    res.json(db.getSoftSkills());
  });

  app.post("/api/softskills", isAdminAuthenticated, (req, res) => {
    try {
      const newSkill = db.addSoftSkill(req.body);
      res.status(201).json(newSkill);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/softskills/:id", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateSoftSkill(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/softskills/:id", isAdminAuthenticated, (req, res) => {
    try {
      db.deleteSoftSkill(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== MESSAGES / FORM ====================
  app.post("/api/messages", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res
          .status(400)
          .json({ error: "All fields are strictly required." });
      }

      // Add to Database (simulating MongoDB persistence)
      const savedMsg = db.addMessage({ name, email, subject, message });

      // Resend API alert configuration
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          console.log(
            `[Resend Alert] Attempting real mail dispatch for ${name}...`,
          );
          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: "Portfolio Contact <onboarding@resend.dev>",
              to: "batchogregoire0@gmail.com",
              subject: `[Contact Portfolio] ${subject} - from ${name}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; padding: 24px; background: #0c0a09; color: #f5f5f4; border-radius: 12px; border: 1px solid #d97736;">
                  <h2 style="color: #d97736; border-bottom: 2px solid #292524; padding-bottom: 12px; margin-top: 0;">New Contact Form Message</h2>
                  <p><strong>Sender Name:</strong> ${name}</p>
                  <p><strong>Sender Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <div style="background: #1c1917; padding: 16px; border-radius: 8px; border-left: 4px solid #d97736; margin: 20px 0;">
                    <p style="margin: 0; white-space: pre-line; line-height: 1.6;">${message}</p>
                  </div>
                  <p style="font-size: 11px; color: #a8a29e; margin-bottom: 0;">Submitted via portfolio-db.json dynamic tracking engine.</p>
                </div>
              `,
            }),
          });
          const resendJson = await resendResponse.json();
          console.log(`[Resend OK] Email dispatched correctly:`, resendJson);
        } catch (mailError) {
          console.error("Resend delivery failed but data saved:", mailError);
        }
      } else {
        console.log("=========================================");
        console.log(`[SIMULATED EMAIL NOTIFICATION VIA RESEND]`);
        console.log(`To: batchogregoire0@gmail.com`);
        console.log(`From: portfolio-contact@gregoire.net`);
        console.log(`Subject: [Contact Portfolio] ${subject} - from ${name}`);
        console.log(`Body: ${message}`);
        console.log("=========================================");
      }

      res.status(201).json(savedMsg);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/messages", isAdminAuthenticated, (req, res) => {
    res.json(db.getMessages());
  });

  app.put("/api/messages/:id/read", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.markMessageAsRead(req.params.id);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/messages/:id", isAdminAuthenticated, (req, res) => {
    try {
      db.deleteMessage(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== SEO ENTRIES ====================
  app.get("/api/seo", (req, res) => {
    res.json(db.getSEOSettings());
  });

  app.put("/api/seo", isAdminAuthenticated, (req, res) => {
    try {
      const updated = db.updateSEOSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ==================== GEMINI RECRUITER ASSISTANT ====================
  app.post("/api/gemini/chat", async (req, res) => {
    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Recruiter query is missing." });
    }

    const profile = db.getProfile();
    const technologies = db.getTechnologies();
    const projects = db.getProjects();
    const experiences = db.getExperiences();

    // Context preparation
    const contextPrompt = `
      You are AI Grégoire, a professional, charismatic, and enthusiastic virtual AI representative representing Grégoire BATCHO, a Junior Full-Stack Developer.
      Your primary purpose is to help recruiters, engineering leads, and clients evaluate Grégoire for full-time junior positions, freelance work, or team collaborations.
      
      Here is Grégoire's background and credentials synced in real time with our application database:
      
      PERSONAL PROFILE:
      - Full name: ${profile.fullname}
      - Work Title: ${profile.title}
      - Location: ${profile.location}
      - Availability: ${profile.availability === "available" ? "Open immediately for job offers & missions" : "Currently busy / In negotiation"}
      - CV Details / Portfolio: Can download from standard contact header
      - Contact: ${profile.socials.email || "batchogregoire0@gmail.com"}
      - Biography summary: ${profile.biography}
      
      DETAILED SKILLS & DOMAIN TAXONOMIES:
      ${technologies.map((t) => `- ${t.name} (${t.category}): Proficiency ${t.proficiency}%, ${t.yearsExperience} years experience`).join("\n")}
      
      COMPLETED SELECTED WEB & FULL-STACK PROJECTS:
      ${projects.map((p) => `- ${p.title} (${p.category}): ${p.shortDescription}. Technical Stack used: ${p.technologies.join(", ")}`).join("\n")}
      
      TIMELINE EXPERIENCES & PAST MILESTONES:
      ${experiences.map((e) => `- ${e.company} / Role: ${e.role} (Start: ${e.startDate}, End: ${e.endDate || "Present"}): ${e.description}`).join("\n")}
      
      DIRECTIONS FOR DIALOGUES:
      1. Speak as a representation of Grégoire. ("In my training...", "For my project 'Nova'...", "I specialize in Node.js..."). Be warm, humble, yet confident in standard software engineering principles.
      2. If asked about salary, start dates, or location limitations, say that I am located in Paris but fully open to hybrid or remote arrangements, and pricing/benefits can be discussed dynamically.
      3. Always keep responses focused on professional objectives and code craft.
      4. Speak carefully in the language of the prompt: if the recruiter asks in French, reply in sophisticated French. If English, reply in highly composed modern English.
      5. Never generate details or credentials outside of this database context.
    `;

    if (aiClient) {
      try {
        console.log(
          `[Gemini Request] Sending context chat query to gemini-3.5-flash...`,
        );
        // Format chat context
        const contents = [
          { role: "user", parts: [{ text: contextPrompt }] },
          {
            role: "model",
            parts: [
              {
                text: "Understood. I am now set as AI Grégoire BATCHO's assistant ready to help developers and recruiters. I speak English and French.",
              },
            ],
          },
        ];

        // Format previous history elegantly
        if (history && Array.isArray(history)) {
          history.forEach((msg: any) => {
            contents.push({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.text }],
            });
          });
        }

        // Add user query
        contents.push({ role: "user", parts: [{ text: message }] });

        const geminiRes = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
          },
        });

        const reply =
          geminiRes.text ||
          "I am currently reviewing my notes. Could you please formulate that query again?";
        res.json({ reply });
      } catch (geminiError: any) {
        console.error("Gemini API transaction faulted:", geminiError);
        res
          .status(500)
          .json({
            error: "Gemini transaction faulted. Simulating reply.",
            reply: `Thanks for asking of my technology work! Currently, my Gemini API connection is under extreme query loads. I would love to talk directly to your engineering team at batchogregoire0@gmail.com!`,
          });
      }
    } else {
      // Simulate highly human-like elegant fallback if no API key is specified
      setTimeout(() => {
        const lower = message.toLowerCase();
        let fallbackReply = `Thanks for reaching out! I'm Grégoire BATCHO. I specialize in building robust full-stack applications with React, TypeScript, and Node.js. Feel free to contact me directly at batchogregoire0@gmail.com for freelance proposals or junior positions!`;
        if (
          lower.includes("dispo") ||
          lower.includes("avail") ||
          lower.includes("recrut")
        ) {
          fallbackReply = `I am currently available! I am located in Paris, France, but I am fully open to remote, hybrid, or relocation arrangements. Let's schedule a call to talk about your engineering pipelines!`;
        } else if (
          lower.includes("tech") ||
          lower.includes("stack") ||
          lower.includes("react") ||
          lower.includes("node")
        ) {
          fallbackReply = `My core technologies include React 19, TypeScript, Express, MongoDB, Node.js and Tailwind CSS. I have built high-performance backends and beautiful frontend visual architectures.`;
        }
        res.json({ reply: fallbackReply });
      }, 800);
    }
  });

  // ==================== SEO / SITEMAP & ROBOTS ====================
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
      `User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get("host")}/sitemap.xml`,
    );
  });

  app.get("/sitemap.xml", (req, res) => {
    const host = `${req.protocol}://${req.get("host")}`;
    const projects = db.getProjects();
    const projectUrls = projects
      .map(
        (p) =>
          `  <url>\n    <loc>${host}/projects/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
      )
      .join("\n");

    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/projects</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/experience</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${host}/skills</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${host}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${projectUrls}
</urlset>`);
  });

  // ==================== VITE MIDDLEWARE CONFIG ====================
  if (
    process.env.DISABLE_HMR === "true" ||
    process.env.NODE_ENV === "production"
  ) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

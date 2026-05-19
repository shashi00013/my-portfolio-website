import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { message } = req.body;
      const prompt = `You are the AI assistant for Shashi Kumar's portfolio. Shashi is a Full Stack Developer & AI Engineer. Answer strictly based on this context: 
      - Works with React, Next.js, Firebase, Node.js, and GenAI.
      - Projects include High-Performance E-commerce, AI Customer Support SaaS, Collaborative Editor.
      - Education: B.Tech CS at Chandigarh College of Engg, Jhanjeri.
      - Offers web development, AI integration, consulting.
      - Short, friendly, and professional responses (max 2 sentences). 
      Visitor asks: "${message}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      res.json({ reply: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ reply: "Sorry, I'm currently offline or my API key is missing. Please contact Shashi via the form!" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Optional server-side AI clarity helper endpoint
  app.post('/api/assist/clarify', async (req, res) => {
    const { subject, description, schemeOrService, referenceNumber, priorResponseNotes } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return res.status(200).json({
        mode: 'deterministic-fallback',
        reason: 'Server-side Gemini API key not configured; using deterministic Civic Horizon structure helper.',
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = [
        'Rewrite the following citizen grievance draft so it is clear, factual, polite, and structured into 5 numbered sections (1. Core Issue, 2. Reference Details, 3. Background & Timeline, 4. Verification Context, 5. Requested Resolution).',
        'CRITICAL RULES: Never invent facts, dates, authorities, or eligibility rules not stated by the citizen. Never include sensitive personal data.',
        `Subject: ${subject || ''}`,
        `Scheme/Service: ${schemeOrService || ''}`,
        `Reference Number: ${referenceNumber || 'Not specified'}`,
        `Prior Notes: ${priorResponseNotes || ''}`,
        `Citizen Draft: ${description || ''}`,
      ].join('\n');

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a careful civic writing assistant for CPGRAMS 2036. You clarify citizen statements into structured plain language without inventing facts or claiming official authority.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Model timeout; using instant deterministic helper')), 1200)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const text = response.text?.trim();
      if (!text) {
        return res.status(200).json({
          mode: 'deterministic-fallback',
          reason: 'Empty response from model; using deterministic helper.',
        });
      }

      return res.status(200).json({
        mode: 'gemini-assisted',
        improvedText: text,
        changesNote:
          'Refined by server-side Gemini 3.8 Flash assistant using only your stated facts.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Model assistance unavailable';
      return res.status(200).json({
        mode: 'deterministic-fallback',
        reason: message,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CPGRAMS 2036 Server running on http://localhost:${PORT}`);
  });
}

startServer();

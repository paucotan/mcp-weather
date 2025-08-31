import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from './lib/env.js';
import weatherRouter from './routes/weather.js';
import { notFound, errorHandler } from './middleware/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static UI from /public
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// API route
app.use('/weather', weatherRouter);

// Serve the OpenAPI file for MCP to discover
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'openapi.yaml'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
});

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Weather tool on http://localhost:${config.port}`);
});

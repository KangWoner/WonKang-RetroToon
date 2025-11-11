import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import imageRoutes from './routes/imageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
await fs.mkdir(uploadsDir, { recursive: true }).catch((err) => {
  console.error('Failed to create uploads directory:', err);
});

// Serve static files from absolute paths
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', imageRoutes);

// Root route - serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start server with explicit host binding
app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 RetroToon Web Service is running!                   ║
║                                                           ║
║   📍 Local:   http://localhost:${PORT}                       ║
║   🌐 Network: http://${HOST}:${PORT}                         ║
║                                                           ║
║   Transform your photos into retro anime art! 🖼️✨       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;

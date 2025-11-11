import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import imageRoutes from './routes/imageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
await fs.mkdir(uploadsDir, { recursive: true });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', imageRoutes);

// Root route - serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 RetroToon Web Service is running!                   ║
║                                                           ║
║   📍 Local:   http://localhost:${PORT}                       ║
║   🌐 Network: http://0.0.0.0:${PORT}                         ║
║                                                           ║
║   Transform your photos into retro anime art! 🖼️✨       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;

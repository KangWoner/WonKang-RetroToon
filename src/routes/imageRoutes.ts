import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertToRetroAnime, deleteFile, isValidImageType } from '../services/imageProcessor.js';
import type { RetroStyle } from '../services/imageProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure uploads directory with absolute path
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (isValidImageType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
    }
  },
});

/**
 * POST /api/convert
 * Uploads an image and converts it to retro anime style
 */
router.post('/convert', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const style = (req.body.style || '80s') as RetroStyle;

    if (!['80s', '90s'].includes(style)) {
      await deleteFile(req.file.path);
      res.status(400).json({ error: 'Invalid style. Must be "80s" or "90s"' });
      return;
    }

    const inputPath = req.file.path;
    const outputFilename = `retro-${Date.now()}${path.extname(req.file.originalname)}`;
    const outputPath = path.join(uploadsDir, outputFilename);

    // Convert the image
    await convertToRetroAnime(inputPath, outputPath, { style });

    // Delete the original uploaded file
    await deleteFile(inputPath);

    // Send the processed image
    res.json({
      success: true,
      message: 'Image converted successfully',
      imageUrl: `/uploads/${outputFilename}`,
      style,
    });
  } catch (error) {
    console.error('Error converting image:', error);

    // Clean up uploaded file if it exists
    if (req.file) {
      await deleteFile(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to convert image',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok', service: 'RetroToon API' });
});

export default router;

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import sharp from 'sharp';
import { convertToRetroAnime, deleteFile, isValidImageType } from './imageProcessor';

describe('Image Processor Service', () => {
  const testDir = path.join(process.cwd(), 'test-uploads');
  const testImagePath = path.join(testDir, 'test-input.jpg');
  const testOutputPath = path.join(testDir, 'test-output.jpg');

  beforeAll(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true });

    // Create a simple test image (100x100 red square)
    await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .jpeg()
      .toFile(testImagePath);
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('isValidImageType', () => {
    it('should return true for valid image types', () => {
      expect(isValidImageType('image/jpeg')).toBe(true);
      expect(isValidImageType('image/jpg')).toBe(true);
      expect(isValidImageType('image/png')).toBe(true);
      expect(isValidImageType('image/webp')).toBe(true);
    });

    it('should return false for invalid image types', () => {
      expect(isValidImageType('image/gif')).toBe(false);
      expect(isValidImageType('image/bmp')).toBe(false);
      expect(isValidImageType('text/plain')).toBe(false);
      expect(isValidImageType('application/pdf')).toBe(false);
    });
  });

  describe('convertToRetroAnime', () => {
    it('should convert image with 80s style', async () => {
      const result = await convertToRetroAnime(testImagePath, testOutputPath, {
        style: '80s',
      });

      expect(result).toBe(testOutputPath);

      // Verify output file exists
      const stats = await fs.stat(testOutputPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);

      // Verify it's a valid image
      const metadata = await sharp(testOutputPath).metadata();
      expect(metadata.format).toBe('jpeg');
      expect(metadata.width).toBe(100);
      expect(metadata.height).toBe(100);

      // Clean up
      await fs.unlink(testOutputPath);
    });

    it('should convert image with 90s style', async () => {
      const result = await convertToRetroAnime(testImagePath, testOutputPath, {
        style: '90s',
      });

      expect(result).toBe(testOutputPath);

      // Verify output file exists
      const stats = await fs.stat(testOutputPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);

      // Clean up
      await fs.unlink(testOutputPath);
    });

    it('should apply custom quality setting', async () => {
      const highQualityPath = path.join(testDir, 'high-quality.jpg');
      const lowQualityPath = path.join(testDir, 'low-quality.jpg');

      await convertToRetroAnime(testImagePath, highQualityPath, {
        style: '80s',
        quality: 95,
      });

      await convertToRetroAnime(testImagePath, lowQualityPath, {
        style: '80s',
        quality: 50,
      });

      const highQualityStats = await fs.stat(highQualityPath);
      const lowQualityStats = await fs.stat(lowQualityPath);

      // Higher quality should result in larger file size
      expect(highQualityStats.size).toBeGreaterThan(lowQualityStats.size);

      // Clean up
      await fs.unlink(highQualityPath);
      await fs.unlink(lowQualityPath);
    });

    it('should throw error for non-existent input file', async () => {
      await expect(
        convertToRetroAnime('/non/existent/file.jpg', testOutputPath, {
          style: '80s',
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file', async () => {
      const tempFile = path.join(testDir, 'temp-delete.txt');
      await fs.writeFile(tempFile, 'test content');

      await deleteFile(tempFile);

      await expect(fs.stat(tempFile)).rejects.toThrow();
    });

    it('should not throw error for non-existent file', async () => {
      await expect(deleteFile('/non/existent/file.txt')).resolves.not.toThrow();
    });
  });
});

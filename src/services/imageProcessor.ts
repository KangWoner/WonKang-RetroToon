import sharp from 'sharp';
import * as fs from 'fs/promises';

/**
 * Style presets for retro anime transformation
 */
export type RetroStyle = '80s' | '90s';

/**
 * Options for image transformation
 */
export interface TransformOptions {
  style: RetroStyle;
  quality?: number;
}

/**
 * Converts an image to retro anime style
 * @param inputPath - Path to input image file
 * @param outputPath - Path where processed image will be saved
 * @param options - Transformation options (style, quality)
 * @returns Path to the processed image
 */
export async function convertToRetroAnime(
  inputPath: string,
  outputPath: string,
  options: TransformOptions
): Promise<string> {
  try {
    const { style, quality = 85 } = options;

    // Load the image with error handling
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image: unable to read dimensions');
    }

    // Apply retro anime effects based on style
    let processed = image;

    if (style === '80s') {
      // 80s style: High contrast, vibrant colors, slight blur
      processed = processed
        .modulate({
          brightness: 1.1,
          saturation: 1.4,
          hue: 10,
        })
        .sharpen({ sigma: 0.5 })
        .gamma(1.2);
    } else if (style === '90s') {
      // 90s style: Softer colors, slightly washed out look
      processed = processed
        .modulate({
          brightness: 1.05,
          saturation: 1.2,
          hue: -5,
        })
        .blur(0.3)
        .gamma(1.1);
    }

    // Apply vintage effect (common to both styles)
    processed = processed
      .tint({ r: 255, g: 240, b: 220 }) // Warm tint
      .linear(0.9, 10); // Reduce contrast slightly

    // Save the processed image with error handling
    await processed
      .jpeg({ quality })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error in convertToRetroAnime:', error);
    throw new Error(
      `Failed to convert image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Deletes a file from the filesystem
 * @param filePath - Path to the file to delete
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
}

/**
 * Validates if a file is an image
 * @param mimetype - MIME type of the file
 * @returns true if file is an image
 */
export function isValidImageType(mimetype: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(mimetype);
}

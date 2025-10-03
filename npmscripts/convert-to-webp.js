import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToWebP(inputPath) {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file does not exist: ${inputPath}`);
      process.exit(1);
    }

    // Get file info
    const inputDir = path.dirname(inputPath);
    const inputName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(inputDir, `${inputName}.webp`);

    console.log(`Converting ${inputPath} to WebP...`);

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log(`✅ Successfully converted to: ${outputPath}`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`📊 File size comparison:`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`   Savings: ${savings}%`);

  } catch (error) {
    console.error('Error converting image:', error.message);
    process.exit(1);
  }
}

// Get input path from command line arguments
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node convert-to-webp.js <input-image-path>');
  process.exit(1);
}

convertToWebP(inputPath);

#!/usr/bin/env node
/**
 * Script to generate apple-touch-icon.png from favicon.svg
 * 
 * Requires: sharp (npm install --save-dev sharp)
 * Usage: node scripts/generate-apple-touch-icon.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svgPath = join(rootDir, 'public', 'favicon.svg');
const outputPath = join(rootDir, 'public', 'apple-touch-icon.png');

try {
  const svgBuffer = readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 10, g: 10, b: 10, alpha: 1 }
    })
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Generated ${outputPath}`);
} catch (error) {
  console.error('❌ Error generating apple-touch-icon.png:', error.message);
  console.log('\n📝 Alternative: Use an online SVG to PNG converter:');
  console.log('   1. Open public/favicon.svg');
  console.log('   2. Convert to PNG at 180x180px');
  console.log('   3. Save as public/apple-touch-icon.png');
  process.exit(1);
}


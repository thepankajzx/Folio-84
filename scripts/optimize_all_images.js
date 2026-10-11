const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directories = [
  { dir: 'assets/images/education', maxWidth: 1440, maxHeight: 1080 },
  { dir: 'assets/images/finance', maxWidth: 1440, maxHeight: 1080 },
  { dir: 'assets/images/fitness', maxWidth: 1440, maxHeight: 1080 },
  { dir: 'assets/images/album-covers', maxWidth: 900, maxHeight: 900 },
  { dir: 'assets/images/book-covers', maxWidth: 900, maxHeight: 1350 }
];

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const { dir, maxWidth, maxHeight } of directories) {
    const fullDir = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.webp'));
    for (const file of files) {
      const filePath = path.join(fullDir, file);
      const inputBuffer = fs.readFileSync(filePath);
      const originalSize = inputBuffer.length;
      totalBefore += originalSize;

      const instance = sharp(inputBuffer);
      const meta = await instance.metadata();
      
      const targetWidth = Math.min(meta.width, maxWidth);
      const targetHeight = Math.min(meta.height, maxHeight);

      const outputBuffer = await sharp(inputBuffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();

      fs.writeFileSync(filePath, outputBuffer);
      const newSize = outputBuffer.length;
      totalAfter += newSize;

      const pct = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
      console.log(`[Optimized] ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${pct}%) [${meta.width}x${meta.height} -> ${targetWidth}x${targetHeight}]`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total After:  ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Saved:  ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% Bandwidth reduction!`);
  console.log(`========================================`);
}

run().catch(console.error);

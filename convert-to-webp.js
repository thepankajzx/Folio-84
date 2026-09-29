const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SHOWCASE_DIR = path.join(__dirname, 'assets', 'showcases');

async function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                const baseName = path.basename(entry.name, ext);
                const targetWebpPath = path.join(dir, `${baseName}.webp`);

                try {
                    const originalStats = fs.statSync(fullPath);
                    await sharp(fullPath)
                        .webp({ quality: 85, effort: 6 })
                        .toFile(targetWebpPath);
                    
                    const webpStats = fs.statSync(targetWebpPath);
                    const savedPct = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);
                    console.log(`[Converted] ${path.relative(__dirname, fullPath)} -> ${path.relative(__dirname, targetWebpPath)} (${(originalStats.size / 1024).toFixed(1)} KB -> ${(webpStats.size / 1024).toFixed(1)} KB, saved ${savedPct}%)`);
                } catch (err) {
                    console.error(`[Error] Failed to convert ${fullPath}:`, err.message);
                }
            }
        }
    }
}

console.log('--- Starting WebP Image Conversion ---');
processDirectory(SHOWCASE_DIR)
    .then(() => console.log('--- WebP Conversion Complete ---'))
    .catch(err => console.error('Fatal error during conversion:', err));

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Instala sharp se necessário
try { require.resolve('sharp'); } catch {
  console.log('Instalando sharp...');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
}
const sharp = require('sharp');

const FOTOS_DIR = path.join(__dirname, 'fotos');
const QUALITY = 82;

function findImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findImages(fullPath));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) results.push(fullPath);
  }
  return results;
}

async function convertAll() {
  const images = findImages(FOTOS_DIR);
  let totalOriginal = 0, totalWebp = 0;

  console.log(`\nConvertendo ${images.length} imagens para WebP (qualidade ${QUALITY})...\n`);

  for (const src of images) {
    const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
    const originalSize = fs.statSync(src).size;
    totalOriginal += originalSize;

    await sharp(src).webp({ quality: QUALITY }).toFile(dest);

    const webpSize = fs.statSync(dest).size;
    totalWebp += webpSize;
    const saving = (((originalSize - webpSize) / originalSize) * 100).toFixed(0);
    const rel = path.relative(__dirname, src);
    console.log(`  ${rel}: ${(originalSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB (-${saving}%)`);
  }

  const totalSaving = (((totalOriginal - totalWebp) / totalOriginal) * 100).toFixed(0);
  console.log(`\n✓ Total: ${(totalOriginal/1024/1024).toFixed(2)}MB → ${(totalWebp/1024/1024).toFixed(2)}MB (-${totalSaving}%)`);
  console.log('  Arquivos WebP gerados! Originais JPEG mantidos como fallback.\n');
}

convertAll().catch(console.error);

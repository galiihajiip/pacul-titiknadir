const sharp = require('sharp');
const path = require('path');

const source = path.join(__dirname, '..', 'BISSMILAH MENANG fix.png');
const publicDir = path.join(__dirname, '..', 'public');

async function main() {
  const bg = { r: 45, g: 95, b: 63, alpha: 1 };

  // Favicon sizes
  await sharp(source).resize(32, 32, { fit: 'contain', background: bg }).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(source).resize(16, 16, { fit: 'contain', background: bg }).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(source).resize(180, 180, { fit: 'contain', background: bg }).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // PWA icon sizes
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of sizes) {
    await sharp(source).resize(size, size, { fit: 'contain', background: bg }).png().toFile(path.join(publicDir, 'icons', `icon-${size}x${size}.png`));
  }

  console.log('All icons generated successfully!');
}

main().catch(console.error);

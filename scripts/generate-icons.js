#!/usr/bin/env node
/**
 * PACUL PWA Icon Generator
 * Generates PNG icons from an inline SVG PACUL logo.
 * Run: node scripts/generate-icons.js
 *
 * Requires: npm install sharp  (one-time dev dependency)
 */

const fs   = require("fs");
const path = require("path");

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT   = path.join(__dirname, "..", "public", "icons");

// Inline PACUL SVG logo (green circle + leaf + "P" lettermark)
const buildSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#2D5F3F"/>
  <!-- Leaf shape -->
  <path d="M50 15 C30 15 18 30 18 50 C18 70 30 82 50 82 C70 82 82 70 82 50 C82 30 70 15 50 15Z" fill="#A8D5BA" opacity="0.35"/>
  <path d="M50 20 C50 20 65 35 65 55 C65 72 55 80 50 82 C45 80 35 72 35 55 C35 35 50 20 50 20Z" fill="#7AC74F" opacity="0.7"/>
  <!-- Letter P -->
  <text x="50" y="67" font-family="Arial Black, sans-serif" font-size="42" font-weight="900"
        text-anchor="middle" fill="#FFFFFF" letter-spacing="-1">P</text>
</svg>`;

async function main() {
  // Try to use sharp; fallback to writing plain SVG files
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.warn("⚠  sharp not installed. Writing SVG placeholders instead.");
    console.warn("   Install with: npm install --save-dev sharp");
    sharp = null;
  }

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  for (const size of SIZES) {
    const outPath = path.join(OUT, `icon-${size}x${size}.png`);
    const svg     = buildSvg(size);

    if (sharp) {
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(outPath);
      console.log(`✓ ${path.basename(outPath)}`);
    } else {
      // Write SVG with .png extension as placeholder (browser will still show it)
      fs.writeFileSync(outPath.replace(".png", ".svg"), svg);
      // Also create a minimal 1x1 transparent PNG placeholder so manifest doesn't 404
      const tiny1x1png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      fs.writeFileSync(outPath, tiny1x1png);
      console.log(`✓ ${path.basename(outPath)} (placeholder)`);
    }
  }

  console.log(`\n✅ Icons written to public/icons/`);
  console.log("   For production-quality icons, run: npm install --save-dev sharp && node scripts/generate-icons.js");
}

main().catch((e) => { console.error(e); process.exit(1); });

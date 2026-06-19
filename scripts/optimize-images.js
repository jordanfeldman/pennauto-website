const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "../src/assets/images");

const images = [
  { file: "k-1024x576.jpg",       width: 1200 },
  { file: "m-1024x576.jpg",       width: 1200 },
  { file: "l.jpg",                 width: 1200 },
  { file: "542165690387.jpg",      width: 1400 },
  { file: "542165571596.jpg",      width: 1400 },
  { file: "black-and-white-car-engine-chrome-190574-380x254.jpg", width: 760 },
  { file: "shop-exterior.jpg",     width: 1600 },
  { file: "paint-booth.jpg",       width: 800 },
  { file: "car-breakdown.jpg",     width: 800 },
  { file: "penn_logo1.png",        png: true },
];

const kb = (n) => (n / 1024).toFixed(0) + "KB";

async function optimize({ file, width, png }) {
  const input = path.join(DIR, file);
  const tmp = input + ".tmp";
  const before = fs.statSync(input).size;
  const img = sharp(input);

  if (png) {
    await img.png({ compressionLevel: 9, palette: true }).toFile(tmp);
  } else {
    const pipeline = width ? img.resize({ width, withoutEnlargement: true }) : img;
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tmp);
  }

  const after = fs.statSync(tmp).size;
  fs.renameSync(tmp, input);
  const pct = Math.round((1 - after / before) * 100);
  console.log(`${file}: ${kb(before)} → ${kb(after)} (−${pct}%)`);
}

async function toWebP({ file, width, png }) {
  if (png) return; // keep logo as PNG — small enough already
  const input = path.join(DIR, file);
  const webpOut = path.join(DIR, file.replace(/\.(jpe?g)$/i, ".webp"));
  const before = fs.statSync(input).size;
  const pipeline = width ? sharp(input).resize({ width, withoutEnlargement: true }) : sharp(input);
  await pipeline.webp({ quality: 82 }).toFile(webpOut);
  const after = fs.statSync(webpOut).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`  → ${path.basename(webpOut)}: ${kb(after)} (−${pct}% vs jpg)`);
}

(async () => {
  console.log("── Optimizing originals ──");
  for (const img of images) await optimize(img);

  console.log("\n── Generating WebP ──");
  for (const img of images) await toWebP(img);

  console.log("\nDone.");
})();

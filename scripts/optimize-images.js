const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "../src/assets/images");
const OUTPUT_DIR = INPUT_DIR; // overwrite in place

const images = [
  // Gallery photos — resize to max 1200px wide, high quality JPEG
  { file: "k-1024x576.jpg",  width: 1200 },
  { file: "m-1024x576.jpg",  width: 1200 },
  { file: "l.jpg",           width: 1200 },
  // Section/background images — resize to max 1400px wide
  { file: "542165690387.jpg", width: 1400 },
  { file: "542165571596.jpg", width: 1400 },
  // Small decorative image — no resize needed, just recompress
  { file: "black-and-white-car-engine-chrome-190574-380x254.jpg", width: 760 },
  // Logo — keep as PNG but crush it
  { file: "penn_logo1.png", png: true },
];

async function optimize({ file, width, png }) {
  const input = path.join(INPUT_DIR, file);
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
  const kb = (n) => (n / 1024).toFixed(0) + "KB";
  console.log(`${file}: ${kb(before)} → ${kb(after)} (−${pct}%)`);
}

(async () => {
  for (const img of images) await optimize(img);
  console.log("\nDone.");
})();

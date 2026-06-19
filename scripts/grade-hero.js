const sharp = require("sharp");
const path = require("path");

const DIR = path.join(__dirname, "../src/assets/images");
const input = path.join(DIR, "gmaps-photo1.jpg");
const outputJpg = path.join(DIR, "shop-exterior.jpg");
const outputWebP = path.join(DIR, "shop-exterior.webp");

async function grade() {
  const base = sharp(input).resize({ width: 1600, withoutEnlargement: true });

  // Warm color grade: boost reds/yellows, deepen shadows, lift midtone contrast
  const graded = base
    .modulate({
      brightness: 1.05,   // slight lift
      saturation: 1.3,    // more punch
      hue: -8,            // shift slightly warmer (toward red/orange)
    })
    .linear(1.15, -10)    // contrast: multiply + subtract to deepen blacks
    .recomb([             // warm tint: boost R channel slightly, cool B slightly
      [1.05, 0.0,  0.0],
      [0.0,  1.0,  0.0],
      [0.0,  0.0,  0.92],
    ]);

  await graded.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(outputJpg);
  console.log("Wrote shop-exterior.jpg");

  await graded.clone().webp({ quality: 85 }).toFile(outputWebP);
  console.log("Wrote shop-exterior.webp");
}

grade().catch(console.error);

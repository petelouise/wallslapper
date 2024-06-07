import os from "os";
import path from "path";
import { setWallpaper } from "wallpaper";
import Jimp from "jimp";

const colors = ["#ff00ff", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff0000"];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function interpolateColor(color1, color2, factor) {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  return rgbToHex(r, g, b);
}

async function createSolidColorImage(color, filePath) {
  const image = new Jimp(256, 256, color);
  await image.writeAsync(filePath);
}

async function transitionToColor(startColor, endColor, duration) {
  const steps = 60;
  const interval = duration / steps;
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps;
    const intermediateColor = interpolateColor(startColor, endColor, factor);
    const imagePath = path.join(os.tmpdir(), `solid_color_${Date.now()}_${i}.png`);
    await createSolidColorImage(intermediateColor, imagePath);
    await setWallpaper(imagePath);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

async function main() {
  try {
    const startColor = getRandomColor();
    const endColor = getRandomColor();
    await transitionToColor(startColor, endColor, 60000);
    console.log("Done!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();

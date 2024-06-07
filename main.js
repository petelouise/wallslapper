import os from "os";
import path from "path";
import { setWallpaper } from "wallpaper";
import Jimp from "jimp";

const colors = ["#ff00ff", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff0000"];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

async function createSolidColorImage(color, filePath) {
  const image = await new Jimp(256, 256, color);
  await image.writeAsync(filePath);
}

async function main() {
  try {
    const imagePath = path.join(os.tmpdir(), `solid_color_${Date.now()}.png`);
    const randomColor = getRandomColor();
    await createSolidColorImage(randomColor, imagePath);
    await setWallpaper(imagePath);
    console.log("Done!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();

import Jimp from "jimp";

export async function createSolidColorImage(color, filePath) {
  const image = new Jimp(256, 256, color);
  await image.writeAsync(filePath);
}

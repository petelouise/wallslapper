import { setWallpaper } from "wallpaper"

// await getWallpaper()

import createCanvas from "canvas"
import fs from "fs"

// Create a solid color image
const width = 256
const height = 256
const canvas = createCanvas(width, height)
const ctx = canvas.getContext("2d")
ctx.fillStyle = "#00ff00"
ctx.fillRect(0, 0, width, height)

// Save the image
const image_path = __dirname + "/solid_color.png"
const out = fs.createWriteStream(image_path)
const stream = canvas.createPNGStream()
stream.pipe(out)

// Set wallpaper
out.on("finish", async () => {
	await setWallpaper(image_path)
})

console.log("Done!")

import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"

// await getWallpaper()

import Jimp from "jimp"

const image_path = path.join(os.tmpdir(), `solid_color_${Date.now()}.png`)

const colors = ["#ff00ff", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff0000"]
const randomColor = colors[Math.floor(Math.random() * colors.length)]

// Create a solid color image using Jimp
new Jimp(256, 256, randomColor, (err, image) => {
    if (err) throw err

	// Save the image
	image.write(image_path, async () => {
		// Set wallpaper
		await setWallpaper(image_path)
		console.log("Done!")
	})
})

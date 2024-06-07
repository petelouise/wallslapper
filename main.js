import { setWallpaper } from "wallpaper"
import os from "os"
import path from "path"

// await getWallpaper()

import Jimp from "jimp"

const image_path = path.join(os.tmpdir(), "solid_color.png")

// Create a solid color image using Jimp
new Jimp(256, 256, "#00ff00", (err, image) => {
	if (err) throw err

	// Save the image
	image.write(image_path, async () => {
		// Set wallpaper
		await setWallpaper(image_path)
		console.log("Done!")
	})
})

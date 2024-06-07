import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"
import { interpolateColor } from "./colorUtils.js"
import { createSolidColorImage } from "./imageUtils.js"

export async function transitionToColor(startColor, endColor, duration) {
	const steps = 60
	const interval = duration / steps
	console.log(
		`Starting transition from ${startColor} to ${endColor} over ${duration}ms`
	)
	for (let i = 0; i <= steps; i++) {
		const factor = i / steps
		const intermediateColor = interpolateColor(startColor, endColor, factor)
		console.log(`Step ${i}: Color ${intermediateColor}`)
		const imagePath = path.join(os.tmpdir(), `solid_color_${Date.now()}_${i}.png`)
		await createSolidColorImage(intermediateColor, imagePath)
		await setWallpaper(imagePath)
		await new Promise((resolve) => setTimeout(resolve, interval))
	}
	console.log("Transition complete")
}

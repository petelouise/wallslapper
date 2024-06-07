import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"
import { interpolateColor } from "./colorUtils.js"
import { createSolidColorImage } from "./imageUtils.js"
import fs from "fs"

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
	await writeCurrentColor(endColor)
	console.log("Transition complete")
}

export async function readColorSchedule(filePath) {
	try {
		const data = await fs.promises.readFile(filePath, "utf8")
		return JSON.parse(data)
	} catch (error) {
		console.error("Error reading color schedule:", error)
		return []
	}
}

export async function readCurrentColor() {
	try {
		const data = await fs.promises.readFile("currentColor.txt", "utf8")
		return data.trim()
	} catch (error) {
		console.error("Error reading current color:", error)
		return null
	}
}

export async function writeCurrentColor(color) {
	try {
		await fs.promises.writeFile("currentColor.txt", color, "utf8")
	} catch (error) {
		console.error("Error writing current color:", error)
	}
}

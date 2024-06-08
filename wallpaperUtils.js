import fs from "fs"
import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"
import { interpolateColor } from "./colorUtils.js"
import { createSolidColorImage } from "./imageUtils.js"

export async function transitionToColor(startColor, endColor, transitionTime) {
	const steps = 60
	const interval = transitionTime / steps
	console.log(
		`Starting transition from ${startColor} to ${endColor} over ${transitionTime}ms`
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

export async function transitionBasedOnTime(colorSchedule, defaultTransitionTime) {
	const now = new Date()
	const currentTime = now.getHours() * 60 + now.getMinutes()

	for (const { time, color } of colorSchedule) {
		const [hours, minutes] = time.split(":").map(Number)
		const scheduleTime = hours * 60 + minutes

		if (currentTime <= scheduleTime) {
			const startColor = await readCurrentColor()
			const endColor = color
			const transitionTime = (scheduleTime - currentTime) * 60 * 1000 // Convert to milliseconds

			await transitionToColor(startColor, endColor, transitionTime || defaultTransitionTime)
			break
		}
	}
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
		if (fs.existsSync("currentColor.txt")) {
			const data = await fs.promises.readFile("currentColor.txt", "utf8")
			return data.trim()
		} else {
			console.warn("currentColor.txt not found, returning default color #000000")
			return "#000000" // Default color
		}
	} catch (error) {
		console.error("Error reading current color:", error)
		return "#000000" // Default color
	}
}

export async function writeCurrentColor(color) {
	try {
		await fs.promises.writeFile("currentColor.txt", color, "utf8")
	} catch (error) {
		console.error("Error writing current color:", error)
	}
}

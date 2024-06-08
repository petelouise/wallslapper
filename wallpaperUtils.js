import fs from "fs"
import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"
import { interpolateColor } from "./colorUtils.js"
import { createSolidColorImage } from "./imageUtils.js"

export async function transitionToColor(startColor, endColor, transitionTime) {
	if (startColor === endColor) {
		console.log(`Start and end colors are the same, skipping transition`)
		await writeCurrentColor(endColor)
		return
	}

	if (transitionTime === 0) {
		console.log(`Instant transition from ${startColor} to ${endColor}`)
		const imagePath = path.join(os.tmpdir(), `solid_color_${Date.now()}.png`)
		await createSolidColorImage(endColor, imagePath)
		await setWallpaper(imagePath)
		await writeCurrentColor(endColor)
		console.log("Transition complete")
		return
	}

	const minInterval = 100 // Minimum interval between steps in milliseconds
	const steps = Math.max(1, Math.floor(transitionTime / minInterval))
	const interval = transitionTime / steps
	console.log(
		`Starting transition from ${startColor} to ${endColor} over ${transitionTime}ms with ${steps} steps`
	)
	for (let i = 0; i < steps; i++) {
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

export function resolveScheduledColor(schedule) {
	const now = new Date()
	const currentTime = now.getHours() * 60 + now.getMinutes()
	let selectedColor = null
	let selectedTime = -1

	for (const [time, color] of Object.entries(schedule)) {
		const [hours, minutes] = time.split(":").map(Number)
		const scheduleTime = hours * 60 + minutes

		if (scheduleTime <= currentTime && scheduleTime > selectedTime) {
			selectedTime = scheduleTime
			selectedColor = color
		}
	}

	return selectedColor
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

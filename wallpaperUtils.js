import fs from "fs"
import Jimp from "jimp"
import ms from "ms"
import os from "os"
import path from "path"
import { setWallpaper } from "wallpaper"
import { interpolateColor } from "./colorUtils.js"
import { readConfig } from "./configUtils.js"

const minInterval = 100 // Minimum interval between steps in milliseconds

export async function runPinwheel(palette, duration, forever = false) {
	const config = await readConfig()
	const colors = config.palettes.find((p) => p.name === palette).colors

	do {
		for (var i = 0; i < colors.length; i++) {
			const color = colors[i]
			await transitionToColor(color, duration)
		}
	} while (forever)
}

export async function transitionToColor(endColor, duration) {
	const startColor = await readCurrentColor()

	if (!startColor) {
		console.log("No start color found, ignoring transition")
		duration = 0
	}

	if (startColor === endColor) {
		console.log(`No transition needed from ${startColor} to ${endColor}`)
		return
	}

	if (!duration) {
		console.log(`Instant transition to ${endColor}`)
		const imagePath = await createSolidColorImage(endColor)
		await setWallpaper(imagePath)
		await writeCurrentColor(endColor)
		console.log("Transition complete")
		return
	}

	console.log(`Starting transition from ${startColor} to ${endColor}`)
	const steps = Math.max(1, Math.floor(duration / minInterval))
	const interval = duration / steps
	const displayDuration = ms(duration)
	console.log(
		`Starting transition from ${startColor} to ${endColor} over ${displayDuration} with ${steps} steps`
	)
	for (let i = 0; i < steps; i++) {
		const factor = i / steps
		const intermediateColor = interpolateColor(startColor, endColor, factor)
		console.log(`Step ${i}: Color ${intermediateColor}`)
		const imagePath = await createSolidColorImage(intermediateColor)
		await setWallpaper(imagePath)
		await new Promise((resolve) => setTimeout(resolve, interval))
	}

	await writeCurrentColor(endColor)
	console.log("Transition complete")
}

const currentColorPath = path.join(os.homedir(), ".wallslappercurrent")

export async function readCurrentColor() {
	try {
		if (fs.existsSync(currentColorPath)) {
			const data = await fs.promises.readFile(currentColorPath, "utf8")
			return data.trim()
		} else {
			console.warn(`${currentColorPath} not found`)
			return
		}
	} catch (error) {
		console.error("Error reading current color:", error)
		return
	}
}

export async function writeCurrentColor(color) {
	try {
		await fs.promises.writeFile(currentColorPath, color, "utf8")
	} catch (error) {
		console.error("Error writing current color:", error)
	}
}

export async function createSolidColorImage(color) {
	const image = new Jimp(256, 256, color)
	const imagePath = path.join(os.tmpdir(), `solid_color_${Date.now()}.png`)
	await image.writeAsync(imagePath)
	return imagePath
}

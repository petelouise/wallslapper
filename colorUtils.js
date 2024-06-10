// Importing chroma.js using ES6 import syntax
import chroma from "chroma-js"

export function interpolateColor(color1, color2, factor) {
	const color1Obj = chroma.hex(color1)
	const color2Obj = chroma.hex(color2)
	const interpolatedColor = chroma.mix(color1Obj, color2Obj, factor)
	return interpolatedColor.hex()
}

export function getRandomColor() {
	const letters = "0123456789ABCDEF"
	let color = ""
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

import { readConfig } from "./configUtils.js"
export async function getRandomColorFromPalette(palette) {
	const config = await readConfig()
	var colors

	if (palette) {
		colors = config.palettes.find((p) => p.name === palette).colors
	} else {
		colors =
			config.palettes[Math.floor(Math.random() * config.palettes.length)].colors
	}

	return colors[Math.floor(Math.random() * config.palettes[0].colors.length)]
}

export function resolveScheduledColor(schedule) {
	const now = new Date()
	const currentTime = now.getHours() * 60 + now.getMinutes()
	console.log(`currentTime: ${currentTime}`)
	console.log(`now: ${now}`)
	let selectedColor = null
	let selectedTime = -1

	const scheduleEntries = Object.entries(schedule).map(([time, color]) => {
		const [hours, minutes] = time.split(":").map(Number)
		return { time: hours * 60 + minutes, color }
	})

	for (const { time, color } of scheduleEntries) {
		if (time <= currentTime && time > selectedTime) {
			selectedTime = time
			selectedColor = color
		}
	}

	// If no color was selected, it means current time is before the first scheduled time of the day
	if (selectedColor === null) {
		// Find the latest time in the previous day (i.e., the highest time value in the schedule)
		const lastEntry = scheduleEntries.reduce((latest, entry) => {
			return entry.time > latest.time ? entry : latest
		})

		selectedColor = lastEntry.color
	}

	return selectedColor
}

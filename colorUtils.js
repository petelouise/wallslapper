export function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16)
	return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export function rgbToHex(r, g, b) {
	return `${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function interpolateColor(color1, color2, factor) {
	const [r1, g1, b1] = hexToRgb(color1)
	const [r2, g2, b2] = hexToRgb(color2)
	const r = Math.round(r1 + factor * (r2 - r1))
	const g = Math.round(g1 + factor * (g2 - g1))
	const b = Math.round(b1 + factor * (b2 - b1))
	return rgbToHex(r, g, b)
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
export async function getRandomColorFromPalette() {
	const config = await readConfig()
	return config.palettes[Math.floor(Math.random() * config.palettes.length)].colors[
		Math.floor(Math.random() * config.palettes[0].colors.length)
	]
}

export function resolveScheduledColor(schedule) {
	const now = new Date()
	const currentTime = now.getHours() * 60 + now.getMinutes()
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

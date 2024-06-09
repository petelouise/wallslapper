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

import { readConfig } from "./configUtils.js"
import { transitionToColor } from "./wallpaperUtils.js"

async function run() {
	const config = await readConfig()
	const duration = config.duration || 0
	const schedule = config.schedule

	if (!schedule) {
		console.log("No schedule found")
		return
	}

	const color = resolveScheduledColor(schedule)
	transitionToColor(color, duration)
}

run()

setInterval(run, 5 * 1000)

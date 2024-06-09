import { resolveScheduledColor } from "./colorUtils.js"
import { readConfig } from "./configUtils.js"
import { transitionToColor } from "./wallpaperUtils.js"

let isTransitioning = false // Flag to indicate if a transition is in progress

async function updateWallpaper() {
	if (isTransitioning) {
		console.log("Transition already in progress, skipping this run.")
		return
	}

	const config = await readConfig()
	const duration = config.duration || 0
	const schedule = config.schedule

	if (!schedule) {
		console.log("No schedule found")
		return
	}

	const color = resolveScheduledColor(schedule)
	if (color) {
		isTransitioning = true
		try {
			await transitionToColor(color, duration)
		} finally {
			isTransitioning = false
		}
	}
}

// Run updateWallpaper every minute
setInterval(updateWallpaper, 60 * 1000)

// Initial call to set the wallpaper immediately on start
updateWallpaper()

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { getRandomColor } from "./colorUtils.js"
import { readConfig } from "./configUtils.js"
import {
	readCurrentColor,
	transitionBasedOnTime,
	transitionToColor,
} from "./wallpaperUtils.js"

export async function parseCLIArgs() {
	const argv = yargs(hideBin(process.argv))
		.option("color", {
			alias: "c",
			type: "string",
			description: "Specify a color to transition to immediately",
		})
		.option("scheduleFile", {
			alias: "s",
			type: "string",
			description: "Provide a file with a list of colors and times of day",
		})
		.option("schedule", {
			alias: "s",
			type: "string",
			description: "Provide a file with a list of colors and times of day",
		})
		.option("scheduleFile", {
			type: "string",
			description: "Provide a file with a list of colors and times of day",
		})
		.option("duration", {
			alias: "d",
			description: "The duration of the transition in milliseconds",
			type: "number",
		})
		.help()
		.alias("help", "h").argv

	if (argv.color) {
		const config = await readConfig()
		const startColor = await readCurrentColor()
		const endColor = argv.color
		const duration = argv.duration || config.defaultTransitionTime

		await transitionToColor(startColor, endColor, duration)
	} else if (argv.schedule || argv.scheduleFile) {
		const config = await readConfig()
		const scheduleFile = argv.scheduleFile || config.defaultSchedule

		if (scheduleFile) {
			const colorSchedule = await readColorSchedule(scheduleFile)
			await transitionBasedOnTime(colorSchedule)
		} else {
			console.error("No schedule file provided and no default schedule found in config.")
		}
	} else {
		const startColor = getRandomColor()
		const endColor = getRandomColor()
		await transitionToColor(startColor, endColor, 60000)
		console.log("Random transition complete!")
	}
}

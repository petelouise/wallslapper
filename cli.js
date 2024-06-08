import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { getRandomColor } from "./colorUtils.js"
import { genconfig, readConfig } from "./configUtils.js"
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
		.option("schedule", {
			alias: "s",
			type: "boolean",
			description: "Use a predefined schedule to transition to colors",
		})
		.option("duration", {
			alias: "d",
			description: "The duration of the transition in milliseconds",
			type: "number",
		})
		.option("genconfig", {
			alias: "g",
			type: "boolean",
			description: "Generate an example config file in the home directory",
		})
		.help()
		.alias("help", "h").argv

	if (argv.genconfig) {
		await genconfig()
	} else if (argv.color) {
		const config = await readConfig()
		const startColor = await readCurrentColor()
		const endColor = argv.color
		const duration = argv.duration // || config.defaultTransitionTime

		await transitionToColor(startColor, endColor, duration)
	} else if (argv.schedule || argv.scheduleFile) {
		const config = await readConfig()
		const colorSchedule = argv.scheduleFile
			? await readColorSchedule(argv.scheduleFile)
			: config.defaultSchedule

		if (colorSchedule) {
			await transitionBasedOnTime(colorSchedule)
		} else {
			console.error(
				"No schedule file provided and no default schedule found in config."
			)
		}
	} else {
		const startColor = getRandomColor()
		const endColor = getRandomColor()
		await transitionToColor(startColor, endColor, 60000)
		console.log("Random transition complete!")
	}
}

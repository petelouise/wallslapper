import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import {
	transitionToSpecifiedColor,
	transitionBasedOnTime,
	getRandomColor,
	transitionToColor,
	readCurrentColor,
} from "./wallpaperUtils.js"
import { readConfig } from "./configUtils.js"

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
		.option("duration", {
			alias: "d",
			description: "The duration of the transition in milliseconds",
			type: "number",
		})
		.help()
		.alias("help", "h").argv

	if (argv.color) {
		await transitionToSpecifiedColor(argv.color)
		const config = await readConfig();
		const startColor = await readCurrentColor();
		const endColor = argv.color;
		const duration = argv.duration || config.defaultTransitionTime;

		await transitionToColor(startColor, endColor, duration);
	} else if (argv.scheduleFile) {
		const colorSchedule = await readColorSchedule(argv.scheduleFile)
		await transitionBasedOnTime(colorSchedule)
	} else {
		const startColor = getRandomColor()
		const endColor = getRandomColor()
		await transitionToColor(startColor, endColor, 60000)
		console.log("Random transition complete!")
	}
}

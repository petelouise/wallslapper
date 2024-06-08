import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import {
	transitionToSpecifiedColor,
	transitionBasedOnTime,
	getRandomColor,
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
		.help()
		.alias("help", "h").argv

	if (argv.color) {
		await transitionToSpecifiedColor(argv.color)
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

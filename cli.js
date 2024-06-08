import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { getRandomColor } from "./colorUtils.js"
import { genconfig, readConfig } from "./configUtils.js"
import {
	readCurrentColor,
	resolveScheduledColor,
	transitionToColor,
} from "./wallpaperUtils.js"

export function parseCLIArgs() {
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

	return argv
}

export async function resolveOptions(argv) {
	const config = await readConfig()

	const options = {
		genconfig: argv.genconfig || false,
		color: argv.color || null,
		useSchedule: argv.schedule || false,
		schedule: config.schedule || {},
		duration:
			argv.duration !== undefined ? argv.duration : config.defaultTransitionTime,
	}

	return options
}

export async function main() {
	const argv = parseCLIArgs()
	const options = await resolveOptions(argv)
	const startColor = await readCurrentColor()
	console.log("argv", argv)
	console.log("options", options)
	if (options.genconfig) {
		await genconfig()
	} else if (options.color) {
		await transitionToColor(startColor, options.color, options.duration)
	} else if (options.useSchedule) {
		const color = resolveScheduledColor(options.schedule)
		await transitionToColor(startColor, color, options.duration)
	} else {
		const randomColor = getRandomColor()
		await transitionToColor(startColor, randomColor, options.duration)
	}
}

main().catch((error) => {
	console.error("Error in main execution:", error)
})

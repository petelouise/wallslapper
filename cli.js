import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { getRandomColor } from "./colorUtils.js"
import { genconfig, readConfig } from "./configUtils.js"
import {
	readCurrentColor,
	transitionToColor,
} from "./wallpaperUtils.js"

export async function resolveOptions(argv) {
	const config = await readConfig()

	const options = {
		genconfig: argv.genconfig || false,
		color: argv.color || null,
		schedule: argv.schedule || false,
		scheduleFile: argv.scheduleFile || null,
		duration: argv.duration !== undefined ? argv.duration : config.defaultTransitionTime,
		defaultSchedule: config.defaultSchedule,
	}

	return options
}

export async function main() {
	const argv = yargs(hideBin(process.argv)).argv
	const options = await resolveOptions(argv)

	if (options.genconfig) {
		await genconfig()
	} else if (options.color) {
		const startColor = await readCurrentColor()
		await transitionToColor(startColor, options.color, options.duration)
	} else if (options.schedule) {
		const schedule = options.scheduleFile ? await readColorSchedule(options.scheduleFile) : options.defaultSchedule
		await transitionBasedOnTime(schedule, options.duration)
	} else {
		const randomColor = getRandomColor()
		const startColor = await readCurrentColor()
		await transitionToColor(startColor, randomColor, options.duration)
	}
}

main().catch((error) => {
	console.error("Error in main execution:", error)
})

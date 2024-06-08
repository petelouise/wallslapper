import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { getRandomColor } from "./colorUtils.js"
import { genconfig, readConfig } from "./configUtils.js"
import {
	readCurrentColor,
	transitionBasedOnTime,
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

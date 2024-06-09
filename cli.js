import { Command } from "commander"
import { getRandomColor } from "./colorUtils.js"
import { genconfig } from "./configUtils.js"
import { transitionToColor } from "./wallpaperUtils.js"
const program = new Command()

program
	.command("change <hexcode> [duration]")
	.description("Change wallpaper to a specific color")
	.action((hexcode, duration) => {
		transitionToColor(hexcode, duration)
	})

program
	.command("random [duration]")
	.description("Change wallpaper to a random color")
	.action((duration) => {
		const hexcode = getRandomColor()
		transitionToColor(hexcode, duration)
	})

program
	.command("genconfig")
	.description("Generate configuration file")
	.action(() => {
		genconfig()
	})

program.parse(process.argv)

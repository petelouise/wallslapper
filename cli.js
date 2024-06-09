import { Command } from "commander"
import { getRandomColor, getRandomColorFromPalette } from "./colorUtils.js"
import { genconfig } from "./configUtils.js"
import { transitionToColor } from "./wallpaperUtils.js"
const program = new Command()

program
	.command("change <hexcode> [duration]")
	.description("Change wallpaper to a specific color")
	.action(async (hexcode, duration) => {
		await transitionToColor(hexcode, duration)
	})

program
	.command("random [duration]")
	.description("Change wallpaper to a random color")
	.action(async (duration) => {
		const hexcode = getRandomColor()
		await transitionToColor(hexcode, duration)
	})

program
	.command("shuffle [duration]")
	.description("change wallpaper to a random color from the default palette")
	.action(async (duration) => {
		const hexcode = await getRandomColorFromPalette()
		await transitionToColor(hexcode, duration)
	})

program
	.command("genconfig")
	.description("Generate configuration file")
	.action(async () => {
		await genconfig()
	})

program.parse(process.argv)

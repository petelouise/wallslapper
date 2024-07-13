import chalk from "chalk"
import { Command } from "commander"
import parseDuration from "parse-duration"
import { startFlipPalette, startPinwheel, stop } from "./backgrounder.js"
import { readConfig } from "./configUtils.js"
import { flipThruPalette, runPinwheel, transitionToColor } from "./wallpaperUtils.js"

const program = new Command()

const pinwheelCommand = program.command("pinwheel").description("pinwheel commands")

pinwheelCommand
	.command("run <palette> [duration]")
	.description("run the pinwheel in the foreground")
	.action((palette, duration) => {
		const durationMs = parseDuration(duration)
		runPinwheel(palette, durationMs)
	})

pinwheelCommand
	.command("start <palette> [duration]")
	.description("start the pinwheel in the background")
	.action((palette, duration) => {
		const durationMs = parseDuration(duration) || 0
		startPinwheel(palette, durationMs)
	})

const flipCommand = program.command("flip").description("flip commands")

flipCommand
	.command("run")
	.description("flip thru the colors in the specified palette")
	.option("-p, --palette <palette>", "palette to use", "default")
	.option("-i, --interval <interval>", "interval between flips", "10s")
	.option("-f, --forever", "run forever", false)
	.action((options) => {
		const intervalMs = parseDuration(options.interval) || 10_000
		flipThruPalette(options.palette, intervalMs, options.forever)
	})

flipCommand
	.command("start")
	.description("flip thru the colors in the specified palette in background")
	.option("-p, --palette <palette>", "palette to use", "default")
	.option("-i, --interval <interval>", "interval between flips", "10s")
	.option("-f, --forever", "run forever", false)
	.action((options) => {
		const intervalMs = parseDuration(options.interval) || 10_000
		startFlipPalette(options.palette, intervalMs, options.forever)
	})

program
	.command("stop")
	.description("stop the wallslapper service")
	.action(() => {
		stop()
	})

program
	.command("change <color> [duration]")
	.description("change wallpaper to a specific color")
	.action(async (color, duration) => {
		const durationMs = parseDuration(duration)
		await transitionToColor(color, durationMs)
	})

program
	.command("random [duration]")
	.description("change wallpaper to a random color")
	.action(async (duration) => {
		const color = getRandomColor()
		const durationMs = parseDuration(duration)
		await transitionToColor(color, durationMs)
	})

program
	.command("shuffle <palette> [duration]")
	.description("change wallpaper to a random color from the default palette")
	.action(async (palette, duration) => {
		const color = await getRandomColorFromPalette(palette)
		const durationMs = parseDuration(duration)
		await transitionToColor(color, durationMs)
	})

program
	.command("genconfig")
	.description("generate configuration file")
	.action(async () => {
		await genconfig()
	})

program
	.command("list-palettes")
	.description("list available palettes from the config")
	.action(async () => {
		const config = await readConfig()
		console.log("available palettes:")
		config.palettes.forEach((palette) => {
			console.log(palette.name)
			palette.colors.forEach((color) => {
				const colorSwatch = chalk.bgHex(`#${color}`)("   ")
				console.log(`   ${color} ${colorSwatch}`)
			})
		})
	})

program.parse(process.argv)

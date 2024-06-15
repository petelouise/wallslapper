import chalk from "chalk"
import { execSync, spawn } from "child_process"
import { Command } from "commander"
import fs from "fs"
import parseDuration from "parse-duration"
import path from "path"
import { fileURLToPath } from "url"
import { readConfig } from "./configUtils.js"
import { runPinwheel } from "./wallpaperUtils.js"

// Resolve __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()
const scriptPath = path.resolve(__dirname, "./pinwheelService.js")
const pidFilePath = "/tmp/wallslapper.pid"

const getNodePath = () => {
	try {
		return execSync("which node").toString().trim()
	} catch (error) {
		console.error("Failed to determine Node.js path:", error.message)
		process.exit(1)
	}
}

const isProcessRunning = (pid) => {
	try {
		return process.kill(pid, 0)
	} catch (error) {
		return error.code === "EPERM"
	}
}

const startPinwheel = (palette, duration) => {
	if (fs.existsSync(pidFilePath)) {
		const pid = parseInt(fs.readFileSync(pidFilePath, "utf8"))
		if (isProcessRunning(pid)) {
			console.log(`Pinwheel is already running with PID ${pid}`)
			return
		}
	}

	const nodePath = getNodePath()
	const child = spawn(nodePath, [scriptPath, palette, duration.toString()], {
		detached: true,
		stdio: "ignore",
	})
	child.unref()

	fs.writeFileSync(pidFilePath, child.pid.toString(), "utf8")
	console.log(`Pinwheel started with palette ${palette} for duration ${duration}`)
}

const stopPinwheel = () => {
	if (fs.existsSync(pidFilePath)) {
		const pid = parseInt(fs.readFileSync(pidFilePath, "utf8"))
		try {
			process.kill(pid)
			fs.unlinkSync(pidFilePath)
			console.log("Pinwheel stopped")
		} catch (error) {
			console.log(
				"Failed to stop the pinwheel service or service not loaded:",
				error.message
			)
		}
	} else {
		console.log("Pinwheel is not running")
	}
}

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
		const durationMs = parseDuration(duration)
		startPinwheel(palette, durationMs)
	})

pinwheelCommand
	.command("stop")
	.description("stop the pinwheel service")
	.action(() => {
		stopPinwheel()
	})

program
	.command("change <hexcode> [duration]")
	.description("change wallpaper to a specific color")
	.action(async (hexcode, duration) => {
		const durationMs = parseDuration(duration)
		await transitionToColor(hexcode, durationMs)
	})

program
	.command("random [duration]")
	.description("change wallpaper to a random color")
	.action(async (duration) => {
		const hexcode = getRandomColor()
		const durationMs = parseDuration(duration)
		await transitionToColor(hexcode, durationMs)
	})

program
	.command("shuffle <palette> [duration]")
	.description("change wallpaper to a random color from the default palette")
	.action(async (palette, duration) => {
		const hexcode = await getRandomColorFromPalette(palette)
		const durationMs = parseDuration(duration)
		await transitionToColor(hexcode, durationMs)
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

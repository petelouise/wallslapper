import { execSync } from "child_process"
import { Command } from "commander"
import fs from "fs"
import parseDuration from "parse-duration"
import path from "path"
import plist from "plist"
import { fileURLToPath } from "url"
import { runPinwheel } from "./wallpaperUtils.js"
import { readConfig } from "./configUtils.js"
import chalk from "chalk"

// Resolve __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()
const scriptPath = path.resolve(__dirname, "./pinwheelService.js")
const plistName = "com.yourdomain.wallslapper.plist"
const launchAgentsPath = path.resolve(
	process.env.HOME,
	`Library/LaunchAgents/${plistName}`
)

const getNodePath = () => {
	try {
		return execSync("which node").toString().trim()
	} catch (error) {
		console.error("Failed to determine Node.js path:", error.message)
		process.exit(1)
	}
}

const createPlist = (nodePath) => {
	const plistContent = plist.build({
		Label: "com.ptitlouise.wallslapper",
		ProgramArguments: [nodePath, scriptPath],
		RunAtLoad: true,
		KeepAlive: true,
		StandardOutPath: "/tmp/wallslapper.out",
		StandardErrorPath: "/tmp/wallslapper.err",
	})

	fs.writeFileSync(launchAgentsPath, plistContent)
	execSync(`chown $USER:staff ${launchAgentsPath}`, {
		stdio: "inherit",
	})
	execSync(`chmod 644 ${launchAgentsPath}`, {
		stdio: "inherit",
	})
	console.log(`Plist file created at: ${launchAgentsPath}`)
}

const startPinwheel = (palette, duration) => {
	const nodePath = getNodePath()
	createPlist(nodePath)
	try {
		execSync(`sudo launchctl bootout gui/$(id -u) ${launchAgentsPath}`, {
			stdio: "inherit",
		})
	} catch (error) {
		console.log(
			"Service not previously loaded or another issue occurred:",
			error.message
		)
	}
	try {
		execSync(`sudo launchctl bootstrap gui/$(id -u) ${launchAgentsPath}`, {
			stdio: "inherit",
		})
		console.log(`Pinwheel started with palette ${palette} for duration ${duration}`)
	} catch (error) {
		console.log("Failed to start the service:", error.message)
	}
}

const stopPinwheel = () => {
	try {
		execSync(`sudo launchctl bootout gui/$(id -u) ${launchAgentsPath}`, {
			stdio: "inherit",
		})
		console.log("Pinwheel stopped")
	} catch (error) {
		console.log(
			"Failed to stop the pinwheel service or service not loaded:",
			error.message
		)
	}
}

const pinwheelCommand = program.command("pinwheel").description("Pinwheel commands")

pinwheelCommand
	.command("run <palette> [duration]")
	.description("Run the pinwheel in the foreground")
	.action((palette, duration) => {
		const durationMs = parseDuration(duration)
		runPinwheel(palette, durationMs)
	})

pinwheelCommand
	.command("start <palette> [duration]")
	.description("Start the pinwheel in the background")
	.action((palette, duration) => {
		const durationMs = parseDuration(duration)
		startPinwheel(palette, durationMs)
	})

pinwheelCommand
	.command("stop")
	.description("Stop the pinwheel service")
	.action(() => {
		stopPinwheel()
	})

program
	.command("change <hexcode> [duration]")
	.description("Change wallpaper to a specific color")
	.action(async (hexcode, duration) => {
		const durationMs = parseDuration(duration)
		await transitionToColor(hexcode, durationMs)
	})

program
	.command("random [duration]")
	.description("Change wallpaper to a random color")
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

// program
// 	.command("pinwheel <palette> [duration]")
// 	.description("cycle wallpaper through the default palette")
// 	.option("--forever", "Run the pinwheel forever in a loop")
// 	.action(async (palette, duration, cmdObj) => {
// 		runPinwheel(palette, duration, cmdObj.forever)
// 	})

program
	.command("genconfig")
	.description("Generate configuration file")
	.action(async () => {
		await genconfig()
	})

program
	.command("list-palettes")
	.description("List available palettes from the config")
	.action(async () => {
		const config = await readConfig()
		console.log("Available Palettes:")
		config.palettes.forEach((palette, index) => {
			console.log(`${index + 1}. ${palette.name}`)
			palette.colors.forEach((color, colorIndex) => {
				const colorSwatch = chalk.bgHex(`#${color}`)("   ")
				console.log(`   ${colorIndex + 1}. ${color} ${colorSwatch}`)
			})
		})
	})

program.parse(process.argv)

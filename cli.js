import { Command } from "commander"
import { Service } from "node-mac"
import path from "path"
import os from "os"
import { getRandomColor, getRandomColorFromPalette } from "./colorUtils.js"
import { genconfig } from "./configUtils.js"
import { transitionToColor } from "./wallpaperUtils.js"

const program = new Command()

const scriptPath = "./schedule.js"

const homeDir = os.homedir()

const userLaunchAgentsDir = path.join(homeDir, "Library/LaunchAgents")

const pinwheelSvc = new Service({
	name: "wallslapper-pinwheel",
	description: "runs the pinwheel in the background",
	script: "./pinwheelService.js",
	runAtLoad: true,
	logpath: path.join(homeDir, "Library/Logs/wallslapper-pinwheel"),
	plist: {
		KeepAlive: true,
		RunAtLoad: true,
		Label: "wallslapper-pinwheel",
		ProgramArguments: [process.execPath, path.join(__dirname, "pinwheelService.js")],
		StandardOutPath: path.join(homeDir, "Library/Logs/wallslapper-pinwheel/out.log"),
		StandardErrorPath: path.join(homeDir, "Library/Logs/wallslapper-pinwheel/err.log"),
	},
	installPath: userLaunchAgentsDir,
})

const wallslapperSvc = new Service({
	name: "wallslapper",
	description: "changes wallpaper throughout the day",
	script: scriptPath,
	runAtLoad: true,
	logpath: path.join(homeDir, "Library/Logs/wallslapper"),
	plist: {
		KeepAlive: true,
		RunAtLoad: true,
		Label: "wallslapper",
		ProgramArguments: [process.execPath, path.join(__dirname, scriptPath)],
		StandardOutPath: path.join(homeDir, "Library/Logs/wallslapper/out.log"),
		StandardErrorPath: path.join(homeDir, "Library/Logs/wallslapper/err.log"),
	},
	installPath: userLaunchAgentsDir,
})

// program
// 	.command("start")
// 	.description("Start the wallslapper service")
// 	.action(() => {
// 		wallslapperSvc.on("install", () => {
// 			wallslapperSvc.start()
// 			console.log("wallslapper started")
// 		})
// 		pinwheelSvc.install()
// 	})
const pinwheelCommand = program.command("pinwheel").description("Pinwheel commands")

pinwheelCommand
	.command("start <palette> [duration]")
	.description("Start the pinwheel in the background")
	.action((palette, duration) => {
		pinwheelSvc.env = {
			PALETTE: palette,
			DURATION: duration || "",
		}
		pinwheelSvc.on("install", () => {
			pinwheelSvc.start()
			console.log("Pinwheel started in the background")
		})
		pinwheelSvc.install()
	})

pinwheelCommand
	.command("stop")
	.description("Stop the pinwheel service")
	.action(() => {
		pinwheelSvc.on("uninstall", () => {
			console.log("Pinwheel stopped")
		})
		pinwheelSvc.stop()
		pinwheelSvc.uninstall()
	})

// program
// 	.command("stop")
// 	.description("Stop the wallslapper service")
// 	.action(() => {
// 		pinwheelSvc.on("uninstall", () => {
// 			console.log("wallslapper stopped")
// 		})
// 		pinwheelSvc.stop()
// 		pinwheelSvc.uninstall()
// 	})

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
	.command("shuffle <palette> [duration]")
	.description("change wallpaper to a random color from the default palette")
	.action(async (palette, duration) => {
		const hexcode = await getRandomColorFromPalette(palette)
		await transitionToColor(hexcode, duration)
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

program.parse(process.argv)

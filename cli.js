import { execSync } from "child_process"
import { Command } from "commander"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Resolve __filename and __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()
const scriptPath = path.resolve(__dirname, "./pinwheelService.js")
const plistName = "com.yourdomain.wallslapper.plist"
const plistPath = path.resolve(__dirname, plistName)
const launchAgentsPath = path.resolve(
	process.env.HOME,
	`Library/LaunchAgents/${plistName}`
)

const getNodePath = () => {
	try {
		return execSync("which node").toString().trim()
		fs.unlinkSync(launchAgentsPath)
	} catch (error) {
		console.log(
			"Failed to stop the pinwheel service or service not loaded:",
			error.message
		)
	}
	try {
		fs.unlinkSync(launchAgentsPath)
		console.log("Plist file deleted")
		console.error("Failed to determine Node.js path:", error.message)
		process.exit(1)
	}
}

const createPlist = (nodePath) => {
	const plistContent = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourdomain.wallslapper</string>
    <key>ProgramArguments</key>
    <array>
        <string>${nodePath}</string>
        <string>${scriptPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/wallslapper.out</string>
    <key>StandardErrorPath</key>
    <string>/tmp/wallslapper.err</string>
</dict>
</plist>
  `
	if (fs.existsSync(launchAgentsPath)) {
		console.error(`Plist file already exists at: ${launchAgentsPath}. Please stop the service first.`)
		process.exit(1)
	} else {
		fs.writeFileSync(plistPath, plistContent)
		fs.copyFileSync(plistPath, launchAgentsPath)
		console.log(`Plist file created at: ${launchAgentsPath}`)
	}
}

const startPinwheel = (palette, duration) => {
	const nodePath = getNodePath()
	createPlist(nodePath)
	try {
		execSync(`launchctl unload ${launchAgentsPath}`, { stdio: "inherit" })
	} catch (error) {
		console.log(
			"Service not previously loaded or another issue occurred:",
			error.message
		)
	}
	try {
		execSync(`launchctl load ${launchAgentsPath}`, { stdio: "inherit" })
		console.log(`Pinwheel started with palette ${palette} for duration ${duration}`)
	} catch (error) {
		console.log("Failed to start the service:", error.message)
	}
}

const stopPinwheel = () => {
	try {
		execSync(`launchctl unload ${launchAgentsPath}`, { stdio: "inherit" })
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
	.command("start <palette> [duration]")
	.description("Start the pinwheel in the background")
	.action((palette, duration) => {
		startPinwheel(palette, duration || "")
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

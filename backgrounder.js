import { execSync, spawn } from "child_process"
import fs from "fs"
import ms from "ms"
import path from "path"
import { fileURLToPath } from "url"

// Resolve __filename and __dirname in ES module

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pinwheelScriptPath = path.resolve(__dirname, "./pinwheelService.js")
const flipScriptPath = path.resolve(__dirname, "./flipperService.js")
const pidFilePath = "/tmp/wallslapper.pid"

const getNodePath = () => {
	try {
		return execSync("which node").toString().trim()
	} catch (error) {
		console.error("Failed to determine Node.js path:", error.message)
		process.exit(1)
	}
}

export function isProcessRunning(pid) {
	try {
		return process.kill(pid, 0)
	} catch (error) {
		return error.code === "EPERM"
	}
}

export function startPinwheel(palette, durationMs) {
	if (fs.existsSync(pidFilePath)) {
		const pid = parseInt(fs.readFileSync(pidFilePath, "utf8"))
		if (isProcessRunning(pid)) {
			console.log(`wallslapper is already running with PID ${pid}`)
			return
		}
	}

	const nodePath = getNodePath()
	const child = spawn(nodePath, [pinwheelScriptPath, palette, durationMs.toString()], {
		detached: true,
		stdio: "ignore",
	})
	child.unref()

	fs.writeFileSync(pidFilePath, child.pid.toString(), "utf8")
	const displayDuration = ms(durationMs)
	console.log(`Pinwheel started with palette ${palette} for ${displayDuration}`)
}

export function startFlipPalette(palette, interval) {
	if (fs.existsSync(pidFilePath)) {
		const pid = parseInt(fs.readFileSync(pidFilePath, "utf8"))
		if (isProcessRunning(pid)) {
			console.log(`wallslapper is already running with PID ${pid}`)
			return
		}
	}

	const nodePath = getNodePath()
	const child = spawn(nodePath, [flipScriptPath, palette, interval.toString()], {
		detached: true,
		stdio: "ignore",
	})
	child.unref()

	fs.writeFileSync(pidFilePath, child.pid.toString(), "utf8")
	const displayInterval = ms(interval)
	console.log(`flipper started with palette ${palette} for ${displayInterval}`)
}

export function stop() {
	if (fs.existsSync(pidFilePath)) {
		const pid = parseInt(fs.readFileSync(pidFilePath, "utf8"))
		try {
			process.kill(pid)
			fs.unlinkSync(pidFilePath)
			console.log("wallslapper stopped")
		} catch (error) {
			console.log(
				"failed to stop the wallslapper service or service not loaded:",
				error.message
			)
		}
	} else {
		console.log("wallslapper is not running")
	}
}

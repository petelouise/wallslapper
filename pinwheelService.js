import { runPinwheel } from "./wallpaperUtils.js"

const args = process.argv.slice(2)
const palette = args[0]
const duration = args[1] ? parseInt(args[1], 10) : undefined

async function startPinwheel() {
	await runPinwheel(palette, duration, true)
}

startPinwheel()

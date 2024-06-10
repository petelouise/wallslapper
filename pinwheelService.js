import { runPinwheel } from "./wallpaperUtils.js"

const palette = process.env.PALETTE
const duration = process.env.DURATION ? parseInt(process.env.DURATION, 10) : undefined

async function startPinwheel() {
	await runPinwheel(palette, duration, true)
}

startPinwheel()

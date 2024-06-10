import { runPinwheel } from "./wallpaperUtils.js"
import { readConfig } from "./configUtils.js"

const palette = process.env.PALETTE
const duration = process.env.DURATION ? parseInt(process.env.DURATION, 10) : undefined

async function startPinwheel() {
	const config = await readConfig()
	const colors = config.palettes.find((p) => p.name === palette).colors

	await runPinwheel(palette, duration, true)
}

startPinwheel()

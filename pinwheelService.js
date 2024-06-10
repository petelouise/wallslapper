import { runPinwheel } from "./wallpaperUtils.js"
import { readConfig } from "./configUtils.js"

const args = process.argv.slice(2)
const palette = args[0]
const duration = args[1] ? parseInt(args[1], 10) : undefined

async function startPinwheel() {
	const config = await readConfig()
	const colors = config.palettes.find((p) => p.name === palette).colors

	await runPinwheel(palette, duration, true)
}

startPinwheel()

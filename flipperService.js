import { flipThruPalette } from "./wallpaperUtils.js"

const args = process.argv.slice(2)
const palette = args[0]
const interval = args[1] ? parseInt(args[1], 10) : 10_000

async function startFlipPalette() {
	await flipThruPalette(palette, interval, true)
}

startFlipPalette()

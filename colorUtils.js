export function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16)
	return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export function rgbToHex(r, g, b) {
	return `${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function interpolateColor(color1, color2, factor) {
	const [r1, g1, b1] = hexToRgb(color1)
	const [r2, g2, b2] = hexToRgb(color2)
	const r = Math.round(r1 + factor * (r2 - r1))
	const g = Math.round(g1 + factor * (g2 - g1))
	const b = Math.round(b1 + factor * (b2 - b1))
	return rgbToHex(r, g, b)
}

export function getRandomColor() {
	const letters = "0123456789ABCDEF"
	let color = ""
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

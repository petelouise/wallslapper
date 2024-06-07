import { transitionToColor } from "./wallpaperUtils.js"

const colors = ["#ff00ff", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff0000"]

function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)]
}

async function main() {
	try {
		const startColor = getRandomColor()
		const endColor = getRandomColor()
		await transitionToColor(startColor, endColor, 60000)
		console.log("Done!")
	} catch (error) {
		console.error("An error occurred:", error)
	}
}

main()

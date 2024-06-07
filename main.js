import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import {
	readColorSchedule,
	readCurrentColor,
	transitionToColor,
} from "./wallpaperUtils.js"

const colors = ["#ff00ff", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff0000"]

function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)]
}

async function transitionToSpecifiedColor(color) {
	try {
		const currentColor = await readCurrentColor()
		await transitionToColor(currentColor, color, 60000)
		console.log("Transition to specified color complete!")
	} catch (error) {
		console.error("An error occurred during transition:", error)
	}
}

async function transitionBasedOnTime(colorSchedule) {
	try {
		const currentTime = new Date().getHours()
		const closestSchedule = colorSchedule.reduce((prev, curr) => {
			return Math.abs(curr.hour - currentTime) < Math.abs(prev.hour - currentTime)
				? curr
				: prev
		})
		if (closestSchedule) {
			const currentColor = closestSchedule.color
			const previousColor = await readCurrentColor()
			await transitionToColor(previousColor, currentColor, 60000)
			console.log("Transition based on time complete!")
		} else {
			console.log("No color scheduled for this time.")
		}
	} catch (error) {
		console.error("An error occurred during scheduled transition:", error)
	}
}

async function main() {
	const argv = yargs(hideBin(process.argv))
		.option("color", {
			alias: "c",
			type: "string",
			description: "Specify a color to transition to immediately",
		})
		.option("scheduleFile", {
			alias: "s",
			type: "string",
			description: "Provide a file with a list of colors and times of day",
		})
		.help()
		.alias("help", "h").argv

	if (argv.color) {
		await transitionToSpecifiedColor(argv.color)
	} else if (argv.scheduleFile) {
		const colorSchedule = await readColorSchedule(argv.scheduleFile)
		await transitionBasedOnTime(colorSchedule)
	} else {
		const startColor = getRandomColor()
		const endColor = getRandomColor()
		await transitionToColor(startColor, endColor, 60000)
		console.log("Random transition complete!")
	}
}

main()

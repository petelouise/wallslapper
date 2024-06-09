import fs from "fs"
import os from "os"
import path from "path"

const configPath = path.join(os.homedir(), ".wallslapper.json")
const defaultConfig = {
	palettes: [
		{
			name: "default",
			colors: ["000000", "ffffff", "ff5733", "33ff57", "3357ff", "ff33ff"],
		},
	],
	duration: 0,
}

export async function readConfig() {
	try {
		if (fs.existsSync(configPath)) {
			const data = await fs.promises.readFile(configPath, "utf8")
			return JSON.parse(data)
		} else {
			console.warn(`${configPath} not found, returning default config`)
			return defaultConfig
		}
	} catch (error) {
		console.error("Error reading config:", error)
		return defaultConfig
	}
}

export async function genconfig() {
	const exampleConfig = {
		palettes: [
			{
				name: "default",
				colors: ["000000", "ffffff", "ff5733", "33ff57", "3357ff", "ff33ff"],
			},
		],
		duration: 0,
		schedule: {
			"08:00": "ff5733",
			"12:00": "33ff57",
			"18:00": "3357ff",
		},
	}

	try {
		await fs.promises.writeFile(
			configPath,
			JSON.stringify(exampleConfig, null, 2),
			"utf8"
		)
		console.log(`Example config written to ${configPath}`)
	} catch (error) {
		console.error("Error writing example config:", error)
	}
}

import { exec } from "child_process"
import fs from "fs"
import os from "os"
import path from "path"

const configPath = path.join(os.homedir(), ".wallslapper.json")

describe("CLI Tests", () => {
	beforeEach(() => {
		if (fs.existsSync(configPath)) {
			fs.unlinkSync(configPath)
		}
	})

	test("wallslapper --genconfig creates the config only", (done) => {
		exec("node cli.js --genconfig", (error, stdout, stderr) => {
			expect(error).toBeNull()
			expect(fs.existsSync(configPath)).toBe(true)
			done()
		})
	})

	test("wallslapper --color transitions to the specified color", async () => {
		const color = "#FF5733"
		console.log("command", `node cli.js --color ${color} --duration 0`)
		await new Promise((resolve, reject) => {
			exec(`node cli.js --color ${color} --duration 0`, (error, stdout, stderr) => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
		const data = await fs.promises.readFile("currentColor.txt", "utf8")
		expect(data.trim()).toBe(color)
	})
})

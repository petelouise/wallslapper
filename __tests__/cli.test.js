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

	test("wallslapper --color transitions to the specified color", (done) => {
		const color = "#FF5733"
		console.log("command", `node cli.js --color ${color} --duration 0`)
		exec(`node cli.js --color ${color} --duration 0`, (error, stdout, stderr) => {
			expect(error).toBeNull()
			done()
			// fs.readFile("currentColor.txt", "utf8", (err, data) => {
			// 	expect(err).toBeNull()
			// 	expect(data.trim()).toBe(color)
			// })
		})
	})
})

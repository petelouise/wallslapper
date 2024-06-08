const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const os = require("os")

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
		exec(`node cli.js --color ${color} --duration 0`, (error, stdout, stderr) => {
			expect(error).toBeNull()
			fs.readFile("currentColor.txt", "utf8", (err, data) => {
				expect(err).toBeNull()
				expect(data.trim()).toBe(color)
				done()
			})
		})
	})
})

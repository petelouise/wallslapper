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
		const color = "#FF5733";
		const duration = 100; // Set a short duration for the test

		// Execute the CLI command with the specified color and duration
		await new Promise((resolve, reject) => {
			exec(`node cli.js --color ${color} --duration ${duration}`, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});

		// Wait for a short delay to ensure the transition has completed
		await new Promise((resolve) => setTimeout(resolve, duration + 100));

		// Read the current color from the file
		const currentColorPath = path.join(os.homedir(), ".wallslappercurrent");
		const data = await fs.promises.readFile(currentColorPath, "utf8");
		const currentColor = `#${data.trim()}`;

		// Assert that the current color matches the specified color
		expect(currentColor).toBe(color);
	});
})

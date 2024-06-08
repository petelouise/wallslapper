const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const configPath = path.join(os.homedir(), ".wallslapper.json");

describe("CLI Tests", () => {
  beforeEach(() => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  test("wallslapper --genconfig creates the config only", (done) => {
    exec("node main.js --genconfig", (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(fs.existsSync(configPath)).toBe(true);
      done();
    });
  });
});

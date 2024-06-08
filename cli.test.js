import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

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

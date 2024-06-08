import fs from "fs";
import path from "path";
import os from "os";

const configPath = path.join(os.homedir(), ".wallslapper.json");

export async function readConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = await fs.promises.readFile(configPath, "utf8");
      return JSON.parse(data);
    } else {
      console.warn(`${configPath} not found, returning default config`);
      return { defaultColor: "#000000", defaultTransitionTime: 1000, defaultSchedule: null };
    }
  } catch (error) {
    console.error("Error reading config:", error);
    return { defaultColor: "#000000", defaultTransitionTime: 1000, defaultSchedule: null };
  }
}

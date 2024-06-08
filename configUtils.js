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

export async function genconfig() {
  const exampleConfig = {
    defaultColor: "#000000",
    defaultTransitionTime: 1000,
    defaultSchedule: {
      "08:00": "#FF5733",
      "12:00": "#33FF57",
      "18:00": "#3357FF"
    }
  };

  try {
    await fs.promises.writeFile(configPath, JSON.stringify(exampleConfig, null, 2), "utf8");
    console.log(`Example config written to ${configPath}`);
  } catch (error) {
    console.error("Error writing example config:", error);
  }
}

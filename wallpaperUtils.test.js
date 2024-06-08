const fs = require("fs")
const { writeCurrentColor } = require("./wallpaperUtils.js")
const { jest } = require('@jest/globals')

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}))

describe("writeCurrentColor", () => {
  it("should write the color to currentColor.txt", async () => {
    const color = "#FF5733"
    await writeCurrentColor(color)
    expect(fs.promises.writeFile).toHaveBeenCalledWith("currentColor.txt", color, "utf8")
  })

  it("should handle errors gracefully", async () => {
    const error = new Error("Failed to write file")
    fs.promises.writeFile.mockRejectedValueOnce(error)
    console.error = jest.fn()

    const color = "#FF5733"
    await writeCurrentColor(color)
    expect(console.error).toHaveBeenCalledWith("Error writing current color:", error)
  })
})

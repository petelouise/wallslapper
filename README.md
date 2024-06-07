# Wallpaper Color Transition

This project allows you to transition your desktop wallpaper color smoothly over a specified duration. You can specify a color to transition to immediately or provide a schedule of colors and times of day for automatic transitions.

## Features

- Transition to a specified color immediately.
- Schedule color transitions based on the time of day.
- Smoothly transition between colors over a specified duration.
- Random color transitions if no color or schedule is provided.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

### Transition to a Specified Color

To transition to a specified color immediately, use the `--color` option:
```sh
node main.js --color "#ff00ff"
```

### Schedule Color Transitions

To schedule color transitions based on the time of day, provide a schedule file using the `--scheduleFile` option. The schedule file should be a JSON file with an array of objects, each containing an `hour` (0-23) and a `color` (hex code).

Example `schedule.json`:
```json
[
    { "hour": 8, "color": "#ff00ff" },
    { "hour": 11, "color": "#00ff00" },
    { "hour": 14, "color": "#0000ff" }
]
```

Run the script with the schedule file:
```sh
node main.js --scheduleFile schedule.json
```

### Random Color Transition

If no color or schedule is provided, the script will transition between two random colors:
```sh
node main.js
```

## Development

### Project Structure

- `main.js`: The main entry point of the application.
- `colorUtils.js`: Utility functions for color conversion and interpolation.
- `imageUtils.js`: Utility functions for creating solid color images.
- `wallpaperUtils.js`: Functions for transitioning the wallpaper color and reading/writing the current color.

### Adding New Features

1. Create a new branch for your feature:
    ```sh
    git checkout -b feature-name
    ```

2. Make your changes and commit them:
    ```sh
    git commit -m "Add feature description"
    ```

3. Push your branch and create a pull request:
    ```sh
    git push origin feature-name
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

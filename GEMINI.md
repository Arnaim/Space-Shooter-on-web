# Project: Space-Shooter-on-web

This is a web-based space shooter game developed using the [Phaser 3](https://phaser.io/) game framework.

## Project Overview

- **Purpose:** A prototype space-shooter game.
- **Technologies:** HTML5, JavaScript (ES Modules), Phaser 3.
- **Architecture:** The project uses a multi-scene architecture managed by Phaser:
  - `MenuScene`: Handles the main menu entry point.
  - `GameScene`: Main gameplay loop.
  - `GameOverScene`: Handles the game over state.
- **Assets:** The project utilizes various sprite assets, including ships, weapons, and environment elements, stored in the `/assets` directory.

## Development & Execution

- **Running the Project:** As a pure web project, it can be served using any local web server (e.g., Python's `http.server`, VSCode Live Server).
  - Example (Python): `python -m http.server 8000`
- **Testing:** Currently, there is no automated test suite.
- **Dependencies:** The project loads the Phaser library from a CDN in `index.html`.

## Development Conventions

- **Modules:** The project uses standard ES Modules (`import`/`export`).
- **Styling:** CSS is located in `/styles/styles.css`.
- **Assets:** All game assets are organized in the `/assets` directory.

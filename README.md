# Sci-Fi SoundBoard

> Desktop soundboard with **real Star Trek** and Star Wars–style sound effects. **Electron** + **React** + **Vite**. Runs on **Linux**, **macOS**, and **Windows**. Real audio from a downloadable sound pack; built-in synth fallback when files are missing.

[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Electron](https://img.shields.io/badge/electron-33.x-blue)](systems/soundboard-app/package.json)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey)](README.md)
[![Releases](https://img.shields.io/badge/sounds-GitHub%20Releases-orange)](https://github.com/zerwiz/SciFi-SoundBoard/releases)

---

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Setup and start files](#setup-and-start-files-root)
- [Build installers](#build-installers-linux--windows)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Adding the sound pack](#adding-the-sound-pack-maintainers)
- [License](#license)

---

## Features

- **Two panels:** Galactic Empire (blaster, lightsaber, TIE engine, etc.) and **Starfleet Command** with **real Star Trek sounds** (phaser, communicator, red alert, transporter, Enterprise door, computer, warp, tricorder, torpedo, hail).
- **Real sounds:** Playback from downloaded audio files (MP3/OGG/WAV); Star Trek panel uses re-creations from Freesound (TOS/TNG style).
- **Synth fallback:** Built-in Web Audio synthesis when a sound file is missing
- **Setup script:** Downloads the sound pack from [releases](https://github.com/zerwiz/SciFi-SoundBoard/releases) to your machine
- **Cross-platform:** Linux (AppImage, deb), macOS, and Windows (NSIS)

---

## Quick start

**Prerequisites:** [Node.js](https://nodejs.org) 18+

Setup installs dependencies and **real Star Trek & Star Wars sounds** by downloading **sci-fi-sounds.zip** from [GitHub Releases](https://github.com/zerwiz/SciFi-SoundBoard/releases) when present, or from Freesound.org when `FREESOUND_API_KEY` is set ([get a token](https://freesound.org/apiv2/apply)). Use `--skip-sounds` for synth-only (see [Adding the sound pack](#adding-the-sound-pack-maintainers)).

| Platform | Commands |
|----------|----------|
| **macOS / Linux** | See below |
| **Windows** | `setup.bat` then `start.bat` |

**macOS / Linux:**

```bash
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
chmod +x setup.sh start.sh
./setup.sh
./start.sh
```

**Windows (cmd):**

```cmd
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
setup.bat
start.bat
```

**Using npm only:**

```bash
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
npm install && cd systems/soundboard-app && npm install && cd ../..
npm run setup
npm start
```

No release yet? Set `FREESOUND_API_KEY` (from [freesound.org/apiv2/apply](https://freesound.org/apiv2/apply)) and run setup again to install real sounds from Freesound. Or run `./setup.sh --skip-sounds` for synthesized sounds only. See [docs/SOUND_SOURCES.md](docs/SOUND_SOURCES.md) and [docs/SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md).

---

## Setup and start files (root)

| File | Platform | Description |
|------|----------|-------------|
| **setup.sh** | macOS, Linux | Installs dependencies (root + app) and **real sound pack** from Releases. Run once. Use `--skip-sounds` for synth-only. |
| **setup.bat** | Windows | Same as above for Windows. |
| **start.sh** | macOS, Linux | Starts the Electron app (run after setup). |
| **start.bat** | Windows | Starts the Electron app. |

Setup installs: root `node_modules`, `systems/soundboard-app/node_modules`, and **real Star Trek & Star Wars sound files** to `systems/soundboard-app/public/sounds/` from the latest GitHub Release (`sci-fi-sounds.zip`) or, when no release exists, from Freesound.org if `FREESOUND_API_KEY` is set. Requires Node.js 18+. Use `./setup.sh --skip-sounds` (or `SKIP_SOUNDS=1`) to complete setup with synthesized sounds only.

## Scripts (npm)

| Command | Description |
|--------|-------------|
| `npm run setup` | Download sound pack only (from latest GitHub Release) |
| `npm start` | Run the Electron app |
| `npm run build` | Build the React app (Vite) |
| `npm run dist` | Build app and create installers (Linux + Windows) |

---

## Build installers (Linux / Windows)

From repo root:

```bash
npm run dist
```

Or from the app directory:

```bash
cd systems/soundboard-app
npm run dist        # both platforms
npm run dist:linux  # AppImage + deb
npm run dist:win    # Windows NSIS
```

Output: `systems/soundboard-app/out/`.

---

## Project structure

```
SciFi-SoundBoard/
├── README.md
├── package.json          # Root scripts + adm-zip for setup
├── config/
│   └── sound-pack.json    # GitHub repo & asset name for sound pack
├── docs/
│   ├── PLANNING.md        # Roadmap, architecture, phases
│   ├── SOUND_SOURCES.md   # Where to download each sound (links)
│   └── SOUNDS_MANIFEST.md # Track sources & licenses
├── scripts/
│   ├── full-setup.js     # Full setup: deps + sound pack (used by setup.sh / setup.bat)
│   └── download-sounds.js# Fetches sci-fi-sounds.zip from Releases, extracts to app
└── systems/
    └── soundboard-app/    # Electron + React (Vite) app
        ├── electron/      # Main process
        ├── public/sounds/ # Sound files (after npm run setup)
        └── src/           # React UI
```

---

## Documentation

- [**docs/PLANNING.md**](docs/PLANNING.md) — Roadmap, architecture, sound inventory, Electron packaging
- [**docs/SOUND_SOURCES.md**](docs/SOUND_SOURCES.md) — Curated links to download each sound (Freesound, BigSoundBank, etc.)
- [**docs/SOUNDS_MANIFEST.md**](docs/SOUNDS_MANIFEST.md) — Per-sound source URL and license tracking

---

## Adding the sound pack (maintainers)

So that `./setup.sh` / `setup.bat` install real sounds for everyone:

1. Collect the 20 sound files (see [SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md)); name by ID (e.g. `blaster.mp3`, `red_alert.mp3`).
2. Zip as **sci-fi-sounds.zip** (files at root of zip, no subfolder).
3. [Create a new Release](https://github.com/zerwiz/SciFi-SoundBoard/releases/new) → tag e.g. `v1.0.0` → upload **sci-fi-sounds.zip** as an asset.
4. New clones running `./setup.sh` or `setup.bat` will download and extract into `systems/soundboard-app/public/sounds/`.

---

## License

Code in this repository: use as you like. Sound files are from third-party sources (CC0, CC-BY, etc.); see [SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md) and [SOUND_SOURCES.md](docs/SOUND_SOURCES.md) for credits and licenses.

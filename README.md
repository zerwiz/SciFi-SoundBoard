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

Setup **must install real sounds**. It uses, in order: (1) latest GitHub Release asset `sci-fi-sounds.zip`, (2) Freesound.org API if `FREESOUND_API_KEY` is set, (3) committed `config/direct-sound-urls.json` if present. Requires Node.js 18+. Use `./setup.sh --skip-sounds` or `setup.bat --skip-sounds` to allow synth-only (optional).

## Scripts (npm)

| Command | Description |
|--------|-------------|
| `npm run setup` | Download sound pack (Release, Freesound API, or config/direct-sound-urls.json) |
| `npm run generate-direct-urls` | Generate `config/direct-sound-urls.json` from Freesound (set `FREESOUND_API_KEY` first) |
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
│   ├── sound-pack.json    # GitHub repo & asset name for sound pack
│   ├── freesound-ids.json  # App ID → Freesound ID (for API / generator)
│   └── direct-sound-urls.json  # Optional: direct preview URLs (no API key needed)
├── docs/
│   ├── PLANNING.md        # Roadmap, architecture, phases
│   ├── SOUND_SOURCES.md   # Where to download each sound (links)
│   └── SOUNDS_MANIFEST.md # Track sources & licenses
├── scripts/
│   ├── full-setup.js     # Full setup: deps + sound pack (used by setup.sh / setup.bat)
│   ├── download-sounds.js # Fetches sounds (Release, Freesound API, or direct-sound-urls)
│   └── generate-direct-urls.js # One-time: generate direct-sound-urls.json (needs FREESOUND_API_KEY)
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

Setup must install real sounds. Use one of these so that `./setup.sh` / `setup.bat` install them for everyone:

**Option A — GitHub Release (recommended)**  
1. Collect the 20 sound files (see [SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md)); name by ID (e.g. `blaster.mp3`, `red_alert.mp3`).  
2. Zip as **sci-fi-sounds.zip** (files at root of zip, no subfolder).  
3. [Create a new Release](https://github.com/zerwiz/SciFi-SoundBoard/releases/new) → tag e.g. `v1.0.0` → upload **sci-fi-sounds.zip** as an asset.  
4. New clones running `./setup.sh` or `setup.bat` will download and extract into `systems/soundboard-app/public/sounds/`.

**Option B — Direct URLs (no release, no per-user API key)**  
1. Get a [Freesound API key](https://freesound.org/apiv2/apply).  
2. Run once: `FREESOUND_API_KEY=yourkey npm run generate-direct-urls` (macOS/Linux). On Windows: `set FREESOUND_API_KEY=yourkey` then `npm run generate-direct-urls`.  
3. Commit the generated `config/direct-sound-urls.json`.  
4. Setup will then install real sounds from those URLs for all users.

---

## License

Code in this repository: use as you like. Sound files are from third-party sources (CC0, CC-BY, etc.); see [SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md) and [SOUND_SOURCES.md](docs/SOUND_SOURCES.md) for credits and licenses.

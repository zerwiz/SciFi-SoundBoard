# Sci-Fi SoundBoard

Desktop soundboard with **real Star Trek** and Star Wars–style sound effects. **Electron** + **React**, runs on **Linux** and **Windows**. Uses real audio files (Star Trek re-creations from Freesound, etc.) when available and falls back to synthesized sounds.

[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](package.json)
[![Electron](https://img.shields.io/badge/electron-33.x-blue)](systems/soundboard-app/package.json)

---

## Features

- **Two panels:** Galactic Empire (blaster, lightsaber, TIE engine, etc.) and **Starfleet Command** with **real Star Trek sounds** (phaser, communicator, red alert, transporter, Enterprise door, computer, warp, tricorder, torpedo, hail).
- **Real sounds:** Playback from downloaded audio files (MP3/OGG/WAV); Star Trek panel uses re-creations from Freesound (TOS/TNG style).
- **Synth fallback:** Built-in Web Audio synthesis when a sound file is missing
- **Setup script:** Downloads the sound pack from [releases](https://github.com/zerwiz/SciFi-SoundBoard/releases) to your machine
- **Cross-platform:** Linux (AppImage, deb) and Windows (NSIS)

---

## Quick start

**Prerequisites:** Node.js 18+ ([download](https://nodejs.org))

### Using setup and start files (recommended)

Setup detects your **OS and architecture**, installs all dependencies (root + app), and downloads the sound pack.

**Linux / macOS:**

```bash
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
chmod +x setup.sh start.sh
./setup.sh
./start.sh
```

**Windows:**

```cmd
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
setup.bat
start.bat
```

### Using npm only

```bash
git clone https://github.com/zerwiz/SciFi-SoundBoard.git
cd SciFi-SoundBoard
npm install
cd systems/soundboard-app && npm install && cd ../..
npm run setup
npm start
```

If no [release with the sound pack](https://github.com/zerwiz/SciFi-SoundBoard/releases) exists yet, the app still runs using **synthesized** sounds only. To add **real Star Trek** (and Star Wars) sounds, see [docs/SOUND_SOURCES.md](docs/SOUND_SOURCES.md) and [docs/SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md).

---

## Setup and start files (root)

| File | Platform | Description |
|------|----------|-------------|
| **setup.sh** | Linux / macOS | Detects OS and arch, installs all dependencies (root + app), downloads sound pack. Run once. |
| **setup.bat** | Windows | Same as above for Windows. |
| **start.sh** | Linux / macOS | Starts the Electron app (run after setup). |
| **start.bat** | Windows | Starts the Electron app. |

Setup installs: root `node_modules`, `systems/soundboard-app/node_modules`, and sound files to `systems/soundboard-app/public/sounds/` (from GitHub Releases). Requires Node.js 18+.

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
│   └── download-sounds.js # Fetches sci-fi-sounds.zip from Releases, extracts to app
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

To enable `npm run setup` for everyone:

1. Collect the 20 sound files (see [SOUNDS_MANIFEST](docs/SOUNDS_MANIFEST.md)); name them by ID (e.g. `blaster.mp3`, `red_alert.mp3`).
2. Zip them as **sci-fi-sounds.zip** (no extra folder: files at root of zip).
3. [Create a new Release](https://github.com/zerwiz/SciFi-SoundBoard/releases/new), tag e.g. `v1.0.0`, and upload **sci-fi-sounds.zip** as an asset.
4. Users who run `npm run setup` will download and extract it into `systems/soundboard-app/public/sounds/`.

---

## License

Code: use as you like. Sound files are from third-party sources (CC0, CC-BY, etc.); see [docs/SOUNDS_MANIFEST.md](docs/SOUNDS_MANIFEST.md) and [docs/SOUND_SOURCES.md](docs/SOUND_SOURCES.md) for credits and licenses.

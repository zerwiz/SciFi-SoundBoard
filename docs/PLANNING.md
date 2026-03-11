# Sci-Fi SoundBoard — Planning & Roadmap

## Overview

Build an **Electron desktop app** that provides a sci-fi soundboard with **real audio files** (replacing the current synthesized Web Audio API sounds). The app must run on **Linux** and **Windows** and open the existing React UI as the main window.

---

## 1. Goals

| Goal | Description |
|------|-------------|
| **Real sounds** | Replace all synthesized sounds with real, high-quality audio files. |
| **Legal sources** | Use only royalty-free / CC-licensed / public-domain sources. |
| **Electron app** | Package as a desktop app that opens the UI on the user’s machine. |
| **Cross-platform** | Support **Linux** and **Windows** (macOS optional later). |
| **Same UX** | Keep the existing two-panel layout (Galactic Empire / Starfleet Command) and button grid. |

---

## 2. Sound Inventory & Sources

### 2.1 Sounds to Replace (by ID)

**Galactic Empire (Star Wars–style)**  
- `blaster` — Blaster shot  
- `lightsaber` — Lightsaber hum/ignition  
- `droid` — Astromech beeps  
- `tie_engine` — TIE fighter engine  
- `vader` — Respirator / breathing  
- `hyperdrive` — Jump to hyperspace  
- `seismic` — Seismic charge / explosion  
- `force` — Force effect / whoosh  
- `thermal` — Thermal detonator  
- `deflector` — Shield / deflector  

**Starfleet Command (Star Trek–style)**  
- `phaser` — Phaser shot  
- `communicator` — Comms chirp / open  
- `red_alert` — Red alert siren  
- `transporter` — Transporter beam  
- `warp` — Warp core / engine  
- `tricorder` — Tricorder scan  
- `door` — Airlock / door  
- `computer` — Computer beep  
- `torpedo` — Photon torpedo  
- `hail` — Incoming hail / chime  

### 2.2 Where to Find Real Sounds (Legal)

| Source | License | Notes |
|--------|--------|--------|
| **Freesound.org** | CC0, CC-BY, CC-BY-NC | Huge library; filter by license. Prefer CC0/CC-BY for no attribution or simple attribution. |
| **Pixabay (Sound)** | Pixabay License | Free for commercial use, no attribution required. |
| **Mixkit** | Mixkit License | Free sound effects. |
| **BBC Sound Effects** | RemArc (research/education) | Check terms for desktop app use. |
| **OpenGameArt** | Various (CC, GPL, etc.) | Good for blasters, UI beeps, engines. |
| **Zapsplat** | Free with attribution | Large SFX library. |

**Search terms (examples):**  
- Blaster: “sci-fi blaster”, “laser gun”, “energy weapon”  
- Lightsaber: “lightsaber”, “sword hum”, “sci-fi sword”  
- Phaser: “phaser”, “sci-fi beam”, “stun gun”  
- Engines: “spaceship engine”, “sci-fi engine”, “warp”  
- UI: “sci-fi beep”, “computer beep”, “interface beep”, “alert siren”, “door whoosh”  

### 2.3 Download & File Conventions

- **Format:** Prefer **MP3** or **OGG** for size; **WAV** acceptable if bundled size is fine.
- **Naming:** Use the **exact ID** from the app so code can map 1:1, e.g.:
  - `blaster.mp3`, `lightsaber.mp3`, `phaser.mp3`, …
- **Location in repo:** e.g. `systems/soundboard-app/assets/sounds/` (or `public/sounds/` if using a single React/Electron app).
- **Download workflow:**
  1. Maintain a **sounds manifest** (e.g. `docs/SOUNDS_MANIFEST.md`) with: sound ID, source URL, license, filename.
  2. Download manually from chosen sites, or use a small **script** (e.g. `scripts/fetch-sounds.sh` or Node script) that downloads from stable URLs if you have direct links.
  3. Place files in the assets folder with the correct name.

---

## 3. Application Architecture

### 3.1 High-Level Structure

```
/ (root)
├── README.md
├── .gitignore
├── package.json          # Root: workspace or single Electron app
├── docs/
│   ├── PLANNING.md       # This file
│   └── SOUNDS_MANIFEST.md
├── systems/
│   └── soundboard-app/   # Electron + React app
│       ├── package.json
│       ├── electron/
│       │   ├── main.js   # Entry, BrowserWindow, load React app
│       │   └── preload.js
│       ├── src/
│       │   ├── App.tsx   # Your existing UI (adapted to play files)
│       │   └── ...
│       ├── public/
│       │   └── sounds/  # Or assets/sounds/
│       │       ├── blaster.mp3
│       │       ├── lightsaber.mp3
│       │       └── ...
│       └── README.md
└── scripts/
    └── fetch-sounds.sh   # Optional: download helper
```

- **Single-app approach:** One Electron app in `systems/soundboard-app/` keeps the repo simple and matches your “systems” layout.

### 3.2 Electron Stack

- **Runtime:** Electron (current LTS).
- **UI:** React (existing component), built with Vite or Create React App; load the built bundle from the Electron main process.
- **Audio:** Play real files via **HTML5 `<audio>`** or **Web Audio API** (decode audio from file and play). No synthesis for these buttons.
- **Main process:**  
  - Create one `BrowserWindow` (no nodeIntegration in renderer; use preload if needed).  
  - Load `file://` or `loadFile('index.html')` pointing to the React build.

### 3.3 Playing Real Sounds in the UI

- **Option A — HTML5 Audio:**  
  For each button, create an `Audio` object (or reuse one per ID), set `src` to the path of the sound file. On click, set `currentTime = 0` and call `play()`. Path in Electron: use a path relative to the app (e.g. `resources/assets/sounds/` or bundled with the build).

- **Option B — Web Audio API:**  
  Fetch the file (or use `path` from Electron via preload), decode with `AudioContext.decodeAudioData()`, then play via `AudioBufferSourceNode`. Gives more control (volume, stop, etc.) and fits your current “active” state.

- **Fallback:** If a file is missing, optionally fall back to the existing synthesized sound for that ID so the app never breaks.

### 3.4 Path to Sounds in Electron

- **Dev:** e.g. `public/sounds/blaster.mp3` → request from React as `/sounds/blaster.mp3` (Vite/CRA serve it).
- **Packaged:** Copy `sounds/` into the Electron `resources` (or next to the executable) and use:
  - `process.resourcesPath` (or `app.getPath('resources')`) in main, or
  - Preload that exposes a `getSoundPath(id)` returning a file URL or path the renderer can use for `<audio src>` or fetch + decode.

Recommendation: **single assets folder** (e.g. `public/sounds/` or `assets/sounds/`), and in Electron builder config copy it into the package so the same relative paths work in dev and prod.

---

## 4. Cross-Platform (Linux + Windows)

### 4.1 Build & Package

- **Tool:** `electron-builder` (in `systems/soundboard-app/package.json`).
- **Targets:**
  - **Windows:** `nsis` or `portable` (e.g. `.exe` installer or portable).
  - **Linux:** `AppImage`, `deb`, and/or `snap` (at least one format).
- **Config:** In `package.json`:
  - `"main": "electron/main.js"` (or built main).
  - `"build": { "appId": "...", "linux": { "target": ["AppImage","deb"] }, "win": { "target": ["nsis"] } }`.
- **Assets:** Ensure `sounds/` is included in `extraResources` or `files` so they are present on both platforms.

### 4.2 Testing Matrix

| OS | Test |
|----|------|
| Linux | Run `npm run start` and packaged AppImage/deb; confirm all sounds play. |
| Windows | Same on a Windows machine or VM; confirm paths and playback. |

### 4.3 Platform-Specific Notes

- **Paths:** Use `path.join()` and `path.sep` in Electron so paths work on both OSes.
- **Audio:** HTML5 Audio and Web Audio API are supported on both; no extra native modules required for playback.

---

## 5. Implementation Phases

### Phase 1 — Repo & Electron Shell (Week 1)

- [ ] Initialize repo: root `README.md`, `.gitignore`, optional `docs/`, `systems/soundboard-app/`.
- [ ] Create Electron app: `main.js`, `preload.js`, load React build.
- [ ] Set up React build (Vite or CRA) and ensure Electron opens the built index.
- [ ] Document in `systems/soundboard-app/README.md`: purpose, dependencies, how to run and build.

### Phase 2 — Sound Sourcing & Manifest (Week 1–2)

- [ ] Create `docs/SOUNDS_MANIFEST.md` with columns: `id`, `source URL`, `license`, `filename`.
- [ ] For each of the 20 sound IDs, pick one source (Freesound, Pixabay, etc.) and add to manifest.
- [ ] Download files and place in `systems/soundboard-app/public/sounds/` (or chosen path) with IDs as filenames (e.g. `blaster.mp3`).
- [ ] Optional: add `scripts/fetch-sounds.sh` or Node script if you have stable URLs.

### Phase 3 — Wire Real Sounds into UI (Week 2)

- [ ] Replace synthesized `playSound(id)` logic with: resolve file path for `id`, then play via `<audio>` or Web Audio (decode + play).
- [ ] Keep `activeSound` state and button styling; ensure “active” feedback still works.
- [ ] Add fallback to synthesized sound when file is missing (optional).
- [ ] Test all 20 buttons in dev (Electron + npm run dev).

### Phase 4 — Packaging & Cross-Platform (Week 3)

- [ ] Add `electron-builder` and configure for Linux (e.g. AppImage, deb) and Windows (nsis).
- [ ] Ensure `sounds/` is bundled and paths work in packaged app on both OSes.
- [ ] Test packaged app on Linux and Windows.
- [ ] Update root `README.md` and `docs/PLANNING.md` with build instructions and any changes.

### Phase 5 — Docs & Polish (Ongoing)

- [ ] Keep `docs/PLANNING.md` and `docs/SOUNDS_MANIFEST.md` updated.
- [ ] Add short “How to add a new sound” to README or `docs/`.
- [ ] Optional: volume control, keyboard shortcuts, system tray.

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Some sounds hard to find (e.g. iconic “exact” sounds) | Use “inspired” alternatives; keep synthesized fallback. |
| License confusion | Document every file in SOUNDS_MANIFEST.md with URL and license. |
| Large bundle size | Use MP3/OGG; optional “lazy load” or separate download for sound pack. |
| Path bugs on Windows vs Linux | Use `path.join`, `app.getPath()`, and test on both. |

---

## 7. Success Criteria

- [ ] All 20 buttons play a **real** sound file (no synthesis for primary path).
- [ ] App runs as an Electron window on **Linux** and **Windows**.
- [ ] Packaged builds (e.g. AppImage/deb + Windows installer) work and include sounds.
- [ ] `docs/PLANNING.md` and `docs/SOUNDS_MANIFEST.md` are maintained and accurate.
- [ ] Each major directory has a README explaining purpose and usage.

---

## 8. References

- [Electron docs](https://www.electronjs.org/docs/latest)
- [electron-builder](https://www.electron.build/)
- [Freesound](https://freesound.org/) — search + filter by license
- [Pixabay Sounds](https://pixabay.com/sound-effects/)

---

*Last updated: 2025-03-11*

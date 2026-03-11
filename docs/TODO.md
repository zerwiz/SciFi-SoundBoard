# Sci-Fi SoundBoard — TODO

Track tasks and next steps. Keep this in sync with [PLANNING.md](PLANNING.md).

---

## Done

- [x] Repo structure: root `README.md`, `.gitignore`, `docs/`, `systems/soundboard-app/`
- [x] Electron app: `electron/main.js`, loads React (Vite build or dev URL)
- [x] React + Vite + Tailwind UI (two panels: Galactic Empire / Starfleet Command)
- [x] Play real sounds from `public/sounds/` (MP3/OGG/WAV), fallback to synthesized sounds
- [x] `docs/SOUNDS_MANIFEST.md` and `docs/SOUND_SOURCES.md` with Star Trek and Star Wars links
- [x] Setup script: `scripts/download-sounds.js` — downloads sound pack from GitHub Releases, extracts to `public/sounds/`
- [x] Config: `config/sound-pack.json` (repo, asset name, sounds dir)
- [x] Root `package.json`: `npm run setup`, `npm start`, `npm run build`, `npm run dist`
- [x] Root setup/start files: `setup.sh` / `setup.bat`, `start.sh` / `start.bat`; `scripts/full-setup.js` (detect OS/arch, install deps, download sounds)
- [x] electron-builder in app: Linux (AppImage, deb), Windows (nsis)
- [x] `systems/soundboard-app/README.md` and root README with quick start
- [x] Real Star Trek sounds doc and manifest (phaser, communicator, red alert, transporter, door, computer, etc.)
- [x] Dev workflow: `start:dev` in app (concurrently + wait-on) for Vite + Electron hot reload

---

## Next

### Sound pack & release

- [ ] **Download real sounds**  
  Use [SOUND_SOURCES.md](SOUND_SOURCES.md) and [SOUNDS_MANIFEST.md](SOUNDS_MANIFEST.md) to download all 20 files (Star Trek + Star Wars). Rename to ID (e.g. `blaster.mp3`, `phaser.mp3`).
- [ ] **Create sci-fi-sounds.zip**  
  Zip the 20 files at root of zip (no subfolder). Filenames must match IDs so the app finds them.
- [ ] **Publish GitHub Release**  
  Create a release (e.g. `v1.0.0`) at [Releases](https://github.com/zerwiz/SciFi-SoundBoard/releases), upload `sci-fi-sounds.zip` as asset. Then `./setup.sh` / `setup.bat` and `npm run setup` will install sounds for users.

### Build & test

- [ ] **Build app (Linux)**  
  From root: `npm run dist` or `cd systems/soundboard-app && npm run dist:linux`. Output: `systems/soundboard-app/out/` (AppImage, deb).
- [ ] **Build app (Windows)**  
  From root: `npm run dist` or `cd systems/soundboard-app && npm run dist:win`. Output: `systems/soundboard-app/out/` (NSIS installer).
- [ ] **Test packaged app**  
  Run the built installer/AppImage on Linux and Windows; confirm window opens and all 20 buttons play (real or synth).
- [ ] **Test setup/start on clean machine**  
  Clone repo, run `./setup.sh` (or `setup.bat` on Windows), then `./start.sh` (or `start.bat`); confirm app starts.

---

## Verification (success criteria)

- [ ] All 20 buttons play a real sound file when sound pack is present (or synth fallback when not).
- [ ] App runs as an Electron window on Linux and Windows.
- [ ] Packaged builds (AppImage/deb + Windows NSIS) run and include sounds if present in `public/sounds/`.
- [ ] `docs/PLANNING.md`, `docs/SOUNDS_MANIFEST.md`, and this TODO are up to date.
- [ ] Root and `systems/soundboard-app` have a README with purpose and usage.

---

## Backlog / Optional

- [ ] Volume control (global or per-panel) in the UI
- [ ] Keyboard shortcuts for sounds (e.g. 1–0 for first row)
- [ ] System tray (minimize to tray, quick play)
- [ ] “How to add a new sound” section in README or docs
- [ ] Credits screen in app (sound authors / licenses from SOUNDS_MANIFEST)
- [ ] macOS build target (electron-builder --mac)
- [ ] Preload script if Electron needs to expose paths or APIs to renderer later
- [ ] Real Star Wars sounds table in SOUND_SOURCES (mirror Star Trek section) if not already done

---

## Reference

| Doc | Purpose |
|-----|--------|
| [PLANNING.md](PLANNING.md) | Roadmap, architecture, phases |
| [SOUND_SOURCES.md](SOUND_SOURCES.md) | Where to download each sound (real Star Trek + Star Wars) |
| [SOUNDS_MANIFEST.md](SOUNDS_MANIFEST.md) | Per-sound URL, license, filename |

---

*Last updated: 2025-03-11*

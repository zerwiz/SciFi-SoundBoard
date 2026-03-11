# Sci-Fi SoundBoard App

Electron + React (Vite) desktop app for the sci-fi soundboard. Part of [SciFi-SoundBoard](https://github.com/zerwiz/SciFi-SoundBoard).

## Purpose

- Renders the two-panel UI (Galactic Empire / Starfleet Command).
- Plays sounds from `public/sounds/` (real files) or falls back to Web Audio synthesis.
- Packaged for **Linux** (AppImage, deb) and **Windows** (NSIS).

## Dependencies

- Node.js 18+
- npm (root repo runs `npm run setup` to fill `public/sounds/`)

## Setup & run

From **repo root** (recommended):

```bash
npm install
npm run setup   # download sounds
npm start
```

From this directory:

```bash
npm install
npm run start   # needs Vite build or dev; from root use `npm start`
```

For dev with hot reload, run Vite and Electron together (see root README or use `npm run start:dev` if configured).

## Build & package

```bash
npm run build   # Vite build → dist/
npm run dist    # electron-builder → out/ (installers)
npm run dist:linux
npm run dist:win
```

## Ports / APIs

- Dev: Vite dev server `http://127.0.0.1:5173` (Electron loads this in dev).
- No backend; sounds are local files under `public/sounds/`.

## Structure

- `electron/main.js` — Electron main process, creates window, loads app.
- `src/App.jsx` — React UI and playback (real + synth fallback).
- `public/sounds/` — Audio files (populated by root `npm run setup`).

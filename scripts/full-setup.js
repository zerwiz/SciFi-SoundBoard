#!/usr/bin/env node
/**
 * Full setup: detect OS/arch, install all dependencies (root + app), then download sounds.
 * Run from repo root: node scripts/full-setup.js
 * Or use: ./setup.sh (Linux/macOS) or setup.bat (Windows)
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'systems', 'soundboard-app');
const soundsDir = path.join(rootDir, 'systems', 'soundboard-app', 'public', 'sounds');

const skipSoundsCheck = process.argv.includes('--skip-sounds') || process.env.SKIP_SOUNDS === '1';

const platform = process.platform;   // 'win32' | 'darwin' | 'linux'
const arch = process.arch;          // 'x64' | 'arm64' | 'ia32'
const isWindows = platform === 'win32';

const osNames = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' };
const archNames = { x64: 'x64 (64-bit)', arm64: 'ARM64', ia32: 'x86 (32-bit)' };

function log(msg) {
  console.log('[setup]', msg);
}

function run(cmd, opts = {}) {
  const cwd = opts.cwd || rootDir;
  const shell = isWindows ? true : undefined;
  log(`Running: ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', shell, ...opts });
}

function main() {
  log(`Detected: ${osNames[platform] || platform} | ${archNames[arch] || arch}`);
  log('');

  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (major < 18) {
    console.error('[setup] Node.js 18+ is required. Current:', nodeVersion);
    console.error('        Install from https://nodejs.org');
    process.exit(1);
  }
  log(`Node.js ${nodeVersion} OK`);
  log('');

  if (!fs.existsSync(path.join(rootDir, 'package.json'))) {
    console.error('[setup] Run this script from the repo root (where package.json is).');
    process.exit(1);
  }

  log('Installing root dependencies...');
  run(isWindows ? 'npm.cmd install' : 'npm install', { cwd: rootDir });
  log('');

  if (!fs.existsSync(path.join(appDir, 'package.json'))) {
    console.error('[setup] App not found at systems/soundboard-app');
    process.exit(1);
  }

  log('Installing app dependencies (systems/soundboard-app)...');
  run(isWindows ? 'npm.cmd install' : 'npm install', { cwd: appDir });
  log('');

  log('Downloading real Star Trek & Star Wars sounds (GitHub Release or Freesound API)...');
  try {
    run(isWindows ? 'node scripts\\download-sounds.js' : 'node scripts/download-sounds.js', { cwd: rootDir, env: { ...process.env } });
  } catch (e) {
    log('Sound download failed (no release or network). Will check for existing files.');
  }

  const audioExtensions = ['.mp3', '.ogg', '.wav'];
  const hasRealSounds = fs.existsSync(soundsDir) && fs.readdirSync(soundsDir).some((name) => {
    const ext = path.extname(name).toLowerCase();
    return audioExtensions.includes(ext);
  });

  if (!hasRealSounds && !skipSoundsCheck) {
    console.error('');
    console.error('[setup] Real Star Trek & Star Wars sounds were not installed.');
    console.error('  • Use a release: create a GitHub Release with asset "sci-fi-sounds.zip" at:');
    console.error('    https://github.com/zerwiz/SciFi-SoundBoard/releases');
    console.error('  • Or set FREESOUND_API_KEY (get a token at https://freesound.org/apiv2/apply) and run setup again.');
    console.error('  • See docs/SOUND_SOURCES.md and docs/SOUNDS_MANIFEST.md for manual sources.');
    console.error('  • To run without real sounds (synth only): ./setup.sh --skip-sounds or set SKIP_SOUNDS=1');
    process.exit(1);
  }
  if (!hasRealSounds && skipSoundsCheck) {
    log('Skipping sound check (--skip-sounds). App will use synthesized sounds only.');
  } else if (hasRealSounds) {
    log('Real sounds installed successfully.');
  }
  log('');

  log('Setup complete. Run ./start.sh or start.bat (or npm start) to launch the app.');
}

main();

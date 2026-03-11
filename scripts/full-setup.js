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

  log('Downloading sound pack (from GitHub Releases)...');
  try {
    run(isWindows ? 'node scripts\\download-sounds.js' : 'node scripts/download-sounds.js', { cwd: rootDir });
  } catch (e) {
    log('Sound pack download failed (no release yet?). App will use synthesized sounds.');
    log('To add real sounds later: create a release with sci-fi-sounds.zip or see docs/SOUND_SOURCES.md');
  }
  log('');

  log('Setup complete. Run ./start.sh or start.bat (or npm start) to launch the app.');
}

main();

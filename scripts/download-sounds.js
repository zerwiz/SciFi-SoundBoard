#!/usr/bin/env node
/**
 * Download sci-fi sound pack to the app's public/sounds folder.
 * Uses GitHub Releases: https://github.com/zerwiz/SciFi-SoundBoard/releases
 * Run: npm run setup (from repo root)
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { get } = require('http');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'sound-pack.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const [owner, repo] = config.repo.split('/');
const ASSET_NAME = config.asset;
const SOUNDS_DIR = path.join(__dirname, '..', config.soundsDir);

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : require('http');
    lib.get(url, opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

function fetchJSON(url) {
  return fetch(url, { headers: { 'User-Agent': 'SciFi-SoundBoard-Setup/1.0' } }).then(({ statusCode, body }) => {
    if (statusCode !== 200) throw new Error(`HTTP ${statusCode}: ${url}`);
    return JSON.parse(body.toString());
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);
    const lib = url.startsWith('https') ? https : require('http');
    lib.get(url, { headers: { 'User-Agent': 'SciFi-SoundBoard-Setup/1.0' } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { file.close(); reject(e); });
  });
}

async function main() {
  console.log('Sci-Fi SoundBoard — Downloading sound pack...');
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });

  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  let release;
  try {
    const data = await fetchJSON(`${apiBase}/releases/latest`);
    release = data;
  } catch (e) {
    console.warn('No latest release found. Create a release with asset "' + ASSET_NAME + '" at https://github.com/' + config.repo + '/releases');
    console.warn('See docs/PLANNING.md and docs/SOUND_SOURCES.md for manual download sources.');
    process.exit(1);
  }

  const asset = (release.assets || []).find((a) => a.name === ASSET_NAME);
  if (!asset || !asset.browser_download_url) {
    console.warn('Release "' + release.tag_name + '" has no asset "' + ASSET_NAME + '".');
    console.warn('Add ' + ASSET_NAME + ' to the release, or download sounds manually (see docs/SOUND_SOURCES.md).');
    process.exit(1);
  }

  const zipPath = path.join(SOUNDS_DIR, ASSET_NAME);
  console.log('Downloading', asset.browser_download_url, '->', zipPath);
  await downloadFile(asset.browser_download_url, zipPath);

  mainExtract(zipPath);
  console.log('Sounds installed to', SOUNDS_DIR);
}

function mainExtract(zipPath) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  const extractDir = path.join(SOUNDS_DIR, '_tmp');
  fs.mkdirSync(extractDir, { recursive: true });
  zip.extractAllTo(extractDir, true);

  function flattenDir(dir, base = '') {
    const names = fs.readdirSync(dir);
    for (const name of names) {
      const full = path.join(dir, name);
      const rel = path.join(base, name);
      if (fs.statSync(full).isDirectory()) {
        flattenDir(full, rel);
      } else {
        const ext = path.extname(name).toLowerCase();
        if (['.mp3', '.ogg', '.wav'].includes(ext)) {
          const dest = path.join(SOUNDS_DIR, name);
          fs.renameSync(full, dest);
          console.log('  ', name);
        }
      }
    }
  }
  flattenDir(extractDir);
  fs.rmSync(extractDir, { recursive: true, force: true });
  fs.unlinkSync(zipPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

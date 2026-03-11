#!/usr/bin/env node
/**
 * Download sci-fi sound pack (real Star Trek + Star Wars sounds) to the app's public/sounds folder.
 * 1) Tries GitHub Releases (sci-fi-sounds.zip).
 * 2) If no release: uses Freesound API when FREESOUND_API_KEY is set (downloads real sounds by ID).
 * Run: npm run setup (from repo root). Optional: FREESOUND_API_KEY for fallback downloads.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'sound-pack.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const [owner, repo] = config.repo.split('/');
const ASSET_NAME = config.asset;
const SOUNDS_DIR = path.join(__dirname, '..', config.soundsDir);
const FREESOUND_IDS_PATH = path.join(__dirname, '..', 'config', 'freesound-ids.json');

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

async function downloadFromFreesound() {
  const key = process.env.FREESOUND_API_KEY;
  if (!key || !key.trim()) return false;
  if (!fs.existsSync(FREESOUND_IDS_PATH)) return false;
  const ids = JSON.parse(fs.readFileSync(FREESOUND_IDS_PATH, 'utf8')).sounds;
  if (!ids || typeof ids !== 'object') return false;

  console.log('Downloading real Star Trek & Star Wars sounds from Freesound.org (API)...');
  const apiBase = 'https://freesound.org/apiv2';
  for (const [appId, freesoundId] of Object.entries(ids)) {
    try {
      const info = await fetchJSON(`${apiBase}/sounds/${freesoundId}/?token=${encodeURIComponent(key.trim())}`);
      const url = info.previews && (info.previews['preview-hq-mp3'] || info.previews['preview-lq-mp3']);
      if (!url) continue;
      const dest = path.join(SOUNDS_DIR, appId + '.mp3');
      await downloadFile(url, dest);
      console.log('  ', appId + '.mp3');
    } catch (e) {
      console.warn('  Skip', appId, e.message || e);
    }
  }
  return true;
}

async function main() {
  console.log('Sci-Fi SoundBoard — Downloading sound pack (real Star Trek + Star Wars sounds)...');
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });

  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  let release;
  try {
    const data = await fetchJSON(`${apiBase}/releases/latest`);
    release = data;
  } catch (e) {
    const used = await downloadFromFreesound();
    if (used) {
      console.log('Sounds installed to', SOUNDS_DIR);
      return;
    }
    console.warn('No latest release found. To get real sounds:');
    console.warn('  1) Create a release with asset "' + ASSET_NAME + '" at https://github.com/' + config.repo + '/releases');
    console.warn('  2) Or set FREESOUND_API_KEY (get one at https://freesound.org/apiv2/apply) and run setup again.');
    console.warn('See docs/SOUND_SOURCES.md for manual download sources.');
    process.exit(1);
  }

  const asset = (release.assets || []).find((a) => a.name === ASSET_NAME);
  if (!asset || !asset.browser_download_url) {
    const used = await downloadFromFreesound();
    if (used) {
      console.log('Sounds installed to', SOUNDS_DIR);
      return;
    }
    console.warn('Release "' + release.tag_name + '" has no asset "' + ASSET_NAME + '".');
    console.warn('To get real sounds: add ' + ASSET_NAME + ' to the release, or set FREESOUND_API_KEY and run setup again.');
    console.warn('See docs/SOUND_SOURCES.md for manual sources.');
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

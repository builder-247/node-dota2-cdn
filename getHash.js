import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { spawn } from 'child_process';

import vpk from 'vpk';

// Dota 2 installation
const dir = '/mnt/games/SteamLibrary/steamapps/common/dota 2 beta/game/dota';

const vpkDir = new vpk(dir + '/pak01_dir.vpk');
vpkDir.load();

let items = {};

const extensionRegex = /_(png|jpg|psd)\.(png|jpeg)$/

// Append this to `https://steamcdn-a.akamaihd.net/apps/570/`
function itemCDNURL(vpkPath, hash) {
  const filePath = vpkPath.replace(`${path.resolve('./data')}/panorama/images/`, '').replace(extensionRegex, '')
  return `icons/${filePath}.${hash}.png`;
}

function getHash(path) {
  const PNGBuffer = fs.readFileSync(path);
  const hashSum = crypto.createHash('sha1');
  hashSum.update(PNGBuffer);
  return hashSum.digest('hex');
}

async function decompileFiles() {
  return new Promise((resolve) => {
    const decompiler = spawn('./bin/Decompiler', ['-i', `${dir}/pak01_dir.vpk`, '-o', './data', '-e', 'vtex_c', '-f', 'panorama/images/econ', '-d'])
    decompiler.stdout.on('data', async (data) => {
      // console.log(`Decompiler stdout: ${data}`);
      const path = data.toString().match(/written to "([^"]+)"/)?.[1];
      // Compute hashes as files as decompiled
      if (path !== undefined) {
        const split = path.split('/');
        const name = split[split.length - 1].replace(extensionRegex, '');
        const hash = getHash(path);
        items[name] = itemCDNURL(path, hash);
      } else {
        console.log(`Decompiler stdout: ${data}`);
      }
    });
    decompiler.on('close', resolve)
  })
}

/*
* Assumes there is only one PNG file inside the vtex_c file
 */
async function loadPNG(fileBuffer, path) {
  const start = fileBuffer.indexOf('89504E47', 0, 'hex'); // 0x89 PNG
  const end = fileBuffer.indexOf('49454E44', 0, 'hex') + 8; // IEND
  let PNGBuffer = fileBuffer.subarray(start, end);
  if (PNGBuffer.length === 0) {
    // Naive method didn't work, load decompiled file
    PNGBuffer = fs.readFileSync(`./data/${path.replace('vtex_c', 'png')}`);
  }
  return PNGBuffer;
}

await decompileFiles();

fs.writeFileSync('./build/icons.json', JSON.stringify(items, null, 2));

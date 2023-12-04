const vpk = require("vpk");
const fs = require("fs");
const crypto = require("crypto");

// Dota 2 installation
const dir = '/SteamLibrary/steamapps/common/dota 2 beta/game/dota'

const vpkDir = new vpk(dir + '/pak01_dir.vpk');
vpkDir.load();

const vpkIconFiles = vpkDir.files.filter((f) => f.startsWith('panorama/images/econ'));

// Append this to `https://steamcdn-a.akamaihd.net/apps/570/`
function itemCDNURL(vpkPath, hash) {
  const path = vpkPath.replace('panorama/images/', '').replace(/_[\w]{3}\.vtex_c/, '')
  return `icons/${path}.${hash}.png`;
}

/*
* Assumes there is only one PNG file inside the vtex_c file
 */
function loadPNG(fileBuffer) {
  const start = fileBuffer.indexOf('89504E47', 0, 'hex'); // 0x89 PNG
  const end = fileBuffer.indexOf('49454E44', 0, 'hex') + 8; // IEND
  return fileBuffer.subarray(start, end);
}

function getHash(path) {
  const PNGBuffer = loadPNG(vpkDir.getFile(path));
  const hashSum = crypto.createHash('sha1');
  hashSum.update(PNGBuffer);
  return hashSum.digest('hex');
}

let items = {};

vpkIconFiles.forEach((path) => {
  const split = path.split('/');
  const name = split[split.length - 1].replace(/_[\w]{3}\.vtex_c/, '');
  const hash = getHash(path);
  items[name] = itemCDNURL(path, hash);
})

fs.writeFileSync('./build/icons.json', JSON.stringify(items, null, 2));

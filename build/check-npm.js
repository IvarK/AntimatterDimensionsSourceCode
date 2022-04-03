/* eslint-disable no-bitwise */

const fs = require("fs");
const path = require("path");
const proc = require("child_process");

function getHash(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    // Convert to 32bit integer
    hash &= hash;
  }
  return hash.toString();
}

const hashPath = path.resolve(__dirname, "../.tmp/package-lock.json.hash");
let currentHash = undefined;
if (fs.existsSync(hashPath)) {
  currentHash = fs.readFileSync(hashPath, { encoding: "utf-8" });
}

const packageLockPath = path.resolve(__dirname, "../package-lock.json");
const packageLockContents = fs.readFileSync(packageLockPath, { encoding: "utf-8" });
const newHash = getHash(packageLockContents);

if (newHash !== currentHash) {
  const tmpPath = path.resolve(__dirname, "../.tmp");
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
  }

  // eslint-disable-next-line no-console
  console.log("package-lock.json changes were detected");
  console.log("Running 'npm ci' (this might take a while)...");
  proc.execSync("npm ci");
  fs.writeFileSync(hashPath, newHash, {});
}

const fs = require("fs");
const path = require("path");
const browserslist = require("browserslist-useragent-regexp");

const userAgentRegExp = browserslist.getUserAgentRegExp({ allowHigherVersions: true });
const checkFunction = `export const supportedBrowsers = ${userAgentRegExp};`;
fs.writeFileSync(path.resolve(__dirname, "../src/supported-browsers.js"), checkFunction);

const firebaseConfig = process.env.FIREBASE_CONFIG;
if (firebaseConfig) {
  fs.writeFileSync(
    path.resolve(__dirname, "../src/core/storage/firebase-config.js"),
    `export const firebaseConfig = ${firebaseConfig};`
  );
}

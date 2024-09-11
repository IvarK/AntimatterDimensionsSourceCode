import fs from "fs";
import path from "path";

import browserslist from "browserslist-useragent-regexp";

const userAgentRegExp = browserslist.getUserAgentRegExp({ allowHigherVersions: true });
const checkFunction = `export const supportedBrowsers = ${userAgentRegExp};`;
fs.writeFileSync(path.resolve(import.meta.dirname, "../src/supported-browsers.js"), checkFunction);

const firebaseConfig = process.env.FIREBASE_CONFIG;
if (firebaseConfig) {
  fs.writeFileSync(
    path.resolve(import.meta.dirname, "../src/core/storage/firebase-config.js"),
    `export const firebaseConfig = ${firebaseConfig};`
  );
}

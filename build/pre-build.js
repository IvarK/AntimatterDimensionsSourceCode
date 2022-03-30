const fs = require("fs");
const path = require("path");
const browserslist = require("browserslist-useragent-regexp");

const userAgentRegExp = browserslist.getUserAgentRegExp({ allowHigherVersions: true });
const checkFunction = `export const supportedBrowsers = ${userAgentRegExp};`;
fs.writeFileSync(path.resolve(__dirname, "../javascripts/supported-browsers.js"), checkFunction);

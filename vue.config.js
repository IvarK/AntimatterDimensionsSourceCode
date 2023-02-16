/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

const DEV = process.env.VUE_APP_DEV === "true";
const STEAM = process.env.VUE_APP_STEAM === "true";

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  outputDir: STEAM ? "../AppFiles" : "dist",
  configureWebpack: {
    devtool: DEV ? "eval-source-map" : "source-map",
  }
};

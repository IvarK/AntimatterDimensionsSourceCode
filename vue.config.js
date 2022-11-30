/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

const isDev = process.env.VUE_APP_DEV === "true";

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  configureWebpack: {
    devtool: isDev ? "eval-source-map" : "source-map",
  }
};

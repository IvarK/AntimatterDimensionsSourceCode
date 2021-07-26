"use strict";

class GameOptions {

  static toggleNews() {
    player.options.news.enabled = !player.options.news.enabled;
    ui.view.news = player.options.news.enabled;
    GameStorage.save(true);
  }

  static toggleUI() {
    player.options.newUI = !player.options.newUI;
    ui.view.newUI = player.options.newUI;
    GameStorage.save(true);
  }

  static cloudSave() {
    if (Cloud.loggedIn) Cloud.saveCheck();
    else Cloud.login();
  }

  static cloudLoad() {
    if (Cloud.loggedIn) Cloud.loadCheck();
    else Cloud.login();
  }

  static logout() {
    Cloud.logout();
  }

  static refreshUpdateRate() {
    if (player.options.updateRate === 200) {
      SecretAchievement(31).unlock();
    }
    GameIntervals.gameLoop.restart();
  }

  static refreshAutosaveInterval() {
    GameIntervals.save.restart();
  }
}

const secretImports = [
  "80b7fdc794f5dfc944da6a445a3f21a2d0f7c974d044f2ea25713037e96af9e3",
  "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274",
  "be88e62eb68758cd7381104977c0d3d5d81e19c72a848f0d79d1963c1e39221f",
];

function secretImportIndex(data) {
  const sha = sha512_256(data.replace(/\s/gu, "").toUpperCase());
  return secretImports.indexOf(sha);
}

function isSecretImport(data) {
  return secretImportIndex(data) !== -1;
}

function tryImportSecret(data) {
  const index = secretImportIndex(data);
  if (index === 0 && document.body.style.animation === "") {
    document.body.style.animation = "barrelRoll 5s 1";
    SecretAchievement(15).unlock();
    setTimeout(() => document.body.style.animation = "", 5000);
    return true;
  }
  if (index === 1) {
    SecretAchievement(14).unlock();
    return true;
  }
  if (index === 2) {
    SecretAchievement(37).unlock();
    return true;
  }
  return false;
}

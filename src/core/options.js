import { sha512_256 } from "js-sha512";

import { ElectronRuntime } from "@/steam";

import { DEV } from "@/env";

import FullScreenAnimationHandler from "./full-screen-animation-handler";

export class GameOptions {

  static toggleNews() {
    player.options.news.enabled = !player.options.news.enabled;
    ui.view.news = player.options.news.enabled;
    GameStorage.save();
  }

  static toggleUI() {
    player.options.newUI = !player.options.newUI;
    ui.view.newUI = player.options.newUI;
    // This is needed because .s-base--dark is on newUI/normal but not on oldUI/normal
    // So the classes on body need to be updated
    Themes.find(Theme.currentName()).set();
    ElectronRuntime.updateZoom();
    GameStorage.save();
  }

  static cloudSave() {
    Cloud.saveCheck(true);
  }

  static cloudLoad() {
    Cloud.loadCheck();
  }

  static login() {
    Cloud.login();
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
  "c784c9c0a82b5f3c13884842fa6e6a8f5aed994ef401e6476c30b1adfe439b22",
];

function secretImportIndex(data) {
  const sha = sha512_256(data.replace(/\s/gu, "").toUpperCase());
  return secretImports.indexOf(sha);
}

export function isSecretImport(data) {
  return secretImportIndex(data) !== -1;
}

export function tryImportSecret(data) {
  const index = secretImportIndex(data);

  switch (index) {
    case 0:
      FullScreenAnimationHandler.display("a-barrel-roll", 5);
      SecretAchievement(15).unlock();
      return true;
    case 1:
      SecretAchievement(14).unlock();
      return true;
    case 2:
      SecretAchievement(37).unlock();
      return true;
    case 3:
      if (player.records.fullGameCompletions > 0 || DEV) Speedrun.unlock();
      else GameUI.notify.error("Complete the game at least once first!", 15000);
      return true;
    default:
      return false;
  }
}

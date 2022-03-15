import * as ADNotations from "@antimatter-dimensions/notations";

export const NG = {
  get current() {
    return player.newGame.current;
  },

  get plusRecord() {
    return player.newGame.plusRecord;
  },

  get minusRecord() {
    return player.newGame.minusRecord;
  },

  get isNegative() {
    return this.current < 0;
  },

  get multiplier() {
    if (!this.isNegative) return 2 ** this.current;
    return 0.8 ** Math.abs(this.current);
  },

  get power() {
    if (!this.isNegative) return 1 + this.current * 0.02;
    return 0.99 ** Math.abs(this.current);
  },

  startNewGame(i) {
    const backUpOptions = JSON.stringify(player.options);
    // This can't be JSONed as it contains sets
    const secretUnlocks = player.secretUnlocks;
    const newGameBackup = JSON.stringify(player.newGame);
    const secretAchievements = JSON.stringify(player.secretAchievementBits);
    GameEnd.removeAdditionalEnd = true;
    Modal.hideAll();
    GameStorage.hardReset();
    player.newGame = JSON.parse(newGameBackup);
    player.newGame.current = i;
    player.newGame.plusRecord = Math.max(player.newGame.plusRecord, i);
    player.newGame.minusRecord = Math.min(player.newGame.minusRecord, i);
    player.options = JSON.parse(backUpOptions);
    player.secretUnlocks = secretUnlocks;
    player.secretAchievementBits = JSON.parse(secretAchievements);
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(player.options.theme).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.show = player.options.commas;
    GameStorage.save();
    player.lastUpdate = Date.now();
    GameEnd.additionalEnd = Math.min(GameEnd.additionalEnd, 14) + 1;
  }
};
import * as ADNotations from "@antimatter-dimensions/notations";

export const NG = {
  startNewGame() {
    const backUpOptions = JSON.stringify(player.options);
    // This can't be JSONed as it contains sets
    const secretUnlocks = player.secretUnlocks;
    const secretAchievements = JSON.stringify(player.secretAchievementBits);
    const prevGameEnd = GameEnd.additionalEnd;
    GameEnd.removeAdditionalEnd = true;
    Modal.hideAll();
    Quote.clearAll();
    GameStorage.hardReset();
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
    GameEnd.additionalEnd = Math.min(prevGameEnd, 14) + 1;
  }
};

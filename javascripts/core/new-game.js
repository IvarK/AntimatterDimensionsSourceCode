import * as ADNotations from "@antimatter-dimensions/notations";

export const NG = {
  startNewGame() {
    const backUpOptions = JSON.stringify(player.options);
    // This can't be JSONed as it contains sets
    const secretUnlocks = player.secretUnlocks;
    const secretAchievements = JSON.stringify(player.secretAchievementBits);
    const automatorConstants = JSON.stringify(player.reality.automator.constants);
    const automatorScripts = JSON.stringify(player.reality.automator.scripts);
    Modal.hideAll();
    Quote.clearAll();
    GameStorage.hardReset();
    player.options = JSON.parse(backUpOptions);
    player.secretUnlocks = secretUnlocks;
    player.secretAchievementBits = JSON.parse(secretAchievements);
    player.reality.automator.constants = JSON.parse(automatorConstants);
    player.reality.automator.scripts = JSON.parse(automatorScripts);
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(player.options.theme).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.show = player.options.commas;
    player.lastUpdate = Date.now();
    // The ending animation ends at 12.5, although the value continues to increase after that. We set it to a bit above
    // 12.5 when we start the rollback animation to hide some of the unavoidable lag from all the reset functions
    GameEnd.removeAdditionalEnd = true;
    GameEnd.additionalEnd = 15;
    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    setTimeout(() => GameStorage.save(), 10000);
  }
};

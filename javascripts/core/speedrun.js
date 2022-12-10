import { GameDatabase } from "./secret-formula/game-database";
import { GameMechanicState } from "./game-mechanics/index";

export const Speedrun = {
  unlock() {
    if (player.speedrun.isUnlocked) return;
    Modal.message.show(`You have unlocked Speedrun Mode! This allows you to start a new save file with some slight
      changes which can be helpful if you're trying to complete the game as quickly as possible. The option to
      start a Speedrun Save is now available in the Options tab, under Saving. Choosing to start a Speedrun Save
      will provide you with another modal with more in-depth information.`, {}, 3);
    player.speedrun.isUnlocked = true;
  },
  // If a name isn't given, choose a somewhat-likely-to-be-unique big number instead
  generateName(name) {
    if (name.trim() === "") {
      const id = Math.floor((1e7 - 1) * Math.random()) + 1;
      return `AD Player #${"0".repeat(6 - Math.floor(Math.log10(id)))}${id}`;
    }
    if (name.length > 40) return `${name.slice(0, 37)}...`;
    return name;
  },
  // Hard-resets the current save and puts it in a state ready to be "unpaused" once resources start being generated
  prepareSave(name) {
    // Carry full completion count and cosmetic settings into speedrun mode as well
    const fullCompletions = player.records.fullGameCompletions;
    const glyphCosmetics = JSON.stringify(player.reality.glyphs.cosmetics);
    GameStorage.hardReset();
    player.records.fullGameCompletions = fullCompletions;
    player.reality.glyphs.cosmetics = JSON.parse(glyphCosmetics);

    player.speedrun.isUnlocked = true;
    player.speedrun.isActive = true;
    player.reality.seed = Date.now();
    player.speedrun.name = name;

    // We make a few assumptions on settings which are likely to be changed for all speedrunners
    for (const key of Object.keys(player.options.confirmations)) player.options.confirmations[key] = false;
    player.options.confirmations.glyphSelection = true;
    for (const key of Object.keys(player.options.animations)) {
      if (typeof player.options.animations[key] === "boolean") player.options.animations[key] = false;
    }

    // "Fake News" Achievement, given for free to partially mitigate promoting weird strategies at the beginning of runs
    Achievement(22).unlock();

    // Some time elapses after the reset and before the UI is actually ready, which ends up getting "counted" as offline
    player.speedrun.offlineTimeUsed = 0;
    GameStorage.save();
  },
  // Speedruns are initially paused until startTimer is called, which happens as soon as the player purchases a AD or
  // uses the Konami code. Until then, they're free to do whatever they want with the UI
  startTimer() {
    if (player.speedrun.hasStarted) return;
    player.speedrun.hasStarted = true;
    player.speedrun.startDate = Date.now();
    player.lastUpdate = Date.now();

    // This needs to be calculated "live" because using spentSTD includes any offline progress purchases too
    let currentSpent = 0;
    for (const purchase of ShopPurchase.all) {
      if (purchase.config.instantPurchase) continue;
      currentSpent += purchase.purchases * purchase.cost;
    }
    this.setSTDUse(ShopPurchaseData.isIAPEnabled && currentSpent > 0);
  },
  isPausedAtStart() {
    return player.speedrun.isActive && !player.speedrun.hasStarted;
  },
  // This needs to be here due to JS applying "function scope" to the player object within importing in storage.js,
  // which causes any direct changes done in storage.js to fall out of scope afterwards. We also don't want to change
  // this state at the beginning in case people want to share identical single-segment saves before starting the timer.
  setSegmented(state) {
    if (this.isPausedAtStart()) return;
    player.speedrun.isSegmented = state;
  },
  setSTDUse(state) {
    if (this.isPausedAtStart() || ShopPurchaseData.spentSTD === 0) return;
    player.speedrun.usedSTD = state;
  },
};

class SpeedrunMilestone extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryComplete(args));
  }

  get name() {
    return this.config.name;
  }

  get isReached() {
    return player.speedrun.records[this.config.key] !== 0;
  }

  tryComplete(args) {
    if (!this.config.checkRequirement(args)) return;
    this.complete();
  }

  complete() {
    if (this.isReached || !player.speedrun.isActive) return;
    player.speedrun.records[this.config.key] = player.records.realTimePlayed;
    player.speedrun.milestones.push(this.config.id);
    GameUI.notify.success(`Speedrun Milestone Reached: ${this.name}`);
  }
}

export const SpeedrunMilestones = SpeedrunMilestone.createAccessor(GameDatabase.speedrunMilestones);

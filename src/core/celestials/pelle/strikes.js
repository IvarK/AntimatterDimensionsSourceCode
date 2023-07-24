import { BitUpgradeState } from "../../utils";

class PelleStrikeState extends BitUpgradeState {
  get bits() { return player.celestials.pelle.progressBits; }
  set bits(value) { player.celestials.pelle.progressBits = value; }

  get hasStrike() {
    return this.isUnlocked;
  }

  get canBeUnlocked() {
    return Pelle.isDoomed && !this.hasStrike;
  }

  get requirement() {
    const x = this.config.requirementDescription;
    return typeof x === "function" ? x() : x;
  }

  get penalty() {
    const x = this.config.penaltyDescription;
    return typeof x === "function" ? x() : x;
  }

  reward() {
    return this.config.rewardDescription();
  }

  get rift() {
    return this.config.rift();
  }

  trigger() {
    this.unlock();
  }

  onUnlock() {
    GameUI.notify.strike(`You encountered a Pelle Strike: ${this.requirement}`);
    player.celestials.pelle.collapsed.rifts = false;

    // If it's paradox, reset the records
    if (this.id === 5) Pelle.resetResourcesForDilation();
    Tab.celestials.pelle.show();
    EventHub.dispatch(GAME_EVENT.PELLE_STRIKE_UNLOCKED);
  }
}

export const PelleStrikes = mapGameDataToObject(
  GameDatabase.celestials.pelle.strikes,
  config => new PelleStrikeState(config)
);

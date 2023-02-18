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
    if (this.id === 5) {
      Pelle.cel.records.totalAntimatter = new Decimal("1e180000");
      Pelle.cel.records.totalInfinityPoints = new Decimal("1e60000");
      Currency.eternityPoints.reset();
      // Oddly specific number? Yes, it's roughly the amount of EP you have
      // when starting dilation for the first time
      // Since 5th strike previously did not reset your current EP the previous reset value was kind of useless which
      // lead to some balancing problems, this hopefully prevents people starting dilation too early and getting
      // softlocked, or starting it too late and getting not-softlocked.
      Pelle.cel.records.totalEternityPoints = new Decimal("1e1050");
    }
    Tab.celestials.pelle.show();
    EventHub.dispatch(GAME_EVENT.PELLE_STRIKE_UNLOCKED);
  }
}

export const PelleStrikes = mapGameDataToObject(
  GameDatabase.celestials.pelle.strikes,
  config => new PelleStrikeState(config)
);

import { GameMechanicState } from "../../utils";

// TODO: BitUpgradeState? wrapper for this + effarig + enslaved
class PelleStrikeState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (this.id < 0 || this.id > 31) throw new Error(`Id ${this.id} out of bit range`);
  }

  get hasStrike() {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.pelle.progressBits & (1 << this.id));
  }

  get requirement() {
    const x = this.config.requirementDescription;
    return typeof x === "function" ? x() : x;
  }

  get penalty() {
    const x = this.config.penaltyDescription;
    return typeof x === "function" ? x() : x;
  }

  get reward() {
    return this.config.rewardDescription;
  }

  get rift() {
    return this.config.rift();
  }

  trigger() {
    if (!Pelle.isDoomed || this.hasStrike) return;
    this.unlockStrike();

    // If it's death, reset the records
    if (this.id === 5) {
      Pelle.cel.records.totalAntimatter = new Decimal("1e180000");
      Pelle.cel.records.totalInfinityPoints = new Decimal("1e60000");
      Pelle.cel.records.totalEternityPoints = new Decimal("1e400");
    }
  }

  unlockStrike() {
    GameUI.notify.strike(`You encountered a Pelle Strike: ${this.requirement}`);
    player.celestials.pelle.collapsed.rifts = false;
    Tab.celestials.pelle.show();
    // eslint-disable-next-line no-bitwise
    player.celestials.pelle.progressBits |= (1 << this.id);
    EventHub.dispatch(GAME_EVENT.PELLE_STRIKE_UNLOCKED);
  }
}

export const PelleStrikes = (function() {
  return mapGameDataToObject(
    GameDatabase.celestials.pelle.strikes,
    config => new PelleStrikeState(config)
  );
}());

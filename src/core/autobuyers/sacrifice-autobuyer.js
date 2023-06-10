import { AutobuyerState } from "./autobuyer";

export class SacrificeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.sacrifice;
  }

  get name() {
    return `Dimensional Sacrifice`;
  }

  get isUnlocked() {
    return EternityMilestone.autoIC.isReached || InfinityChallenge(2).isCompleted;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  set multiplier(value) {
    this.data.multiplier = value;
  }

  get bulk() {
    return 0;
  }

  get hasInput() {
    return true;
  }

  get inputType() {
    return "decimal";
  }

  get inputEntry() {
    return "multiplier";
  }

  tick() {
    if (Sacrifice.nextBoost.lt(Decimal.max(this.multiplier, 1.01))) return;
    sacrificeReset();
  }
}

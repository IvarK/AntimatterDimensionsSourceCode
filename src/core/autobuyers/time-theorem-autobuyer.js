import { AutobuyerState } from "./autobuyer";

export class TimeTheoremAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return `Time Theorem`;
  }

  get isUnlocked() {
    return Perk.ttBuySingle.isBought && !Pelle.isDisabled("timeTheoremAutobuyer");
  }

  get hasUnlimitedBulk() {
    return Perk.ttBuyMax.canBeApplied;
  }

  tick() {
    if (this.hasUnlimitedBulk) TimeTheorems.buyMax(true);
    else TimeTheorems.buyOneOfEach();
  }
}

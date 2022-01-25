import { Autobuyer, AutobuyerState } from "./autobuyer.js";

Autobuyer.timeTheorem = new class TimeTheoremAutobuyerState extends AutobuyerState {
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
    return Perk.ttBuyMax.isBought;
  }

  tick() {
    if (this.hasUnlimitedBulk) TimeTheorems.buyMax(true);
    else TimeTheorems.buyOneOfEach();
  }
}();

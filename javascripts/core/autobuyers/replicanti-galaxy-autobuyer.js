import { Autobuyer, AutobuyerState } from "./autobuyer.js";

Autobuyer.replicantiGalaxy = new class ReplicantiGalaxyAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.replicantiGalaxies;
  }

  get name() {
    return `Replicanti Galaxy`;
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerReplicantiGalaxy.isReached;
  }

  get isEnabled() {
    return Achievement(138).isUnlocked || !TimeStudy(131).isBought;
  }

  get hasUnlimitedBulk() {
    return Achievement(126).isUnlocked;
  }

  tick() {
    if (!this.isEnabled) return;
    replicantiGalaxy();
  }
}();

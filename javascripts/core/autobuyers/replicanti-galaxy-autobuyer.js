"use strict";

Autobuyer.replicantiGalaxy = new class ReplicantiGalaxyAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.replicantiGalaxies;
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerReplicantiGalaxy.isReached;
  }

  get isEnabled() {
    return Achievement(138).isUnlocked || !TimeStudy(131).isBought;
  }

  tick() {
    if (!this.isEnabled) return;
    replicantiGalaxy();
  }
}();

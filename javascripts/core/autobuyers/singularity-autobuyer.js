import { Autobuyer, AutobuyerState } from "./autobuyer.js";

Autobuyer.singularity = new class SingularityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singularity;
  }

  get name() {
    return `Singularity`;
  }

  get isUnlocked() {
    return SingularityMilestone.autoCondense.isUnlocked;
  }

  get bulk() {
    return Singularity.singularitiesGained;
  }

  tick() {
    if (Currency.darkEnergy.value >= Singularity.cap * SingularityMilestone.autoCondense.effectValue) {
      Singularity.perform();
    }
  }
}();

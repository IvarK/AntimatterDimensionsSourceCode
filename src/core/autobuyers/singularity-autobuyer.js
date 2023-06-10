import { AutobuyerState } from "./autobuyer";

export class SingularityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singularity;
  }

  get name() {
    return `Singularity`;
  }

  get isUnlocked() {
    return SingularityMilestone.autoCondense.canBeApplied;
  }

  get bulk() {
    return Singularity.singularitiesGained;
  }

  tick() {
    if (Currency.darkEnergy.value >= Singularity.cap * SingularityMilestone.autoCondense.effectValue) {
      Singularity.perform();
    }
  }
}

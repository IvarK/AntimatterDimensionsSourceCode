import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer.js";

Autobuyer.darkMatterDimsAscension =
new class DarkMatterDimensionAscensionAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.ascension;
  }

  get name() {
    return `Dark Matter Dimension Ascension`;
  }

  get isUnlocked() {
    return SingularityMilestone.darkDimensionAutobuyers.isUnlocked;
  }

  get interval() {
    return 1000 * SingularityMilestone.darkAutobuyerSpeed.effectValue;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    for (let i = 1; i <= SingularityMilestone.darkDimensionAutobuyers.effectValue; i++) {
      DarkMatterDimension(i).ascend();
    }
  }
}();

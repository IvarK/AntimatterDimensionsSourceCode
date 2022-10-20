import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer";

Autobuyer.darkMatterDimsAscension =
new class DarkMatterDimensionAscensionAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.ascension;
  }

  get name() {
    return `Dark Matter Dimension Ascension`;
  }

  get isUnlocked() {
    return SingularityMilestone.ascensionAutobuyers.canBeApplied;
  }

  get interval() {
    return 1000 * SingularityMilestone.ascensionAutobuyerSpeed.effectValue;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    for (let i = 1; i <= SingularityMilestone.ascensionAutobuyers.effectValue; i++) {
      DarkMatterDimension(i).ascend();
    }
  }
}();

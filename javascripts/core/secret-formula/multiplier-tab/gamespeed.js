import { GameDatabase } from "../game-database";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.gamespeed = {
  total: {
    name: "Average Game speed",
    isBase: true,
    multValue: () => {
      if (Enslaved.isAutoReleasing) return Math.max(Enslaved.autoReleaseSpeed, getGameSpeedupFactor());
      let factor = BlackHoles.list
        .map(bh => bh.dutyCycle * bh.power)
        .reduce((x, y) => x * y, 1);
      factor *= SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1);
      factor *= getAdjustedGlyphEffect("timespeed");
      factor = Math.pow(factor, getAdjustedGlyphEffect("effarigblackhole"));
      return factor;
    },
    isActive: () => !Pelle.isDoomed,
    overlay: ["Δ", `<i class="fas fa-clock" />`, `<i class="fas fa-circle" />`],
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timespeed"),
    powValue: () => getAdjustedGlyphEffect("effarigblackhole"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  blackHoles: {
    name: "Black Holes",
    multValue: () => BlackHoles.list
      .map(bh => bh.dutyCycle * bh.power)
      .reduce((x, y) => x * y, 1),
    isActive: () => BlackHole(1).isUnlocked,
    icon: MultiplierTabIcons.BLACK_HOLE,
  },
  v: {
    name: "V Achievements",
    multValue: () => Math.pow(VUnlocks.achievementBH.effectOrDefault(1),
      BlackHoles.list.countWhere(bh => bh.isUnlocked)),
    isActive: () => !BlackHoles.arePaused && VUnlocks.achievementBH.canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  pulsing: {
    name: "Auto-releasing Stored Time",
    multValue: () => (Enslaved.isAutoReleasing
      ? Math.max(Enslaved.autoReleaseSpeed / getGameSpeedupFactor(), 1)
      : getGameSpeedupFactor()),
    isActive: () => Enslaved.isAutoReleasing,
    icon: MultiplierTabIcons.BH_PULSE,
  },
  singularity: {
    name: "Singularity Milestones",
    multValue: () => SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1),
    isActive: () => SingularityMilestone.gamespeedFromSingularities.canBeApplied,
    icon: MultiplierTabIcons.SINGULARITY,
  },
  pelle: {
    name: "Pelle Game speed Upgrade",
    multValue: () => PelleUpgrade.timeSpeedMult.effectValue.toNumber(),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  },
};

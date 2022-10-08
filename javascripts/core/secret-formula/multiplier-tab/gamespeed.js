import { GameDatabase } from "../game-database";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.gamespeed = {
  total: {
    name: "Current Game speed",
    isBase: true,
    multValue: () => getGameSpeedupForDisplay(),
    isActive: () => PlayerProgress.seenAlteredSpeed(),
    dilationEffect: () => (Effarig.isRunning ? Effarig.multDilation : 1),
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
    isActive: () => BlackHole(1).isUnlocked && !BlackHoles.arePaused,
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
    isActive: () => Enslaved.canRelease && Enslaved.isAutoReleasing,
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

  ec12: {
    name: "Eternity Challenge 12",
    multValue: () => 0.001 / getGameSpeedupForDisplay(),
    isActive: () => EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  invertedBH: {
    name: "Inverted Black Hole",
    multValue: () => player.blackHoleNegative,
    isActive: () => BlackHoles.areNegative,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  nerfLaitela: {
    name: "Lai'tela's Reality",
    powValue: () => Math.clampMax(Time.thisRealityRealTime.totalMinutes / 10, 1),
    isActive: () => Laitela.isRunning,
    icon: MultiplierTabIcons.GENERIC_LAITELA,
  }
};

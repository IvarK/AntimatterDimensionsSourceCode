import { GameDatabase } from "../game-database";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.gamespeed = {
  total: {
    name: "Game speed",
    isBase: true,
    displayOverride: () => {
      if (EternityChallenge(12).isRunning) return `${formatX(1)}/${formatInt(1000)} (fixed)`;
      const curr = getGameSpeedupFactor();
      const currBH = BlackHoles.list
        .map(bh => (bh.isActive ? bh.power : 1))
        .reduce((x, y) => x * y, 1);
      const avgBH = BlackHoles.list
        .map(bh => bh.dutyCycle * bh.power)
        .reduce((x, y) => x * y, 1);
      const avgSpeed = Enslaved.isAutoReleasing
        ? getGameSpeedupForDisplay()
        : curr / currBH * avgBH;
      return `${formatX(curr, 2, 2)} (current) | ${formatX(avgSpeed, 2, 2)} (average)`;
    },
    multValue: () => getGameSpeedupForDisplay(),
    isActive: () => PlayerProgress.seenAlteredSpeed(),
    dilationEffect: () => (Effarig.isRunning ? Effarig.multDilation : 1),
    overlay: ["Δ", `<i class="fas fa-clock" />`, `<i class="fas fa-circle" />`],
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timespeed"),
    powValue: () => getAdjustedGlyphEffect("effarigblackhole"),
    isActive: () => PlayerProgress.realityUnlocked() && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  blackHoles: {
    name: "Black Holes",
    multValue: () => BlackHoles.list
      .map(bh => bh.dutyCycle * bh.power)
      .reduce((x, y) => x * y, 1),
    isActive: () => BlackHole(1).isUnlocked && !BlackHoles.arePaused && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.BLACK_HOLE,
  },
  achievementMult: {
    name: "Achievement Multiplier",
    multValue: () => Math.pow(VUnlocks.achievementBH.effectOrDefault(1),
      BlackHoles.list.countWhere(bh => bh.isUnlocked)),
    isActive: () => !BlackHoles.arePaused && VUnlocks.achievementBH.canBeApplied && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  pulsing: {
    name: "Auto-releasing Stored Time",
    multValue: () => (Enslaved.isAutoReleasing
      ? Math.max(Enslaved.autoReleaseSpeed / getGameSpeedupFactor(), 1)
      : getGameSpeedupFactor()),
    isActive: () => Enslaved.canRelease && Enslaved.isAutoReleasing && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.BH_PULSE,
  },
  singularity: {
    name: "Singularity Milestones",
    multValue: () => SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1),
    isActive: () => SingularityMilestone.gamespeedFromSingularities.canBeApplied && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.SINGULARITY,
  },
  pelle: {
    name: "Pelle game speed Upgrade",
    multValue: () => PelleUpgrade.timeSpeedMult.effectValue.toNumber(),
    isActive: () => Pelle.isDoomed && !EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.PELLE,
  },

  ec12: {
    name: "Eternity Challenge 12",
    multValue: () => 0.001 / getGameSpeedupForDisplay(),
    isActive: () => EternityChallenge(12).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  chargingBH: {
    name: "Black Hole Charging",
    multValue: () => 1 - player.celestials.enslaved.storedFraction,
    isActive: () => Enslaved.isStoringGameTime,
    icon: MultiplierTabIcons.BLACK_HOLE,
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

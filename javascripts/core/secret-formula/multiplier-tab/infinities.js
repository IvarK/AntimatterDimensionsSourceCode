import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.infinities = {
  total: {
    name: "Infinities gained per Crunch",
    isBase: true,
    multValue: () => gainedInfinities(),
    isActive: () => !EternityChallenge(4).isRunning && !Pelle.isDoomed,
    overlay: ["∞", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: "Achievements",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(87),
      Achievement(164)
    ),
    isActive: () => Achievement(87).isUnlocked,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: "Time Study 32",
    multValue: () => TimeStudy(32).effectOrDefault(1),
    isActive: () => TimeStudy(32).isBought,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  realityUpgrades: {
    name: "Reality Upgrades",
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(5), RealityUpgrade(7)),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("infinityinfmult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  ra: {
    name: "Ra Boost from Time Theorems",
    multValue: () => Ra.unlocks.continuousTTBoost.effects.infinity.effectOrDefault(1),
    isActive: () => Ra.unlocks.continuousTTBoost.isUnlocked,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  singularity: {
    name: "Singularity Milestones",
    powValue: () => SingularityMilestone.infinitiedPow.effectOrDefault(1),
    isActive: () => SingularityMilestone.infinitiedPow.canBeApplied,
    icon: MultiplierTabIcons.SINGULARITY,
  },
};

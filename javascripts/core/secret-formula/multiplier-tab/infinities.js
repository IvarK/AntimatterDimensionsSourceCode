import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

// See index.js for documentation
GameDatabase.multiplierTabValues.infinities = {
  total: {
    name: () => "Infinities gained per Crunch",
    isBase: () => true,
    multValue: () => gainedInfinities(),
    isActive: () => !EternityChallenge(4).isRunning && !Pelle.isDoomed,
    overlay: ["∞", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: () => "Achievements",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(87),
      Achievement(164)
    ),
    isActive: () => Achievement(87).isUnlocked,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  timeStudy: {
    name: () => "Time Study 32",
    multValue: () => TimeStudy(32).effectOrDefault(1),
    isActive: () => TimeStudy(32).isBought,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-book" />`,
  },
  realityUpgrades: {
    name: () => "Reality Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      RealityUpgrade(5),
      RealityUpgrade(7)
    ),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ϟ<i class="fas fa-arrow-up" />`,
  },
  glyph: {
    name: () => "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("infinityinfmult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  ra: {
    name: () => "Ra Boost from Time Theorems",
    multValue: () => Ra.unlocks.continuousTTBoost.effects.infinity.effectOrDefault(1),
    isActive: () => Ra.unlocks.continuousTTBoost.isUnlocked,
    color: () => "var(--color-ra--base)",
    barOverlay: () => `<i class="fas fa-sun" />`,
  },
  singularity: {
    name: () => "Singularity Milestones",
    multValue: () => 1,
    powValue: () => SingularityMilestone.infinitiedPow.effectOrDefault(1),
    isActive: () => SingularityMilestone.infinitiedPow.canBeApplied,
    barOverlay: () => `<i class="fas fa-arrows-to-dot" />`,
  },
};

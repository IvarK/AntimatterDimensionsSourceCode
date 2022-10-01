import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

// See index.js for documentation
GameDatabase.multiplierTabValues.TP = {
  total: {
    name: () => "Total Tachyon Particles",
    isBase: () => true,
    multValue: () => new Decimal(Currency.tachyonParticles.value),
    isActive: () => new Decimal(Currency.tachyonParticles.value).gt(0),
    color: () => "var(--color-dilation)",
    barOverlay: () => `<i class="fas fa-meteor" />`,
  },
  base: {
    name: () => "Tachyon Particles",
    isBase: () => true,
    multValue: () => new Decimal(Currency.tachyonParticles.value).div(tachyonGainMultiplier()),
    isActive: () => new Decimal(Currency.tachyonParticles.value).gt(0),
    color: () => "var(--color-dilation)",
    barOverlay: () => `<i class="fas fa-atom" />`,
  },
  achievement: {
    name: () => "Achievement 132",
    multValue: () => Achievement(132).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  dilation: {
    name: () => "Repeatable Dilation Upgrade",
    multValue: () => DilationUpgrade.tachyonGain.effectOrDefault(1),
    isActive: () => DilationUpgrade.tachyonGain.canBeApplied,
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ψ<i class="fas fa-repeat" />`,
  },
  realityUpgrade: {
    name: () => "Reality Upgrades",
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(4), RealityUpgrade(8), RealityUpgrade(15)),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `Ϟ<i class="fas fa-arrow-up" />`,
  },
  dilationGlyphSacrifice: {
    name: () => "Dilation Glyph Sacrifice",
    multValue: () => GlyphSacrifice.dilation.effectValue,
    isActive: () => GlyphSacrifice.dilation.effectValue > 1,
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ψ<i class="fas fa-turn-down" />`,
  },
};

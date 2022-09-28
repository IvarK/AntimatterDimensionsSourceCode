import { GameDatabase } from "../game-database";

// See index.js for documentation
GameDatabase.multiplierTabValues.gamespeed = {
  total: {
    name: () => "Average Game speed",
    isBase: () => true,
    multValue: () => {
      if (Enslaved.isAutoReleasing) return Math.max(Enslaved.autoReleaseSpeed / getGameSpeedupFactor(), 1);
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
    name: () => "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timespeed"),
    powValue: () => getAdjustedGlyphEffect("effarigblackhole"),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  blackHoles: {
    name: () => "Black Holes",
    multValue: () => BlackHoles.list
      .map(bh => bh.dutyCycle * bh.power)
      .reduce((x, y) => x * y, 1),
    isActive: () => BlackHole(1).isUnlocked,
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-circle" />`,
  },
  pulsing: {
    name: () => "Auto-releasing Stored Time",
    multValue: () => (Enslaved.isAutoReleasing
      ? Math.max(Enslaved.autoReleaseSpeed / getGameSpeedupFactor(), 1)
      : getGameSpeedupFactor()),
    isActive: () => Enslaved.isAutoReleasing,
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-expand-arrows-alt" />`,

  },
  singularity: {
    name: () => "Singularity Milestones",
    multValue: () => SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1),
    isActive: () => SingularityMilestone.gamespeedFromSingularities.canBeApplied,
    barOverlay: () => `<i class="fas fa-arrows-to-dot" />`,
  },
};

import { GameDatabase } from "../game-database";

// See index.js for documentation
GameDatabase.multiplierTabValues.eternities = {
  total: {
    name: () => "Eternities gained per Eternity",
    isBase: () => true,
    multValue: () => gainedEternities(),
    isActive: () => !Pelle.isDoomed,
    overlay: ["Δ", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: () => "Achievement 113",
    multValue: () => Achievement(113).effectOrDefault(1),
    isActive: () => Achievement(113).canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  realityUpgrades: {
    name: () => "Eternal Amplifier",
    multValue: () => RealityUpgrade(3).effectOrDefault(1),
    isActive: () => RealityUpgrade(3).canBeApplied,
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ϟ<i class="fas fa-arrow-up" />`,
  },
  glyph: {
    name: () => "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timeetermult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  alchemy: {
    name: () => "Glyph Alchemy",
    multValue: () => 1,
    powValue: () => AlchemyResource.eternity.effectOrDefault(1),
    isActive: () => AlchemyResource.eternity.canBeApplied,
    color: () => "var(--color-ra-pet--effarig)",
    barOverlay: () => `<i class="fas fa-vial" />`,
  },
};

import { GameDatabase } from "../game-database";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.eternities = {
  total: {
    name: "Eternities gained per Eternity",
    isBase: true,
    multValue: () => gainedEternities(),
    isActive: () => Achievement(113).isUnlocked,
    overlay: ["Δ", "<i class='fa-solid fa-arrows-rotate' />"],
  },
  achievement: {
    name: "Achievement 113",
    multValue: () => Achievement(113).effectOrDefault(1),
    isActive: () => Achievement(113).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  realityUpgrades: {
    name: "Eternal Amplifier",
    multValue: () => RealityUpgrade(3).effectOrDefault(1),
    isActive: () => RealityUpgrade(3).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => getAdjustedGlyphEffect("timeetermult"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  alchemy: {
    name: "Eternity Alchemy Resource",
    powValue: () => AlchemyResource.eternity.effectOrDefault(1),
    isActive: () => AlchemyResource.eternity.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
};

import { GameDatabase } from "../game-database";

GameDatabase.reality.glyphTypes = {
  time: {
    id: "time",
    symbol: GLYPH_SYMBOLS.time,
    color: "#b241e3",
    primaryEffect: "timepow",
    alchemyResource: ALCHEMY_RESOURCE.TIME,
    hasRarity: true
  },
  dilation: {
    id: "dilation",
    symbol: GLYPH_SYMBOLS.dilation,
    color: "#64dd17",
    alchemyResource: ALCHEMY_RESOURCE.DILATION,
    hasRarity: true
  },
  replication: {
    id: "replication",
    symbol: GLYPH_SYMBOLS.replication,
    color: "#03a9f4",
    alchemyResource: ALCHEMY_RESOURCE.REPLICATION,
    hasRarity: true
  },
  infinity: {
    id: "infinity",
    symbol: GLYPH_SYMBOLS.infinity,
    color: "#b67f33",
    primaryEffect: "infinitypow",
    alchemyResource: ALCHEMY_RESOURCE.INFINITY,
    hasRarity: true
  },
  power: {
    id: "power",
    symbol: GLYPH_SYMBOLS.power,
    color: "#22aa48",
    primaryEffect: "powerpow",
    alchemyResource: ALCHEMY_RESOURCE.POWER,
    hasRarity: true
  },
  effarig: {
    id: "effarig",
    symbol: GLYPH_SYMBOLS.effarig,
    color: "#e21717",
    isUnlocked: () => EffarigUnlock.reality.isUnlocked,
    canCustomize: () => EffarigUnlock.reality.isUnlocked,
    alchemyResource: ALCHEMY_RESOURCE.EFFARIG,
    hasRarity: true
    // Effarig glyphs have no primary effect; all are equally likely
  },
  reality: {
    id: "reality",
    symbol: GLYPH_SYMBOLS.reality,
    color: "#555555",
    isUnlocked: () => false,
    canCustomize: () => player.reality.glyphs.createdRealityGlyph,
    // Refining a reality glyph is pretty wasteful anyway, but might as well have this here
    alchemyResource: ALCHEMY_RESOURCE.REALITY
  },
  cursed: {
    id: "cursed",
    symbol: GLYPH_SYMBOLS.cursed,
    color: "black",
    isUnlocked: () => false,
    canCustomize: () => V.isFlipped,
  },
  companion: {
    id: "companion",
    symbol: GLYPH_SYMBOLS.companion,
    color: "#feaec9",
    isUnlocked: () => false,
  },
};

GameDatabase.reality.cosmeticGlyphs = {
  music: {
    id: "music",
    symbol: "♫",
    color: "#FF80AB",
    isUnlocked: () => TeresaUnlocks.shop.isUnlocked,
  },
  blob: {
    id: "blob",
    symbol: "\uE010",
    color: "#E4B51A",
    isUnlocked: () => Themes.available().map(t => t.name).includes("S11"),
  },
};

// The glyphTypes entry is used for both gameplay and cosmetics purposes, so we cannot modify isUnlocked for cosmetics.
// For the purposes of cosmetics, the difference between isUnlocked and canCustomize is as follows:
// - isUnlocked: Whether or not this type appears as a choice in glyph-specific customization for overriding their
//    normal display type; this is ignored for functional type entries
// - canCustomize: Whether or not this type can have its color/symbol changed in the type-specific customization
export const glyphTypes = {
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
    fixedSymbolColor: true,
    isUnlocked: () => false,
    canCustomize: () => player.reality.glyphs.createdRealityGlyph,
    // Refining a reality glyph is pretty wasteful anyway, but might as well have this here
    alchemyResource: ALCHEMY_RESOURCE.REALITY
  },
  cursed: {
    id: "cursed",
    symbol: GLYPH_SYMBOLS.cursed,
    color: "#000000",
    fixedSymbolColor: true,
    isUnlocked: () => false,
    canCustomize: () => V.isFlipped,
  },
  companion: {
    id: "companion",
    symbol: GLYPH_SYMBOLS.companion,
    color: "#feaec9",
    fixedSymbolColor: true,
    isUnlocked: () => false,
    canCustomize: () => false,
  },
};

export const cosmeticGlyphs = {
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
    preventBlur: true,
    isUnlocked: () => Themes.available().map(t => t.name).includes("S11"),
    canCustomize: () => false,
  },
};

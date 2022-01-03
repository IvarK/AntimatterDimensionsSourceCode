import { GameDatabase } from "./game-database.js";

GameDatabase.confirmationTypes = [
  {
    name: "Dimension Boost",
    option: "dimensionBoost",
    isUnlocked: () => PlayerProgress.infinityUnlocked() || player.galaxies > 0 || player.dimensionBoosts > 0,
  }, {
    name: "Antimatter Galaxy",
    option: "antimatterGalaxy",
    isUnlocked: () => PlayerProgress.infinityUnlocked() || player.galaxies > 0,
  }, {
    name: "Sacrifice",
    option: "sacrifice",
    isUnlocked: () => Sacrifice.isVisible,
  }, {
    name: "Big Crunch",
    option: "bigCrunch",
    isUnlocked: () => player.break,
  }, {
    name: "Challenges",
    option: "challenges",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "Replicanti Galaxy",
    option: "replicantiGalaxy",
    isUnlocked: () => PlayerProgress.eternityUnlocked() || player.replicanti.unl,
  }, {
    name: "Eternity",
    option: "eternity",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "Dilation",
    option: "dilation",
    isUnlocked: () => PlayerProgress.realityUnlocked() || !Currency.tachyonParticles.eq(0),
  }, {
    name: "Reality",
    option: "reality",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "Reset Reality",
    option: "resetReality",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "Glyph Replace",
    option: "glyphReplace",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "Glyph Sacrifice",
    option: "glyphSacrifice",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Glyph Purge",
    option: "autoClean",
    isUnlocked: () => GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Glyph Selection",
    option: "glyphSelection",
    isUnlocked: () => Autobuyer.reality.isUnlocked,
  }, {
    name: "Glyph Undo",
    option: "glyphUndo",
    isUnlocked: () => Teresa.has(TERESA_UNLOCKS.UNDO),
  }, {
    name: "Reset Celestial",
    option: "resetCelestial",
    isUnlocked: () => Teresa.has(TERESA_UNLOCKS.RUN),
  }, {
    name: "Delete Glyph Set Save",
    option: "deleteGlyphSetSave",
    isUnlocked: () => EffarigUnlock.setSaves.isUnlocked,
  }, {
    name: "Glyph Refine",
    option: "glyphRefine",
    isUnlocked: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY),
  },
];

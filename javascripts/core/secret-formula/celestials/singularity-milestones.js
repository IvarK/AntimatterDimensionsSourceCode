"use strict";

GameDatabase.celestials.singularityMilestones = [
  // Infinite
  {
    id: 1,
    start: 1,
    repeat: 5,
    limit: 0,
    description: "Continuum percentage multiplier",
    effect: completions => completions * 0.01,
    effectFormat: x => formatX(1 + x, 2, 2)
  },
  {
    id: 2,
    start: 2,
    repeat: 20,
    limit: 0,
    description: "Dark Matter production multiplier",
    effect: completions => Math.pow(1.5, completions),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 3,
    start: 3,
    repeat: 30,
    limit: 0,
    description: "Dark Energy production multiplier",
    effect: completions => Math.pow(2, completions),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 4,
    start: 4,
    repeat: 40,
    limit: 0,
    description: "Dark Matter Dimension upgrades are cheaper",
    effect: completions => Math.pow(0.85, completions),
    effectFormat: x => formatPercents(1 - x)
  },
  {
    id: 5,
    start: 50,
    repeat: 1000,
    limit: 0,
    description: "You gain more Singularities",
    effect: completions => Math.pow(2, completions),
    effectFormat: x => formatX(x, 2, 0)
  },
  // Limited
  {
    id: 6,
    start: 8,
    repeat: 8,
    limit: 8,
    description: "Automatically creates a Singularity after reaching the cap (with a delay)",
    effect: completions => [Infinity, 20, 15, 10, 5, 3, 2, 1, 0][completions],
    effectFormat: x => `${formatInt(x)}s`
  },
  {
    id: 7,
    start: 12,
    repeat: 40,
    limit: 5,
    description: "Dark Matter Dimension interval decrease",
    effect: completions => Math.pow(0.75, completions),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 8,
    start: 30,
    repeat: 10,
    limit: 4,
    description: "Dark Matter Dimension autobuyers",
    effect: completions => completions,
    effectFormat: x => ((x === 0) ? "No autobuyers" : `Dimension ${x} autobuyer`)
  },
  {
    id: 9,
    start: 40,
    repeat: 8,
    limit: 8,
    description: "Annihilation autobuyer (with a delay)",
    effect: completions => [Infinity, 20, 15, 10, 5, 3, 2, 1, 0][completions],
    effectFormat: x => `${formatInt(x)}s`
  },
  {
    id: 10,
    start: 250,
    repeat: 10,
    limit: 8,
    description: "Auto Singularity cap raiser (with a delay)",
    effect: completions => [Infinity, 20, 15, 10, 5, 3, 2, 1, 0][completions],
    effectFormat: x => `${formatInt(x)}s`
  },
  // Unique
  {
    id: 11,
    start: 10,
    repeat: 0,
    limit: 1,
    description: "Tesseracts boost Dark Matter production",
    effect: () => Math.pow(1.20, player.celestials.enslaved.tesseracts),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 12,
    start: 100,
    repeat: 0,
    limit: 1,
    description: "Singularities improve the Dilated Time multiplier upgrade",
    effect: () => 1 + Math.log10(player.celestials.laitela.singularities) / 21,
    effectFormat: x => formatX(Math.clampMin(x, 1), 2, 2)
  },
  {
    id: 13,
    start: 1000,
    repeat: 0,
    limit: 1,
    description: "Highest glyph level boosts Dark Energy production",
    effect: () => Math.clampMin((player.bestGlyphLevel - 10000) / 1000, 1),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 14,
    start: 1e4,
    repeat: 0,
    limit: 1,
    description: "Singularities boost Alchemy Momentum buildup speed",
    effect: () => Math.pow(Math.log10(player.celestials.laitela.singularities), 3),
    effectFormat: x => formatX(Math.clampMin(x, 1), 2, 2)
  },
  {
    id: 15,
    start: 1e5,
    repeat: 0,
    limit: 1,
    description: "Annihilation boosts Dark Energy and Dark Matter production",
    effect: () => Math.clampMin(Math.log10(Laitela.darkMatterMult), 1),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 16,
    start: 1e6,
    repeat: 0,
    limit: 1,
    description: "Singularities boost the Annihilation modifier",
    effect: () => Math.log10(player.celestials.laitela.singularities),
    effectFormat: x => formatX(Math.clampMin(x, 1), 2, 2)
  },
  {
    id: 17,
    start: 1e7,
    repeat: 0,
    limit: 1,
    description: "Gamespeed boosts Dark Energy production",
    effect: () => Math.clampMin(Math.log10(getGameSpeedupFactor()) / 10 - 10, 1),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 18,
    start: 1e8,
    repeat: 0,
    limit: 1,
    description: "Singularities boost glyph level",
    effect: () => 1 + Math.log10(player.celestials.laitela.singularities) / 20,
    effectFormat: x => formatX(Math.clampMin(x, 1), 2, 2)
  },
  {
    id: 19,
    start: 1e9,
    repeat: 0,
    limit: 1,
    description: "Dilated Time boosts Dark Matter production",
    effect: () => Math.pow(2.2, Decimal.log10(player.dilation.dilatedTime.plus(1)) / 1000),
    effectFormat: x => formatX(x, 2, 2)
  },
  {
    id: 20,
    start: 1e10,
    repeat: 0,
    limit: 1,
    description: "Singularities make Tesseracts stronger",
    effect: () => 1 + Math.log10(player.celestials.laitela.singularities) / 40,
    effectFormat: x => formatX(Math.clampMin(x, 1), 2, 2)
  }
];

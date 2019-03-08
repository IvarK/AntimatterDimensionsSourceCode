GameDatabase.reality.glyphSacrifice = [
  {
    id: "power",
    effect: () => Math.floor(4 * Math.log10(player.reality.glyphs.sac.power + 1)),
    description: amount => {
      let nextDistantGalaxy = Math.pow(10, (amount + 1) / 4) - 1;
      return `Distant galaxies start ${amount} later (next at ${shorten(nextDistantGalaxy, 2, 2)})`;
    }
  }, {
    id: "infinity",
    effect: () => 1 + Math.pow(player.reality.glyphs.sac.infinity, 0.1) / 100,
    description: amount => `${amount.toPrecision(4)}x bigger multiplier when buying 8th Infinity Dimension.`
  }, {
    id: "time",
    effect: () => 1 + Math.pow(player.reality.glyphs.sac.time, 0.1) / 100,
    description: amount => `${amount.toPrecision(4)}x bigger multiplier when buying 8th Time Dimension.`
  }, {
    id: "replication",
    effect: () => Math.floor(4 * Math.log10(player.reality.glyphs.sac.replication + 1)),
    description: amount => {
      let nextDistantReplicatedGalaxy = Math.pow(10, (amount + 1) / 4) - 1;
      return `Distant replicated galaxies start ${amount} later (next at ${shorten(nextDistantReplicatedGalaxy, 2, 2)})`;
    }
  }, {
    id: "dilation",
    effect: () => Math.pow(Math.max(player.reality.glyphs.sac.dilation, 1), 0.1),
    description: amount => `Multiply Tachyon Particle gain by ${shorten(amount, 2, 2)}x`
  }, {
    id: "effarig",
    effect: () => Math.log10(player.reality.glyphs.sac.effarig / 1e25 + 1),
    description: amount => `${amount.toFixed(2)}% additional glyph rarity`,
  }
].mapToObject(g => g.id, g => g);

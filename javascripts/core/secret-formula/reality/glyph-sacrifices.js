GameDatabase.reality.glyphSacrifice = [
  {
    id: "power",
    effect: () => Math.floor(Math.sqrt(player.reality.glyphs.sac.power) / 2),
    description: amount => {
      let nextDistantGalaxy = Math.pow(2 * (amount + 1), 2);
      return nextDistantGalaxy > 1e4
        ? `Remote galaxies start ${amount} later`
        : `Remote galaxies start ${amount} later (next at ${shorten(nextDistantGalaxy, 2, 2)})`;
    }
  }, {
    id: "infinity",
    effect: () => 1 + Math.sqrt(player.reality.glyphs.sac.infinity) / 100,
    description: amount => `${amount.toPrecision(4)}x bigger multiplier when buying 8th Infinity Dimension.`
  }, {
    id: "time",
    effect: () => 1 + Math.sqrt(player.reality.glyphs.sac.time) / 100,
    description: amount => `${amount.toPrecision(4)}x bigger multiplier when buying 8th Time Dimension.`
  }, {
    id: "replication",
    effect: () => Math.pow(Math.max(player.reality.glyphs.sac.replication, 0), 0.75),
    description: amount => `Raise maximum Replicanti chance cap by ${(amount * 100).toFixed(0)}%`
  }, {
    id: "dilation",
    effect: () => Math.pow(Math.max(player.reality.glyphs.sac.dilation, 1), 0.4),
    description: amount => `Multiply Tachyon Particle gain by ${shorten(amount, 2, 2)}x`
  }, {
    id: "effarig",
    effect: () => 5 * Math.log10(player.reality.glyphs.sac.effarig / 1e5 + 1),
    description: amount => `${amount.toFixed(2)}% additional glyph rarity`,
  }
].mapToObject(g => g.id, g => g);

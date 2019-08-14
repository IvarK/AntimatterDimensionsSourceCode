"use strict";

GameDatabase.reality.glyphSacrifice = [
  {
    id: "power",
    effect: () => Math.floor(3 * Math.pow(Math.log10(player.reality.glyphs.sac.power + 1), 1.2)),
    description: amount => {
      const nextDistantGalaxy = Math.pow(10, Math.pow((amount + 1) / 3, 1 / 1.2)) - 1;
      return `Distant galaxy scaling starts ${amount} later (next at ${shorten(nextDistantGalaxy, 2, 2)})`;
    }
  }, {
    id: "infinity",
    effect: () => 1 + Math.pow(player.reality.glyphs.sac.infinity, 0.2) / 100,
    description: amount => `${shortenRateOfChange(amount)}x bigger multiplier when buying 8th Infinity Dimension.`
  }, {
    id: "time",
    effect: () => 1 + Math.pow(player.reality.glyphs.sac.time, 0.2) / 100,
    description: amount => `${shortenRateOfChange(amount)}x bigger multiplier when buying 8th Time Dimension.`
  }, {
    id: "replication",
    effect: () => Math.floor(6 * Math.pow(Math.log10(player.reality.glyphs.sac.replication + 1), 1.2)),
    description: amount => {
      const nextReplicatedGalaxy = Math.pow(10, Math.pow((amount + 1) / 6, 1 / 1.2)) - 1;
      return "Replicated galaxy scaling starts " + 
        `${amount} later (next at ${shorten(nextReplicatedGalaxy, 2, 2)})`;
    }
  }, {
    id: "dilation",
    effect: () => {
      const sacPower = player.reality.glyphs.sac.dilation;
      const exponent = 0.2 * Math.pow(Math.log10(sacPower + 1), 0.1);
      return Math.pow(Math.max(sacPower, 1), exponent);
    },
    description: amount => `Multiply Tachyon Particle gain by ${shorten(amount, 2, 2)}x`
  }, {
    id: "effarig",
    effect: () => 2 * Math.log10(player.reality.glyphs.sac.effarig / 1e20 + 1),
    description: amount => `${amount.toFixed(2)}% additional glyph rarity`,
  }, {
    id: "reality",
    effect: () => 1 + Math.sqrt(player.reality.glyphs.sac.reality) / 25,
    description: amount => `${formatPercents(amount - 1, 2)} increased alchemy yield`,
  }
].mapToObject(g => g.id, g => g);

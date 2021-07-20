"use strict";

GameDatabase.reality.glyphSacrifice = [
  {
    id: "power",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      return Math.floor(3 * Math.pow(Math.log10(player.reality.glyphs.sac.power + 1), 1.2));
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      const nextDistantGalaxy = Math.pow(10, Math.pow((amount + 1) / 3, 1 / 1.2)) - 1;
      return `Distant Galaxy scaling starts ${formatInt(amount)} later
        (next at ${format(nextDistantGalaxy, 2, 2)})`;
    },
  }, {
    id: "infinity",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      return 1 + Math.log10(1 + Math.pow(player.reality.glyphs.sac.infinity, 0.2) / 100);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension.`;
    },
  }, {
    id: "time",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      return Math.pow(1 + Math.pow(player.reality.glyphs.sac.time, 0.2) / 100, 2);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension.`;
    },
  }, {
    id: "replication",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      return Math.floor(6 * Math.pow(Math.log10(player.reality.glyphs.sac.replication + 1), 1.2));
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      const nextReplicantiGalaxy = Math.pow(10, Math.pow((amount + 1) / 6, 1 / 1.2)) - 1;
      return "Replicanti Galaxy scaling starts " +
        `${formatInt(amount)} later (next at ${format(nextReplicantiGalaxy, 2, 2)})`;
    },
  }, {
    id: "dilation",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      const sacPower = player.reality.glyphs.sac.dilation;
      const exponent = 0.2 * Math.pow(Math.log10(sacPower + 1), 0.1);
      return Math.pow(Math.max(sacPower, 1), exponent);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `Multiply Tachyon Particle gain by ${format(amount, 2, 2)}x`;
    },
  }, {
    id: "effarig",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      return 2 * Math.log10(player.reality.glyphs.sac.effarig / 1e20 + 1);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `+${formatPercents(amount / 100, 2)} additional glyph rarity`;
    },
  }, {
    id: "reality",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      return 1 + Math.sqrt(player.reality.glyphs.sac.reality) / 25;
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatPercents(amount - 1, 2)} increased Alchemy yield`;
    },
  }
].mapToObject(g => g.id, g => g);

import { GameDatabase } from "../game-database.js";

GameDatabase.reality.glyphSacrifice = [
  {
    id: "power",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      const capped = Math.clampMax(player.reality.glyphs.sac.power, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = Math.log10(capped + 1) / Math.log10(GlyphSacrificeHandler.maxSacrificeForEffects);
      return Math.floor(750 * Math.pow(base, 1.2));
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Math.pow(10, Math.pow((amount + 1) / 750, 1 / 1.2) * Math.log10(sacCap)) - 1;
      const nextGalaxyText = amount < 750
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Distant Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    }
  }, {
    id: "infinity",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      const capped = Math.clampMax(player.reality.glyphs.sac.infinity, GlyphSacrificeHandler.maxSacrificeForEffects);
      return 1 + Math.log10(1 + Math.pow(capped, 0.2) / 100);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension.`;
    }
  }, {
    id: "time",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      const capped = Math.clampMax(player.reality.glyphs.sac.time, GlyphSacrificeHandler.maxSacrificeForEffects);
      return Math.pow(1 + Math.pow(capped, 0.2) / 100, 2);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension.`;
    }
  }, {
    id: "replication",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      const capped = Math.clampMax(player.reality.glyphs.sac.replication, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = Math.log10(capped + 1) / Math.log10(GlyphSacrificeHandler.maxSacrificeForEffects);
      return Math.floor(1500 * Math.pow(base, 1.2));
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Math.pow(10, Math.pow((amount + 1) / 1500, 1 / 1.2) * Math.log10(sacCap)) - 1;
      const nextGalaxyText = amount < 1500
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Replicanti Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    }
  }, {
    id: "dilation",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 1;
      const capped = Math.clampMax(player.reality.glyphs.sac.dilation, GlyphSacrificeHandler.maxSacrificeForEffects);
      const exponent = 0.32 * Math.pow(Math.log10(capped + 1) /
        Math.log10(GlyphSacrificeHandler.maxSacrificeForEffects), 0.1);
      return Math.pow(Math.clampMin(capped, 1), exponent);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `Multiply Tachyon Particle gain by ${formatX(amount, 2, 2)}`;
    }
  }, {
    id: "effarig",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      const capped = Math.clampMax(player.reality.glyphs.sac.effarig, GlyphSacrificeHandler.maxSacrificeForEffects);
      return 2 * Math.log10(capped / 1e20 + 1);
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `+${formatPercents(amount / 100, 2)} additional glyph rarity`;
    }
  }, {
    id: "reality",
    effect: () => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      return 1 + Math.sqrt(player.reality.glyphs.sac.reality) / 25;
    },
    description: amount => {
      if (Pelle.isDisabled("glyphsac")) return `Glyph Sacrifice is disabled in Pelle`;
      return `${formatPercents(amount - 1, 2)} increased Alchemy yield`;
    }
  }
].mapToObject(g => g.id, g => g);

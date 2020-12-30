"use strict";

const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    description() {
      return `Glyph Time Theorem generation is disabled and
      you gain less Infinity Points and Eternity Points (x^${format(0.55, 2, 2)}).`; 
    },
  },
  {
    name: "Effarig",
    description() {
      return Effarig.isRunning
        ? `all dimension multipliers, gamespeed, and tickspeed are severely lowered, like Dilation.\n
          Infinity power reduces the production and gamespeed penalties and Time Shards reduce the tickspeed penalty.\n
          Glyph levels are temporarily capped to ${Effarig.glyphLevelCap}, rarity is unaffected.\n
          You will exit Effarig's Reality when you complete a Layer of it for the first time.`
        : `all dimension multipliers, gamespeed, and tickspeed are severely lowered, like Dilation.\n
          Infinity power reduces the production and gamespeed penalties and Time Shards reduce the tickspeed penalty.\n
          Glyph levels are temporarily capped, rarity is unaffected.\n
          You will exit Effarig's Reality when you complete a Layer of it for the first time.`;
    }
  },
  {
    name: "The Enslaved Ones",
    description() {
      return `Glyph levels will be boosted to a minimum of ${formatInt(5000)}\n
              Infinity, Time, and 8th Antimatter Dimension purchases are limited to ${formatInt(1)} each\n
               Antimatter Dimension multipliers are always Dilated (the glyph effect still only
                applies in actual Dilation)\n
               Time Study 192 (uncapped Replicanti) is locked\n
               The Black Hole is disabled\n
               Tachyon Particle production and Dilated Time production are severely reduced\n
               Time Theorem generation from Dilation Glyphs is disabled\n
               Certain challenge goals have been increased\n
               Stored Time is discharged at a reduced effectiveness (exponent^${format(0.55, 2, 2)}) `;
    }
  },
  {
    name: "V",
    description() {
      return `All dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain per second
              are square-rooted, and Replicanti interval is squared.\n
              ${Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) ? ` Exponential Glyph Alchemy effect is disabled.` : ``}`;
    }
  }
];
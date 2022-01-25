import { Teresa } from "./teresa.js";
import { Effarig } from "./effarig.js";
import { Enslaved } from "./enslaved.js";
import { V } from "./V.js";
import { Ra } from "./ra/ra.js";
import { Laitela } from "./laitela/laitela.js";
import { Pelle } from "./pelle";

export const Celestials = {
  teresa: Teresa,
  effarig: Effarig,
  enslaved: Enslaved,
  v: V,
  ra: Ra,
  laitela: Laitela,
  pelle: Pelle
};

GameDatabase.celestials.descriptions = [
  {
    name: "Teresa",
    description() {
      return `Glyph Time Theorem generation is disabled and\
      you gain less Infinity Points and Eternity Points (x^${format(0.55, 2, 2)}).`;
    },
  },
  {
    name: "Effarig",
    description() {
      return `all Dimension multipliers, gamespeed, and tickspeed are severely lowered, like Dilation.
      Infinity Power reduces the production and gamespeed penalties and Time Shards reduce the tickspeed penalty.
      Glyph levels are temporarily capped${Effarig.isRunning ? ` to ${Effarig.glyphLevelCap}` : ``},
      rarity is unaffected. You will exit Effarig's Reality when you complete a Layer of it for the first time.`;
    }
  },
  {
    name: "The Enslaved Ones",
    description() {
      return `\nGlyph levels will be boosted to a minimum of ${formatInt(5000)}
      Infinity, Time, and 8th Antimatter Dimension purchases are limited to ${formatInt(1)} each
      Antimatter Dimension multipliers are always Dilated (the glyph effect still only applies in actual Dilation)
      Time Study 192 (uncapped Replicanti) is locked
      The Black Hole is disabled
      Tachyon Particle production and Dilated Time production are severely reduced
      Time Theorem generation from Dilation Glyphs is disabled
      Certain challenge goals have been increased
      Stored Time is discharged at a reduced effectiveness (exponent^${format(0.55, 2, 2)}) `;
    }
  },
  {
    name: "V",
    description() {
      return `all Dimension multipliers, Eternity Point gain, Infinity Point gain, and Dilated Time gain per second\
      are square-rooted, and Replicanti interval is squared.`;
    }
  },
  {
    name: "Ra",
    description() {
      return `you only have ${formatInt(4)} Dimension Boosts and can't gain any more, and the Tickspeed purchase
      multiplier is fixed at ${formatX(1.1245, 0, 3)}.\n`;
    },
  },
  {
    name: "Lai'tela",
    description() {
      return `Infinity Point and Eternity Point gain are Dilated.\
      Game speed is reduced to ${formatInt(1)} and gradually comes back over ${formatInt(10)} minutes,\
      and Black Hole storing/discharging/pulsing are disabled.\n
      Antimatter generates entropy inside of this Reality.\
      At ${formatPercents(1)} entropy, the Reality becomes destabilized\
      and you gain a reward based on how quickly you reached ${formatPercents(1)}.\
      If you can destabilize in less than ${formatInt(30)} seconds, the Reality gives a stronger reward,\
      but becomes significantly more difficult.`;
    }
  },

];

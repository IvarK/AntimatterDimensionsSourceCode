import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const TP = {
  total: {
    name: "Total Tachyon Particles",
    displayOverride: () => {
      const baseTPStr = format(new Decimal(Currency.tachyonParticles.value), 2, 2);
      return PelleRifts.paradox.milestones[1].canBeApplied
        ? `${baseTPStr}${formatPow(PelleRifts.paradox.milestones[1].effectValue, 1, 1)}`
        : baseTPStr;
    },
    // This is treated as a multiplier and not a prestige currency, with an overridden display;
    // therefore we need to return 1 "by default"
    multValue: () => {
      const baseTP = new Decimal(Currency.tachyonParticles.value)
        .pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
      return TimeStudy.dilation.isBought ? baseTP : 1;
    },
    isActive: () => PlayerProgress.realityUnlocked() || PlayerProgress.dilationUnlocked(),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  base: {
    name: "Base Tachyon Particle Count",
    isBase: true,
    multValue: () => new Decimal(Currency.tachyonParticles.value).div(tachyonGainMultiplier()),
    isActive: () => new Decimal(Currency.tachyonParticles.value).gt(0),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  achievementMult: {
    name: "Achievement Multiplier",
    multValue: () => RealityUpgrade(8).effectOrDefault(1),
    isActive: () => RealityUpgrade(8).canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  achievement: {
    name: "Achievement 132",
    multValue: () => Achievement(132).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  dilation: {
    name: () => `Dilation Upgrade - Repeatable ${formatX(3)} TP`,
    multValue: () => DilationUpgrade.tachyonGain.effectOrDefault(1),
    isActive: () => DilationUpgrade.tachyonGain.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  amplifierTP: {
    name: "Reality Upgrade - Superluminal Amplifier",
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(4)),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  realityUpgrade: {
    name: "Reality Upgrade - The Paradoxical Forever",
    multValue: () => DC.D1.timesEffectsOf(RealityUpgrade(15)),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  dilationGlyphSacrifice: {
    name: "Dilation Glyph Sacrifice",
    multValue: () => GlyphSacrifice.dilation.effectValue,
    isActive: () => GlyphSacrifice.dilation.effectValue > 1,
    icon: MultiplierTabIcons.SACRIFICE("dilation"),
  },

  nerfEnslaved: {
    name: "The Nameless Ones' Reality",
    powValue: () => Enslaved.tachyonNerf,
    isActive: () => Enslaved.isRunning,
    icon: MultiplierTabIcons.GENERIC_ENSLAVED,
  }
};

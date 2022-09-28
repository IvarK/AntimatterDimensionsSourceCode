import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

// See index.js for documentation
GameDatabase.multiplierTabValues.IP = {
  total: {
    name: () => "Total IP Gained",
    isBase: () => true,
    multValue: () => gainedInfinityPoints(),
    isActive: () => player.break,
    overlay: ["∞", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: () => "Base Infinity Points",
    isBase: () => true,
    multValue: () => {
      const div = Effects.min(
        308,
        Achievement(103),
        TimeStudy(111)
      );
      return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75);
    },
    isActive: () => player.break,
    color: () => "var(--color-infinity)",
    barOverlay: () => `<i class='fas fa-atom' /><i class='fa-solid fa-arrow-right-arrow-left' />`,
  },
  antimatter: {
    name: () => "Infinity Points from Antimatter",
    displayOverride: () => `${format(player.records.thisInfinity.maxAM, 2, 2)} AM`,
    // This just needs to be larger than 1 to make sure it's visible, the math is handled in powValue for divisor
    multValue: () => 10,
    isActive: () => player.break,
    color: () => "var(--color-infinity)",
    barOverlay: () => `<i class='fas fa-atom' />`,
  },
  divisor: {
    name: () => "Formula Improvement",
    displayOverride: () => {
      const div = Effects.min(308, Achievement(103), TimeStudy(111));
      return `log(AM)/${formatInt(308)} ➜ log(AM)/${format(div, 2, 1)}`;
    },
    powValue: () => 308 / Effects.min(308, Achievement(103), TimeStudy(111)),
    isActive: () => player.break,
    color: () => "var(--color-infinity)",
    barOverlay: () => `<i class='fas fa-calculator' />`,
  },
  infinityUpgrade: {
    name: () => "Repeatable Infinity Upgrade",
    multValue: () => InfinityUpgrade.ipMult.effectOrDefault(1),
    isActive: () => player.break && !Pelle.isDoomed,
    color: () => "var(--color-infinity)",
    barOverlay: () => `∞<i class="fas fa-arrow-up" />`,
  },
  achievement: {
    name: () => "Achievements",
    multValue: () => DC.D1.timesEffectsOf(
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  timeStudy: {
    name: () => "Time Studies",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
    ),
    isActive: () => player.break && !Pelle.isDoomed,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-book" />`,
  },
  dilationUpgrade: {
    name: () => "Dilation Upgrades",
    multValue: () => DilationUpgrade.ipMultDT.effectOrDefault(1),
    isActive: () => player.break && !Pelle.isDoomed && DilationUpgrade.ipMultDT.canBeApplied,
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ψ<i class="fas fa-arrow-up" />`,
  },
  glyph: {
    name: () => (Ra.unlocks.unlockGlyphAlchemy.canBeApplied
      ? "Equipped Glyphs and Glyph Alchemy"
      : "Equipped Glyphs"),
    multValue: () => Replicanti.amount.powEffectOf(AlchemyResource.exponential)
      .times(getAdjustedGlyphEffect("infinityIP")),
    powValue: () => (GlyphAlteration.isAdded("infinity") ? getSecondaryGlyphEffect("infinityIP") : 1),
    isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  other: {
    name: () => "IP Multipliers from Other sources",
    multValue: () => DC.D1.times(ShopPurchase.IPPurchases.currentMult)
      .timesEffectsOf(PelleRifts.vacuum)
      .times(Pelle.specialGlyphEffect.infinity),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    barOverlay: () => `<i class="fas fa-ellipsis" />`,
  },
};

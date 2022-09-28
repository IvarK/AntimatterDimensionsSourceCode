import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

// See index.js for documentation
GameDatabase.multiplierTabValues.EP = {
  total: {
    name: () => "Total EP Gained",
    isBase: () => true,
    multValue: () => gainedEternityPoints(),
    isActive: () => PlayerProgress.eternityUnlocked(),
    overlay: ["Δ", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: () => "Base Eternity Points",
    isBase: () => true,
    multValue: () => DC.D5.pow(player.records.thisEternity.maxIP.plus(
      gainedInfinityPoints()).log10() / (308 - PelleRifts.recursion.effectValue.toNumber()) - 0.7),
    isActive: () => PlayerProgress.eternityUnlocked(),
    color: () => "var(--color-eternity)",
    barOverlay: () => `∞<i class='fa-solid fa-arrow-right-arrow-left' />`,
  },
  IP: {
    name: () => "Eternity Points from Infinity Points",
    displayOverride: () => `${format(player.records.thisEternity.maxIP.plus(gainedInfinityPoints()), 2, 2)} IP`,
    // This just needs to be larger than 1 to make sure it's visible, the math is handled in powValue for divisor
    multValue: () => 10,
    isActive: () => PlayerProgress.eternityUnlocked(),
    color: () => "var(--color-eternity)",
    barOverlay: () => `∞`,
  },
  divisor: {
    name: () => "Formula Improvement",
    displayOverride: () => {
      const div = 308 - PelleRifts.recursion.effectValue.toNumber();
      return `log(IP)/${formatInt(308)} ➜ log(IP)/${format(div, 2, 2)}`;
    },
    powValue: () => 308 / (308 - PelleRifts.recursion.effectValue.toNumber()),
    isActive: () => PelleRifts.recursion.isActive,
    color: () => "var(--color-pelle--base)",
    barOverlay: () => `<i class='fas fa-calculator' />`,
  },
  eternityUpgrade: {
    name: () => "Repeatable Eternity Upgrade",
    multValue: () => EternityUpgrade.epMult.effectOrDefault(1),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    color: () => "var(--color-eternity)",
    barOverlay: () => `Δ<i class="fas fa-arrow-up" />`,
  },
  timeStudy: {
    name: () => "Time Studies",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(61),
      TimeStudy(122),
      TimeStudy(121),
      TimeStudy(123),
    ),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-book" />`,
  },
  glyph: {
    name: () => "Equipped Glyphs and Reality Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      RealityUpgrade(12),
      GlyphEffect.epMult
    ),
    powValue: () => (GlyphAlteration.isAdded("time") ? getSecondaryGlyphEffect("timeEP") : 1),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  other: {
    name: () => "IP Multipliers from Other sources",
    multValue: () => DC.D1.times(ShopPurchase.EPPurchases.currentMult)
      .timesEffectsOf(PelleRifts.vacuum.milestones[2])
      .times(Pelle.specialGlyphEffect.time),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    barOverlay: () => `<i class="fas fa-ellipsis" />`,
  },
};

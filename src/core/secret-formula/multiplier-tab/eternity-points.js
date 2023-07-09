import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const EP = {
  total: {
    name: "Total EP Gained on Eternity",
    displayOverride: () => (Player.canEternity
      ? format(gainedEternityPoints(), 2, 2)
      : "Cannot Eternity"),
    // This effectively hides everything if the player can't actually gain any
    multValue: () => (Player.canEternity ? gainedEternityPoints() : 1),
    isActive: () => PlayerProgress.eternityUnlocked() || Player.canEternity,
    dilationEffect: () => (Laitela.isRunning ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty) : 1),
    isDilated: true,
    overlay: ["Δ", "<i class='fa-solid fa-layer-group' />"],
  },
  base: {
    name: "Base Eternity Points",
    isBase: true,
    fakeValue: DC.D5,
    multValue: () => DC.D5.pow(player.records.thisEternity.maxIP.plus(
      gainedInfinityPoints()).log10() / (308 - PelleRifts.recursion.effectValue.toNumber()) - 0.7),
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.CONVERT_FROM("IP"),
  },
  IP: {
    name: "Eternity Points from Infinity Points",
    displayOverride: () => `${format(player.records.thisEternity.maxIP.plus(gainedInfinityPoints()), 2, 2)} IP`,
    // Just needs to match the value in base and be larger than 1
    multValue: DC.D5,
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("infinity"),
  },
  divisor: {
    name: "Pelle - EP Formula Improvement",
    displayOverride: () => {
      const div = 308 - PelleRifts.recursion.effectValue.toNumber();
      return `log(IP)/${formatInt(308)} ➜ log(IP)/${format(div, 2, 2)}`;
    },
    powValue: () => 308 / (308 - PelleRifts.recursion.effectValue.toNumber()),
    isActive: () => PelleRifts.recursion.canBeApplied,
    icon: MultiplierTabIcons.DIVISOR("EP"),
  },
  eternityUpgrade: {
    name: () => `Eternity Upgrade - Repeatable ${formatX(5)} EP`,
    multValue: () => EternityUpgrade.epMult.effectOrDefault(1),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },
  timeStudy: {
    name: "Time Studies",
    multValue: () => DC.D1.timesEffectsOf(
      TimeStudy(61),
      TimeStudy(121),
      TimeStudy(122),
      TimeStudy(123),
    ),
    isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  glyph: {
    name: "Equipped Glyphs",
    multValue: () => DC.D1
      .timesEffectsOf(Pelle.isDoomed ? null : GlyphEffect.epMult)
      .times(Pelle.specialGlyphEffect.time),
    powValue: () => (GlyphAlteration.isAdded("time") ? getSecondaryGlyphEffect("timeEP") : 1),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  realityUpgrade: {
    name: "Reality Upgrade - The Knowing Existence",
    multValue: () => RealityUpgrade(12).effectOrDefault(1),
    isActive: () => RealityUpgrade(12).canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  pelle: {
    name: "Pelle Strike - Vacuum Rift",
    multValue: () => PelleRifts.vacuum.milestones[2].effectOrDefault(1),
    isActive: () => PelleRifts.vacuum.milestones[2].canBeApplied,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: () => ShopPurchase.EPPurchases.currentMult,
    isActive: () => ShopPurchaseData.totalSTD > 0,
    icon: MultiplierTabIcons.IAP,
  },

  nerfTeresa: {
    name: "Teresa's Reality",
    powValue: () => 0.55,
    isActive: () => Teresa.isRunning,
    icon: MultiplierTabIcons.GENERIC_TERESA,
  },
  nerfV: {
    name: "V's Reality",
    powValue: () => 0.5,
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
};

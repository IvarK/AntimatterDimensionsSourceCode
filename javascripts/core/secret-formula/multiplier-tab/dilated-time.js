import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

// See index.js for documentation
GameDatabase.multiplierTabValues.DT = {
  total: {
    name: () => "Dilated Time gain",
    multValue: () => getDilationGainPerSecond(),
    isActive: () => getDilationGainPerSecond().gt(0),
    color: () => "var(--color-dilation)",
    overlay: ["Ψ"],
    barOverlay: () => `Ψ`,
  },
  tachyon: {
    name: () => "Tachyon Particles",
    displayOverride: () => {
      const baseTPStr = format(Currency.tachyonParticles.value, 2, 2);
      return PelleRifts.paradox.milestones[1].canBeApplied
        ? `${baseTPStr}${formatPow(PelleRifts.paradox.milestones[1].effectValue, 1)}`
        : baseTPStr;
    },
    multValue: () => Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1)),
    isActive: () => getDilationGainPerSecond().gt(0),
    color: () => "var(--color-dilation)",
    barOverlay: () => `<i class="fas fa-meteor" />`,
  },
  achievement: {
    name: () => "Achievements",
    multValue: () => Achievement(132).effectOrDefault(1) * Achievement(137).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied || Achievement(137).canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  dilation: {
    name: () => "Repeatable Dilation Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ),
    isActive: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ).gt(1),
    color: () => "var(--color-dilation)",
    barOverlay: () => `Ψ<i class="fas fa-repeat" />`,
  },
  realityUpgrade: {
    name: () => "Repeatable Reality Upgrade",
    multValue: () => RealityUpgrade(1).effectOrDefault(1),
    isActive: () => RealityUpgrade(1).canBeApplied,
    color: () => "var(--color-reality)",
    barOverlay: () => `Ϟ<i class="fas fa-arrow-up" />`,
  },
  glyph: {
    name: () => "Glyph Effects",
    multValue: () => Decimal.times(getAdjustedGlyphEffect("dilationDT"),
      Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1)),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  ra: {
    name: () => "Ra Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT
    ),
    isActive: () => Ra.unlocks.autoTP.canBeApplied,
    color: () => "var(--color-ra--base)",
    barOverlay: () => `<i class="fas fa-sun" />`,
  },
  other: {
    name: () => "Other sources",
    multValue: () => new Decimal(ShopPurchase.dilatedTimePurchases.currentMult ** (Pelle.isDoomed ? 0.5 : 1))
      .times(Pelle.specialGlyphEffect.dilation),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    barOverlay: () => `<i class="fas fa-ellipsis" />`,
  },
};

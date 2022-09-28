import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabHelper } from "./helper-functions";

// See index.js for documentation
GameDatabase.multiplierTabValues.ID = {
  total: {
    name: dim => (dim ? `Total ID ${dim} Multiplier` : "All ID Multipliers"),
    multValue: dim => (dim
      ? InfinityDimension(dim).multiplier
      : InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => id.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => InfinityDimension(dim ?? 1).isProducing,
    color: () => "var(--color-infinity)",
    overlay: ["∞", "<i class='fa-solid fa-cube' />"],
    barOverlay: dim => `∞${dim ?? ""}`,
  },
  purchase: {
    name: dim => (dim ? `ID ${dim} from Purchases` : "Total from Purchases"),
    multValue: dim => {
      const getMult = id => Decimal.pow(InfinityDimension(id).powerMultiplier,
        Math.floor(InfinityDimension(id).baseAmount / 10));
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning,
    color: () => "var(--color-infinity)",
    barOverlay: dim => `<i class="fas fa-arrow-up-right-dots" />${dim ?? ""}`,
  },

  basePurchase: {
    name: dim => (dim ? `Multiplier from base purchases` : "Total Multiplier from base purchases"),
    multValue: dim => {
      const getMult = id => {
        const purchases = id === 8
          ? Math.floor(InfinityDimension(id).baseAmount / 10)
          : Math.min(InfinityDimensions.HARDCAP_PURCHASES, Math.floor(InfinityDimension(id).baseAmount / 10));
        const baseMult = InfinityDimension(id)._powerMultiplier;
        return Decimal.pow(baseMult, purchases);
      };
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: dim => ImaginaryUpgrade(14).canBeApplied ||
        (dim === 8 ? GlyphSacrifice.infinity.effectValue > 1 : Tesseracts.bought > 0),
    color: () => "var(--color-infinity)",
    barOverlay: () => `<i class="fas fa-arrows-up-to-line" />`,
  },
  tesseractPurchase: {
    name: dim => (dim ? "Extra multiplier from Tesseracts" : "Total extra multiplier from Tesseracts"),
    multValue: dim => {
      const getMult = id => {
        if (id === 8) return DC.D1;
        const purchases = Math.floor(InfinityDimension(id).baseAmount / 10);
        return Decimal.pow(InfinityDimension(id).powerMultiplier,
          Math.clampMin(purchases - InfinityDimensions.HARDCAP_PURCHASES, 0));
      };
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => Tesseracts.bought > 0,
    color: () => "var(--color-enslaved--base)",
    barOverlay: () => `<i class="fas fa-up-right-and-down-left-from-center" />`,
  },
  infinityGlyphSacrifice: {
    name: () => "Extra multiplier from Infinity Glyph sacrifice",
    multValue: () => (InfinityDimension(8).isProducing
      ? Decimal.pow(GlyphSacrifice.infinity.effectValue, Math.floor(InfinityDimension(8).baseAmount / 10))
      : DC.D1),
    isActive: () => GlyphSacrifice.infinity.effectValue > 1,
    color: () => "var(--color-infinity)",
    barOverlay: () => `∞<i class="fas fa-turn-down" />`,
  },
  powPurchase: {
    name: () => "Power effect from Imaginary Upgrades",
    powValue: () => ImaginaryUpgrade(14).effectOrDefault(1),
    isActive: () => ImaginaryUpgrade(14).canBeApplied,
    color: () => "var(--color-ra--base)",
    barOverlay: () => `<i class="far fa-lightbulb" />`,
  },

  replicanti: {
    name: dim => (dim ? `ID ${dim} from Replicanti` : "Total from Replicanti"),
    multValue: dim => Decimal.pow(replicantiMult(), dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => Replicanti.areUnlocked,
    color: () => GameDatabase.reality.glyphTypes.replication.color,
    barOverlay: () => `Ξ`,
  },
  achievement: {
    name: dim => (dim ? `ID ${dim} from Achievements` : "Total from Achievements"),
    multValue: dim => {
      const baseMult = new Decimal(Achievement(75).effectOrDefault(1));
      if (dim) return dim === 1 ? baseMult.times(Achievement(94).effectOrDefault(1)) : baseMult;
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(baseMult, maxActiveDim).times(maxActiveDim > 0 ? Achievement(94).effectOrDefault(1) : DC.D1);
    },
    isActive: () => Achievement(75).canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  timeStudy: {
    name: dim => (dim
      ? `ID ${dim} from Time Studies and Eternity Upgrades`
      : "Total from Time Studies and Eternity Upgrades"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        TimeStudy(82),
        TimeStudy(92),
        TimeStudy(162),
        EternityUpgrade.idMultEP,
        EternityUpgrade.idMultEternities,
        EternityUpgrade.idMultICRecords,
      );
      if (dim) return dim === 4 ? allMult.times(TimeStudy(72).effectOrDefault(1)) : allMult;
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(allMult, maxActiveDim).times(maxActiveDim >= 4 ? TimeStudy(72).effectOrDefault(1) : DC.D1);
    },
    isActive: () => Achievement(75).canBeApplied,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-book" />`,
  },
  infinityChallenge: {
    name: dim => (dim ? `ID ${dim} from Infinity Challenges` : "Total from Infinity Challenges"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        InfinityChallenge(1).reward,
        InfinityChallenge(6).reward,
      );
      return Decimal.pow(allMult, dim ? 1 : MultiplierTabHelper.activeDimCount("ID"));
    },
    isActive: () => InfinityChallenge(1).isCompleted,
    color: () => "var(--color-infinity)",
    barOverlay: () => `∞<i class="fas fa-arrow-down-wide-short" />`,
  },
  eternityChallenge: {
    name: dim => (dim ? `ID ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        EternityChallenge(4).reward,
        EternityChallenge(9).reward,
      );
      if (dim) return dim === 1 ? allMult.times(EternityChallenge(2).reward.effectOrDefault(1)) : allMult;
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(allMult, maxActiveDim)
        .times(maxActiveDim >= 1 ? EternityChallenge(2).reward.effectOrDefault(1) : DC.D1);
    },
    isActive: () => EternityChallenge(2).completions > 0,
    color: () => "var(--color-eternity)",
    barOverlay: () => `Δ<i class="fas fa-arrow-down-wide-short" />`,
  },
  glyph: {
    name: dim => (dim ? `ID ${dim} from Glyph Effects` : "Total from Glyph Effects"),
    multValue: () => 1,
    powValue: () => getAdjustedGlyphEffect("infinitypow") * getAdjustedGlyphEffect("effarigdimensions"),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  alchemy: {
    name: dim => {
      const imStr = MachineHandler.isIMUnlocked ? " and Imaginary Upgrades" : "";
      return dim ? `ID ${dim} from Glyph Alchemy${imStr}` : `Total from Glyph Alchemy${imStr}`;
    },
    multValue: dim => {
      const mult = DC.D1.timesEffectsOf(
        AlchemyResource.dimensionality,
        ImaginaryUpgrade(8),
      );
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("ID"));
    },
    powValue: () => AlchemyResource.infinity.effectOrDefault(1) * Ra.momentumValue,
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    color: () => "var(--color-ra-pet--effarig)",
    barOverlay: () => `<i class="fas fa-vial" />`,
  },
  other: {
    name: dim => (dim ? `ID ${dim} from Other sources` : "Total from Other sources"),
    multValue: dim => {
      const mult = new Decimal(ShopPurchase.allDimPurchases.currentMult).timesEffectsOf(
        PelleRifts.recursion.milestones[1]
      );
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(mult, dim ? 1 : maxActiveDim)
        .times(maxActiveDim >= 1 ? PelleRifts.decay.milestones[0].effectOrDefault(1) : DC.D1);
    },
    powValue: () => PelleRifts.paradox.effectOrDefault(1),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    barOverlay: () => `<i class="fas fa-ellipsis" />`,
  },
  powerConversion: {
    name: () => "Infinity Power Conversion",
    powValue: () => InfinityDimensions.powerConversionRate,
    isActive: () => Currency.infinityPower.value.gt(1) && !EternityChallenge(9).isRunning,
    color: () => "var(--color-infinity)",
    barOverlay: () => `<i class="fas fa-arrow-down-up-across-line" />`,
  }
};

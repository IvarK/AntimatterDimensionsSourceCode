import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabHelper } from "./helper-functions";

// See index.js for documentation
GameDatabase.multiplierTabValues.TD = {
  total: {
    name: dim => (dim ? `Total TD ${dim} Multiplier` : "All TD Multipliers"),
    multValue: dim => (dim
      ? TimeDimension(dim).multiplier
      : TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => td.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => TimeDimension(dim ?? 1).isProducing,
    color: () => "var(--color-eternity)",
    overlay: ["Δ", "<i class='fa-solid fa-cube' />"],
    barOverlay: dim => `Δ${dim ?? ""}`,
  },
  purchase: {
    name: dim => (dim ? `TD ${dim} from Purchases` : "Total from Purchases"),
    multValue: dim => {
      const getMult = td => {
        const d = TimeDimension(td);
        const bought = td === 8 ? Math.clampMax(d.bought, 1e8) : d.bought;
        return Decimal.pow(d.powerMultiplier, bought);
      };
      if (dim) return getMult(dim);
      return TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => getMult(td.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning,
    color: () => "var(--color-eternity)",
    barOverlay: dim => `<i class="fas fa-arrow-up-right-dots" />${dim ?? ""}`,
  },

  basePurchase: {
    name: () => "Base Multiplier from purchases",
    multValue: dim => {
      const getMult = td => Decimal.pow(4,
        td === 8 ? Math.clampMax(TimeDimension(td).bought, 1e8) : TimeDimension(td).bought);
      if (dim) return getMult(dim);
      return TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => getMult(td.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: dim => (dim
      ? ImaginaryUpgrade(14).canBeApplied || (dim === 8 && GlyphSacrifice.time.effectValue > 1)
      : TimeDimension(1).isProducing),
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-arrow-up-right-dots" />`,
  },
  timeGlyphSacrifice: {
    name: () => "Extra multiplier from Time Glyph sacrifice",
    multValue: () => (TimeDimension(8).isProducing
      ? Decimal.pow(GlyphSacrifice.time.effectValue, Math.clampMax(TimeDimension(8).bought, 1e8))
      : DC.D1),
    isActive: () => GlyphSacrifice.time.effectValue > 1,
    color: () => "var(--color-eternity)",
    barOverlay: () => `Δ<i class="fas fa-turn-down" />`,
  },
  powPurchase: {
    name: () => "Power effect from Imaginary Upgrades",
    powValue: () => ImaginaryUpgrade(14).effectOrDefault(1),
    isActive: () => ImaginaryUpgrade(14).canBeApplied,
    color: () => "var(--color-ra--base)",
    barOverlay: () => `<i class="far fa-lightbulb" />`,
  },

  achievement: {
    name: dim => (dim ? `TD ${dim} from Achievements` : "Total from Achievements"),
    multValue: dim => {
      const baseMult = DC.D1.timesEffectsOf(
        Achievement(105),
        Achievement(128),
        EternityUpgrade.tdMultAchs,
      );
      return Decimal.pow(baseMult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    isActive: () => Achievement(75).canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-trophy" />`,
  },
  timeStudy: {
    name: dim => (dim
      ? `TD ${dim} from Time Studies and Eternity Upgrades`
      : "Total from Time Studies and Eternity Upgrades"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        TimeStudy(93),
        TimeStudy(103),
        TimeStudy(151),
        TimeStudy(221),
        TimeStudy(301),
        EternityUpgrade.tdMultTheorems,
        EternityUpgrade.tdMultRealTime,
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier === 1 ? TimeStudy(11) : null,
          tier === 3 ? TimeStudy(73) : null,
          tier === 4 ? TimeStudy(227) : null
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("TD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    isActive: () => Achievement(75).canBeApplied,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-book" />`,
  },
  eternityChallenge: {
    name: dim => (dim ? `TD ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
    multValue: dim => {
      let allMult = DC.D1.timesEffectsOf(
        EternityChallenge(1).reward,
        EternityChallenge(10).reward,
      );
      if (EternityChallenge(9).isRunning) {
        allMult = allMult.times(
          Decimal.pow(Math.clampMin(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate / 7)
            .log2(), 1), 4).clampMin(1));
      }
      return Decimal.pow(allMult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    isActive: () => EternityChallenge(1).completions > 0,
    color: () => "var(--color-eternity)",
    barOverlay: () => `Δ<i class="fas fa-arrow-down-wide-short" />`,
  },
  glyph: {
    name: dim => (dim ? `TD ${dim} from Glyph Effects` : "Total from Glyph Effects"),
    multValue: () => 1,
    powValue: () => getAdjustedGlyphEffect("timepow") * getAdjustedGlyphEffect("effarigdimensions"),
    isActive: () => PlayerProgress.realityUnlocked(),
    color: () => "var(--color-reality)",
    barOverlay: () => `<i class="fas fa-clone" />`,
  },
  alchemy: {
    name: dim => {
      const imStr = MachineHandler.isIMUnlocked ? " and Imaginary Upgrades" : "";
      return dim ? `TD ${dim} from Glyph Alchemy${imStr}` : `Total from Glyph Alchemy${imStr}`;
    },
    multValue: dim => {
      const mult = DC.D1.timesEffectsOf(
        AlchemyResource.dimensionality,
        ImaginaryUpgrade(11),
      );
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    powValue: () => AlchemyResource.time.effectOrDefault(1) * Ra.momentumValue,
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    color: () => "var(--color-v--base)",
    barOverlay: () => `<i class="fas fa-vial" />`,
  },
  other: {
    name: dim => (dim ? `TD ${dim} from Other sources` : "Total from Other sources"),
    multValue: dim => {
      const mult = new Decimal(ShopPurchase.allDimPurchases.currentMult).timesEffectsOf(
        Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
        Pelle.isDoomed ? null : RealityUpgrade(22),
        PelleRifts.chaos
      );
      const maxActiveDim = MultiplierTabHelper.activeDimCount("TD");
      return Decimal.pow(mult, dim ? 1 : maxActiveDim);
    },
    powValue: () => PelleRifts.paradox.effectOrDefault(1),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    barOverlay: () => `<i class="fas fa-ellipsis" />`,
  },
};

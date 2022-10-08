import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.general = {
  achievement: {
    name: (ach, dim) => (dim?.length === 2
      ? `Achievement ${ach} (${dim})`
      : `Achievement ${ach}`),
    multValue: (ach, dim) => {
      // There is also a buy10 effect, but we don't track that in the multiplier tab
      if (ach === 141) return Achievement(141).canBeApplied ? Achievement(141).effects.ipGain.effectOrDefault(1) : 1;
      if (!dim) return Achievement(ach).canBeApplied ? Achievement(ach).effectOrDefault(1) : 1;

      if (dim?.length === 2) {
        let totalEffect = DC.D1;
        for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount(dim); tier++) {
          let singleEffect;
          if (ach === 43) singleEffect = Achievement(43).canBeApplied ? (1 + tier / 100) : 1;
          else singleEffect = (MultiplierTabHelper.achievementDimCheck(ach, `${dim}${tier}`) &&
              Achievement(ach).canBeApplied) ? Achievement(ach).effectOrDefault(1) : 1;
          totalEffect = totalEffect.times(singleEffect);
        }
        return totalEffect;
      }

      if (ach === 43) return Achievement(43).canBeApplied ? (1 + Number(dim.charAt(2)) / 100) : 1;
      return (MultiplierTabHelper.achievementDimCheck(ach, dim) && Achievement(ach).canBeApplied)
        ? Achievement(ach).effectOrDefault(1) : 1;
    },
    isActive: ach => Achievement(ach).canBeApplied,
    icon: ach => {
      const base = MultiplierTabIcons.ACHIEVEMENT;
      return {
        color: base.color,
        symbol: `${base.symbol}${ach}`,
      };
    },
  },
  timeStudy: {
    name: (ts, dim) => (dim?.length === 2
      ? `Time Study ${ts} (${dim})`
      : `Time Study ${ts}`),
    multValue: (ts, dim) => {
      if (!dim) return TimeStudy(ts).canBeApplied ? TimeStudy(ts).effectOrDefault(1) : 1;
      if (dim?.length === 2) {
        let totalEffect = DC.D1;
        for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount(dim); tier++) {
          totalEffect = totalEffect.times((MultiplierTabHelper.timeStudyDimCheck(ts, `${dim}${tier}`) &&
              TimeStudy(ts).isBought) ? TimeStudy(ts).effectOrDefault(1) : 1);
        }
        return totalEffect;
      }
      // The new Decimal() wrapper is necessary because, for some inexplicable reason, replicanti becomes
      // reactive through TS101 if that isn't there
      return (MultiplierTabHelper.timeStudyDimCheck(ts, dim) && TimeStudy(ts).isBought)
        ? new Decimal(TimeStudy(ts).effectOrDefault(1)) : 1;
    },
    isActive: ts => TimeStudy(ts).isBought,
    icon: ts => {
      const base = MultiplierTabIcons.TIME_STUDY;
      return {
        color: base.color,
        symbol: `${base.symbol}${ts}`,
      };
    },
  },
  infinityChallenge: {
    name: ic => `Infinity Challenge ${ic}`,
    multValue: (ic, dim) => {
      if (ic === 4) return 1;
      if (dim?.length === 2) {
        let totalEffect = DC.D1;
        for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount(dim); tier++) {
          totalEffect = totalEffect.times((MultiplierTabHelper.ICDimCheck(ic, `${dim}${tier}`) &&
              InfinityChallenge(ic).isCompleted) ? InfinityChallenge(ic).reward.effectOrDefault(1) : 1);
        }
        return totalEffect;
      }
      if (ic === 8) return (dim > 1 && dim < 8) ? InfinityChallenge(ic).reward.effectValue : DC.D1;
      return InfinityChallenge(ic).reward.effectValue;
    },
    powValue: ic => (ic === 4 ? InfinityChallenge(4).reward.effectValue : 1),
    isActive: ic => InfinityChallenge(ic).isCompleted,
    icon: ic => {
      const base = MultiplierTabIcons.CHALLENGE("infinity");
      return {
        color: base.color,
        symbol: `${base.symbol}${ic}`,
      };
    },
  },
  eternityChallenge: {
    name: ec => `Eternity Challenge ${ec}`,
    multValue: (ec, dim) => {
      if (dim?.length === 2) {
        let totalEffect = DC.D1;
        for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount(dim); tier++) {
          totalEffect = totalEffect.times((MultiplierTabHelper.ECDimCheck(ec, `${dim}${tier}`) &&
              EternityChallenge(ec).completions > 0) ? EternityChallenge(ec).reward.effectOrDefault(1) : 1);
        }
        return totalEffect;
      }
      if (ec === 2) return dim === "ID1" ? EternityChallenge(ec).reward.effectValue : DC.D1;
      return EternityChallenge(ec).reward.effectValue;
    },
    isActive: ec => EternityChallenge(ec).completions > 0,
    icon: ec => {
      const base = MultiplierTabIcons.CHALLENGE("eternity");
      return {
        color: base.color,
        symbol: `${base.symbol}${ec}`,
      };
    },
  },
};

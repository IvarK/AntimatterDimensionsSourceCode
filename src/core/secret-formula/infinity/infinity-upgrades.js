import { DC } from "../../constants";

function dimInfinityMult() {
  return Currency.infinitiesTotal.value.times(0.2).plus(1);
}
function chargedDimInfinityMult() {
  return 1 + Math.log10(Math.max(1, Currency.infinitiesTotal.value.pLog10())) * Math.sqrt(Ra.pets.teresa.level) / 150;
}

export const infinityUpgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    description: "Antimatter Dimensions gain a multiplier based on time played",
    effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "Antimatter Dimensions gain a power effect based on time played and Teresa level",
      effect: () => 1 +
        Math.log10(Math.log10(Time.totalTimePlayed.totalMilliseconds)) *
        Math.pow(Ra.pets.teresa.level, 0.5) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.totalTimeMult.isBought,
    description: "1st and 8th Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "1st and 8th Antimatter Dimensions gain a power effect based on Infinities and Teresa level",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.buy10Mult.isBought,
    description: "2nd and 7th Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "2nd and 7th Antimatter Dimensions gain a power effect based on Infinities and Teresa level",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim18mult.isBought,
    description: "3rd and 6th Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "3rd and 6th Antimatter Dimensions gain a power effect based on Infinities and Teresa level",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim27mult.isBought,
    description: "4th and 5th Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: "4th and 5th Antimatter Dimensions gain a power effect based on Infinities and Teresa level",
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim36mult.isBought,
    description: () =>
      `Decrease the number of Dimensions needed for Dimension Boosts and Antimatter Galaxies by ${formatInt(9)}`,
    effect: 9,
    charged: {
      description: () => "Decrease Dimension Boost requirement based on Teresa level",
      effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level) / 10),
      formatEffect: value => `${formatX(value, 4, 4)}`
    }
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    description: () => `Increase the multiplier for buying ${formatInt(10)} Antimatter Dimensions`,
    effect: () => 1.1,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
    charged: {
      description: () => `The multiplier for buying ${formatInt(10)} Antimatter Dimensions gains ` +
        "a power effect based on Teresa level",
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    checkRequirement: () => InfinityUpgrade.dim45mult.isBought,
    description: "All Galaxies are twice as strong",
    effect: 2,
    charged: {
      description: "All Galaxies are stronger based on Teresa level",
      effect: () => 2 + Math.sqrt(Ra.pets.teresa.level) / 100,
      formatEffect: value => `+${formatPercents(value - 1)}`
    }
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    description: "Antimatter Dimensions gain a multiplier based on time spent in current Infinity",
    effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description:
        "Antimatter Dimensions gain a power effect based on time spent in current Infinity and Teresa level",
      effect: () => 1 +
        Math.log10(Math.log10(Time.thisInfinity.totalMilliseconds + 100)) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    checkRequirement: () => InfinityUpgrade.thisInfinityTimeMult.isBought,
    description: "Multiplier to 1st Antimatter Dimension based on unspent Infinity Points",
    effect: () => Currency.infinityPoints.value.dividedBy(2).pow(1.5).plus(1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: "Multiplier to 1st Antimatter Dimension based on unspent Infinity Points, powered by Teresa level",
      effect: () => Currency.infinityPoints.value.dividedBy(2).pow(Math.sqrt(Ra.pets.teresa.level) * 1.5).plus(1),
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    checkRequirement: () => InfinityUpgrade.unspentIPMult.isBought,
    description: "Increase Dimension Boost multiplier",
    effect: () => 2.5,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.5, 0, 1)}`,
    charged: {
      description: "Dimension Boost multiplier gains a power effect based on Teresa level",
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  ipGen: {
    id: "passiveGen",
    cost: 10,
    checkRequirement: () => InfinityUpgrade.dimboostMult.isBought,
    description: () => `Passively generate Infinity Points ${formatInt(10)} times slower than your fastest Infinity`,
    // Cutting corners: this is not actual effect, but it is totalIPMult that is displyed on upgrade
    effect: () => (Teresa.isRunning || V.isRunning || Pelle.isDoomed ? DC.D0 : GameCache.totalIPMult.value),
    formatEffect: value => {
      if (Teresa.isRunning || V.isRunning) return "Disabled in this reality";
      if (Pelle.isDoomed) return "Disabled";
      if (player.records.bestInfinity.time >= 999999999999) return "Too slow to generate";
      return `${format(value, 2)} every ${Time.bestInfinity.times(10).toStringShort()}`;
    },
    charged: {
      description: () =>
        `Gain Reality Machines each real-time second proportional to amount gained on Reality,
        increasing with Teresa level`,
      effect: () => Math.pow(Ra.pets.teresa.level, 2) *
        Ra.unlocks.continuousTTBoost.effects.autoPrestige.effectOrDefault(1),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  skipReset1: {
    id: "skipReset1",
    cost: 20,
    description: () =>
      `Start every reset with ${formatInt(1)} Dimension Boost, automatically unlocking the 5th Antimatter Dimension`,
  },
  skipReset2: {
    id: "skipReset2",
    cost: 40,
    checkRequirement: () => InfinityUpgrade.skipReset1.isBought,
    description: () =>
      `Start every reset with ${formatInt(2)} Dimension Boosts, automatically unlocking the 6th Antimatter Dimension`,
  },
  skipReset3: {
    id: "skipReset3",
    cost: 80,
    checkRequirement: () => InfinityUpgrade.skipReset2.isBought,
    description: () =>
      `Start every reset with ${formatInt(3)} Dimension Boosts, automatically unlocking the 7th Antimatter Dimension`,
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: 300,
    checkRequirement: () => InfinityUpgrade.skipReset3.isBought,
    description: () =>
      `Start every reset with ${formatInt(4)} Dimension Boosts, automatically unlocking the 8th Antimatter Dimension;
      and an Antimatter Galaxy`,
  },
  ipOffline: {
    id: "ipOffline",
    cost: 1000,
    checkRequirement: () => Achievement(41).isUnlocked,
    description: () => (player.options.offlineProgress
      ? `Only while offline, gain ${formatPercents(0.5)} of your best IP/min without using Max All`
      : "This upgrade would give offline Infinity Point generation, but offline progress is currently disabled"),
    effect: () => (player.options.offlineProgress
      ? player.records.thisEternity.bestIPMsWithoutMaxAll.times(TimeSpan.fromMinutes(1).totalMilliseconds / 2)
      : DC.D0),
    isDisabled: () => !player.options.offlineProgress,
    formatEffect: value => `${format(value, 2, 2)} IP/min`,
  },
  ipMult: {
    id: "ipMult",
    cost: () => InfinityUpgrade.ipMult.cost,
    checkRequirement: () => Achievement(41).isUnlocked,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    description: () => `Multiply Infinity Points from all sources by ${formatX(2)}`,
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.IPMultPurchases >= 3300000 ? DC.E1E6 : DC.D2.pow(player.IPMultPurchases)),
    cap: () => Effarig.eternityCap ?? DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
};

"use strict";

GameDatabase.infinity.upgrades = (function() {
  function dimInfinityMult() {
    return Player.totalInfinitied.times(0.2).plus(1);
  }
  return {
    totalTimeMult: {
      id: "timeMult",
      cost: 1,
      description: "Normal Dimensions gain a multiplier based on time played",
      effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15),
      formatEffect: value => formatX(value, 2, 2),
      charged: {
        description: "Normal Dimensions gain a power effect based on time played and Teresa level",
        effect: () => 1 +
          Math.log10(Math.log10(Time.totalTimePlayed.totalMilliseconds)) *
          Math.pow(Ra.pets.teresa.level, 0.5) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    dim18mult: {
      id: "18Mult",
      cost: 1,
      description: "First and Eighth Dimensions gain a multiplier based on Infinitied stat",
      effect: () => dimInfinityMult(),
      formatEffect: value => formatX(value, 1, 1),
      charged: {
        description: "First and Eighth Dimensions gain a power effect based on Infinitied stat and Teresa level",
        effect: () => 1 + Math.log10(Math.max(1, player.infinitied.pLog10())) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    dim27mult: {
      id: "27Mult",
      cost: 1,
      description: "Second and Seventh Dimensions gain a multiplier based on Infinitied stat",
      effect: () => dimInfinityMult(),
      formatEffect: value => formatX(value, 1, 1),
      charged: {
        description: "Second and Seventh Dimensions gain a power effect based on Infinitied stat and Teresa level",
        effect: () => 1 + Math.log10(Math.max(1, player.infinitied.pLog10())) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    dim36mult: {
      id: "36Mult",
      cost: 1,
      description: "Third and Sixth Dimensions gain a multiplier based on Infinitied stat",
      effect: () => dimInfinityMult(),
      formatEffect: value => formatX(value, 1, 1),
      charged: {
        description: "Third and Sixth Dimensions gain a power effect based on Infinitied stat and Teresa level",
        effect: () => 1 + Math.log10(Math.max(1, player.infinitied.pLog10())) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    dim45mult: {
      id: "45Mult",
      cost: 1,
      description: "Fourth and Fifth Dimensions gain a multiplier based on Iinfinitied stat",
      effect: () => dimInfinityMult(),
      formatEffect: value => formatX(value, 1, 1),
      charged: {
        description: "Fourth and Fifth Dimensions gain a power effect based on Infinitied stat and Teresa level",
        effect: () => 1 + Math.log10(Math.max(1, player.infinitied.pLog10())) *
        Math.sqrt(Ra.pets.teresa.level) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    resetBoost: {
      id: "resetBoost",
      cost: 1,
      description: "Decrease the number of Dimensions needed for Dimension Boosts and Antimatter Galaxies by 9",
      effect: 9,
      charged: {
        description: "Decrease Dimension Boost requirement based on Teresa level",
        effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level) / 10),
        formatEffect: value => `${formatX(value, 4, 4)}`
      }
    },
    buy10Mult: {
      id: "dimMult",
      cost: 1,
      description: "Increase the multiplier for buying 10 Dimensions",
      effect: () => 1.1,
      formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
      charged: {
        description: "Multiplier for buying 10 Dimensions gains a power effect based on Teresa level",
        effect: () => 1 + Ra.pets.teresa.level / 200,
        formatEffect: value => formatPow(value, 3, 3)
      }
    },
    galaxyBoost: {
      id: "galaxyBoost",
      cost: 2,
      description: "Galaxies are twice as strong",
      effect: 2,
      charged: {
        description: "Galaxies are stronger based on Teresa level",
        effect: () => 2 + Math.sqrt(Ra.pets.teresa.level) / 100,
        formatEffect: value => `+${formatPercents(value - 1)}`
      }
    },
    thisInfinityTimeMult: {
      id: "timeMult2",
      cost: 3,
      description: "Normal Dimensions gain a multiplier based on time spent in current Infinity",
      effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1),
      formatEffect: value => formatX(value, 2, 2),
      charged: {
        description: "Normal Dimensions gain a power effect based on time spent in current Infinity and Teresa level",
        effect: () => 1 +
          Math.log10(Math.log10(Time.thisInfinity.totalMilliseconds + 100)) *
          Math.sqrt(Ra.pets.teresa.level) / 150,
        formatEffect: value => formatPow(value, 4, 4)
      }
    },
    unspentIPMult: {
      id: "unspentBonus",
      cost: 5,
      description: "Multiplier to 1st Dimension based on unspent Infinity Points",
      effect: () => player.infinityPoints.dividedBy(2).pow(1.5).plus(1),
      formatEffect: value => formatX(value, 2, 2),
      charged: {
        description: "Multiplier to 1st Dimension based on unspent Infinity Points, powered by Teresa level",
        effect: () => player.infinityPoints.dividedBy(2).pow(Math.sqrt(Ra.pets.teresa.level) * 1.5).plus(1),
        formatEffect: value => formatX(value, 2, 2)
      }
    },
    dimboostMult: {
      id: "resetMult",
      cost: 7,
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
      description: "Passively generate Infinity Points 10 times slower than your fastest Infinity",
      // Cutting corners: this is not actual effect (player.infMult is), but
      // it is totalIPMult that is displyed on upgrade
      effect: () => (Teresa.isRunning || V.isRunning ? new Decimal(0) : GameCache.totalIPMult.value),
      formatEffect: value => {
        if (Teresa.isRunning || V.isRunning) return "Disabled in this reality";
        const income = format(value, 2, 0);
        const period = player.bestInfinityTime >= 999999999999
          ? "hundred or so years"
          : Time.bestInfinity.times(10);
        return `${income} every ${period}`;
      },
      charged: {
        description: "Gain a percentage of your RM gained on Reality each real-time second, " +
          "percent increases with Teresa level",
        effect: () => Math.sqrt(Ra.pets.teresa.level) / 1000 * RA_UNLOCKS.TT_BOOST.effect.autoPrestige(),
        formatEffect: value => `${formatPercents(value, 2)}`
      }
    },
    skipReset1: {
      id: "skipReset1",
      cost: 20,
      description: "You start with the 5th Dimension unlocked",
      bannedFromCharging: true
    },
    skipReset2: {
      id: "skipReset2",
      cost: 40,
      description: "You start with the 6th Dimension unlocked",
      bannedFromCharging: true
    },
    skipReset3: {
      id: "skipReset3",
      cost: 80,
      description: "You start with the 7th Dimension unlocked",
      bannedFromCharging: true
    },
    skipResetGalaxy: {
      id: "skipResetGalaxy",
      cost: 300,
      description: "You start with the 8th Dimension unlocked, and an Antimatter Galaxy",
      bannedFromCharging: true
    },
    ipOffline: {
      id: "ipOffline",
      cost: 1000,
      description: "Only while offline, gain 50% of your best IP/min without using Max All",
      effect: () => player.bestIpPerMsWithoutMaxAll.times(TimeSpan.fromMinutes(1).totalMilliseconds / 2),
      formatEffect: value => `${format(value, 2, 2)} IP/min`,
      bannedFromCharging: true
    },
    ipMult: {
      cost: () => player.infMultCost,
      costCap: new Decimal("1e6000000"),
      costIncreaseThreshold: new Decimal("1e3000000"),
      description: () => `Multiply Infinity Points from all sources by ${formatX(2)}`,
      effect: () => player.infMult,
      cap: () => Effarig.eternityCap || new Decimal("1e1000000"),
      formatEffect: value => formatX(value, 2, 2),
      bannedFromCharging: true
    }
  };
}());

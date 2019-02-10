GameDatabase.infinity.upgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    description: "Normal Dimensions gain a multiplier based on time played",
    charged: {
      description: "Normal Dimensions gain a power effect based on time played and Teresa level",
      effect: () => Math.log10(Math.log10(Time.totalTimePlayed.totalMilliseconds)) * player.celestials.ra.level / 150
    },
    effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15),
    formatEffect: value => formatX(value, 2, 2)
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    description: "First and Eighth Dimensions gain a multiplier based on infinitied stat",
    charged: {
      description: "First and Eighth Dimensions gain a power effect based on infinitied stat and Teresa level",
      effect: () => 1 + Math.log10(Math.log10(player.infinitied)) * player.celestials.ra.level / 100
    },
    effect: () => _INFUPG_dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1)
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    description: "Second and Seventh Dimensions gain a multiplier based on infinitied stat",
    charged: {
      description: "Second and Seventh Dimensions gain a power effect based on infinitied stat and Teresa level",
      effect: () => 1 + Math.log10(Math.log10(player.infinitied)) * player.celestials.ra.level / 100
    },
    effect: () => _INFUPG_dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1)
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    description: "Third and Sixth Dimensions gain a multiplier based on infinitied stat",
    charged: {
      description: "Third and Sixth Dimensions gain a power effect based on infinitied stat and Teresa level",
      effect: () => 1 + Math.log10(Math.log10(player.infinitied)) * player.celestials.ra.level / 100
    },
    effect: () => _INFUPG_dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1)
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    description: "Fourth and Fifth Dimensions gain a multiplier based on infinitied stat",
    charged: {
      description: "Fourth and Fifth Dimensions gain a power effect based on infinitied stat and Teresa level",
      effect: () => 1 + Math.log10(Math.log10(player.infinitied)) * player.celestials.ra.level / 100
    },
    effect: () => _INFUPG_dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1)
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    description: "Decrease the number of Dimensions needed for Dimension Boosts and Antimatter Galaxies by 9",
    charged: {
      description: "Decrease Dimension Boost requirement scaling based on Teresa Effect",
      effect: () => Math.floor(1 + player.celestials.ra.level/50)
    },
    effect: () => 9
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    description: "Increase the multiplier for buying 10 Dimensions",
    charged: {
      description: "Multiplier for buying 10 Dimensions gains a power effect based on Teresa level",
      effect: () => 1 + Math.sqrt(player.celestials.ra.level)/500
    },
    effect: () => 1.1,
    formatEffect: () => "2x ➜ 2.2x",
    staticEffect: true,
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    description: "Galaxies are twice as effective",
    charged: {
      description: "Galaxies are more effective based on Teresa level",
      effect: () => 1 + player.celestials.ra.level / 100
    },
    effect: () => 2
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    description: "Normal Dimensions gain a multiplier based on time spent in current Infinity",
    charged: {
      description: "Normal Dimensions gain a power effect based on time spent in current infinity and Teresa level",
      effect: () => Math.log10(Math.log10(Time.thisInfinity.totalMilliseconds)) * player.celestials.ra.level / 150
    },
    effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    description: "Multiplier for unspent Infinity Points on 1st Dimension",
    charged: {
      description: "Multiplier for unspent Infinity Points on 1st Dimension, powered by Teresa level",
      effect: () => player.infinityPoints.dividedBy(2).pow(player.celestials.ra.level * 1.5 * 1.5)
    },
    effect: () => player.infinityPoints.dividedBy(2).pow(1.5).plus(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    description: "Increase Dimension Boost multiplier",
    charged: {
      description: "Dimension Boost multiplier power effect",
      effect: () => 1 + Math.sqrt(player.celestials.ra.level)/100
    },
    effect: () => 2.5,
    formatEffect: () => "2x ➜ 2.5x",
    staticEffect: true
  },
  ipGen: {
    id: "passiveGen",
    cost: 10,
    description: "Infinity Point generation based on fastest Infinity",
    charged: {
      description: "RM multiplier based on fastest reality (real time)",
      effect: () => Math.max(100 / (player.bestReality / 1000), 1)
    },
    // cutting corners: this is not actual effect (player.infMult is), but
    // it is totalIPMult that is displyed on upgrade
    effect: () => totalIPMult(),
    formatEffect: value => {
      const income = shorten(value, 2, 0);
      const period = player.bestInfinityTime >= 999999999999  ?
        "hundred or so years" :
        Time.bestInfinity.multiply(10);
      return `${income} every ${period}`;
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
  ipMult: {
    cost: () => player.infMultCost,
    costCap: new Decimal("1e6000000"),
    costIncreaseThreshold: new Decimal("1e3000000"),
    description: "Multiply Infinity Points from all sources by 2",
    effect: () => player.infMult,
    cap: new Decimal("1e1000000"),
    formatEffect: value => formatX(value, 2, 2)
  }
};

function _INFUPG_dimInfinityMult() {
  return 1 + (Player.totalInfinitied * 0.2);
}
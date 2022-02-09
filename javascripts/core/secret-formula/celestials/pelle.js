import { GameDatabase } from "../game-database.js";

GameDatabase.celestials.pelle = (function() {
  const rebuyable = props => {

    props.formatEffect = () => props._formatEffect(player.celestials.pelle.rebuyables[props.id]);
    props.cost = () => props._cost(player.celestials.pelle.rebuyables[props.id]);
    props.effect = () => props._effect(player.celestials.pelle.rebuyables[props.id]);
    props.formatCost = c => format(c, 2);

    return props;
  };
  return {
    rebuyables: {
      antimatterDimensionMult: rebuyable({
        id: "antimatterDimensionMult",
        description: `Gain a multiplier to Antimatter Dimensions`,
        _cost: x => Decimal.pow(10, x).times(Decimal.pow(1e3, x - 41).max(1)).times(100),
        _effect: x => Pelle.antimatterDimensionMult(x),
        _formatEffect: x => `${formatX(Pelle.antimatterDimensionMult(x), 2)} ➜ ` +
          `${formatX(Pelle.antimatterDimensionMult(x + 1), 2)}`,
        cap: 44
      }),
      timeSpeedMult: rebuyable({
        id: "timeSpeedMult",
        description: `Gain a multiplier to game speed`,
        _cost: x => Decimal.pow(20, x).times(Decimal.pow(1e3, x - 30).max(1)).times(1e5),
        _effect: x => Decimal.pow(1.3, x),
        _formatEffect: x => `${formatX(Decimal.pow(1.3, x), 2, 2)} ➜ ` +
          `${formatX(Decimal.pow(1.3, x + 1), 2, 2)}`,
        cap: 35
      }),
      glyphLevels: rebuyable({
        id: "glyphLevels",
        description: `Increase the Glyph level allowed in Pelle`,
        _cost: x => Decimal.pow(30, x).times(Decimal.pow(1e3, x - 25).max(1)).times(1e15),
        _effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
        _formatEffect: x => `${format(Math.floor(((3 * (x + 1)) - 2) ** 1.6), 2)} ➜ ` +
          `${format(Math.floor(((3 * (x + 2)) - 2) ** 1.6), 2)}`,
        cap: 26
      }),
      infConversion: rebuyable({
        id: "infConversion",
        description: `Increase Infinity Power conversion rate`,
        _cost: x => Decimal.pow(40, x).times(Decimal.pow(1e3, x - 20).max(1)).times(1e18),
        _effect: x => (x * 3.5) ** 0.37,
        _formatEffect: x => `+${format((x * 3.5) ** 0.37, 2, 2)} ➜ ` +
          `+${format(((x + 1) * 3.5) ** 0.37, 2, 2)}`,
        cap: 21
      }),
      galaxyPower: rebuyable({
        id: "galaxyPower",
        description: `Multiply Galaxy power`,
        _cost: x => Decimal.pow(1000, x).times(Decimal.pow(1e3, x - 10).max(1)).times(1e30),
        _effect: x => 1 + x / 50,
        _formatEffect: x => `${formatX(1 + x / 50, 2, 2)} ➜ ` +
          `${formatX(1 + (x + 1) / 50, 2, 2)}`,
        cap: 9
      }),
    },
    upgrades: {
      antimatterDimAutobuyers1: {
        id: 1,
        description: "Gain back autobuyers for Antimatter Dimensions 1-4",
        cost: 1e5,
        formatCost: c => format(c, 2),
      },
      dimBoostAutobuyer: {
        id: 2,
        description: "Gain back autobuyer for Dimension Boosts",
        cost: 5e5,
        formatCost: c => format(c, 2),
      },
      keepAutobuyers: {
        id: 3,
        description: "Keep your autobuyer upgrades on Armageddon",
        cost: 5e6,
        formatCost: c => format(c, 2),
      },
      antimatterDimAutobuyers2: {
        id: 4,
        description: "Gain back autobuyers for Antimatter Dimensions 5-8",
        cost: 2.5e7,
        formatCost: c => format(c, 2),
      },
      galaxyAutobuyer: {
        id: 5,
        description: "Gain back autobuyer for Antimatter Galaxies",
        cost: 1e8,
        formatCost: c => format(c, 2),
      },
      tickspeedAutobuyer: {
        id: 6,
        description: "Gain back autobuyer for Tickspeed",
        cost: 1e9,
        formatCost: c => format(c, 2),
      },
      keepInfinityUpgrades: {
        id: 7,
        description: "Keep Infinity Upgrades on Armageddon",
        cost: 1e10,
        formatCost: c => format(c, 2),
      },
      keepBreakInfinityUpgrades: {
        id: 8,
        description: "Keep Break Infinity Upgrades on Armageddon",
        cost: 1e12,
        formatCost: c => format(c, 2),
      },
      IDAutobuyers: {
        id: 9,
        description: "Gain Back Infinity Dimension Autobuyers",
        cost: 1e14,
        formatCost: c => format(c, 2),
      },
      keepInfinityChallenges: {
        id: 10,
        description: "You keep your Infinity Challenge completions through Armageddons",
        cost: 1e15,
        formatCost: c => format(c, 2),
      },
      replicantiAutobuyers: {
        id: 11,
        description: "Gain back Replicanti autobuyers",
        cost: 1e17,
        formatCost: c => format(c, 2),
      },
      replicantiGalaxyNoReset: {
        id: 12,
        description: "Replicanti Galaxies don't reset on Infinity",
        cost: 1e19,
        formatCost: c => format(c, 2),
      },
      eternitiesNoReset: {
        id: 13,
        description: "Eternities do not reset on Armageddon",
        cost: 1e20,
        formatCost: c => format(c, 2),
      },
      timeStudiesNoReset: {
        id: 14,
        description: "Time Studies and Theorems do not reset on Armageddon",
        cost: 1e21,
        formatCost: c => format(c, 2),
      },
      replicantiStayUnlocked: {
        id: 15,
        description: "Replicanti stays unlocked on Armageddon",
        cost: 1e22,
        formatCost: c => format(c, 2),
      },
      keepEternityUpgrades: {
        id: 16,
        description: "Keep Eternity Upgrades on Armageddon",
        cost: 1e24,
        formatCost: c => format(c, 2),
      },
      TDAutobuyers: {
        id: 17,
        description: "Gain Back Time Dimension Autobuyers",
        cost: 1e25,
        formatCost: c => format(c, 2),
      },
      keepEternityChallenges: {
        id: 18,
        description: "You keep your Eternity Challenge completions through Armageddons",
        cost: 1e26,
        formatCost: c => format(c, 2),
      },
      dimBoostResetsNothing: {
        id: 19,
        description: "Dimension Boosts no longer reset anything",
        cost: 1e50,
        formatCost: c => format(c, 2),
      },
    },
    strikes: {
      infinity: {
        id: 1,
        requirementDescription: "Reach Infinity",
        penaltyDescription: "Antimatter Dimensions are raised to power of 0.5",
        rewardDescription: "Unlock Famine",
        rift: () => PelleRifts.famine
      },
      powerGalaxies: {
        id: 2,
        requirementDescription: "Power-up Galaxies",
        penaltyDescription: "Infinity Dimensions are raised to power of 0.5",
        rewardDescription: "Unlock Pestilence",
        rift: () => PelleRifts.pestilence
      },
      eternity: {
        id: 3,
        requirementDescription: "Reach Eternity",
        penaltyDescription: "Replicanti speed scales harsher after 1e2000",
        rewardDescription: "Unlock Chaos",
        rift: () => PelleRifts.chaos
      },
      ECs: {
        id: 4,
        requirementDescription: "Reach 115 Time Theorems",
        penaltyDescription: "Famine IP multiplier is reduced in Eternity Challenges",
        rewardDescription: "Unlock War",
        rift: () => PelleRifts.war
      },
      dilation: {
        id: 5,
        requirementDescription: "Dilate Time",
        penaltyDescription: "Time Dilation is always active",
        rewardDescription: "Unlock Death",
        rift: () => PelleRifts.death
      }
    },
    rifts: {
      famine: {
        id: 1,
        key: "famine",
        name: "Famine",
        description: "When active, spends 3% of your IP per second to increase Famine.",
        effectDescription: x => `Multiplies Infinity Point gain by ${formatX(x, 2, 2)}`,
        strike: () => PelleStrikes.infinity,
        percentage: totalFill => Math.log10(totalFill.plus(1).log10() * 10 + 1) ** 2.5 / 100,
        percentageToFill: percentage => Decimal.pow(10,
          Decimal.pow(10, (percentage * 100) ** (1 / 2.5)).div(10).minus(0.1)
        ).minus(1),
        effect: totalFill => {
          if (player.challenge.eternity.current !== 0) {
            const chall = EternityChallenge.current;
            const goal = chall.goalAtCompletions(chall.gainedCompletionStatus.totalCompletions);
            return totalFill.plus(1).pow(0.1).min(goal.pow(0.15));
          }
          return totalFill.plus(1).pow(0.33);
        },
        currency: () => Currency.infinityPoints,
        milestones: [
          {
            requirement: 0.04,
            description: "You can equip a single basic Glyph with decreased level and rarity"
          },
          {
            requirement: 0.06,
            description: "Make Replicanti unlock and its upgrades 1e130x cheaper, and it's uncapped"
          },
          {
            requirement: 0.4,
            description: "Famine also affects EP gain",
            effect: () => Decimal.pow(4, PelleRifts.famine.totalFill.log10() / 2 / 308 + 3),
            formatEffect: x => formatX(x, 2, 2)
          },
        ]
      },
      pestilence: {
        id: 2,
        key: "pestilence",
        name: "Pestilence",
        spendable: true,
        description: "When active, spends 3% of your Replicanti per second to increase Pestilence.",
        effectDescription: x => `You gain Replicanti ${formatX(x, 2, 2)} faster`,
        strike: () => PelleStrikes.powerGalaxies,
        // 0 - 1
        percentage: totalFill => totalFill.plus(1).log10() * 0.05 / 100,
        // 0 - 1
        percentageToFill: percentage => Decimal.pow(10, 20 * percentage * 100).minus(1),
        effect: totalFill => (PelleRifts.chaos.hasMilestone(0)
          ? Decimal.sqrt(2000 + 1) : Decimal.sqrt(totalFill.plus(1).log10() + 1)),
        currency: () => Currency.replicanti,
        milestones: [
          {
            requirement: 0.2,
            description: "First rebuyable Pelle upgrade also powers the first Infinity Dimension",
            effect: () => {
              const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
              return Decimal.pow(1e50, x - 9);
            },
            formatEffect: x => formatX(x, 2)
          },
          {
            requirement: 0.6,
            description: "When Replicanti amount exceeds 1e1300, your Galaxies are 10% more effective"
          },
          {
            requirement: 1,
            description: "Increase max Replicanti Galaxies based on total Rift milestones",
            effect: () => {
              const x = PelleRifts.totalMilestones();
              return x ** 2 - 2 * x;
            },
            formatEffect: x => `+${format(x, 2)}`
          },
        ]
      },
      chaos: {
        id: 3,
        key: "chaos",
        name: "Chaos",
        description: "When active, spends 3% of your Pestilence per second to increase Chaos.",
        effectDescription: x => `Multiplies Time Dimensions by ${formatX(x, 2, 2)}`,
        strike: () => PelleStrikes.eternity,
        percentage: totalFill => totalFill.div(10).toNumber(),
        percentageToFill: percentage => new Decimal(percentage).times(10),
        effect: totalFill => {
          let fill = totalFill.toNumber();
          if (totalFill.gt(6.5)) fill = (totalFill.toNumber() - 6.5) / 7 + 6.5;
          return Decimal.pow(6, Decimal.pow(6, Decimal.pow(6, fill / 10 + 0.1)).minus(6))
            .div(1e5)
            .plus(Decimal.pow(10, fill / 10 + 0.1));
        },
        currency: () => ({
          get value() {
            return PelleRifts.pestilence.percentage;
          },
          set value(val) {
            const spent = PelleRifts.pestilence.percentage - val;
            player.celestials.pelle.rifts.pestilence.percentageSpent += spent;
          }
        }),
        milestones: [
          // It's just a tad under 10% because 10% takes a crapton of time
          {
            requirement: 0.0999,
            description: "Pestilence effect is always maxed and milestones always active"
          },
          {
            requirement: 0.15,
            description: () => {
              const base = "Gain a bonus based on Glyph equipped:";

              switch (Pelle.activeGlyphType) {
                case "infinity": return `${base} IP multiplier based on IP`;
                case "time": return `${base} EP multiplier based on EP`;
                case "replication": return `${base} Replicanti speed multiplier based on Famine`;
                case "dilation": return `${base} Dilated Time gain multiplier based on Tachyon Galaxies`;
                case "power": return `${base} Galaxies are 2% stronger`;
                case "companion": return `${base} You feel 34% better`;

                default: return `${base} no Glyph equipped!`;
              }
            },
            effect: () => {
              switch (Pelle.activeGlyphType) {
                case "infinity": return player.challenge.eternity.current > 8
                  ? 1 : Currency.infinityPoints.value.pow(0.2);
                case "time": return Currency.eternityPoints.value.plus(1).pow(0.3);
                case "replication": return 10 ** 53 ** (PelleRifts.famine.percentage);
                case "dilation": return Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1);
                case "power": return 1.02;
                case "companion": return 1.34;

                default: return new Decimal();
              }
            },
            formatEffect: x => formatX(x, 2, 2)
          },
          {
            requirement: 1,
            description: "You gain 1% of your EP gained on Eternity per second",
          },
        ]
      },
      war: {
        id: 4,
        key: "war",
        name: "War",
        description: "When active, spends 3% of your EP per second to increase War.",
        effectDescription: x => `Decrease EP formula exponent divider -${format(x, 2, 2)}`,
        strike: () => PelleStrikes.ECs,
        percentage: totalFill => totalFill.plus(1).log10() ** 0.4 / 4000 ** 0.4,
        percentageToFill: percentage => Decimal.pow(10, percentage ** 2.5 * 4000).minus(1),
        effect: totalFill => new Decimal(58 * totalFill.plus(1).log10() ** 0.2 / 4000 ** 0.2),
        currency: () => Currency.eternityPoints,
        milestones: [
          {
            requirement: 0.10,
            description: "Dimensional Boosts are more powerful based on EC completions",
            effect: () => Math.max(100 * EternityChallenges.completions ** 2, 1) *
              Math.max(1e4 ** (EternityChallenges.completions - 40), 1),
            formatEffect: x => formatX(x, 2, 2)
          },
          {
            requirement: 0.15,
            description: "Infinity Dimensions are stronger based on EC completions",
            effect: () => Decimal.pow("1e1500", ((EternityChallenges.completions - 25) / 20) ** 1.7).max(1),
            formatEffect: x => formatX(x)
          },
          {
            requirement: 1,
            description: "Unlock the Galaxy Generator",
          },
        ]
      },
      death: {
        id: 5,
        key: "death",
        name: "Death",
        description: "When active, spends 3% of your Dilated Time per second to increase Death.",
        effectDescription: x => `All Dimensions are raised to ${formatPow(x, 2, 3)}`,
        strike: () => PelleStrikes.dilation,
        percentage: totalFill => totalFill.plus(1).log10() / 100,
        percentageToFill: percentage => Decimal.pow10(percentage * 100).minus(1),
        effect: totalFill => new Decimal(1 + totalFill.plus(1).log10() * 0.004),
        currency: () => Currency.dilatedTime,
        milestones: [
          {
            requirement: 0.15,
            description: "Time Dimensions 5-8 are much cheaper, unlock more Dilation upgrades"
          },
          {
            requirement: 0.25,
            description: "Raise Tachyon Particle effect to Dilated Time gain to ^1.4",
          },
          {
            requirement: 0.5,
            description: "Dilation rebuyables multiply Infinity Power conversion rate",
            effect: () => Math.min(
              1.1 ** (Object.values(player.dilation.rebuyables).reduce((a, b) => a + b, 0) - 90),
              712
            ),
            formatEffect: x => formatX(x, 2, 2)
          },
        ]
      }
    },
    galaxyGeneratorUpgrades: {
      additive: rebuyable({
        id: "galaxyGeneratorAdditive",
        description: `Increase base Galaxy generation by 2`,
        _cost: x => Decimal.pow(3, x),
        _effect: x => x * 2,
        _formatEffect: x => `${format(x * 2, 2, 2)}/s`,
        currency: () => ({
          get value() {
            return player.galaxies + GalaxyGenerator.galaxies;
          },
          set value(val) {
            const spent = player.galaxies + GalaxyGenerator.galaxies - val;
            player.celestials.pelle.galaxyGenerator.spentGalaxies += spent;
          }
        }),
        currencyLabel: "Galaxy"
      }),
      multiplicative: rebuyable({
        id: "galaxyGeneratorMultiplicative",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow(10, x),
        _effect: x => Decimal.pow(2.5, x),
        _formatEffect: x => `${formatX(Decimal.pow(2.5, x), 2, 1)} ➜ ${formatX(Decimal.pow(2.5, x + 1), 2, 1)}`,
        currency: () => ({
          get value() {
            return player.galaxies + GalaxyGenerator.galaxies;
          },
          set value(val) {
            const spent = player.galaxies + GalaxyGenerator.galaxies - val;
            player.celestials.pelle.galaxyGenerator.spentGalaxies += spent;
          }
        }),
        currencyLabel: "Galaxy"
      }),
      antimatterMult: rebuyable({
        id: "galaxyGeneratorAntimatterMult",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow("1e100000000", 10 ** x),
        _effect: x => Decimal.pow(2, x),
        _formatEffect: x => `${formatX(Decimal.pow(2, x), 2)} ➜ ${formatX(Decimal.pow(2, x + 1), 2)}`,
        currency: () => Currency.antimatter,
        currencyLabel: "Antimatter"
      }),
      IPMult: rebuyable({
        id: "galaxyGeneratorIPMult",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow("1e2000000", 100 ** x),
        _effect: x => Decimal.pow(2, x),
        _formatEffect: x => `${formatX(Decimal.pow(2, x), 2)} ➜ ${formatX(Decimal.pow(2, x + 1), 2)}`,
        currency: () => Currency.infinityPoints,
        currencyLabel: "Infinity Point"
      }),
      EPMult: rebuyable({
        id: "galaxyGeneratorEPMult",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow("1e10000", 1000 ** x),
        _effect: x => Decimal.pow(2, x),
        _formatEffect: x => `${formatX(Decimal.pow(2, x), 2)} ➜ ${formatX(Decimal.pow(2, x + 1), 2)}`,
        currency: () => Currency.eternityPoints,
        currencyLabel: "Eternity Point"
      }),
    }
  };
}());
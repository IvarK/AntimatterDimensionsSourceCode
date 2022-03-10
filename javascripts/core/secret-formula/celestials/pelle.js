import { GameDatabase } from "../game-database.js";
import { DC } from "../../constants.js";

GameDatabase.celestials.pelle = (function() {
  const rebuyable = props => {

    props.formatEffect = () => props._formatEffect(player.celestials.pelle.rebuyables[props.id]);
    props.cost = () => props._cost(player.celestials.pelle.rebuyables[props.id]);
    props.effect = () => props._effect(player.celestials.pelle.rebuyables[props.id]);
    props.formatCost = c => format(c, 2);

    return props;
  };
  // eslint-disable-next-line max-params
  const expWithIncreasedScale = (base1, base2, incScale, coeff, x) =>
    Decimal.pow(base1, x).times(Decimal.pow(base2, x - incScale).max(1)).times(coeff);
  return {
    rebuyables: {
      antimatterDimensionMult: rebuyable({
        id: "antimatterDimensionMult",
        description: `Gain a multiplier to Antimatter Dimensions`,
        _cost: x => expWithIncreasedScale(10, 1e3, 41, 100, x),
        _effect: x => Pelle.antimatterDimensionMult(x),
        _formatEffect: x => formatX(x, 2, 2),
        cap: 44
      }),
      timeSpeedMult: rebuyable({
        id: "timeSpeedMult",
        description: `Gain a multiplier to game speed`,
        _cost: x => expWithIncreasedScale(20, 1e3, 30, 1e5, x),
        _effect: x => Decimal.pow(1.3, x),
        _formatEffect: x => formatX(x, 2, 2),
        cap: 35
      }),
      glyphLevels: rebuyable({
        id: "glyphLevels",
        description: `Increase the Glyph level allowed in Pelle`,
        _cost: x => expWithIncreasedScale(30, 1e3, 25, 1e15, x),
        _effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
        _formatEffect: x => formatInt(x),
        cap: 26
      }),
      infConversion: rebuyable({
        id: "infConversion",
        description: `Increase Infinity Power conversion rate`,
        _cost: x => expWithIncreasedScale(40, 1e3, 20, 1e18, x),
        _effect: x => (x * 3.5) ** 0.37,
        _formatEffect: x => `+${format(x, 2, 2)}`,
        cap: 21
      }),
      galaxyPower: rebuyable({
        id: "galaxyPower",
        description: `Multiply Galaxy power`,
        _cost: x => expWithIncreasedScale(1000, 1e3, 10, 1e30, x),
        _effect: x => 1 + x / 50,
        _formatEffect: x => formatX(x, 2, 2),
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
        penaltyDescription: () => `Antimatter Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
        rewardDescription: "Unlock Famine",
        rift: () => PelleRifts.famine
      },
      powerGalaxies: {
        id: 2,
        requirementDescription: "Power-up Galaxies",
        penaltyDescription: () => `Infinity Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
        rewardDescription: "Unlock Pestilence",
        rift: () => PelleRifts.pestilence
      },
      eternity: {
        id: 3,
        requirementDescription: "Reach Eternity",
        penaltyDescription: () => `Replicanti speed scales harsher after ${format(DC.E2000)}`,
        rewardDescription: "Unlock Chaos",
        rift: () => PelleRifts.chaos
      },
      ECs: {
        id: 4,
        requirementDescription: () => `Reach ${formatInt(115)} Time Theorems`,
        penaltyDescription: "Famine IP multiplier is reduced in Eternity Challenges",
        rewardDescription: "Unlock War",
        rift: () => PelleRifts.war
      },
      dilation: {
        id: 5,
        requirementDescription: "Dilate Time",
        penaltyDescription: "Time Dilation nerfs are always active",
        rewardDescription: "Unlock Death",
        rift: () => PelleRifts.death
      }
    },
    rifts: {
      famine: {
        id: 1,
        key: "famine",
        name: "Famine",
        drainResource: "IP",
        baseEffect: x => `IP gain ${formatX(x, 2, 2)}`,
        additionalEffects: () => (PelleRifts.famine.hasMilestone(2)
          ? [`EP gain ${formatX(PelleRifts.famine.milestones[2].effect(), 2, 2)}`]
          : []),
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
            description: () => "You can equip a single basic Glyph with decreased level and rarity"
          },
          {
            requirement: 0.06,
            description: () => `Uncap Replicanti and make its unlock and upgrades ${formatX(1e130)} cheaper`
          },
          {
            requirement: 0.4,
            description: () => "Famine also affects EP gain",
            effect: () => Decimal.pow(4, PelleRifts.famine.totalFill.log10() / 2 / 308 + 3),
          },
        ]
      },
      pestilence: {
        id: 2,
        key: "pestilence",
        name: "Pestilence",
        drainResource: "Replicanti",
        spendable: true,
        baseEffect: x => `Replicanti speed ${formatX(x, 2, 2)}`,
        additionalEffects: () => {
          const effects = [];
          if (PelleRifts.pestilence.hasMilestone(0)) {
            effects.push(`1st Infinity Dimension ${formatX(PelleRifts.pestilence.milestones[0].effect(), 2, 2)}`);
          }
          if (PelleRifts.pestilence.hasMilestone(2)) {
            effects.push(`Max RG count +${formatInt(PelleRifts.pestilence.milestones[2].effect())}`);
          }
          return effects;
        },
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
            description: () => "First rebuyable Pelle upgrade also affects 1st Infinity Dimension",
            effect: () => {
              const x = player.celestials.pelle.rebuyables.antimatterDimensionMult;
              return Decimal.pow(1e50, x - 9);
            },
          },
          {
            requirement: 0.6,
            description: () => `When Replicanti exceeds ${format(DC.E1300)},
              Galaxies are ${formatPercents(0.1)} more effective`
          },
          {
            requirement: 1,
            description: () => "Increase max Replicanti Galaxies based on total Rift milestones",
            effect: () => {
              const x = PelleRifts.totalMilestones();
              return x ** 2 - 2 * x;
            },
          },
        ]
      },
      chaos: {
        id: 3,
        key: "chaos",
        name: "Chaos",
        drainResource: "Pestilence",
        baseEffect: x => `Time Dimensions ${formatX(x, 2, 2)}`,
        additionalEffects: () => [],
        strike: () => PelleStrikes.eternity,
        percentage: totalFill => totalFill / 10,
        percentageToFill: percentage => 10 * percentage,
        effect: totalFill => {
          const fill = totalFill > 6.5
            ? (totalFill - 6.5) / 7 + 6.5
            : totalFill;
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
          {
            requirement: 0.09,
            description: () => "Pestilence effect is always maxed and milestones always active"
          },
          {
            requirement: 0.15,
            description: () => "Glyphs gain a new Pelle-specific effect",
          },
          {
            requirement: 1,
            description: () => `You gain ${formatPercents(0.01)} of your EP gained on Eternity per second`,
          },
        ]
      },
      war: {
        id: 4,
        key: "war",
        name: "War",
        drainResource: "EP",
        baseEffect: x => `EP formula: log(x/${formatInt(308)}) ➜ log(x/${formatFloat(308 - x.toNumber(), 2)})`,
        additionalEffects: () => {
          const effects = [];
          if (PelleRifts.war.hasMilestone(0)) {
            effects.push(`Dimension Boost power ${formatX(PelleRifts.war.milestones[0].effect(), 2, 2)}`);
          }
          if (PelleRifts.war.hasMilestone(1)) {
            effects.push(`Infinity Dimensions ${formatX(PelleRifts.war.milestones[1].effect())}`);
          }
          return effects;
        },
        strike: () => PelleStrikes.ECs,
        percentage: totalFill => totalFill.plus(1).log10() ** 0.4 / 4000 ** 0.4,
        percentageToFill: percentage => Decimal.pow(10, percentage ** 2.5 * 4000).minus(1),
        effect: totalFill => new Decimal(58 * totalFill.plus(1).log10() ** 0.2 / 4000 ** 0.2),
        currency: () => Currency.eternityPoints,
        milestones: [
          {
            requirement: 0.10,
            description: () => "Dimensional Boosts are more powerful based on EC completions",
            effect: () => Math.max(100 * EternityChallenges.completions ** 2, 1) *
              Math.max(1e4 ** (EternityChallenges.completions - 40), 1),
          },
          {
            requirement: 0.15,
            description: () => "Infinity Dimensions are stronger based on EC completions",
            effect: () => Decimal.pow("1e1500", ((EternityChallenges.completions - 25) / 20) ** 1.7).max(1),
          },
          {
            requirement: 1,
            description: () => "Unlock the Galaxy Generator",
          },
        ]
      },
      death: {
        id: 5,
        key: "death",
        name: "Death",
        drainResource: "Dilated Time",
        baseEffect: x => `All Dimensions ${formatPow(x, 2, 3)}`,
        additionalEffects: () => (PelleRifts.death.hasMilestone(2)
          ? [`Infinity Power Conversion ${formatX(PelleRifts.death.milestones[2].effect(), 2, 2)}`]
          : []),
        strike: () => PelleStrikes.dilation,
        percentage: totalFill => totalFill.plus(1).log10() / 100,
        percentageToFill: percentage => Decimal.pow10(percentage * 100).minus(1),
        effect: totalFill => new Decimal(1 + totalFill.plus(1).log10() * 0.004),
        currency: () => Currency.dilatedTime,
        milestones: [
          {
            requirement: 0.15,
            description: () => "Time Dimensions 5-8 are much cheaper, unlock more dilation upgrades"
          },
          {
            requirement: 0.25,
            description: () => `Raise Tachyon Particle effect to Dilated Time gain to ${formatPow(1.4, 1, 1)}`,
          },
          {
            requirement: 0.5,
            description: () => "Dilation rebuyable purchase count improves Infinity Power conversion rate",
            effect: () => Math.min(
              1.1 ** (Object.values(player.dilation.rebuyables).reduce((a, b) => a + b, 0) - 90),
              712
            ),
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
        _formatEffect: x => `${format(x, 2, 2)}/s`,
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
        _formatEffect: x => formatX(x, 2, 1),
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
        _formatEffect: x => formatX(x, 2),
        currency: () => Currency.antimatter,
        currencyLabel: "Antimatter"
      }),
      IPMult: rebuyable({
        id: "galaxyGeneratorIPMult",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow("1e2000000", 100 ** x),
        _effect: x => Decimal.pow(2, x),
        _formatEffect: x => formatX(x, 2),
        currency: () => Currency.infinityPoints,
        currencyLabel: "Infinity Point"
      }),
      EPMult: rebuyable({
        id: "galaxyGeneratorEPMult",
        description: `Multiply Galaxy generation`,
        _cost: x => Decimal.pow("1e10000", 1000 ** x),
        _effect: x => Decimal.pow(2, x),
        _formatEffect: x => formatX(x, 2),
        currency: () => Currency.eternityPoints,
        currencyLabel: "Eternity Point"
      }),
    }
  };
}());
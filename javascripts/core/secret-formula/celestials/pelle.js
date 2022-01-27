import { GameDatabase } from "../game-database.js";

GameDatabase.celestials.pelle = (function() {
  const rebuyable = props => {

    props.formatEffect = () => props._formatEffect(player.celestials.pelle.rebuyables[props.id]);
    props.cost = () => props._cost(player.celestials.pelle.rebuyables[props.id]);
    props.effect = () => props._effect(player.celestials.pelle.rebuyables[props.id]);

    return props;
  };
  return {
    rebuyables: {
      antimatterDimensionMult: rebuyable({
        id: "antimatterDimensionMult",
        description: `Gain a multiplier to Antimatter Dimensions`,
        _cost: x => Decimal.pow(10, x).times(100),
        _effect: x => Pelle.antimatterDimensionMult(x),
        _formatEffect: x => `${formatX(Pelle.antimatterDimensionMult(x), 2)} ➜ ` +
          `${formatX(Pelle.antimatterDimensionMult(x + 1), 2)}`
      }),
      timeSpeedMult: rebuyable({
        id: "timeSpeedMult",
        description: `Gain a multiplier to time speed`,
        _cost: x => Decimal.pow(20, x).times(1e5),
        _effect: x => Decimal.pow(1.3, x),
        _formatEffect: x => `${formatX(Decimal.pow(1.3, x), 2, 2)} ➜ ` +
          `${formatX(Decimal.pow(1.3, x + 1), 2, 2)}`
      }),
      glyphLevels: rebuyable({
        id: "glyphLevels",
        description: `Increase the glyph level allowed in Pelle`,
        _cost: x => Decimal.pow(30, x).times(1e15),
        _effect: x => Math.max(x * 5, 1),
        _formatEffect: x => `${format(Math.max(x * 5, 1), 2)} ➜ ` +
          `${format(Math.max((x + 1) * 5, 1), 2)}`
      }),
      infConversion: rebuyable({
        id: "infConversion",
        description: `Increase infinity power conversion rate`,
        _cost: x => Decimal.pow(40, x).times(1e20),
        _effect: x => Math.sqrt(x),
        _formatEffect: x => `+${format(Math.sqrt(x), 2, 2)} ➜ ` +
          `+${format(Math.sqrt(x + 1), 2, 2)}`
      }),
      galaxyPower: rebuyable({
        id: "galaxyPower",
        description: `Multiply galaxy power`,
        _cost: x => Decimal.pow(50, x).times(1e30),
        _effect: x => 1 + x / 10,
        _formatEffect: x => `${formatX(1 + x / 10, 2, 2)} ➜ ` +
          `${formatX(1 + (x + 1) / 10, 2, 2)}`
      }),
    },
    upgrades: {
      antimatterDimAutobuyers1: {
        id: 1,
        description: "Gain back autobuyers for Antimatter Dimensions 1-4",
        cost: 1000,
      },
      dimBoostAutobuyer: {
        id: 2,
        description: "Gain back autobuyer for Dimension Boosts",
        cost: 1e5,
      },
      antimatterDimAutobuyers2: {
        id: 3,
        description: "Gain back autobuyers for Antimatter Dimensions 5-8",
        cost: 1e8,
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
      breakInfinity: {
        id: 2,
        requirementDescription: "Break Infinity",
        penaltyDescription: "Antimatter Galaxies are only 30% as effective",
        rewardDescription: "Unlock Pestilence",
        rift: () => PelleRifts.pestilence
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
        effect: totalFill => totalFill.pow(0.3),
        currency: () => Currency.infinityPoints,
        milestones: [
          {
            requirement: 0.1,
            description: "You can equip a single glyph with decreased level and rarity"
          },
          {
            requirement: 0.4,
            description: "You can Eat Ass"
          },
          {
            requirement: 1,
            description: "You can code IE11 compliant code"
          },
        ]
      },
      pestilence: {
        id: 2,
        key: "pestilence",
        name: "Pestilence",
        strike: () => PelleStrikes.breakInfinity
      }
    }
  };
}());
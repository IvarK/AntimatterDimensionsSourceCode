"use strict";

GameDatabase.challenges.normal = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description: "Reach Infinity for the first time.",
    name: "First Dimension Autobuyer",
    reward: "Upgradeable First Dimension Autobuyer interval"
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description: () => `Buying anything halts your production, gradually coming back over ${formatInt(3)} minutes.`,
    name: "Second Dimension Autobuyer",
    reward: "Upgradeable Second Dimension Autobuyer interval"
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description: "The 1st Dimension is heavily weakened but gets " +
      "an exponentially increasing bonus that resets on reset.",
    name: "Third Dimension Autobuyer",
    reward: "Upgradeable Third Dimension Autobuyer interval"
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: "Buying a dimension automatically erases all lower tier dimensions, " +
      "like a sacrifice without the boost.",
    name: "Fourth Dimension Autobuyer",
    reward: "Upgradeable Fourth Dimension Autobuyer interval"
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description: () => `Tickspeed starts at ${formatPercents(0.07)}.`,
    name: "Fifth Dimension Autobuyer",
    reward: "Upgradeable Fifth Dimension Autobuyer interval"
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => `Each dimension costs the dimension ${formatInt(2)} before it, ` +
      "instead of antimatter. Dimension prices are modified.",
    name: "Sixth Dimension Autobuyer",
    reward: "Upgradeable Sixth Dimension Autobuyer interval"
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () => `The multiplier from buying ${formatInt(10)} dimensions is reduced to ${formatX(1)}, ` +
      `but is increased by ${formatX(0.2, 1, 1)} per Dimension Shift/Boost, up to a maximum of ${formatX(2)}.`,
    name: "Seventh Dimension Autobuyer",
    reward: "Upgradeable Seventh Dimension Autobuyer interval"
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: "Dimension Boosts and galaxies are useless, " +
      "sacrifice is immensely stronger but resets everything except tickspeed.",
    name: "Eighth Dimension Autobuyer",
    reward: "Upgradeable Eighth Dimension Autobuyer interval"
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `Whenever you buy ${formatInt(10)} of a dimension or tickspeed, ` +
      "everything else of equal cost will increase to its next cost step.",
    name: "Tickspeed Autobuyer",
    reward: "Upgradeable Tickspeed Autobuyer interval"
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => `There are only ${formatInt(6)} dimensions, with Dimension Boost and Antimatter Galaxy costs modified.`,
    name: "Automated Dimension Boosts",
    reward: "Automated Dimension Boosts"
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => `There's normal matter which rises once you have at least ${formatInt(1)} 2nd Dimension. ` +
      "If it exceeds your antimatter, it will Dimension Boost without giving the bonus.",
    name: "Automated Antimatter Galaxies",
    reward: "Automated Antimatter Galaxies"
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => `Each dimension produces the dimension ${formatInt(2)} below it (1st Dimensions still ` +
      "produce antimatter). Dimensions 2, 4, and 6 are made stronger to compensate.",
    name: "Automated Big Crunches",
    reward: "Automated Big Crunches"
  }
];
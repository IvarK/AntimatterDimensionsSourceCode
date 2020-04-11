"use strict";

GameDatabase.challenges.normal = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description: "Reach Infinity for the first time.",
    reward: "First Dimension Autobuyer"
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description: "Buying anything halts your production, gradually coming back over 3 minutes.",
    reward: "Second Dimension Autobuyer"
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description: "The 1st Dimension is heavily weakened but gets " +
      "an exponentially increasing bonus that resets on reset.",
    reward: "Third Dimension Autobuyer"
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: "Buying a dimension automatically erases all lower tier dimensions, " +
      "like a sacrifice without the boost.",
    reward: "Fourth Dimension Autobuyer"
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description: "Tickspeed starts at 7%.",
    reward: "Fifth Dimension Autobuyer"
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: "Each dimension costs the dimension 2 before it, " +
      "instead of antimatter. Dimension prices are modified.",
    reward: "Sixth Dimension Autobuyer"
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: "The multiplier from buying 10 dimensions is reduced to 1x, but is increased by 0.2x per " +
      "Dimension Shift/Boost, up to a maximum of 2x.",
    reward: "Seventh Dimension Autobuyer"
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: "Dimension Boosts and galaxies are useless, " +
      "sacrifice is immensely stronger but resets everything except tickspeed.",
    reward: "Eighth Dimension Autobuyer"
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: "Whenever you buy 10 of a dimension or tickspeed, " +
      "everything else of equal cost will increase to its next cost step.",
    reward: "Tickspeed Autobuyer"
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: "There are only 6 dimensions, with Dimension Boost and Antimatter Galaxy costs modified.",
    reward: "Automated Dimension Boosts"
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: "There's normal matter which rises once you have at least 1 2nd Dimension. " +
      "If it exceeds your antimatter, it will Dimension Boost without giving the bonus.",
    reward: "Automated Antimatter Galaxies"
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: "Each dimension produces the dimension 2 below it (1st Dimensions still " +
      "produce antimatter). Dimensions 2, 4, and 6 are made stronger to compensate.",
    reward: "Automated Big Crunches"
  }
];
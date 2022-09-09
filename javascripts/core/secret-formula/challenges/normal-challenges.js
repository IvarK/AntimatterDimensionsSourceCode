import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

// I tried to make it relatively simple to add more locks; the idea is that you give it a value here
// and then it's all handled in the backend
// If you need to lock a challenge, set lockedAt to a new Decimal variable reflective of a desired number of Infinities
// They will always be unlocked post-eternity

GameDatabase.challenges.normal = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      return PlayerProgress.eternityUnlocked()
        ? "reach Infinity for the first time outside of a challenge."
        : "reach Infinity for the first time.";
    },
    name: "1st Antimatter Dimension Autobuyer",
    reward: "Upgradeable 1st Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    description:
      () => "buying Antimatter Dimensions or Tickspeed upgrades halts your production, " +
      `gradually coming back over ${formatInt(3)} minutes.`,
    name: "2nd Antimatter Dimension Autobuyer",
    reward: "Upgradeable 2nd Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description:
      `the 1st Antimatter Dimension is heavily weakened, but gets an exponentially increasing
      bonus that resets after Dimension Boosts and Antimatter Galaxies.`,
    name: "3rd Antimatter Dimension",
    reward: "Upgradeable 3rd Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    description: "buying an Antimatter Dimension automatically erases all lower tier Antimatter Dimensions, " +
      "like a sacrifice without the boost.",
    name: "4th Antimatter Dimension Autobuyer",
    reward: "Upgradeable 4th Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
      () => `the Tickspeed purchase multiplier starts at ${formatX(1.080, 0, 3)} instead of ${formatX(1.1245, 0, 3)}.`,
    name: "5th Antimatter Dimension Autobuyer",
    reward: "Upgradeable 5th Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    description: () => `each Antimatter Dimension costs the dimension ${formatInt(2)} dimensions below it, ` +
      "instead of antimatter. Antimatter Dimension prices are modified.",
    name: "6th Antimatter Dimension Autobuyer",
    reward: "Upgradeable 6th Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
      `the multiplier from buying ${formatInt(10)} Antimatter Dimensions is reduced to ${formatX(1)}, but is increased
      by ${formatX(0.2, 1, 1)} per Dimension Boost, up to a maximum of ${formatX(2)}.`,
    name: "7th Antimatter Dimension Autobuyer",
    reward: "Upgradeable 7th Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    description: "Dimension Boosts provide no boost and Antimatter Galaxies cannot be bought, but " +
      "Dimensional Sacrifice is significantly stronger and resets antimatter and all Antimatter Dimensions.",
    name: "8th Antimatter Dimension Autobuyer",
    reward: "Upgradeable 8th Antimatter Dimension Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `whenever you buy Tickspeed upgrades, or ${formatInt(10)} of an Antimatter Dimension, ` +
      "everything else of equal cost will increase to its next cost step.",
    name: "Tickspeed Autobuyer",
    reward: "Upgradeable Tickspeed Autobuyer",
    lockedAt: DC.D0,
    isDisabledInDoomed: true,
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    description: () => (`there are only ${formatInt(6)} Antimatter Dimensions, with Dimension Boost ` +
      "and Antimatter Galaxy costs modified."),
    name: "Automated Dimension Boosts",
    reward: "Dimension Boosts Autobuyer",
    lockedAt: DC.D16,
    isDisabledInDoomed: true,
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => (`there's normal matter which rises once you have at least ${formatInt(1)} 2nd Antimatter ` +
      "Dimension. If it exceeds your antimatter, it will Dimension Boost without giving the bonus."),
    name: "Automated Antimatter Galaxies",
    reward: "Antimatter Galaxies Autobuyer",
    lockedAt: DC.D16,
    isDisabledInDoomed: true,
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => (`each Antimatter Dimension produces the dimension ${formatInt(2)} dimensions below it (1st ` +
      "Antimatter Dimensions still produce antimatter). The 2nd, 4th, and 6th Antimatter Dimensions " +
      "are made stronger to compensate."),
    name: "Automated Big Crunches",
    reward: "Big Crunches Autobuyer",
    lockedAt: DC.D16,
  }
];

import { DC } from "../constants";

export const catchupResources = [
  {
    name: "Antimatter Dimensions",
    id: 0,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Every Antimatter Dimension continuously produces Dimensions of the next tier down. The lowest
      Antimatter Dimension produces antimatter.`
  },
  {
    name: "Tickspeed Upgrades",
    id: 1,
    openH2pEntry: "Tickspeed",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Tickspeed Upgrades make Antimatter Dimensions produce other Antimatter Dimensions or antimatter
      as if time were passing faster.`
  },
  {
    name: "Autobuyers",
    id: 2,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Autobuyers are a built-in feature to the game which purchases upgrades for your Antimatter
      Dimensions automatically when you can afford them.`
  },
  {
    name: "Dimension Boosts",
    id: 3,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Dimension Boosts are gained by resetting all your Antimatter Dimensions and tickspeed after
      reaching a certain amount of the highest available Antimatter Dimension. They provide a multiplier to your
      Antimatter Dimensions.`
  },
  {
    name: "Antimatter Galaxies",
    id: 4,
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Antimatter Galaxies are gained by resetting your Antimatter Dimensions and Dimension Boosts. They
      improve the effectiveness of your Tickspeed Upgrades in a compounding way.`
  },
  {
    name: "Infinity",
    id: 5,
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: () => `Infinity is the first main reset layer. Reaching ${format(Number.MAX_VALUE, 2)} antimatter
      allows you to reset everything up to this point in exchange for unlocking new content and resources.`
  },
  {
    name: "Infinity Points",
    id: 6,
    openH2pEntry: "Infinity",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: `Infinity Points are the primary resource after completing your first Infinity. They can be spent on
      features which persist through Infinity resets.`
  },
  {
    name: "Normal Challenges",
    id: 7,
    openH2pEntry: "Normal Challenges",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: () => `Challenges require you to reach ${format(Number.MAX_VALUE, 2)} antimatter under more difficult
      conditions. Completing challenges allows you to upgrade your Autobuyers.`
  },
  {
    name: "Break Infinity",
    id: 8,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: () => `Upgrading your Big Crunch Autobuyer to the maximum allows you to surpass
      ${format(Number.MAX_VALUE, 2)} antimatter, giving increasing amounts of Infinity Points with more antimatter.`
  },
  {
    name: "Infinity Dimensions",
    id: 9,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: `Infinity Dimensions Produce in a cascading fashion like Antimatter Dimensions. The lowest tier of
      Infinity Dimension produces Infinity Power, which applies a large multiplier to all Antimatter Dimensions.`
  },
  {
    name: "Infinity Challenges",
    id: 10,
    requiredStage: PROGRESS_STAGE.BREAK_INFINITY,
    description: () => `Infinity Challenges are new challenges with an antimatter goal above
      ${format(Number.MAX_VALUE, 2)}. Completing them rewards upgrades and production boosts.`
  },
  {
    name: "Replicanti",
    id: 11,
    requiredStage: PROGRESS_STAGE.REPLICANTI,
    description: () => `Replicanti is a resource which produces itself over time, giving a multiplier to all
      Infinity Dimensions. At ${format(Number.MAX_VALUE, 2)} Replicanti, they can be reset to ${formatInt(1)} for an
      additional Galaxy which does not increase the cost of Antimatter Galaxies. They also reset after every Infinity.`
  },
  {
    name: "Eternity",
    id: 12,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: () => `Eternity is the second main reset layer. Reaching ${format(Number.MAX_VALUE, 2)} Infinity Points
      allows you to reset everything up to this point for access to new content and resources.`
  },
  {
    name: "Eternity Points",
    id: 13,
    openH2pEntry: "Eternity",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Eternity Points are the primary resource after completing your first Eternity, and scale based on your
      Infinity Points at the time you complete the Eternity.`
  },
  {
    name: "Time Studies",
    id: 14,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Time Studies are a set of upgrades akin to a skill tree, and can be freely re-allocated after every
      Eternity with no resource loss. Some sections of the tree have restrictions which forbid you from choosing
      particular studies simultaneously.`
  },
  {
    name: "Eternity Milestones",
    id: 15,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Eternity Milestones are forms of built-in automation and convenience which are unlocked simply by
      completing more Eternities. Unlocking them does not require spending any resources.`
  },
  {
    name: "Time Dimensions",
    id: 16,
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Time Dimensions also produce each other in a cascading manner, with the lowest tier producing Time
      Shards. Time Shards give you additional Tickspeed Upgrades which do not increase the cost of the Tickspeed
      Upgrades purchased with antimatter.`
  },
  {
    name: "Eternity Challenges",
    id: 17,
    requiredStage: PROGRESS_STAGE.ETERNITY_CHALLENGES,
    description: `Eternity Challenges are modified Eternities with an Infinity Point goal which must be reached for
      completion. They can be completed up to five times, getting more difficult each repetition in exchange for
      increasingly powerful rewards.`
  },
  {
    name: "Time Dilation",
    id: 18,
    requiredStage: PROGRESS_STAGE.EARLY_DILATION,
    description: () => `Time Dilation is a modified Eternity where tickspeed and all Dimension multipliers are
      severely reduced. Completing Dilated Eternities gives Tachyon Particles.`
  },
  {
    name: "Tachyon Particles",
    id: 19,
    openH2pEntry: "Time Dilation",
    requiredStage: PROGRESS_STAGE.EARLY_DILATION,
    description: () => `Tachyon Particles are a resource which cannot be farmed and require you to get a higher amount
      of antimatter in a Dilated Eternity in order to increase your amount. Tachyon Particles produce Dilated Time.`
  },
  {
    name: "Reality",
    id: 20,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: () => `Reality is the third and final main reset layer. Reaching ${format(DC.E4000)} Eternity Points
      gives you the option to reset everything up to this point in exchange for unlocking new content and gaining
      access to new resources.`
  },
  {
    name: "Reality Machines",
    id: 21,
    openH2pEntry: "Reality",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `Reality Machines are the primary resource after completing your first Reality. They are given based
      on Eternity Points at the time of completing a Reality.`
  },
  {
    name: "Perks",
    id: 22,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `Perks are unlockable features similar to Eternity Milestones which primarily focus on convenience and
      automation. They are purchased using Perk Points, which are gained after every Reality.`
  },
  {
    name: "Glyphs",
    id: 23,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `Glyphs are equippable upgrades which can only be unequipped between Realities. Every Reality you are
      allowed to choose one of multiple new random Glyphs to receive; the average quality of your available choices
      is determined by how high some of your resources reached in that Reality.`
  },
  {
    name: "Automator",
    id: 24,
    openH2pEntry: "Automator Overview",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `The Automator is a built-in feature that uses a scripting language that allows you to eventually
      finish Realities completely hands-off with enough upgrades and perks.`
  },
  {
    name: "Black Hole",
    id: 25,
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `The Black Hole runs the entire game faster in a periodic cycle. This affects everything in the game up
      to this point and will give similar results to leaving the game open for an equivalent amount of time.`
  },
  {
    name: "Teresa",
    id: 26,
    requiredStage: PROGRESS_STAGE.TERESA,
    description: `Teresa is the first Celestial, who has a more difficult Reality which gives a massive boost to Glyph
      Sacrifice depending upon completion. They unlock upgrades which focus on testing and automating Realities more
      easily.`
  },
  {
    name: "Effarig",
    id: 27,
    requiredStage: PROGRESS_STAGE.EFFARIG,
    description: `Effarig is the second Celestial, whose Reality limits your Glyphs and has scaling nerfs but gives
      rewards for each new reset layer reached. They unlock upgrades which focus on automatically selecting and
      filtering the large number of Glyphs you are receiving, purchased with a new resource called Relic Shards.`
  },
  {
    name: "The Nameless Ones",
    id: 28,
    openH2pEntry: "Nameless Ones",
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: `The Nameless Ones are the third Celestial, whose Reality is extremely punishing with a long list of
      nerfs, but unlocks Tesseracts for those who can figure out how to prevail. They also modify your Black Hole to
      allow it to store time.`
  },
  {
    name: "Stored Time",
    id: 29,
    openH2pEntry: "Nameless Ones",
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: `Your Black Hole has the ability to store time in two ways. Charging it allows you to hold on to
      sped-up time and release it later as a single skip-forward burst. Storing real time lets you use actual time
      to simulate Realities (giving you the resources of that Reality but multiplied), or as a stand-in for
      offline progress.`
  },
  {
    name: "Tesseracts",
    id: 30,
    requiredStage: PROGRESS_STAGE.ENSLAVED,
    description: `Infinity Dimensions cannot be purchased indefinitely and all but the 8th have a hard limit for how
      many times they can be purchased. Each Tesseract permanently increases this limit by a large amount.`
  },
  {
    name: "V",
    id: 31,
    requiredStage: PROGRESS_STAGE.V,
    description: `V is the fourth Celestial, with a modified Reality which is similar to Teresa's Reality but only gives
      rewards by reaching certain milestones of resources within. They give a new resource called Space Theorems, which
      allow you to purchase additional Time Studies without path restrictions.`
  },
  {
    name: "Ra",
    id: 32,
    requiredStage: PROGRESS_STAGE.RA,
    description: `Ra is the fifth Celestial, with a modified Reality which produces a resource called Memory Chunks
      based on your resource totals within. They focus highly on taking older upgrades and themes from the previous
      four Celestials and improving upon them, as well as filling out some final gaps in automation and convenience.`
  },
  {
    name: "Memories",
    id: 33,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: `Ra has the previous four Celestials under their control, producing Memories over time based on Memory
      Chunk count. These Memories are used to level up the previous Celestials, providing upgrades when certain levels
      are reached.`
  },
  {
    name: "Charged Infinity Upgrades",
    id: 34,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: `Teresa's Memories allow you to charge your Infinity Upgrades, maintaining a similar effect but
      strengthening them significantly. Which upgrades are charged can only be changed between Realities.`
  },
  {
    name: "Glyph Alchemy",
    id: 35,
    requiredStage: PROGRESS_STAGE.RA,
    description: `Effarig's Memories unlock Glyph Alchemy, which gives many minor boosts using a modified version of
      Glyph Sacrifice. The resources gained from giving up Glyphs in this way must be combined together in reactions
      in order to fully upgrade their effects.`
  },
  {
    name: "Amplified Black Hole",
    id: 36,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: `Nameless's Memories amplify charging so that the amount of game time stored is larger than the actual
      game time elapsed. Discharging can now also be done repeatedly and automatically.`
  },
  {
    name: "Harder V",
    id: 37,
    openH2pEntry: "Ra",
    requiredStage: PROGRESS_STAGE.RA,
    description: `V's Memories unlocks a modified version of V's original Reality with even harder goals and a new set
      of Time Studies called Triad Studies.`
  },
  {
    name: "Imaginary Machines",
    id: 38,
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: () => `Imaginary Machines are a new resource unlocked when reaching ${format(DC.E1000)} Reality
      Machines. They are produced passively up to a cap determined by how many Reality Machines you would have gotten
      in your farthest Reality ever.`
  },
  {
    name: "Lai'tela",
    id: 39,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: `Lai'tela is the sixth Celestial, whose Reality has a modified completion condition and gives a
      scaling reward based on how quickly you can reach it. They unlock new features largely related to a resource
      called Dark Matter.`
  },
  {
    name: "Continuum",
    id: 40,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: `Continuum is a modified type of production which allows your Antimatter Dimensions to produce as if
      they could purchase fractional amounts of upgrades, without actually purchasing them.`
  },
  {
    name: "Dark Matter Dimensions",
    id: 41,
    openH2pEntry: "Lai'tela",
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: `Dark Matter Dimensions are cascading production which operate on a tick-based system instead of
      continuously. The lowest tier produces Dark Matter and all tiers produce Dark Energy.`
  },
  {
    name: "Dimension Reset Mechanics",
    id: 42,
    openH2pEntry: "Lai'tela",
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: `Dark Matter Dimensions can be reset in two ways. Annihilation resets all your Dimensions in exchange
      for a permanent multiplier to all Dark Matter Dimensions. Ascension increases production but resets the interval
      of a single Dimension.`
  },
  {
    name: "Singularities",
    id: 43,
    requiredStage: PROGRESS_STAGE.LAITELA,
    description: `Dark Energy can be used to produce Singularities, which give boosts based on their total amount.
      When producing Singularities, any extra Dark Energy above the condensing threshold is wasted.`
  },
  {
    name: "Pelle",
    id: 44,
    requiredStage: PROGRESS_STAGE.PELLE,
    description: `Pelle is the seventh and final Celestial, who permanently Dooms your game, throwing you into a very
      difficult modified Reality which you cannot escape.`
  },
  {
    name: "Armageddon",
    id: 45,
    openH2pEntry: "Pelle",
    requiredStage: PROGRESS_STAGE.PELLE,
    description: `Armageddon is a Pelle-specific reset which you can perform at any time. This resets your progress to
      the beginning of the Doomed Reality, but gives Remnants which produce Reality Shards.`
  },
  {
    name: "Pelle Strikes and Rifts",
    id: 46,
    openH2pEntry: "Pelle Strikes",
    requiredStage: PROGRESS_STAGE.PELLE,
    description: `Upon reaching certain progress milestones within Pelle, a Strike may occur which permanently applies
      another nerf to the Doomed Reality. Accompanying every Strike is a Rift, which is a mechanic which lets you drain
      a different resource in exchange for a boost. These are permanent and remain unlocked after Armageddon.`
  },
];

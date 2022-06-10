import { GameDatabase } from "./game-database";

GameDatabase.catchupResources = [
  {
    name: "Antimatter Dimensions",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Every Antimatter Dimension continuously produces Dimensions of the next tier down. The lowest
      Antimatter Dimension produces Antimatter.`
  },
  {
    name: "Tickspeed Upgrades",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Tickspeed upgrades make Antimatter Dimensions produce other Antimatter Dimensions or Antimatter
      as if time were passing faster.`
  },
  {
    name: "Autobuyers",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Autobuyers are a built-in feature to the game which purchases upgrades for your Antimatter
      Dimensions automatically when you can afford them.`
  },
  {
    name: "Dimension Boosts",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Dimension Boosts are gained by resetting all your Antimatter Dimensions after reaching a certain
      point. They provide a multiplier to your Antimatter Dimensions.`
  },
  {
    name: "Antimatter Galaxies",
    requiredStage: PROGRESS_STAGE.PRE_INFINITY,
    description: `Antimatter Galaxies improve the effectiveness of your Tickspeed upgrades in a compounding way; the
      more Tickspeed upgrades you have, the more effective having additional Galaxies will be.`
  },
  {
    name: "Infinity",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: () => `Infinity is the first main reset layer. Reaching ${format(Number.MAX_VALUE, 2)} Antimatter
      allows you to reset all of the resources you earned in exchange for unlocking new content and resources. You
      are not allowed to go above ${format(Number.MAX_VALUE, 2)} Antimatter until later on.`
  },
  {
    name: "Infinity Points",
    requiredStage: PROGRESS_STAGE.EARLY_INFINITY,
    description: `Infinity Points are the primary resource after completing your first Infinity. They can be spent on
      upgrades which persist through Infinity resets.`
  },
  {
    name: "Challenges",
    requiredStage: PROGRESS_STAGE.INFINITY,
    description: () => `Challenges are sections of the game which have modified rules to make reaching
      ${format(Number.MAX_VALUE, 2)} Antimatter more difficult, possibly requiring some Infinity upgrades to complete
      in a reasonable amount of time. Completing challenges allows you to upgrade your Autobuyers.`
  },
  {
    name: "Break Infinity",
    requiredStage: PROGRESS_STAGE.INFINITY,
    description: () => `Upgrading your Big Crunch Autobuyer allows you to surpass ${format(Number.MAX_VALUE, 2)}
      Antimatter, giving increasing amounts of Infinity Points. Infinitying is no longer forced at
      ${format(Number.MAX_VALUE, 2)} Antimatter.`
  },
  {
    name: "Infinity Dimensions",
    requiredStage: PROGRESS_STAGE.INFINITY,
    description: `Infinity Dimensions Produce in a cascading fashion like Antimatter Dimensions. The lowest tier of
      Infinity Dimension produces Infinity Power, which applies a large multiplier to all Antimatter Dimensions.`
  },
  {
    name: "Infinity Challenges",
    requiredStage: PROGRESS_STAGE.INFINITY,
    description: () => `Infinity Challenges are Challenges with an Antimatter goal above ${format(Number.MAX_VALUE, 2)},
      which only become available after you Break Infinity. Completing them rewards upgrades and production boosts.`
  },
  {
    name: "Replicanti",
    requiredStage: PROGRESS_STAGE.INFINITY,
    description: () => `Replicanti is a resource which produces itself passively over time, giving a multiplier to all
      Infinity Dimensions. At ${format(Number.MAX_VALUE, 2)} Replicanti, they can be reset for an additional Galaxy
      which does not increase the cost of Antimatter Galaxies. They reset to ${formatInt(1)} after every Infinity.`
  },
  {
    name: "Eternity",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: () => `Eternity is the second main reset layer. Reaching ${format(Number.MAX_VALUE, 2)} Infinity Points
      allows you to everything you have done up to this point in exchange for access to new content and resources.
      You are not limited ${format(Number.MAX_VALUE, 2)} Infinity Points and can freely pass it.`
  },
  {
    name: "Time Studies",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Time Studies are a set of upgrades akin to a skill tree, and can be freely re-allocated after every
      Eternity with no resource loss. They can potentially affect anything present in the game up to this point. Some
      sections of the tree have restrictions which forbid you from choosing particular studies simultaneously.`
  },
  {
    name: "Eternity Milestones",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Eternity Milestones are forms of built-in automation and convenience which are unlocked simply by
      completing more Eternities. Unlocking them does not require spending any resources.`
  },
  {
    name: "Time Dimensions",
    requiredStage: PROGRESS_STAGE.EARLY_ETERNITY,
    description: `Time Dimensions also produce each other in a cascading manner, with the lowest tier producing Time
      Shards. Time Shards give you additional Tickspeed upgrades which do not increase the cost of the Tickspeed
      upgrades normally purchased with Antimatter.`
  },
  {
    name: "Eternity Challenges",
    requiredStage: PROGRESS_STAGE.ETERNITY,
    description: `Eternity Challenges are modified Eternities with an Infinity Point goal which must be reached for
      completion. They can be completed up to five times, getting more difficult each repetition in exchange for
      increasingly powerful rewards.`
  },
  {
    name: "Time Dilation",
    requiredStage: PROGRESS_STAGE.EARLY_DILATION,
    description: () => `Time Dilation is a modified Eternity where all the multipliers to your Dimensions are severely
      reduced. Reaching ${format(Number.MAX_VALUE, 2)} Infinity Points again gives Tachyon Particles, which produces
      another resource called Dilated Time.`
  },
  {
    name: "Reality",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: () => `Reality is the third and final main reset layer. Reaching ${format(DC.E4000)} Eternity Points
      gives you the option to reset the whole game up to this point in exchange for unlocking new content and gaining
      access to new resources.`
  },
  {
    name: "Perks",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `Perks are unlockable features similar to Eternity Milestones which primarily focus on convenience and
      automation. They are purchased using perk points, which are gained after every Reality.`
  },
  {
    name: "Glyphs",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `Glyphs are equippable objects which apply boosts to various parts of the game, and can only be
      unequipped between Realities. Every Reality, you are allowed to choose one of four Glyphs to receive, the overall
      quality of which is determined by how high some of your resources reached in that Reality and some randomness.`
  },
  {
    name: "Automator",
    requiredStage: PROGRESS_STAGE.EARLY_REALITY,
    description: `The Automator is a built-in feature that uses a custom scripting language to let your game potentially
      finish Realities completely hands-off. This feature is unlocked after obtaining enough Automator Points, and
      generally becomes easier to use as you get more features which give Automator Points even after unlocking.`
  },
  {
    name: "Black Hole",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `The Black Hole is an unlockable feature which runs the entire game faster in a periodic cycle. This
      affects everything in the game up to this point and will give similar results to actually leaving the game open
      for an equivalent amount of time.`
  },
  {
    name: "Teresa",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Teresa is the first Celestial, who has a more difficult Reality which gives a massive boost to Glyph
      Sacrifice depending upon completion. They unlock upgrades which focus on testing and automating Realities more
      easily.`
  },
  {
    name: "Effarig",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Effarig is the second Celestial, whose Reality limits your Glyphs and has scaling nerfs but gives
      rewards for each new reset layer reached. They unlock upgrades which focus on automatically selecting and
      filtering the large number of Glyphs you are receiving, purchased with a new resource called Relic Shards.`
  },
  {
    name: "The Enslaved Ones",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `The Enslaved Ones are the third Celestial, whose Reality is extremely punishing with a long list of
      nerfs, but unlocks a new mechanic called Tesseracts for those who can figure out how to prevail. They also modify
      your Black Hole to allow it to store time.`
  },
  {
    name: "Stored Time",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Your Black Hole has the ability to store time in two ways, game time and real time. Storing game time
      allows you to hold on to sped-up time and release it later as a single skip-forward burst. Storing real time lets
      you effectively pause the game entirely in order to later repeat a Reality as if you had spent the paused time
      doing nothing but that Reality over and over.`
  },
  {
    name: "Tesseracts",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Infinity Dimensions cannot be upgrade indefinitely, and all but the 8th have a hard limit for how many
      times they can be upgraded. Tesseracts increase this limit significantly, and are permanently unlocked by reaching
      certain amounts of Infinity Points.`
  },
  {
    name: "V",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `V is the fourth Celestial, with a modified Reality which is similar to Teresa's Reality but only gives
      rewards by reaching certain milestones of resources within which may not be related to completing the Reality.
      They give a new resource called Space Theorems, which eventually allow the entire Time Study tree to be purchased
      simultaneously without path restrictions.`
  },
  {
    name: "Ra",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Ra is the fifth Celestial, with a modified Reality which produces a resource called memory chunks
      based on your resource totals within. They focus highly on taking older upgrades and themes from the previous
      four Celestials and improving upon them, as well as filling out some final gaps in automation and convenience.`
  },
  {
    name: "Memories",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Ra has the previous four Celestials under their control, producing memories over time based on memory
      chunk count. These memories are used to level up the precious Celestials, providing upgrades when certain levels
      are reached.`
  },
  {
    name: "Charged Infinity Upgrades",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Teresa's Memories allow you to Charge your Infinity Upgrades, significantly strengthening them in a
      way similar to their original effects. Which upgrades are charged can only be changed between Realities, like
      Glyphs.`
  },
  {
    name: "Glyph Alchemy",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Effarig's Memories unlocks Glyph Alchemy, which gives minor boosts to various parts of the game,
      using a modified version of Glyph Sacrifice. The resources gained from giving up Glyphs in this way must be
      combined together in alchemy reactions, which trigger once per Reality, in order to fully upgrade their effects.`
  },
  {
    name: "Amplified Black Hole",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `Enslaved's Memories amplifies stored time so that the amount of game time stored is larger than the
      actual game time elapsed. This stored time can also be released repeatedly and automatically.`
  },
  {
    name: "Harder V",
    requiredStage: PROGRESS_STAGE.REALITY,
    description: `V's Memories unlocks a modified version of V's original Reality with even harder goals, and a new set
      of Time Studies called Triad Studies.`
  },
  {
    name: "Imaginary Machines",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: () => `Imaginary Machines are a new resource unlocked when reaching ${format(DC.E1000)} Reality
      Machines. They are produced passively up to a cap determined by how many Reality Machines you would have gotten
      in your farthest Reality ever. Imaginary Machines also unlock a new set of upgrades.`
  },
  {
    name: "Lai'tela",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Lai'tela is the sixth Celestial, whose Reality massively reduces the speed of your game and gives a
      scaling reward based on how quickly you can reach its modified completion condition. They unlock a new set of
      mechanics, related to a new resource called Dark Matter.`
  },
  {
    name: "Continuum",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Continuum is a modified type of production which allows your Antimatter Dimensions to produce as if
      they could purchase fractional amounts of upgrades, without actually purchasing them. At this point, nothing on
      the Antimatter Dimension tab will ever decrease unless you perform a reset.`
  },
  {
    name: "Dark Matter Dimensions",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Dark Matter Dimensions are cascading production which operate on a tick-based system instead of
      continuously. The lowest tier produces Dark Matter which is used to upgrade the Dimensions further, and all
      tiers produce Dark Energy. They can later on be reset for permanent multipliers using Annihiliation.`
  },
  {
    name: "Singularities",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Dark Energy can be used to produce Singularities, which give boosts based on their total amount.
      Singularities do not need to be spent; simply having enough of them is sufficient to give boosts. When producing
      Singularities, any extra Dark Energy above the condensing threshold is wasted.`
  },
  {
    name: "Pelle",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Pelle is the seventh and final Celestial, who permanently Dooms your game, throwing you into a very
      difficult modified Reality which you cannot escape. Completing this Doomed Reality will beat the game.`
  },
  {
    name: "Armageddon",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Armageddon is a Pelle-specific reset which you can perform at any time. This resets your progress to
      the beginning of the Doomed Reality, but gives Remnants which produce Reality Shards. Reality Shards can be used
      to purchase upgrades which provide production boosts and allow for less things to be reset after Armageddon.`
  },
  {
    name: "Pelle Strikes and Rifts",
    requiredStage: PROGRESS_STAGE.IMAGINARY_MACHINES,
    description: `Upon reaching certain progress milestones within Pelle, a Strike may occur which permanently applies
      another nerf to the Doomed Reality. Accompanying every Strike is a Rift, which is a mechanic which lets you drain
      a different resource in exchange for a boost. These are permanent and remain unlocked after Armageddon.`
  },
];

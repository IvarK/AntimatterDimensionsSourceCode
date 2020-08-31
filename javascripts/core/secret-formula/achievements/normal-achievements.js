"use strict";

GameDatabase.achievements.normal = [
  {
    id: 11,
    name: "You gotta start somewhere",
    description: "Buy a 1st Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 12,
    name: "100 antimatter is a lot",
    description: "Buy a 2nd Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 13,
    name: "Half life 3 CONFIRMED",
    description: "Buy a 3rd Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    description: "Buy a 4th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 15,
    name: "5 Dimension Antimatter Punch",
    description: "Buy a 5th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 16,
    name: "We couldn't afford 9",
    get description() {
      return Enslaved.isRunning
      ? "Buy a 6th Antimatter Dimension (they never amount to anything)"
      : "Buy a 6th Antimatter Dimension.";
    },
      checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    },
  {
    id: 17,
    name: "Not a luck related achievement",
    description: "Buy a 7th Antimatter Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 18,
    name: "90 degrees to infinity",
    get description() {
      return Enslaved.isRunning
      ? "Buy an 8th Antimatter Dimension (don't get used to it)"
      : "Buy an 8th Antimatter Dimension.";
    },
      checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    },
  {
    id: 21,
    name: "To infinity!",
    description: "Go Infinite.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(100)} antimatter.`; },
    effect: 100
  },
  {
    id: 22,
    name: "FAKE NEWS!",
    get description() { return `Encounter ${formatInt(50)} different news messages.`; },
    checkRequirement: () => player.news.size >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    name: "The 9th Dimension is a lie",
    get description() { return `Have exactly ${formatInt(99)} 8th Antimatter Dimensions.`; },
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    get reward() { return `8th Antimatter Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1
  },
  {
    id: 24,
    name: "Antimatter Apocalypse",
    get description() { return `Get over ${format(1e80, 0, 0)} antimatter.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 80,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    name: "Boosting to the max",
    get description() { return `Buy ${formatInt(10)} Dimension Boosts.`; },
    checkRequirement: () => DimBoost.purchasedBoosts >= 10,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    name: "You got past The Big Wall",
    description: "Buy an Antimatter Galaxy.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    name: "Double Galaxy",
    get description() { return `Buy ${formatInt(2)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies >= 2,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    name: "There's no point in doing that...",
    get description() { return `Buy a single 1st Antimatter Dimension when you have over ${format(1e150)} of them.`; },
    checkRequirement: () => AntimatterDimension(1).amount.exponent >= 150,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    get reward() { return `1st Antimatter Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1
  },
  {
    id: 31,
    name: "I forgot to nerf that",
    get description() { return `Get any Antimatter Dimension multiplier over ${format(1e31)}.`; },
    checkRequirement: () => AntimatterDimensions.all.find(x => x.multiplier.exponent >= 31) !== undefined,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `1st Antimatter Dimensions are ${formatPercents(0.05)} stronger.`; },
    effect: 1.05
  },
  {
    id: 32,
    name: "The Gods are pleased",
    get description() { return `Get over ${formatX(600)} from Dimensional Sacrifice outside of Challenge 8.`; },
    checkRequirement: () => !NormalChallenge(8).isRunning && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: "Dimensional Sacrifice is slightly stronger.",
    effect: 0.1
  },
  {
    id: 33,
    name: "That's a lot of infinites",
    get description() { return `Reach Infinity ${formatInt(10)} times.`; },
    checkRequirement: () => player.infinitied.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    name: "You didn't need it anyway",
    description: "Go Infinite without having any 8th Antimatter Dimensions.",
    checkRequirement: () => AntimatterDimension(8).amount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Dimensions 1-7 are ${formatPercents(0.02)} stronger.`; },
    effect: 1.02
  },
  {
    id: 35,
    name: "Don't you dare sleep",
    get description() {
      return player.realities > 0
      ? `Be offline for a period of over ${formatInt(6)} hours (real time).`
      : `Be offline for a period of over ${formatInt(6)} hours.`;
    },
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    name: "Claustrophobic",
    get description() { return `Go Infinite with just ${formatInt(1)} Antimatter Galaxy.`; },
    checkRequirement: () => player.galaxies === 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Reduces starting tick interval by ${formatPercents(0.02)}.`; },
    effect: 0.98
  },
  {
    id: 37,
    name: "That's FAST!",
    get description() { return `Go infinite in under ${formatInt(2)} hours.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalHours <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${formatInt(1000)} antimatter.`; },
    effect: 1000
  },
  {
    id: 38,
    name: "I don't believe in Gods",
    description: "Buy an Antimatter Galaxy without ever Dimensional Sacrificing.",
    checkRequirement: () => player.noSacrifices,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    name: "Spreading Cancer",
    get description() { return `Buy ${formatInt(10)} Antimatter Galaxies in total while using cancer notation.`; },
    checkRequirement: () => player.spreadingCancer >= 10,
    checkEvent: [GAME_EVENT.GALAXY_RESET_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 42,
    name: "Super Sanic",
    get description() { return `Have antimatter/sec exceed your current antimatter above ${format(1e63, 0, 0)}.`; },
    checkRequirement: () =>
      Currency.antimatter.exponent >= 63 &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    name: "Zero Deaths",
    description: "Get to Infinity without Dimension Boosts or Antimatter Galaxies while in a Normal Challenge.",
    checkRequirement: () => player.galaxies === 0 && DimBoost.purchasedBoosts === 0 && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Antimatter Dimensions 1-4 are ${formatPercents(0.25)} stronger.`; },
    effect: 1.25
  },
  {
    id: 44,
    name: "Over in 30 Seconds",
    get description() {
      return `Have antimatter/sec exceed your current antimatter
      for ${formatInt(30)} consecutive seconds.`;
    },
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    name: "Faster than a potato",
    get description() { return `Get more than ${format(1e29)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -26,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98
  },
  {
    id: 46,
    name: "Multidimensional",
    get description() { return `Reach ${format(1e12)} of all Antimatter Dimensions except the 8th.`; },
    checkRequirement: () => AntimatterDimension(7).amount.exponent >= 12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    name: "Daredevil",
    get description() { return `Complete ${formatInt(3)} Normal Challenges.`; },
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    name: "Antichallenged",
    description: "Complete all Normal Challenges.",
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    get reward() { return `All Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1
  },
  {
    id: 51,
    name: "Limit Break",
    description: "Break Infinity.",
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    name: "Age of Automation",
    description: "Max dimension and tickspeed autobuyers.",
    checkRequirement: () => Autobuyers.upgradeable
      .countWhere(a => a.isUnlocked && a.hasMaxedInterval) >= 9,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    name: "Definitely not worth it",
    description: "Max all the autobuyers.",
    checkRequirement: () => Autobuyers.upgradeable
      .concat([Autobuyer.galaxy, Autobuyer.dimboost, Autobuyer.bigCrunch])
      .countWhere(a => a.isUnlocked && a.hasMaxedInterval) >= 12,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    name: "That's FASTER!",
    get description() { return `Infinity in ${formatInt(10)} minutes or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(2e5)} antimatter.`; },
    effect: 2e5
  },
  {
    id: 55,
    name: "Forever isn't that long",
    get description() { return `Infinity in ${formatInt(1)} minute or less.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Start with ${format(1e10)} antimatter.`; },
    effect: 1e10
  },
  {
    id: 56,
    name: "Many Deaths",
    get description() {
      return `Complete the 2nd Antimatter Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(2).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities.`;
    },
    effect: () => 6 / (Time.thisInfinity.totalMinutes + 3),
    effectCondition: () => Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 57,
    name: "Gift from the Gods",
    get description() {
      return `Complete the 8th Antimatter Dimension Autobuyer Challenge in ${formatInt(3)} minutes or less.`;
    },
    checkRequirement: () => NormalChallenge(8).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "Dimensional Sacrifice is a lot stronger.",
    effect: 0.1
  },
  {
    id: 58,
    name: "Is this hell?",
    get description() { return `Complete the Tickspeed Autobuyer Challenge in ${formatInt(3)} minutes or less.`; },
    checkRequirement: () => NormalChallenge(9).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Boost per buying ${formatInt(10)} Antimatter Dimensions +${formatPercents(0.01)}.`; },
    effect: 1.01
  },
  {
    id: 61,
    name: "Bulked Up",
    get description() {
      return `Get all of your Antimatter Dimension Autobuyer bulk amounts to ${formatInt(512)} or higher.`;
    },
    checkRequirement: () => Autobuyers.dimensions.countWhere(a => !a.isUnlocked || a.bulk < 512) === 0,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    reward: "Dimension Autobuyer bulks are unlimited."
  },
  {
    id: 62,
    name: "Oh, hey... You're still here?",
    get description() { return `Reach ${format(1e8)} Infinity Points per minute.`; },
    checkRequirement: () => Player.bestRunIPPM.exponent >= 8,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    name: "A new beginning",
    description: "Begin generation of Infinity Power.",
    checkRequirement: () => player.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    name: "1 Million is a lot",
    get description() { return `Reach ${format(1e6)} Infinity Power.`; },
    checkRequirement: () => player.infinityPower.exponent >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 65,
    name: "Not-so-challenging",
    get description() { return `Get the sum of all of your Normal Challenge times under ${formatInt(3)} minutes.`; },
    checkRequirement: () => Time.challengeSum.totalMinutes < 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() {
      return `All Antimatter Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities,
      but only in Challenges.`;
    },
    effect: () => Math.max(4 / (Time.thisInfinity.totalMinutes + 1), 1),
    effectCondition: () => (NormalChallenge.isRunning || InfinityChallenge.isRunning) &&
      Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 66,
    name: "Faster than a squared potato",
    get description() { return `Get more than ${format(1e58, 0, 0)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -55,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Multiply starting tickspeed by ${formatX(1.02, 0, 2)}.`; },
    effect: 0.98
  },
  {
    id: 67,
    name: "Infinitely Challenging",
    description: "Complete an Infinity Challenge.",
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    name: "You did this again just for the achievement right?",
    get description() {
      return `Complete the 3rd Antimatter Dimension Autobuyer Challenge in ${formatInt(10)} seconds or less.`;
    },
    checkRequirement: () => NormalChallenge(3).isRunning && Time.thisInfinityRealTime.totalSeconds <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `1st Antimatter Dimensions are ${formatPercents(0.5)} stronger.`; },
    effect: 1.5
  },
  {
    id: 71,
    name: "ERROR 909: Dimension not found",
    description:
      `Get to Infinity with only a single 1st Antimatter Dimension without Dimension Boosts
      or Antimatter Galaxies, while in the 2nd Antimatter Dimension Autobuyer Challenge.`,
    checkRequirement: () =>
      NormalChallenge(2).isRunning &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts === 0 &&
      player.galaxies === 0,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `1st Antimatter Dimensions are ${formatInt(3)} times stronger.`; },
    effect: 3
  },
  {
    id: 72,
    name: "Can't hold all these infinities",
    get description() { return `Get all Antimatter Dimension multipliers over ${format(1e308)}.`; },
    checkRequirement: () => Array.range(1, 8)
      .every(tier => AntimatterDimension(tier).multiplier.exponent >= 308),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `All Antimatter Dimensions are ${formatPercents(0.1)} stronger.`; },
    effect: 1.1
  },
  {
    id: 73,
    name: "THIS ACHIEVEMENT DOESN'T EXIST",
    get description() { return `Get ${formatPostBreak("9.9999e9999", 4, 0)} antimatter.`; },
    checkRequirement: () => Currency.antimatter.gte("9.9999e9999"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Antimatter Dimensions are stronger the more unspent antimatter you have.",
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1)
  },
  {
    id: 74,
    name: "End me",
    get description() { return `Get the sum of all best Normal Challenge times under ${formatInt(5)} seconds.`; },
    checkRequirement: () => Time.challengeSum.totalSeconds < 5,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() { return `All Antimatter Dimensions are ${formatPercents(0.4)} stronger, but only in challenges.`; },
    effect: 1.4,
    effectCondition: () => NormalChallenge.isRunning || InfinityChallenge.isRunning
  },
  {
    id: 75,
    name: "NEW DIMENSIONS???",
    description: "Unlock the 4th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Your achievement bonus affects Infinity Dimensions.",
    effect: () => Achievements.power
  },
  {
    id: 76,
    name: "One for each dimension",
    get description() { return `Play for ${formatInt(8)} days.`; },
    checkRequirement: () => Time.totalTimePlayed.totalDays >= 8,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Extremely small multiplier to Antimatter Dimensions based on time played.",
    effect: () => Math.pow(Time.totalTimePlayed.totalDays / 2, 0.05)
  },
  {
    id: 77,
    name: "How the antitables have turned..",
    description:
      "Get the 8th Antimatter Dimension multiplier to be highest, 7th Antimatter Dimension multiplier " +
      " second highest, etc.",
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Each Antimatter Dimension gains a boost proportional to tier
      (8th gets ${formatPercents(0.08)}, 7th gets ${formatPercents(0.07)}, etc.)`;
    }
  },
  {
    id: 78,
    name: "Blink of an eye",
    get description() { return `Get to Infinity in under ${formatInt(200)} milliseconds.`; },
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds <= 200,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `Start with ${format(2e25, 0, 0)} antimatter and all Antimatter Dimensions
      are stronger in the first ${formatInt(300)}ms of Infinities.`;
    },
    effects: {
      dimensionMult: {
        effect: () => 330 / (Time.thisInfinity.totalMilliseconds + 30),
        effectCondition: () => Time.thisInfinity.totalMilliseconds < 300,
      },
      antimatter: 2e25
    }
  },
  {
    id: 81,
    name: "Hevipelle did nothing wrong",
    get description() { return `Beat Infinity Challenge 5 in ${formatInt(15)} seconds or less.`; },
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds <= 15,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    name: "Anti-antichallenged",
    get description() { return `Complete ${formatInt(8)} Infinity Challenges.`; },
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    name: "YOU CAN GET 50 GALAXIES?!?!",
    get description() { return `Get ${formatInt(50)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies >= 50,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Tickspeed is ${formatPercents(0.05)} lower per Antimatter Galaxy.`; },
    effect: () => Decimal.pow(0.95, player.galaxies)
  },
  {
    id: 84,
    name: "I got a few to spare",
    get description() { return `Reach ${formatPostBreak("1e35000", 0, 0)} antimatter.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 35000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Antimatter Dimensions are stronger the more unspent antimatter you have.",
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1)
  },
  {
    id: 85,
    name: "ALL YOUR IP ARE BELONG TO US",
    get description() { return `Big Crunch for ${format(1e150, 0, 0)} Infinity Points.`; },
    checkRequirement: () => gainedInfinityPoints().exponent >= 150,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return `Additional ${formatX(4)} multiplier to IP.`; },
    effect: 4
  },
  {
    id: 86,
    name: "Do you even bend time bro?",
    get description() { return `Reach ${formatX(1000)} ticks/second per tickspeed upgrade.`; },
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Galaxies are ${formatPercents(0.01)} stronger.`; },
    effect: 1.01
  },
  {
    id: 87,
    name: "2 MILLION INFINITIES",
    get description() { return `Infinity ${format(2e6)} times.`; },
    checkRequirement: () => player.infinitied.gt(2e6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Infinities more than ${formatInt(5)} seconds long
      give ${formatX(250)} more Infinities.`;
    },
    effect: 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 88,
    name: "Yet another infinity reference",
    get description() { return `Get a ${formatX(Decimal.NUMBER_MAX_VALUE, 1, 0)} multiplier in a single Dimensional Sacrifice.`; },
    checkRequirement: () => Sacrifice.nextBoost.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    reward: "Dimensional Sacrifices are stronger.",
    effect: 0.1,
  },
  {
    id: 91,
    name: "Ludicrous Speed",
    get description() { return `Big Crunch for ${format(1e200, 0, 0)} IP in ${formatInt(2)} seconds or less.`; },
    checkRequirement: () => gainedInfinityPoints().exponent >= 200 && Time.thisInfinityRealTime.totalSeconds <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are significantly stronger in the
      first ${formatInt(5)} seconds of Infinities.`;
    },
    effect: () => Math.max((5 - Time.thisInfinity.totalSeconds) * 60, 1),
    effectCondition: () => Time.thisInfinity.totalSeconds < 5
  },
  {
    id: 92,
    name: "I brake for NOBODY!",
    get description() { return `Big Crunch for ${format(1e250, 0, 0)} IP in ${formatInt(20)} seconds or less.`; },
    checkRequirement: () => gainedInfinityPoints().exponent >= 250 && Time.thisInfinityRealTime.totalSeconds <= 20,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return `All Antimatter Dimensions are significantly stronger in the
      first ${formatInt(60)} seconds of Infinities.`;
    },
    effect: () => Math.max((1 - Time.thisInfinity.totalMinutes) * 100, 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 1
  },
  {
    id: 93,
    name: "MAXIMUM OVERDRIVE",
    get description() { return `Big Crunch with ${format(1e300, 0, 0)} IP/min.`; },
    checkRequirement: () => Player.bestRunIPPM.exponent >= 300,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    get reward() { return `Additional ${formatX(4)} multiplier to Infinity Points.`; },
    effect: 4
  },
  {
    id: 94,
    name: "4.3333 minutes of Infinity",
    get description() { return `Reach ${format(1e260, 0, 0)} Infinity Power.`; },
    checkRequirement: () => player.infinityPower.exponent >= 260,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Double Infinity Power gain.",
    effect: 2
  },
  {
    id: 95,
    name: "Is this safe?",
    get description() { return `Gain ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Replicanti in ${formatInt(1)} hour.`; },
    get reward() { return `You keep your Replicanti and ${formatInt(1)} Replicanti Galaxy on Infinity.`; },
    checkRequirement: () =>
      (player.replicanti.amount.eq(Decimal.NUMBER_MAX_VALUE) || player.replicanti.galaxies > 0) &&
      Time.thisInfinityRealTime.totalHours <= 1,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    name: "Time is relative",
    description: "Go Eternal.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    name: "YES This. Is. Hell.",
    get description() { return `Get the sum of Infinity Challenge times under ${format(6.66, 2, 2)} seconds.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds < 6.66,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 98,
    name: "0 degrees from Infinity",
    description: "Unlock the 8th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    name: "Costco sells Dimboosts now!",
    get description() { return `Bulk buy ${formatInt(750)} Dimension Boosts at once.`; },
    checkRequirement: ([bulk]) => bulk >= 750,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    get reward() { return `Dimension Boosts are ${formatPercents(0.01)} stronger (to Antimatter Dimensions).`; },
    effect: 1.01
  },
  {
    id: 102,
    name: "This mile took an eternity",
    description: "Get all Eternity milestones.",
    checkRequirement: () => EternityMilestones.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 103,
    name: "Tätä saavutusta ei ole olemassa II",
    get description() { return `Reach ${formatPostBreak("9.99999e999", 5, 0)} Infinity Points.`; },
    checkRequirement: () => player.infinityPoints.exponent >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Gain more Infinity Points based on amount of antimatter you had when crunching.",
    effect: 307.8
  },
  {
    id: 104,
    name: "That wasn't an eternity",
    get description() { return `Eternity in under ${formatInt(30)} seconds.`; },
    checkRequirement: () => Time.thisEternity.totalSeconds <= 30,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Start Eternities with ${format(2e25)} IP.`; },
    effect: 2e25
  },
  {
    id: 105,
    name: "Infinite Time",
    get description() { return `Have ${formatInt(308)} Tickspeed upgrades from Time Dimensions.`; },
    checkRequirement: () => player.totalTickGained >= 308,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions gain a multiplier based on Tickspeed.",
    effect: () => Tickspeed.current.div(1000).pow(0.000005).reciprocate()
  },
  {
    id: 106,
    name: "The swarm",
    get description() { return `Get ${formatInt(10)} Replicanti Galaxies in ${formatInt(15)} seconds.`; },
    checkRequirement: () => Replicanti.galaxies.total >= 10 && Time.thisInfinity.totalSeconds <= 15,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    name: "Do you really need a guide for this?",
    get description() { return `Eternity with the Infinitied stat under ${formatInt(10)}.`; },
    checkRequirement: () => player.infinitied.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    name: "We COULD afford 9",
    get description() { return `Eternity with exactly ${formatInt(9)} Replicanti.`; },
    checkRequirement: () => player.replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    name: "Yo dawg, I heard you liked infinities...",
    get description() {
      return `Have all your Infinities in your past ${formatInt(10)} Infinities be at least
      ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} times higher Infinity Points than the previous one.`;
    },
    checkRequirement: () => {
      const infinities = player.lastTenRuns.map(run => run[1]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(Decimal.NUMBER_MAX_VALUE)) || infinities[i].eq(0)) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: "Your Antimatter doesn't reset on Dimension Boosts or Antimatter Galaxies."
  },
  {
    id: 112,
    name: "Never again",
    get description() { return `Get the sum of Infinity Challenge times below ${formatInt(750)}ms.`; },
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds < 750,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    name: "Long lasting relationship",
    get description() {
      return `Have your Infinity Power per second exceed your Infinity Power
      for ${formatInt(60)} consecutive seconds during a single Infinity.`;
    },
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(player.infinityPower),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 114,
    name: "You're a mistake",
    description: "Fail an Eternity Challenge.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: "A fading sense of accomplishment.",
    effect: () => "Sense of accomplishment (fading)"
  },
  {
    id: 115,
    name: "I wish I had gotten 7 eternities",
    description: "Start an Infinity Challenge inside an Eternity Challenge.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 116,
    name: "Do I really need to infinity",
    get description() { return `Eternity with only ${formatInt(1)} Infinity.`; },
    checkRequirement: () => player.infinitied.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: "Multiplier to Infinity Points based on Infinities.",
    effect: () => Decimal.pow(Player.totalInfinitied.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap
  },
  {
    id: 117,
    name: "8 nobody got time for that",
    description: "Eternity without buying Antimatter Dimensions 1-7.",
    checkRequirement: () => player.onlyEighthDimensions,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 118,
    name: "IT'S OVER 9000",
    get description() { return `Get a total Dimensional Sacrifice multiplier of ${formatPostBreak("1e9000", 0, 0)}.`; },
    checkRequirement: () => Sacrifice.totalBoost.exponent >= 9000,
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: "Dimensional Sacrifice doesn't reset your Antimatter Dimensions.",
  },
  {
    id: 121,
    name: "Can you get infinite IP?",
    get description() { return `Reach ${formatPostBreak("1e30008", 0, 0)} Infinity Points.`; },
    checkRequirement: () => player.infinityPoints.exponent >= 30008,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    name: "You're already dead.",
    description: "Eternity without buying Antimatter Dimensions 2-8.",
    checkRequirement: () => player.onlyFirstDimensions,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    name: "5 more eternities until the update",
    get description() { return `Complete ${formatInt(50)} unique Eternity Challenge tiers.`; },
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    name: "Eternities are the new infinity",
    get description() { return `Eternity in under ${formatInt(200)}ms.`; },
    checkRequirement: () => Time.thisEternity.totalMilliseconds <= 200,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 125,
    name: "Like feasting on a behind",
    get description() {
      return `Reach ${format(1e90, 0, 0)} Infinity Points without having any Infinities
      or buying any 1st Antimatter Dimensions in your current Eternity.`;
    },
    checkRequirement: () => player.infinityPoints.exponent >= 90 &&
      player.noFirstDimensions && player.infinitied.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Infinity Point multiplier based on time spent this Infinity.",
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return Decimal.pow(2, Math.log(thisInfinity) * Math.min(Math.pow(thisInfinity, 0.11), 500));
    },
    cap: () => Effarig.eternityCap
  },
  {
    id: 126,
    name: "Popular music",
    get description() { return `Have ${formatInt(180)} times more Replicanti Galaxies than Antimatter Galaxies.`; },
    checkRequirement: () => Replicanti.galaxies.total >= 180 * player.galaxies && player.galaxies > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `Replicanti Galaxies divide your Replicanti by ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)}
      instead of resetting them to ${formatInt(1)}.`;
    },
  },
  {
    id: 127,
    name: "But I wanted another prestige layer...",
    get description() { return `Reach ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Eternity Points.`; },
    checkRequirement: () => player.eternityPoints.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    name: "What do I have to do to get rid of you",
    get description() { return `Reach ${formatPostBreak("1e22000", 0, 0)} Infinity Points without any Time Studies.`; },
    checkRequirement: () => player.infinityPoints.exponent >= 22000 && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions are multiplied by the number of Time Studies you have.",
    effect: () => Math.max(player.timestudy.studies.length, 1)
  },
  {
    id: 131,
    name: "No ethical consumption",
    get description() { return `Get ${format(5e9)} Banked Infinities.`; },
    checkRequirement: () => player.infinitiedBank.gt(5e9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    get reward() { return `After Eternity you permanently keep ${formatPercents(0.05)} of your Infinities as Banked Infinities.`; },
    effect: () => player.infinitied.times(0.05).floor()
  },
  {
    id: 132,
    name: "Unique snowflakes",
    get description() {
      return `Have ${formatInt(569)} Antimatter Galaxies without getting any
      Replicanti Galaxies in your current Eternity.`;
    },
    checkRequirement: () => player.galaxies >= 569 && player.noReplicantiGalaxies,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Gain a multiplier to Tachyon Particle and Dilated Time gain based on Antimatter Galaxies.",
    effect: () => Math.max(Math.pow(player.galaxies, 0.04), 1)
  },
  {
    id: 133,
    name: "I never liked this infinity stuff anyway",
    get description() {
      return `Reach ${formatPostBreak("1e200000", 0, 0)} Infinity Points without
      buying any Infinity Dimensions or the ${formatX(2)} Infinity Point multiplier.`;
    },
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount === 0) &&
      player.infMultCost.equals(10) &&
      player.infinityPoints.exponent >= 200000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "You start Eternities with all Infinity Challenges unlocked and completed."
  },
  {
    id: 134,
    name: "When will it be enough?",
    get description() { return `Reach ${formatPostBreak("1e18000", 0, 0)} Replicanti.`; },
    checkRequirement: () => player.replicanti.amount.exponent >= 18000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() {
      return `You gain Replicanti ${formatInt(2)} times faster
      under ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Replicanti.`;
    }
  },
  {
    id: 135,
    name: "Faster than a potato^286078",
    get description() { return `Get more than ${formatPostBreak("1e8296262", 0, 0)} ticks per second.`; },
    checkRequirement: () => Tickspeed.current.exponent <= -8296262,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    name: "I told you already, time is relative",
    description: "Dilate time.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 137,
    name: "Now you're thinking with dilation!",
    get description() {
      return `Eternity for ${formatPostBreak("1e600", 0, 0)} Eternity Points
      in ${formatInt(1)} minute or less while Dilated.`;
    },
    checkRequirement: () =>
      gainedEternityPoints().exponent >= 600 &&
      Time.thisEternity.totalMinutes <= 1 &&
      player.dilation.active,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return `Gain ${formatX(2)} Dilated Time and Time Theorems while Dilated.`; },
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    name: "This is what I have to do to get rid of you.",
    get description() {
      return `Reach ${formatPostBreak("1e26000", 0, 0)} Infinity Points without any Time Studies while Dilated.`;
    },
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      player.infinityPoints.exponent >= 26000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Removes the downsides from the Active and Idle Time Study paths."
  },
  {
    id: 141,
    name: "Snap back to reality",
    description: "Make a new Reality.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() {
      return `${formatX(4)} Infinity Point gain, and boost from buying ${formatInt(10)}
      Antimatter Dimensions +${format(0.1, 0, 1)}.`;
    },
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    name: "How does this work?",
    description: "Unlock the automator.",
    checkRequirement: () => player.realities >= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() { return `Dimension Boosts are ${formatPercents(0.5)} stronger.`; },
    effect: 1.5,
  },
  {
    id: 143,
    name: "Yo dawg, I heard you liked reskins...",
    get description() {
      return `Have all your Eternities in your past ${formatInt(10)} Eternities be at least
      ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} times higher Eternity Points than the previous one.`;
    },
    checkRequirement: () => {
      const eternities = player.lastTenEternities.map(run => run[1]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(Decimal.NUMBER_MAX_VALUE)) || eternities[i].eq(0)) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: "Galaxies no longer reset Dimension Boosts."
  },
  {
    id: 144,
    name: "Is this an Interstellar reference?",
    description: "Unlock the Black Hole."
  },
  {
    id: 145,
    name: "Are you sure these are the right way around?",
    description: "Have the Black Hole interval smaller than the duration.",
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval < bh.duration),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole intervals are ${formatPercents(0.1)} shorter.`; },
    effect: 0.9
  },
  {
    id: 146,
    name: "Perks of living",
    description: "Have all perks bought.",
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    get reward() { return `+${formatPercents(0.01)} glyph rarity.`; },
    effect: 1
  },
  {
    id: 147,
    name: "Master of Reality",
    description: "Have all Reality upgrades bought.",
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: "Unlock Teresa, the Celestial of Reality."
  },
  {
    id: 148,
    name: "Royal flush",
    description: "Reality with one of each basic glyph type.",
    checkRequirement: () => BASIC_GLYPH_TYPES
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Gained glyph level is increased by number of distinct glyph types equipped.",
    effect: () => (new Set(Glyphs.activeList.map(g => g.type))).size,
  },
  {
    id: 151,
    name: "You really didn't need it anyway",
    get description() {
      return `Get ${formatInt(800)} Antimatter Galaxies without
      buying 8th Antimatter Dimensions in your current Infinity.`;
    },
    checkRequirement: () => player.galaxies >= 800 && player.noEighthDimensions,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Unlock V, the Celestial of Achievements."
  },
  {
    id: 152,
    name: "Y'all got any more of them glyphs?",
    get description() { return `Have ${formatInt(100)} glyphs in your inventory.`; },
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    name: "More like \"reallydoesn'tmatter\"",
    description: "Reality without producing antimatter.",
    checkRequirement: () => player.noAntimatterProduced,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 154,
    name: "I am speed",
    get description() { return `Reality in under ${formatInt(5)} seconds (game time).`; },
    checkRequirement: () => Time.thisReality.totalSeconds <= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `${formatPercents(0.1)} chance each Reality of ${formatX(2)} Realities and Perk Points.`; },
    effect: 0.1
  },
  {
    id: 155,
    name: "Achievement #15983",
    get description() { return `Play for ${formatFloat(13.7, 1)} billion years.`; },
    checkRequirement: () => Time.totalTimePlayed.totalYears > 13.7e9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Black Hole durations are ${formatPercents(0.1)} longer.`; },
    effect: 1.1
  },
  {
    id: 156,
    name: "College Dropout",
    description: "Reality without buying Time Theorems.",
    checkRequirement: () => player.noTheoremPurchases,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Free coupon to McDonalds™️."
  },
  {
    id: 157,
    name: "It's super effective!",
    get description() { return `Get a glyph with ${formatInt(4)} effects.`; },
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
        .filter(effect => effect.isGenerated).length
    ).max() >= 4,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 158,
    name: "Bruh, are you like, inside the hole?",
    description: "Make both Black Holes permanent.",
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return `Black Hole power increased by ${formatPercents(0.1)}.`; },
    effect: 1.1
  },
  {
    id: 161,
    name: "that's where you're wrong kiddo",
    get description() { return `Get ${format("1e100000000", 0, 0)} antimatter while Dilated.`; },
    checkRequirement: () => Currency.antimatter.exponent >= 100000000 && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 162,
    name: "Reinstalled the game and rejoined the server",
    description: "Have every Time Study at once.",
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 163,
    name: "Actually, super easy! Barely an inconvenience!",
    get description() {
      return `Complete all the Eternity Challenges ${formatInt(5)} times with less than ${formatInt(1)}
      second (game time) in your current Reality.`;
    },
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min() >= 5 &&
      Time.thisReality.totalSeconds <= 1,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 164,
    name: "Infinity times two",
    get description() { return `Get ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Infinities.`; },
    checkRequirement: () => player.infinitied.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Gain ×${formatInt(1024)} more Infinities.`; },
    effect: 1024
  },
  {
    id: 165,
    name: "Perfectly balanced",
    get description() { return `Get a level ${formatInt(5000)} glyph with all glyph level factors equally weighted.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel >= 5000 &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: "Unlock optimal auto glyph level factor adjustment."
  },
  {
    id: 166,
    name: "Nicenice.",
    get description() { return `Get a glyph with level exactly ${formatInt(6969)}.`; },
    checkRequirement: () => gainedGlyphLevel().actualLevel === 6969,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return `+${formatInt(69)} to glyph level.`; },
    effect: 69
  },
  {
    id: 167,
    name: "Mr. Layer? Sorry, you're not on the list",
    get description() { return `Reach ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Reality Machines.`; },
    checkRequirement: () => player.reality.realityMachines.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Gain more Reality Machines based on your current Reality Machines.",
    effect: () => Math.clampMin(1, player.reality.realityMachines.log2())
  },
  {
    id: 168,
    name: "Woah, we're halfway there",
    get description() { return `Get ${formatInt(50)} total Ra Celestial Memory levels.`; },
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return `Get ${formatPercents(0.1)} more memories.`; },
    effect: 1.1
  },
  {
    id: 171,
    name: "The god is delighted",
    description: "Sacrifice every sacrificable glyph type at least once.",
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s > 0),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    get reward() { return `Glyph sacrifice is ${formatX(2)} stronger.`; },
    effect: 2,
  },
  {
    id: 172,
    name: "Hitchhiker's Guide to Reality",
    get description() {
      return `Reality for ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Reality Machines without having
      any Charged Infinity Upgrades, having any equipped glyphs, or buying any Triad Studies.`;
    },
    checkRequirement: () => gainedRealityMachines().gte(Decimal.NUMBER_MAX_VALUE) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeList.length === 0 &&
      player.noTriadStudies,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 173,
    name: "The First Antihistorian",
    get description() { return `Get ${formatInt(Ra.alchemyResourceCap)} of all Alchemy Resources.`; },
    checkRequirement: () => AlchemyResources.all.every(x => x.amount >= Ra.alchemyResourceCap),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 174,
    name: "Don't you already have two of these?",
    description: "Get a Singularity.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE
  },
  {
    id: 175,
    name: "Destroyer of Worlds",
    get description() { return `Get ${formatInt(100000)} Antimatter Galaxies.`; },
    checkRequirement: () => player.galaxies >= 100000,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return `Galaxies are ${formatPercents(0.01)} stronger.`; },
    effect: 1.01
  },
  {
    id: 176,
    name: "dummy achievement 1",
    description: "This one isn't implemented yet.",
    checkRequirement: () => false,
    checkEvent: []
  },
  {
    id: 177,
    name: "dummy achievement 2",
    description: "Neither is this one.",
    checkRequirement: () => false,
    checkEvent: []
  },
  {
    id: 178,
    name: "dummy achievement 3",
    description: "And this last one isn't either.",
    checkRequirement: () => false,
    checkEvent: []
  },
];

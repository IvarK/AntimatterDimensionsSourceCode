"use strict";

GameDatabase.achievements.normal = [
  {
    id: 11,
    name: "You gotta start somewhere",
    tooltip: "Buy a 1st Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 12,
    name: "100 antimatter is a lot",
    tooltip: "Buy a 2nd Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 13,
    name: "Half life 3 CONFIRMED",
    tooltip: "Buy a 3rd Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    tooltip: "Buy a 4th Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 15,
    name: "5 Dimension Antimatter Punch",
    tooltip: "Buy a 5th Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 16,
    name: "We couldn't afford 9",
    tooltip: () => (Enslaved.isRunning
      ? "Buy a 6th Dimension (they never amount to anything)"
      : "Buy a 6th Dimension."),
      checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    },
  {
    id: 17,
    name: "Not a luck related achievement",
    tooltip: "Buy a 7th Dimension.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 18,
    name: "90 degrees to infinity",
    tooltip: () => (Enslaved.isRunning
      ? "Buy an 8th Dimension (don't get used to it)"
      : "Buy an 8th Dimension."),
      checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    },
  {
    id: 21,
    name: "To infinity!",
    tooltip: "Go Infinite.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Start with ${formatInt(100)} antimatter.`,
    effect: 100
  },
  {
    id: 22,
    name: "FAKE NEWS!",
    tooltip: () => `Encounter ${formatInt(50)} different news messages.`,
    checkRequirement: () => player.news.size >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    name: "The 9th Dimension is a lie",
    tooltip: () => `Have exactly ${formatInt(99)} 8th Dimensions.`,
    checkRequirement: () => NormalDimension(8).amount.eq(99),
    reward: "8th Dimensions are 10% stronger.",
    effect: 1.1
  },
  {
    id: 24,
    name: "Antimatter Apocalypse",
    tooltip: () => `Get over ${format(1e80, 0, 0)} antimatter.`,
    checkRequirement: () => player.antimatter.exponent >= 80,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    name: "Boosting to the max",
    tooltip: () => `Buy ${formatInt(10)} Dimension Boosts.`,
    checkRequirement: () => DimBoost.purchasedBoosts >= 10,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    name: "You got past The Big Wall",
    tooltip: "Buy an Antimatter Galaxy.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    name: "Double Galaxy",
    tooltip: () => `Buy ${formatInt(2)} Antimatter Galaxies.`,
    checkRequirement: () => player.galaxies >= 2,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    name: "There's no point in doing that...",
    tooltip: () => `Buy a single 1st Dimension when you have over ${format(1e150)} of them.`,
    checkRequirement: () => NormalDimension(1).amount.exponent >= 150,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    reward: "1st Dimensions are 10% stronger.",
    effect: 1.1
  },
  {
    id: 31,
    name: "I forgot to nerf that",
    tooltip: () => `Get any Dimension multiplier over ${format(1e31)}.`,
    checkRequirement: () => NormalDimensions.all.find(x => x.multiplier.exponent >= 31) !== undefined,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "1st Dimensions are 5% stronger.",
    effect: 1.05
  },
  {
    id: 32,
    name: "The Gods are pleased",
    tooltip: () => `Get over ${formatInt(600)}x from Dimensional Sacrifice outside of Challenge 8.`,
    checkRequirement: () => !NormalChallenge(8).isRunning && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: "Sacrifice is slightly stronger.",
    effect: 0.2
  },
  {
    id: 33,
    name: "That's a lot of infinites",
    tooltip: () => `Reach Infinity ${formatInt(10)} times.`,
    checkRequirement: () => player.infinitied.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    name: "You didn't need it anyway",
    tooltip: "Go Infinite without having any 8th Dimensions.",
    checkRequirement: () => NormalDimension(8).amount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "Dimensions 1-7 are 2% stronger.",
    effect: 1.02
  },
  {
    id: 35,
    name: "Don't you dare sleep",
    tooltip: () => `Be offline for over ${formatInt(6)} hours in a row.`,
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    name: "Claustrophobic",
    tooltip: () => `Go Infinite with just ${formatInt(1)} Antimatter Galaxy.`,
    checkRequirement: () => player.galaxies === 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "Reduces starting tick interval by 2%.",
    effect: 0.98
  },
  {
    id: 37,
    name: "That's FAST!",
    tooltip: () => `Go infinite in under ${formatInt(2)} hours.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalHours <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Start with ${formatInt(1000)} antimatter.`,
    effect: 1000
  },
  {
    id: 38,
    name: "I don't believe in Gods",
    tooltip: "Buy an Antimatter Galaxy without Sacrificing.",
    checkRequirement: () => player.noSacrifices,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    name: "Spreading Cancer",
    tooltip: () => `Buy ${formatInt(10)} Antimatter Galaxies in total while using cancer notation.`,
    checkRequirement: () => player.spreadingCancer >= 10,
    checkEvent: [GAME_EVENT.GALAXY_RESET_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 42,
    name: "Super Sanic",
    tooltip: () => `Have antimatter/sec exceed your current antimatter above ${format(1e63, 0, 0)}.`,
    checkRequirement: () =>
      player.antimatter.exponent >= 63 &&
      NormalDimension(1).productionPerSecond.gt(player.antimatter),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    name: "Zero Deaths",
    tooltip: "Get to Infinity without Dimension shifts, boosts or Antimatter Galaxies in a challenge.",
    checkRequirement: () => player.galaxies === 0 && DimBoost.purchasedBoosts === 0 && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "Dimensions 1-4 are 25% stronger.",
    effect: 1.25
  },
  {
    id: 44,
    name: "Over in 30 Seconds",
    tooltip: () => `Have antimatter/sec exceed your current antimatter
      for ${formatInt(30)} consecutive seconds.`,
    checkRequirement: () => AchievementTimers.marathon1
      .check(NormalDimension(1).productionPerSecond.gt(player.antimatter), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    name: "Faster than a potato",
    tooltip: () => `Get more than ${format(1e29)} ticks per second.`,
    checkRequirement: () => Tickspeed.current.exponent <= -26,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Reduces starting tick interval by 2%.",
    effect: 0.98
  },
  {
    id: 46,
    name: "Multidimensional",
    tooltip: () => `Reach ${format(1e12)} of all Dimensions except the 8th.`,
    checkRequirement: () => NormalDimension(7).amount.exponent >= 12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    name: "Daredevil",
    tooltip: () => `Complete ${formatInt(2)} challenges (not including the first one).`,
    checkRequirement: () => NormalChallenges.all.slice(1).countWhere(c => c.isCompleted) >= 2,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    name: "Antichallenged",
    tooltip: "Complete all the challenges.",
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    reward: "All Dimensions are 10% stronger.",
    effect: 1.1
  },
  {
    id: 51,
    name: "Limit Break",
    tooltip: "Break Infinity.",
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    name: "Age of Automation",
    tooltip: "Max dimension and tickspeed autobuyers.",
    checkRequirement: () => Autobuyers.upgradeable
      .countWhere(a => a.isUnlocked && a.hasMaxedInterval) >= 9,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    name: "Definitely not worth it",
    tooltip: "Max all the autobuyers.",
    checkRequirement: () => Autobuyers.upgradeable
      .concat([Autobuyer.galaxy, Autobuyer.dimboost, Autobuyer.bigCrunch])
      .countWhere(a => a.isUnlocked && a.hasMaxedInterval) >= 12,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    name: "That's FASTER!",
    tooltip: () => `Infinity in ${formatInt(10)} minutes or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Start with ${format(2e5)} antimatter.`,
    effect: 2e5
  },
  {
    id: 55,
    name: "Forever isn't that long",
    tooltip: () => `Infinity in ${formatInt(1)} minute or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Start with ${format(1e10)} antimatter.`,
    effect: 1e10
  },
  {
    id: 56,
    name: "Many Deaths",
    tooltip: () => `Complete the Second Dimension Autobuyer challenge in ${formatInt(3)} minutes or less.`,
    checkRequirement: () => NormalChallenge(2).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `All Dimensions are stronger in the first ${formatInt(3)} minutes of Infinities.`,
    effect: () => 6 / (Time.thisInfinity.totalMinutes + 3),
    effectCondition: () => Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 57,
    name: "Gift from the Gods",
    tooltip: () => `Complete the Eighth Dimension Autobuyer challenge in ${formatInt(3)} minutes or less.`,
    checkRequirement: () => NormalChallenge(8).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "Dimensional sacrifices are a lot stronger.",
    effect: 0.2
  },
  {
    id: 58,
    name: "Is this hell?",
    tooltip: () => `Complete the Tickspeed Autobuyer challenge in ${formatInt(3)} minutes or less.`,
    checkRequirement: () => NormalChallenge(9).isRunning && Time.thisInfinityRealTime.totalMinutes <= 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Boost per buying ${formatInt(10)} Dimensions +1%.`,
    effect: 1.01
  },
  {
    id: 61,
    name: "Bulked Up",
    tooltip: () => `Get all of your Dimension bulk buyers to ${formatInt(512)} or higher.`,
    checkRequirement: () => Autobuyers.dimensions.countWhere(a => !a.isUnlocked || a.bulk < 512) === 0,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 62,
    name: "Oh, hey... You're still here?",
    tooltip: () => `Reach ${format(1e8)} IP per minute.`,
    checkRequirement: () => Player.bestRunIPPM.exponent >= 8,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    name: "A new beginning",
    tooltip: "Begin generation of Infinity power.",
    checkRequirement: () => player.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    name: "1 Million is a lot",
    tooltip: () => `Reach ${format(1e6)} Infinity power.`,
    checkRequirement: () => player.infinityPower.exponent >= 6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 65,
    name: "Not-so-challenging",
    tooltip: () => `Get the sum of all of your challenge times under ${formatInt(3)} minutes.`,
    checkRequirement: () => Time.challengeSum.totalMinutes < 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    reward: () => `All Dimensions are stronger in the first ${formatInt(3)} minutes of infinities,
      but only in challenges.`,
    effect: () => Math.max(4 / (Time.thisInfinity.totalMinutes + 1), 1),
    effectCondition: () => (NormalChallenge.isRunning || InfinityChallenge.isRunning) &&
      Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 66,
    name: "Faster than a squared potato",
    tooltip: () => `Get more than ${format(1e58, 0, 0)} ticks per second.`,
    checkRequirement: () => Tickspeed.current.exponent <= -55,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Reduces starting tick interval by 2%.",
    effect: 0.98
  },
  {
    id: 67,
    name: "Infinitely Challenging",
    tooltip: "Complete an Infinity Challenge.",
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    name: "You did this again just for the achievement right?",
    tooltip: () => `Complete the Third Dimension Autobuyer challenge in ${formatInt(10)} seconds or less.`,
    checkRequirement: () => NormalChallenge(3).isRunning && Time.thisInfinityRealTime.totalSeconds <= 10,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: "1st Dimensions are 50% stronger.",
    effect: 1.5
  },
  {
    id: 71,
    name: "ERROR 909: Dimension not found",
    tooltip: "Get to Infinity with only a single 1st Dimension without Dimension Boosts/Shifts " +
      "or Antimatter Galaxies, while in the Second Dimension Autobuyer Challenge.",
    checkRequirement: () =>
      NormalChallenge(2).isRunning &&
      NormalDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts === 0 &&
      player.galaxies === 0,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `1st Dimensions are ${formatInt(3)} times stronger.`,
    effect: 3
  },
  {
    id: 72,
    name: "Can't hold all these infinities",
    tooltip: () => `Get all Dimension multipliers over ${format(1e308)}.`,
    checkRequirement: () => Array.range(1, 8)
      .every(tier => NormalDimension(tier).multiplier.exponent >= 308),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "All Dimensions are 10% stronger.",
    effect: 1.1
  },
  {
    id: 73,
    name: "THIS ACHIEVEMENT DOESN'T EXIST",
    tooltip: () => `Get ${format("9.9999e9999", 4, 0)} antimatter.`,
    checkRequirement: () => player.antimatter.gte("9.9999e9999"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Dimensions are stronger the more unspent antimatter you have.",
    effect: () => player.antimatter.pow(0.00002).plus(1)
  },
  {
    id: 74,
    name: "End me",
    tooltip: () => `Get the sum of all best challenge times under ${formatInt(5)} seconds.`,
    checkRequirement: () => Time.challengeSum.totalSeconds < 5,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    reward: "All Dimensions are 40% stronger, but only in challenges.",
    effect: 1.4,
    effectCondition: () => NormalChallenge.isRunning || InfinityChallenge.isRunning
  },
  {
    id: 75,
    name: "NEW DIMENSIONS???",
    tooltip: "Unlock the 4th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Your achievement bonus affects Infinity Dimensions.",
    effect: () => Achievements.power
  },
  {
    id: 76,
    name: "One for each dimension",
    tooltip: () => `Play for ${formatInt(8)} days.`,
    checkRequirement: () => Time.totalTimePlayed.totalDays >= 8,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Extremely small multiplier to Dimensions based on time played.",
    effect: () => Math.pow(Time.totalTimePlayed.totalDays / 2, 0.05)
  },
  {
    id: 77,
    name: "How the antitables have turned..",
    tooltip: "Get the 8th Dimension multiplier to be highest, 7th Dimension multiplier second highest, etc.",
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => NormalDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Each Dimension gains a boost proportional to tier (8th dimension gets 8%, 7th gets 7%, etc.)",
  },
  {
    id: 78,
    name: "Blink of an eye",
    tooltip: () => `Get to Infinity in under ${formatInt(200)} milliseconds.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds <= 200,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Start with ${format(2e25, 0, 0)} antimatter ` +
      `and all Dimensions are stronger in the first ${formatInt(300)}ms of Infinities.`,
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
    tooltip: () => `Beat Infinity Challenge 5 in ${formatInt(15)} seconds or less.`,
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds <= 15,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    name: "Anti-antichallenged",
    tooltip: () => `Complete ${formatInt(8)} Infinity Challenges.`,
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    name: "YOU CAN GET 50 GALAXIES?!?!",
    tooltip: () => `Get ${formatInt(50)} Antimatter Galaxies.`,
    checkRequirement: () => player.galaxies >= 50,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Tickspeed is 5% lower per Antimatter Galaxy.",
    effect: () => Decimal.pow(0.95, player.galaxies)
  },
  {
    id: 84,
    name: "I got a few to spare",
    tooltip: () => `Reach ${format("1e35000", 0, 0)} antimatter.`,
    checkRequirement: () => player.antimatter.exponent >= 35000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Dimensions are stronger the more unspent antimatter you have.",
    effect: () => player.antimatter.pow(0.00002).plus(1)
  },
  {
    id: 85,
    name: "ALL YOUR IP ARE BELONG TO US",
    tooltip: () => `Big Crunch for ${format(1e150, 0, 0)} IP.`,
    checkRequirement: () => gainedInfinityPoints().exponent >= 150,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `Additional ${formatInt(4)}x multiplier to IP.`,
    effect: 4
  },
  {
    id: 86,
    name: "Do you even bend time bro?",
    tooltip: () => `Reach -${formatPercents(0.999, 1)} tickspeed per upgrade.`,
    checkRequirement: () => getTickSpeedMultiplier().lt(0.001),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Galaxies are 1% stronger.",
    effect: 1.01
  },
  {
    id: 87,
    name: "2 MILLION INFINITIES",
    tooltip: () => `Infinity ${format(2e6)} times.`,
    checkRequirement: () => player.infinitied.gt(2e6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => `Infinities more than ${formatInt(5)} seconds long
      give ${formatInt(250)} infinitied stat.`,
    effect: 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 88,
    name: "Yet another infinity reference",
    tooltip: () => `Get a ${formatX(Decimal.NUMBER_MAX_VALUE, 1, 0)} multiplier in a single sacrifice.`,
    checkRequirement: () => Sacrifice.nextBoost.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    reward: "Sacrifices are stronger.",
    effect: 0.011,
  },
  {
    id: 91,
    name: "Ludicrous Speed",
    tooltip: () => `Big Crunch for ${format(1e200, 0, 0)} IP in ${formatInt(2)} seconds or less.`,
    checkRequirement: () => gainedInfinityPoints().exponent >= 200 && Time.thisInfinityRealTime.totalSeconds <= 2,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `All Dimensions are significantly stronger in the
      first ${formatInt(5)} seconds of Infinities.`,
    effect: () => Math.max((5 - Time.thisInfinity.totalSeconds) * 60, 1),
    effectCondition: () => Time.thisInfinity.totalSeconds < 5
  },
  {
    id: 92,
    name: "I brake for NOBODY!",
    tooltip: () => `Big Crunch for ${format(1e250, 0, 0)} IP in ${formatInt(20)} seconds or less.`,
    checkRequirement: () => gainedInfinityPoints().exponent >= 250 && Time.thisInfinityRealTime.totalSeconds <= 20,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    reward: () => `All Dimensions are significantly stronger in the
      first ${formatInt(60)} seconds of Infinities.`,
    effect: () => Math.max((1 - Time.thisInfinity.totalMinutes) * 100, 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 1
  },
  {
    id: 93,
    name: "MAXIMUM OVERDRIVE",
    tooltip: () => `Big Crunch with ${format(1e300, 0, 0)} IP/min.`,
    checkRequirement: () => Player.bestRunIPPM.exponent >= 300,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: () => `Additional ${formatInt(4)}x multiplier to IP.`,
    effect: 4
  },
  {
    id: 94,
    name: "4.3333 minutes of Infinity",
    tooltip: () => `Reach ${format(1e260, 0, 0)} infinity power.`,
    checkRequirement: () => player.infinityPower.exponent >= 260,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Double Infinity power gain.",
    effect: 2
  },
  {
    id: 95,
    name: "Is this safe?",
    tooltip: () => `Gain Infinite replicanti in ${formatInt(30)} minutes.`,
    reward: "Infinity doesn't reset your Replicanti amount.",
    checkRequirement: () =>
      (player.replicanti.amount.eq(Decimal.NUMBER_MAX_VALUE) || player.replicanti.galaxies > 0) &&
      Time.thisInfinityRealTime.totalMinutes <= 30,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    name: "Time is relative",
    tooltip: "Go Eternal.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    name: "YES This. Is. Hell.",
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds < 6.66,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    tooltip: () => `Get the sum of Infinity Challenge times under ${format(6.66, 2, 2)} seconds.`
  },
  {
    id: 98,
    name: "0 degrees from Infinity",
    tooltip: "Unlock the 8th Infinity Dimension.",
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    name: "Costco sells Dimboosts now!",
    tooltip: () => `Bulk buy ${formatInt(750)} Dimension Boosts at once.`,
    checkRequirement: ([bulk]) => bulk >= 750,
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    reward: "Dimension Boosts are 1% stronger (to Normal Dimensions).",
    effect: 1.01
  },
  {
    id: 102,
    name: "This mile took an eternity",
    tooltip: "Get all Eternity milestones.",
    checkRequirement: () => EternityMilestones.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 103,
    name: "Tätä saavutusta ei ole olemassa II",
    tooltip: () => `Reach ${format("9.99999e999", 5, 0)} IP.`,
    checkRequirement: () => player.infinityPoints.exponent >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Gain more IP based on amount of antimatter you had when crunching.",
    effect: 307.8
  },
  {
    id: 104,
    name: "That wasn't an eternity",
    tooltip: () => `Eternity in under ${formatInt(30)} seconds.`,
    checkRequirement: () => Time.thisEternity.totalSeconds <= 30,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: () => `Start Eternities with ${format(2e25)} IP.`,
    effect: 2e25
  },
  {
    id: 105,
    name: "Infinite Time",
    tooltip: () => `Get ${formatInt(308)} tickspeed upgrades (in one Eternity) from Time Dimensions.`,
    checkRequirement: () => player.totalTickGained >= 308,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions are affected slightly by tickspeed.",
    effect: () => Tickspeed.current.div(1000).pow(0.000005).reciprocate()
  },
  {
    id: 106,
    name: "The swarm",
    tooltip: () => `Get ${formatInt(10)} Replicanti galaxies in ${formatInt(15)} seconds.`,
    checkRequirement: () => Replicanti.galaxies.total >= 10 && Time.thisInfinity.totalSeconds <= 15,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    name: "Do you really need a guide for this?",
    tooltip: () => `Eternity with the infinitied stat under ${formatInt(10)}.`,
    checkRequirement: () => player.infinitied.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    name: "We COULD afford 9",
    tooltip: () => `Eternity with exactly ${formatInt(9)} Replicanti.`,
    checkRequirement: () => player.replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    name: "Yo dawg, I heard you liked infinities...",
    tooltip: () => `Have all your Infinities in your past ${formatInt(10)} Infinities be at least ` +
      `${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} times higher IP than the previous one.`,
    checkRequirement: () => {
      const infinities = player.lastTenRuns.map(run => run[1]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(Decimal.NUMBER_MAX_VALUE)) || infinities[i].eq(0)) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: "Your antimatter doesn't reset on Dimension Boost/Shift/Galaxy."
  },
  {
    id: 112,
    name: "Never again",
    tooltip: () => `Get the sum of Infinity Challenge times below ${formatInt(750)}ms.`,
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds < 750,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    name: "Long lasting relationship",
    tooltip: () => "Have your Infinity power per second exceed your Infinity power " +
      `for ${formatInt(60)} consecutive seconds during a single Infinity.`,
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
    tooltip: "Fail an Eternity challenge.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    reward: "A fading sense of accomplishment.",
    effect: () => "Sense of accomplishment (fading)"
  },
  {
    id: 115,
    name: "I wish I had gotten 7 eternities",
    tooltip: "Start an Infinity Challenge inside an Eternity Challenge.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 116,
    name: "Do I really need to infinity",
    tooltip: () => `Eternity with only ${formatInt(1)} Infinity.`,
    checkRequirement: () => player.infinitied.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: "Multiplier to IP based on Infinities.",
    effect: () => Decimal.pow(Player.totalInfinitied.clampMin(1), LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap
  },
  {
    id: 117,
    name: "8 nobody got time for that",
    tooltip: "Eternity without buying Dimensions 1-7.",
    checkRequirement: () => player.onlyEighthDimensions,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 118,
    name: "IT'S OVER 9000",
    tooltip: () => `Get a total sacrifice multiplier of ${format("1e9000", 0, 0)}.`,
    checkRequirement: () => Sacrifice.totalBoost.exponent >= 9000,
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    reward: "Sacrifice doesn't reset your Dimensions.",
  },
  {
    id: 121,
    name: "Can you get infinite IP?",
    tooltip: () => `Reach ${format("1e30008", 0, 0)} IP.`,
    checkRequirement: () => player.infinityPoints.exponent >= 30008,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    name: "You're already dead.",
    tooltip: "Eternity without buying Dimensions 2-8.",
    checkRequirement: () => player.onlyFirstDimensions,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    name: "5 more eternities until the update",
    tooltip: () => `Complete ${formatInt(50)} unique Eternity Challenge tiers.`,
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    name: "Eternities are the new infinity",
    tooltip: () => `Eternity in under ${formatInt(200)}ms.`,
    checkRequirement: () => Time.thisEternity.totalMilliseconds <= 200,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 125,
    name: "Like feasting on a behind",
    tooltip: () => `Reach ${format(1e90, 0, 0)} IP without having any Infinities ` +
      "or buying any 1st Dimensions in your current Eternity.",
    checkRequirement: () => player.infinityPoints.exponent >= 90 &&
      player.noFirstDimensions && player.infinitied.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "IP multiplier based on time spent this Infinity.",
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return Decimal.pow(2, Math.log(thisInfinity) * Math.min(Math.pow(thisInfinity, 0.11), 500));
    },
    cap: () => Effarig.eternityCap
  },
  {
    id: 126,
    name: "Popular music",
    tooltip: () => `Have ${formatInt(180)} times more Replicanti Galaxies than Antimatter Galaxies.`,
    checkRequirement: () => Replicanti.galaxies.total >= 180 * player.galaxies && player.galaxies > 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => "Replicanti galaxies divide your Replicanti by " +
      `${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} instead of resetting them to ${formatInt(1)}.`,
  },
  {
    id: 127,
    name: "But I wanted another prestige layer...",
    tooltip: () => `Reach ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} EP.`,
    checkRequirement: () => player.eternityPoints.gte(Decimal.NUMBER_MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    name: "What do I have to do to get rid of you",
    tooltip: () => `Reach ${format("1e22000", 0, 0)} IP without any time studies.`,
    checkRequirement: () => player.infinityPoints.exponent >= 22000 && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Time Dimensions are multiplied by the number of studies you have.",
    effect: () => Math.max(player.timestudy.studies.length, 1)
  },
  {
    id: 131,
    name: "No ethical consumption",
    tooltip: () => `Get ${format(5e9)} banked Infinities.`,
    checkRequirement: () => player.infinitiedBank.gt(5e9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: "After Eternity you permanently keep 5% of your Infinities.",
    effect: () => player.infinitied.times(0.05).floor()
  },
  {
    id: 132,
    name: "Unique snowflakes",
    tooltip: () => `Have ${formatInt(630)} Antimatter Galaxies without having any Replicanti Galaxies.`,
    checkRequirement: () => player.galaxies >= 630 && player.replicanti.galaxies === 0,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Gain a multiplier to Tachyon Particle and Dilated Time gain based on Antimatter Galaxies.",
    effect: () => Math.max(Math.pow(player.galaxies, 0.04), 1)
  },
  {
    id: 133,
    name: "I never liked this infinity stuff anyway",
    tooltip: () => `Reach ${format("1e200000", 0, 0)} IP without buying IDs or IP multipliers.`,
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
    tooltip: () => `Reach ${format("1e20000", 0, 0)} Replicanti.`,
    checkRequirement: () => player.replicanti.amount.exponent >= 20000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: () => `You gain Replicanti ${formatInt(2)} times faster
      under ${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} Replicanti.`
  },
  {
    id: 135,
    name: "Faster than a potato^286078",
    tooltip: () => `Get more than ${format("1e8296262", 0, 0)} ticks per second.`,
    checkRequirement: () => Tickspeed.current.exponent <= -8296262,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    name: "I told you already, time is relative",
    tooltip: "Dilate time.",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 137,
    name: "Now you're thinking with dilation!",
    tooltip: () => `Eternity for ${format("1e600", 0, 0)} EP
      in ${formatInt(1)} minute or less while Dilated.`,
    checkRequirement: () =>
      gainedEternityPoints().exponent >= 600 &&
      Time.thisEternity.totalMinutes <= 1 &&
      player.dilation.active,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    reward: () => `Gain ${formatInt(2)}x Dilated Time and Time Theorems while Dilated.`,
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    name: "This is what I have to do to get rid of you.",
    tooltip: () => `Reach ${format("1e26000", 0, 0)} IP without any time studies while Dilated.`,
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      player.infinityPoints.exponent >= 26000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    reward: "Removes the downsides from the active and idle time study paths."
  },
  {
    id: 141,
    name: "Snap back to reality",
    tooltip: "Make a new Reality.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    reward: () => `${formatInt(4)}x IP gain and boost from
      buying ${formatInt(10)} Dimensions +${format(0.1, 0, 1)}.`,
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    name: "How does this work?",
    tooltip: "Unlock the automator.",
    checkRequirement: () => player.realities >= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    reward: "Dimension Boosts are 50% stronger.",
    effect: 1.5,
  },
  {
    id: 143,
    name: "Yo dawg, I heard you liked reskins...",
    tooltip: () => `Have all your Eternities in your past ${formatInt(10)} Eternities be at least ` +
      `${format(Decimal.NUMBER_MAX_VALUE, 1, 0)} times higher EP than the previous one.`,
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
    tooltip: "Unlock the Black Hole."
  },
  {
    id: 145,
    name: "Are you sure these are the right way around?",
    tooltip: "Have the Black Hole interval smaller than the duration.",
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval < bh.duration),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT
  },
  {
    id: 146,
    name: "Perks of living",
    tooltip: "Have all perks bought.",
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT
  },
  {
    id: 147,
    name: "Master of Reality",
    tooltip: "Have all Reality upgrades bought.",
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    reward: "Unlock Teresa, the Celestial of Reality."
  },
  {
    id: 148,
    name: "Royal flush",
    tooltip: "Reality with one of each basic glyph type.",
    checkRequirement: () => BASIC_GLYPH_TYPES
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE
  },
  {
    id: 151,
    name: "You really didn't need it anyway",
    tooltip: () => `Get ${formatInt(800)} Antimatter Galaxies without
      buying 8th Dimensions in your current Infinity.`,
    checkRequirement: () => player.galaxies >= 800 && player.noEighthDimensions,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Unlock V, the Celestial of Achievements."
  },
  {
    id: 152,
    name: "Y'all got any more of them glyphs?",
    tooltip: () => `Have ${formatInt(100)} glyphs in your inventory.`,
    checkRequirement: () => Glyphs.inventoryList.length === 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    name: "The god is delighted",
    tooltip: "Sacrifice every glyph type at least once.",
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s > 0),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 154,
    name: "I am speed",
    tooltip: () => `Reality in under ${formatInt(5)} seconds (game time).`,
    checkRequirement: () => Time.thisReality.totalSeconds <= 5,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE
  },
  {
    id: 155,
    name: "Achievement #15983",
    tooltip: "Play for 13.7 billion years.",
    checkRequirement: () => Time.totalTimePlayed.totalYears > 13.7e9,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 156,
    name: "College Dropout",
    tooltip: "Reality without buying time theorems.",
    checkRequirement: () => player.noTheoremPurchases,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE
  },
  {
    id: 157,
    name: "Perfectly Balanced",
    tooltip: () => `Have the same number of all 3 types of galaxy,
      with ${formatInt(1000)} or more of each type.`,
    checkRequirement: () => player.galaxies === Replicanti.galaxies.total &&
      player.galaxies === player.dilation.freeGalaxies &&
      player.galaxies >= 1000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 158,
    name: "Bruh, are you like, inside the hole?",
    tooltip: () => `Spend ${formatInt(24)} hours with black hole active in a row.`,
    checkRequirement: () => TimeSpan.fromSeconds(BlackHole(1).phase).totalHours >= 24,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
];

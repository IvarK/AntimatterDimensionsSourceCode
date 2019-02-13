GameDatabase.achievements.normal = [
  {
    id: 11,
    name: "You gotta start somewhere",
    tooltip: "Buy a single 1st Dimension."
  },
  {
    id: 12,
    name: "100 antimatter is a lot",
    tooltip: "Buy a single 2nd Dimension."
  },
  {
    id: 13,
    name: "Half life 3 confirmed",
    tooltip: "Buy a single 3rd Dimension."
  },
  {
    id: 14,
    name: "L4D: Left 4 Dimensions",
    tooltip: "Buy a single 4th Dimension."
  },
  {
    id: 15,
    name: "5 Dimension Antimatter Punch",
    tooltip: "Buy a single 5th Dimension."
  },
  {
    id: 16,
    name: "We couldn't afford 9",
    tooltip: "Buy a single 6th Dimension."
  },
  {
    id: 17,
    name: "Not a luck related achievement",
    tooltip: "Buy a single 7th Dimension."
  },
  {
    id: 18,
    name: "90 degrees to infinity",
    tooltip: "Buy a single 8th Dimension."
  },
  {
    id: 21,
    name: "To infinity!",
    tooltip: "Reach Infinite antimatter. Reward: Start with 100 antimatter.",
    effect: () => 100
  },
  {
    id: 22,
    name: "Fake News",
    tooltip: "Encounter 50 different news messages."
  },
  {
    id: 23,
    name: "The 9th Dimension is a lie",
    tooltip: "Have exactly 99 8th Dimensions. Reward: 8th Dimensions are 10% stronger.",
    effect: () => 1.1
  },
  {
    id: 24,
    name: "Antimatter Apocalypse",
    tooltip: () => `Get over ${shorten(1e80, 0, 0)} antimatter.`
  },
  {
    id: 25,
    name: "Boosting to the max",
    tooltip: "Buy 10 Dimension Boosts."
  },
  {
    id: 26,
    name: "You got past The Big Wall",
    tooltip: "Buy an Antimatter Galaxy."
  },
  {
    id: 27,
    name: "Double Galaxy",
    tooltip: "Buy 2 Antimatter Galaxies."
  },
  {
    id: 28,
    name: "There's no point in doing that",
    tooltip: () => `Buy a single 1st Dimension when you have over ${shorten(1e150, 0, 0)} of them. Reward: 1st Dimensions are 10% stronger.`,
    effect: () => 1.1
  },
  {
    id: 31,
    name: "I forgot to nerf that",
    tooltip: () => `Get any Dimension multiplier over ${shorten(1e31, 0, 0)}. Reward: 1st Dimensions are 5% stronger.`,
    effect: () => 1.05
  },
  {
    id: 32,
    name: "The Gods are pleased",
    tooltip: "Get over 600x from Dimensional Sacrifice in total. Reward: Sacrifice is slightly stronger.",
    effect: () => 0.2
  },
  {
    id: 33,
    name: "That's a lot of infinites",
    tooltip: "Reach Infinity 10 times."
  },
  {
    id: 34,
    name: "You didn't need it anyway",
    tooltip: "Reach Infinite antimatter without having any 8th Dimensions. Reward: Dimensions 1-7 are 2% stronger.",
    effect: () => 1.02
  },
  {
    id: 35,
    name: "Don't you dare to sleep",
    tooltip: "Be offline for over 6 hours in a row.",
  },
  {
    id: 36,
    name: "Claustrophobic",
    tooltip: "Go Infinite with just 1 Antimatter Galaxy. Reward: Reduces starting tick interval by 2%.",
    effect: () => 0.98
  },
  {
    id: 37,
    name: "That's fast!",
    tooltip: "Go infinite in under 2 hours. Reward: Start with 1000 antimatter.",
    effect: () => 1000
  },
  {
    id: 38,
    name: "I don't believe in Gods",
    tooltip: "Buy an Antimatter Galaxy without Sacrificing."
  },
  {
    id: 41,
    name: "Spreading Cancer",
    tooltip: "Buy ten Antimatter Galaxies in total while using cancer notation."
  },
  {
    id: 42,
    name: "Supersanic",
    tooltip: () => `Have antimatter/sec exceed your current antimatter above ${shorten(1e63, 0, 0)}`
  },
  {
    id: 43,
    name: "Zero Deaths",
    tooltip: "Get to Infinity without Dimension shifts, boosts or Antimatter Galaxies in a challenge. Reward: Dimensions 1-4 are 25% stronger.",
    effect: () => 1.25
  },
  {
    id: 44,
    name: "Over in 30 seconds",
    tooltip: "Have antimatter/sec exceed your current antimatter for 30 consecutive seconds."
  },
  {
    id: 45,
    name: "Faster than a potato",
    tooltip: () => `Get more than ${shorten(1e29, 0, 0)} ticks per second. Reward: Reduces starting tick interval by 2%.`,
    effect: () => 0.98
  },
  {
    id: 46,
    name: "Multidimensional",
    tooltip: () => `Reach ${shorten(1e12, 0, 0)} of all Dimensions except the 8th.`
  },
  {
    id: 47,
    name: "Daredevil",
    tooltip: "Complete 2 challenges."
  },
  {
    id: 48,
    name: "AntiChallenged",
    tooltip: "Complete all the challenges. Reward: All Dimensions are 10% stronger.",
    effect: () => 1.1
  },
  {
    id: 51,
    name: "Limit Break",
    tooltip: "Break Infinity."
  },
  {
    id: 52,
    name: "Age of Automation",
    tooltip: "Max any 9 autobuyers."
  },
  {
    id: 53,
    name: "Definitely not worth it",
    tooltip: "Max all the autobuyers."
  },
  {
    id: 54,
    name: "That's faster!",
    tooltip: "Infinity in 10 minutes or less. Reward: Start with 200000 antimatter.",
    effect: () => 2e5
  },
  {
    id: 55,
    name: "Forever isn't that long",
    tooltip: "Infinity in 1 minute or less. Reward: Start with 1e10 antimatter.",
    effect: () => 1e10
  },
  {
    id: 56,
    name: "Many Deaths",
    tooltip: "Complete the Second Dimension Autobuyer challenge in 3 minutes or less. Reward: All Dimensions are stronger in the first 3 minutes of Infinities.",
    effect: () => 6 / (Time.thisInfinity.totalMinutes + 3),
    effectCondition: () => Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 57,
    name: "Gift from the Gods",
    tooltip: "Complete the Eighth Dimension Autobuyer challenge in 3 minutes or less. Reward: Dimensional sacrifices are a lot stronger.",
    effect: () => 0.2
  },
  {
    id: 58,
    name: "Is this hell?",
    tooltip: "Complete the Tickspeed Autobuyer challenge in 3 minutes or less. Reward: Boost per 10 Dimensions +1%.",
    effect: () => 1.01
  },
  {
    id: 61,
    name: "Bulked up",
    tooltip: "Get all of your Dimension bulk buyers to 512 or higher."
  },
  {
    id: 62,
    name: "Oh hey, you're still here",
    tooltip: "Reach 1e8 IP per minute."
  },
  {
    id: 63,
    name: "A new beginning.",
    tooltip: "Begin generation of Infinity power."
  },
  {
    id: 64,
    name: "1 million is a lot",
    tooltip: "Reach 1e6 Infinity power."
  },
  {
    id: 65,
    name: "Not-so-challenging",
    tooltip: "Get the sum of all of your challenge times under 3 minutes. Reward: All Dimensions are stronger in the first 3 minutes of infinities, but only in challenges.",
    effect: () => Math.max(4 / (Time.thisInfinity.totalMinutes + 1), 1),
    effectCondition: () => player.currentChallenge !== "" && Time.thisInfinity.totalMinutes < 3
  },
  {
    id: 66,
    name: "Faster than a squared potato",
    tooltip: () => `Get more than ${shorten(1e58, 0, 0)} ticks per second. Reward: Reduces starting tick interval by 2%.`,
    effect: () => 0.98
  },
  {
    id: 67,
    name: "Infinitely Challenging",
    tooltip: "Complete an Infinity Challenge."
  },
  {
    id: 68,
    name: "You did this again just for the achievement right?",
    tooltip: "Complete the Third Dimension Autobuyer challenge in 10 seconds or less. Reward: 1st Dimensions are 50% stronger.",
    effect: () => 1.5
  },
  {
    id: 71,
    name: "ERROR 909: Dimension not found",
    tooltip: "Get to Infinity with only a single 1st Dimension without Dimension Boosts/Shifts or Antimatter Galaxies, while in the Automatic Antimatter Galaxies Challenge. Reward: 1st Dimensions are 3 times stronger.",
    effect: () => 3
  },
  {
    id: 72,
    name: "Can't hold all these infinities",
    tooltip: "Get all Dimension multipliers over 1e308. Reward: All Dimensions are 10% stronger.",
    effect: () => 1.1
  },
  {
    id: 73,
    name: "This achievement doesn't exist",
    tooltip: "Get 9.9999e9999 antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.",
    effect: () => player.money.pow(0.00002).clampMin(1)
  },
  {
    id: 74,
    name: "End me",
    tooltip: "Get the sum of all best challenge times under 5 seconds. Reward: All Dimensions are 40% stronger, but only in challenges.",
    effect: () => 1.4,
    effectCondition: () => player.currentChallenge !== ""
  },
  {
    id: 75,
    name: "NEW DIMENSIONS???",
    tooltip: "Unlock the 4th Infinity Dimension. Reward: Your achievement bonus affects Infinity Dimensions.",
    effect: () => player.achPow.pow(getAdjustedGlyphEffect("effarigachievement"))
  },
  {
    id: 76,
    name: "One for each dimension",
    tooltip: "Play for 8 days. Reward: Extremely small multiplier to Dimensions based on time played.",
    effect: () => Math.pow(Time.totalTimePlayed.totalDays / 2, 0.05)
  },
  {
    id: 77,
    name: "How the antitables have turned",
    tooltip: "Get the 8th Dimension multiplier to be highest, 7th Dimension multiplier second highest, etc. Reward: Each Dimension gains a boost proportional to tier (8th dimension gets 8%, 7th gets 7%, etc.)"
  },
  {
    id: 78,
    name: "Blink of an eye",
    tooltip: () => `Get to Infinity in under 200 milliseconds. Reward: Start with ${shorten(1e25, 0, 0)} antimatter and all Dimensions are stronger in the first 300ms of Infinities.`,
    effect: () => 330 / (Time.thisInfinity.totalMilliseconds + 30),
    effectCondition: () => Time.thisInfinity.totalMilliseconds < 300,
    secondaryEffect: () => 1e25
  },
  {
    id: 81,
    name: "Hevipelle did nothing wrong",
    tooltip: "Beat Infinity Challenge 5 in 10 seconds or less."
  },
  {
    id: 82,
    name: "Anti-antichallenged",
    tooltip: "Complete 8 Infinity Challenges."
  },
  {
    id: 83,
    name: "YOU CAN GET 50 GALAXIES!??",
    tooltip: "Get 50 Antimatter Galaxies. Reward: Tickspeed is 5% lower per Antimatter Galaxy.",
    effect: () => Math.pow(0.95, player.galaxies)
  },
  {
    id: 84,
    name: "I got a few to spare",
    tooltip: () => `Reach ${shorten("1e35000", 0, 0)} antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.`,
    effect: () => player.money.pow(0.00004).clampMin(1)
  },
  {
    id: 85,
    name: "All your IP are belong to us",
    tooltip: () => `Big Crunch for ${shorten(1e150, 0, 0)} IP. Reward: Additional 4x multiplier to IP.`,
    effect: () => 4
  },
  {
    id: 86,
    name: "Do you even bend time bro?",
    tooltip: "Reach -99.9% tickspeed per upgrade. Reward: Galaxies are 1% more powerful.",
    effect: () => 1.01
  },
  {
    id: 87,
    name: "2 Million Infinities",
    tooltip: "Infinity 2000000 times. Reward: Infinities more than 5 seconds long give 250 infinitied stat.",
    effect: () => 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 88,
    name: "Yet another infinity reference",
    tooltip: () => `Get a ${formatX(Number.MAX_VALUE, 1, 0)} multiplier in a single sacrifice. Reward: Sacrifices are stronger.`,
    effect: () => 0.011
  },
  {
    id: 91,
    name: "Ludicrous Speed",
    tooltip: () => `Big Crunch for ${shorten(1e200, 0, 0)} IP in 2 seconds or less. Reward: All Dimensions are significantly stronger in the first 5 seconds of Infinities.`,
    effect: () => Math.max((5 - Time.thisInfinity.totalSeconds) * 60, 1),
    effectCondition: () => Time.thisInfinity.totalSeconds < 5
  },
  {
    id: 92,
    name: "I brake for nobody",
    tooltip: () => `Big Crunch for ${shorten(1e250, 0, 0)} IP in 20 seconds or less. Reward: All Dimensions are significantly stronger in the first 60 seconds of Infinities.`,
    effect: () => Math.max((1 - Time.thisInfinity.totalMinutes) * 100, 1),
    effectCondition: () => Time.thisInfinity.totalMinutes < 1
  },
  {
    id: 93,
    name: "MAXIMUM OVERDRIVE",
    tooltip: () => `Big Crunch with ${shorten(1e300, 0, 0)} IP/min. Reward: Additional 4x multiplier to IP.`,
    effect: () => 4
  },
  {
    id: 94,
    name: "4.3333 minutes of Infinity",
    tooltip: () => `Reach ${shorten(1e260, 0, 0)} infinity power. Reward: Double Infinity power gain.`,
    effect: () => 2
  },
  {
    id: 95,
    name: "Is this safe?",
    tooltip: "Gain Infinite replicanti in 30 minutes. Reward: Infinity doesn't reset your Replicanti amount."
  },
  {
    id: 96,
    name: "Time is relative",
    tooltip: "Go Eternal."
  },
  {
    id: 97,
    name: "Yes. This is hell.",
    tooltip: "Get the sum of Infinity Challenge times under 6.66 seconds."
  },
  {
    id: 98,
    name: "0 degrees from infinity",
    tooltip: "Unlock the 8th Infinity Dimension."
  },
  {
    id: 101,
    name: "Costco sells dimboosts now",
    tooltip: "Bulk buy 750 Dimension Boosts at once. Reward: Dimension Boosts are 1% more powerful (to Normal Dimensions).",
    effect: () => 1.01
  },
  {
    id: 102,
    name: "This mile took an Eternity",
    tooltip: "Get all Eternity milestones."
  },
  {
    id: 103,
    name: "This achievement doesn't exist II",
    tooltip: "Reach 9.99999e999 IP. Reward: Gain more IP based on amount of antimatter you had when crunching.",
    effect: () => 307.8
  },
  {
    id: 104,
    name: "That wasn't an eternity",
    tooltip: "Eternity in under 30 seconds. Reward: Start Eternities with 2e25 IP.",
    effect: () => 2e25
  },
  {
    id: 105,
    name: "Infinite time",
    tooltip: "Get 308 tickspeed upgrades (in one Eternity) from Time Dimensions. Reward: Time Dimensions are affected slightly by tickspeed.",
    effect: () => player.tickspeed.div(1000).pow(0.000005).reciprocate()
  },
  {
    id: 106,
    name: "The swarm",
    tooltip: "Get 10 Replicanti galaxies in 15 seconds."
  },
  {
    id: 107,
    name: "Do you really need a guide for this?",
    tooltip: "Eternity with the infinitied stat under 10."
  },
  {
    id: 108,
    name: "We could afford 9",
    tooltip: "Eternity with exactly 9 Replicanti."
  },
  {
    id: 111,
    name: "Yo dawg, I heard you liked infinities...",
    tooltip: () => `Have all your Infinities in your past 10 Infinities be at least ${shorten(Number.MAX_VALUE, 1, 0)} times higher IP than the previous one. Reward: Your antimatter doesn't reset on Dimension Boost/Shift/Galaxy.`
  },
  {
    id: 112,
    name: "Never again",
    tooltip: "Max out your third Eternity upgrade. Reward: The limit for it is a bit higher.",
    effect: () => 610
  },
  {
    id: 113,
    name: "Long lasting relationship",
    tooltip: "Have your Infinity power per second exceed your Infinity power for 60 consecutive seconds during a single Infinity."
  },
  {
    id: 114,
    name: "You're a mistake",
    tooltip: "Fail an Eternity challenge. Reward: A fading sense of accomplishment.",
    effect: () => "Accomplishm"
  },
  {
    id: 115,
    name: "I wish I had gotten 7 eternities",
    tooltip: "Start an Infinity Challenge inside an Eternity Challenge."
  },
  {
    id: 116,
    name: "Do I really need to infinity",
    tooltip: "Eternity with only 1 Infinity. Reward: Multiplier to IP based on Infinities.",
    effect: () => Decimal.pow(2, Player.totalInfinitied.plus(1).log10())
  },
  {
    id: 117,
    name: "8 nobody got time for that",
    tooltip: "Eternity without buying Dimensions 1-7."
  },
  {
    id: 118,
    name: "IT'S OVER 9000",
    tooltip: () => `Get a total sacrifice multiplier of ${shorten("1e9000", 0, 0)}. Reward: Sacrifice doesn't reset your Dimensions.`
  },
  {
    id: 121,
    name: "Can you get infinite IP?",
    tooltip: () => `Reach ${shorten("1e30008", 0, 0)} IP.`
  },
  {
    id: 122,
    name: "You're already dead.",
    tooltip: "Eternity without buying Dimensions 2-8."
  },
  {
    id: 123,
    name: "5 more eternities until the update",
    tooltip: "Complete 50 unique Eternity Challenge tiers."
  },
  {
    id: 124,
    name: "Eternities are the new infinity",
    tooltip: "Eternity in under 200ms."
  },
  {
    id: 125,
    name: "Like feasting on a behind",
    tooltip: () => `Reach ${shorten(1e100, 0, 0)} IP without any Infinities or 1st Dimensions. Reward: IP multiplier based on time spent this Infinity.`,
    effect: function() {
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return Decimal.pow(2, Math.log(thisInfinity) * Math.min(Math.pow(thisInfinity, 0.11), 500));
    }
  },
  {
    id: 126,
    name: "Popular music",
    tooltip: () => `Have 180 times more Replicanti Galaxies than Antimatter Galaxies. Reward: Replicanti galaxies divide your Replicanti by ${shorten(Number.MAX_VALUE, 1, 0)} instead of resetting them to 1.`
  },
  {
    id: 127,
    name: "But I wanted another prestige layer...",
    tooltip: () => `Reach ${shorten(Number.MAX_VALUE, 1, 0)} EP.`
  },
  {
    id: 128,
    name: "What do I have to do to get rid of you",
    tooltip: () => `Reach ${shorten("1e22000", 0, 0)} IP without any time studies. Reward: Time Dimensions are multiplied by the number of studies you have.`,
    effect: () => Math.max(player.timestudy.studies.length, 1)
  },
  {
    id: 131,
    name: "No ethical consumption",
    tooltip: "Get 5 billion banked Infinities. Reward: After Eternity you permanently keep 5% of your Infinities.",
    effect: () => Decimal.floor(player.infinitied.mul(0.05))
  },
  {
    id: 132,
    name: "Unique snowflakes",
    tooltip: "Have 630 Antimatter Galaxies without having any Replicanti Galaxies. Reward: Gain a multiplier to Dilated Time gain based on Antimatter Galaxies.",
    effect: () => Math.max(Math.pow(player.galaxies, 0.04), 1)
  },
  {
    id: 133,
    name: "I never liked this infinity stuff anyway",
    tooltip: () => `Reach ${shorten("1e200000", 0, 0)} IP without buying IDs or IP multipliers. Reward: You start Eternities with all Infinity Challenges unlocked and completed.`
  },
  {
    id: 134,
    name: "When will it be enough?",
    tooltip: () => `Reach ${shorten("1e20000", 0, 0)} Replicanti. Reward: You gain Replicanti 2 times faster under ${shorten(Number.MAX_VALUE, 1, 0)} Replicanti.`
  },
  {
    id: 135,
    name: "Faster than a potato^286078",
    tooltip: () => `Get more than ${shorten("1e8296262", 0, 0)} ticks per second.`
  },
  {
    id: 136,
    name: "I told you already, time is relative",
    tooltip: "Dilate time."
  },
  {
    id: 137,
    name: "Now you're thinking with dilation!",
    tooltip: () => `Eternity for ${shorten("1e600", 0, 0)} EP in 1 minute or less while Dilated.`
  },
  {
    id: 138,
    name: "This is what I have to do to get rid of you.",
    tooltip: () => `Reach ${shorten("1e28000", 0, 0)} IP without any time studies while Dilated. Reward: The active time study path doesn't disable your Replicanti autobuyer.`
  },
  {
    id: 141,
    name: "Snap back to reality",
    tooltip: "Make a new Reality. Reward: 4x IP gain and boost from buying 10 Dimensions +0.1",
    effect: () => 4,
    secondaryEffect: () => 0.1
  },
  {
    id: 142,
    name: "How does this work?",
    tooltip: "Unlock the automator. Reward: Dimension Boosts are 50% more effective.",
    effect: () => 1.5
  },
  {
    id: 143,
    name: "Yo dawg, I heard you liked reskins...",
    tooltip: () => `Have all your Eternities in your past 10 Eternities be at least ${shorten(Number.MAX_VALUE, 1, 0)} times higher EP than the previous one. Reward: nothing right now.`
  },
  {
    id: 144,
    name: "Is this an Interstellar reference?",
    tooltip: "Unlock the Wormhole"
  },
  {
    id: 145,
    name: "Are you sure these are the right way around?",
    tooltip: "Have Wormhole interval smaller than the duration"
  },
  {
    id: 146,
    name: "Perks of living",
    tooltip: "Have all perks bought"
  },
  {
    id: 147,
    name: "Master of Reality",
    tooltip: "Have all Reality upgrades bought"
  },
  {
    id: 148,
    name: "Royal Flush",
    tooltip: "Reality with one of each glyph type"
  },
  {
    id: 151,
    name: "Transcension sucked anyway",
    tooltip: "Sacrifice a Transcendent glyph",
  },
  {
    id: 152,
    name: "Personal Space",
    tooltip: "Have 100 glyphs in your inventory",
  },
  {
    id: 153,
    name: "Do I really have to do this?",
    tooltip: "Have 0 glyphs in your inventory and 100 or more realities"
  },
  {
    id: 154,
    name: "I didn't even realize how fast you are",
    tooltip: "Reality in under 3 seconds"
  },
  {
    id: 155,
    name: "Why did you have to add RNG to the game?",
    tooltip: "Get a Celestial glyph"
  },
  {
    id: 156,
    name: "True Sacrifice",
    tooltip: "Sacrifice a Celestial glyph"
  },
  {
    id: 157,
    name: "I'm up all night to get lucky",
    tooltip: "Have 100 rare or better glyphs"
  },
  {
    id: 158,
    name: "Bruh, are you like, inside the hole?",
    tooltip: "Spend 24 hours with wormhole active in a row"
  },
];
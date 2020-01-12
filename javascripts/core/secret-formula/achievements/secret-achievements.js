"use strict";

GameDatabase.achievements.secret = [
  {
    id: 11,
    name: "The first one's always free",
    tooltip: "Click on this achievement."
  },
  {
    id: 12,
    name: "Just in case",
    tooltip: "Save 100 times without refreshing."
  },
  {
    id: 13,
    name: "It pays to have respect",
    tooltip: "Pay respects."
  },
  {
    id: 14,
    name: "So do I",
    tooltip: "Say something naughty."
  },
  {
    id: 15,
    name: "Do a barrel roll!",
    tooltip: "Do a barrel roll.",
  },
  {
    id: 16,
    name: "Do you enjoy pain?",
    tooltip: "Use a \"painful\" notation for 10 real-time minutes after having eternitied at least once.",
    checkRequirement: () => AchievementTimers.pain
      .check(PlayerProgress.eternityUnlocked() && Notations.current.isPainful, 600),
    checkEvent: GameEvent.GAME_TICK_AFTER
  },
  {
    id: 17,
    name: "30 Lives",
    tooltip: "Input the konami code."
  },
  {
    id: 18,
    name: "Do you feel lucky? Well do ya punk?",
    tooltip: "You have a 1/100,000 chance of getting this achievement every second."
  },
  {
    id: 21,
    name: "Go study in real life instead",
    tooltip: "Purchase the secret time study."
  },
  {
    id: 22,
    name: "Cancer = Spread",
    tooltip: "Buy 100,000 Antimatter Galaxies in total while using cancer notation.",
    checkRequirement: () => player.spreadingCancer >= 1e5,
    checkEvent: GameEvent.GALAXY_RESET_AFTER
  },
  {
    id: 23,
    name: "Stop right there criminal scum!",
    tooltip: "Open the console."
  },
  {
    id: 24,
    name: "Real news",
    tooltip: "Click on a news ticker message that does something when you click on it."
  },
  {
    id: 25,
    name: "Shhh... It's a secret",
    tooltip: "Discover a secret theme."
  },
  {
    id: 26,
    name: "You're a failure",
    tooltip: "Fail eternity challenges 10 times without refreshing. What are you doing with your life...",
    checkRequirement: (function() {
      let count = 0;
      return () => ++count >= 10;
    }()),
    checkEvent: GameEvent.CHALLENGE_FAILED
  },
  {
    id: 27,
    name: "It's not called matter dimensions is it?",
    tooltip: "Get Infinite matter.",
    checkRequirement: () => Player.effectiveMatterAmount.gte(Decimal.MAX_NUMBER),
    checkEvent: GameEvent.GAME_TICK_AFTER
  },
  {
    id: 28,
    name: "Nice.",
    tooltip: "Don't act like you don't know what you did."
  },
  {
    id: 31,
    name: "You should download some more RAM",
    tooltip: "Set your update rate to 200ms."
  },
  {
    id: 32,
    name: "Less than or equal to 0.001",
    tooltip: "Get a fastest infinity or eternity time of less than or equal to 0.001 seconds.",
    checkRequirement: () =>
      Time.bestInfinity.totalMilliseconds <= 1 ||
      Time.bestEternity.totalMilliseconds <= 1,
    checkEvent: [GameEvent.BIG_CRUNCH_BEFORE, GameEvent.ETERNITY_RESET_BEFORE]
  },
  {
    id: 33,
    name: "A sound financial decision",
    tooltip: "Click on the donate link."
  },
  {
    id: 34,
    name: "You do know how these work, right?",
    tooltip: "Respec with an empty study tree."
  },
  {
    id: 35,
    name: "Should we tell them about buy max...",
    tooltip: "Buy single tickspeed 100,000 times.",
    checkRequirement: () => player.secretUnlocks.why >= 1e5,
    checkEvent: GameEvent.GAME_TICK_AFTER
  },
  {
    id: 36,
    name: "While you were away... Nothing happened.",
    tooltip: "Have nothing happen while you were away."
  },
  {
    id: 37,
    name: "You followed the instructions",
    tooltip: "Follow instructions."
  },
  {
    id: 38,
    name: "Professional bodybuilder",
    tooltip: "Get all your dimension bulk buyers to 1e100.",
    checkRequirement: () => Autobuyers.dimensions.countWhere(a => !a.hasMaxedBulk) === 0
  },
  {
    id: 41,
    name: "That dimension doesn’t exist",
    tooltip: "Try to purchase the 9th dimension."
  },
  {
    id: 42,
    name: "SHAME ON ME",
    tooltip: "Try to enter EC12 within Time Compression."
  },
  {
    id: 43,
    name: "Time fixes everything",
    tooltip: "Fix infinity while dilated.",
    checkRequirement: () => player.dilation.active,
    checkEvent: GameEvent.FIX_INFINITY
  },
  {
    id: 44,
    name: "Are you statisfied now?",
    tooltip: "Stare intently at the statistics tab for 15 real-time minutes.",
    checkRequirement: () => AchievementTimers.stats.check(Tab.statistics.isOpen, 900),
    checkEvent: GameEvent.GAME_TICK_AFTER
  },
  {
    id: 45,
    name: "This dragging is dragging on",
    tooltip: "Drag the perks around for a minute.",
    checkRequirement: () => player.secretUnlocks.dragging++ / 100 >= 60
  },
  {
    id: 46,
    name: "s46",
    tooltip: "s46"
  },
  {
    id: 47,
    name: "s47",
    tooltip: "s47"
  },
  {
    id: 48,
    name: "s48",
    tooltip: "s48"
  },
];

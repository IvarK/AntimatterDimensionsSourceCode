import { GameDatabase } from "../../game-database";

GameDatabase.celestials.quotes.v = {
  initial: {
    id: 1,
    lines: [
      "How pathetic..."
    ],
  },
  unlock: {
    id: 2,
    lines: [
      "Welcome to my Reality.",
      "I am surprised you could reach it.",
      "This is my realm after all...",
      "Not everyone is as great as me.",
    ],
  },
  realityEnter: {
    id: 3,
    lines: [
      "Good luck with that!",
      "You will need it.",
      "My reality is flawless. You will fail.",
    ],
  },
  realityComplete: {
    id: 4,
    lines: [
      "So fast...",
      "Do not think so much of yourself.",
      "This is just the beginning.",
      "You will never be better than me.",
    ],
  },
  achievement1: {
    id: 5,
    requirement: () => V.spaceTheorems >= 1,
    lines: [
      "Only one? Pathetic.",
      "Your accomplishments pale in comparison to mine.",
    ],
  },
  achievement6: {
    id: 6,
    requirement: () => V.spaceTheorems >= 6,
    lines: [
      "This is nothing.",
      "Do not be so full of yourself.",
    ],
  },
  hex1: {
    id: 7,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 1,
    lines: [
      "Do not think it will get any easier from now on.",
      "You are awfully proud for such a little achievement.",
    ],
  },
  achievement12: {
    id: 8,
    requirement: () => V.spaceTheorems >= 12,
    lines: [
      "How did you...",
      "This barely amounts to anything!",
      "You will never complete them all.",
    ],
  },
  achievement24: {
    id: 9,
    requirement: () => V.spaceTheorems >= 24,
    lines: [
      "Impossible...",
      "After how difficult it was for me...",
    ],
  },
  hex3: {
    id: 10,
    requirement: () => player.celestials.v.runUnlocks.filter(a => a === 6).length >= 3,
    lines: [
      "No... No... No...",
      "This cannot be...",
    ],
  },
  allAchievements: {
    id: 11,
    requirement: () => V.spaceTheorems >= 36,
    lines: [
      "I... how did you do it...",
      "I worked so hard to get them...",
      "I am the greatest...",
      "No one is better than me...",
      "No one... no one... no on-",
    ],
  }
};

export const enslaved = {
  // These entries will be unlocked in no particular order
  progress: {
    hintsUnlocked: {
      id: 0,
      hint: "The Nameless Ones want to help, but the help takes a while.",
      condition: () => `Spent more than ${formatInt(5)} real-time hours inside the Reality without completing it;
        time outside the Reality counts for ${formatPercents(0.4)} as much. The timer starts once the
        Reality is unlocked, but accumulates continuously.`,
    },
    ec1: {
      id: 1,
      hint: "That's odd, the Automatic Eternity Challenge perk seems to be having some trouble working properly.",
      condition: () => `Gained more than ${formatInt(5)} completions of Eternity Challenge 1 at once`,
    },
    feelEternity: {
      id: 2,
      hint: "Infinity seems to be more broken than usual in this Reality, but is that even fixable?",
      condition: "Tried to Fix Infinity, but instead found and clicked the FEEL ETERNITY button",
    },
    ec6: {
      id: 3,
      hint: `Some Challenges are harder, but also boost something in exchange. I wonder if there's a Challenge
        that's just strictly better than normal here.`,
      condition: () => `Entered Eternity Challenge 6 again after completing it ${formatInt(5)} times in order
        to use its cheaper Replicanti Galaxies`,
    },
    c10: {
      id: 4,
      hint: "Is there a way to get Antimatter Galaxies without 8th Antimatter Dimensions?",
      condition: "Used Challenge 10 to get more than one Antimatter Galaxy with 6th Antimatter Dimensions",
    },
    secretStudy: {
      id: 5,
      hint: "Time Study 12? What's that?",
      condition: () => `Clicked the secret Time Study and gained an extra ${formatInt(100)} Time Theorems`,
    },
    storedTime: {
      id: 6,
      hint: "It seems like certain parts of this Reality erode away if you wait long enough.",
      condition: "Discharged to have more than a year of game time this Reality",
    },
    challengeCombo: {
      id: 7,
      hint: "Could I possibly use one Challenge to get around a restriction in another Challenge?",
      condition: "Entered Challenge 10 while already inside of Eternity Challenge 6",
    },
  },
  // These get unlocked sequentially
  glyphHints: [
    "Infinity and Dilation Glyphs seem confined too tightly to be useful at all.",
    "Power and Time Glyphs are particularly strong here.",
    `Effarig Glyphs are only useful with the right effects, but you can complete the Reality without one.
      A Replication Glyph is very helpful, but it's not strictly necessary or quite as strong
      as Power and Time.`
  ]
};

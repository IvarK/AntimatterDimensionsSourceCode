"use strict";

GameDatabase.celestials.enslaved = {
  // Note that "condition" isn't displayed in-game. These are meant to be indicators here of
  // precisely what the game is checking in order to reward the progress.
  // These entries will be unlocked in no particular order
  progress: {
    hintsUnlocked: {
      id: 0,
      progress: "Unlocked Enslaved Hints",
      hint: "The Enslaved Ones want to help, but the help takes a while.",
      condition: `Spent more than 5 real-time hours inside the Reality without completing it; time outside the reality
        counts for 4% as much. The timer accumulates and only starts once Enslaved's Reality is unlocked.`,
    },
    ec1: {
      id: 1,
      progress: "\"Completed\" Eternity Challenge 1 more than five times at once",
      hint: "That's odd, AutoEC seems to have some trouble working properly.",
      condition: "Gained more than 5 completions of EC1 at once",
    },
    feelEternity: {
      id: 2,
      progress: "Tried to Fix Infinity, but then experienced Eternity",
      hint: "Infinity seems to be more broken than usual in this Reality, but is that even fixable?",
      condition: "Clicked the FEEL ETERNITY button",
    },
    ec6: {
      id: 3,
      progress: "Took advantage of cheaper Replicanti Galaxy scaling in an Eternity Challenge",
      hint: "Some challenges are hard but also boost something in exchange, I wonder if there's a challenge " +
        "that's just strictly better than normal here.",
      condition: "Entered EC6 again after completing it 5 times",
    },
    c10: {
      id: 4,
      progress: "Gained some Antimatter Galaxies using 6th Antimatter Dimensions",
      hint: "Is there a way to get Antimatter Galaxies without 8th Antimatter Dimensions?",
      condition: "Used Challenge 10 to get more than one Antimatter Galaxy",
    },
    secretStudy: {
      id: 5,
      progress: "Found some extra secret Time Theorems",
      hint: "Time Study 12? What's that?",
      condition: "Clicked the secret Time Study",
    },
    storedTime: {
      id: 6,
      progress: "Spent years waiting for the Reality to continue on",
      hint: "It seems like certain parts of this Reality erode away if you wait long enough.",
      condition: "Discharged to have more than a year of game time this Reality",
    },
    challengeCombo: {
      id: 7,
      progress: "\"Exploited\" an interaction between a Normal Challenge and an Eternity Challenge",
      hint: "Could I possibly use one challenge to get around a restriction in another challenge?",
      condition: "Entered C10 while already inside of EC6",
    },
  },
  // These get unlocked sequentially
  glyphHints: [
    "Infinity and Dilation Glyphs seem confined too tightly to be useful at all.",
    "Power and Time Glyphs are particularly strong here.",
    "Effarig Glyphs are only useful with the right effects, but you can complete the Reality without one. " +
      "A Replication Glyph is very helpful, but it's not strictly necessary or quite as strong " +
      "as Power and Time."]
};

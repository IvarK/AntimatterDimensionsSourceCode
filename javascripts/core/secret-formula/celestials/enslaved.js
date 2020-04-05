"use strict";

GameDatabase.celestials.enslaved = {
  // Note that "condition" isn't displayed in-game. These are meant to be indicators here of
  // precisely what the game is checking in order to reward the progress.
  // These entries will be unlocked in no particular order
  progress: {
    hintsUnlocked: {
      id: 0,
      progress: "Unlocked a helping hand",
      hint: "The Enslaved Ones want to help, but the help takes a while.",
      condition: "Spent more than 4 real-time hours without completing the Reality",
    },
    ec1: {
      id: 1,
      progress: "\"Completed\" Eternity Challenge 1",
      hint: "That's odd, AutoEC seems to have some trouble working properly.",
      condition: "Gained more than 5 completions of EC1 at once",
    },
    feelEternity: {
      id: 2,
      progress: "Experienced Eternity",
      hint: "Infinity seems to be more broken than usual in this Reality, but is that even fixable?",
      condition: "Clicked the FEEL ETERNITY button",
    },
    ec6: {
      id: 3,
      progress: "Took advantage of cheaper scaling in an Eternity Challenge",
      hint: "Some challenges are harder but also boost something in exchange, I wonder if that's useful somewhere.",
      condition: "Entered EC6 again after completing it 5 times",
    },
    c10: {
      id: 4,
      progress: "Gained some galaxies using lower dimensions",
      hint: "Wasn't there a way to get galaxies without 8th dimensions?",
      condition: "Used Challenge 10 to get more than one antimatter galaxy",
    },
    secretStudy: {
      id: 5,
      progress: "Found some extra Time Theorems",
      hint: "Time Study 12? What's that?",
      condition: "Clicked the secret time study",
    },
    storedTime: {
      id: 6,
      progress: "Spent years waiting for the Reality to continue on",
      hint: "It seems like certain parts of this Reality erode away if you wait long enough.",
      condition: "Discharged to have more than a year of game time this Reality",
    },
    challengeCombo: {
      id: 7,
      progress: "\"Exploited\" an interaction between different challenges",
      hint: "Could I possibly use one challenge to make another challenge easier?",
      condition: "Entered C10 while already inside of EC6",
    },
  },
  // These get unlocked sequentially
  glyphHints: [
    "Infinity and Dilation glyphs seem confined too tightly to be useful, but time glyphs seem especially strong.",
    "Glyph set hint 2 placeholder."]
};
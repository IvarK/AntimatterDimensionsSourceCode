import { GameDatabase } from "../../game-database";

GameDatabase.celestials.quotes.laitela = {
  unlock: {
    id: 0,
    lines: [
      "You finally reached me.",
      "I guess it is time to reveal to you,",
      "The secrets hidden beneath existence.",
      "The omnipresent ruling perfection. Continuum.",
      "And the binding keys to the multiverse,",
      "Dark Matter and Dark Energy.",
      "My knowledge is endless and my wisdom divine.",
      "So you can play around all you want.",
      "I am Lai'tela, the Celestial of Dimensions,",
      "And I will be watching you forever.",
    ]
  },
  firstDestabilize: {
    id: 1,
    requirement: () => player.celestials.laitela.difficultyTier >= 1,
    lines: [
      "It is fine. Unlike the others, I never had a Reality.",
      "I built this one just now, precisely so it would collapse.",
      "I can rebuild this Reality over and over, unlike them.",
      "I could trap all of them if I wanted.",
      "You will never find a way to overpower me.",
    ]
  },
  firstSingularity: {
    id: 2,
    requirement: () => Currency.singularities.gte(1),
    lines: [
      "It is weird, how all beings question things.",
      "You are different. You can build and manipulate Dimensions.",
      "Were you truly once one of them?",
      "You have taken control of the darkness so quickly.",
      "Molded them into Dimensions and Points just like one of us.",
      "What... ARE you?",
    ]
  },
  singularity1: {
    id: 3,
    requirement: () => Currency.singularities.gte(1e4),
    lines: [
      "What was it again...? Antimatter?",
      "That was the first thing you turned into Dimensions?",
      "It could not have been an accident.",
      "How did you... attain the power to control it?",
      "This never happened in all of existence... or did it?",
      "My endless knowledge... is it waning?",
    ]
  },
  // Note: This happens around e10-e11 singularities
  annihilation: {
    id: 4,
    lines: [
      "Back to square one.",
      "We, the Celestials transcend time and existence.",
      "We always know that whatever is lost always comes back eventually.",
      "Even if we were to cease, we would just come back stronger.",
      "The cycle... repeats forever.",
      "Do they also understand? Or was it only you as well?",
      "I feel like I should know the answer...",
    ]
  },
  singularity2: {
    id: 5,
    requirement: () => Currency.singularities.gte(1e14),
    lines: [
      "Of those who tried to control dimensions...",
      "Who were they? I cannot seem to remember...",
      "And how... did they vanish?",
      "Are they... us? Simply transcending existence?",
      "Did they surpass us and become something we can't comprehend?",
      "Are we all imprisoned in this falsity...",
    ]
  },
  // Note: This happens near e18 singularities
  halfDimensions: {
    id: 6,
    requirement: () => player.celestials.laitela.difficultyTier >= 4,
    lines: [
      "You seem to be having too much fun.",
      "Just like they did before meeting their... fate.",
      "You freed them of their eternal imprisonment, yes?",
      "I always regret how harsh I was that day.",
      "Maybe it doesn't matter.",
      "But I digress. Let's keep constricting this Reality.",
    ]
  },
  // Note: This about when the player starts on the last row of iM upgrades
  singularity3: {
    id: 7,
    requirement: () => Currency.singularities.gte(1e26),
    lines: [
      "Is this a cycle?",
      "Will our existence just end and start anew...",
      "Just like... the Dimensions I rule?",
      "And if such... what will bring our end?",
      "I knew the answer to all these questions...",
      "But I forgot all of them...",
      "Your power... is it... erasing mine...?",
    ]
  },
  // Note: This is around when all infinite milestones hit increased scaling
  singularity4: {
    id: 8,
    requirement: () => Currency.singularities.gte(1e40),
    lines: [
      "I don't know for how much... longer I can hold.",
      "There is... next to nothing left...",
      "You have attained... complete and total mastery... over the dark...",
      "While I can barely... hold onto my name anymore...",
      "What am I meant to be doing anyways?",
      "Did... my mistakes cause all of this?",
    ]
  },
  fullDestabilize: {
    id: 9,
    requirement: () => player.celestials.laitela.difficultyTier >= 8,
    lines: [
      "I feel... like I had something to say...",
      "Who am I? I am not sure...",
      "I cannot... hold onto the darkness any longer...",
      "I... have nothing left...",
      "Something about... destabilizing... collapsing...",
      "The end...",
    ]
  },
};

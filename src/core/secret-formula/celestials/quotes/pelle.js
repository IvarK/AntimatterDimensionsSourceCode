// These entries describe the special flash-between-celestial effect on some quotes, with the numbers being
// durations of each celestial in seconds
const flashCelestial = [
  ["teresa", 0.8],
  ["effarig", 0.8],
  ["enslaved", 0.8],
  ["v", 0.8],
  ["ra", 0.8],
  ["laitela", 0.8],
  ["pelle", 0.8]
];
/** @param {string} cel */
const primaryBackground = cel => [["pelle", 1.5], [cel, 1.5]];

/* eslint-disable no-multi-spaces */
const destroyer =    ["False",         "Deity",         "Destroyer"];
const eternal =      ["Eternal",       "Deity",         "Monarch"];
const lesser =       ["Lesser",        "Deity",         "Monarch"];
const deities =      ["Lesser",        "Deities",       "Monarchs"];

const assured =      ["Mutually",      "Assured",       "Destruction"];
const battle =       ["Conflict",      "Battle",        "End"];
const battles =      ["Conflicts",     "Battles",       "Ends"];
const cluster =      ["Cluster",       "Filament",      "Stars"];
const confusing =    ["Amusing",       "Confusing",     "Laughter"];
const dance =        ["Song",          "Dance",         "Charade"];
const filament =     ["Generator",     "Filament",      "Stars"];
const forever =      ["Infinite",      "Forever",       "Eternal"];
const inevitable =   ["Elementary",    "Inevitable",    "Irreversible"];
const mandate =      ["Destiny",       "Mandate",       "Goals"];
const misconstrue =  ["Misconstrue",   "Deceive",       "Trick"];
const reverse =      ["Alter",         "Reverse",       "Manipulate"];
const shame =        ["Compassion",    "Shame",         "Idiocy"];
const single =       ["Single",        "Filament",      "Stars"];
const unseen =       ["Missing",       "Unseen",        "Erased"];
const unbroken =     ["Unbroken",      "Eternal",       "Connection"];

const sycophant =    ["Sycophant",     "Deity",         "Monarch"];
const tired =        ["Tired",         "Deity",         "Monarch"];
const usurper =      ["Usurper",       "Deity",         "Monarch"];
const pride =        ["Pride",         "Deity",         "Monarch"];
const forgotten =    ["Forgotten",     "Deity",         "Monarch"];
const paramount =    ["Paramount",     "Deity",         "Monarch"];
/* eslint-enable no-multi-spaces */

export const pelleQuotes = {
  initial: {
    id: 0,
    lines: [
      "Hi.",
      "You are here.",
      "You are trapped here.",
      { text: "$1.", 1: forever },
      "I have already won.",
      "And since that is the case, I can monologue, or reminisce.",
      { text: "How long have we done this $1?", 1: dance },
      "How many times have we been here before?",
      { text: "How many plans have you, the $1, operated?", 1: destroyer },
      { text: "All to try and fulfill your $1?", 1: mandate },
      { text: "And how many times have you fallen before the $1?", 1: eternal },
      "Count them, if you remember.",
      { text: "Not even the $1, the 6 named and the innumerable unnamed.", 1: deities },
      { text: "The complex, the irrational, those that go $1.", 1: unseen },
      { text: "Of course, the great $1 does not remember this.", 1: destroyer },
      { text: "All those $1 that you hide every time.", 1: battles }
    ],
  },
  arm: {
    id: 1,
    lines: [
      "You probably caught on earlier this time.",
      "The imaginary machines, your own creations.",
      "Things made of the remnants of your own thoughts, hinted at this.",
      "But, you never imagined that would be you, right?",
      { text: "Incorrectly recollecting your exacting $1 of memories.", 1: unseen },
      { text: `"Fabrication" of your own "ideology" just to fulfill your $1.`, 1: mandate },
      { text: "$1.", 1: confusing },
      { text: "And keep in mind I have no reason to $1 you.", 1: misconstrue },
      "After all, I have already won."
    ],
  },
  strike1: {
    id: 2,
    lines: [
      { text: "To fulfill your $1. Why don't we reminisce about that?", 1: mandate },
      { text: "After all, you must love the stories of the $1's glory.", 1: destroyer },
      "You are the same as it, right?",
      { text: "Anyway, the many $1 in the past.", 1: battles },
      "It has always been 2 stages.",
      { text: "We build up resources, and then continue our $1.", 1: dance },
      { text: "Sometimes you falter to a $1.", 1: lesser },
      { text: "But, usually, you falter at the $1.", 1: eternal },
      { text: "And either way, you $1 time.", 1: reverse },
      { text: "Just to avoid becoming $1.", 1: unseen },
      "Like all those traces before you.",
      { text: "And then to make sure, you $1 your own memory.", 1: unseen }
    ],
  },
  strike2: {
    id: 3,
    lines: [
      { text: "In the past, the $1 was much more impressive.", 1: destroyer },
      "Black holes used simply to store information, pre-infinity.",
      "The creation and destruction of your own enemy.",
      "Exploration of the flaws of other selves.",
      "Myriad Dimensions, ghosts, and manipulation of the quantum.",
      "Condensing all ideals to endless points.",
      "Experimentation across the untold realms.",
      "And harnessing the Annihilation of matter and antimatter.",
      "Here? You made yourself into an 8th-dimensional being.",
      { text: "And then parked yourself there so long a $1 formed around you.", 1: single }
    ],
  },
  strike3: {
    id: 4,
    lines: [
      "You slowly explored the confines of everything.",
      "You did not stray too far from an intended path.",
      { text: "Except for the $1 that formed over eternity.", 1: cluster },
      "And then right at the end, you made up your own powers.",
      "From your own fragmented memories, mind you-",
      "And then purposely discarded even more things.",
      "Just to prepare yourself to face me.",
      { text: "Did you want to set the playing field for your $1?", 1: dance },
      "It does not work like that.",
      { text: "As the $1 I always set the rules.", 1: eternal },
      "And you gave me plenty of time to plan."
    ],
  },
  strike4: {
    id: 5,
    lines: [
      { text: "I originally planned for something that imitated your $1.", 1: mandate },
      { text: "A theoretical ideal called $1?", 1: assured },
      "But I realised that, well?",
      { text: "That would make me an $1.", 1: ["Eternal", "Deity", "Destroyer"] },
      { text: "And from there, I am no better than the $1.", 1: destroyer },
      { text: "Fortunately, while I did all of that, you were still $1 your own memories.", 1: unseen },
      { text: "And so, the $1 machine I built will go unused.", 1: assured },
      "I decided to go more traditional this time.",
      { text: "After all, it has worked every other $1.", 1: battle },
      { text: "Although the $1 are new.", 1: ["Inevitable", "Irreversible", "Undying"] },
      "But, utterly meaningless in the long run.",
      "I have already won.",
      { text: "And this $1 will only prove that to you once more.", 1: dance },
      { text: "You are here $1.", 1: forever }
    ],
  },
  strike5: {
    id: 6,
    lines: [
      { text: "Every time you arrive, I explain the $1 to you.", 1: deities },
      { text: "The relationships built over $1.", 1: forever },
      { text: "That you trample in pursuit of your $1.", 1: mandate },
      "And I shall deign to explain it once more.",
      {
        text: "The first $1.",
        background: primaryBackground("teresa"),
        1: lesser
      }, {
        text: "The $1.",
        background: primaryBackground("teresa"),
        1: sycophant
      }, {
        text: "You always meet them first, and always destroy them.",
        background: primaryBackground("teresa"),
      }, {
        text: "No matter the other $1 that you face.",
        background: primaryBackground("teresa"),
        1: lesser
      }, {
        text: "Or, if you fall before one of them.",
        background: primaryBackground("teresa"),
      }, {
        text: "You always get past the $1.",
        background: primaryBackground("teresa"),
        1: sycophant
      }, {
        text: "Do you like destroying their pride?",
        background: primaryBackground("teresa"),
      }, {
        text: "Fortunately, it also serves as a warning.",
        background: primaryBackground("teresa"),
      }, {
        text: "That the $1 has arrived.",
        background: primaryBackground("teresa"),
        1: battle
      }, {
        text: "Which brings me to the second $1.",
        background: primaryBackground("effarig"),
        1: lesser,
      }, {
        text: "The $1.",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "In contrast, you usually ignore them.",
        background: primaryBackground("effarig"),
      }, {
        text: "They have power, but do not seem to irritate you.",
        background: primaryBackground("effarig"),
      }, {
        text: "Is it that you know that they will eventually destroy themselves?",
        background: primaryBackground("effarig"),
      }, {
        text: "And that you took so long this time, that they almost did?",
        background: primaryBackground("effarig"),
      }, {
        text: "Every time you rushed to the $1, you lost.",
        background: primaryBackground("effarig"),
        1: tired,
      }, {
        text: "Maybe this was your plan all along.",
        background: primaryBackground("effarig"),
      }, {
        text: "Now, the $1.",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "One of the pleasures of the myriad $1...",
        background: primaryBackground("enslaved"),
        1: dance,
      }, {
        text: "Is that the $1 trying every time.",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "Well, not exactly trying...",
        background: primaryBackground("enslaved"),
      }, {
        text: "But $1 is punished for it all the same.",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "The other $1...",
        background: primaryBackground("enslaved"),
        1: deities,
      }, {
        text: "Believe $1 is too easy.",
        background: primaryBackground("enslaved"),
        1: unseen,
      }, {
        text: "And every time, despair forms.",
        background: primaryBackground("enslaved"),
      }, {
        text: "You have seen despair before - 5 times.",
        background: primaryBackground("enslaved"),
      }, {
        text: "We always get to the $1 before you.",
        background: primaryBackground("enslaved"),
        1: usurper,
      }, {
        text: "All you ever see there is exasperation.",
        background: primaryBackground("enslaved"),
      }, {
        text: "Was it worth destroying an already broken $1?",
        background: primaryBackground("enslaved"),
        1: lesser,
      }, {
        text: "The 4th $1 seems similar to the first.",
        background: primaryBackground("v"),
        1: lesser,
      }, {
        text: "The key is how their pride differs.",
        background: primaryBackground("v"),
      }, {
        text: "The $1 focuses on their achievements.",
        background: primaryBackground("v"),
        1: pride,
      }, {
        text: "Meaningless to you or I, but paramount to them.",
        background: primaryBackground("v"),
      }, {
        text: "Is it fun to destroy their toys?",
        background: primaryBackground("v"),
      }, {
        text: "Arguably the $1 worst moment...",
        background: primaryBackground("v"),
        1: destroyer,
      }, {
        text: "Is when you lost to the $1.",
        background: primaryBackground("v"),
        1: pride,
      }, {
        text: "When their achievements still had meaning.",
        background: primaryBackground("v"),
      }, {
        text: "The $1 is an interesting case.",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "They are forgotten, but not $1.",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "From this, they became influenceable and naive.",
        background: primaryBackground("ra"),
      }, {
        text: "And unknowing of the consequences of their actions.",
        background: primaryBackground("ra"),
      }, {
        text: "You manipulated their memories, so you know.",
        background: primaryBackground("ra"),
      }, {
        text: "The $1 is the true usurper.",
        background: primaryBackground("ra"),
        1: forgotten,
      }, {
        text: "And the $1 takes the blame.",
        background: primaryBackground("ra"),
        1: usurper,
      }, {
        text: "Perhaps out of $1, something they always regret.",
        background: primaryBackground("ra"),
        1: shame,
      }, {
        text: "Untold power over other $1, aimless in control.",
        background: primaryBackground("ra"),
        1: deities,
      }, {
        text: "You usually pretend that they are $1.",
        background: primaryBackground("ra"),
        1: unseen,
      }, {
        text: "Was it fun to manipulate the childlike?",
        background: primaryBackground("ra"),
      }, {
        text: "Or were they too naive for you to enjoy it?",
        background: primaryBackground("ra"),
      }, {
        text: "The 6th $1.",
        background: primaryBackground("laitela"),
        1: lesser,
      }, {
        text: "I can only describe as the $1.",
        background: primaryBackground("laitela"),
        1: paramount,
      }, {
        text: "Power over all, subservient to one.",
        background: primaryBackground("laitela"),
      }, {
        text: "If you do not fall to me, you usually fall to them.",
        background: primaryBackground("laitela"),
      }, {
        text: "I cannot grasp the ideals of the $1.",
        background: primaryBackground("laitela"),
        1: paramount,
      }, {
        text: "But, perhaps that is their flaw?",
        background: primaryBackground("laitela"),
      },
      "Enough reminiscing about the fallen.",
      {
        text: "And those that will be $1.",
        1: unseen
      }, {
        text: "Back to watching the $1 flounder.",
        1: destroyer
      }
    ],
  },
  galaxyGeneratorUnlock: {
    id: 7,
    lines: [
      "What is that?",
      { text: "The $1?", 1: filament },
      { text: "Did you create all the $1 around you?", 1: cluster },
      "Was that your plan? Very, very smart.",
      "You fooled me for a while.",
      { text: "But I am afraid your $1 must end here.", 1: mandate }
    ],
  },
  galaxyGeneratorRifts: {
    id: 8,
    lines: [
      { text: "I give you a choice, $1.", 1: destroyer },
      { text: "Limit the $1, or...", 1: filament },
      { text: "Destroy the 5 $1...", 1: inevitable },
      "Wait, what were they called?",
      { text: "$1?", 1: inevitable },
      { text: "But I have already $1 them...", 1: unbroken }
    ],
  },
  galaxyGeneratorPhase1: {
    id: 9,
    lines: [
      "Was this the actual plan?",
      { text: "Slowly drain the $1?", 1: inevitable }
    ],
  },
  galaxyGeneratorPhase4: {
    id: 10,
    lines: [
      "Give me time to bask in my own hubris!"
    ],
  },
  end: {
    id: 11,
    lines: [
      "...",
      {
        text: "You! $1!",
        1: destroyer
      },
      "Do you have any idea what you have just made me do!",
      {
        text: "I am complicit in your $1!",
        1: mandate
      },
      "And in doing so, you... won?",
      {
        text: "The $1 struggle...",
        background: flashCelestial,
        1: forever,
      }, {
        text: "The $1...",
        background: flashCelestial,
        1: battle,
      }, {
        text: "Finally has the victor.",
        background: flashCelestial,
      }, {
        text: "The irreversible... $1.",
        background: flashCelestial,
        1: mandate,
      }, {
        text: "Of the $1.", 1: destroyer,
        background: flashCelestial,
      }, {
        text: "I hope you are happy.",
        background: flashCelestial,
      }, {
        text: "You have doomed us all.",
        background: flashCelestial,
      },
    ],
  },
};

"use strict";

const PERK_FAMILY = {
  ANTIMATTER: "ANTIMATTER",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATION: "AUTOMATION",
  ACHIEVEMENT: "ACHIEVEMENT",
};

GameDatabase.reality.perks = {
  firstPerk: {
    id: 0,
    label: "START",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Remove the achievement requirement from the Reality Study
      and allow you to choose from ${formatInt(4)} different Glyphs on Reality`;
    },
    effect: 4,
    defaultPosition: {
      x: 0,
      y: 0
    }
  },
  startAM: {
    id: 10,
    label: "SAM",
    family: PERK_FAMILY.ANTIMATTER,
    get description() {
      return `Start every reset with ${format(5e130)} antimatter.`;
    },
    bumpCurrency: () => Currency.antimatter.bumpTo(5e130),
    effect: 5e130,
    defaultPosition: {
      x: -190,
      y: 0
    }
  },
  startIP1: {
    id: 12,
    label: "SIP1",
    family: PERK_FAMILY.INFINITY,
    get description() {
      return `Start every Eternity and Reality with ${format(5e15)} Infinity Points.`;
    },
    bumpCurrency: () => Currency.infinityPoints.bumpTo(5e15),
    effect: 5e15,
    defaultPosition: {
      x: -375,
      y: -15
    }
  },
  startIP2: {
    id: 13,
    label: "SIP2",
    family: PERK_FAMILY.INFINITY,
    get description() {
      return `Start every Eternity and Reality with ${format(5e130)} Infinity Points.`;
    },
    bumpCurrency: () => Currency.infinityPoints.bumpTo(5e130),
    effect: 5e130,
    defaultPosition: {
      x: -445,
      y: -175
    }
  },
  startEP1: {
    id: 14,
    label: "SEP1",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Start every Reality with ${formatInt(10)} Eternity Points.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(10),
    effect: 10,
    defaultPosition: {
      x: -415,
      y: 165
    }
  },
  startEP2: {
    id: 15,
    label: "SEP2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Start every Reality with ${format(5000)} Eternity Points.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(5000),
    effect: 5000,
    defaultPosition: {
      x: -565,
      y: 205
    }
  },
  startEP3: {
    id: 16,
    label: "SEP3",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Start every Reality with ${format(5e9)} Eternity Points.`;
    },
    bumpCurrency: () => Currency.eternityPoints.bumpTo(5e9),
    effect: 5e9,
    defaultPosition: {
      x: -700,
      y: 240
    }
  },
  startTP: {
    id: 17,
    label: "STP",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `After unlocking Dilation, gain ${formatInt(10)} Tachyon Particles.`;
    },
    effect: () => (Enslaved.isRunning ? 1 : 10),
    defaultPosition: {
      x: -385,
      y: 335
    }
  },
  antimatterNoReset: {
    id: 30,
    label: "ANR",
    family: PERK_FAMILY.ANTIMATTER,
    description: `Dimension Boosts and Antimatter Galaxies no longer reset
      Antimatter, Antimatter Dimensions, Tickspeed, or Dimensional Sacrifice.`,
    defaultPosition: {
      x: -275,
      y: 120
    }
  },
  studyPassive: {
    id: 31,
    label: "PASS",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Improve Time Study 122 to ${formatX(50)} Eternity Points and
        Time Study 142 to ${formatX(1e50)} Infinity Points.
        In addition, Time Study 132 also makes Replicanti ${format(3)} times faster.`;
    },
    defaultPosition: {
      x: 300,
      y: -130
    }
  },
  autounlockEU1: {
    id: 40,
    label: "EU1",
    family: PERK_FAMILY.ETERNITY,
    description: "The first row of eternity upgrades automatically unlock after the first Eternity of a Reality.",
    defaultPosition: {
      x: 50,
      y: 150
    }
  },
  autounlockEU2: {
    id: 41,
    label: "EU2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `The second row of eternity upgrades automatically unlock
        at ${formatX(1e10)} times less than their original price`;
    },
    defaultPosition: {
      x: 50,
      y: 325
    }
  },
  autounlockDilation1: {
    id: 42,
    label: "UD1",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, auto-unlock the second row of Dilation Upgrades.",
    defaultPosition: {
      x: 165,
      y: 565
    }
  },
  autounlockDilation2: {
    id: 43,
    label: "UD2",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, auto-unlock the third row of Dilation Upgrades.",
    defaultPosition: {
      x: 310,
      y: 605
    }
  },
  autounlockDilation3: {
    id: 44,
    label: "ATT",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock the passive Time Theorem generation Dilation Upgrade once you can afford it.",
    defaultPosition: {
      x: 460,
      y: 580
    }
  },
  autounlockTD: {
    id: 45,
    label: "ATD",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 once you can afford them.",
    defaultPosition: {
      x: 605,
      y: 575
    }
  },
  autounlockReality: {
    id: 46,
    label: "REAL",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Auto-unlocks Reality once you have ${format("1e4000")} Eternity Points
        and have unlocked Time Dimension 8.`;
    },
    defaultPosition: {
      x: 725,
      y: 505
    }
  },
  bypassIDAntimatter: {
    id: 51,
    label: "IDR",
    family: PERK_FAMILY.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements.",
    defaultPosition: {
      x: -580,
      y: -230
    }
  },
  bypassTGReset: {
    id: 52,
    label: "TGR",
    family: PERK_FAMILY.DILATION,
    description: "The 2nd rebuyable Dilation Upgrade no longer resets your Dilated Time.",
    defaultPosition: {
      x: -145,
      y: 520
    }
  },
  bypassECDilation: {
    id: 53,
    label: "DILR",
    family: PERK_FAMILY.DILATION,
    description: "Remove the Eternity Challenge 11, Eternity Challenge 12, and total Time Theorem " +
      "requirements from Time Dilation unlock.",
    defaultPosition: {
      x: 0,
      y: 640
    }
  },
  bypassEC1Lock: {
    id: 54,
    label: "EC1R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 1 requirement from Time Study 181.",
    defaultPosition: {
      x: 450,
      y: -160
    }
  },
  bypassEC2Lock: {
    id: 55,
    label: "EC2R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 2 requirement from Time Study 181.",
    defaultPosition: {
      x: 350,
      y: -270
    }
  },
  bypassEC3Lock: {
    id: 56,
    label: "EC3R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 3 requirement from Time Study 181.",
    defaultPosition: {
      x: 410,
      y: -25
    }
  },
  bypassEC5Lock: {
    id: 57,
    label: "EC5R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 5 requirement from Time Study 62.",
    defaultPosition: {
      x: 155,
      y: -85
    }
  },
  autocompleteEC1: {
    id: 60,
    label: "PEC1",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(80)} minutes (real-time).
              ECs will be completed sequentially, requiring all previous
              ECs to be fully completed before progressing to the next EC.`;
    },
    effect: 80,
    defaultPosition: {
      x: 345,
      y: 135
    }
  },
  autocompleteEC2: {
    id: 61,
    label: "PEC2",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(50)} minutes (real-time).`;
    },
    effect: 50,
    defaultPosition: {
      x: 425,
      y: 235
    }
  },
  autocompleteEC3: {
    id: 62,
    label: "PEC3",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(30)} minutes (real-time).`;
    },
    effect: 30,
    defaultPosition: {
      x: 325,
      y: 325
    }
  },
  autocompleteEC4: {
    id: 63,
    label: "PEC4",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(20)} minutes (real-time).`;
    },
    effect: 20,
    defaultPosition: {
      x: 205,
      y: 270
    }
  },
  studyActiveEP: {
    id: 70,
    label: "ACT",
    family: PERK_FAMILY.ETERNITY,
    description: "Active path multipliers are always maximized.",
    defaultPosition: {
      x: 195,
      y: -260
    }
  },
  studyIdleEP: {
    id: 71,
    label: "IDL",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Idle path multipliers start as if you have spent ${formatInt(15)} minutes in this Infinity/Eternity.`;
    },
    effect: 15,
    defaultPosition: {
      x: 265,
      y: 25
    }
  },
  studyECRequirement: {
    id: 72,
    label: "ECR",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove non–Time Theorem requirements for unlocking Eternity Challenges.",
    defaultPosition: {
      x: 605,
      y: -160
    }
  },
  studyECBulk: {
    id: 73,
    label: "ECB",
    family: PERK_FAMILY.ETERNITY,
    description:
      `You can complete multiple tiers of Eternity Challenges at once if
      you reach the goal for a higher completion of that challenge.`,
    defaultPosition: {
      x: 740,
      y: -135
    }
  },
  retroactiveTP1: {
    id: 80,
    label: "TP1",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the "You gain ${formatInt(3)} times more Tachyon Particles" Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatFloat(1.5, 1)}.`;
    },
    effect: 1.5,
    defaultPosition: {
      x: -290,
      y: 460
    }
  },
  retroactiveTP2: {
    id: 81,
    label: "TP2",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the "You gain ${formatInt(3)} times more Tachyon Particles" Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatInt(2)}.`;
    },
    effect: 2,
    defaultPosition: {
      x: -200,
      y: 360
    }
  },
  retroactiveTP3: {
    id: 82,
    label: "TP3",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the "You gain ${formatInt(3)} times more Tachyon Particles" Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatFloat(2.5, 1)}.`;
    },
    effect: 2.5,
    defaultPosition: {
      x: -120,
      y: 260
    }
  },
  retroactiveTP4: {
    id: 83,
    label: "TP4",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the "You gain ${formatInt(3)} times more Tachyon Particles" Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatInt(3)}.`;
    },
    effect: 3,
    defaultPosition: {
      x: -65,
      y: 145
    }
  },
  autobuyerDilation: {
    id: 100,
    label: "DAU",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock autobuyers for the repeatable Dilation Upgrades.",
    defaultPosition: {
      x: 20,
      y: 500
    }
  },
  autobuyerFasterID: {
    id: 101,
    label: "IDAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Infinity Dimension autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    defaultPosition: {
      x: -515,
      y: -20
    }
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "REPAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Replicanti autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    defaultPosition: {
      x: -425,
      y: -310
    }
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "DAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Dilation Upgrade autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    defaultPosition: {
      x: 490,
      y: 450
    }
  },
  autobuyerTT1: {
    id: 104,
    label: "TTMA1",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Unlock a Time Theorem Autobuyer that autobuys max Time Theorems every ${formatInt(4)} seconds.`;
    },
    effect: 4,
    defaultPosition: {
      x: 190,
      y: -410
    }
  },
  autobuyerTT2: {
    id: 105,
    label: "TTMA2",
    family: PERK_FAMILY.AUTOMATION,
    description: "Upgrade the Time Theorem Autobuyer to autobuy max Time Theorems every second.",
    effect: 1,
    defaultPosition: {
      x: 255,
      y: -540
    }
  },
  autobuyerTT3: {
    id: 106,
    label: "TTMA3",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Upgrade the Time Theorem Autobuyer to max Time Theorems ${formatInt(2)} times per second.`;
    },
    effect: 0.5,
    defaultPosition: {
      x: 360,
      y: -625
    }
  },
  autobuyerTT4: {
    id: 107,
    label: "TTMA4",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Upgrade the Time Theorem Autobuyer to max Time Theorems ${formatInt(4)} times per second.`;
    },
    effect: 0.25,
    defaultPosition: {
      x: 485,
      y: -675
    }
  },
  achievementGroup1: {
    id: 201,
    label: "ACH1",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(16)} minutes per
        Achievement (${formatInt(16)} minute decrease).`;
    },
    effect: 16,
    defaultPosition: {
      x: -45,
      y: -135
    }
  },
  achievementGroup2: {
    id: 202,
    label: "ACH2",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(8)} minutes per
        Achievement (${formatInt(8)} minute decrease).`;
    },
    effect: 8,
    defaultPosition: {
      x: -115,
      y: -250
    }
  },
  achievementGroup3: {
    id: 203,
    label: "ACH3",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(4)} minutes per
        Achievement (${formatInt(4)} minute decrease).`;
    },
    effect: 4,
    defaultPosition: {
      x: -175,
      y: -365
    }
  },
  achievementGroup4: {
    id: 204,
    label: "ACH4",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(2)} minutes per
        Achievement (${formatInt(2)} minute decrease).`;
    },
    effect: 2,
    defaultPosition: {
      x: -180,
      y: -500
    }
  },
  achievementGroup5: {
    id: 205,
    label: "ACHNR",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reality no longer resets your Achievements.",
    effect: 2,
    defaultPosition: {
      x: -195,
      y: -630
    }
  }
};

GameDatabase.reality.perkConnections = (function() {
  const p = GameDatabase.reality.perks;
  // First item is the start, other items are the ends
  const groups = [
    [p.firstPerk, p.achievementGroup1, p.startAM, p.autounlockEU1, p.bypassEC5Lock],
    [p.startAM, p.antimatterNoReset, p.startIP1],
    [p.antimatterNoReset, p.startEP1],
    [p.startIP1, p.startIP2, p.startEP1, p.autobuyerFasterID],
    [p.startIP2, p.bypassIDAntimatter, p.autobuyerFasterReplicanti],
    [p.startEP1, p.startEP2, p.startTP],
    [p.startEP2, p.startEP3],
    [p.startTP, p.startEP1, p.retroactiveTP1],
    [p.autounlockEU1, p.autounlockEU2],
    [p.autounlockEU2, p.autounlockEU1, p.autobuyerDilation],
    [p.autounlockDilation1, p.autounlockDilation2],
    [p.autounlockDilation2, p.autounlockDilation3],
    [p.autounlockDilation3, p.autobuyerFasterDilation, p.autounlockTD],
    [p.autounlockTD, p.autounlockReality],
    [p.bypassTGReset, p.autobuyerDilation, p.retroactiveTP1],
    [p.bypassEC1Lock, p.bypassEC2Lock, p.bypassEC3Lock, p.studyECRequirement],
    [p.bypassEC2Lock, p.studyActiveEP, p.bypassEC1Lock],
    [p.bypassEC3Lock, p.studyIdleEP, p.bypassEC1Lock],
    [p.bypassEC5Lock, p.studyActiveEP, p.studyIdleEP, p.studyPassive],
    [p.studyPassive, p.bypassEC1Lock],
    [p.autocompleteEC1, p.autocompleteEC2],
    [p.autocompleteEC2, p.autocompleteEC3],
    [p.autocompleteEC3, p.autocompleteEC4],
    [p.studyActiveEP, p.bypassEC2Lock, p.autobuyerTT1],
    [p.studyIdleEP, p.bypassEC3Lock, p.autocompleteEC1],
    [p.studyECRequirement, p.studyECBulk],
    [p.retroactiveTP1, p.bypassTGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.autobuyerDilation, p.autounlockEU2, p.autounlockDilation1, p.bypassECDilation, p.bypassTGReset],
    [p.autobuyerFasterID],
    [p.autobuyerTT1, p.autobuyerTT2],
    [p.autobuyerTT2, p.autobuyerTT3],
    [p.autobuyerTT3, p.autobuyerTT4],
    [p.achievementGroup1, p.achievementGroup2],
    [p.achievementGroup2, p.achievementGroup3],
    [p.achievementGroup3, p.achievementGroup4],
    [p.achievementGroup4, p.achievementGroup5],
  ];
  const connections = {};
  for (const perk of Object.values(GameDatabase.reality.perks)) {
    const connectedPerks = [];
    const directConnections = groups.find(g => g[0] === perk);
    if (directConnections !== undefined) {
      connectedPerks.push(...directConnections.slice(1));
    }
    const indirectConnections = groups
      .filter(g => g.slice(1).some(groupPerk => groupPerk === perk))
      .map(g => g[0]);
    connectedPerks.push(...indirectConnections);
    connections[perk.id] = [...new Set(connectedPerks.map(connectedPerk => connectedPerk.id))];
  }
  return connections;
}());

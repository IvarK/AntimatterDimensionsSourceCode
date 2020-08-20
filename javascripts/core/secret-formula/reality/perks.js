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
  glyphChoice4: {
    id: 0,
    label: "GC4",
    family: PERK_FAMILY.REALITY,
    description: "You can now choose from 4 different glyphs on Reality.",
    effect: 4,
  },
  startAM1: {
    id: 10,
    label: "SAM1",
    family: PERK_FAMILY.ANTIMATTER,
    description: "Start every reset with 1e15 antimatter.",
    bumpCurrency: () => Currency.antimatter.bumpTo(1e15),
    effect: 1e15
  },
  startAM2: {
    id: 11,
    label: "SAM2",
    family: PERK_FAMILY.ANTIMATTER,
    description: "Start every reset with 1e130 antimatter.",
    bumpCurrency: () => Currency.antimatter.bumpTo(1e130),
    effect: 1e130
  },
  startIP1: {
    id: 12,
    label: "SIP1",
    family: PERK_FAMILY.INFINITY,
    description: "Start every Eternity and Reality with 2e15 Infinity Points.",
    bumpCurrency: () => player.infinityPoints = player.infinityPoints.clampMin(2e15),
    effect: 2e15
  },
  startIP2: {
    id: 13,
    label: "SIP2",
    family: PERK_FAMILY.INFINITY,
    description: "Start every Eternity and Reality with 2e130 Infinity Points.",
    bumpCurrency: () => player.infinityPoints = player.infinityPoints.clampMin(2e130),
    effect: 2e130
  },
  startEP1: {
    id: 14,
    label: "SEP1",
    family: PERK_FAMILY.ETERNITY,
    description: "Start every Reality with 10 Eternity Points.",
    bumpCurrency: () => player.eternityPoints = player.eternityPoints.clampMin(10),
    effect: 10
  },
  startEP2: {
    id: 15,
    label: "SEP2",
    family: PERK_FAMILY.ETERNITY,
    description: "Start every Reality with 2000 Eternity Points.",
    bumpCurrency: () => player.eternityPoints = player.eternityPoints.clampMin(2000),
    effect: 2000
  },
  startEP3: {
    id: 16,
    label: "SEP3",
    family: PERK_FAMILY.ETERNITY,
    description: "Start every Reality with 1e9 Eternity Points.",
    bumpCurrency: () => player.eternityPoints = player.eternityPoints.clampMin(1e9),
    effect: 1e9
  },
  startTP: {
    id: 17,
    label: "STP",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, gain 10 Tachyon Particles.",
    effect: () => (Enslaved.isRunning ? 1 : 10)
  },
  dimboostNonReset: {
    id: 30,
    label: "DBNR",
    family: PERK_FAMILY.ANTIMATTER,
    description: "Dimboosts no longer reset Antimatter Dimensions, tickspeed, or sacrifice."
  },
  studyPassive1: {
    id: 31,
    label: "PASS1",
    family: PERK_FAMILY.ETERNITY,
    description: "Improve Time Study 122 to x100 Eternity Points and " +
      "Time Study 142 to x1e100 Infinity Points."
  },
  studyPassive2: {
    id: 32,
    label: "PASS2",
    family: PERK_FAMILY.ETERNITY,
    description: "Time Study 132 also makes Replicanti 5x faster."
  },
  autounlockEU1: {
    id: 40,
    label: "EU1",
    family: PERK_FAMILY.ETERNITY,
    description: "After the first Eternity of a Reality, auto-unlock the first row of Eternity Upgrades."
  },
  autounlockEU2: {
    id: 41,
    label: "EU2",
    family: PERK_FAMILY.ETERNITY,
    description: "After the first Eternity of a Reality, auto-unlock the second row of Eternity Upgrades."
  },
  autounlockDilation1: {
    id: 42,
    label: "UD1",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, auto-unlock the second row of Dilation Upgrades."
  },
  autounlockDilation2: {
    id: 43,
    label: "UD2",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, auto-unlock the third row of Dilation Upgrades."
  },
  autounlockDilation3: {
    id: 44,
    label: "ATT",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock the passive Time Theorem generation Dilation Upgrade once you can afford it."
  },
  autounlockTD: {
    id: 45,
    label: "ATD",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 once you can afford them."
  },
  autounlockReality: {
    id: 46,
    label: "REAL",
    family: PERK_FAMILY.REALITY,
    description: "Auto-unlocks Reality once you have 1e4000 Eternity Points and have unlocked Time Dimension 8."
  },
  bypassIDAntimatter: {
    id: 51,
    label: "IDR",
    family: PERK_FAMILY.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements."
  },
  bypassDGReset: {
    id: 52,
    label: "DGR",
    family: PERK_FAMILY.DILATION,
    description: "The 2nd rebuyable Dilation Upgrade no longer resets your Dilated Time."
  },
  bypassECDilation: {
    id: 53,
    label: "DILR",
    family: PERK_FAMILY.DILATION,
    description: "Remove the Eternity Challenge 11, Eternity Challenge 12, and total Time Theorem " +
      "requirements from Time Dilation unlock."
  },
  bypassEC1Lock: {
    id: 54,
    label: "EC1R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 1 requirement from Time Study 181."
  },
  bypassEC2Lock: {
    id: 55,
    label: "EC2R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 2 requirement from Time Study 181."
  },
  bypassEC3Lock: {
    id: 56,
    label: "EC3R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 3 requirement from Time Study 181."
  },
  bypassEC5Lock: {
    id: 57,
    label: "EC5R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 5 requirement from Time Study 62."
  },
  autocompleteEC1: {
    id: 60,
    label: "PEC1",
    family: PERK_FAMILY.AUTOMATION,
    description: "Auto-complete one Eternity Challenge every 2 hours (real-time).",
    effect: 120
  },
  autocompleteEC2: {
    id: 61,
    label: "PEC2",
    family: PERK_FAMILY.AUTOMATION,
    description: "Auto-complete one Eternity Challenge every 80 minutes (real-time).",
    effect: 80
  },
  autocompleteEC3: {
    id: 62,
    label: "PEC3",
    family: PERK_FAMILY.AUTOMATION,
    description: "Auto-complete one Eternity Challenge every 50 minutes (real-time).",
    effect: 50
  },
  autocompleteEC4: {
    id: 63,
    label: "PEC4",
    family: PERK_FAMILY.AUTOMATION,
    description: "Auto-complete one Eternity Challenge every 30 minutes (real-time).",
    effect: 30
  },
  autocompleteEC5: {
    id: 64,
    label: "PEC5",
    family: PERK_FAMILY.AUTOMATION,
    description: "Auto-complete one Eternity Challenge every 20 minutes (real-time).",
    effect: 20
  },
  studyActiveEP: {
    id: 70,
    label: "ACT",
    family: PERK_FAMILY.ETERNITY,
    description: "Active path multipliers are always maximized."
  },
  studyIdleEP: {
    id: 71,
    label: "IDL",
    family: PERK_FAMILY.ETERNITY,
    description: "Idle path multipliers start as if you have spent 15 minutes in this Infinity/Eternity.",
    effect: 15
  },
  studyECRequirement: {
    id: 72,
    label: "ECR",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove non–Time Theorem requirements for unlocking Eternity Challenges."
  },
  studyECBulk: {
    id: 73,
    label: "ECB",
    family: PERK_FAMILY.ETERNITY,
    description: "You can complete multiple tiers of Eternity Challenges at once " +
                 "if you reach the goal for a higher completion of that challenge."
  },
  retroactiveTP1: {
    id: 80,
    label: "TP1",
    family: PERK_FAMILY.DILATION,
    description: "When buying the \"You gain 3 times more Tachyon Particles\" Dilation Upgrade, " +
      "multiply your current Tachyon Particle amount by 1.5.",
    effect: 1.5
  },
  retroactiveTP2: {
    id: 81,
    label: "TP2",
    family: PERK_FAMILY.DILATION,
    description: "When buying the \"You gain 3 times more Tachyon Particles\" Dilation Upgrade, " +
      "multiply your current Tachyon Particle amount by 2.",
    effect: 2
  },
  retroactiveTP3: {
    id: 82,
    label: "TP3",
    family: PERK_FAMILY.DILATION,
    description: "When buying the \"You gain 3 times more Tachyon Particles\" Dilation Upgrade, " +
      "multiply your current Tachyon Particle amount by 2.5.",
    effect: 2.5
  },
  retroactiveTP4: {
    id: 83,
    label: "TP4",
    family: PERK_FAMILY.DILATION,
    description: "When buying the \"You gain 3 times more Tachyon Particles\" Dilation Upgrade, " +
      "multiply your current Tachyon Particle amount by 3.",
    effect: 3
  },
  autobuyerDilation: {
    id: 100,
    label: "DAU",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock autobuyers for the repeatable Dilation Upgrades."
  },
  autobuyerFasterID: {
    id: 101,
    label: "IDAS",
    family: PERK_FAMILY.AUTOMATION,
    description: "Infinity Dimension autobuyers work 3 times faster.",
    effect: 1 / 3,
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "REPAS",
    family: PERK_FAMILY.AUTOMATION,
    description: "Replicanti autobuyers work 3 times faster.",
    effect: 1 / 3,
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "DAS",
    family: PERK_FAMILY.AUTOMATION,
    description: "Dilation Upgrade autobuyers work 3 times faster.",
    effect: 1 / 3,
  },
  autobuyerTT1: {
    id: 104,
    label: "TTMA1",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock a Time Theorem Autobuyer that autobuys max Time Theorems every 4 seconds.",
    effect: 4,
  },
  autobuyerTT2: {
    id: 105,
    label: "TTMA2",
    family: PERK_FAMILY.AUTOMATION,
    description: "Upgrade the Time Theorem Autobuyer to autobuy max Time Theorems every second.",
    effect: 1,
  },
  autobuyerTT3: {
    id: 106,
    label: "TTMA3",
    family: PERK_FAMILY.AUTOMATION,
    description: "Upgrade the Time Theorem Autobuyer to autobuy max Time Theorems 2 times per second.",
    effect: 0.5,
  },
  autobuyerTT4: {
    id: 107,
    label: "TTMA4",
    family: PERK_FAMILY.AUTOMATION,
    description: "Upgrade the Time Theorem Autobuyer to autobuy max Time Theorems 4 times per second.",
    effect: 0.25,
  },
  achievementGroup1: {
    id: 201,
    label: "ACH1",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reduce the achievement timer to 20 minutes per achievement (10 minute decrease).",
    effect: 10
  },
  achievementGroup2: {
    id: 202,
    label: "ACH2",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reduce the achievement timer to 14 minutes per achievement (6 minute decrease).",
    effect: 6
  },
  achievementGroup3: {
    id: 203,
    label: "ACH3",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reduce the achievement timer to 9 minutes per achievement (5 minute decrease).",
    effect: 5
  },
  achievementGroup4: {
    id: 204,
    label: "ACH4",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reduce the achievement timer to 5 minutes per achievement (4 minute decrease).",
    effect: 4
  },
  achievementGroup5: {
    id: 205,
    label: "ACH5",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reduce the achievement timer to 2 minutes per achievement (3 minute decrease).",
    effect: 3
  },
  achievementGroup6: {
    id: 206,
    label: "ACHNR",
    family: PERK_FAMILY.ACHIEVEMENT,
    description: "Reality no longer resets your achievements.",
    effect: 2
  }
};

GameDatabase.reality.perkConnections = (function() {
  const p = GameDatabase.reality.perks;
  // First item is the start, other items are the ends
  const groups = [
    [p.glyphChoice4, p.achievementGroup1, p.startAM1, p.autounlockEU1, p.bypassEC5Lock],
    [p.startAM1, p.startAM2, p.startIP1],
    [p.startAM2, p.startEP1, p.dimboostNonReset],
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
    [p.bypassDGReset, p.autobuyerDilation, p.retroactiveTP1],
    [p.bypassEC1Lock, p.bypassEC2Lock, p.bypassEC3Lock, p.studyECRequirement],
    [p.bypassEC2Lock, p.studyActiveEP, p.bypassEC1Lock],
    [p.bypassEC3Lock, p.studyIdleEP, p.bypassEC1Lock],
    [p.bypassEC5Lock, p.studyActiveEP, p.studyIdleEP, p.studyPassive1],
    [p.studyPassive1, p.studyPassive2],
    [p.studyPassive2, p.bypassEC1Lock],
    [p.autocompleteEC1, p.autocompleteEC2],
    [p.autocompleteEC2, p.autocompleteEC3],
    [p.autocompleteEC3, p.autocompleteEC4],
    [p.autocompleteEC4, p.autocompleteEC5],
    [p.studyActiveEP, p.bypassEC2Lock, p.autobuyerTT1],
    [p.studyIdleEP, p.bypassEC3Lock, p.autocompleteEC1],
    [p.studyECRequirement, p.studyECBulk],
    [p.retroactiveTP1, p.bypassDGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.autobuyerDilation, p.autounlockEU2, p.autounlockDilation1, p.bypassECDilation, p.bypassDGReset],
    [p.autobuyerFasterID],
    [p.autobuyerTT1, p.autobuyerTT2],
    [p.autobuyerTT2, p.autobuyerTT3],
    [p.autobuyerTT3, p.autobuyerTT4],
    [p.achievementGroup1, p.achievementGroup2],
    [p.achievementGroup2, p.achievementGroup3],
    [p.achievementGroup3, p.achievementGroup4],
    [p.achievementGroup4, p.achievementGroup5],
    [p.achievementGroup5, p.achievementGroup6],
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

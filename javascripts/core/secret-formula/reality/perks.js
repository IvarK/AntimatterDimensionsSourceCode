"use strict";

const PerkFamily = {
  NORMAL: "NORMAL",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATOR: "AUTOMATOR",
  ACHIEVEMENT: "ACHIEVEMENT",
};

GameDatabase.reality.perks = {
  glyphChoice3: {
    id: 0,
    label: "G0",
    family: PerkFamily.REALITY,
    description: "You can now choose from 3 different glyphs on Reality.",
    effect: () => 3,
  },
  startAM1: {
    id: 10,
    label: "S1",
    family: PerkFamily.NORMAL,
    description: "Start with 1e15 antimatter after every reset.",
    effect: () => 1e15
  },
  startAM2: {
    id: 11,
    label: "S2",
    family: PerkFamily.NORMAL,
    description: "Start with 1e130 antimatter after every reset.",
    effect: () => 1e130
  },
  startIP1: {
    id: 12,
    label: "S3",
    family: PerkFamily.INFINITY,
    description: "Start with 2e15 IP after every Eternity and Reality.",
    effect: () => 2e15
  },
  startIP2: {
    id: 13,
    label: "S4",
    family: PerkFamily.INFINITY,
    description: "Start with 2e130 IP after every Eternity and Reality.",
    effect: () => 2e130
  },
  startEP1: {
    id: 14,
    label: "S5",
    family: PerkFamily.ETERNITY,
    description: "Start with 10 EP after every Reality.",
    effect: () => 10
  },
  startEP2: {
    id: 15,
    label: "S6",
    family: PerkFamily.ETERNITY,
    description: "Start with 2000 EP after every Reality.",
    effect: () => 2000
  },
  startEP3: {
    id: 16,
    label: "S7",
    family: PerkFamily.ETERNITY,
    description: "Start with 1e9 EP after every Reality.",
    effect: () => 1e9
  },
  startTP: {
    id: 17,
    label: "S8",
    family: PerkFamily.DILATION,
    description: "Start with 10 TP after unlocking Dilation."
  },
  glyphLevelIncrease1: {
    id: 20,
    label: "G1",
    family: PerkFamily.REALITY,
    description: "+1 to base glyph level.",
    effect: () => 1
  },
  glyphLevelIncrease2: {
    id: 21,
    label: "G2",
    family: PerkFamily.REALITY,
    description: "+1 to base glyph level.",
    effect: () => 1
  },
  glyphChoice4: {
    id: 22,
    label: "G3",
    family: PerkFamily.REALITY,
    description: "+1 glyph choice on Reality.",
    effect: () => 4,
  },
  glyphRarityIncrease: {
    id: 23,
    label: "G4",
    family: PerkFamily.REALITY,
    description: "+5% minimum glyph rarity."
  },
  glyphUncommonGuarantee: {
    id: 24,
    label: "G5",
    family: PerkFamily.REALITY,
    description: "One glyph choice is guaranteed to be uncommon or better."
  },
  realityMachineGain: {
    id: 25,
    label: "R1",
    family: PerkFamily.REALITY,
    description: "Gain additional RM equal to twice your current reality count.",
    effect: () => 2 * player.realities
  },
  automatorRowIncrease1: {
    id: 30,
    label: "AR1",
    family: PerkFamily.AUTOMATOR,
    description: "+5 automator rows.",
    effect: () => 5
  },
  automatorRowIncrease2: {
    id: 31,
    label: "AR2",
    family: PerkFamily.AUTOMATOR,
    description: "+10 automator rows.",
    effect: () => 10
  },
  automatorRowScaling: {
    id: 32,
    label: "AR3",
    family: PerkFamily.AUTOMATOR,
    description: "Improve the Automator row per Reality scaling.",
    effect: () => 0.85
  },
  autounlockEU1: {
    id: 40,
    label: "AU1",
    family: PerkFamily.ETERNITY,
    description: "Auto-unlock the first row of Eternity upgrades after first Eternity of a Reality."
  },
  autounlockEU2: {
    id: 41,
    label: "AU2",
    family: PerkFamily.ETERNITY,
    description: "Auto-unlock the second row of Eternity upgrades after first Eternity of a Reality."
  },
  autounlockDilation1: {
    id: 42,
    label: "AU3",
    family: PerkFamily.DILATION,
    description: "Auto-unlock the second row of Dilation upgrades on Dilation unlock."
  },
  autounlockDilation2: {
    id: 43,
    label: "AU4",
    family: PerkFamily.DILATION,
    description: "Auto-unlock the third row of Dilation upgrades on Dilation unlock."
  },
  autounlockDilation3: {
    id: 44,
    label: "AU5",
    family: PerkFamily.DILATION,
    description: "Auto-unlock Dilation TT generation when you have 1e15 DT."
  },
  autounlockTD: {
    id: 45,
    label: "AU6",
    family: PerkFamily.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 when you have enough TT."
  },
  autounlockReality: {
    id: 46,
    label: "AU7",
    family: PerkFamily.REALITY,
    description: "Auto-unlock Reality at e4000 EP."
  },
  bypassIDAntimatter: {
    id: 51,
    label: "B1",
    family: PerkFamily.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements."
  },
  bypassDGReset: {
    id: 52,
    label: "B2",
    family: PerkFamily.DILATION,
    description: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time."
  },
  bypassECDilation: {
    id: 53,
    label: "B3",
    family: PerkFamily.DILATION,
    description: "Remove the EC11/EC12 and TT requirement for Time Dilation."
  },
  bypassEC1Lock: {
    id: 54,
    label: "B4",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC1 requirement from study 181."
  },
  bypassEC2Lock: {
    id: 55,
    label: "B5",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC2 requirement from study 181."
  },
  bypassEC3Lock: {
    id: 56,
    label: "B6",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC3 requirement from study 181."
  },
  bypassEC5Lock: {
    id: 57,
    label: "B7",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC5 requirement from study 62."
  },
  autocompleteEC1: {
    id: 60,
    label: "AE1",
    family: PerkFamily.ETERNITY,
    description: "Auto-complete one EC every 6 hours (real-time).",
    effect: () => 6
  },
  autocompleteEC2: {
    id: 61,
    label: "AE2",
    family: PerkFamily.ETERNITY,
    description: "Auto-complete one EC every 4 hours (real-time).",
    effect: () => 4
  },
  autocompleteEC3: {
    id: 62,
    label: "AE3",
    family: PerkFamily.ETERNITY,
    description: "Auto-complete one EC every 2 hours (real-time).",
    effect: () => 2
  },
  autocompleteEC4: {
    id: 63,
    label: "AE4",
    family: PerkFamily.ETERNITY,
    description: "Auto-complete one EC every 1 hour (real-time).",
    effect: () => 1
  },
  autocompleteEC5: {
    id: 64,
    label: "AE5",
    family: PerkFamily.ETERNITY,
    description: "Auto-complete one EC every 30 minutes (real-time).",
    effect: () => 0.5
  },
  studyActiveEP: {
    id: 70,
    label: "TS1",
    family: PerkFamily.ETERNITY,
    description: "Active path EP is always 50x."
  },
  studyIdleEP: {
    id: 71,
    label: "TS2",
    family: PerkFamily.ETERNITY,
    description: "Idle path EP starts as if you have spent 15 minutes in this Eternity.",
    effect: () => TimeSpan.fromMinutes(15)
  },
  studyECRequirement: {
    id: 72,
    label: "TS3",
    family: PerkFamily.ETERNITY,
    description: "Remove non-TT requirements for unlocking Eternity Challenges."
  },
  studyECBulk: {
    id: 73,
    label: "TS4",
    family: PerkFamily.ETERNITY,
    description: "You can complete multiple tiers of Eternity Challenges at once " +
                 "if you reach the goal for a higher completion of that challenge."
  },
  retroactiveTP1: {
    id: 80,
    label: "TP1",
    family: PerkFamily.DILATION,
    description: "When buying the 3xTP gain upgrade, multiply your TP by 1.5.",
    effect: () => 1.5
  },
  retroactiveTP2: {
    id: 81,
    label: "TP2",
    family: PerkFamily.DILATION,
    description: "When buying the 3xTP gain upgrade, multiply your TP by 2.",
    effect: () => 2
  },
  retroactiveTP3: {
    id: 82,
    label: "TP3",
    family: PerkFamily.DILATION,
    description: "When buying the 3xTP gain upgrade, multiply your TP by 2.5.",
    effect: () => 2.5
  },
  retroactiveTP4: {
    id: 83,
    label: "TP4",
    family: PerkFamily.DILATION,
    description: "When buying the 3xTP gain upgrade, multiply your TP by 3.",
    effect: () => 3
  },
  autobuyerDilation: {
    id: 100,
    label: "AB1",
    family: PerkFamily.DILATION,
    description: "Unlock autobuyers for repeatable dilation upgrades."
  },
  autobuyerFasterID: {
    id: 101,
    label: "AB2",
    family: PerkFamily.INFINITY,
    description: "Infinity Dimension autobuyers work 3 times faster."
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "AB3",
    family: PerkFamily.INFINITY,
    description: "Replicanti autobuyers work 3 times faster."
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "AB4",
    family: PerkFamily.DILATION,
    description: "Dilation autobuyers work 3 times faster."
  },
  autobuyerTT1: {
    id: 104,
    label: "AB5",
    family: PerkFamily.ETERNITY,
    description: "Autobuy max TT every 10 seconds."
  },
  autobuyerTT2: {
    id: 105,
    label: "AB6",
    family: PerkFamily.ETERNITY,
    description: "Autobuy max TT every 5 seconds."
  },
  autobuyerTT3: {
    id: 106,
    label: "AB7",
    family: PerkFamily.ETERNITY,
    description: "Autobuy max TT every 3 seconds."
  },
  autobuyerTT4: {
    id: 107,
    label: "AB8",
    family: PerkFamily.ETERNITY,
    description: "Autobuy max TT every second."
  },
  achievementRowGroup1: {
    id: 201,
    label: "ACH1",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 3 achievement rows after Reality.",
    effect: () => 3
  },
  achievementRowGroup2: {
    id: 202,
    label: "ACH2",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 6 achievement rows after Reality.",
    effect: () => 6
  },
  achievementRowGroup3: {
    id: 203,
    label: "ACH3",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 8 achievement rows after Reality.",
    effect: () => 8
  },
  achievementRowGroup4: {
    id: 204,
    label: "ACH4",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 10 achievement rows after Reality.",
    effect: () => 10
  },
  achievementRowGroup5: {
    id: 205,
    label: "ACH5",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 12 achievement rows after Reality.",
    effect: () => 12
  },
  achievementRowGroup6: {
    id: 206,
    label: "ACH6",
    family: PerkFamily.ACHIEVEMENT,
    description: "Start with the first 13 achievement rows after Reality.",
    effect: () => 13
  }
};

GameDatabase.reality.perkConnections = (function() {
  const p = GameDatabase.reality.perks;
  // First item is the start, other items are the ends
  const groups = [
    [p.glyphChoice3,
      p.achievementRowGroup1, p.startAM1, p.glyphLevelIncrease1, p.glyphLevelIncrease2,
      p.automatorRowIncrease1, p.autounlockEU1, p.bypassEC5Lock
    ],
    [p.startAM1, p.startAM2, p.startIP1],
    [p.startAM2],
    [p.startIP1, p.startIP2, p.startEP1],
    [p.startIP2, p.bypassIDAntimatter],
    [p.startEP1, p.startEP2, p.startTP],
    [p.startEP2, p.startEP3],
    [p.startEP3],
    [p.startTP, p.startEP1, p.retroactiveTP1],
    [p.glyphLevelIncrease1, p.glyphChoice4],
    [p.glyphLevelIncrease2, p.glyphRarityIncrease],
    [p.glyphChoice4, p.glyphLevelIncrease1, p.glyphUncommonGuarantee],
    [p.glyphRarityIncrease, p.glyphLevelIncrease2, p.glyphUncommonGuarantee],
    [p.glyphUncommonGuarantee, p.glyphRarityIncrease, p.glyphChoice4, p.realityMachineGain],
    [p.realityMachineGain],
    [p.automatorRowIncrease1, p.automatorRowIncrease2, p.autobuyerFasterID],
    [p.automatorRowIncrease2, p.automatorRowIncrease1, p.automatorRowScaling],
    [p.automatorRowScaling, p.autobuyerTT1],
    [p.autounlockEU1, p.autounlockEU2],
    [p.autounlockEU2, p.autounlockEU1, p.autobuyerDilation],
    [p.autounlockDilation1, p.autounlockDilation2],
    [p.autounlockDilation2, p.autounlockDilation3],
    [p.autounlockDilation3, p.autobuyerFasterDilation, p.autounlockTD],
    [p.autounlockTD, p.autounlockReality],
    [p.autounlockReality],
    [p.bypassIDAntimatter],
    [p.bypassDGReset, p.autobuyerDilation, p.retroactiveTP1],
    [p.bypassECDilation],
    [p.bypassEC1Lock, p.bypassEC2Lock, p.bypassEC3Lock, p.autocompleteEC1],
    [p.bypassEC2Lock, p.studyActiveEP, p.bypassEC1Lock],
    [p.bypassEC3Lock, p.studyIdleEP, p.bypassEC1Lock],
    [p.bypassEC5Lock, p.studyActiveEP, p.studyIdleEP],
    [p.autocompleteEC1, p.autocompleteEC2],
    [p.autocompleteEC2, p.autocompleteEC3],
    [p.autocompleteEC3, p.autocompleteEC4],
    [p.autocompleteEC4, p.autocompleteEC5],
    [p.autocompleteEC5],
    [p.studyActiveEP, p.bypassEC2Lock, p.studyECRequirement],
    [p.studyIdleEP, p.bypassEC3Lock, p.autobuyerTT1],
    [p.studyECRequirement, p.studyECBulk],
    [p.studyECBulk],
    [p.retroactiveTP1, p.bypassDGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.retroactiveTP4],
    [p.autobuyerDilation,
      p.autounlockEU2, p.autounlockDilation1, p.bypassECDilation, p.bypassDGReset
    ],
    [p.autobuyerFasterID, p.autobuyerFasterReplicanti],
    [p.autobuyerFasterReplicanti],
    [p.bypassECDilation],
    [p.autobuyerTT1, p.autobuyerTT2, p.automatorRowScaling],
    [p.autobuyerTT2, p.autobuyerTT3],
    [p.autobuyerTT3, p.autobuyerTT4],
    [p.autobuyerTT4],
    [p.achievementRowGroup1, p.achievementRowGroup2],
    [p.achievementRowGroup2, p.achievementRowGroup3],
    [p.achievementRowGroup3, p.achievementRowGroup4],
    [p.achievementRowGroup4, p.achievementRowGroup5],
    [p.achievementRowGroup5, p.achievementRowGroup6],
    [p.achievementRowGroup6]
  ];
  const connections = {};
  for (const group of groups) {
    const ids = group.map(perk => perk.id);
    const start = ids.shift();
    connections[start] = ids;
  }
  return connections;
}());

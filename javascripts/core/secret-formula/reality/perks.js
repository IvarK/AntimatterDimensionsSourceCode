"use strict";

const PerkFamily = {
  NORMAL: "NORMAL",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATION: "AUTOMATION",
  ACHIEVEMENT: "ACHIEVEMENT",
};

GameDatabase.reality.perks = {
  glyphChoice3: {
    id: 0,
    label: "GC3",
    family: PerkFamily.REALITY,
    description: "You can now choose from 3 different glyphs on Reality.",
    effect: () => 3,
  },
  startAM1: {
    id: 10,
    label: "AM1",
    family: PerkFamily.NORMAL,
    description: "Start with 1e15 antimatter after every reset.",
    effect: () => 1e15
  },
  startAM2: {
    id: 11,
    label: "AM2",
    family: PerkFamily.NORMAL,
    description: "Start with 1e130 antimatter after every reset.",
    effect: () => 1e130
  },
  startIP1: {
    id: 12,
    label: "IP1",
    family: PerkFamily.INFINITY,
    description: "Start with 2e15 IP after every Eternity and Reality.",
    effect: () => 2e15
  },
  startIP2: {
    id: 13,
    label: "IP2",
    family: PerkFamily.INFINITY,
    description: "Start with 2e130 IP after every Eternity and Reality.",
    effect: () => 2e130
  },
  startEP1: {
    id: 14,
    label: "EP1",
    family: PerkFamily.ETERNITY,
    description: "Start with 10 EP after every Reality.",
    effect: () => 10
  },
  startEP2: {
    id: 15,
    label: "EP2",
    family: PerkFamily.ETERNITY,
    description: "Start with 2000 EP after every Reality.",
    effect: () => 2000
  },
  startEP3: {
    id: 16,
    label: "EP3",
    family: PerkFamily.ETERNITY,
    description: "Start with 1e9 EP after every Reality.",
    effect: () => 1e9
  },
  startTP: {
    id: 17,
    label: "STP",
    family: PerkFamily.DILATION,
    description: "Start with 10 TP after unlocking Dilation."
  },
  glyphLevelIncrease1: {
    id: 20,
    label: "GL1",
    family: PerkFamily.REALITY,
    description: "+1 to base glyph level.",
    effect: () => 1
  },
  glyphLevelIncrease2: {
    id: 21,
    label: "GL2",
    family: PerkFamily.REALITY,
    description: "+1 to base glyph level.",
    effect: () => 1
  },
  glyphChoice4: {
    id: 22,
    label: "GC4",
    family: PerkFamily.REALITY,
    description: "+1 glyph choice on Reality.",
    effect: () => 4,
  },
  glyphRarityIncrease: {
    id: 23,
    label: "GR",
    family: PerkFamily.REALITY,
    description: "+5% minimum glyph rarity."
  },
  glyphUncommonGuarantee: {
    id: 24,
    label: "GU",
    family: PerkFamily.REALITY,
    description: "One glyph choice is guaranteed to be uncommon or better."
  },
  realityMachineGain: {
    id: 25,
    label: "RM",
    family: PerkFamily.REALITY,
    description: "Gain additional RM equal to twice your current reality count.",
    effect: () => 2 * player.realities
  },
  dimboostNonReset: {
    id: 30,
    label: "DB",
    family: PerkFamily.INFINITY,
    description: "Dimboosts and RG no longer reset normal dimensions"
  },
  studyPassive: {
    id: 31,
    label: "PASS",
    family: PerkFamily.ETERNITY,
    description: "Improve passive path IP/EP multipliers and add replicanti speed to study 132"
  },
  automatorRowScaling: {
    id: 32,
    label: "??????",
    family: PerkFamily.AUTOMATION,
    description: "PLACEHOLDER PERK. (Right now this does nothing)"
  },
  autounlockEU1: {
    id: 40,
    label: "EU1",
    family: PerkFamily.ETERNITY,
    description: "Auto-unlock the first row of Eternity upgrades after first Eternity of a Reality."
  },
  autounlockEU2: {
    id: 41,
    label: "EU2",
    family: PerkFamily.ETERNITY,
    description: "Auto-unlock the second row of Eternity upgrades after first Eternity of a Reality."
  },
  autounlockDilation1: {
    id: 42,
    label: "DIL1",
    family: PerkFamily.DILATION,
    description: "Auto-unlock the second row of Dilation upgrades on Dilation unlock."
  },
  autounlockDilation2: {
    id: 43,
    label: "DIL2",
    family: PerkFamily.DILATION,
    description: "Auto-unlock the third row of Dilation upgrades on Dilation unlock."
  },
  autounlockDilation3: {
    id: 44,
    label: "DIL3",
    family: PerkFamily.DILATION,
    description: "Auto-unlock Dilation TT generation when you have 1e15 DT."
  },
  autounlockTD: {
    id: 45,
    label: "TD",
    family: PerkFamily.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 when you have enough TT."
  },
  autounlockReality: {
    id: 46,
    label: "REAL",
    family: PerkFamily.REALITY,
    description: "Auto-unlock Reality at e4000 EP."
  },
  bypassIDAntimatter: {
    id: 51,
    label: "ID",
    family: PerkFamily.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements."
  },
  bypassDGReset: {
    id: 52,
    label: "DG",
    family: PerkFamily.DILATION,
    description: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time."
  },
  bypassECDilation: {
    id: 53,
    label: "DIL-REQ",
    family: PerkFamily.DILATION,
    description: "Remove the EC11/EC12 and total TT requirement for Time Dilation."
  },
  bypassEC1Lock: {
    id: 54,
    label: "EC1",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC1 requirement from study 181."
  },
  bypassEC2Lock: {
    id: 55,
    label: "EC2",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC2 requirement from study 181."
  },
  bypassEC3Lock: {
    id: 56,
    label: "EC3",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC3 requirement from study 181."
  },
  bypassEC5Lock: {
    id: 57,
    label: "EC5",
    family: PerkFamily.ETERNITY,
    description: "Remove the EC5 requirement from study 62."
  },
  autocompleteEC1: {
    id: 60,
    label: "AEC1",
    family: PerkFamily.AUTOMATION,
    description: "Auto-complete one EC every 6 hours (real-time).",
    effect: () => 6
  },
  autocompleteEC2: {
    id: 61,
    label: "AEC2",
    family: PerkFamily.AUTOMATION,
    description: "Auto-complete one EC every 4 hours (real-time).",
    effect: () => 4
  },
  autocompleteEC3: {
    id: 62,
    label: "AEC3",
    family: PerkFamily.AUTOMATION,
    description: "Auto-complete one EC every 2 hours (real-time).",
    effect: () => 2
  },
  autocompleteEC4: {
    id: 63,
    label: "AEC4",
    family: PerkFamily.AUTOMATION,
    description: "Auto-complete one EC every 1 hour (real-time).",
    effect: () => 1
  },
  autocompleteEC5: {
    id: 64,
    label: "AEC5",
    family: PerkFamily.AUTOMATION,
    description: "Auto-complete one EC every 30 minutes (real-time).",
    effect: () => 0.5
  },
  studyActiveEP: {
    id: 70,
    label: "ACT",
    family: PerkFamily.ETERNITY,
    description: "Active path multipliers are always maximized."
  },
  studyIdleEP: {
    id: 71,
    label: "IDL",
    family: PerkFamily.ETERNITY,
    description: "Idle path multipliers start as if you have spent 15 minutes in this Infinity/Eternity.",
    effect: () => TimeSpan.fromMinutes(15)
  },
  studyECRequirement: {
    id: 72,
    label: "EC-REQ",
    family: PerkFamily.ETERNITY,
    description: "Remove non-TT requirements for unlocking Eternity Challenges."
  },
  studyECBulk: {
    id: 73,
    label: "EC-BLK",
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
    label: "A-DIL1",
    family: PerkFamily.AUTOMATION,
    description: "Unlock autobuyers for repeatable dilation upgrades."
  },
  autobuyerFasterID: {
    id: 101,
    label: "A-ID",
    family: PerkFamily.AUTOMATION,
    description: "Infinity Dimension autobuyers work 3 times faster."
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "A-REP",
    family: PerkFamily.AUTOMATION,
    description: "Replicanti autobuyers work 3 times faster."
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "A-DIL2",
    family: PerkFamily.AUTOMATION,
    description: "Dilation autobuyers work 3 times faster."
  },
  autobuyerTT1: {
    id: 104,
    label: "TT1",
    family: PerkFamily.AUTOMATION,
    description: "Autobuy max TT every 10 seconds."
  },
  autobuyerTT2: {
    id: 105,
    label: "TT2",
    family: PerkFamily.AUTOMATION,
    description: "Autobuy max TT every 5 seconds."
  },
  autobuyerTT3: {
    id: 106,
    label: "TT3",
    family: PerkFamily.AUTOMATION,
    description: "Autobuy max TT every 3 seconds."
  },
  autobuyerTT4: {
    id: 107,
    label: "TT4",
    family: PerkFamily.AUTOMATION,
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
      p.autounlockEU1, p.bypassEC5Lock],
    [p.startAM1, p.startAM2, p.startIP1],
    [p.startIP1, p.startIP2, p.startEP1, p.autobuyerFasterID],
    [p.startIP2, p.bypassIDAntimatter, p.dimboostNonReset],
    [p.startEP1, p.startEP2, p.startTP],
    [p.startEP2, p.startEP3],
    [p.startTP, p.startEP1, p.retroactiveTP1],
    [p.glyphLevelIncrease1, p.glyphChoice4],
    [p.glyphLevelIncrease2, p.glyphRarityIncrease],
    [p.glyphChoice4, p.glyphLevelIncrease1, p.glyphUncommonGuarantee],
    [p.glyphRarityIncrease, p.glyphLevelIncrease2, p.glyphUncommonGuarantee],
    [p.glyphUncommonGuarantee, p.glyphRarityIncrease, p.glyphChoice4, p.realityMachineGain],
    [p.automatorRowScaling, p.autobuyerTT1],
    [p.autounlockEU1, p.autounlockEU2],
    [p.autounlockEU2, p.autounlockEU1, p.autobuyerDilation],
    [p.autounlockDilation1, p.autounlockDilation2],
    [p.autounlockDilation2, p.autounlockDilation3],
    [p.autounlockDilation3, p.autobuyerFasterDilation, p.autounlockTD],
    [p.autounlockTD, p.autounlockReality],
    [p.bypassDGReset, p.autobuyerDilation, p.retroactiveTP1],
    [p.bypassEC1Lock, p.bypassEC2Lock, p.bypassEC3Lock, p.autocompleteEC1],
    [p.bypassEC2Lock, p.studyActiveEP, p.bypassEC1Lock],
    [p.bypassEC3Lock, p.studyIdleEP, p.bypassEC1Lock],
    [p.bypassEC5Lock, p.studyActiveEP, p.studyIdleEP, p.studyPassive],
    [p.autocompleteEC1, p.autocompleteEC2],
    [p.autocompleteEC2, p.autocompleteEC3],
    [p.autocompleteEC3, p.autocompleteEC4],
    [p.autocompleteEC4, p.autocompleteEC5],
    [p.studyActiveEP, p.bypassEC2Lock, p.studyECRequirement],
    [p.studyIdleEP, p.bypassEC3Lock, p.autobuyerTT1],
    [p.studyECRequirement, p.studyECBulk],
    [p.retroactiveTP1, p.bypassDGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.autobuyerDilation, p.autounlockEU2, p.autounlockDilation1, p.bypassECDilation, p.bypassDGReset],
    [p.autobuyerFasterID, p.autobuyerFasterReplicanti],
    [p.autobuyerTT1, p.autobuyerTT2, p.automatorRowScaling],
    [p.autobuyerTT2, p.autobuyerTT3],
    [p.autobuyerTT3, p.autobuyerTT4],
    [p.achievementRowGroup1, p.achievementRowGroup2],
    [p.achievementRowGroup2, p.achievementRowGroup3],
    [p.achievementRowGroup3, p.achievementRowGroup4],
    [p.achievementRowGroup4, p.achievementRowGroup5],
    [p.achievementRowGroup5, p.achievementRowGroup6],
  ];
  const connections = {};
  for (const group of groups) {
    const ids = group.map(perk => perk.id);
    const start = ids.shift();
    connections[start] = ids;
  }
  return connections;
}());

GameDatabase.reality.perks = {
  glyphChoice3: {
    id: 0,
    label: "G0",
    description: "You can now choose from 3 different glyphs on Reality."
  },
  startAM1: {
    id: 10,
    label: "S1",
    description: "Start with 100 antimatter after every reset",
    effect: () => 100
  },
  startAM2: {
    id: 11,
    label: "S2",
    description: "Start with 1e130 antimatter after every reset",
    effect: () => 1e130
  },
  startIP1: {
    id: 12,
    label: "S3",
    description: "Start with 2e15 IP after every Eternity and Reality",
    effect: () => 2e15
  },
  startIP2: {
    id: 13,
    label: "S4",
    description: "Start with 2e130 IP after every Eternity and Reality",
    effect: () => 2e130
  },
  startEP1: {
    id: 14,
    label: "S5",
    description: "Start with 10 EP after every Reality",
    effect: () => 10
  },
  startEP2: {
    id: 15,
    label: "S6",
    description: "Start with 2000 EP after every Reality",
    effect: () => 2000
  },
  startEP3: {
    id: 16,
    label: "S7",
    description: "Start with 1e9 EP after every Reality",
    effect: () => 1e9
  },
  startTP: {
    id: 17,
    label: "S8",
    description: "Start with 10 TP after unlocking Dilation"
  },
  glyphLevelIncrease1: {
    id: 20,
    label: "G1",
    description: "+1 to base glyph level",
    effect: () => 1
  },
  glyphLevelIncrease2: {
    id: 21,
    label: "G2",
    description: "+1 to base glyph level",
    effect: () => 1
  },
  glyphChoice4: {
    id: 22,
    label: "G3",
    description: "+1 glyph choice on Reality"
  },
  glyphRarityIncrease: {
    id: 23,
    label: "G4",
    description: "+5% minimum glyph rarity"
  },
  automatorRowIncrease1: {
    id: 30,
    label: "AR1",
    description: "+5 automator rows",
    effect: () => 5
  },
  automatorRowIncrease2: {
    id: 31,
    label: "AR2",
    description: "+10 automator rows",
    effect: () => 10
  },
  automatorRowScaling: {
    id: 32,
    label: "AR3",
    description: "Improve the Automator row per Reality scaling",
    effect: () => 0.85
  },
  autounlockEU1: {
    id: 40,
    label: "AU1",
    description: "Auto-unlock the first row of Eternity upgrades after first Eternity of a Reality"
  },
  autounlockEU2: {
    id: 41,
    label: "AU2",
    description: "Auto-unlock the second row of Eternity upgrades after first Eternity of a Reality"
  },
  autounlockDilation1: {
    id: 42,
    label: "AU3",
    description: "Auto-unlock the second row of Dilation upgrades on Dilation unlock"
  },
  autounlockDilation2: {
    id: 43,
    label: "AU4",
    description: "Auto-unlock the third row of Dilation upgrades on Dilation unlock"
  },
  autounlockDilation3: {
    id: 44,
    label: "AU5",
    description: "Auto-unlock Dilation TT generation when you have 1e15 DT"
  },
  autounlockTD: {
    id: 45,
    label: "AU6",
    description: "Auto-unlock Time Dimensions 5-8 when you have enough TT"
  },
  autounlockReality: {
    id: 46,
    label: "AU7",
    description: "Auto-unlock Reality at e4000 EP"
  },
  bypassIDAntimatter: {
    id: 51,
    label: "B1",
    description: "Infinity Dimensions no longer have antimatter requirements"
  },
  bypassDGReset: {
    id: 52,
    label: "B2",
    description: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time"
  },
  bypassECDilation: {
    id: 53,
    label: "B3",
    description: "Remove the EC11/EC12 and TT requirement for Time Dilation"
  },
  bypassEC1Lock: {
    id: 54,
    label: "B4",
    description: "Remove the EC1 requirement from study 181"
  },
  bypassEC2Lock: {
    id: 55,
    label: "B5",
    description: "Remove the EC2 requirement from study 181"
  },
  bypassEC3Lock: {
    id: 56,
    label: "B6",
    description: "Remove the EC3 requirement from study 181"
  },
  bypassEC5Lock: {
    id: 57,
    label: "B7",
    description: "Remove the EC5 requirement from study 62"
  },
  autocompleteEC1: {
    id: 60,
    label: "AE1",
    description: "Auto-complete one EC every 6 hours",
    effect: () => 6
  },
  autocompleteEC2: {
    id: 61,
    label: "AE2",
    description: "Auto-complete one EC every 4 hours",
    effect: () => 4
  },
  autocompleteEC3: {
    id: 62,
    label: "AE3",
    description: "Auto-complete one EC every 2 hours",
    effect: () => 2
  },
  autocompleteEC4: {
    id: 63,
    label: "AE4",
    description: "Auto-complete one EC every 1 hour",
    effect: () => 1
  },
  autocompleteEC5: {
    id: 64,
    label: "AE5",
    description: "Auto-complete one EC every 30 minutes",
    effect: () => 0.5
  },
  studyActiveEP: {
    id: 70,
    label: "TS1",
    description: "Active path EP is always 50x"
  },
  studyIdleEP: {
    id: 71,
    label: "TS2",
    description: "Idle path EP starts as if you have spent 15 minutes in this Eternity",
    effect: () => TimeSpan.fromMinutes(15)
  },
  studyECRequirement: {
    id: 72,
    label: "TS3",
    description: "Remove non-TT requirements for unlocking Eternity Challenges"
  },
  studyECBulk: {
    id: 73,
    label: "TS4",
    description: "You can complete multiple tiers of Eternity Challenges at once if you reach the goal for a higher completion of that challenge"
  },
  retroactiveTP1: {
    id: 80,
    label: "TP1",
    description: "When buying the 3xTP gain upgrade, multiply your TP by 1.5",
    effect: () => 1.5
  },
  retroactiveTP2: {
    id: 81,
    label: "TP2",
    description: "When buying the 3xTP gain upgrade, multiply your TP by 2",
    effect: () => 2
  },
  retroactiveTP3: {
    id: 82,
    label: "TP3",
    description: "When buying the 3xTP gain upgrade, multiply your TP by 2.5",
    effect: () => 2.5
  },
  retroactiveTP4: {
    id: 83,
    label: "TP4",
    description: "When buying the 3xTP gain upgrade, multiply your TP by 3",
    effect: () => 3
  },
  autobuyerDilation: {
    id: 100,
    label: "AB1",
    description: "Unlock autobuyers for repeatable dilation upgrades"
  },
  autobuyerFasterID: {
    id: 101,
    label: "AB2",
    description: "Infinity Dimension autobuyers work 3 times faster"
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "AB3",
    description: "Replicanti autobuyers work 3 times faster"
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "AB4",
    description: "Dilation autobuyers work 3 times faster"
  },
  autobuyerTT1: {
    id: 104,
    label: "AB5",
    description: "Autobuy max TT every 10 seconds"
  },
  autobuyerTT2: {
    id: 105,
    label: "AB6",
    description: "Autobuy max TT every 5 seconds"
  },
  autobuyerTT3: {
    id: 106,
    label: "AB7",
    description: "Autobuy max TT every 3 seconds"
  },
  autobuyerTT4: {
    id: 107,
    label: "AB8",
    description: "Autobuy max TT every second"
  },
  achievementRow1: {
    id: 201,
    label: "ACH1",
    description: "Start with the 1st achievement row after Reality"
  },
  achievementRow2: {
    id: 202,
    label: "ACH2",
    description: "Start with the 2nd achievement row after Reality"
  },
  achievementRow3: {
    id: 203,
    label: "ACH3",
    description: "Start with the 3rd achievement row after Reality"
  },
  achievementRow4: {
    id: 204,
    label: "ACH4",
    description: "Start with the 4th achievement row after Reality"
  },
  achievementRow5: {
    id: 205,
    label: "ACH5",
    description: "Start with the 5th achievement row after Reality"
  },
  achievementRow6: {
    id: 206,
    label: "ACH6",
    description: "Start with the 6th achievement row after Reality"
  },
  achievementRow7: {
    id: 207,
    label: "ACH7",
    description: "Start with the 7th achievement row after Reality"
  },
  achievementRow8: {
    id: 208,
    label: "ACH8",
    description: "Start with the 8th achievement row after Reality"
  },
  achievementRow9: {
    id: 209,
    label: "ACH9",
    description: "Start with the 9th achievement row after Reality"
  },
  achievementRow10: {
    id: 210,
    label: "ACH10",
    description: "Start with the 10th achievement row after Reality"
  },
  achievementRow11: {
    id: 211,
    label: "ACH11",
    description: "Start with the 11th achievement row after Reality"
  },
  achievementRow12: {
    id: 212,
    label: "ACH12",
    description: "Start with the 12th achievement row after Reality"
  },
  achievementRow13: {
    id: 213,
    label: "ACH13",
    description: "Start with the 13th achievement row after Reality"
  }
};

GameDatabase.reality.perkConnections = (function() {
  const p = GameDatabase.reality.perks;
  // First item is the start, other items are the ends
  const groups = [
    [p.glyphChoice3,
      p.achievementRow1, p.startAM1, p.glyphLevelIncrease1, p.glyphLevelIncrease2,
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
    [p.glyphChoice4, p.glyphLevelIncrease1, p.glyphRarityIncrease],
    [p.glyphRarityIncrease, p.glyphLevelIncrease2, p.glyphChoice4],
    [p.automatorRowIncrease1, p.automatorRowIncrease2, p.autobuyerFasterID],
    [p.automatorRowIncrease2, p.automatorRowScaling],
    [p.automatorRowScaling],
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
    [p.autobuyerTT1, p.autobuyerTT2],
    [p.autobuyerTT2, p.autobuyerTT3],
    [p.autobuyerTT3, p.autobuyerTT4],
    [p.autobuyerTT4],
    [p.achievementRow1, p.achievementRow2],
    [p.achievementRow2, p.achievementRow3],
    [p.achievementRow3, p.achievementRow4],
    [p.achievementRow4, p.achievementRow5],
    [p.achievementRow5, p.achievementRow6],
    [p.achievementRow6, p.achievementRow7],
    [p.achievementRow7, p.achievementRow8],
    [p.achievementRow8, p.achievementRow9],
    [p.achievementRow9, p.achievementRow10],
    [p.achievementRow10, p.achievementRow11],
    [p.achievementRow11, p.achievementRow12],
    [p.achievementRow12, p.achievementRow13],
    [p.achievementRow13]
  ];
  const connections = {};
  for (let group of groups) {
    const ids = group.map(perk => perk.id);
    const start = ids.shift();
    connections[start] = ids;
  }
  return connections;
}());
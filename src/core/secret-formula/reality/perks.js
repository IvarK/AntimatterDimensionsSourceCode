import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

export const PERK_FAMILY = {
  ANTIMATTER: "ANTIMATTER",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATION: "AUTOMATION",
  ACHIEVEMENT: "ACHIEVEMENT",
};

// Of the two positions, untangledPosition specifies the "default non-overlapping" tree,
// while gridPosition specifies coordinates based on the Android tree layout
GameDatabase.reality.perks = {
  firstPerk: {
    id: 0,
    label: "START",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Remove the achievement requirement from the Reality Study
      and allow you to choose from ${formatInt(4)} different Glyphs on Reality.`;
    },
    effect: 4,
    untangledPosition: new Vector(0, 0),
    gridPosition: new Vector(0, 0),
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
    untangledPosition: new Vector(-190, 0),
    gridPosition: new Vector(0, -1),
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
    untangledPosition: new Vector(-375, -15),
    gridPosition: new Vector(-1, -1),
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
    untangledPosition: new Vector(-445, -175),
    gridPosition: new Vector(-2, -1),
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
    automatorPoints: 5,
    shortDescription: () => `Start with ${formatInt(10)} EP`,
    untangledPosition: new Vector(-415, 165),
    gridPosition: new Vector(-1, -2),
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
    untangledPosition: new Vector(-565, 205),
    gridPosition: new Vector(-2, -3),
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
    automatorPoints: 10,
    shortDescription: () => `Start with ${format(5e9)} EP`,
    untangledPosition: new Vector(-700, 240),
    gridPosition: new Vector(-2, -4),
  },
  startTP: {
    id: 17,
    label: "STP",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `After unlocking Dilation, gain ${formatInt(10)} Tachyon Particles.`;
    },
    effect: () => (Enslaved.isRunning ? 1 : 10),
    automatorPoints: 5,
    shortDescription: () => `Start with ${formatInt(10)} TP`,
    untangledPosition: new Vector(-385, 335),
    gridPosition: new Vector(-1, -3),
  },
  antimatterNoReset: {
    id: 30,
    label: "ANR",
    family: PERK_FAMILY.ANTIMATTER,
    description: `Dimension Boosts and Antimatter Galaxies no longer reset
      Antimatter, Antimatter Dimensions, Tickspeed, or Dimensional Sacrifice.`,
    untangledPosition: new Vector(-275, 120),
    gridPosition: new Vector(0, -2),
  },
  studyPassive: {
    id: 31,
    label: "PASS",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Improve Time Study 122 to ${formatX(50)} Eternity Points and
        Time Study 142 to ${formatX(DC.E50)} Infinity Points.
        ${Pelle.isDoomed ? "" : `In addition, Time Study 132 also makes Replicanti ${format(3)} times faster.`}`;
    },
    untangledPosition: new Vector(300, -130),
    gridPosition: new Vector(0, 2),
  },
  autounlockEU1: {
    id: 40,
    label: "EU1",
    family: PERK_FAMILY.ETERNITY,
    description: `Automatically unlock the first row of Eternity Upgrades for free once you have Eternities.`,
    untangledPosition: new Vector(50, 150),
    gridPosition: new Vector(1, -1),
  },
  autounlockEU2: {
    id: 41,
    label: "EU2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `The second row of Eternity Upgrades is automatically purchased
        at ${formatX(1e10)} times less than their original price`;
    },
    untangledPosition: new Vector(50, 325),
    gridPosition: new Vector(1, -2),
  },
  autounlockDilation1: {
    id: 42,
    label: "DU1",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, automatically unlock the second row of Dilation Upgrades for free.",
    untangledPosition: new Vector(165, 565),
    gridPosition: new Vector(1, -4),
  },
  autounlockDilation2: {
    id: 43,
    label: "DU2",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, automatically unlock the third row of Dilation Upgrades for free.",
    untangledPosition: new Vector(310, 605),
    gridPosition: new Vector(1, -5),
  },
  autounlockDilation3: {
    id: 44,
    label: "ATT",
    family: PERK_FAMILY.DILATION,
    description: "Automatically purchase the passive Time Theorem generation Dilation Upgrade once you can afford it.",
    automatorPoints: 5,
    shortDescription: () => "Auto-purchase TT generation",
    untangledPosition: new Vector(460, 580),
    gridPosition: new Vector(1, -6),
  },
  autounlockTD: {
    id: 45,
    label: "ATD",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 once you can afford them.",
    automatorPoints: 5,
    shortDescription: () => "Auto-unlock TD 5-8",
    untangledPosition: new Vector(605, 575),
    gridPosition: new Vector(0, -6),
  },
  autounlockReality: {
    id: 46,
    label: "REAL",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Auto-unlocks Reality once you have ${format(DC.E4000)} Eternity Points
        and have unlocked Time Dimension 8.`;
    },
    automatorPoints: 10,
    shortDescription: () => "Auto-unlock Reality",
    untangledPosition: new Vector(725, 505),
    gridPosition: new Vector(0, -7),
  },
  bypassIDAntimatter: {
    id: 51,
    label: "IDR",
    family: PERK_FAMILY.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements.",
    untangledPosition: new Vector(-580, -230),
    gridPosition: new Vector(-2, 0),
  },
  bypassTGReset: {
    id: 52,
    label: "TGR",
    family: PERK_FAMILY.DILATION,
    description: "The 2nd rebuyable Dilation Upgrade no longer resets your Dilated Time.",
    untangledPosition: new Vector(-145, 520),
    gridPosition: new Vector(0, -3),
  },
  bypassECDilation: {
    id: 53,
    label: "DILR",
    family: PERK_FAMILY.DILATION,
    description: "Remove the Eternity Challenge 11, Eternity Challenge 12, and total Time Theorem " +
      "requirements from Time Dilation unlock.",
    automatorPoints: 5,
    shortDescription: () => `Unlocking Dilation only requires TT`,
    untangledPosition: new Vector(0, 640),
    gridPosition: new Vector(2, -4),
  },
  bypassEC1Lock: {
    id: 54,
    label: "EC1R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 1 requirement from Time Study 181.",
    untangledPosition: new Vector(450, -160),
    gridPosition: new Vector(0, 3),
  },
  bypassEC2Lock: {
    id: 55,
    label: "EC2R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 2 requirement from Time Study 181.",
    untangledPosition: new Vector(350, -270),
    gridPosition: new Vector(-1, 3),
  },
  bypassEC3Lock: {
    id: 56,
    label: "EC3R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 3 requirement from Time Study 181.",
    untangledPosition: new Vector(410, -25),
    gridPosition: new Vector(1, 3),
  },
  bypassEC5Lock: {
    id: 57,
    label: "EC5R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 5 requirement from Time Study 62.",
    untangledPosition: new Vector(155, -85),
    gridPosition: new Vector(0, 1),
  },
  autocompleteEC1: {
    id: 60,
    label: "PEC1",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(60)} minutes (real-time).
              ECs will be completed sequentially, requiring all previous
              ECs to be fully completed before progressing to the next EC.`;
    },
    effect: 60,
    automatorPoints: 5,
    shortDescription: () => `Auto-complete ECs every ${formatInt(60)} minutes`,
    untangledPosition: new Vector(345, 135),
    gridPosition: new Vector(2, 2),
  },
  autocompleteEC2: {
    id: 61,
    label: "PEC2",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(40)} minutes (real-time).
        (${formatInt(20)} minute decrease)`;
    },
    effect: 40,
    untangledPosition: new Vector(425, 235),
    gridPosition: new Vector(2, 3),
  },
  autocompleteEC3: {
    id: 62,
    label: "PEC3",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Auto-complete one Eternity Challenge every ${formatInt(20)} minutes (real-time).
        (${formatInt(20)} minute decrease)`;
    },
    effect: 20,
    automatorPoints: 10,
    shortDescription: () => `Auto-complete ECs every ${formatInt(20)} minutes`,
    untangledPosition: new Vector(325, 325),
    gridPosition: new Vector(2, 4),
  },
  studyActiveEP: {
    id: 70,
    label: "ACT",
    family: PERK_FAMILY.ETERNITY,
    description: "Active path multipliers are always maximized.",
    untangledPosition: new Vector(195, -260),
    gridPosition: new Vector(-1, 2),
  },
  studyIdleEP: {
    id: 71,
    label: "IDL",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Idle path multipliers start as if you have spent ${formatInt(15)} minutes in this Infinity/Eternity.`;
    },
    effect: 15,
    untangledPosition: new Vector(265, 25),
    gridPosition: new Vector(1, 2),
  },
  studyECRequirement: {
    id: 72,
    label: "ECR",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove non-Time Theorem requirements for unlocking Eternity Challenges.",
    automatorPoints: 10,
    shortDescription: () => "Remove EC secondary requirements",
    untangledPosition: new Vector(605, -160),
    gridPosition: new Vector(0, 4),
  },
  studyECBulk: {
    id: 73,
    label: "ECB",
    family: PERK_FAMILY.ETERNITY,
    description:
      `You can complete multiple tiers of Eternity Challenges at once if
      you reach the goal for a higher completion of that challenge.`,
    automatorPoints: 15,
    shortDescription: () => "Bulk EC Completion",
    untangledPosition: new Vector(740, -135),
    gridPosition: new Vector(0, 5),
  },
  retroactiveTP1: {
    id: 80,
    label: "TP1",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the 3rd rebuyable Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatFloat(1.5, 1)}.`;
    },
    effect: 1.5,
    untangledPosition: new Vector(-290, 460),
    gridPosition: new Vector(-1, -4),
  },
  retroactiveTP2: {
    id: 81,
    label: "TP2",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the 3rd rebuyable Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatInt(2)}.`;
    },
    effect: 2,
    untangledPosition: new Vector(-200, 360),
    gridPosition: new Vector(-1, -5),
  },
  retroactiveTP3: {
    id: 82,
    label: "TP3",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the 3rd rebuyable Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatFloat(2.5, 1)}.`;
    },
    effect: 2.5,
    untangledPosition: new Vector(-120, 260),
    gridPosition: new Vector(-1, -6),
  },
  retroactiveTP4: {
    id: 83,
    label: "TP4",
    family: PERK_FAMILY.DILATION,
    get description() {
      return `When buying the 3rd rebuyable Dilation Upgrade,
        multiply your current Tachyon Particle amount by ${formatInt(3)}.`;
    },
    effect: 3,
    automatorPoints: 10,
    shortDescription: () => `${formatX(3)} TP upgrade applies retroactively`,
    untangledPosition: new Vector(-65, 145),
    gridPosition: new Vector(-2, -6),
  },
  autobuyerDilation: {
    id: 100,
    label: "DAU",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock autobuyers for the repeatable Dilation Upgrades.",
    automatorPoints: 5,
    shortDescription: () => "Dilation Upgrade Autobuyers",
    untangledPosition: new Vector(20, 500),
    gridPosition: new Vector(1, -3),
  },
  autobuyerFasterID: {
    id: 101,
    label: "IDAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Infinity Dimension autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Faster ID Autobuyers",
    untangledPosition: new Vector(-515, -20),
    gridPosition: new Vector(-1, 0),
  },
  autobuyerFasterReplicanti: {
    id: 102,
    label: "REPAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Replicanti autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Faster Replicanti Autobuyers",
    untangledPosition: new Vector(-425, -310),
    gridPosition: new Vector(-2, -2),
  },
  autobuyerFasterDilation: {
    id: 103,
    label: "DAS",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Dilation Upgrade autobuyers work ${formatX(3)} faster.`;
    },
    effect: 1 / 3,
    automatorPoints: 5,
    shortDescription: () => "Faster Dilation Autobuyers",
    untangledPosition: new Vector(490, 450),
    gridPosition: new Vector(2, -6),
  },
  ttBuySingle: {
    id: 104,
    label: "TTS",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock a Time Theorem Autobuyer which buys single Time Theorems every tick.",
    automatorPoints: 5,
    shortDescription: () => "Single TT Autobuyer",
    untangledPosition: new Vector(190, -410),
    gridPosition: new Vector(-2, 2),
  },
  ttFree: {
    id: 105,
    label: "TTF",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Purchasing Time Theorems no longer spends your Antimatter, Infinity Points, or Eternity Points.`;
    },
    untangledPosition: new Vector(255, -540),
    gridPosition: new Vector(-2, 3),
  },
  ttBuyMax: {
    id: 106,
    label: "TTM",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Upgrade the Time Theorem Autobuyer to buy max Time Theorems.`;
    },
    automatorPoints: 10,
    shortDescription: () => "Max TT Autobuyer",
    untangledPosition: new Vector(360, -625),
    gridPosition: new Vector(-2, 4),
  },
  achievementGroup1: {
    id: 201,
    label: "ACH1",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(20)} minutes per
        Achievement (${formatInt(10)} minute decrease).`;
    },
    effect: 10,
    automatorPoints: 5,
    shortDescription: () => `Faster Achievements: every ${formatInt(20)} minutes`,
    untangledPosition: new Vector(-45, -135),
    gridPosition: new Vector(1, 0),
  },
  achievementGroup2: {
    id: 202,
    label: "ACH2",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(12)} minutes per
        Achievement (${formatInt(8)} minute decrease).`;
    },
    effect: 8,
    untangledPosition: new Vector(-115, -250),
    gridPosition: new Vector(2, 0),
  },
  achievementGroup3: {
    id: 203,
    label: "ACH3",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(6)} minutes per
        Achievement (${formatInt(6)} minute decrease).`;
    },
    effect: 6,
    untangledPosition: new Vector(-175, -365),
    gridPosition: new Vector(2, -1),
  },
  achievementGroup4: {
    id: 204,
    label: "ACH4",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Reduce the Achievement timer to ${formatInt(2)} minutes per
        Achievement (${formatInt(4)} minute decrease).`;
    },
    effect: 4,
    untangledPosition: new Vector(-180, -500),
    gridPosition: new Vector(2, -2),
  },
  achievementGroup5: {
    id: 205,
    label: "ACHNR",
    family: PERK_FAMILY.ACHIEVEMENT,
    get description() {
      return `Immediately unlock the first ${formatInt(13)} rows of Achievements
        and Reality no longer resets them.`;
    },
    automatorPoints: 10,
    shortDescription: () => "Keep Achievements on Reality",
    untangledPosition: new Vector(-195, -630),
    gridPosition: new Vector(2, -3),
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
    [p.studyActiveEP, p.bypassEC2Lock, p.ttBuySingle],
    [p.studyIdleEP, p.bypassEC3Lock, p.autocompleteEC1],
    [p.studyECRequirement, p.studyECBulk],
    [p.retroactiveTP1, p.bypassTGReset, p.startTP, p.retroactiveTP2],
    [p.retroactiveTP2, p.retroactiveTP3],
    [p.retroactiveTP3, p.retroactiveTP4],
    [p.autobuyerDilation, p.autounlockEU2, p.autounlockDilation1, p.bypassECDilation, p.bypassTGReset],
    [p.autobuyerFasterID],
    [p.ttBuySingle, p.ttFree],
    [p.ttFree, p.ttBuyMax],
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

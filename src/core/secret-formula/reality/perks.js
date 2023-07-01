import { DC } from "../../constants";

export const PERK_FAMILY = {
  ANTIMATTER: "ANTIMATTER",
  INFINITY: "INFINITY",
  ETERNITY: "ETERNITY",
  DILATION: "DILATION",
  REALITY: "REALITY",
  AUTOMATION: "AUTOMATION",
  ACHIEVEMENT: "ACHIEVEMENT",
};

// This function isn't used in-game, see note below for its intended usage
// eslint-disable-next-line no-unused-vars
function vectorToNum(v) {
  return Math.floor(v.x / 5) + 400 * Math.floor(v.y / 5) + 80200;
}

/**
 * In order to reduce boilerplate code and excessive Vector object declarations, the node positions in fixed layouts
 * are specified as numbers which are decoded on-the-fly using positionNumToVector in PerksTab.vue. The function
 * vectorToNum above is the inverse of that function.
 *
 * To make a new preset layout, define vectorToNum in the console, move all the nodes around in-game and then run
 *    Object.values(PerkNetwork.network.body.nodes).filter(n => n.edges.length !== 0).map(v => vectorToNum(v))
 * in the console to get all the current node positions. Then, append the resulting numbers to each layoutPosList
 * array below and make the appripriate entry in PerkLayouts.
 *
 * Note: This encoding/decoding only works properly for coordinates with values between -1000 and 1000, and will
 * be slightly off for vectors whose coordinates aren't divisible by 5
 */
export const perks = {
  firstPerk: {
    id: 0,
    label: "START",
    family: PERK_FAMILY.REALITY,
    get description() {
      return `Remove the achievement requirement from the Reality Study
      and allow you to choose from ${formatInt(4)} different Glyphs on Reality.`;
    },
    effect: 4,
    layoutPosList: [80200, 80200, 80200, 80200, 80188, 67769],
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
    layoutPosList: [80162, 80600, 80199, 80600, 81391, 75745],
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
    layoutPosList: [78925, 80599, 79798, 80599, 82194, 91322],
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
    layoutPosList: [66111, 80598, 80198, 80998, 82197, 91690],
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
    layoutPosList: [93317, 80999, 79398, 80598, 81397, 103734],
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
    layoutPosList: [96487, 81398, 78998, 80597, 81800, 102193],
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
    layoutPosList: [99260, 81798, 78997, 80996, 81803, 106247],
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
    layoutPosList: [106923, 81399, 79399, 80198, 81400, 109376],
  },
  antimatterNoReset: {
    id: 30,
    label: "ANR",
    family: PERK_FAMILY.ANTIMATTER,
    description: `Dimension Boosts and Antimatter Galaxies no longer reset
      Antimatter, Antimatter Dimensions, Tickspeed, or Dimensional Sacrifice.`,
    layoutPosList: [89745, 81000, 79799, 80199, 81394, 92553],
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
    layoutPosList: [69860, 79400, 81000, 80202, 78594, 52589],
  },
  autounlockEU1: {
    id: 40,
    label: "EU1",
    family: PERK_FAMILY.ETERNITY,
    description: `Automatically unlock the first row of Eternity Upgrades for free once you have Eternities.`,
    layoutPosList: [92210, 80601, 80201, 79800, 80591, 73007],
  },
  autounlockEU2: {
    id: 41,
    label: "EU2",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `The second row of Eternity Upgrades is automatically purchased
        at ${formatX(1e10)} times less than their original price.`;
    },
    layoutPosList: [106210, 81001, 80202, 79400, 80594, 81867],
  },
  autounlockDilation1: {
    id: 42,
    label: "DU1",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, automatically unlock the second row of Dilation Upgrades for free.",
    layoutPosList: [125433, 81801, 79803, 79398, 80200, 97510],
  },
  autounlockDilation2: {
    id: 43,
    label: "DU2",
    family: PERK_FAMILY.DILATION,
    description: "After unlocking Dilation, automatically unlock the third row of Dilation Upgrades for free.",
    layoutPosList: [128662, 82201, 79403, 79397, 80203, 85513],
  },
  autounlockDilation3: {
    id: 44,
    label: "ATT",
    family: PERK_FAMILY.DILATION,
    description: "Automatically purchase the passive Time Theorem generation Dilation Upgrade once you can afford it.",
    automatorPoints: 5,
    shortDescription: () => "Auto-purchase TT generation",
    layoutPosList: [126692, 82601, 79402, 79396, 80206, 72282],
  },
  autounlockTD: {
    id: 45,
    label: "ATD",
    family: PERK_FAMILY.DILATION,
    description: "Auto-unlock Time Dimensions 5-8 once you can afford them.",
    automatorPoints: 5,
    shortDescription: () => "Auto-unlock TD 5-8",
    layoutPosList: [126321, 82600, 79001, 79796, 80209, 61869],
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
    layoutPosList: [120745, 83000, 79000, 80196, 80212, 71046],
  },
  bypassIDAntimatter: {
    id: 51,
    label: "IDR",
    family: PERK_FAMILY.INFINITY,
    description: "Infinity Dimensions no longer have antimatter requirements.",
    layoutPosList: [61684, 80198, 79797, 80997, 82200, 79297],
  },
  bypassTGReset: {
    id: 52,
    label: "TGR",
    family: PERK_FAMILY.DILATION,
    description: "The 2nd rebuyable Dilation Upgrade no longer resets your Dilated Time.",
    layoutPosList: [121771, 81400, 79801, 79798, 81000, 112677],
  },
  bypassECDilation: {
    id: 53,
    label: "DILR",
    family: PERK_FAMILY.DILATION,
    description: "Remove the Eternity Challenge 11, Eternity Challenge 12, and total Time Theorem " +
      "requirements from Time Dilation unlock.",
    automatorPoints: 5,
    shortDescription: () => `Unlocking Dilation only requires TT`,
    layoutPosList: [131400, 81802, 80203, 79799, 80600, 109116],
  },
  bypassEC1Lock: {
    id: 54,
    label: "EC1R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 1 requirement from Time Study 181.",
    layoutPosList: [67490, 79000, 81399, 80603, 78597, 44167],
  },
  bypassEC2Lock: {
    id: 55,
    label: "EC2R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 2 requirement from Time Study 181.",
    layoutPosList: [58670, 78999, 80999, 80602, 78197, 48944],
  },
  bypassEC3Lock: {
    id: 56,
    label: "EC3R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 3 requirement from Time Study 181.",
    layoutPosList: [78282, 79001, 81400, 80203, 78997, 47822],
  },
  bypassEC5Lock: {
    id: 57,
    label: "EC5R",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove the Eternity Challenge 5 requirement from Time Study 62.",
    layoutPosList: [73431, 79800, 80600, 80201, 78591, 62607],
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
    layoutPosList: [91069, 79402, 81002, 79803, 79397, 46664],
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
    layoutPosList: [99085, 79002, 81402, 79804, 79400, 53486],
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
    layoutPosList: [106265, 78602, 81401, 80204, 79403, 61903],
  },
  studyActiveEP: {
    id: 70,
    label: "ACT",
    family: PERK_FAMILY.ETERNITY,
    description: "Active path multipliers are always maximized.",
    layoutPosList: [59439, 79399, 80599, 80601, 78194, 58565],
  },
  studyIdleEP: {
    id: 71,
    label: "IDL",
    family: PERK_FAMILY.ETERNITY,
    get description() {
      return `Idle path multipliers start as if you have spent ${formatInt(15)} minutes in this Infinity/Eternity.`;
    },
    effect: 15,
    layoutPosList: [82253, 79401, 81001, 79802, 78994, 56239],
  },
  studyECRequirement: {
    id: 72,
    label: "ECR",
    family: PERK_FAMILY.ETERNITY,
    description: "Remove non-Time Theorem requirements for unlocking Eternity Challenges.",
    automatorPoints: 10,
    shortDescription: () => "Remove EC secondary requirements",
    layoutPosList: [67521, 78600, 81398, 80604, 78600, 40599],
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
    layoutPosList: [69548, 78200, 80998, 81004, 78603, 41435],
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
    layoutPosList: [116942, 81799, 79800, 79797, 81003, 115434],
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
    layoutPosList: [108960, 82199, 79401, 80197, 81006, 117382],
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
    layoutPosList: [100976, 82599, 79400, 80596, 81009, 116540],
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
    layoutPosList: [91787, 82598, 78999, 80995, 81012, 114103],
  },
  autobuyerDilation: {
    id: 100,
    label: "DAU",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock autobuyers for the repeatable Dilation Upgrades.",
    automatorPoints: 5,
    shortDescription: () => "Dilation Upgrade Autobuyers",
    layoutPosList: [120204, 81401, 79802, 79399, 80597, 96672],
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
    layoutPosList: [78497, 80199, 79397, 81000, 82597, 77720],
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
    layoutPosList: [55315, 80998, 80197, 80999, 82600, 104489],
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
    layoutPosList: [116298, 82602, 79002, 79395, 80609, 72715],
  },
  ttBuySingle: {
    id: 104,
    label: "TTS",
    family: PERK_FAMILY.AUTOMATION,
    description: "Unlock a Time Theorem Autobuyer which buys single Time Theorems every tick.",
    automatorPoints: 5,
    shortDescription: () => "Single TT Autobuyer",
    layoutPosList: [47438, 79398, 80598, 81001, 77797, 57325],
  },
  ttFree: {
    id: 105,
    label: "TTF",
    family: PERK_FAMILY.AUTOMATION,
    get description() {
      return `Purchasing Time Theorems no longer spends your Antimatter, Infinity Points, or Eternity Points.`;
    },
    layoutPosList: [37051, 78998, 80597, 81002, 77800, 67309],
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
    layoutPosList: [30272, 78598, 80997, 81003, 77803, 65739],
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
    layoutPosList: [69391, 80201, 80601, 79801, 79791, 81371],
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
    layoutPosList: [60177, 80202, 80602, 79401, 79794, 93780],
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
    layoutPosList: [50965, 80602, 80603, 79402, 79797, 83005],
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
    layoutPosList: [40164, 81002, 81003, 79403, 79800, 95422],
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
    layoutPosList: [29761, 81402, 81403, 79404, 79803, 84639],
  }
};

export const perkConnections = (function() {
  const p = perks;
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
  for (const perk of Object.values(perks)) {
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

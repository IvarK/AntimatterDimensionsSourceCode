/* eslint-disable max-depth */
/* eslint-disable camelcase */
import { GameDatabase } from "../game-database";

import { MultiplierTabHelper } from "./helper-functions";

const propList = {
  AD: ["purchase", "achievement", "dimboost", "sacrifice", "infinityUpgrade", "breakInfinityUpgrade",
    "infinityPower", "infinityChallenge", "timeStudy", "eternityChallenge", "glyph", "alchemy", "other"],
  ID: ["purchase", "achievement", "replicanti", "infinityChallenge", "timeStudy", "eternityChallenge", "glyph",
    "alchemy", "other"],
  TD: ["purchase", "achievement", "timeStudy", "eternityChallenge", "glyph", "alchemy", "other"],
  IP: ["base", "infinityUpgrade", "achievement", "timeStudy", "dilationUpgrade", "glyph", "other"],
  EP: ["base", "eternityUpgrade", "timeStudy", "glyph", "other"],
  TP: ["base", "achievement", "dilation", "realityUpgrade", "dilationGlyphSacrifice"],
  DT: ["tachyon", "achievement", "dilation", "realityUpgrade", "glyph", "ra", "other"],
  infinities: ["achievement", "timeStudy", "realityUpgrades", "glyph", "ra"],
  eternities: ["achievement", "realityUpgrades", "glyph", "alchemy"]
};

// Used for individual dimension breakdowns of effects (eg. full achievement mult into its values on individual ADs)
// Results in an array of ["key_1", "key_2", ... , "key_8"]
function append8(key) {
  const props = [];
  for (let dim = 1; dim <= 8; dim++) props.push(`${key}_${dim}`);
  return props;
}

// Helper method to create very long lists of entries in the tree; format is "RESOURCE_SOURCE_DIMENSION"
function getProps(resource, tier) {
  const props = propList[resource].map(s => `${resource}_${s}`);
  if (!tier) return props;
  const newProps = [];
  for (const effect of props) newProps.push(`${effect}_${tier}`);
  return newProps;
}

// Everything is multiplierTabTree is associated with values in GameDatabase.multiplierTabValues. The only explicitly
// initialized props here are the "root" props which are viewable on the tab with full breakdowns. After the initial
// specification, all children props are dynamically added based on the arrays in the helper functions above
GameDatabase.multiplierTabTree = {
  AM_total: [
    ["AD_total", "tickspeed_total"]
  ],
  AD_total: [
    append8("AD_total"),
    getProps("AD")
  ],
  ID_total: [
    append8("ID_total"),
    getProps("ID")
  ],
  TD_total: [
    append8("TD_total"),
    getProps("TD")
  ],
  IP_total: [
    getProps("IP")
  ],
  IP_base: [
    ["IP_antimatter", "IP_divisor"]
  ],
  EP_total: [
    getProps("EP")
  ],
  EP_base: [
    ["EP_IP", "EP_divisor"]
  ],
  TP_total: [
    getProps("TP")
  ],
  DT_total: [
    getProps("DT")
  ],
  tickspeed_total: [
    ["tickspeed_upgrades", "tickspeed_galaxies"]
  ],
  tickspeed_upgrades: [
    ["tickspeedUpgrades_purchased", "tickspeedUpgrades_free"]
  ],
  tickspeed_galaxies: [
    ["galaxies_antimatter", "galaxies_replicanti", "galaxies_tachyon"]
  ],
  infinities_total: [
    getProps("infinities")
  ],
  eternities_total: [
    getProps("eternities")
  ],
};

// TP has redundant entries, so we link them together by replacing a reference
GameDatabase.multiplierTabTree.DT_total[0][0] = "TP_total";

// Additional data specification for dynamically-generated props
const dimTypes = ["AD", "ID", "TD"];
const singleRes = ["IP", "EP", "DT"];
const targetedEffects = {
  achievement: {
    checkFn: MultiplierTabHelper.achievementDimCheck,
    AD: [23, 28, 31, 34, 43, 56, 64, 65, 68, 71, 72, 73, 74, 76, 84, 91, 92],
    ID: [75, 94],
    TD: [105, 128],
    IP: [85, 93, 116, 125, 141],
    DT: [132, 137]
  },
  timeStudy: {
    checkFn: MultiplierTabHelper.timeStudyDimCheck,
    AD: [71, 91, 101, 161, 193, 214, 234],
    ID: [72, 82, 92, 162],
    TD: [11, 73, 93, 103, 151, 221, 227],
    IP: [41, 51, 141, 142, 143],
    EP: [61, 121, 122, 123],
  },
  infinityChallenge: {
    checkFn: MultiplierTabHelper.ICDimCheck,
    AD: [3, 4, 8],
    ID: [1, 6],
  },
  eternityChallenge: {
    checkFn: MultiplierTabHelper.ECDimCheck,
    ID: [2, 4, 9],
    TD: [1, 10],
  },
};

// Dynamically generate all values from existing values, but broken down by dimension
for (const res of dimTypes) {
  for (const prop of getProps(res)) GameDatabase.multiplierTabTree[prop] = [append8(prop)];
  for (let dim = 1; dim <= 8; dim++) GameDatabase.multiplierTabTree[`${res}_total_${dim}`] = [getProps(res, dim)];
}

// A few dynamically-generated props are largely useless in terms of what they connect to, in that they have very few
// entries or have 8 identical entries, so we explicitly remove those lists for a cleaner appearance on the UI
const removedProps = ["AD_sacrifice", "AD_breakInfinityUpgrade", "AD_alchemy", "ID_replicanti", "ID_infinityChallenge",
  "ID_alchemy", "TD_achievement", "TD_alchemy"];
for (const prop of removedProps) {
  GameDatabase.multiplierTabTree[prop] = undefined;
}

// We need to handle infinity power multiplier a bit differently; previous steps of dynamic generation fill it with
// 8 identical AD multipliers, but we want to replace it with ID mults and the conversion rate
GameDatabase.multiplierTabTree.AD_infinityPower = [["ID_total", "ID_powerConversion"]];
for (let dim = 1; dim <= 8; dim++) {
  GameDatabase.multiplierTabTree[`AD_infinityPower_${dim}`] = [["ID_total", "ID_powerConversion"]];
}

// Tesseracts are added one layer deep, but we don't want to override the existing ID_purchase entry
GameDatabase.multiplierTabTree.ID_purchase.push(["ID_basePurchase", "ID_tesseractPurchase", "ID_infinityGlyphSacrifice",
  "ID_powPurchase"]);
for (let dim = 1; dim <= 7; dim++) {
  GameDatabase.multiplierTabTree[`ID_purchase_${dim}`] = [[`ID_basePurchase_${dim}`, `ID_tesseractPurchase_${dim}`,
    "ID_powPurchase"]];
}
GameDatabase.multiplierTabTree.ID_purchase_8 = [[`ID_basePurchase_8`, `ID_infinityGlyphSacrifice`, "ID_powPurchase"]];

// These are also added one layer deep
GameDatabase.multiplierTabTree.TD_purchase.push(["TD_basePurchase", "TD_timeGlyphSacrifice", "TD_powPurchase"]);
GameDatabase.multiplierTabTree.TD_purchase_8 = [["TD_basePurchase_8", "TD_timeGlyphSacrifice", "TD_powPurchase"]];

// Dynamically fill effects which only affect certain dimensions, as noted in targetedEffects
for (const res of dimTypes) {
  for (const eff of Object.keys(targetedEffects)) {
    if (!targetedEffects[eff][res]) continue;
    GameDatabase.multiplierTabTree[`${res}_${eff}`] = [[]];
    for (const id of targetedEffects[eff][res]) {
      for (let dim = 1; dim <= 8; dim++) {
        const propStr = `${res}_${eff}_${dim}`;
        const dimStr = `${res}${dim}`;
        if (targetedEffects[eff].checkFn(id, dimStr)) {
          if (!GameDatabase.multiplierTabTree[propStr]) GameDatabase.multiplierTabTree[propStr] = [[]];
          GameDatabase.multiplierTabTree[propStr][0].push(`general_${eff}_${id}_${dimStr}`);
        }
      }
      GameDatabase.multiplierTabTree[`${res}_${eff}`][0].push(`general_${eff}_${id}_${res}`);
    }
  }
}

// Dynamically fill effects which affect single resources as well
for (const res of singleRes) {
  for (const eff of Object.keys(targetedEffects)) {
    if (!targetedEffects[eff][res]) continue;
    GameDatabase.multiplierTabTree[`${res}_${eff}`] = [[]];
    for (const ach of targetedEffects[eff][res]) {
      GameDatabase.multiplierTabTree[`${res}_${eff}`][0].push(`general_${eff}_${ach}`);
    }
  }
}

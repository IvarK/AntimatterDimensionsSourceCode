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
  tickspeed_total: [
    ["tickspeed_upgrades", "tickspeed_galaxies"]
  ],
  tickspeed_upgrades: [
    ["tickspeedUpgrades_purchased", "tickspeedUpgrades_free"]
  ],
  tickspeed_galaxies: [
    ["galaxies_antimatter", "galaxies_replicanti", "galaxies_tachyon"]
  ],
};

// Additional data specification for dynamically-generated props
const dimTypes = ["AD", "ID", "TD"];
const singleRes = ["IP", "EP"];
const targetedEffects = {
  achievement: {
    AD: [23, 28, 31, 34, 43, 56, 64, 65, 68, 71, 72, 73, 74, 76, 84, 91, 92],
    ID: [75, 94],
    TD: [105, 128],
    IP: [85, 93, 116, 125, 141],
    EP: [],
  },
  timeStudy: {
    AD: [71, 91, 101, 161, 193, 214, 234],
    ID: [72, 82, 92, 162],
    TD: [11, 73, 93, 103, 151, 221, 227],
    IP: [41, 51, 141, 142, 143],
    EP: [61, 121, 122, 123],
  }
};

// Dynamically generate all values from existing values, but broken down by dimension
for (const res of dimTypes) {
  for (const prop of getProps(res)) GameDatabase.multiplierTabTree[prop] = [append8(prop)];
  for (let dim = 1; dim <= 8; dim++) GameDatabase.multiplierTabTree[`${res}_total_${dim}`] = [getProps(res, dim)];
}

// A few dynamically-generated props are largely useless in terms of what they connect to, in that they have very few
// entries or have 8 identical entries, so we explicitly remove those lists for a cleaner appearance on the UI
const removedProps = ["AD_sacrifice", "AD_breakInfinityUpgrade", "ID_replicanti", "ID_infinityChallenge",
  "TD_achievement"];
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
GameDatabase.multiplierTabTree.ID_purchase.push(["ID_basePurchase", "ID_tesseractPurchase"]);
for (let dim = 1; dim <= 7; dim++) {
  GameDatabase.multiplierTabTree[`ID_purchase_${dim}`] = [[`ID_basePurchase_${dim}`, `ID_tesseractPurchase_${dim}`]];
}

// Dynamically fill effects which only affect certain dimensions
for (const res of dimTypes) {
  // Achievements
  GameDatabase.multiplierTabTree[`${res}_achievement`] = [[]];
  for (const ach of targetedEffects.achievement[res]) {
    for (let dim = 1; dim <= 8; dim++) {
      const propStr = `${res}_achievement_${dim}`;
      const dimStr = `${res}${dim}`;
      if (MultiplierTabHelper.achievementDimCheck(ach, dimStr)) {
        // eslint-disable-next-line max-depth
        if (!GameDatabase.multiplierTabTree[propStr]) GameDatabase.multiplierTabTree[propStr] = [[]];
        GameDatabase.multiplierTabTree[propStr][0].push(`general_achievement_${ach}_${dimStr}`);
      }
    }
    GameDatabase.multiplierTabTree[`${res}_achievement`][0].push(`general_achievement_${ach}_${res}`);
  }

  // Time Studies
  GameDatabase.multiplierTabTree[`${res}_timeStudy`] = [[]];
  for (const ts of targetedEffects.timeStudy[res]) {
    for (let dim = 1; dim <= 8; dim++) {
      const propStr = `${res}_timeStudy_${dim}`;
      const dimStr = `${res}${dim}`;
      if (MultiplierTabHelper.timeStudyDimCheck(ts, dimStr)) {
        // eslint-disable-next-line max-depth
        if (!GameDatabase.multiplierTabTree[propStr]) GameDatabase.multiplierTabTree[propStr] = [[]];
        GameDatabase.multiplierTabTree[propStr][0].push(`general_timeStudy_${ts}_${dimStr}`);
      }
    }
    GameDatabase.multiplierTabTree[`${res}_timeStudy`][0].push(`general_timeStudy_${ts}_${res}`);
  }
}

// Dynamically fill effects which affect single resources as well
for (const res of singleRes) {
  GameDatabase.multiplierTabTree[`${res}_achievement`] = [[]];
  for (const ach of targetedEffects.achievement[res]) {
    GameDatabase.multiplierTabTree[`${res}_achievement`][0].push(`general_achievement_${ach}`);
  }

  GameDatabase.multiplierTabTree[`${res}_timeStudy`] = [[]];
  for (const ts of targetedEffects.timeStudy[res]) {
    GameDatabase.multiplierTabTree[`${res}_timeStudy`][0].push(`general_timeStudy_${ts}`);
  }
}

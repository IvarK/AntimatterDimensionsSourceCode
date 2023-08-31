import { multiplierTabTree, multiplierTabValues } from "./multiplier-tab";

import { achievements } from "./achievements";
import { awayProgressTypes } from "./away-progress-types";
import { catchupResources } from "./catchup-resources";
import { celestials } from "./celestials";
import { challenges } from "./challenges";
import { changelog } from "./changelog";
import { confirmationTypes } from "./confirmation-types";
import { credits } from "./credits";
import { discordRichPresence } from "./discord-rich-presence";
import { eternity } from "./eternity";
import { h2p } from "./h2p";
import { infinity } from "./infinity";
import { news } from "./news";
import { progressStages } from "./progress-checker";
import { reality } from "./reality";
import { shopPurchases } from "./shop-purchases";
import { sidebarResources } from "./sidebar-resources";
import { speedrunMilestones } from "./speedrun-milestones";
import { tabNotifications } from "./tab-notifications";
import { tabs } from "./tabs";

export const GameDatabase = {
  achievements,
  awayProgressTypes,
  catchupResources,
  celestials,
  challenges,
  changelog,
  confirmationTypes,
  credits,
  discordRichPresence,
  eternity,
  h2p,
  infinity,
  multiplierTabTree,
  multiplierTabValues,
  news,
  progressStages,
  reality,
  sidebarResources,
  shopPurchases,
  speedrunMilestones,
  tabNotifications,
  tabs
};

window.GameDatabase = GameDatabase;

window.mapGameData = function mapGameData(gameData, mapFn) {
  const result = [];
  for (const data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
};

window.mapGameDataToObject = function mapGameDataToObject(gameData, mapFun) {
  const array = Object.entries(gameData);
  const out = {};
  for (let idx = 0; idx < array.length; idx++) {
    out[array[idx][0]] = mapFun(array[idx][1]);
  }
  return {
    all: Object.values(out),
    ...out
  };
};

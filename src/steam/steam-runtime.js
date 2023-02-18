/* eslint-disable no-console */
import { RichPresenceInfo } from "@/core/discord-parser";

import {
  hasPendingPurchaseConfirmations,
  loginPlayFabWithSteam,
  purchaseIAP,
  purchaseShopItem,
  validatePurchases
} from "./steam-purchases";

import * as Greenworks from "./bindings/greenworks";

import { MAC, STEAM } from "@/env";

let isInitialized = false;
let isActive = false;
let achievementNames = [];

export const SteamRuntime = {
  initialize() {
    if (isInitialized) {
      throw Error("Steam Runtime was initialized already.");
    }

    isInitialized = true;

    if (!STEAM || !Greenworks.isModuleLoaded() || !Greenworks.initAPI()) {
      return;
    }

    isActive = true;

    const steamId = Greenworks.getSteamId();
    loginPlayFab(steamId);
    loginFirebase(steamId);

    achievementNames = Greenworks.getAchievementNames();

    Greenworks.on("micro-txn-authorization-response", (data, ordered, orderState) => {
      if (orderState === true) {
        validatePurchases();
      }
    });

    if (!MAC) {
      initializeDiscord();
      createForceRefreshCanvas();
    }
  },

  get isActive() {
    if (!isInitialized) {
      throw Error("Steam Runtime was called before init.");
    }

    return isActive;
  },

  get screenName() {
    if (!this.isActive) {
      return "Non-Steam user";
    }

    return Greenworks.getSteamId()?.screenName ?? "Steam user";
  },

  activateAchievement(id) {
    if (!this.isActive) {
      return;
    }

    const name = `Achievement${id}`;
    if (!achievementNames.includes(name)) {
      return;
    }

    Greenworks.activateAchievement(name);
  },

  async purchaseIAP(std) {
    if (!this.isActive) {
      return;
    }

    await purchaseIAP(std);
  },

  validatePurchases() {
    if (!this.isActive) {
      return;
    }

    validatePurchases();
  },

  async purchaseShopItem(key, cost, cosmeticId) {
    if (!this.isActive) {
      GameUI.notify.error("Shop purchases are not available.");
      return false;
    }

    try {
      await purchaseShopItem(key, cost, cosmeticId);
      return true;
    } catch (e) {
      GameUI.notify.error(e.errorMessage ?? e);
      return false;
    }
  },

  get hasPendingPurchaseConfirmations() {
    if (!this.isActive) {
      return false;
    }

    return hasPendingPurchaseConfirmations();
  }
};

async function loginPlayFab(steamId) {
  try {
    const screenName = steamId.screenName;
    const ticket = await Greenworks.getAuthSessionTicket();
    await loginPlayFabWithSteam(ticket.ticket.toString("hex"), screenName);
    GameUI.notify.info("Logged in to PlayFab Cloud");
  } catch (error) {
    GameUI.notify.error("Couldn't log in to PlayFab Cloud.");
    throw error;
  }
}

async function loginFirebase(steamId) {
  const accountId = steamId.accountId;
  const staticAccountId = steamId.staticAccountId;
  const screenName = steamId.screenName;
  await Cloud.loginWithSteam(accountId, staticAccountId, screenName);
}

function initializeDiscord() {
  Greenworks.initDiscordAPI("1057439416819396689", 1399720);
  setDiscordActivity();
  Greenworks.runDiscordCallbacks();
  setInterval(setDiscordActivity, 8000);
  setInterval(Greenworks.runDiscordCallbacks, 4000);
}

function setDiscordActivity() {
  Greenworks.setDiscordActivity(RichPresenceInfo.state, RichPresenceInfo.details);
}

function createForceRefreshCanvas() {
  // This canvas is required for Steam overlay to properly work in Electron.
  // Makopaz:
  // "essentially it makes the overlay have a refresh rate, otherwise it only
  // updates based on parts of the screen which change, so without it the small
  // areas of the screen where antimatter and such increment would be the only
  // small portions of the overlay showing."
  // There should be a less expensive approach. Please create a new issue or
  // PR on GitHub if you know one, the planet will say thank you for saving
  // megawatts of electricity spent on this canvas.
  const canvas = document.createElement("canvas");
  canvas.classList.add("_steam-refresh-canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function forceRefresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(forceRefresh);
  }

  forceRefresh();
}

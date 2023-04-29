import { RebuyableMechanicState } from "./game-mechanics";
import { SteamRuntime } from "@/steam";

import Payments from "./payments";

export const shop = {};

export const ShopPurchaseData = {
  totalSTD: 0,
  spentSTD: 0,
  respecAvailable: false,
  lastRespec: "",
  unlockedCosmetics: [],

  get availableSTD() {
    return this.totalSTD - this.spentSTD;
  },

  get isIAPEnabled() {
    return Cloud.loggedIn && this.availableSTD >= 0 && player.IAP.enabled;
  },

  // We also allow for respecs if it's been at least 3 days since the last one
  get timeUntilRespec() {
    const msSinceLast = Date.now() - new Date(ShopPurchaseData.lastRespec).getTime();
    return TimeSpan.fromMilliseconds(3 * 86400 * 1000 - msSinceLast);
  },

  get canRespec() {
    return this.respecAvailable || this.timeUntilRespec.totalDays <= 0;
  },

  updateLocalSTD(newData) {
    this.totalSTD = newData.totalSTD;
    this.spentSTD = newData.spentSTD;
    this.respecAvailable = newData.respecAvailable;
    this.lastRespec = newData.lastRespec ?? 0;
    this.unlockedCosmetics = [...(newData.unlockedCosmetics ?? [])];
    for (const key of Object.keys(GameDatabase.shopPurchases)) this[key] = newData[key] ?? 0;
    if (this.allCosmeticSets > 0) this.unlockedCosmetics = Object.keys(GameDatabase.reality.glyphCosmeticSets);
    if (ShopPurchaseData.isIAPEnabled) Speedrun.setSTDUse(true);
    GameStorage.save();
  },

  clearLocalSTD() {
    this.totalSTD = 0;
    this.spentSTD = 0;
    this.respecAvailable = false;
    this.unlockedCosmetics = [];
    for (const key of Object.keys(GameDatabase.shopPurchases)) this[key] = 0;
  },

  // Reads STD props from the cloud and sets local cached values with the result
  async syncSTD(showNotification = true, fetchedData = undefined) {
    if (!Cloud.loggedIn) return;
    let newSTDData;
    if (fetchedData) {
      newSTDData = fetchedData;
    } else {
      try {
        const statusRes = await fetch(`${STD_BACKEND_URL}/STDData?user=${Cloud.user.id}`);
        newSTDData = await statusRes.json();
      } catch (e) {
        GameUI.notify.error("Could not sync STD purchases!", 10000);
        return;
      }
    }
    if (showNotification && newSTDData.totalSTD > 0) GameUI.notify.info("STD purchases successfully loaded!", 10000);
    this.updateLocalSTD(newSTDData);
  },

  respecRequest() {
    if (player.options.confirmations.respecIAP) {
      Modal.respecIAP.show();
    } else {
      this.respecAll();
    }
  },

  async respecAll() {
    if (!this.canRespec) {
      // This case only happens if the player is cheating and using the console to make the game think it has a respec
      // when on the backend they don't. Nevertheless, responsive UI rarely hurts
      GameUI.notify.error("You do not have a respec available", 10000);
      return;
    }
    let res;
    try {
      res = await fetch(`${STD_BACKEND_URL}/respec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: Cloud.user.id })
      });
    } catch (e) {
      GameUI.notify.error("Unable to respec STD purchases!", 10000);
      return;
    }
    const stdData = await res.json();
    if (stdData.success) GameUI.notify.info("STD respec successful!", 10000);
    else GameUI.notify.error("No purchases to respec!", 10000);
    this.updateLocalSTD(stdData.data);
  },
};

// We track the local state of shop purchases here, so dynamically add all the keys which exist in the gameDB
for (const key of Object.keys(GameDatabase.shopPurchases)) ShopPurchaseData[key] = 0;

class ShopPurchaseState extends RebuyableMechanicState {
  get currency() {
    return ShopPurchaseData.availableSTD;
  }

  get isAffordable() {
    return this.currency >= this.cost;
  }

  get description() {
    const desc = this.config.description;
    return typeof desc === "function" ? desc() : desc;
  }

  get cost() {
    const cost = this.config.cost;
    return typeof cost === "function" ? cost() : cost;
  }

  // ShopPurchaseData for any particular key is undefined in between page load and STD load,
  // so we need to guard against that causing NaNs to propagate through the save
  get purchases() {
    return ShopPurchaseData[this.config.key] ?? 0;
  }

  set purchases(value) {
    if (!Number.isFinite(value)) return;
    ShopPurchaseData[this.config.key] = value;
  }

  isUnlocked() {
    return player.records.fullGameCompletions > 0 || (this.config.isUnlocked?.() ?? true);
  }

  get lockText() {
    return this.config.lockText;
  }

  get shouldDisplayMult() {
    return Boolean(this.config.multiplier);
  }

  get currentMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(ShopPurchaseData.isIAPEnabled ? this.purchases : 0);
  }

  get nextMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(ShopPurchaseData.isIAPEnabled ? this.purchases + 1 : 0);
  }

  // We want to still display the correct value in the button, so we need separate getters for it
  get currentMultForDisplay() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(this.purchases);
  }

  get nextMultForDisplay() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(this.purchases + 1);
  }

  formatEffect(effect) {
    return this.config.formatEffect?.(effect) || formatX(effect, 2, 0);
  }

  async purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    if (this.config.instantPurchase && ui.$viewModel.modal.progressBar) return false;

    const cosmeticId = this.config.key === "singleCosmeticSet"
      ? GlyphAppearanceHandler.chosenFromModal?.id
      : undefined;

    // Contact the purchase provider to verify the purchase
    const success = SteamRuntime.isActive
      ? await SteamRuntime.purchaseShopItem(this.config.key, this.cost, cosmeticId)
      : await Payments.buyUpgrade(this.config.key, cosmeticId);
    if (!success) return false;

    if (player.IAP.enabled) Speedrun.setSTDUse(true);
    if (this.config.instantPurchase) this.config.onPurchase();
    GameUI.update();
    return true;
  }
}

export const ShopPurchase = mapGameDataToObject(
  GameDatabase.shopPurchases,
  config => new ShopPurchaseState(config)
);

shop.purchaseTimeSkip = function() {
  Speedrun.setSTDUse(true);
  simulateTime(3600 * 6);
};

shop.purchaseLongerTimeSkip = function() {
  Speedrun.setSTDUse(true);
  simulateTime(3600 * 24);
};

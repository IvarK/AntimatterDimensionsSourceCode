import { RebuyableMechanicState } from "./game-mechanics/index";

import Payments from "./payments";

export const shop = {};

shop.kongEnabled = false;

shop.init = function() {
  if (document.referrer.indexOf("kongregate") === -1)
    return;
  shop.kongEnabled = true;
  try {
    kongregateAPI.loadAPI(() => {
      window.kongregate = kongregateAPI.getAPI();
    });
    // eslint-disable-next-line no-console
  } catch (err) { console.log("Couldn't load Kongregate API"); }
};

export const ShopPurchaseData = {
  totalSTD: 0,
  spentSTD: 0,
  respecAvailable: false,

  get availableSTD() {
    return this.totalSTD - this.spentSTD;
  },

  get isIAPEnabled() {
    return Cloud.loggedIn && this.availableSTD >= 0 && player.IAP.enabled;
  },

  updateLocalSTD(newData) {
    this.totalSTD = newData.totalSTD;
    this.spentSTD = newData.spentSTD;
    this.respecAvailable = newData.respecAvailable;
    for (const key of Object.keys(GameDatabase.shopPurchases)) this[key] = newData[key] ?? 0;
    GameStorage.save();
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
    if (showNotification) GameUI.notify.info("STD purchases successfully loaded!", 10000);
    this.updateLocalSTD(newSTDData);
  },

  respecRequest() {
    if (!Cloud.loggedIn) {
      Modal.message.show(`You are not logged in to Google, anything on this tab cannot be used unless you log in.`);
    } else if (player.options.confirmations.respecIAP) {
      Modal.respecIAP.show();
    } else {
      this.respecAll();
    }
  },

  async respecAll() {
    if (!this.respecAvailable) {
      Modal.message.show(`You do not have a respec available. Making an STD purchase allows you to respec your upgrades
        once. You can only have at most one of these respecs, and they do not refund offline production purchases.`);
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
    return this.config.description;
  }

  get cost() {
    return this.config.cost;
  }

  get purchases() {
    return ShopPurchaseData[this.config.key];
  }

  set purchases(value) {
    ShopPurchaseData[this.config.key] = value;
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
    if (this.config.singleUse && ui.$viewModel.modal.progressBar) return false;

    // Contact the firebase server to verify the purchase
    const success = true//await Payments.buyUpgrade(this.config.key);
    if (!success) return false;

    if (player.IAP.enabled) Speedrun.setSTDUse(true);
    if (this.config.singleUse) this.config.onPurchase();
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

shop.migratePurchases = function() {
  if (!shop.kongEnabled) return;
  try {
    kongregate.mtx.requestUserItemList("", items);
    // eslint-disable-next-line no-console
  } catch (e) { console.log(e); }

  function items(result) {
    let ipPurchases = 0;
    let dimPurchases = 0;
    let epPurchases = 0;
    let alldimPurchases = 0;
    for (const item of result.data) {
      if (item.identifier === "doublemult") {
        player.IAP.totalSTD += 30;
        player.IAP.spentSTD += 30;
        dimPurchases++;
      }
      if (item.identifier === "doubleip") {
        player.IAP.totalSTD += 40;
        player.IAP.spentSTD += 40;
        ipPurchases++;
      }
      if (item.identifier === "tripleep") {
        player.IAP.totalSTD += 50;
        player.IAP.spentSTD += 50;
        epPurchases++;
      }
      if (item.identifier === "alldimboost") {
        player.IAP.totalSTD += 60;
        player.IAP.spentSTD += 60;
        alldimPurchases++;
      }

    }
    player.IAP.dimPurchases = dimPurchases;
    player.IAP.allDimPurchases = alldimPurchases;
    player.IAP.IPPurchases = ipPurchases;
    player.IAP.EPPurchases = epPurchases;
  }
};

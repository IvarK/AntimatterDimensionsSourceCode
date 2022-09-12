import { RebuyableMechanicState } from "./game-mechanics/index";

export const kong = {};

kong.enabled = false;

kong.init = function() {
  if (document.referrer.indexOf("kongregate") === -1)
    return;
  kong.enabled = true;
  try {
    kongregateAPI.loadAPI(() => {
      window.kongregate = kongregateAPI.getAPI();
      kong.updatePurchases();
    });
    // eslint-disable-next-line no-console
  } catch (err) { console.log("Couldn't load Kongregate API"); }
};

class ShopPurchaseState extends RebuyableMechanicState {

  get currency() {
    return player.IAP.totalSTD - player.IAP.spentSTD;
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
    return player.IAP[this.config.key];
  }

  set purchases(value) {
    player.IAP[this.config.key] = value;
  }

  get shouldDisplayMult() {
    return Boolean(this.config.multiplier);
  }

  get currentMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(player.IAP.disabled ? 0 : this.purchases);
  }

  get nextMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(player.IAP.disabled ? 0 : this.purchases + 1);
  }

  formatEffect(effect) {
    return this.config.formatEffect?.(effect) || formatX(effect, 2, 0);
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsClosed) return false;
    if (this.config.singleUse && ui.$viewModel.modal.progressBar) return false;
    player.IAP.spentSTD += this.cost;
    if (this.config.singleUse) {
      this.config.onPurchase();
    } else {
      this.purchases++;
    }
    GameUI.update();
    return true;
  }
}

export const ShopPurchase = mapGameDataToObject(
  GameDatabase.shopPurchases,
  config => new ShopPurchaseState(config)
);

ShopPurchase.respecAll = function() {
  for (const purchase of ShopPurchase.all) {
    if (purchase.config.singleUse) continue;
    player.IAP.spentSTD -= purchase.purchases * purchase.cost;
    purchase.purchases = 0;
  }
};

ShopPurchase.respecRequest = function() {
  if (player.options.confirmations.respecIAP) {
    Modal.respecIAP.show();
  } else {
    ShopPurchase.respecAll();
  }
};

kong.purchaseTimeSkip = function() {
  simulateTime(3600 * 6);
};

kong.purchaseLongerTimeSkip = function() {
  simulateTime(3600 * 24);
};

kong.updatePurchases = function() {
  if (!kong.enabled) return;
  try {
    kongregate.mtx.requestUserItemList("", items);
    // eslint-disable-next-line no-console
  } catch (e) { console.error(e); }

  function items(result) {
    let totalSTD = player.IAP.totalSTD;
    for (let i = 0; i < result.data.length; i++) {
      const item = result.data[i];
      switch (item.identifier) {
        case "doublemult":
          totalSTD += 30;
          break;

        case "doubleip":
          totalSTD += 40;
          break;

        case "tripleep":
          totalSTD += 50;
          break;

        case "alldimboost":
          totalSTD += 60;
          break;

        case "20worthofstd":
          totalSTD += 20;
          break;

        case "50worthofstd":
          totalSTD += 60;
          break;

        case "100worthofstd":
          totalSTD += 140;
          break;

        case "200worthofstd":
          totalSTD += 300;
          break;

        case "500worthofstd":
          totalSTD += 1000;
          break;

      }
    }
    if (player.IAP.totalSTD !== totalSTD) {
      // eslint-disable-next-line no-console
      console.warn(`STD amounts don't match! ${player.IAP.totalSTD} in save, ${totalSTD} in kong`);
    }
  }

};

kong.migratePurchases = function() {
  if (!kong.enabled) return;
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

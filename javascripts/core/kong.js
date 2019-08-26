"use strict";

const kong = {};

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
  } catch (err) { console.log("Couldn't load Kongregate API"); }
};

kong.submitStats = function(name, value) {
  if (!kong.enabled) return;
  try {
    kongregate.stats.submit(name, value);
  } catch (e) { console.log(e); }
};

kong.purchaseIP = function(cost) {
  if (player.IAP.totalSTD - player.IAP.spentSTD < cost) return;
  player.IAP.spentSTD += cost;
  if (player.IAP.IPMult === 1) player.IAP.IPMult = 2;
  else player.IAP.IPMult += 2;
};

kong.submitAchievements = function() {
  kong.submitStats("Achievements", Achievements.effectiveCount + player.secretAchievements.size);
};

kong.purchaseDimMult = function(cost) {
  if (player.IAP.totalSTD - player.IAP.spentSTD < cost) return;
  player.IAP.spentSTD += cost;
  player.IAP.dimMult *= 2;
};

kong.purchaseAllDimMult = function(cost) {
  if (player.IAP.totalSTD - player.IAP.spentSTD < cost) return;
  player.IAP.spentSTD += cost;
  player.IAP.allDimMultPurchased++;
  if (player.IAP.allDimMult < 32) player.IAP.allDimMult *= 2;
  else player.IAP.allDimMult += 16;
};

kong.purchaseTimeSkip = function(cost) {
  if (player.IAP.totalSTD - player.IAP.spentSTD < cost) return;
  player.IAP.spentSTD += cost;
  simulateTime(21600);
};

kong.purchaseEP = function(cost) {
  if (player.IAP.totalSTD - player.IAP.spentSTD < cost) return;
  player.IAP.spentSTD += cost;
  if (player.IAP.EPMult === 1) player.IAP.EPMult = 3;
  else player.IAP.EPMult += 3;
};

kong.buyMoreSTD = function(STD, kreds) {
  kongregate.mtx.purchaseItems([`${kreds}worthofstd`], result => {
      if (result.success) {
        player.IAP.totalSTD += STD;
      }
  });
};

kong.updatePurchases = function() {
  if (!kong.enabled) return;
  try {
      kongregate.mtx.requestUserItemList("", items);
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
      console.warn(`STD amounts don't match! ${player.IAP.totalSTD} in save, ${totalSTD} in kong`);
    }
  }

};

kong.migratePurchases = function() {
  if (!kong.enabled) return;
  try {
      kongregate.mtx.requestUserItemList("", items);
  } catch (e) { console.log(e); }

  function items(result) {
      let ipmult = 0;
      let dimmult = 1;
      let epmult = 0;
      let alldimmult = 1;
      for (const item of result.data) {
          if (item.identifier === "doublemult") {
            player.IAP.totalSTD += 30;
            dimmult *= 2;
          }
          if (item.identifier === "doubleip") {
            player.IAP.totalSTD += 40;
            ipmult += 2;
          }
          if (item.identifier === "tripleep") {
            player.IAP.totalSTD += 50;
            epmult += 3;
          }
          if (item.identifier === "alldimboost") {
            player.IAP.totalSTD += 60;
            alldimmult = (alldimmult < 32) ? alldimmult * 2 : alldimmult + 32;
          }

      }
      player.IAP.dimMult = dimmult;
      player.IAP.allDimMult = alldimmult;

      if (ipmult > 0) player.IAP.IPMult = ipmult;

      if (epmult > 0) player.IAP.EPMult = epmult;
  }
};
"use strict";

var kong = {};

kong.enabled = false;

kong.init = function() {
    if (document.referrer.indexOf("kongregate") === -1)
        return;
    kong.enabled = true;
    try {
        kongregateAPI.loadAPI(function () {
            window.kongregate = kongregateAPI.getAPI();
            kong.updatePurchases();
        });
    } catch (err) { console.log("Couldn't load Kongregate API") }
};

kong.submitStats = function(name, value) {
    if (!kong.enabled) return;
    try {
        kongregate.stats.submit(name, value);
    } catch(e) { console.log(e) }
};

kong.purchaseIP = function(cost) {
  if (player.IAP.STD < cost) return
  player.IAP.STD -= cost
  if (player.IAP.IPMult == 1) player.IAP.IPMult = 2;
  else player.IAP.IPMult += 2;
  //kongregate.mtx.purchaseItems(['doubleip'], kong.onPurchaseResult);
};

kong.submitAchievements = function() {
  kong.submitStats("Achievements", Achievements.effectiveCount + player.secretAchievements.size);
};

kong.purchaseDimMult = function(cost) {
  if (player.IAP.STD < cost) return
  player.IAP.STD -= cost
  player.IAP.dimMult *= 2;
  //kongregate.mtx.purchaseItems(['doublemult'], kong.onPurchaseResult);
};

kong.purchaseAllDimMult = function(cost) {
  if (player.IAP.STD < cost) return
  player.IAP.STD -= cost
  if (player.IAP.allDimMult < 32) player.IAP.allDimMult *= 2;
  else player.IAP.allDimMult += 16;
  //kongregate.mtx.purchaseItems(['alldimboost'], kong.onPurchaseResult);
};

kong.purchaseTimeSkip = function(cost) {
  if (player.IAP.STD < cost) return
  player.IAP.STD -= cost
  simulateTime(21600);
  //kongregate.mtx.purchaseItems(['timeskip'], kong.onPurchaseTimeSkip);
};

kong.purchaseEP = function(cost) {
  if (player.IAP.STD < cost) return
  player.IAP.STD -= cost
  if (player.IAP.EPMult == 1) player.IAP.EPMult = 3;
  else player.IAP.EPMult += 3;
  //kongregate.mtx.purchaseItems(['tripleep'], kong.onPurchaseResult);
};

kong.buyMoreSTD = function(STD, kreds) {
  kongregate.mtx.purchaseItems([`${kreds}worthofstd`], function(result) {
    if (result.success) {
      player.IAP.STD += STD
    }
  });
}

kong.onPurchaseResult = function(result) {
    console.log("purchasing...");
    if (result.success) {
        console.log("purchase successfull!");
        kong.updatePurchases();
    }
};

kong.onPurchaseTimeSkip = function(result) {
    if (result.success) {
        simulateTime(21600);
    }
};

kong.updatePurchases = function() {
  if (!kong.enabled) return;
  console.log("updating kong purchases");
  try {
      kongregate.mtx.requestUserItemList("", items)
  } catch(e) { console.log(e) }

  function items(result) {
      console.log("checking for all items")
      let ipmult = 0
      let dimmult = 1
      let epmult = 0
      let alldimmult = 1
      for(var i = 0; i < result.data.length; i++) {
          var item = result.data[i];
          console.log((i+1) + ". " + item.identifier + ", " +
          item.id + "," + item.data);
          if (item.identifier == "doublemult") dimmult *= 2
          if (item.identifier == "doubleip") ipmult += 2
          if (item.identifier == "tripleep") epmult +=3
          if (item.identifier == "alldimboost") alldimmult = (alldimmult < 32) ? alldimmult * 2 : alldimmult + 32

      }
      kongDimMult = dimmult
      kongAllDimMult = alldimmult
      if (ipmult !== 0) kongIPMult = ipmult
      else kongIPMult = 1
      if (epmult !== 0) kongEPMult = epmult
      else kongEPMult = 1
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
      for (let i = 0; i < result.data.length; i++) {
          const item = result.data[i];
          if (item.identifier === "doublemult") dimmult *= 2;
          if (item.identifier === "doubleip") ipmult += 2;
          if (item.identifier === "tripleep") epmult += 3;
          if (item.identifier === "alldimboost") alldimmult = (alldimmult < 32) ? alldimmult * 2 : alldimmult + 32;

      }
      player.IAP.dimMult = dimmult;
      player.IAP.allDimMult = alldimmult;

      if (ipmult > 0) player.IAP.IPMult = ipmult;

      if (epmult > 0) player.IAP.EPMult = epmult;
  }
}
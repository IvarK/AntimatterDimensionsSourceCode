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

kong.purchaseIP = function() {
    console.log("purchase ip");
    kongregate.mtx.purchaseItems(['doubleip'], kong.onPurchaseResult);
};

kong.purchaseDimMult = function() {
    kongregate.mtx.purchaseItems(['doublemult'], kong.onPurchaseResult);
};

kong.purchaseAllDimMult = function() {
    kongregate.mtx.purchaseItems(['alldimboost'], kong.onPurchaseResult);
};

kong.purchaseTimeSkip = function() {
    kongregate.mtx.purchaseItems(['timeskip'], kong.onPurchaseTimeSkip);
};

kong.purchaseEP = function() {
    kongregate.mtx.purchaseItems(['tripleep'], kong.onPurchaseResult);
};

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

  document.getElementById("kongip").textContent = "Double your IP gain from all sources (additive). Forever. Currently: x"+kongIPMult+", next: x"+(kongIPMult==1? 2: kongIPMult+2)
  document.getElementById("kongep").textContent = "Triple your EP gain from all sources (additive). Forever. Currently: x"+kongEPMult+", next: x"+(kongEPMult==1? 3: kongEPMult+3)
  document.getElementById("kongdim").textContent = "Double all your normal dimension multipliers (multiplicative). Forever. Currently: x"+kongDimMult+", next: x"+(kongDimMult*2)
  document.getElementById("kongalldim").textContent = "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. Currently: x"+kongAllDimMult+", next: x"+((kongAllDimMult < 32) ? kongAllDimMult * 2 : kongAllDimMult + 32)
};
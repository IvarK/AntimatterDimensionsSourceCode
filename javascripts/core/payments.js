const Payments = {
  interval: null,
  windowReference: null,
  init: () => {
    // We have unfinished checkouts
    if (player.IAP.checkoutSession.id) {
      Payments.pollForPurchases();
    }
  },
  buyMoreSTD: async STD => {
    player.IAP.checkoutSession = { id: true };
    const res = await fetch("https://antimatterdimensionspayments.ew.r.appspot.com/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: STD })
    });
    const data = await res.json();
    Payments.windowReference = window.open(
      data.url,
      "antimatterDimensionsPurchase",
      "popup,width=500,height=500,left=100,top=100"
    );
    player.IAP.checkoutSession = { id: data.id, amount: STD };
    GameStorage.save();
    Payments.pollForPurchases();
  },
  pollForPurchases: () => {
    console.log("Polling for purchases...");
    const { id, amount } = player.IAP.checkoutSession;
    let pollAmount = 0;
    window.onbeforeunload = async() => {
      if (!Payments.interval) return;
      Payments.windowReference?.close();
      await Payments.cancelPurchase();
    };
    Payments.interval = setInterval(async() => {
      pollAmount++;
      const statusRes = await fetch(
        `https://antimatterdimensionspayments.ew.r.appspot.com/validate?sessionId=${id}`
      );
      const { completed, failure } = await statusRes.json();

      if (completed) {
        Payments.windowReference?.close();
        Cloud.addSTD(amount);
        Cloud.syncSTD();
        GameUI.notify.success(`Purchase of ${amount} STDs was successful, thank you for your support! ❤️`, 10000);
        Payments.clearInterval();
        player.IAP.checkoutSession = { id: false };
        GameStorage.save();
        Modal.hide();
      }


      if (failure) {
        Payments.windowReference?.close();
        Payments.clearInterval();
        GameUI.notify.error(`Purchase failed!`, 10000);
        player.IAP.checkoutSession = { id: false };
        GameStorage.save();
        return;
      }

      // 30 minutes of polling is the maximum
      if (!completed && (Payments.windowReference?.closed || pollAmount >= 20 * 30)) {
        await Payments.cancelPurchase();
      }
    }, 3000);
  },
  async cancelPurchase() {
    Payments.windowReference?.close();
    Payments.clearInterval();
    await fetch("https://antimatterdimensionspayments.ew.r.appspot.com/expire", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sessionId: player.IAP.checkoutSession.id })
    });
    GameUI.notify.error(`Purchase failed!`, 10000);
    player.IAP.checkoutSession = { id: false };
    GameStorage.save();
  },
  clearInterval() {
    clearInterval(Payments.interval);
    window.onbeforeunload = null;
  }
};

export default Payments;
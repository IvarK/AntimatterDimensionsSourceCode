const Payments = {
  init: () => {
    // We have unfinished checkouts
    if (player.IAP.checkoutSession.id) {
      Payments.pollForPurchases();
    }
  },
  buyMoreSTD: async STD => {
    const res = await fetch("https://antimatterdimensionspayments.ew.r.appspot.com/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: STD })
    });
    const data = await res.json();
    const windowReference = window.open(
      data.url,
      "antimatterDimensionsPurchase",
      "popup,width=500,height=500,left=100,top=100"
    );
    player.IAP.checkoutSession = { id: data.id, amount: STD };
    GameStorage.save();
    Payments.pollForPurchases(windowReference);
  },
  pollForPurchases: (windowReference = undefined) => {
    console.log("Polling for purchases...");
    const { id, amount } = player.IAP.checkoutSession;
    let pollAmount = 0;
    const polling = setInterval(async() => {
      pollAmount++;
      const statusRes = await fetch(
        `https://antimatterdimensionspayments.ew.r.appspot.com/validate?sessionId=${id}`
      );
      const { completed, failure } = await statusRes.json();

      if (completed) {
        windowReference?.close();
        player.IAP.totalSTD += amount;
        GameUI.notify.success(`Purchase of ${amount} STDs was successful, thank you for your support! ❤️`, 10000);
        clearInterval(polling);
        player.IAP.checkoutSession = { id: false };
        GameStorage.save();
        Modal.hide();
      }


      if (failure) {
        windowReference?.close();
        clearInterval(polling);
        GameUI.notify.error(`Purchase failed!`, 10000);
        player.IAP.checkoutSession = { id: false };
        GameStorage.save();
      }

      // 30 minutes of polling is the maximum
      if (!completed && (windowReference?.closed || pollAmount >= 20 * 30)) {
        clearInterval(polling);
        await fetch("https://antimatterdimensionspayments.ew.r.appspot.com/expire", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ sessionId: id })
        });
        GameUI.notify.error(`Purchase failed!`, 10000);
        player.IAP.checkoutSession = { id: false };
        GameStorage.save();
      }
    }, 3000);
  }
};

export default Payments;
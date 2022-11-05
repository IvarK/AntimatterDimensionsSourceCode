const backendURL = "http://localhost:3000";
// Const backendURL = "https://antimatterdimensionspayments.ew.r.appspot.com";

const Payments = {
  interval: null,
  windowReference: null,
  // This is here to prevent notification spam; purchase canceling can be called multiple times before the first
  // call's Promise is settled
  hasCanceled: false,
  init: () => {
    // We have unfinished checkouts from when the page was last closed
    if (player.IAP.checkoutSession.id) {
      Payments.pollForPurchases();
    }
  },

  // Only called from clicking the "Buy More" button in the Shop tab
  buyMoreSTD: async STD => {
    player.IAP.checkoutSession = { id: true };
    const res = await fetch(`${backendURL}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: STD, cloudID: Cloud.user.id })
    }).catch(() => undefined);
    // We don't give a game notification on exception because the modal will eventually cancel the purchase as well
    if (!res) return;
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

  // Starts a purchase-checking loop and adds a listener which cancels any ongoing purchases if the page is closed.
  // Any unresolved purchases will be reopened when the page is opened again in init()
  pollForPurchases: () => {
    const { id, amount } = player.IAP.checkoutSession;
    let pollAmount = 0;
    window.onbeforeunload = async() => {
      if (!Payments.interval) return;
      Payments.windowReference?.close();
      await Payments.cancelPurchase();
    };

    // This setInterval checks every 3 seconds for a response from the payment backend
    Payments.interval = setInterval(async() => {
      pollAmount++;
      const statusRes = await fetch(
        `${backendURL}/validate?sessionId=${id}`
      ).catch(() => {
        GameUI.notify.error("Could not contact payment server!", 10000);
        Payments.clearInterval();
      });
      const { completed, failure } = await statusRes.json();

      if (completed) {
        Payments.windowReference?.close();
        Payments.syncSTD();
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

  // Reads STD props from the cloud and sets local cached values with the result
  async syncSTD(showNotification = true) {
    if (!Cloud.loggedIn) return;
    const statusRes = await fetch(
      `${backendURL}/syncSTD?user=${Cloud.user.id}`
    ).catch(() => {
      GameUI.notify.error("Could not sync STD purchases!", 10000);
    });
    const newSTDData = await statusRes.json();
    if (!newSTDData) return;
    if (showNotification) GameUI.notify.info("STD purchases successfully loaded!", 10000);

    // Update the local cache
    ShopPurchaseData.totalSTD = newSTDData.totalSTD;
    ShopPurchaseData.spentSTD = newSTDData.spentSTD;
    for (const key of Object.keys(GameDatabase.shopPurchases)) ShopPurchaseData[key] = newSTDData[key] ?? 0;
    GameStorage.save();
  },

  // Sends a request to purchase a STD upgrade, returning true if successful (and syncs data), false if not
  async buyUpgrade(upgradeKey) {
    if (!Cloud.loggedIn) return false;
    const statusRes = await fetch(
      `${backendURL}/purchaseUpgrade?user=${Cloud.user.id}&key=${upgradeKey}`
    ).catch(() => {
      GameUI.notify.error("Unable to spend STD coins on upgrade!", 10000);
    });
    if (!statusRes) return false;
    this.syncSTD(false);
    return true;
  },

  // Explicitly cancels purchases if the player chooses to, they take too long to resolve, or the page is closed
  async cancelPurchase() {
    if (this.hasCanceled) return;
    Payments.windowReference?.close();
    Payments.clearInterval();
    const res = await fetch(`${backendURL}/expire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sessionId: player.IAP.checkoutSession.id })
    }).catch(() => undefined);
    if (res) GameUI.notify.error(`Purchase failed!`, 10000);
    else GameUI.notify.error("Could not contact payment server!", 10000);
    player.IAP.checkoutSession = { id: false };
    GameStorage.save();
    this.hasCanceled = false;
  },

  // Removes the repeating checker and page-close listener for if payments have been resolved
  clearInterval() {
    clearInterval(Payments.interval);
    window.onbeforeunload = null;
  }
};

export default Payments;
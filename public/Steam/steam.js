"use strict";


const SteamFunctions = {
    purchaseChecker: [],
    purchasesInitiated: true,
    macUser: false,
    SteamInitialize() {
        this.forceRefresh();
        //this.BackfillAchievements();
        this.EventHandlers();
        if (window.navigator.platform === "MacIntel") {
          SteamFunctions.macUser = true;
        }
    },
    // Canvas workaround to enable overlay
    forceRefresh() { 
        const canvas = document.getElementById("forceRefreshCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.requestAnimationFrame(SteamFunctions.forceRefresh);
    },
    UIZoom() {
        if (nodeOn && ui.view.newUI) {
            const setSize = 1020;
            const SizeDiff = window.outerHeight / setSize;
            require("electron").webFrame.setZoomFactor(SizeDiff);
        } else if (nodeOn && !ui.view.newUI) {
            const setSize = 825;
            const SizeDiff = window.outerHeight / setSize;
            require("electron").webFrame.setZoomFactor(SizeDiff);
        }
    },
    EventHandlers() {
        Steam.on("micro-txn-authorization-response", (data, ordered, orderstate) => {
            if (orderstate === true) {
                SteamFunctions.PurchaseValidation();
            }
        });
    },
    GiveAchievement(AchieveID) {
        if (Steam && steamOn) {
            if (Steam.activateAchievement) {
                Steam.activateAchievement(`Achievement${AchieveID}`,
                    () => console.log(`Successfully Achieved Achievement${AchieveID}`),
                    err => console.log(`Achievement Error: ${err}`)
                );
            }
        }
    },
    BackfillAchievements() {
        if (Steam && steamOn) {
            if (Steam.activateAchievement) {
                for (const ach in Achievements.all) { 
                    if (Achievements.all[ach].isUnlocked) {
                        Steam.activateAchievement(`Achievement${Achievements.all[ach].id}`,
                            () => console.log(`Successfully Achieved Achievement${Achievements.all[ach].id}`),
                            err => console.log(`Achievement Error: ${err}`) 
                        );
                    }
                }
            }
        }
    },
    async autoLogin(){
        const AutoEmail = `${Steam.getSteamId().accountId}@ad.com`
        const AutoPass = Steam.getSteamId().staticAccountId
        try{
          await Cloud.manualCloudCreate(AutoEmail,AutoPass);
        }catch(e){
          console.log(e);
          try{
            await Cloud.manualCloudLogin(AutoEmail,AutoPass)
          }catch(LoginError){
            this.error = true;
            this.errorMessage = "Unable to login, please recheck email/password";
            return;
          }
        }
        Cloud.user.displayName = Steam.getSteamId().screenName
    },
    PurchaseIAP(STD, kreds) {
        if (!steamOn) return;
        const TheItem = { ItemId: `${STD}STD`, Quantity: 1, Annotation: "Purchased via in-game store" };
        PlayFab.settings.titleId = "59813";
        const loginRequest = {
            Items: [TheItem]
        };
        PlayFab.ClientApi.StartPurchase(loginRequest, (result, error) => {
            console.log(result, error);
            if (result !== null) {
                const TheOrder = result.data.OrderId;
                const PurchaseRequest = {
                    OrderId: TheOrder,
                    Currency: "RM",
                    ProviderName: "Steam"
                };
                PlayFab.ClientApi.PayForPurchase(PurchaseRequest, (purchaseResult, purchaseError) => {
                    if (purchaseResult !== null) {
                        const txnID = purchaseResult.data.ProviderData;
                        SteamFunctions.purchaseChecker.push(purchaseResult.data.OrderId);
                        if (window.navigator.platform === "MacIntel") {
                            shell.openExternal("https://store.steampowered.com/checkout/approvetxn/" + txnID + "/?returnurl=steam");
                        }
                    } else if (purchaseError !== null) {
                        console.log(purchaseError);
                    }
                });
            } else if (error !== null) {
                console.log(error);
            }
        });
    },
    ConfirmSteamPurchase(OrderIdentifier) {
        console.log(OrderIdentifier);
        PlayFab.ClientApi.ConfirmPurchase({ OrderId: OrderIdentifier }, (result, error) => {
            if (result !== null && result.data.Items != null) {
                console.log(result);
                const PurchaseName = result.data.Items[0].ItemId;
                const PurchaseInstance = result.data.Items[0].ItemInstanceId;
                PlayFab.ClientApi.ConsumeItem({ ItemInstanceId: PurchaseInstance, ConsumeCount: 1 }, 
                    (consumeResult, consumeError) => {
                        if (consumeResult !== null) {
                            console.log(consumeResult);
                            const stdsBought = Number(PurchaseName.replace("STD", ""));
                            player.IAP.totalSTD += stdsBought;
                            GameUI.notify.info(`${stdsBought} STDs Obtained!`);
                            SteamFunctions.purchaseChecker = SteamFunctions.purchaseChecker.filter(item => item !== OrderIdentifier);
                        } else if (consumeError !== null) {
                            console.log(consumeError);
                        }
                    });
            } else if (error !== null) {
                console.log(error);
            }
        });
    },
    PurchaseValidation() {
        if (SteamFunctions.purchaseChecker.length > 0) {
            SteamFunctions.purchaseChecker.forEach(
                anOrder => SteamFunctions.ConfirmSteamPurchase(anOrder)
            );
        }
    }

    
};
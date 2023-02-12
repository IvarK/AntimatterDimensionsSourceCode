"use strict";


const SteamFunctions = {
    purchaseChecker: [],
    purchasesInitiated: true,
    macUser: false,
    macInterval: 0,
    discordInterval: 0,
    richPresenceInterval: 0,
    discordOn: false,
    macIntervalOn: false,
    zoomLevel: 1,
    SteamInitialize() {
        this.forceRefresh();
        this.EventHandlers();
        if (window.navigator.platform === "MacIntel") {
          SteamFunctions.macUser = true;
        }else{
            Steam.initDiscordAPI("1057439416819396689",1399720)
            SteamFunctions.discordOn = true
            SteamFunctions.richPresenceInterval = setInterval(SteamFunctions.SetRichPresence,8000)
            SteamFunctions.discordInterval = setInterval(Steam.runDiscordCallbacks, 4000);
        }
        this.GetZoom()
    },
    forceRefresh() { // Canvas workaround to enable overlay
        const canvas = document.getElementById("forceRefreshCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.requestAnimationFrame(SteamFunctions.forceRefresh);
    },
    SetRichPresence(){
        if(SteamFunctions.discordOn && RichPresenceInfo){
            Steam.setDiscordActivity({
                smallImage: "icon",
                largeImage: "icon",
                state: RichPresenceInfo.state,
                details: RichPresenceInfo.details
            })
        }
    },
    UIZoom() {
        if (nodeOn) {
            const setSize = 1020;
            const SizeDiff = window.outerHeight / setSize;
            require("electron").webFrame.setZoomFactor(SizeDiff*SteamFunctions.zoomLevel);
        }
    },
    SetZoomLevel(ZoomType){
        const zoomMAXed = SteamFunctions.zoomLevel >= 1.5 && ZoomType==="Increase"
        const zoomMINed = SteamFunctions.zoomLevel <= 0.5 && ZoomType==="Decrease"
        const zoomPossible = !(zoomMAXed || zoomMINed)
        if(zoomPossible){
            ZoomType==="Increase" && !zoomMAXed ? SteamFunctions.zoomLevel += .1 : SteamFunctions.zoomLevel = SteamFunctions.zoomLevel
            ZoomType==="Decrease" && !zoomMINed ? SteamFunctions.zoomLevel -= .1 : SteamFunctions.zoomLevel = SteamFunctions.zoomLevel
            SteamFunctions.zoomLevel = Math.round(SteamFunctions.zoomLevel * 10) / 10
            localStorage.setItem("Zoom",SteamFunctions.zoomLevel)
            SteamFunctions.UIZoom()
            GameUI.notify.info(`Size changed to ${Math.round(SteamFunctions.zoomLevel*100)}%`)
        }else{
            zoomMAXed ? GameUI.notify.info(`Zoom Level is at Maximum`) : GameUI.notify.info(`Zoom Level is at Minimum`)
        }
    },
    GetZoom(){
        let zoomGet;
        if(localStorage.getItem("Zoom")){
            zoomGet = Number(localStorage.getItem("Zoom"))
        }else{
            localStorage.setItem("Zoom",1)
            zoomGet = 1
        } 
        SteamFunctions.zoomLevel = zoomGet
    },
    ResetZoom(){
        localStorage.setItem("Zoom",1)
        SteamFunctions.zoomLevel = 1
        SteamFunctions.UIZoom()
        GameUI.notify.info(`Size reverted to 100%`)
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
                const achAchieved = []
                const achErrored = []
                for (const ach in Achievements.all) { 
                    if (Achievements.all[ach].isUnlocked) {
                        Steam.activateAchievement(`Achievement${Achievements.all[ach].id}`,
                            () => achAchieved.push(Achievements.all[ach].id),
                            err => achErrored.push(Achievements.all[ach].id) 
                        );
                    }
                }
            }
        }
    },
    async autoLogin(){
        if(!Cloud.loggedIn){
            const AutoEmail = `${Steam.getSteamId().accountId}@ad.com`
            const AutoPass = Steam.getSteamId().staticAccountId
            try{
                await Cloud.manualCloudCreate(AutoEmail,AutoPass);
            }catch(e){
                try{
                    await Cloud.manualCloudLogin(AutoEmail,AutoPass)
                }catch(LoginError){
                    this.error = true;
                    this.errorMessage = "Unable to login, please recheck email/password";
                    console.log(`Login Error, Retrying (${LoginError})`)
                    return;
                }
            }
            Cloud.user.displayName = Steam.getSteamId().screenName
        }
        SteamFunctions.SyncPlayFabSTD()
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
                            SteamFunctions.macInterval = setInterval(async()=>{
                                SteamFunctions.PurchaseValidation()
                            },2000)
                            SteamFunctions.macIntervalOn = true
                            setTimeout(()=>{clearInterval(SteamFunctions.macInterval);SteamFunctions.macIntervalOn = false},300000)
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
        PlayFab.ClientApi.ConfirmPurchase({ OrderId: OrderIdentifier }, (result, error) => {
            if (result !== null && result.data.Items != null) {
                const PurchaseName = result.data.Items[0].ItemId;
                const PurchaseInstance = result.data.Items[0].ItemInstanceId;
                PlayFab.ClientApi.ConsumeItem({ ItemInstanceId: PurchaseInstance, ConsumeCount: 1 }, 
                    (consumeResult, consumeError) => {
                        if (consumeResult !== null) {
                            const stdsBought = Number(PurchaseName.replace("STD", ""));
                            const currencyAddRequest = {Amount: stdsBought,VirtualCurrency: "ST"}
                            PlayFab.ClientApi.AddUserVirtualCurrency(currencyAddRequest, (result, error) => {
                                if (result !== null) {
                                    SteamFunctions.SyncPlayFabSTD()
                                } else if (error !== null) {
                                    console.log(error);
                                }
                            })
                            SteamFunctions.purchaseChecker = SteamFunctions.purchaseChecker.filter(item => item !== OrderIdentifier);
                            GameUI.notify.info(`${stdsBought} STDs Obtained!`);
                        } else if (consumeError !== null) {
                            console.log(consumeError);
                        }
                    });
            } else if (error !== null) {
                console.log("Awaiting Payment Confirmation");
            }
        });
    },
    PurchaseValidation() {
        if (SteamFunctions.purchaseChecker.length > 0) {
            SteamFunctions.purchaseChecker.forEach(
                anOrder => SteamFunctions.ConfirmSteamPurchase(anOrder)
            );
        }
    },
    SyncPlayFabSTD(){
        if(PlayFab.ClientApi.IsClientLoggedIn()){
            PlayFab.ClientApi.GetUserInventory({PlayFabId: PlayFab.PlayFabId}, (result, error) => {
                if (result !== null) {
                    const CurrentSTD = result.data.VirtualCurrency.ST
                    const Inventory = result.data.Inventory
                    ShopPurchaseData.totalSTD = CurrentSTD
                    const inventoryData = {}
                    Inventory.forEach(
                        ShopItem => inventoryData[ShopItem.ItemId] = ShopItem.RemainingUses
                    );
                    for (const key of Object.keys(GameDatabase.shopPurchases)) ShopPurchaseData[key] = inventoryData[key] ?? 0;
                    GameUI.update();
                    SteamFunctions.GetCosmetics()
                } else if (error !== null) {
                    console.log(error);
                }
            })
        }
    },
    PurchaseShopItem(itemCost,itemKey,itemConfig,chosenSet){
        const itemPurchaseRequest = {
            ItemId: itemKey,
            Price: typeof itemCost === "function" ? itemCost() : itemCost,
            VirtualCurrency: "ST"
        }
        PlayFab.ClientApi.PurchaseItem(itemPurchaseRequest, (result, error) => {
            if (result !== null) {
                if (itemConfig.instantPurchase) itemConfig.onPurchase();
                if (itemKey === "singleCosmeticSet") this.StoreCosmetics(chosenSet)
                SteamFunctions.SyncPlayFabSTD();
            } else if (error !== null) {
                console.log(error);
                GameUI.notify.error(error.errorMessage)
            }
        })
    },
    StoreCosmetics(Cosmetic){
        const CosmeticID = Object.entries(GameDatabase.reality.glyphCosmeticSets).filter(item => item[1]["name"]===Cosmetic)[0][0]
        var CosmeticList = [CosmeticID]
        PlayFab.ClientApi.GetUserData({PlayFabId: PlayFab.PlayFabId}, (result, error) => {
            if (result !== null) {
                if(result.data.Data["Cosmetics"]){
                    CosmeticList = CosmeticList.concat(result.data.Data["Cosmetics"].Value.split(","))
                }
                const updatedCosmetics = [...new Set(CosmeticList)]
                const UpdateRequest = {
                    Data: {
                        Cosmetics: updatedCosmetics.join(",")
                    }
                }
                PlayFab.ClientApi.UpdateUserData(UpdateRequest, (result, error) => {
                    if (result !== null) {
                        console.log("Cosmetics Updated on Server");
                        ShopPurchaseData.unlockedCosmetics = updatedCosmetics
                        GameUI.update();
                    } else if (error !== null) {
                        console.log(error);
                    }
                })
            } else if (error !== null) {
                console.log("Error Getting User Data");
            }
        })
    },
    GetCosmetics(){
        PlayFab.ClientApi.GetUserData({PlayFabId: PlayFab.PlayFabId}, (result, error) => {
            if (result !== null) {
                const currentCosmetics = result.data.Data["Cosmetics"] ? result.data.Data["Cosmetics"].Value.split(",") : []
                ShopPurchaseData.unlockedCosmetics = currentCosmetics
                GameUI.update();
            } else if (error !== null) {
                console.log(error);
            }
        })
    }
};
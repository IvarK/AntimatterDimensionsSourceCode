/// <reference path="../typings/PlayFab/PlayFabAdminApi.d.ts" />

var PlayFab = typeof PlayFab != "undefined" ? PlayFab : {};

if(!PlayFab.settings) {
    PlayFab.settings = {
        titleId: null, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        developerSecretKey: null, // For security reasons you must never expose this value to the client or players - You must set this value for Server-APIs to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        advertisingIdType: null,
        advertisingIdValue: null,

        // disableAdvertising is provided for completeness, but changing it is not suggested
        // Disabling this may prevent your advertising-related PlayFab marketplace partners from working correctly
        disableAdvertising: false,
        AD_TYPE_IDFA: "Idfa",
        AD_TYPE_ANDROID_ID: "Adid"
    }
}

if(!PlayFab._internalSettings) {
    PlayFab._internalSettings = {
        sessionTicket: null,
        productionServerUrl: ".playfabapi.com",
        errorTitleId: "Must be have PlayFab.settings.titleId set to call this method",
        errorLoggedIn: "Must be logged in to call this method",
        errorSecretKey: "Must have PlayFab.settings.developerSecretKey set to call this method",

        GetServerUrl: function () {
            return "https://" + PlayFab.settings.titleId + PlayFab._internalSettings.productionServerUrl;
        },

        ExecuteRequest: function (completeUrl, data, authkey, authValue, callback) {
            if (callback != null && typeof (callback) != "function")
                throw "Callback must be null of a function";

            if (data == null)
                data = {};

            var startTime = new Date();
            var requestBody = JSON.stringify(data);

            var xhr = new XMLHttpRequest();
            // window.console.log("URL: " + completeUrl);
            xhr.open("POST", completeUrl, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            if (authkey != null)
                xhr.setRequestHeader(authkey, authValue);

            xhr.setRequestHeader('X-PlayFabSDK', "JavaScriptSDK-" + PlayFab._internalSettings.sdkVersion);

            xhr.onloadend = function () {
                if (callback == null)
                    return;

                var result;
                try {
                    // window.console.log("parsing json result: " + xhr.responseText);
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = {
                        code: 503, // Service Unavailable
                        status: "Service Unavailable",
                        error: "Connection error",
                        errorCode: 2, // PlayFabErrorCode.ConnectionError
                        errorMessage: xhr.responseText
                    };
                }

                result.CallBackTimeMS = new Date() - startTime;

                if (result.code === 200)
                    callback(result, null);
                else
                    callback(null, result);
            }

            xhr.onerror = function () {
                if (callback == null)
                    return;

                var result;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = {
                        code: 503, // Service Unavailable
                        status: "Service Unavailable",
                        error: "Connection error",
                        errorCode: 2, // PlayFabErrorCode.ConnectionError
                        errorMessage: xhr.responseText
                    };
                }

                result.CallBackTimeMS = new Date() - startTime;
                callback(null, result);
            }

            xhr.send(requestBody);
        }
    }
}

PlayFab.buildIdentifier = "jbuild_javascriptsdk_1";
PlayFab.sdkVersion = "1.11.170828";

PlayFab.AdminApi = {

    CreatePlayerSharedSecret: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/CreatePlayerSharedSecret", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    DeletePlayerSharedSecret: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeletePlayerSharedSecret", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayerSharedSecrets: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayerSharedSecrets", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPolicy: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPolicy", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetPlayerSecret: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetPlayerSecret", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdatePlayerSharedSecret: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdatePlayerSharedSecret", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdatePolicy: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdatePolicy", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    BanUsers: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/BanUsers", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    DeletePlayer: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeletePlayer", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserAccountInfo: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserAccountInfo", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserBans: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserBans", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    /**
     * @deprecated Please use DeletePlayer instead. 
     */
    ResetUsers: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ResetUsers", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RevokeAllBansForUser: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RevokeAllBansForUser", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RevokeBans: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RevokeBans", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SendAccountRecoveryEmail: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SendAccountRecoveryEmail", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateBans: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateBans", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserTitleDisplayName: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserTitleDisplayName", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    CreatePlayerStatisticDefinition: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/CreatePlayerStatisticDefinition", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    /**
     * @deprecated Please use DeleteUser instead. 
     */
    DeleteUsers: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeleteUsers", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetDataReport: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetDataReport", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayerStatisticDefinitions: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayerStatisticDefinitions", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayerStatisticVersions: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayerStatisticVersions", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserPublisherData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserPublisherData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserPublisherInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserPublisherInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserPublisherReadOnlyData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserPublisherReadOnlyData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserReadOnlyData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserReadOnlyData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    IncrementPlayerStatisticVersion: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/IncrementPlayerStatisticVersion", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RefundPurchase: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RefundPurchase", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ResetUserStatistics: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ResetUserStatistics", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ResolvePurchaseDispute: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ResolvePurchaseDispute", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdatePlayerStatisticDefinition: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdatePlayerStatisticDefinition", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserPublisherData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserPublisherData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserPublisherInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserPublisherInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserPublisherReadOnlyData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserPublisherReadOnlyData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateUserReadOnlyData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateUserReadOnlyData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AddNews: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AddNews", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AddVirtualCurrencyTypes: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AddVirtualCurrencyTypes", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    DeleteStore: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeleteStore", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetCatalogItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetCatalogItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPublisherData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPublisherData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetRandomResultTables: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetRandomResultTables", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetStoreItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetStoreItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetTitleData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetTitleData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetTitleInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetTitleInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ListVirtualCurrencyTypes: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ListVirtualCurrencyTypes", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RemoveVirtualCurrencyTypes: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RemoveVirtualCurrencyTypes", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetCatalogItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetCatalogItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetStoreItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetStoreItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetTitleData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetTitleData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetTitleInternalData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetTitleInternalData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetupPushNotification: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetupPushNotification", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateCatalogItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateCatalogItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateRandomResultTables: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateRandomResultTables", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateStoreItems: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateStoreItems", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AddUserVirtualCurrency: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AddUserVirtualCurrency", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetUserInventory: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetUserInventory", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GrantItemsToUsers: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GrantItemsToUsers", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RevokeInventoryItem: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RevokeInventoryItem", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SubtractUserVirtualCurrency: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SubtractUserVirtualCurrency", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetMatchmakerGameInfo: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetMatchmakerGameInfo", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetMatchmakerGameModes: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetMatchmakerGameModes", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ModifyMatchmakerGameModes: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ModifyMatchmakerGameModes", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AddServerBuild: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AddServerBuild", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetServerBuildInfo: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetServerBuildInfo", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetServerBuildUploadUrl: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetServerBuildUploadUrl", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ListServerBuilds: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ListServerBuilds", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ModifyServerBuild: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ModifyServerBuild", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RemoveServerBuild: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RemoveServerBuild", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetPublisherData: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetPublisherData", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetCloudScriptRevision: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetCloudScriptRevision", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetCloudScriptVersions: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetCloudScriptVersions", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    SetPublishedRevision: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/SetPublishedRevision", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateCloudScript: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateCloudScript", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    DeleteContent: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeleteContent", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetContentList: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetContentList", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetContentUploadUrl: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetContentUploadUrl", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    ResetCharacterStatistics: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/ResetCharacterStatistics", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AddPlayerTag: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AddPlayerTag", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    /**
     * @deprecated Please use GetTasks instead. 
     */
    GetAllActionGroups: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetAllActionGroups", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetAllSegments: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetAllSegments", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayerSegments: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayerSegments", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayersInSegment: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayersInSegment", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetPlayerTags: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetPlayerTags", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RemovePlayerTag: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RemovePlayerTag", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    AbortTaskInstance: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/AbortTaskInstance", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    CreateActionsOnPlayersInSegmentTask: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/CreateActionsOnPlayersInSegmentTask", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    CreateCloudScriptTask: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/CreateCloudScriptTask", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    DeleteTask: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/DeleteTask", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    /**
     * @deprecated Please use GetTasks instead. 
     */
    GetActionsOnPlayersInSegmentTaskInstance: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetActionsOnPlayersInSegmentTaskInstance", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetCloudScriptTaskInstance: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetCloudScriptTaskInstance", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetTaskInstances: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetTaskInstances", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    GetTasks: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/GetTasks", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    RunTask: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/RunTask", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },

    UpdateTask: function (request, callback) {
        if (!PlayFab.settings.developerSecretKey) throw PlayFab._internalSettings.errorSecretKey;

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Admin/UpdateTask", request, "X-SecretKey", PlayFab.settings.developerSecretKey, callback);
    },
};

var PlayFabAdminSDK = PlayFab.AdminApi;

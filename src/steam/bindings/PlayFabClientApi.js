/* eslint-disable */
/// <reference path="../typings/PlayFab/PlayFabClientApi.d.ts" />

export var PlayFab = typeof PlayFab != "undefined" ? PlayFab : {};

if(!PlayFab.settings) {
    PlayFab.settings = {
        titleId: null, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        developerSecretKey: null, // For security reasons you must never expose this value to the client or players - You must set this value for Server-APIs to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        GlobalHeaderInjection: null,
        productionServerUrl: ".playfabapi.com"
    }
}

if(!PlayFab._internalSettings) {
    PlayFab._internalSettings = {
        entityToken: null,
        sdkVersion: "1.136.230206",
        requestGetParams: {
            sdk: "JavaScriptSDK-1.136.230206"
        },
        sessionTicket: null,
        verticalName: null, // The name of a customer vertical. This is only for customers running a private cluster. Generally you shouldn't touch this
        errorTitleId: "Must be have PlayFab.settings.titleId set to call this method",
        errorLoggedIn: "Must be logged in to call this method",
        errorEntityToken: "You must successfully call GetEntityToken before calling this",
        errorSecretKey: "Must have PlayFab.settings.developerSecretKey set to call this method",

        GetServerUrl: function () {
            if (!(PlayFab.settings.productionServerUrl.substring(0, 4) === "http")) {
                if (PlayFab._internalSettings.verticalName) {
                    return "https://" + PlayFab._internalSettings.verticalName + PlayFab.settings.productionServerUrl;
                } else {
                    return "https://" + PlayFab.settings.titleId + PlayFab.settings.productionServerUrl;
                }
            } else {
                return PlayFab.settings.productionServerUrl;
            }
        },

        InjectHeaders: function (xhr, headersObj) {
            if (!headersObj)
                return;

            for (var headerKey in headersObj)
            {
                try {
                    xhr.setRequestHeader(gHeaderKey, headersObj[headerKey]);
                } catch (e) {
                    console.log("Failed to append header: " + headerKey + " = " + headersObj[headerKey] + "Error: " + e);
                }
            }
        },

        ExecuteRequest: function (url, request, authkey, authValue, callback, customData, extraHeaders) {
            var resultPromise = new Promise(function (resolve, reject) {
                if (callback != null && typeof (callback) !== "function")
                    throw "Callback must be null or a function";

                if (request == null)
                    request = {};

                var startTime = new Date();
                var requestBody = JSON.stringify(request);

                var urlArr = [url];
                var getParams = PlayFab._internalSettings.requestGetParams;
                if (getParams != null) {
                    var firstParam = true;
                    for (var key in getParams) {
                        if (firstParam) {
                            urlArr.push("?");
                            firstParam = false;
                        } else {
                            urlArr.push("&");
                        }
                        urlArr.push(key);
                        urlArr.push("=");
                        urlArr.push(getParams[key]);
                    }
                }

                var completeUrl = urlArr.join("");

                var xhr = new XMLHttpRequest();
                // window.console.log("URL: " + completeUrl);
                xhr.open("POST", completeUrl, true);

                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("X-PlayFabSDK", "JavaScriptSDK-" + PlayFab._internalSettings.sdkVersion);
                if (authkey != null)
                    xhr.setRequestHeader(authkey, authValue);
                PlayFab._internalSettings.InjectHeaders(xhr, PlayFab.settings.GlobalHeaderInjection);
                PlayFab._internalSettings.InjectHeaders(xhr, extraHeaders);

                xhr.onloadend = function () {
                    if (callback == null)
                        return;

                    var result = PlayFab._internalSettings.GetPlayFabResponse(request, xhr, startTime, customData);
                    if (result.code === 200) {
                        callback(result, null);
                    } else {
                        callback(null, result);
                    }
                }

                xhr.onerror = function () {
                    if (callback == null)
                        return;

                    var result = PlayFab._internalSettings.GetPlayFabResponse(request, xhr, startTime, customData);
                    callback(null, result);
                }

                xhr.send(requestBody);
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        var xhrResult = PlayFab._internalSettings.GetPlayFabResponse(request, this, startTime, customData);
                        if (this.status === 200) {
                            resolve(xhrResult);
                        } else {
                            reject(xhrResult);
                        }
                    }
                };
            });
            // Return a Promise so that calls to various API methods can be handled asynchronously
            return resultPromise;
        },

        GetPlayFabResponse: function(request, xhr, startTime, customData) {
            var result = null;
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
            result.Request = request;
            result.CustomData = customData;
            return result;
        },

        authenticationContext: {
            PlayFabId: null,
            EntityId: null,
            EntityType: null,
            SessionTicket: null,
            EntityToken: null
        },

        UpdateAuthenticationContext: function (authenticationContext, result) {
            var authenticationContextUpdates = {};
            if(result.data.PlayFabId !== null) {
                PlayFab._internalSettings.authenticationContext.PlayFabId = result.data.PlayFabId;
                authenticationContextUpdates.PlayFabId = result.data.PlayFabId;
            }
            if(result.data.SessionTicket !== null) {
                PlayFab._internalSettings.authenticationContext.SessionTicket = result.data.SessionTicket;
                authenticationContextUpdates.SessionTicket = result.data.SessionTicket;
            }
            if (result.data.EntityToken !== null) {
                PlayFab._internalSettings.authenticationContext.EntityId = result.data.EntityToken.Entity.Id;
                authenticationContextUpdates.EntityId = result.data.EntityToken.Entity.Id;
                PlayFab._internalSettings.authenticationContext.EntityType = result.data.EntityToken.Entity.Type;
                authenticationContextUpdates.EntityType = result.data.EntityToken.Entity.Type;
                PlayFab._internalSettings.authenticationContext.EntityToken = result.data.EntityToken.EntityToken;
                authenticationContextUpdates.EntityToken = result.data.EntityToken.EntityToken;
            }
            // Update the authenticationContext with values from the result
            authenticationContext = Object.assign(authenticationContext, authenticationContextUpdates);
            return authenticationContext;
        },

        AuthInfoMap: {
            "X-EntityToken": {
                authAttr: "entityToken",
                authError: "errorEntityToken"
            },
            "X-Authorization": {
                authAttr: "sessionTicket",
                authError: "errorLoggedIn"
            },
            "X-SecretKey": {
                authAttr: "developerSecretKey",
                authError: "errorSecretKey"
            }
        },

        GetAuthInfo: function (request, authKey) {
            // Use the most-recently saved authKey, unless one was provided in the request via the AuthenticationContext
            var authError = PlayFab._internalSettings.AuthInfoMap[authKey].authError;
            var authAttr = PlayFab._internalSettings.AuthInfoMap[authKey].authAttr;
            var defaultAuthValue = null;
            if (authAttr === "entityToken")
                defaultAuthValue = PlayFab._internalSettings.entityToken;
            else if (authAttr === "sessionTicket")
                defaultAuthValue = PlayFab._internalSettings.sessionTicket;
            else if (authAttr === "developerSecretKey")
                defaultAuthValue = PlayFab.settings.developerSecretKey;
            var authValue = request.AuthenticationContext ? request.AuthenticationContext[authAttr] : defaultAuthValue;
            return {"authKey": authKey, "authValue": authValue, "authError": authError};
        },

        ExecuteRequestWrapper: function (apiURL, request, authKey, callback, customData, extraHeaders) {
            var authValue = null;
            if (authKey !== null){
                var authInfo = PlayFab._internalSettings.GetAuthInfo(request, authKey=authKey);
                var authKey = authInfo.authKey, authValue = authInfo.authValue, authError = authInfo.authError;

                if (!authValue) throw authError;
            }
            return PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + apiURL, request, authKey, authValue, callback, customData, extraHeaders);
        }
    }
}

PlayFab.buildIdentifier = "adobuild_javascriptsdk_114";
PlayFab.sdkVersion = "1.136.230206";
PlayFab.GenerateErrorReport = function (error) {
    if (error == null)
        return "";
    var fullErrors = error.errorMessage;
    for (var paramName in error.errorDetails)
        for (var msgIdx in error.errorDetails[paramName])
            fullErrors += "\n" + paramName + ": " + error.errorDetails[paramName][msgIdx];
    return fullErrors;
};

PlayFab.ClientApi = {

    IsClientLoggedIn: function () {
        return PlayFab._internalSettings.sessionTicket != null && PlayFab._internalSettings.sessionTicket.length > 0;
    },
    ForgetAllCredentials: function () {
        PlayFab._internalSettings.sessionTicket = null;
        PlayFab._internalSettings.entityToken = null;
    },

    AcceptTrade: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AcceptTrade", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddFriend: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddFriend", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddGenericID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddGenericID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddOrUpdateContactEmail: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddOrUpdateContactEmail", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddSharedGroupMembers: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddSharedGroupMembers", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddUsernamePassword: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddUsernamePassword", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AddUserVirtualCurrency: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AddUserVirtualCurrency", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AndroidDevicePushNotificationRegistration: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AndroidDevicePushNotificationRegistration", request, "X-Authorization", callback, customData, extraHeaders);
    },

    AttributeInstall: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/AttributeInstall", request, "X-Authorization", callback, customData, extraHeaders);
    },

    CancelTrade: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/CancelTrade", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConfirmPurchase: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConfirmPurchase", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConsumeItem: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConsumeItem", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConsumeMicrosoftStoreEntitlements: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConsumeMicrosoftStoreEntitlements", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConsumePS5Entitlements: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConsumePS5Entitlements", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConsumePSNEntitlements: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConsumePSNEntitlements", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ConsumeXboxEntitlements: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ConsumeXboxEntitlements", request, "X-Authorization", callback, customData, extraHeaders);
    },

    CreateSharedGroup: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/CreateSharedGroup", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ExecuteCloudScript: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ExecuteCloudScript", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetAccountInfo: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetAccountInfo", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetAdPlacements: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetAdPlacements", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetAllUsersCharacters: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetAllUsersCharacters", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCatalogItems: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCatalogItems", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCharacterData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCharacterData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCharacterInventory: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCharacterInventory", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCharacterLeaderboard: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCharacterLeaderboard", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCharacterReadOnlyData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCharacterReadOnlyData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCharacterStatistics: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCharacterStatistics", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetContentDownloadUrl: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetContentDownloadUrl", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetCurrentGames: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetCurrentGames", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetFriendLeaderboard: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetFriendLeaderboard", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetFriendLeaderboardAroundPlayer: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetFriendLeaderboardAroundPlayer", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetFriendsList: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetFriendsList", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetGameServerRegions: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetGameServerRegions", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetLeaderboard: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetLeaderboard", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetLeaderboardAroundCharacter: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetLeaderboardAroundCharacter", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetLeaderboardAroundPlayer: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetLeaderboardAroundPlayer", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetLeaderboardForUserCharacters: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetLeaderboardForUserCharacters", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPaymentToken: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPaymentToken", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPhotonAuthenticationToken: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPhotonAuthenticationToken", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerCombinedInfo: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerCombinedInfo", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerProfile: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerProfile", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerSegments: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerSegments", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerStatistics: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerStatistics", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerStatisticVersions: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerStatisticVersions", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerTags: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerTags", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayerTrades: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayerTrades", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromFacebookIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromFacebookIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromFacebookInstantGamesIds: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromFacebookInstantGamesIds", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromGameCenterIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromGameCenterIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromGenericIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromGenericIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromGoogleIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromGoogleIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromGooglePlayGamesPlayerIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromGooglePlayGamesPlayerIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromKongregateIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromKongregateIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromNintendoServiceAccountIds: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromNintendoServiceAccountIds", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromNintendoSwitchDeviceIds: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromNintendoSwitchDeviceIds", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromPSNAccountIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromPSNAccountIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromSteamIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromSteamIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromTwitchIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromTwitchIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPlayFabIDsFromXboxLiveIDs: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPlayFabIDsFromXboxLiveIDs", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPublisherData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPublisherData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetPurchase: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetPurchase", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetSharedGroupData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetSharedGroupData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetStoreItems: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetStoreItems", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetTime: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetTime", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetTitleData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetTitleData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetTitleNews: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetTitleNews", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetTitlePublicKey: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetTitlePublicKey", request, null, callback, customData, extraHeaders);
    },

    GetTradeStatus: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetTradeStatus", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetUserData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetUserData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetUserInventory: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetUserInventory", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetUserPublisherData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetUserPublisherData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetUserPublisherReadOnlyData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetUserPublisherReadOnlyData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GetUserReadOnlyData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GetUserReadOnlyData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    GrantCharacterToUser: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/GrantCharacterToUser", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkAndroidDeviceID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkAndroidDeviceID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkApple: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkApple", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkCustomID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkCustomID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkFacebookAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkFacebookAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkFacebookInstantGamesId: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkFacebookInstantGamesId", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkGameCenterAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkGameCenterAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkGoogleAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkGoogleAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkGooglePlayGamesServicesAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkGooglePlayGamesServicesAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkIOSDeviceID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkIOSDeviceID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkKongregate: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkKongregate", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkNintendoServiceAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkNintendoServiceAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkNintendoSwitchDeviceId: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkNintendoSwitchDeviceId", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkOpenIdConnect: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkOpenIdConnect", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkPSNAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkPSNAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkSteamAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkSteamAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkTwitch: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkTwitch", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LinkXboxAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LinkXboxAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    LoginWithAndroidDeviceID: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithAndroidDeviceID", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithApple: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithApple", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithCustomID: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithCustomID", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithEmailAddress: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithEmailAddress", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithFacebook: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithFacebook", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithFacebookInstantGamesId: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithFacebookInstantGamesId", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithGameCenter: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithGameCenter", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithGoogleAccount: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithGoogleAccount", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithGooglePlayGamesServices: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithGooglePlayGamesServices", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithIOSDeviceID: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithIOSDeviceID", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithKongregate: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithKongregate", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithNintendoServiceAccount: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithNintendoServiceAccount", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithNintendoSwitchDeviceId: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithNintendoSwitchDeviceId", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithOpenIdConnect: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithOpenIdConnect", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithPlayFab: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithPlayFab", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithPSN: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithPSN", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithSteam: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithSteam", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithTwitch: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithTwitch", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    LoginWithXbox: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null) {
                if(result.data.SessionTicket != null) {
                    PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                }
                if (result.data.EntityToken != null) {
                    PlayFab._internalSettings.entityToken = result.data.EntityToken.EntityToken;
                }
                // Apply the updates for the AuthenticationContext returned to the client
                authenticationContext = PlayFab._internalSettings.UpdateAuthenticationContext(authenticationContext, result);
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequestWrapper("/Client/LoginWithXbox", request, null, overloadCallback, customData, extraHeaders);
        // Return a Promise so that multiple asynchronous calls to this method can be handled simultaneously with Promise.all()
        return new Promise(function(resolve){resolve(authenticationContext);});
    },

    Matchmake: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/Matchmake", request, "X-Authorization", callback, customData, extraHeaders);
    },

    OpenTrade: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/OpenTrade", request, "X-Authorization", callback, customData, extraHeaders);
    },

    PayForPurchase: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/PayForPurchase", request, "X-Authorization", callback, customData, extraHeaders);
    },

    PurchaseItem: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/PurchaseItem", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RedeemCoupon: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RedeemCoupon", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RefreshPSNAuthToken: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RefreshPSNAuthToken", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RegisterForIOSPushNotification: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RegisterForIOSPushNotification", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RegisterPlayFabUser: function (request, callback, customData, extraHeaders) {
        request.TitleId = PlayFab.settings.titleId ? PlayFab.settings.titleId : request.TitleId; if (!request.TitleId) throw PlayFab._internalSettings.errorTitleId;
        // PlayFab._internalSettings.authenticationContext can be modified by other asynchronous login attempts
        // Deep-copy the authenticationContext here to safely update it
        var authenticationContext = JSON.parse(JSON.stringify(PlayFab._internalSettings.authenticationContext));
        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
            }
            if (callback != null && typeof (callback) === "function")
                callback(result, error);
        };
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RegisterPlayFabUser", request, null, overloadCallback, customData, extraHeaders);
    },

    RemoveContactEmail: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RemoveContactEmail", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RemoveFriend: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RemoveFriend", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RemoveGenericID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RemoveGenericID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RemoveSharedGroupMembers: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RemoveSharedGroupMembers", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ReportAdActivity: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ReportAdActivity", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ReportDeviceInfo: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ReportDeviceInfo", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ReportPlayer: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ReportPlayer", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RestoreIOSPurchases: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RestoreIOSPurchases", request, "X-Authorization", callback, customData, extraHeaders);
    },

    RewardAdActivity: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/RewardAdActivity", request, "X-Authorization", callback, customData, extraHeaders);
    },

    SendAccountRecoveryEmail: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/SendAccountRecoveryEmail", request, null, callback, customData, extraHeaders);
    },

    SetFriendTags: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/SetFriendTags", request, "X-Authorization", callback, customData, extraHeaders);
    },

    SetPlayerSecret: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/SetPlayerSecret", request, "X-Authorization", callback, customData, extraHeaders);
    },

    StartPurchase: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/StartPurchase", request, "X-Authorization", callback, customData, extraHeaders);
    },

    SubtractUserVirtualCurrency: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/SubtractUserVirtualCurrency", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkAndroidDeviceID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkAndroidDeviceID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkApple: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkApple", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkCustomID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkCustomID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkFacebookAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkFacebookAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkFacebookInstantGamesId: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkFacebookInstantGamesId", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkGameCenterAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkGameCenterAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkGoogleAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkGoogleAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkGooglePlayGamesServicesAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkGooglePlayGamesServicesAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkIOSDeviceID: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkIOSDeviceID", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkKongregate: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkKongregate", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkNintendoServiceAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkNintendoServiceAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkNintendoSwitchDeviceId: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkNintendoSwitchDeviceId", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkOpenIdConnect: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkOpenIdConnect", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkPSNAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkPSNAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkSteamAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkSteamAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkTwitch: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkTwitch", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlinkXboxAccount: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlinkXboxAccount", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlockContainerInstance: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlockContainerInstance", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UnlockContainerItem: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UnlockContainerItem", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateAvatarUrl: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateAvatarUrl", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateCharacterData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateCharacterData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateCharacterStatistics: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateCharacterStatistics", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdatePlayerStatistics: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdatePlayerStatistics", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateSharedGroupData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateSharedGroupData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateUserData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateUserData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateUserPublisherData: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateUserPublisherData", request, "X-Authorization", callback, customData, extraHeaders);
    },

    UpdateUserTitleDisplayName: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/UpdateUserTitleDisplayName", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ValidateAmazonIAPReceipt: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ValidateAmazonIAPReceipt", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ValidateGooglePlayPurchase: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ValidateGooglePlayPurchase", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ValidateIOSReceipt: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ValidateIOSReceipt", request, "X-Authorization", callback, customData, extraHeaders);
    },

    ValidateWindowsStoreReceipt: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/ValidateWindowsStoreReceipt", request, "X-Authorization", callback, customData, extraHeaders);
    },

    WriteCharacterEvent: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/WriteCharacterEvent", request, "X-Authorization", callback, customData, extraHeaders);
    },

    WritePlayerEvent: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/WritePlayerEvent", request, "X-Authorization", callback, customData, extraHeaders);
    },

    WriteTitleEvent: function (request, callback, customData, extraHeaders) {
        return PlayFab._internalSettings.ExecuteRequestWrapper("/Client/WriteTitleEvent", request, "X-Authorization", callback, customData, extraHeaders);
    },

};

var PlayFabClientSDK = PlayFab.ClientApi;

PlayFab.RegisterWithPhaser = function() {
    if ( typeof Phaser === "undefined" || typeof Phaser.Plugin === "undefined" )
        return;

    Phaser.Plugin.PlayFab = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);
    };
    Phaser.Plugin.PlayFab.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.PlayFab.prototype.constructor = Phaser.Plugin.PlayFab;
    Phaser.Plugin.PlayFab.prototype.PlayFab = PlayFab;
    Phaser.Plugin.PlayFab.prototype.settings = PlayFab.settings;
    Phaser.Plugin.PlayFab.prototype.ClientApi = PlayFab.ClientApi;
};
PlayFab.RegisterWithPhaser();


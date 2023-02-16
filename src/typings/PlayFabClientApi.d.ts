/// <reference path="Playfab.d.ts" />

declare module PlayFabClientModule {
    export interface IPlayFabClient {
        IsClientLoggedIn(): boolean;

        ForgetAllCredentials(): void;

        /**
         * Accepts an open trade (one that has not yet been accepted or cancelled), if the locally signed-in player is in the
         * allowed player list for the trade, or it is open to all players. If the call is successful, the offered and accepted
         * items will be swapped between the two players' inventories.
         * https://docs.microsoft.com/rest/api/playfab/client/trading/accepttrade
         */
        AcceptTrade(request: PlayFabClientModels.AcceptTradeRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AcceptTradeResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AcceptTradeResponse>>;
        /**
         * Adds the PlayFab user, based upon a match against a supplied unique identifier, to the friend list of the local user. At
         * least one of FriendPlayFabId,FriendUsername,FriendEmail, or FriendTitleDisplayName should be initialized.
         * https://docs.microsoft.com/rest/api/playfab/client/friend-list-management/addfriend
         */
        AddFriend(request: PlayFabClientModels.AddFriendRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AddFriendResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AddFriendResult>>;
        /**
         * Adds the specified generic service identifier to the player's PlayFab account. This is designed to allow for a PlayFab
         * ID lookup of any arbitrary service identifier a title wants to add. This identifier should never be used as
         * authentication credentials, as the intent is that it is easily accessible by other players.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/addgenericid
         */
        AddGenericID(request: PlayFabClientModels.AddGenericIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AddGenericIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AddGenericIDResult>>;
        /**
         * Adds or updates a contact email to the player's profile.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/addorupdatecontactemail
         */
        AddOrUpdateContactEmail(request: PlayFabClientModels.AddOrUpdateContactEmailRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AddOrUpdateContactEmailResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AddOrUpdateContactEmailResult>>;
        /**
         * Adds users to the set of those able to update both the shared data, as well as the set of users in the group. Only users
         * in the group can add new members. Shared Groups are designed for sharing data between a very small number of players,
         * please see our guide: https://docs.microsoft.com/gaming/playfab/features/social/groups/using-shared-group-data
         * https://docs.microsoft.com/rest/api/playfab/client/shared-group-data/addsharedgroupmembers
         */
        AddSharedGroupMembers(request: PlayFabClientModels.AddSharedGroupMembersRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AddSharedGroupMembersResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AddSharedGroupMembersResult>>;
        /**
         * Adds playfab username/password auth to an existing account created via an anonymous auth method, e.g. automatic device
         * ID login.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/addusernamepassword
         */
        AddUsernamePassword(request: PlayFabClientModels.AddUsernamePasswordRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AddUsernamePasswordResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AddUsernamePasswordResult>>;
        /**
         * Increments the user's balance of the specified virtual currency by the stated amount
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/adduservirtualcurrency
         */
        AddUserVirtualCurrency(request: PlayFabClientModels.AddUserVirtualCurrencyRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ModifyUserVirtualCurrencyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ModifyUserVirtualCurrencyResult>>;
        /**
         * Registers the Android device to receive push notifications
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/androiddevicepushnotificationregistration
         */
        AndroidDevicePushNotificationRegistration(request: PlayFabClientModels.AndroidDevicePushNotificationRegistrationRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AndroidDevicePushNotificationRegistrationResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AndroidDevicePushNotificationRegistrationResult>>;
        /**
         * Attributes an install for advertisment.
         * https://docs.microsoft.com/rest/api/playfab/client/advertising/attributeinstall
         */
        AttributeInstall(request: PlayFabClientModels.AttributeInstallRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.AttributeInstallResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.AttributeInstallResult>>;
        /**
         * Cancels an open trade (one that has not yet been accepted or cancelled). Note that only the player who created the trade
         * can cancel it via this API call, to prevent griefing of the trade system (cancelling trades in order to prevent other
         * players from accepting them, for trades that can be claimed by more than one player).
         * https://docs.microsoft.com/rest/api/playfab/client/trading/canceltrade
         */
        CancelTrade(request: PlayFabClientModels.CancelTradeRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.CancelTradeResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.CancelTradeResponse>>;
        /**
         * Confirms with the payment provider that the purchase was approved (if applicable) and adjusts inventory and virtual
         * currency balances as appropriate
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/confirmpurchase
         */
        ConfirmPurchase(request: PlayFabClientModels.ConfirmPurchaseRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConfirmPurchaseResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConfirmPurchaseResult>>;
        /**
         * Consume uses of a consumable item. When all uses are consumed, it will be removed from the player's inventory.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/consumeitem
         */
        ConsumeItem(request: PlayFabClientModels.ConsumeItemRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeItemResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeItemResult>>;
        /**
         * Grants the player's current entitlements from Microsoft Store's Collection API
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/consumemicrosoftstoreentitlements
         */
        ConsumeMicrosoftStoreEntitlements(request: PlayFabClientModels.ConsumeMicrosoftStoreEntitlementsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeMicrosoftStoreEntitlementsResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeMicrosoftStoreEntitlementsResponse>>;
        /**
         * Checks for any new consumable entitlements. If any are found, they are consumed (if they're consumables) and added as
         * PlayFab items
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/consumeps5entitlements
         */
        ConsumePS5Entitlements(request: PlayFabClientModels.ConsumePS5EntitlementsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConsumePS5EntitlementsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConsumePS5EntitlementsResult>>;
        /**
         * Checks for any new consumable entitlements. If any are found, they are consumed and added as PlayFab items
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/consumepsnentitlements
         */
        ConsumePSNEntitlements(request: PlayFabClientModels.ConsumePSNEntitlementsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConsumePSNEntitlementsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConsumePSNEntitlementsResult>>;
        /**
         * Grants the player's current entitlements from Xbox Live, consuming all availble items in Xbox and granting them to the
         * player's PlayFab inventory. This call is idempotent and will not grant previously granted items to the player.
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/consumexboxentitlements
         */
        ConsumeXboxEntitlements(request: PlayFabClientModels.ConsumeXboxEntitlementsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeXboxEntitlementsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ConsumeXboxEntitlementsResult>>;
        /**
         * Requests the creation of a shared group object, containing key/value pairs which may be updated by all members of the
         * group. Upon creation, the current user will be the only member of the group. Shared Groups are designed for sharing data
         * between a very small number of players, please see our guide:
         * https://docs.microsoft.com/gaming/playfab/features/social/groups/using-shared-group-data
         * https://docs.microsoft.com/rest/api/playfab/client/shared-group-data/createsharedgroup
         */
        CreateSharedGroup(request: PlayFabClientModels.CreateSharedGroupRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.CreateSharedGroupResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.CreateSharedGroupResult>>;
        /**
         * Executes a CloudScript function, with the 'currentPlayerId' set to the PlayFab ID of the authenticated player. The
         * PlayFab ID is the entity ID of the player's master_player_account entity.
         * https://docs.microsoft.com/rest/api/playfab/client/server-side-cloud-script/executecloudscript
         */
        ExecuteCloudScript(request: PlayFabClientModels.ExecuteCloudScriptRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ExecuteCloudScriptResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ExecuteCloudScriptResult>>;
        /**
         * Retrieves the user's PlayFab account details
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getaccountinfo
         */
        GetAccountInfo(request: PlayFabClientModels.GetAccountInfoRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetAccountInfoResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetAccountInfoResult>>;
        /**
         * Returns a list of ad placements and a reward for each
         * https://docs.microsoft.com/rest/api/playfab/client/advertising/getadplacements
         */
        GetAdPlacements(request: PlayFabClientModels.GetAdPlacementsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetAdPlacementsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetAdPlacementsResult>>;
        /**
         * Lists all of the characters that belong to a specific user. CharacterIds are not globally unique; characterId must be
         * evaluated with the parent PlayFabId to guarantee uniqueness.
         * https://docs.microsoft.com/rest/api/playfab/client/characters/getalluserscharacters
         */
        GetAllUsersCharacters(request: PlayFabClientModels.ListUsersCharactersRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ListUsersCharactersResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ListUsersCharactersResult>>;
        /**
         * Retrieves the specified version of the title's catalog of virtual goods, including all defined properties
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/getcatalogitems
         */
        GetCatalogItems(request: PlayFabClientModels.GetCatalogItemsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCatalogItemsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCatalogItemsResult>>;
        /**
         * Retrieves the title-specific custom data for the character which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/character-data/getcharacterdata
         */
        GetCharacterData(request: PlayFabClientModels.GetCharacterDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterDataResult>>;
        /**
         * Retrieves the specified character's current inventory of virtual goods
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/getcharacterinventory
         */
        GetCharacterInventory(request: PlayFabClientModels.GetCharacterInventoryRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterInventoryResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterInventoryResult>>;
        /**
         * Retrieves a list of ranked characters for the given statistic, starting from the indicated point in the leaderboard
         * https://docs.microsoft.com/rest/api/playfab/client/characters/getcharacterleaderboard
         */
        GetCharacterLeaderboard(request: PlayFabClientModels.GetCharacterLeaderboardRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterLeaderboardResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterLeaderboardResult>>;
        /**
         * Retrieves the title-specific custom data for the character which can only be read by the client
         * https://docs.microsoft.com/rest/api/playfab/client/character-data/getcharacterreadonlydata
         */
        GetCharacterReadOnlyData(request: PlayFabClientModels.GetCharacterDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterDataResult>>;
        /**
         * Retrieves the details of all title-specific statistics for the user
         * https://docs.microsoft.com/rest/api/playfab/client/characters/getcharacterstatistics
         */
        GetCharacterStatistics(request: PlayFabClientModels.GetCharacterStatisticsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterStatisticsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetCharacterStatisticsResult>>;
        /**
         * This API retrieves a pre-signed URL for accessing a content file for the title. A subsequent HTTP GET to the returned
         * URL will attempt to download the content. A HEAD query to the returned URL will attempt to retrieve the metadata of the
         * content. Note that a successful result does not guarantee the existence of this content - if it has not been uploaded,
         * the query to retrieve the data will fail. See this post for more information:
         * https://community.playfab.com/hc/community/posts/205469488-How-to-upload-files-to-PlayFab-s-Content-Service. Also,
         * please be aware that the Content service is specifically PlayFab's CDN offering, for which standard CDN rates apply.
         * https://docs.microsoft.com/rest/api/playfab/client/content/getcontentdownloadurl
         */
        GetContentDownloadUrl(request: PlayFabClientModels.GetContentDownloadUrlRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetContentDownloadUrlResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetContentDownloadUrlResult>>;
        /**
         * Get details about all current running game servers matching the given parameters.
         * https://docs.microsoft.com/rest/api/playfab/client/matchmaking/getcurrentgames
         */
        GetCurrentGames(request: PlayFabClientModels.CurrentGamesRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.CurrentGamesResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.CurrentGamesResult>>;
        /**
         * Retrieves a list of ranked friends of the current player for the given statistic, starting from the indicated point in
         * the leaderboard
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getfriendleaderboard
         */
        GetFriendLeaderboard(request: PlayFabClientModels.GetFriendLeaderboardRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardResult>>;
        /**
         * Retrieves a list of ranked friends of the current player for the given statistic, centered on the requested PlayFab
         * user. If PlayFabId is empty or null will return currently logged in user.
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getfriendleaderboardaroundplayer
         */
        GetFriendLeaderboardAroundPlayer(request: PlayFabClientModels.GetFriendLeaderboardAroundPlayerRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetFriendLeaderboardAroundPlayerResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetFriendLeaderboardAroundPlayerResult>>;
        /**
         * Retrieves the current friend list for the local user, constrained to users who have PlayFab accounts. Friends from
         * linked accounts (Facebook, Steam) are also included. You may optionally exclude some linked services' friends.
         * https://docs.microsoft.com/rest/api/playfab/client/friend-list-management/getfriendslist
         */
        GetFriendsList(request: PlayFabClientModels.GetFriendsListRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetFriendsListResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetFriendsListResult>>;
        /**
         * Get details about the regions hosting game servers matching the given parameters.
         * https://docs.microsoft.com/rest/api/playfab/client/matchmaking/getgameserverregions
         */
        GetGameServerRegions(request: PlayFabClientModels.GameServerRegionsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GameServerRegionsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GameServerRegionsResult>>;
        /**
         * Retrieves a list of ranked users for the given statistic, starting from the indicated point in the leaderboard
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getleaderboard
         */
        GetLeaderboard(request: PlayFabClientModels.GetLeaderboardRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardResult>>;
        /**
         * Retrieves a list of ranked characters for the given statistic, centered on the requested Character ID
         * https://docs.microsoft.com/rest/api/playfab/client/characters/getleaderboardaroundcharacter
         */
        GetLeaderboardAroundCharacter(request: PlayFabClientModels.GetLeaderboardAroundCharacterRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardAroundCharacterResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardAroundCharacterResult>>;
        /**
         * Retrieves a list of ranked users for the given statistic, centered on the requested player. If PlayFabId is empty or
         * null will return currently logged in user.
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getleaderboardaroundplayer
         */
        GetLeaderboardAroundPlayer(request: PlayFabClientModels.GetLeaderboardAroundPlayerRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardAroundPlayerResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardAroundPlayerResult>>;
        /**
         * Retrieves a list of all of the user's characters for the given statistic.
         * https://docs.microsoft.com/rest/api/playfab/client/characters/getleaderboardforusercharacters
         */
        GetLeaderboardForUserCharacters(request: PlayFabClientModels.GetLeaderboardForUsersCharactersRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardForUsersCharactersResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetLeaderboardForUsersCharactersResult>>;
        /**
         * For payments flows where the provider requires playfab (the fulfiller) to initiate the transaction, but the client
         * completes the rest of the flow. In the Xsolla case, the token returned here will be passed to Xsolla by the client to
         * create a cart. Poll GetPurchase using the returned OrderId once you've completed the payment.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/getpaymenttoken
         */
        GetPaymentToken(request: PlayFabClientModels.GetPaymentTokenRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPaymentTokenResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPaymentTokenResult>>;
        /**
         * Gets a Photon custom authentication token that can be used to securely join the player into a Photon room. See
         * https://docs.microsoft.com/gaming/playfab/features/multiplayer/photon/quickstart for more details.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/getphotonauthenticationtoken
         */
        GetPhotonAuthenticationToken(request: PlayFabClientModels.GetPhotonAuthenticationTokenRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPhotonAuthenticationTokenResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPhotonAuthenticationTokenResult>>;
        /**
         * Retrieves all of the user's different kinds of info.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayercombinedinfo
         */
        GetPlayerCombinedInfo(request: PlayFabClientModels.GetPlayerCombinedInfoRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerCombinedInfoResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerCombinedInfoResult>>;
        /**
         * Retrieves the player's profile
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayerprofile
         */
        GetPlayerProfile(request: PlayFabClientModels.GetPlayerProfileRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerProfileResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerProfileResult>>;
        /**
         * List all segments that a player currently belongs to at this moment in time.
         * https://docs.microsoft.com/rest/api/playfab/client/playstream/getplayersegments
         */
        GetPlayerSegments(request: PlayFabClientModels.GetPlayerSegmentsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerSegmentsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerSegmentsResult>>;
        /**
         * Retrieves the indicated statistics (current version and values for all statistics, if none are specified), for the local
         * player.
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getplayerstatistics
         */
        GetPlayerStatistics(request: PlayFabClientModels.GetPlayerStatisticsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerStatisticsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerStatisticsResult>>;
        /**
         * Retrieves the information on the available versions of the specified statistic.
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getplayerstatisticversions
         */
        GetPlayerStatisticVersions(request: PlayFabClientModels.GetPlayerStatisticVersionsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerStatisticVersionsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerStatisticVersionsResult>>;
        /**
         * Get all tags with a given Namespace (optional) from a player profile.
         * https://docs.microsoft.com/rest/api/playfab/client/playstream/getplayertags
         */
        GetPlayerTags(request: PlayFabClientModels.GetPlayerTagsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerTagsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerTagsResult>>;
        /**
         * Gets all trades the player has either opened or accepted, optionally filtered by trade status.
         * https://docs.microsoft.com/rest/api/playfab/client/trading/getplayertrades
         */
        GetPlayerTrades(request: PlayFabClientModels.GetPlayerTradesRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerTradesResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayerTradesResponse>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Facebook identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromfacebookids
         */
        GetPlayFabIDsFromFacebookIDs(request: PlayFabClientModels.GetPlayFabIDsFromFacebookIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromFacebookIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromFacebookIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Facebook Instant Game identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromfacebookinstantgamesids
         */
        GetPlayFabIDsFromFacebookInstantGamesIds(request: PlayFabClientModels.GetPlayFabIDsFromFacebookInstantGamesIdsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromFacebookInstantGamesIdsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromFacebookInstantGamesIdsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Game Center identifiers (referenced in the Game Center
         * Programming Guide as the Player Identifier).
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromgamecenterids
         */
        GetPlayFabIDsFromGameCenterIDs(request: PlayFabClientModels.GetPlayFabIDsFromGameCenterIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGameCenterIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGameCenterIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of generic service identifiers. A generic identifier is the
         * service name plus the service-specific ID for the player, as specified by the title when the generic identifier was
         * added to the player account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromgenericids
         */
        GetPlayFabIDsFromGenericIDs(request: PlayFabClientModels.GetPlayFabIDsFromGenericIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGenericIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGenericIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Google identifiers. The Google identifiers are the IDs for
         * the user accounts, available as "id" in the Google+ People API calls.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromgoogleids
         */
        GetPlayFabIDsFromGoogleIDs(request: PlayFabClientModels.GetPlayFabIDsFromGoogleIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGoogleIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGoogleIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Google Play Games identifiers. The Google Play Games
         * identifiers are the IDs for the user accounts, available as "playerId" in the Google Play Games Services - Players API
         * calls.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromgoogleplaygamesplayerids
         */
        GetPlayFabIDsFromGooglePlayGamesPlayerIDs(request: PlayFabClientModels.GetPlayFabIDsFromGooglePlayGamesPlayerIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGooglePlayGamesPlayerIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromGooglePlayGamesPlayerIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Kongregate identifiers. The Kongregate identifiers are the
         * IDs for the user accounts, available as "user_id" from the Kongregate API methods(ex:
         * http://developers.kongregate.com/docs/client/getUserId).
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromkongregateids
         */
        GetPlayFabIDsFromKongregateIDs(request: PlayFabClientModels.GetPlayFabIDsFromKongregateIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromKongregateIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromKongregateIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Nintendo Service Account identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromnintendoserviceaccountids
         */
        GetPlayFabIDsFromNintendoServiceAccountIds(request: PlayFabClientModels.GetPlayFabIDsFromNintendoServiceAccountIdsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromNintendoServiceAccountIdsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromNintendoServiceAccountIdsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Nintendo Switch Device identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromnintendoswitchdeviceids
         */
        GetPlayFabIDsFromNintendoSwitchDeviceIds(request: PlayFabClientModels.GetPlayFabIDsFromNintendoSwitchDeviceIdsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromNintendoSwitchDeviceIdsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromNintendoSwitchDeviceIdsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of PlayStation :tm: Network identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfrompsnaccountids
         */
        GetPlayFabIDsFromPSNAccountIDs(request: PlayFabClientModels.GetPlayFabIDsFromPSNAccountIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromPSNAccountIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromPSNAccountIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Steam identifiers. The Steam identifiers are the profile
         * IDs for the user accounts, available as SteamId in the Steamworks Community API calls.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromsteamids
         */
        GetPlayFabIDsFromSteamIDs(request: PlayFabClientModels.GetPlayFabIDsFromSteamIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromSteamIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromSteamIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of Twitch identifiers. The Twitch identifiers are the IDs for
         * the user accounts, available as "_id" from the Twitch API methods (ex:
         * https://github.com/justintv/Twitch-API/blob/master/v3_resources/users.md#get-usersuser).
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromtwitchids
         */
        GetPlayFabIDsFromTwitchIDs(request: PlayFabClientModels.GetPlayFabIDsFromTwitchIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromTwitchIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromTwitchIDsResult>>;
        /**
         * Retrieves the unique PlayFab identifiers for the given set of XboxLive identifiers.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/getplayfabidsfromxboxliveids
         */
        GetPlayFabIDsFromXboxLiveIDs(request: PlayFabClientModels.GetPlayFabIDsFromXboxLiveIDsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromXboxLiveIDsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPlayFabIDsFromXboxLiveIDsResult>>;
        /**
         * Retrieves the key-value store of custom publisher settings
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/getpublisherdata
         */
        GetPublisherData(request: PlayFabClientModels.GetPublisherDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPublisherDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPublisherDataResult>>;
        /**
         * Retrieves a purchase along with its current PlayFab status. Returns inventory items from the purchase that are still
         * active.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/getpurchase
         */
        GetPurchase(request: PlayFabClientModels.GetPurchaseRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetPurchaseResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetPurchaseResult>>;
        /**
         * Retrieves data stored in a shared group object, as well as the list of members in the group. Non-members of the group
         * may use this to retrieve group data, including membership, but they will not receive data for keys marked as private.
         * Shared Groups are designed for sharing data between a very small number of players, please see our guide:
         * https://docs.microsoft.com/gaming/playfab/features/social/groups/using-shared-group-data
         * https://docs.microsoft.com/rest/api/playfab/client/shared-group-data/getsharedgroupdata
         */
        GetSharedGroupData(request: PlayFabClientModels.GetSharedGroupDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetSharedGroupDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetSharedGroupDataResult>>;
        /**
         * Retrieves the set of items defined for the specified store, including all prices defined
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/getstoreitems
         */
        GetStoreItems(request: PlayFabClientModels.GetStoreItemsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetStoreItemsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetStoreItemsResult>>;
        /**
         * Retrieves the current server time
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/gettime
         */
        GetTime(request: PlayFabClientModels.GetTimeRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetTimeResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetTimeResult>>;
        /**
         * Retrieves the key-value store of custom title settings
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/gettitledata
         */
        GetTitleData(request: PlayFabClientModels.GetTitleDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetTitleDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetTitleDataResult>>;
        /**
         * Retrieves the title news feed, as configured in the developer portal
         * https://docs.microsoft.com/rest/api/playfab/client/title-wide-data-management/gettitlenews
         */
        GetTitleNews(request: PlayFabClientModels.GetTitleNewsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetTitleNewsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetTitleNewsResult>>;
        /**
         * Returns the title's base 64 encoded RSA CSP blob.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/gettitlepublickey
         */
        GetTitlePublicKey(request: PlayFabClientModels.GetTitlePublicKeyRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetTitlePublicKeyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetTitlePublicKeyResult>>;
        /**
         * Gets the current status of an existing trade.
         * https://docs.microsoft.com/rest/api/playfab/client/trading/gettradestatus
         */
        GetTradeStatus(request: PlayFabClientModels.GetTradeStatusRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetTradeStatusResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetTradeStatusResponse>>;
        /**
         * Retrieves the title-specific custom data for the user which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getuserdata
         */
        GetUserData(request: PlayFabClientModels.GetUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>>;
        /**
         * Retrieves the user's current inventory of virtual goods
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/getuserinventory
         */
        GetUserInventory(request: PlayFabClientModels.GetUserInventoryRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetUserInventoryResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetUserInventoryResult>>;
        /**
         * Retrieves the publisher-specific custom data for the user which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getuserpublisherdata
         */
        GetUserPublisherData(request: PlayFabClientModels.GetUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>>;
        /**
         * Retrieves the publisher-specific custom data for the user which can only be read by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getuserpublisherreadonlydata
         */
        GetUserPublisherReadOnlyData(request: PlayFabClientModels.GetUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>>;
        /**
         * Retrieves the title-specific custom data for the user which can only be read by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/getuserreadonlydata
         */
        GetUserReadOnlyData(request: PlayFabClientModels.GetUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GetUserDataResult>>;
        /**
         * Grants the specified character type to the user. CharacterIds are not globally unique; characterId must be evaluated
         * with the parent PlayFabId to guarantee uniqueness.
         * https://docs.microsoft.com/rest/api/playfab/client/characters/grantcharactertouser
         */
        GrantCharacterToUser(request: PlayFabClientModels.GrantCharacterToUserRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.GrantCharacterToUserResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.GrantCharacterToUserResult>>;
        /**
         * Links the Android device identifier to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkandroiddeviceid
         */
        LinkAndroidDeviceID(request: PlayFabClientModels.LinkAndroidDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkAndroidDeviceIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkAndroidDeviceIDResult>>;
        /**
         * Links the Apple account associated with the token to the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkapple
         */
        LinkApple(request: PlayFabClientModels.LinkAppleRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>>;
        /**
         * Links the custom identifier, generated by the title, to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkcustomid
         */
        LinkCustomID(request: PlayFabClientModels.LinkCustomIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkCustomIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkCustomIDResult>>;
        /**
         * Links the Facebook account associated with the provided Facebook access token to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkfacebookaccount
         */
        LinkFacebookAccount(request: PlayFabClientModels.LinkFacebookAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkFacebookAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkFacebookAccountResult>>;
        /**
         * Links the Facebook Instant Games Id to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkfacebookinstantgamesid
         */
        LinkFacebookInstantGamesId(request: PlayFabClientModels.LinkFacebookInstantGamesIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkFacebookInstantGamesIdResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkFacebookInstantGamesIdResult>>;
        /**
         * Links the Game Center account associated with the provided Game Center ID to the user's PlayFab account. Logging in with
         * a Game Center ID is insecure if you do not include the optional PublicKeyUrl, Salt, Signature, and Timestamp parameters
         * in this request. It is recommended you require these parameters on all Game Center calls by going to the Apple Add-ons
         * page in the PlayFab Game Manager and enabling the 'Require secure authentication only for this app' option.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkgamecenteraccount
         */
        LinkGameCenterAccount(request: PlayFabClientModels.LinkGameCenterAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkGameCenterAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkGameCenterAccountResult>>;
        /**
         * Links the currently signed-in user account to their Google account, using their Google account credentials
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkgoogleaccount
         */
        LinkGoogleAccount(request: PlayFabClientModels.LinkGoogleAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkGoogleAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkGoogleAccountResult>>;
        /**
         * Links the currently signed-in user account to their Google Play Games account, using their Google Play Games account
         * credentials
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkgoogleplaygamesservicesaccount
         */
        LinkGooglePlayGamesServicesAccount(request: PlayFabClientModels.LinkGooglePlayGamesServicesAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkGooglePlayGamesServicesAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkGooglePlayGamesServicesAccountResult>>;
        /**
         * Links the vendor-specific iOS device identifier to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkiosdeviceid
         */
        LinkIOSDeviceID(request: PlayFabClientModels.LinkIOSDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkIOSDeviceIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkIOSDeviceIDResult>>;
        /**
         * Links the Kongregate identifier to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkkongregate
         */
        LinkKongregate(request: PlayFabClientModels.LinkKongregateAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkKongregateAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkKongregateAccountResult>>;
        /**
         * Links the Nintendo account associated with the token to the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linknintendoserviceaccount
         */
        LinkNintendoServiceAccount(request: PlayFabClientModels.LinkNintendoServiceAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>>;
        /**
         * Links the NintendoSwitchDeviceId to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linknintendoswitchdeviceid
         */
        LinkNintendoSwitchDeviceId(request: PlayFabClientModels.LinkNintendoSwitchDeviceIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkNintendoSwitchDeviceIdResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkNintendoSwitchDeviceIdResult>>;
        /**
         * Links an OpenID Connect account to a user's PlayFab account, based on an existing relationship between a title and an
         * Open ID Connect provider and the OpenId Connect JWT from that provider.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkopenidconnect
         */
        LinkOpenIdConnect(request: PlayFabClientModels.LinkOpenIdConnectRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResult>>;
        /**
         * Links the PlayStation :tm: Network account associated with the provided access code to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkpsnaccount
         */
        LinkPSNAccount(request: PlayFabClientModels.LinkPSNAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkPSNAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkPSNAccountResult>>;
        /**
         * Links the Steam account associated with the provided Steam authentication ticket to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linksteamaccount
         */
        LinkSteamAccount(request: PlayFabClientModels.LinkSteamAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkSteamAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkSteamAccountResult>>;
        /**
         * Links the Twitch account associated with the token to the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linktwitch
         */
        LinkTwitch(request: PlayFabClientModels.LinkTwitchAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkTwitchAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkTwitchAccountResult>>;
        /**
         * Links the Xbox Live account associated with the provided access code to the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/linkxboxaccount
         */
        LinkXboxAccount(request: PlayFabClientModels.LinkXboxAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LinkXboxAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LinkXboxAccountResult>>;
        /**
         * Signs the user in using the Android device identifier, returning a session identifier that can subsequently be used for
         * API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithandroiddeviceid
         */
        LoginWithAndroidDeviceID(request: PlayFabClientModels.LoginWithAndroidDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs in the user with a Sign in with Apple identity token.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithapple
         */
        LoginWithApple(request: PlayFabClientModels.LoginWithAppleRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a custom unique identifier generated by the title, returning a session identifier that can
         * subsequently be used for API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithcustomid
         */
        LoginWithCustomID(request: PlayFabClientModels.LoginWithCustomIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user into the PlayFab account, returning a session identifier that can subsequently be used for API calls
         * which require an authenticated user. Unlike most other login API calls, LoginWithEmailAddress does not permit the
         * creation of new accounts via the CreateAccountFlag. Email addresses may be used to create accounts via
         * RegisterPlayFabUser.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithemailaddress
         */
        LoginWithEmailAddress(request: PlayFabClientModels.LoginWithEmailAddressRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Facebook access token, returning a session identifier that can subsequently be used for API
         * calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithfacebook
         */
        LoginWithFacebook(request: PlayFabClientModels.LoginWithFacebookRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Facebook Instant Games ID, returning a session identifier that can subsequently be used for
         * API calls which require an authenticated user. Requires Facebook Instant Games to be configured.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithfacebookinstantgamesid
         */
        LoginWithFacebookInstantGamesId(request: PlayFabClientModels.LoginWithFacebookInstantGamesIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using an iOS Game Center player identifier, returning a session identifier that can subsequently be
         * used for API calls which require an authenticated user. Logging in with a Game Center ID is insecure if you do not
         * include the optional PublicKeyUrl, Salt, Signature, and Timestamp parameters in this request. It is recommended you
         * require these parameters on all Game Center calls by going to the Apple Add-ons page in the PlayFab Game Manager and
         * enabling the 'Require secure authentication only for this app' option.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithgamecenter
         */
        LoginWithGameCenter(request: PlayFabClientModels.LoginWithGameCenterRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using their Google account credentials
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithgoogleaccount
         */
        LoginWithGoogleAccount(request: PlayFabClientModels.LoginWithGoogleAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using their Google Play Games account credentials
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithgoogleplaygamesservices
         */
        LoginWithGooglePlayGamesServices(request: PlayFabClientModels.LoginWithGooglePlayGamesServicesRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using the vendor-specific iOS device identifier, returning a session identifier that can subsequently
         * be used for API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithiosdeviceid
         */
        LoginWithIOSDeviceID(request: PlayFabClientModels.LoginWithIOSDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Kongregate player account.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithkongregate
         */
        LoginWithKongregate(request: PlayFabClientModels.LoginWithKongregateRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs in the user with a Nintendo service account token.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithnintendoserviceaccount
         */
        LoginWithNintendoServiceAccount(request: PlayFabClientModels.LoginWithNintendoServiceAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Nintendo Switch Device ID, returning a session identifier that can subsequently be used for
         * API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithnintendoswitchdeviceid
         */
        LoginWithNintendoSwitchDeviceId(request: PlayFabClientModels.LoginWithNintendoSwitchDeviceIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Logs in a user with an Open ID Connect JWT created by an existing relationship between a title and an Open ID Connect
         * provider.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithopenidconnect
         */
        LoginWithOpenIdConnect(request: PlayFabClientModels.LoginWithOpenIdConnectRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user into the PlayFab account, returning a session identifier that can subsequently be used for API calls
         * which require an authenticated user. Unlike most other login API calls, LoginWithPlayFab does not permit the creation of
         * new accounts via the CreateAccountFlag. Username/Password credentials may be used to create accounts via
         * RegisterPlayFabUser, or added to existing accounts using AddUsernamePassword.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithplayfab
         */
        LoginWithPlayFab(request: PlayFabClientModels.LoginWithPlayFabRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a PlayStation :tm: Network authentication code, returning a session identifier that can
         * subsequently be used for API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithpsn
         */
        LoginWithPSN(request: PlayFabClientModels.LoginWithPSNRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Steam authentication ticket, returning a session identifier that can subsequently be used for
         * API calls which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithsteam
         */
        LoginWithSteam(request: PlayFabClientModels.LoginWithSteamRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Twitch access token.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithtwitch
         */
        LoginWithTwitch(request: PlayFabClientModels.LoginWithTwitchRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Signs the user in using a Xbox Live Token, returning a session identifier that can subsequently be used for API calls
         * which require an authenticated user
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/loginwithxbox
         */
        LoginWithXbox(request: PlayFabClientModels.LoginWithXboxRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.LoginResult>>;
        /**
         * Attempts to locate a game session matching the given parameters. If the goal is to match the player into a specific
         * active session, only the LobbyId is required. Otherwise, the BuildVersion, GameMode, and Region are all required
         * parameters. Note that parameters specified in the search are required (they are not weighting factors). If a slot is
         * found in a server instance matching the parameters, the slot will be assigned to that player, removing it from the
         * availabe set. In that case, the information on the game session will be returned, otherwise the Status returned will be
         * GameNotFound.
         * https://docs.microsoft.com/rest/api/playfab/client/matchmaking/matchmake
         */
        Matchmake(request: PlayFabClientModels.MatchmakeRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.MatchmakeResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.MatchmakeResult>>;
        /**
         * Opens a new outstanding trade. Note that a given item instance may only be in one open trade at a time.
         * https://docs.microsoft.com/rest/api/playfab/client/trading/opentrade
         */
        OpenTrade(request: PlayFabClientModels.OpenTradeRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.OpenTradeResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.OpenTradeResponse>>;
        /**
         * Selects a payment option for purchase order created via StartPurchase
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/payforpurchase
         */
        PayForPurchase(request: PlayFabClientModels.PayForPurchaseRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.PayForPurchaseResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.PayForPurchaseResult>>;
        /**
         * Buys a single item with virtual currency. You must specify both the virtual currency to use to purchase, as well as what
         * the client believes the price to be. This lets the server fail the purchase if the price has changed.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/purchaseitem
         */
        PurchaseItem(request: PlayFabClientModels.PurchaseItemRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.PurchaseItemResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.PurchaseItemResult>>;
        /**
         * Adds the virtual goods associated with the coupon to the user's inventory. Coupons can be generated via the
         * Economy->Catalogs tab in the PlayFab Game Manager.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/redeemcoupon
         */
        RedeemCoupon(request: PlayFabClientModels.RedeemCouponRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RedeemCouponResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RedeemCouponResult>>;
        /**
         * Uses the supplied OAuth code to refresh the internally cached player PlayStation :tm: Network auth token
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/refreshpsnauthtoken
         */
        RefreshPSNAuthToken(request: PlayFabClientModels.RefreshPSNAuthTokenRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Registers the iOS device to receive push notifications
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/registerforiospushnotification
         */
        RegisterForIOSPushNotification(request: PlayFabClientModels.RegisterForIOSPushNotificationRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RegisterForIOSPushNotificationResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RegisterForIOSPushNotificationResult>>;
        /**
         * Registers a new Playfab user account, returning a session identifier that can subsequently be used for API calls which
         * require an authenticated user. You must supply either a username or an email address.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/registerplayfabuser
         */
        RegisterPlayFabUser(request: PlayFabClientModels.RegisterPlayFabUserRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RegisterPlayFabUserResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RegisterPlayFabUserResult>>;
        /**
         * Removes a contact email from the player's profile.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/removecontactemail
         */
        RemoveContactEmail(request: PlayFabClientModels.RemoveContactEmailRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RemoveContactEmailResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RemoveContactEmailResult>>;
        /**
         * Removes a specified user from the friend list of the local user
         * https://docs.microsoft.com/rest/api/playfab/client/friend-list-management/removefriend
         */
        RemoveFriend(request: PlayFabClientModels.RemoveFriendRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RemoveFriendResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RemoveFriendResult>>;
        /**
         * Removes the specified generic service identifier from the player's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/removegenericid
         */
        RemoveGenericID(request: PlayFabClientModels.RemoveGenericIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RemoveGenericIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RemoveGenericIDResult>>;
        /**
         * Removes users from the set of those able to update the shared data and the set of users in the group. Only users in the
         * group can remove members. If as a result of the call, zero users remain with access, the group and its associated data
         * will be deleted. Shared Groups are designed for sharing data between a very small number of players, please see our
         * guide: https://docs.microsoft.com/gaming/playfab/features/social/groups/using-shared-group-data
         * https://docs.microsoft.com/rest/api/playfab/client/shared-group-data/removesharedgroupmembers
         */
        RemoveSharedGroupMembers(request: PlayFabClientModels.RemoveSharedGroupMembersRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RemoveSharedGroupMembersResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RemoveSharedGroupMembersResult>>;
        /**
         * Report player's ad activity
         * https://docs.microsoft.com/rest/api/playfab/client/advertising/reportadactivity
         */
        ReportAdActivity(request: PlayFabClientModels.ReportAdActivityRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ReportAdActivityResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ReportAdActivityResult>>;
        /**
         * Write a PlayStream event to describe the provided player device information. This API method is not designed to be
         * called directly by developers. Each PlayFab client SDK will eventually report this information automatically.
         * https://docs.microsoft.com/rest/api/playfab/client/analytics/reportdeviceinfo
         */
        ReportDeviceInfo(request: PlayFabClientModels.DeviceInfoRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Submit a report for another player (due to bad bahavior, etc.), so that customer service representatives for the title
         * can take action concerning potentially toxic players.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/reportplayer
         */
        ReportPlayer(request: PlayFabClientModels.ReportPlayerClientRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ReportPlayerClientResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ReportPlayerClientResult>>;
        /**
         * Restores all in-app purchases based on the given restore receipt
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/restoreiospurchases
         */
        RestoreIOSPurchases(request: PlayFabClientModels.RestoreIOSPurchasesRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RestoreIOSPurchasesResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RestoreIOSPurchasesResult>>;
        /**
         * Reward player's ad activity
         * https://docs.microsoft.com/rest/api/playfab/client/advertising/rewardadactivity
         */
        RewardAdActivity(request: PlayFabClientModels.RewardAdActivityRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.RewardAdActivityResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.RewardAdActivityResult>>;
        /**
         * Forces an email to be sent to the registered email address for the user's account, with a link allowing the user to
         * change the password.If an account recovery email template ID is provided, an email using the custom email template will
         * be used.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/sendaccountrecoveryemail
         */
        SendAccountRecoveryEmail(request: PlayFabClientModels.SendAccountRecoveryEmailRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.SendAccountRecoveryEmailResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.SendAccountRecoveryEmailResult>>;
        /**
         * Updates the tag list for a specified user in the friend list of the local user
         * https://docs.microsoft.com/rest/api/playfab/client/friend-list-management/setfriendtags
         */
        SetFriendTags(request: PlayFabClientModels.SetFriendTagsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.SetFriendTagsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.SetFriendTagsResult>>;
        /**
         * Sets the player's secret if it is not already set. Player secrets are used to sign API requests. To reset a player's
         * secret use the Admin or Server API method SetPlayerSecret.
         * https://docs.microsoft.com/rest/api/playfab/client/authentication/setplayersecret
         */
        SetPlayerSecret(request: PlayFabClientModels.SetPlayerSecretRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.SetPlayerSecretResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.SetPlayerSecretResult>>;
        /**
         * Creates an order for a list of items from the title catalog
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/startpurchase
         */
        StartPurchase(request: PlayFabClientModels.StartPurchaseRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.StartPurchaseResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.StartPurchaseResult>>;
        /**
         * Decrements the user's balance of the specified virtual currency by the stated amount. It is possible to make a VC
         * balance negative with this API.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/subtractuservirtualcurrency
         */
        SubtractUserVirtualCurrency(request: PlayFabClientModels.SubtractUserVirtualCurrencyRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ModifyUserVirtualCurrencyResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ModifyUserVirtualCurrencyResult>>;
        /**
         * Unlinks the related Android device identifier from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkandroiddeviceid
         */
        UnlinkAndroidDeviceID(request: PlayFabClientModels.UnlinkAndroidDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkAndroidDeviceIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkAndroidDeviceIDResult>>;
        /**
         * Unlinks the related Apple account from the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkapple
         */
        UnlinkApple(request: PlayFabClientModels.UnlinkAppleRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Unlinks the related custom identifier from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkcustomid
         */
        UnlinkCustomID(request: PlayFabClientModels.UnlinkCustomIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkCustomIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkCustomIDResult>>;
        /**
         * Unlinks the related Facebook account from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkfacebookaccount
         */
        UnlinkFacebookAccount(request: PlayFabClientModels.UnlinkFacebookAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkFacebookAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkFacebookAccountResult>>;
        /**
         * Unlinks the related Facebook Instant Game Ids from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkfacebookinstantgamesid
         */
        UnlinkFacebookInstantGamesId(request: PlayFabClientModels.UnlinkFacebookInstantGamesIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkFacebookInstantGamesIdResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkFacebookInstantGamesIdResult>>;
        /**
         * Unlinks the related Game Center account from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkgamecenteraccount
         */
        UnlinkGameCenterAccount(request: PlayFabClientModels.UnlinkGameCenterAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGameCenterAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGameCenterAccountResult>>;
        /**
         * Unlinks the related Google account from the user's PlayFab account
         * (https://developers.google.com/android/reference/com/google/android/gms/auth/GoogleAuthUtil#public-methods).
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkgoogleaccount
         */
        UnlinkGoogleAccount(request: PlayFabClientModels.UnlinkGoogleAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGoogleAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGoogleAccountResult>>;
        /**
         * Unlinks the related Google Play Games account from the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkgoogleplaygamesservicesaccount
         */
        UnlinkGooglePlayGamesServicesAccount(request: PlayFabClientModels.UnlinkGooglePlayGamesServicesAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGooglePlayGamesServicesAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkGooglePlayGamesServicesAccountResult>>;
        /**
         * Unlinks the related iOS device identifier from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkiosdeviceid
         */
        UnlinkIOSDeviceID(request: PlayFabClientModels.UnlinkIOSDeviceIDRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkIOSDeviceIDResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkIOSDeviceIDResult>>;
        /**
         * Unlinks the related Kongregate identifier from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkkongregate
         */
        UnlinkKongregate(request: PlayFabClientModels.UnlinkKongregateAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkKongregateAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkKongregateAccountResult>>;
        /**
         * Unlinks the related Nintendo account from the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinknintendoserviceaccount
         */
        UnlinkNintendoServiceAccount(request: PlayFabClientModels.UnlinkNintendoServiceAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Unlinks the related NintendoSwitchDeviceId from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinknintendoswitchdeviceid
         */
        UnlinkNintendoSwitchDeviceId(request: PlayFabClientModels.UnlinkNintendoSwitchDeviceIdRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkNintendoSwitchDeviceIdResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkNintendoSwitchDeviceIdResult>>;
        /**
         * Unlinks an OpenID Connect account from a user's PlayFab account, based on the connection ID of an existing relationship
         * between a title and an Open ID Connect provider.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkopenidconnect
         */
        UnlinkOpenIdConnect(request: PlayFabClientModels.UnlinkOpenIdConnectRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Unlinks the related PlayStation :tm: Network account from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkpsnaccount
         */
        UnlinkPSNAccount(request: PlayFabClientModels.UnlinkPSNAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkPSNAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkPSNAccountResult>>;
        /**
         * Unlinks the related Steam account from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinksteamaccount
         */
        UnlinkSteamAccount(request: PlayFabClientModels.UnlinkSteamAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkSteamAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkSteamAccountResult>>;
        /**
         * Unlinks the related Twitch account from the user's PlayFab account.
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinktwitch
         */
        UnlinkTwitch(request: PlayFabClientModels.UnlinkTwitchAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkTwitchAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkTwitchAccountResult>>;
        /**
         * Unlinks the related Xbox Live account from the user's PlayFab account
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/unlinkxboxaccount
         */
        UnlinkXboxAccount(request: PlayFabClientModels.UnlinkXboxAccountRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkXboxAccountResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlinkXboxAccountResult>>;
        /**
         * Opens the specified container, with the specified key (when required), and returns the contents of the opened container.
         * If the container (and key when relevant) are consumable (RemainingUses > 0), their RemainingUses will be decremented,
         * consistent with the operation of ConsumeItem.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/unlockcontainerinstance
         */
        UnlockContainerInstance(request: PlayFabClientModels.UnlockContainerInstanceRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlockContainerItemResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlockContainerItemResult>>;
        /**
         * Searches target inventory for an ItemInstance matching the given CatalogItemId, if necessary unlocks it using an
         * appropriate key, and returns the contents of the opened container. If the container (and key when relevant) are
         * consumable (RemainingUses > 0), their RemainingUses will be decremented, consistent with the operation of ConsumeItem.
         * https://docs.microsoft.com/rest/api/playfab/client/player-item-management/unlockcontaineritem
         */
        UnlockContainerItem(request: PlayFabClientModels.UnlockContainerItemRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UnlockContainerItemResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UnlockContainerItemResult>>;
        /**
         * Update the avatar URL of the player
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/updateavatarurl
         */
        UpdateAvatarUrl(request: PlayFabClientModels.UpdateAvatarUrlRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.EmptyResponse>>;
        /**
         * Creates and updates the title-specific custom data for the user's character which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/character-data/updatecharacterdata
         */
        UpdateCharacterData(request: PlayFabClientModels.UpdateCharacterDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateCharacterDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateCharacterDataResult>>;
        /**
         * Updates the values of the specified title-specific statistics for the specific character. By default, clients are not
         * permitted to update statistics. Developers may override this setting in the Game Manager > Settings > API Features.
         * https://docs.microsoft.com/rest/api/playfab/client/characters/updatecharacterstatistics
         */
        UpdateCharacterStatistics(request: PlayFabClientModels.UpdateCharacterStatisticsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateCharacterStatisticsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateCharacterStatisticsResult>>;
        /**
         * Updates the values of the specified title-specific statistics for the user. By default, clients are not permitted to
         * update statistics. Developers may override this setting in the Game Manager > Settings > API Features.
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/updateplayerstatistics
         */
        UpdatePlayerStatistics(request: PlayFabClientModels.UpdatePlayerStatisticsRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdatePlayerStatisticsResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdatePlayerStatisticsResult>>;
        /**
         * Adds, updates, and removes data keys for a shared group object. If the permission is set to Public, all fields updated
         * or added in this call will be readable by users not in the group. By default, data permissions are set to Private.
         * Regardless of the permission setting, only members of the group can update the data. Shared Groups are designed for
         * sharing data between a very small number of players, please see our guide:
         * https://docs.microsoft.com/gaming/playfab/features/social/groups/using-shared-group-data
         * https://docs.microsoft.com/rest/api/playfab/client/shared-group-data/updatesharedgroupdata
         */
        UpdateSharedGroupData(request: PlayFabClientModels.UpdateSharedGroupDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateSharedGroupDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateSharedGroupDataResult>>;
        /**
         * Creates and updates the title-specific custom data for the user which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/updateuserdata
         */
        UpdateUserData(request: PlayFabClientModels.UpdateUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserDataResult>>;
        /**
         * Creates and updates the publisher-specific custom data for the user which is readable and writable by the client
         * https://docs.microsoft.com/rest/api/playfab/client/player-data-management/updateuserpublisherdata
         */
        UpdateUserPublisherData(request: PlayFabClientModels.UpdateUserDataRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserDataResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserDataResult>>;
        /**
         * Updates the title specific display name for the user
         * https://docs.microsoft.com/rest/api/playfab/client/account-management/updateusertitledisplayname
         */
        UpdateUserTitleDisplayName(request: PlayFabClientModels.UpdateUserTitleDisplayNameRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserTitleDisplayNameResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.UpdateUserTitleDisplayNameResult>>;
        /**
         * Validates with Amazon that the receipt for an Amazon App Store in-app purchase is valid and that it matches the
         * purchased catalog item
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/validateamazoniapreceipt
         */
        ValidateAmazonIAPReceipt(request: PlayFabClientModels.ValidateAmazonReceiptRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ValidateAmazonReceiptResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ValidateAmazonReceiptResult>>;
        /**
         * Validates a Google Play purchase and gives the corresponding item to the player.
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/validategoogleplaypurchase
         */
        ValidateGooglePlayPurchase(request: PlayFabClientModels.ValidateGooglePlayPurchaseRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ValidateGooglePlayPurchaseResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ValidateGooglePlayPurchaseResult>>;
        /**
         * Validates with the Apple store that the receipt for an iOS in-app purchase is valid and that it matches the purchased
         * catalog item
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/validateiosreceipt
         */
        ValidateIOSReceipt(request: PlayFabClientModels.ValidateIOSReceiptRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ValidateIOSReceiptResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ValidateIOSReceiptResult>>;
        /**
         * Validates with Windows that the receipt for an Windows App Store in-app purchase is valid and that it matches the
         * purchased catalog item
         * https://docs.microsoft.com/rest/api/playfab/client/platform-specific-methods/validatewindowsstorereceipt
         */
        ValidateWindowsStoreReceipt(request: PlayFabClientModels.ValidateWindowsReceiptRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.ValidateWindowsReceiptResult>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.ValidateWindowsReceiptResult>>;
        /**
         * Writes a character-based event into PlayStream.
         * https://docs.microsoft.com/rest/api/playfab/client/analytics/writecharacterevent
         */
        WriteCharacterEvent(request: PlayFabClientModels.WriteClientCharacterEventRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>>;
        /**
         * Writes a player-based event into PlayStream.
         * https://docs.microsoft.com/rest/api/playfab/client/analytics/writeplayerevent
         */
        WritePlayerEvent(request: PlayFabClientModels.WriteClientPlayerEventRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>>;
        /**
         * Writes a title-based event into PlayStream.
         * https://docs.microsoft.com/rest/api/playfab/client/analytics/writetitleevent
         */
        WriteTitleEvent(request: PlayFabClientModels.WriteTitleEventRequest, callback: PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>, customData?: any, extraHeaders?: { [key: string]: string }): Promise<PlayFabModule.ApiCallback<PlayFabClientModels.WriteEventResponse>>;

    }
}

declare module PlayFabClientModels {
    export interface AcceptTradeRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Items from the accepting player's inventory in exchange for the offered items in the trade. In the case of a gift, this
         * will be null.
         */
        AcceptedInventoryInstanceIds?: string[];
        /** Player who opened the trade. */
        OfferingPlayerId: string;
        /** Trade identifier. */
        TradeId: string;

    }

    export interface AcceptTradeResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** Details about trade which was just accepted. */
        Trade?: TradeInfo;

    }

    type AdActivity = "Opened"

        | "Closed"
        | "Start"
        | "End";

    export interface AdCampaignAttributionModel {
        /** UTC time stamp of attribution */
        AttributedAt: string;
        /** Attribution campaign identifier */
        CampaignId?: string;
        /** Attribution network name */
        Platform?: string;

    }

    export interface AddFriendRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Email address of the user to attempt to add to the local user's friend list. */
        FriendEmail?: string;
        /** PlayFab identifier of the user to attempt to add to the local user's friend list. */
        FriendPlayFabId?: string;
        /** Title-specific display name of the user to attempt to add to the local user's friend list. */
        FriendTitleDisplayName?: string;
        /** PlayFab username of the user to attempt to add to the local user's friend list. */
        FriendUsername?: string;

    }

    export interface AddFriendResult extends PlayFabModule.IPlayFabResultCommon  {
        /** True if the friend request was processed successfully. */
        Created: boolean;

    }

    export interface AddGenericIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Generic service identifier to add to the player account. */
        GenericId: GenericServiceId;

    }

    export interface AddGenericIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface AddOrUpdateContactEmailRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** The new contact email to associate with the player. */
        EmailAddress: string;

    }

    export interface AddOrUpdateContactEmailResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface AddSharedGroupMembersRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** An array of unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabIds: string[];
        /** Unique identifier for the shared group. */
        SharedGroupId: string;

    }

    export interface AddSharedGroupMembersResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface AddUsernamePasswordRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** User email address attached to their account */
        Email: string;
        /** Password for the PlayFab account (6-100 characters) */
        Password: string;
        /** PlayFab username for the account (3-20 characters) */
        Username: string;

    }

    export interface AddUsernamePasswordResult extends PlayFabModule.IPlayFabResultCommon  {
        /** PlayFab unique user name. */
        Username?: string;

    }

    export interface AddUserVirtualCurrencyRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Amount to be added to the user balance of the specified virtual currency. */
        Amount: number;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Name of the virtual currency which is to be incremented. */
        VirtualCurrency: string;

    }

    export interface AdPlacementDetails {
        /** Placement unique ID */
        PlacementId?: string;
        /** Placement name */
        PlacementName?: string;
        /** If placement has viewing limits indicates how many views are left */
        PlacementViewsRemaining?: number;
        /** If placement has viewing limits indicates when they will next reset */
        PlacementViewsResetMinutes?: number;
        /** Optional URL to a reward asset */
        RewardAssetUrl?: string;
        /** Reward description */
        RewardDescription?: string;
        /** Reward unique ID */
        RewardId?: string;
        /** Reward name */
        RewardName?: string;

    }

    export interface AdRewardItemGranted {
        /** Catalog ID */
        CatalogId?: string;
        /** Catalog item display name */
        DisplayName?: string;
        /** Inventory instance ID */
        InstanceId?: string;
        /** Item ID */
        ItemId?: string;

    }

    export interface AdRewardResults {
        /** Array of the items granted to the player */
        GrantedItems?: AdRewardItemGranted[];
        /** Dictionary of virtual currencies that were granted to the player */
        GrantedVirtualCurrencies?: { [key: string]: number };
        /** Dictionary of statistics that were modified for the player */
        IncrementedStatistics?: { [key: string]: number };

    }

    export interface AndroidDevicePushNotificationRegistrationRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Message to display when confirming push notification. */
        ConfirmationMessage?: string;
        /**
         * Registration ID provided by the Google Cloud Messaging service when the title registered to receive push notifications
         * (see the GCM documentation, here: http://developer.android.com/google/gcm/client.html).
         */
        DeviceToken: string;
        /** If true, send a test push message immediately after sucessful registration. Defaults to false. */
        SendPushNotificationConfirmation?: boolean;

    }

    export interface AndroidDevicePushNotificationRegistrationResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface AttributeInstallRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The adid for this device. */
        Adid?: string;
        /** The IdentifierForAdvertisers for iOS Devices. */
        Idfa?: string;

    }

    export interface AttributeInstallResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface CancelTradeRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Trade identifier. */
        TradeId: string;

    }

    export interface CancelTradeResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** Details about trade which was just canceled. */
        Trade?: TradeInfo;

    }

    export interface CartItem {
        /** Description of the catalog item. */
        Description?: string;
        /** Display name for the catalog item. */
        DisplayName?: string;
        /** Class name to which catalog item belongs. */
        ItemClass?: string;
        /** Unique identifier for the catalog item. */
        ItemId?: string;
        /** Unique instance identifier for this catalog item. */
        ItemInstanceId?: string;
        /** Cost of the catalog item for each applicable real world currency. */
        RealCurrencyPrices?: { [key: string]: number };
        /** Amount of each applicable virtual currency which will be received as a result of purchasing this catalog item. */
        VCAmount?: { [key: string]: number };
        /** Cost of the catalog item for each applicable virtual currency. */
        VirtualCurrencyPrices?: { [key: string]: number };

    }

    export interface CatalogItem {
        /**
         * defines the bundle properties for the item - bundles are items which contain other items, including random drop tables
         * and virtual currencies
         */
        Bundle?: CatalogItemBundleInfo;
        /** if true, then an item instance of this type can be used to grant a character to a user. */
        CanBecomeCharacter: boolean;
        /** catalog version for this item */
        CatalogVersion?: string;
        /** defines the consumable properties (number of uses, timeout) for the item */
        Consumable?: CatalogItemConsumableInfo;
        /**
         * defines the container properties for the item - what items it contains, including random drop tables and virtual
         * currencies, and what item (if any) is required to open it via the UnlockContainerItem API
         */
        Container?: CatalogItemContainerInfo;
        /** game specific custom data */
        CustomData?: string;
        /** text description of item, to show in-game */
        Description?: string;
        /** text name for the item, to show in-game */
        DisplayName?: string;
        /**
         * If the item has IsLImitedEdition set to true, and this is the first time this ItemId has been defined as a limited
         * edition item, this value determines the total number of instances to allocate for the title. Once this limit has been
         * reached, no more instances of this ItemId can be created, and attempts to purchase or grant it will return a Result of
         * false for that ItemId. If the item has already been defined to have a limited edition count, or if this value is less
         * than zero, it will be ignored.
         */
        InitialLimitedEditionCount: number;
        /** BETA: If true, then only a fixed number can ever be granted. */
        IsLimitedEdition: boolean;
        /**
         * if true, then only one item instance of this type will exist and its remaininguses will be incremented instead.
         * RemainingUses will cap out at Int32.Max (2,147,483,647). All subsequent increases will be discarded
         */
        IsStackable: boolean;
        /** if true, then an item instance of this type can be traded between players using the trading APIs */
        IsTradable: boolean;
        /** class to which the item belongs */
        ItemClass?: string;
        /** unique identifier for this item */
        ItemId: string;
        /**
         * URL to the item image. For Facebook purchase to display the image on the item purchase page, this must be set to an HTTP
         * URL.
         */
        ItemImageUrl?: string;
        /** override prices for this item for specific currencies */
        RealCurrencyPrices?: { [key: string]: number };
        /** list of item tags */
        Tags?: string[];
        /** price of this item in virtual currencies and "RM" (the base Real Money purchase price, in USD pennies) */
        VirtualCurrencyPrices?: { [key: string]: number };

    }

    export interface CatalogItemBundleInfo {
        /** unique ItemId values for all items which will be added to the player inventory when the bundle is added */
        BundledItems?: string[];
        /**
         * unique TableId values for all RandomResultTable objects which are part of the bundle (random tables will be resolved and
         * add the relevant items to the player inventory when the bundle is added)
         */
        BundledResultTables?: string[];
        /** virtual currency types and balances which will be added to the player inventory when the bundle is added */
        BundledVirtualCurrencies?: { [key: string]: number };

    }

    export interface CatalogItemConsumableInfo {
        /** number of times this object can be used, after which it will be removed from the player inventory */
        UsageCount?: number;
        /**
         * duration in seconds for how long the item will remain in the player inventory - once elapsed, the item will be removed
         * (recommended minimum value is 5 seconds, as lower values can cause the item to expire before operations depending on
         * this item's details have completed)
         */
        UsagePeriod?: number;
        /**
         * all inventory item instances in the player inventory sharing a non-null UsagePeriodGroup have their UsagePeriod values
         * added together, and share the result - when that period has elapsed, all the items in the group will be removed
         */
        UsagePeriodGroup?: string;

    }

    export interface CatalogItemContainerInfo {
        /** unique ItemId values for all items which will be added to the player inventory, once the container has been unlocked */
        ItemContents?: string[];
        /**
         * ItemId for the catalog item used to unlock the container, if any (if not specified, a call to UnlockContainerItem will
         * open the container, adding the contents to the player inventory and currency balances)
         */
        KeyItemId?: string;
        /**
         * unique TableId values for all RandomResultTable objects which are part of the container (once unlocked, random tables
         * will be resolved and add the relevant items to the player inventory)
         */
        ResultTableContents?: string[];
        /** virtual currency types and balances which will be added to the player inventory when the container is unlocked */
        VirtualCurrencyContents?: { [key: string]: number };

    }

    export interface CharacterInventory {
        /** The id of this character. */
        CharacterId?: string;
        /** The inventory of this character. */
        Inventory?: ItemInstance[];

    }

    export interface CharacterLeaderboardEntry {
        /** PlayFab unique identifier of the character that belongs to the user for this leaderboard entry. */
        CharacterId?: string;
        /** Title-specific display name of the character for this leaderboard entry. */
        CharacterName?: string;
        /** Name of the character class for this entry. */
        CharacterType?: string;
        /** Title-specific display name of the user for this leaderboard entry. */
        DisplayName?: string;
        /** PlayFab unique identifier of the user for this leaderboard entry. */
        PlayFabId?: string;
        /** User's overall position in the leaderboard. */
        Position: number;
        /** Specific value of the user's statistic. */
        StatValue: number;

    }

    export interface CharacterResult {
        /** The id for this character on this player. */
        CharacterId?: string;
        /** The name of this character. */
        CharacterName?: string;
        /** The type-string that was given to this character on creation. */
        CharacterType?: string;

    }

    type CloudScriptRevisionOption = "Live"

        | "Latest"
        | "Specific";

    export interface CollectionFilter {
        /** List of Exclude rules, with any of which if a collection matches, it is excluded by the filter. */
        Excludes?: Container_Dictionary_String_String[];
        /**
         * List of Include rules, with any of which if a collection matches, it is included by the filter, unless it is excluded by
         * one of the Exclude rule
         */
        Includes?: Container_Dictionary_String_String[];

    }

    export interface ConfirmPurchaseRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Purchase order identifier returned from StartPurchase. */
        OrderId: string;

    }

    export interface ConfirmPurchaseResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of items purchased. */
        Items?: ItemInstance[];
        /** Purchase order identifier. */
        OrderId?: string;
        /** Date and time of the purchase. */
        PurchaseDate: string;

    }

    export interface ConsumeItemRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId?: string;
        /** Number of uses to consume from the item. */
        ConsumeCount: number;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Unique instance identifier of the item to be consumed. */
        ItemInstanceId: string;

    }

    export interface ConsumeItemResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique instance identifier of the item with uses consumed. */
        ItemInstanceId?: string;
        /** Number of uses remaining on the item. */
        RemainingUses: number;

    }

    export interface ConsumeMicrosoftStoreEntitlementsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version to use */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Marketplace specific payload containing details to fetch in app purchase transactions */
        MarketplaceSpecificData: MicrosoftStorePayload;

    }

    export interface ConsumeMicrosoftStoreEntitlementsResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** Details for the items purchased. */
        Items?: ItemInstance[];

    }

    export interface ConsumePS5EntitlementsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version to use */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Marketplace specific payload containing details to fetch in app purchase transactions */
        MarketplaceSpecificData: PlayStation5Payload;

    }

    export interface ConsumePS5EntitlementsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Details for the items purchased. */
        Items?: ItemInstance[];

    }

    export interface ConsumePSNEntitlementsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Which catalog to match granted entitlements against. If null, defaults to title default catalog */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Id of the PlayStation :tm: Network service label to consume entitlements from */
        ServiceLabel: number;

    }

    export interface ConsumePSNEntitlementsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of items granted to the player as a result of consuming entitlements. */
        ItemsGranted?: ItemInstance[];

    }

    export interface ConsumeXboxEntitlementsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version to use */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Token provided by the Xbox Live SDK/XDK method GetTokenAndSignatureAsync("POST", "https://playfabapi.com/", ""). */
        XboxToken: string;

    }

    export interface ConsumeXboxEntitlementsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Details for the items purchased. */
        Items?: ItemInstance[];

    }

    export interface ContactEmailInfoModel {
        /** The email address */
        EmailAddress?: string;
        /** The name of the email info data */
        Name?: string;
        /** The verification status of the email */
        VerificationStatus?: string;

    }

    export interface Container_Dictionary_String_String {
        /** Content of data */
        Data?: { [key: string]: string | null };

    }

    type ContinentCode = "AF"

        | "AN"
        | "AS"
        | "EU"
        | "NA"
        | "OC"
        | "SA";

    type CountryCode = "AF"

        | "AX"
        | "AL"
        | "DZ"
        | "AS"
        | "AD"
        | "AO"
        | "AI"
        | "AQ"
        | "AG"
        | "AR"
        | "AM"
        | "AW"
        | "AU"
        | "AT"
        | "AZ"
        | "BS"
        | "BH"
        | "BD"
        | "BB"
        | "BY"
        | "BE"
        | "BZ"
        | "BJ"
        | "BM"
        | "BT"
        | "BO"
        | "BQ"
        | "BA"
        | "BW"
        | "BV"
        | "BR"
        | "IO"
        | "BN"
        | "BG"
        | "BF"
        | "BI"
        | "KH"
        | "CM"
        | "CA"
        | "CV"
        | "KY"
        | "CF"
        | "TD"
        | "CL"
        | "CN"
        | "CX"
        | "CC"
        | "CO"
        | "KM"
        | "CG"
        | "CD"
        | "CK"
        | "CR"
        | "CI"
        | "HR"
        | "CU"
        | "CW"
        | "CY"
        | "CZ"
        | "DK"
        | "DJ"
        | "DM"
        | "DO"
        | "EC"
        | "EG"
        | "SV"
        | "GQ"
        | "ER"
        | "EE"
        | "ET"
        | "FK"
        | "FO"
        | "FJ"
        | "FI"
        | "FR"
        | "GF"
        | "PF"
        | "TF"
        | "GA"
        | "GM"
        | "GE"
        | "DE"
        | "GH"
        | "GI"
        | "GR"
        | "GL"
        | "GD"
        | "GP"
        | "GU"
        | "GT"
        | "GG"
        | "GN"
        | "GW"
        | "GY"
        | "HT"
        | "HM"
        | "VA"
        | "HN"
        | "HK"
        | "HU"
        | "IS"
        | "IN"
        | "ID"
        | "IR"
        | "IQ"
        | "IE"
        | "IM"
        | "IL"
        | "IT"
        | "JM"
        | "JP"
        | "JE"
        | "JO"
        | "KZ"
        | "KE"
        | "KI"
        | "KP"
        | "KR"
        | "KW"
        | "KG"
        | "LA"
        | "LV"
        | "LB"
        | "LS"
        | "LR"
        | "LY"
        | "LI"
        | "LT"
        | "LU"
        | "MO"
        | "MK"
        | "MG"
        | "MW"
        | "MY"
        | "MV"
        | "ML"
        | "MT"
        | "MH"
        | "MQ"
        | "MR"
        | "MU"
        | "YT"
        | "MX"
        | "FM"
        | "MD"
        | "MC"
        | "MN"
        | "ME"
        | "MS"
        | "MA"
        | "MZ"
        | "MM"
        | "NA"
        | "NR"
        | "NP"
        | "NL"
        | "NC"
        | "NZ"
        | "NI"
        | "NE"
        | "NG"
        | "NU"
        | "NF"
        | "MP"
        | "NO"
        | "OM"
        | "PK"
        | "PW"
        | "PS"
        | "PA"
        | "PG"
        | "PY"
        | "PE"
        | "PH"
        | "PN"
        | "PL"
        | "PT"
        | "PR"
        | "QA"
        | "RE"
        | "RO"
        | "RU"
        | "RW"
        | "BL"
        | "SH"
        | "KN"
        | "LC"
        | "MF"
        | "PM"
        | "VC"
        | "WS"
        | "SM"
        | "ST"
        | "SA"
        | "SN"
        | "RS"
        | "SC"
        | "SL"
        | "SG"
        | "SX"
        | "SK"
        | "SI"
        | "SB"
        | "SO"
        | "ZA"
        | "GS"
        | "SS"
        | "ES"
        | "LK"
        | "SD"
        | "SR"
        | "SJ"
        | "SZ"
        | "SE"
        | "CH"
        | "SY"
        | "TW"
        | "TJ"
        | "TZ"
        | "TH"
        | "TL"
        | "TG"
        | "TK"
        | "TO"
        | "TT"
        | "TN"
        | "TR"
        | "TM"
        | "TC"
        | "TV"
        | "UG"
        | "UA"
        | "AE"
        | "GB"
        | "US"
        | "UM"
        | "UY"
        | "UZ"
        | "VU"
        | "VE"
        | "VN"
        | "VG"
        | "VI"
        | "WF"
        | "EH"
        | "YE"
        | "ZM"
        | "ZW";

    export interface CreateSharedGroupRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique identifier for the shared group (a random identifier will be assigned, if one is not specified). */
        SharedGroupId?: string;

    }

    export interface CreateSharedGroupResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique identifier for the shared group. */
        SharedGroupId?: string;

    }

    type Currency = "AED"

        | "AFN"
        | "ALL"
        | "AMD"
        | "ANG"
        | "AOA"
        | "ARS"
        | "AUD"
        | "AWG"
        | "AZN"
        | "BAM"
        | "BBD"
        | "BDT"
        | "BGN"
        | "BHD"
        | "BIF"
        | "BMD"
        | "BND"
        | "BOB"
        | "BRL"
        | "BSD"
        | "BTN"
        | "BWP"
        | "BYR"
        | "BZD"
        | "CAD"
        | "CDF"
        | "CHF"
        | "CLP"
        | "CNY"
        | "COP"
        | "CRC"
        | "CUC"
        | "CUP"
        | "CVE"
        | "CZK"
        | "DJF"
        | "DKK"
        | "DOP"
        | "DZD"
        | "EGP"
        | "ERN"
        | "ETB"
        | "EUR"
        | "FJD"
        | "FKP"
        | "GBP"
        | "GEL"
        | "GGP"
        | "GHS"
        | "GIP"
        | "GMD"
        | "GNF"
        | "GTQ"
        | "GYD"
        | "HKD"
        | "HNL"
        | "HRK"
        | "HTG"
        | "HUF"
        | "IDR"
        | "ILS"
        | "IMP"
        | "INR"
        | "IQD"
        | "IRR"
        | "ISK"
        | "JEP"
        | "JMD"
        | "JOD"
        | "JPY"
        | "KES"
        | "KGS"
        | "KHR"
        | "KMF"
        | "KPW"
        | "KRW"
        | "KWD"
        | "KYD"
        | "KZT"
        | "LAK"
        | "LBP"
        | "LKR"
        | "LRD"
        | "LSL"
        | "LYD"
        | "MAD"
        | "MDL"
        | "MGA"
        | "MKD"
        | "MMK"
        | "MNT"
        | "MOP"
        | "MRO"
        | "MUR"
        | "MVR"
        | "MWK"
        | "MXN"
        | "MYR"
        | "MZN"
        | "NAD"
        | "NGN"
        | "NIO"
        | "NOK"
        | "NPR"
        | "NZD"
        | "OMR"
        | "PAB"
        | "PEN"
        | "PGK"
        | "PHP"
        | "PKR"
        | "PLN"
        | "PYG"
        | "QAR"
        | "RON"
        | "RSD"
        | "RUB"
        | "RWF"
        | "SAR"
        | "SBD"
        | "SCR"
        | "SDG"
        | "SEK"
        | "SGD"
        | "SHP"
        | "SLL"
        | "SOS"
        | "SPL"
        | "SRD"
        | "STD"
        | "SVC"
        | "SYP"
        | "SZL"
        | "THB"
        | "TJS"
        | "TMT"
        | "TND"
        | "TOP"
        | "TRY"
        | "TTD"
        | "TVD"
        | "TWD"
        | "TZS"
        | "UAH"
        | "UGX"
        | "USD"
        | "UYU"
        | "UZS"
        | "VEF"
        | "VND"
        | "VUV"
        | "WST"
        | "XAF"
        | "XCD"
        | "XDR"
        | "XOF"
        | "XPF"
        | "YER"
        | "ZAR"
        | "ZMW"
        | "ZWD";

    export interface CurrentGamesRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Build to match against. */
        BuildVersion?: string;
        /** Game mode to look for. */
        GameMode?: string;
        /** Region to check for Game Server Instances. */
        Region?: string;
        /** Statistic name to find statistic-based matches. */
        StatisticName?: string;
        /** Filter to include and/or exclude Game Server Instances associated with certain tags. */
        TagFilter?: CollectionFilter;

    }

    export interface CurrentGamesResult extends PlayFabModule.IPlayFabResultCommon  {
        /** number of games running */
        GameCount: number;
        /** array of games found */
        Games?: GameInfo[];
        /** total number of players across all servers */
        PlayerCount: number;

    }

    export interface DeviceInfoRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Information posted to the PlayStream Event. Currently arbitrary, and specific to the environment sending it. */
        Info?: { [key: string]: any };

    }

    type EmailVerificationStatus = "Unverified"

        | "Pending"
        | "Confirmed";

    export interface EmptyResponse extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface EmptyResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface EntityKey {
        /** Unique ID of the entity. */
        Id: string;
        /** Entity type. See https://docs.microsoft.com/gaming/playfab/features/data/entities/available-built-in-entity-types */
        Type?: string;

    }

    export interface EntityTokenResponse {
        /** The entity id and type. */
        Entity?: EntityKey;
        /** The token used to set X-EntityToken for all entity based API calls. */
        EntityToken?: string;
        /** The time the token will expire, if it is an expiring token, in UTC. */
        TokenExpiration?: string;

    }

    export interface ExecuteCloudScriptRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** The name of the CloudScript function to execute */
        FunctionName: string;
        /** Object that is passed in to the function as the first argument */
        FunctionParameter?: any;
        /**
         * Generate a 'player_executed_cloudscript' PlayStream event containing the results of the function execution and other
         * contextual information. This event will show up in the PlayStream debugger console for the player in Game Manager.
         */
        GeneratePlayStreamEvent?: boolean;
        /**
         * Option for which revision of the CloudScript to execute. 'Latest' executes the most recently created revision, 'Live'
         * executes the current live, published revision, and 'Specific' executes the specified revision. The default value is
         * 'Specific', if the SpeificRevision parameter is specified, otherwise it is 'Live'.
         */
        RevisionSelection?: string;
        /** The specivic revision to execute, when RevisionSelection is set to 'Specific' */
        SpecificRevision?: number;

    }

    export interface ExecuteCloudScriptResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Number of PlayFab API requests issued by the CloudScript function */
        APIRequestsIssued: number;
        /** Information about the error, if any, that occurred during execution */
        Error?: ScriptExecutionError;
        ExecutionTimeSeconds: number;
        /** The name of the function that executed */
        FunctionName?: string;
        /** The object returned from the CloudScript function, if any */
        FunctionResult?: any;
        /**
         * Flag indicating if the FunctionResult was too large and was subsequently dropped from this event. This only occurs if
         * the total event size is larger than 350KB.
         */
        FunctionResultTooLarge?: boolean;
        /** Number of external HTTP requests issued by the CloudScript function */
        HttpRequestsIssued: number;
        /**
         * Entries logged during the function execution. These include both entries logged in the function code using log.info()
         * and log.error() and error entries for API and HTTP request failures.
         */
        Logs?: LogStatement[];
        /**
         * Flag indicating if the logs were too large and were subsequently dropped from this event. This only occurs if the total
         * event size is larger than 350KB after the FunctionResult was removed.
         */
        LogsTooLarge?: boolean;
        MemoryConsumedBytes: number;
        /**
         * Processor time consumed while executing the function. This does not include time spent waiting on API calls or HTTP
         * requests.
         */
        ProcessorTimeSeconds: number;
        /** The revision of the CloudScript that executed */
        Revision: number;

    }

    type ExternalFriendSources = "None"

        | "Steam"
        | "Facebook"
        | "Xbox"
        | "Psn"
        | "All";

    export interface FacebookInstantGamesPlayFabIdPair {
        /** Unique Facebook Instant Games identifier for a user. */
        FacebookInstantGamesId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Facebook Instant Games identifier. */
        PlayFabId?: string;

    }

    export interface FacebookPlayFabIdPair {
        /** Unique Facebook identifier for a user. */
        FacebookId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Facebook identifier. */
        PlayFabId?: string;

    }

    export interface FriendInfo {
        /** Available Facebook information (if the user and PlayFab friend are also connected in Facebook). */
        FacebookInfo?: UserFacebookInfo;
        /** PlayFab unique identifier for this friend. */
        FriendPlayFabId?: string;
        /** Available Game Center information (if the user and PlayFab friend are also connected in Game Center). */
        GameCenterInfo?: UserGameCenterInfo;
        /** The profile of the user, if requested. */
        Profile?: PlayerProfileModel;
        /**
         * Available PlayStation :tm: Network information, if the user and PlayFab friend are both connected to PlayStation :tm:
         * Network.
         */
        PSNInfo?: UserPsnInfo;
        /** Available Steam information (if the user and PlayFab friend are also connected in Steam). */
        SteamInfo?: UserSteamInfo;
        /** Tags which have been associated with this friend. */
        Tags?: string[];
        /** Title-specific display name for this friend. */
        TitleDisplayName?: string;
        /** PlayFab unique username for this friend. */
        Username?: string;
        /** Available Xbox information, if the user and PlayFab friend are both connected to Xbox Live. */
        XboxInfo?: UserXboxInfo;

    }

    export interface GameCenterPlayFabIdPair {
        /** Unique Game Center identifier for a user. */
        GameCenterId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Game Center identifier. */
        PlayFabId?: string;

    }

    export interface GameInfo {
        /** build version this server is running */
        BuildVersion?: string;
        /** game mode this server is running */
        GameMode?: string;
        /** game session custom data */
        GameServerData?: string;
        /** game specific string denoting server configuration */
        GameServerStateEnum?: string;
        /** last heartbeat of the game server instance, used in external game server provider mode */
        LastHeartbeat?: string;
        /** unique lobby identifier for this game server */
        LobbyID?: string;
        /** maximum players this server can support */
        MaxPlayers?: number;
        /** array of current player IDs on this server */
        PlayerUserIds?: string[];
        /** region to which this server is associated */
        Region?: string;
        /** duration in seconds this server has been running */
        RunTime: number;
        /** IPV4 address of the server */
        ServerIPV4Address?: string;
        /** IPV6 address of the server */
        ServerIPV6Address?: string;
        /** port number to use for non-http communications with the server */
        ServerPort?: number;
        /** Public DNS name (if any) of the server */
        ServerPublicDNSName?: string;
        /** stastic used to match this game in player statistic matchmaking */
        StatisticName?: string;
        /** game session tags */
        Tags?: { [key: string]: string | null };

    }

    type GameInstanceState = "Open"

        | "Closed";

    export interface GameServerRegionsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** version of game server for which stats are being requested */
        BuildVersion: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface GameServerRegionsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** array of regions found matching the request parameters */
        Regions?: RegionInfo[];

    }

    export interface GenericPlayFabIdPair {
        /** Unique generic service identifier for a user. */
        GenericId?: GenericServiceId;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the given generic identifier. */
        PlayFabId?: string;

    }

    export interface GenericServiceId {
        /** Name of the service for which the player has a unique identifier. */
        ServiceName: string;
        /** Unique identifier of the player in that service. */
        UserId: string;

    }

    export interface GetAccountInfoRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** User email address for the account to find (if no Username is specified). */
        Email?: string;
        /**
         * Unique PlayFab identifier of the user whose info is being requested. Optional, defaults to the authenticated user if no
         * other lookup identifier set.
         */
        PlayFabId?: string;
        /**
         * Title-specific username for the account to find (if no Email is set). Note that if the non-unique Title Display Names
         * option is enabled for the title, attempts to look up users by Title Display Name will always return AccountNotFound.
         */
        TitleDisplayName?: string;
        /** PlayFab Username for the account to find (if no PlayFabId is specified). */
        Username?: string;

    }

    export interface GetAccountInfoResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Account information for the local user. */
        AccountInfo?: UserAccountInfo;

    }

    export interface GetAdPlacementsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The current AppId to use */
        AppId: string;
        /** Using the name or unique identifier, filter the result for get a specific placement. */
        Identifier?: NameIdentifier;

    }

    export interface GetAdPlacementsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of results */
        AdPlacements?: AdPlacementDetails[];

    }

    export interface GetCatalogItemsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Which catalog is being requested. If null, uses the default catalog. */
        CatalogVersion?: string;

    }

    export interface GetCatalogItemsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of items which can be purchased. */
        Catalog?: CatalogItem[];

    }

    export interface GetCharacterDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;
        /**
         * The version that currently exists according to the caller. The call will return the data for all of the keys if the
         * version in the system is greater than this.
         */
        IfChangedFromDataVersion?: number;
        /** Specific keys to search for in the custom user data. */
        Keys?: string[];
        /** Unique PlayFab identifier of the user to load data for. Optional, defaults to yourself if not set. */
        PlayFabId?: string;

    }

    export interface GetCharacterDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId?: string;
        /** User specific data for this title. */
        Data?: { [key: string]: UserDataRecord };
        /**
         * Indicates the current version of the data that has been set. This is incremented with every set call for that type of
         * data (read-only, internal, etc). This version can be provided in Get calls to find updated data.
         */
        DataVersion: number;

    }

    export interface GetCharacterInventoryRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Used to limit results to only those from a specific catalog version. */
        CatalogVersion?: string;
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface GetCharacterInventoryResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique identifier of the character for this inventory. */
        CharacterId?: string;
        /** Array of inventory items belonging to the character. */
        Inventory?: ItemInstance[];
        /** Array of virtual currency balance(s) belonging to the character. */
        VirtualCurrency?: { [key: string]: number };
        /** Array of remaining times and timestamps for virtual currencies. */
        VirtualCurrencyRechargeTimes?: { [key: string]: VirtualCurrencyRechargeTime };

    }

    export interface GetCharacterLeaderboardRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /** First entry in the leaderboard to be retrieved. */
        StartPosition: number;
        /** Unique identifier for the title-specific statistic for the leaderboard. */
        StatisticName: string;

    }

    export interface GetCharacterLeaderboardResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered list of leaderboard entries. */
        Leaderboard?: CharacterLeaderboardEntry[];

    }

    export interface GetCharacterStatisticsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;

    }

    export interface GetCharacterStatisticsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** The requested character statistics. */
        CharacterStatistics?: { [key: string]: number };

    }

    export interface GetContentDownloadUrlRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** HTTP method to fetch item - GET or HEAD. Use HEAD when only fetching metadata. Default is GET. */
        HttpMethod?: string;
        /** Key of the content item to fetch, usually formatted as a path, e.g. images/a.png */
        Key: string;
        /**
         * True to download through CDN. CDN provides higher download bandwidth and lower latency. However, if you want the latest,
         * non-cached version of the content during development, set this to false. Default is true.
         */
        ThruCDN?: boolean;

    }

    export interface GetContentDownloadUrlResult extends PlayFabModule.IPlayFabResultCommon  {
        /** URL for downloading content via HTTP GET or HEAD method. The URL will expire in approximately one hour. */
        URL?: string;

    }

    export interface GetFriendLeaderboardAroundPlayerRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Indicates which other platforms' friends should be included in the response. In HTTP, it is represented as a
         * comma-separated list of platforms.
         */
        ExternalPlatformFriends?: string;
        /** Indicates whether Facebook friends should be included in the response. Default is true. */
        IncludeFacebookFriends?: boolean;
        /** Indicates whether Steam service friends should be included in the response. Default is true. */
        IncludeSteamFriends?: boolean;
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /** PlayFab unique identifier of the user to center the leaderboard around. If null will center on the logged in user. */
        PlayFabId?: string;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Statistic used to rank players for this leaderboard. */
        StatisticName: string;
        /** The version of the leaderboard to get. */
        Version?: number;
        /** Xbox token if Xbox friends should be included. Requires Xbox be configured on PlayFab. */
        XboxToken?: string;

    }

    export interface GetFriendLeaderboardAroundPlayerResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered listing of users and their positions in the requested leaderboard. */
        Leaderboard?: PlayerLeaderboardEntry[];
        /** The time the next scheduled reset will occur. Null if the leaderboard does not reset on a schedule. */
        NextReset?: string;
        /** The version of the leaderboard returned. */
        Version: number;

    }

    export interface GetFriendLeaderboardRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Indicates which other platforms' friends should be included in the response. In HTTP, it is represented as a
         * comma-separated list of platforms.
         */
        ExternalPlatformFriends?: string;
        /** Indicates whether Facebook friends should be included in the response. Default is true. */
        IncludeFacebookFriends?: boolean;
        /** Indicates whether Steam service friends should be included in the response. Default is true. */
        IncludeSteamFriends?: boolean;
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Position in the leaderboard to start this listing (defaults to the first entry). */
        StartPosition: number;
        /** Statistic used to rank friends for this leaderboard. */
        StatisticName: string;
        /** The version of the leaderboard to get. */
        Version?: number;
        /** Xbox token if Xbox friends should be included. Requires Xbox be configured on PlayFab. */
        XboxToken?: string;

    }

    export interface GetFriendsListRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Indicates which other platforms' friends should be included in the response. In HTTP, it is represented as a
         * comma-separated list of platforms.
         */
        ExternalPlatformFriends?: string;
        /** Indicates whether Facebook friends should be included in the response. Default is true. */
        IncludeFacebookFriends?: boolean;
        /** Indicates whether Steam service friends should be included in the response. Default is true. */
        IncludeSteamFriends?: boolean;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Xbox token if Xbox friends should be included. Requires Xbox be configured on PlayFab. */
        XboxToken?: string;

    }

    export interface GetFriendsListResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of friends found. */
        Friends?: FriendInfo[];

    }

    export interface GetLeaderboardAroundCharacterRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character on which to center the leaderboard. */
        CharacterId: string;
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /** Unique identifier for the title-specific statistic for the leaderboard. */
        StatisticName: string;

    }

    export interface GetLeaderboardAroundCharacterResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered list of leaderboard entries. */
        Leaderboard?: CharacterLeaderboardEntry[];

    }

    export interface GetLeaderboardAroundPlayerRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /** PlayFab unique identifier of the user to center the leaderboard around. If null will center on the logged in user. */
        PlayFabId?: string;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Statistic used to rank players for this leaderboard. */
        StatisticName: string;
        /** The version of the leaderboard to get. */
        Version?: number;

    }

    export interface GetLeaderboardAroundPlayerResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered listing of users and their positions in the requested leaderboard. */
        Leaderboard?: PlayerLeaderboardEntry[];
        /** The time the next scheduled reset will occur. Null if the leaderboard does not reset on a schedule. */
        NextReset?: string;
        /** The version of the leaderboard returned. */
        Version: number;

    }

    export interface GetLeaderboardForUsersCharactersRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique identifier for the title-specific statistic for the leaderboard. */
        StatisticName: string;

    }

    export interface GetLeaderboardForUsersCharactersResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered list of leaderboard entries. */
        Leaderboard?: CharacterLeaderboardEntry[];

    }

    export interface GetLeaderboardRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Maximum number of entries to retrieve. Default 10, maximum 100. */
        MaxResultsCount?: number;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Position in the leaderboard to start this listing (defaults to the first entry). */
        StartPosition: number;
        /** Statistic used to rank players for this leaderboard. */
        StatisticName: string;
        /** The version of the leaderboard to get. */
        Version?: number;

    }

    export interface GetLeaderboardResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Ordered listing of users and their positions in the requested leaderboard. */
        Leaderboard?: PlayerLeaderboardEntry[];
        /** The time the next scheduled reset will occur. Null if the leaderboard does not reset on a schedule. */
        NextReset?: string;
        /** The version of the leaderboard returned. */
        Version: number;

    }

    export interface GetPaymentTokenRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The name of service to provide the payment token. Allowed Values are: xsolla */
        TokenProvider: string;

    }

    export interface GetPaymentTokenResult extends PlayFabModule.IPlayFabResultCommon  {
        /** PlayFab's purchase order identifier. */
        OrderId?: string;
        /** The token from provider. */
        ProviderToken?: string;

    }

    export interface GetPhotonAuthenticationTokenRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The Photon applicationId for the game you wish to log into. */
        PhotonApplicationId: string;

    }

    export interface GetPhotonAuthenticationTokenResult extends PlayFabModule.IPlayFabResultCommon  {
        /** The Photon authentication token for this game-session. */
        PhotonCustomAuthenticationToken?: string;

    }

    export interface GetPlayerCombinedInfoRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters: GetPlayerCombinedInfoRequestParams;
        /** PlayFabId of the user whose data will be returned. If not filled included, we return the data for the calling player. */
        PlayFabId?: string;

    }

    export interface GetPlayerCombinedInfoRequestParams {
        /** Whether to get character inventories. Defaults to false. */
        GetCharacterInventories: boolean;
        /** Whether to get the list of characters. Defaults to false. */
        GetCharacterList: boolean;
        /** Whether to get player profile. Defaults to false. Has no effect for a new player. */
        GetPlayerProfile: boolean;
        /** Whether to get player statistics. Defaults to false. */
        GetPlayerStatistics: boolean;
        /** Whether to get title data. Defaults to false. */
        GetTitleData: boolean;
        /** Whether to get the player's account Info. Defaults to false */
        GetUserAccountInfo: boolean;
        /** Whether to get the player's custom data. Defaults to false */
        GetUserData: boolean;
        /** Whether to get the player's inventory. Defaults to false */
        GetUserInventory: boolean;
        /** Whether to get the player's read only data. Defaults to false */
        GetUserReadOnlyData: boolean;
        /** Whether to get the player's virtual currency balances. Defaults to false */
        GetUserVirtualCurrency: boolean;
        /** Specific statistics to retrieve. Leave null to get all keys. Has no effect if GetPlayerStatistics is false */
        PlayerStatisticNames?: string[];
        /** Specifies the properties to return from the player profile. Defaults to returning the player's display name. */
        ProfileConstraints?: PlayerProfileViewConstraints;
        /** Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetTitleData is false */
        TitleDataKeys?: string[];
        /** Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetUserData is false */
        UserDataKeys?: string[];
        /**
         * Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetUserReadOnlyData is
         * false
         */
        UserReadOnlyDataKeys?: string[];

    }

    export interface GetPlayerCombinedInfoResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Results for requested info. */
        InfoResultPayload?: GetPlayerCombinedInfoResultPayload;
        /** Unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabId?: string;

    }

    export interface GetPlayerCombinedInfoResultPayload {
        /** Account information for the user. This is always retrieved. */
        AccountInfo?: UserAccountInfo;
        /** Inventories for each character for the user. */
        CharacterInventories?: CharacterInventory[];
        /** List of characters for the user. */
        CharacterList?: CharacterResult[];
        /**
         * The profile of the players. This profile is not guaranteed to be up-to-date. For a new player, this profile will not
         * exist.
         */
        PlayerProfile?: PlayerProfileModel;
        /** List of statistics for this player. */
        PlayerStatistics?: StatisticValue[];
        /** Title data for this title. */
        TitleData?: { [key: string]: string | null };
        /** User specific custom data. */
        UserData?: { [key: string]: UserDataRecord };
        /** The version of the UserData that was returned. */
        UserDataVersion: number;
        /** Array of inventory items in the user's current inventory. */
        UserInventory?: ItemInstance[];
        /** User specific read-only data. */
        UserReadOnlyData?: { [key: string]: UserDataRecord };
        /** The version of the Read-Only UserData that was returned. */
        UserReadOnlyDataVersion: number;
        /** Dictionary of virtual currency balance(s) belonging to the user. */
        UserVirtualCurrency?: { [key: string]: number };
        /** Dictionary of remaining times and timestamps for virtual currencies. */
        UserVirtualCurrencyRechargeTimes?: { [key: string]: VirtualCurrencyRechargeTime };

    }

    export interface GetPlayerProfileRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabId?: string;
        /**
         * If non-null, this determines which properties of the resulting player profiles to return. For API calls from the client,
         * only the allowed client profile properties for the title may be requested. These allowed properties are configured in
         * the Game Manager "Client Profile Options" tab in the "Settings" section.
         */
        ProfileConstraints?: PlayerProfileViewConstraints;

    }

    export interface GetPlayerProfileResult extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * The profile of the player. This profile is not guaranteed to be up-to-date. For a new player, this profile will not
         * exist.
         */
        PlayerProfile?: PlayerProfileModel;

    }

    export interface GetPlayerSegmentsRequest extends PlayFabModule.IPlayFabRequestCommon {

    }

    export interface GetPlayerSegmentsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of segments the requested player currently belongs to. */
        Segments?: GetSegmentResult[];

    }

    export interface GetPlayerStatisticsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** statistics to return (current version will be returned for each) */
        StatisticNames?: string[];
        /**
         * statistics to return, if StatisticNames is not set (only statistics which have a version matching that provided will be
         * returned)
         */
        StatisticNameVersions?: StatisticNameVersion[];

    }

    export interface GetPlayerStatisticsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** User statistics for the requested user. */
        Statistics?: StatisticValue[];

    }

    export interface GetPlayerStatisticVersionsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** unique name of the statistic */
        StatisticName?: string;

    }

    export interface GetPlayerStatisticVersionsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** version change history of the statistic */
        StatisticVersions?: PlayerStatisticVersion[];

    }

    export interface GetPlayerTagsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Optional namespace to filter results by */
        Namespace?: string;
        /** Unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabId: string;

    }

    export interface GetPlayerTagsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabId: string;
        /** Canonical tags (including namespace and tag's name) for the requested user */
        Tags: string[];

    }

    export interface GetPlayerTradesRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Returns only trades with the given status. If null, returns all trades. */
        StatusFilter?: string;

    }

    export interface GetPlayerTradesResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** History of trades which this player has accepted. */
        AcceptedTrades?: TradeInfo[];
        /** The trades for this player which are currently available to be accepted. */
        OpenedTrades?: TradeInfo[];

    }

    export interface GetPlayFabIDsFromFacebookIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Facebook identifiers for which the title needs to get PlayFab identifiers. The array cannot exceed 2,000
         * in length.
         */
        FacebookIDs: string[];

    }

    export interface GetPlayFabIDsFromFacebookIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Facebook identifiers to PlayFab identifiers. */
        Data?: FacebookPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromFacebookInstantGamesIdsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Facebook Instant Games identifiers for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 25 in length.
         */
        FacebookInstantGamesIds: string[];

    }

    export interface GetPlayFabIDsFromFacebookInstantGamesIdsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Facebook Instant Games identifiers to PlayFab identifiers. */
        Data?: FacebookInstantGamesPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromGameCenterIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Game Center identifiers (the Player Identifier) for which the title needs to get PlayFab identifiers.
         * The array cannot exceed 2,000 in length.
         */
        GameCenterIDs: string[];

    }

    export interface GetPlayFabIDsFromGameCenterIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Game Center identifiers to PlayFab identifiers. */
        Data?: GameCenterPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromGenericIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique generic service identifiers for which the title needs to get PlayFab identifiers. Currently limited to a
         * maximum of 10 in a single request.
         */
        GenericIDs: GenericServiceId[];

    }

    export interface GetPlayFabIDsFromGenericIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of generic service identifiers to PlayFab identifiers. */
        Data?: GenericPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromGoogleIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Google identifiers (Google+ user IDs) for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 2,000 in length.
         */
        GoogleIDs: string[];

    }

    export interface GetPlayFabIDsFromGoogleIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Google identifiers to PlayFab identifiers. */
        Data?: GooglePlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromGooglePlayGamesPlayerIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Google Play Games identifiers (Google+ user IDs) for which the title needs to get PlayFab identifiers.
         * The array cannot exceed 2,000 in length.
         */
        GooglePlayGamesPlayerIDs: string[];

    }

    export interface GetPlayFabIDsFromGooglePlayGamesPlayerIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Google Play Games identifiers to PlayFab identifiers. */
        Data?: GooglePlayGamesPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromKongregateIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Kongregate identifiers (Kongregate's user_id) for which the title needs to get PlayFab identifiers. The
         * array cannot exceed 2,000 in length.
         */
        KongregateIDs: string[];

    }

    export interface GetPlayFabIDsFromKongregateIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Kongregate identifiers to PlayFab identifiers. */
        Data?: KongregatePlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromNintendoServiceAccountIdsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Nintendo Switch Account identifiers for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 2,000 in length.
         */
        NintendoAccountIds: string[];

    }

    export interface GetPlayFabIDsFromNintendoServiceAccountIdsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Nintendo Switch Service Account identifiers to PlayFab identifiers. */
        Data?: NintendoServiceAccountPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromNintendoSwitchDeviceIdsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Nintendo Switch Device identifiers for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 2,000 in length.
         */
        NintendoSwitchDeviceIds: string[];

    }

    export interface GetPlayFabIDsFromNintendoSwitchDeviceIdsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Nintendo Switch Device identifiers to PlayFab identifiers. */
        Data?: NintendoSwitchPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromPSNAccountIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Id of the PlayStation :tm: Network issuer environment. If null, defaults to production environment. */
        IssuerId?: number;
        /**
         * Array of unique PlayStation :tm: Network identifiers for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 2,000 in length.
         */
        PSNAccountIDs: string[];

    }

    export interface GetPlayFabIDsFromPSNAccountIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of PlayStation :tm: Network identifiers to PlayFab identifiers. */
        Data?: PSNAccountPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromSteamIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Steam identifiers (Steam profile IDs) for which the title needs to get PlayFab identifiers. The array
         * cannot exceed 2,000 in length.
         */
        SteamStringIDs?: string[];

    }

    export interface GetPlayFabIDsFromSteamIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Steam identifiers to PlayFab identifiers. */
        Data?: SteamPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromTwitchIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Array of unique Twitch identifiers (Twitch's _id) for which the title needs to get PlayFab identifiers. The array cannot
         * exceed 2,000 in length.
         */
        TwitchIds: string[];

    }

    export interface GetPlayFabIDsFromTwitchIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Twitch identifiers to PlayFab identifiers. */
        Data?: TwitchPlayFabIdPair[];

    }

    export interface GetPlayFabIDsFromXboxLiveIDsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The ID of Xbox Live sandbox. */
        Sandbox?: string;
        /**
         * Array of unique Xbox Live account identifiers for which the title needs to get PlayFab identifiers. The array cannot
         * exceed 2,000 in length.
         */
        XboxLiveAccountIDs: string[];

    }

    export interface GetPlayFabIDsFromXboxLiveIDsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Mapping of Xbox Live identifiers to PlayFab identifiers. */
        Data?: XboxLiveAccountPlayFabIdPair[];

    }

    export interface GetPublisherDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** array of keys to get back data from the Publisher data blob, set by the admin tools */
        Keys: string[];

    }

    export interface GetPublisherDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /** a dictionary object of key / value pairs */
        Data?: { [key: string]: string | null };

    }

    export interface GetPurchaseRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Purchase order identifier. */
        OrderId: string;

    }

    export interface GetPurchaseResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Purchase order identifier. */
        OrderId?: string;
        /** Payment provider used for transaction (If not VC) */
        PaymentProvider?: string;
        /** Date and time of the purchase. */
        PurchaseDate: string;
        /** Provider transaction ID (If not VC) */
        TransactionId?: string;
        /** PlayFab transaction status */
        TransactionStatus?: string;

    }

    export interface GetSegmentResult {
        /** Identifier of the segments AB Test, if it is attached to one. */
        ABTestParent?: string;
        /** Unique identifier for this segment. */
        Id: string;
        /** Segment name. */
        Name?: string;

    }

    export interface GetSharedGroupDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** If true, return the list of all members of the shared group. */
        GetMembers?: boolean;
        /**
         * Specific keys to retrieve from the shared group (if not specified, all keys will be returned, while an empty array
         * indicates that no keys should be returned).
         */
        Keys?: string[];
        /** Unique identifier for the shared group. */
        SharedGroupId: string;

    }

    export interface GetSharedGroupDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Data for the requested keys. */
        Data?: { [key: string]: SharedGroupDataRecord };
        /** List of PlayFabId identifiers for the members of this group, if requested. */
        Members?: string[];

    }

    export interface GetStoreItemsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version to store items from. Use default catalog version if null */
        CatalogVersion?: string;
        /** Unqiue identifier for the store which is being requested. */
        StoreId: string;

    }

    export interface GetStoreItemsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** The base catalog that this store is a part of. */
        CatalogVersion?: string;
        /** Additional data about the store. */
        MarketingData?: StoreMarketingModel;
        /** How the store was last updated (Admin or a third party). */
        Source?: string;
        /** Array of items which can be purchased from this store. */
        Store?: StoreItem[];
        /** The ID of this store. */
        StoreId?: string;

    }

    export interface GetTimeRequest extends PlayFabModule.IPlayFabRequestCommon {

    }

    export interface GetTimeResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Current server time when the request was received, in UTC */
        Time: string;

    }

    export interface GetTitleDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Specific keys to search for in the title data (leave null to get all keys) */
        Keys?: string[];
        /**
         * Optional field that specifies the name of an override. This value is ignored when used by the game client; otherwise,
         * the overrides are applied automatically to the title data.
         */
        OverrideLabel?: string;

    }

    export interface GetTitleDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /** a dictionary object of key / value pairs */
        Data?: { [key: string]: string | null };

    }

    export interface GetTitleNewsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Limits the results to the last n entries. Defaults to 10 if not set. */
        Count?: number;

    }

    export interface GetTitleNewsResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of news items. */
        News?: TitleNewsItem[];

    }

    export interface GetTitlePublicKeyRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId: string;
        /** The shared secret key for this title */
        TitleSharedSecret: string;

    }

    export interface GetTitlePublicKeyResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Base64 encoded RSA CSP byte array blob containing the title's public RSA key */
        RSAPublicKey?: string;

    }

    export interface GetTradeStatusRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Player who opened trade. */
        OfferingPlayerId: string;
        /** Trade identifier as returned by OpenTradeOffer. */
        TradeId: string;

    }

    export interface GetTradeStatusResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** Information about the requested trade. */
        Trade?: TradeInfo;

    }

    export interface GetUserDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * The version that currently exists according to the caller. The call will return the data for all of the keys if the
         * version in the system is greater than this.
         */
        IfChangedFromDataVersion?: number;
        /** List of unique keys to load from. */
        Keys?: string[];
        /**
         * Unique PlayFab identifier of the user to load data for. Optional, defaults to yourself if not set. When specified to a
         * PlayFab id of another player, then this will only return public keys for that account.
         */
        PlayFabId?: string;

    }

    export interface GetUserDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /** User specific data for this title. */
        Data?: { [key: string]: UserDataRecord };
        /**
         * Indicates the current version of the data that has been set. This is incremented with every set call for that type of
         * data (read-only, internal, etc). This version can be provided in Get calls to find updated data.
         */
        DataVersion: number;

    }

    export interface GetUserInventoryRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface GetUserInventoryResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Array of inventory items belonging to the user. */
        Inventory?: ItemInstance[];
        /** Array of virtual currency balance(s) belonging to the user. */
        VirtualCurrency?: { [key: string]: number };
        /** Array of remaining times and timestamps for virtual currencies. */
        VirtualCurrencyRechargeTimes?: { [key: string]: VirtualCurrencyRechargeTime };

    }

    export interface GooglePlayFabIdPair {
        /** Unique Google identifier for a user. */
        GoogleId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Google identifier. */
        PlayFabId?: string;

    }

    export interface GooglePlayGamesPlayFabIdPair {
        /** Unique Google Play Games identifier for a user. */
        GooglePlayGamesPlayerId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Google Play Games identifier. */
        PlayFabId?: string;

    }

    export interface GrantCharacterToUserRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version from which items are to be granted. */
        CatalogVersion?: string;
        /** Non-unique display name of the character being granted (1-40 characters in length). */
        CharacterName: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Catalog item identifier of the item in the user's inventory that corresponds to the character in the catalog to be
         * created.
         */
        ItemId: string;

    }

    export interface GrantCharacterToUserResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Unique identifier tagged to this character. */
        CharacterId?: string;
        /** Type of character that was created. */
        CharacterType?: string;
        /** Indicates whether this character was created successfully. */
        Result: boolean;

    }

    export interface ItemInstance {
        /** Game specific comment associated with this instance when it was added to the user inventory. */
        Annotation?: string;
        /** Array of unique items that were awarded when this catalog item was purchased. */
        BundleContents?: string[];
        /**
         * Unique identifier for the parent inventory item, as defined in the catalog, for object which were added from a bundle or
         * container.
         */
        BundleParent?: string;
        /** Catalog version for the inventory item, when this instance was created. */
        CatalogVersion?: string;
        /**
         * A set of custom key-value pairs on the instance of the inventory item, which is not to be confused with the catalog
         * item's custom data.
         */
        CustomData?: { [key: string]: string | null };
        /** CatalogItem.DisplayName at the time this item was purchased. */
        DisplayName?: string;
        /** Timestamp for when this instance will expire. */
        Expiration?: string;
        /** Class name for the inventory item, as defined in the catalog. */
        ItemClass?: string;
        /** Unique identifier for the inventory item, as defined in the catalog. */
        ItemId?: string;
        /** Unique item identifier for this specific instance of the item. */
        ItemInstanceId?: string;
        /** Timestamp for when this instance was purchased. */
        PurchaseDate?: string;
        /** Total number of remaining uses, if this is a consumable item. */
        RemainingUses?: number;
        /** Currency type for the cost of the catalog item. Not available when granting items. */
        UnitCurrency?: string;
        /** Cost of the catalog item in the given currency. Not available when granting items. */
        UnitPrice: number;
        /** The number of uses that were added or removed to this item in this call. */
        UsesIncrementedBy?: number;

    }

    export interface ItemPurchaseRequest {
        /** Title-specific text concerning this purchase. */
        Annotation?: string;
        /** Unique ItemId of the item to purchase. */
        ItemId: string;
        /** How many of this item to purchase. Min 1, maximum 25. */
        Quantity: number;
        /** Items to be upgraded as a result of this purchase (upgraded items are hidden, as they are "replaced" by the new items). */
        UpgradeFromItems?: string[];

    }

    export interface KongregatePlayFabIdPair {
        /** Unique Kongregate identifier for a user. */
        KongregateId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Kongregate identifier. */
        PlayFabId?: string;

    }

    export interface LinkAndroidDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Specific model of the user's device. */
        AndroidDevice?: string;
        /** Android device identifier for the user's device. */
        AndroidDeviceId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the device, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Specific Operating System version for the user's device. */
        OS?: string;

    }

    export interface LinkAndroidDeviceIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkAppleRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to a specific Apple account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /**
         * The JSON Web token (JWT) returned by Apple after login. Represented as the identityToken field in the authorization
         * credential payload. Used to validate the request and find the user ID (Apple subject) to link with.
         */
        IdentityToken: string;

    }

    export interface LinkCustomIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Custom unique identifier for the user, generated by the title. */
        CustomId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the custom ID, unlink the other user and re-link. */
        ForceLink?: boolean;

    }

    export interface LinkCustomIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkedPlatformAccountModel {
        /** Linked account email of the user on the platform, if available */
        Email?: string;
        /** Authentication platform */
        Platform?: string;
        /** Unique account identifier of the user on the platform */
        PlatformUserId?: string;
        /** Linked account username of the user on the platform, if available */
        Username?: string;

    }

    export interface LinkFacebookAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique identifier from Facebook for the user. */
        AccessToken: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;

    }

    export interface LinkFacebookAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkFacebookInstantGamesIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Facebook Instant Games signature for the user. */
        FacebookInstantGamesSignature: string;
        /** If another user is already linked to the Facebook Instant Games ID, unlink the other user and re-link. */
        ForceLink?: boolean;

    }

    export interface LinkFacebookInstantGamesIdResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkGameCenterAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * If another user is already linked to the account, unlink the other user and re-link. If the current user is already
         * linked, link both accounts
         */
        ForceLink?: boolean;
        /** Game Center identifier for the player account to be linked. */
        GameCenterId: string;
        /** The URL for the public encryption key that will be used to verify the signature. */
        PublicKeyUrl?: string;
        /** A random value used to compute the hash and keep it randomized. */
        Salt?: string;
        /** The verification signature of the authentication payload. */
        Signature?: string;
        /**
         * The integer representation of date and time that the signature was created on. PlayFab will reject authentication
         * signatures not within 10 minutes of the server's current time.
         */
        Timestamp?: string;

    }

    export interface LinkGameCenterAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkGoogleAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * If another user is already linked to the account, unlink the other user and re-link. If the current user is already
         * linked, link both accounts
         */
        ForceLink?: boolean;
        /**
         * Server authentication code obtained on the client by calling getServerAuthCode()
         * (https://developers.google.com/identity/sign-in/android/offline-access) from Google Play for the user.
         */
        ServerAuthCode?: string;

    }

    export interface LinkGoogleAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkGooglePlayGamesServicesAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * If another user is already linked to the account, unlink the other user and re-link. If the current user is already
         * linked, link both accounts
         */
        ForceLink?: boolean;
        /**
         * OAuth 2.0 server authentication code obtained on the client by calling the requestServerSideAccess()
         * (https://developers.google.com/games/services/android/signin) Google Play Games client API.
         */
        ServerAuthCode: string;

    }

    export interface LinkGooglePlayGamesServicesAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkIOSDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Vendor-specific iOS identifier for the user's device. */
        DeviceId: string;
        /** Specific model of the user's device. */
        DeviceModel?: string;
        /** If another user is already linked to the device, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Specific Operating System version for the user's device. */
        OS?: string;

    }

    export interface LinkIOSDeviceIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkKongregateAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Valid session auth ticket issued by Kongregate */
        AuthTicket: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Numeric user ID assigned by Kongregate */
        KongregateId: string;

    }

    export interface LinkKongregateAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkNintendoServiceAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to a specific Nintendo Switch account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /**
         * The JSON Web token (JWT) returned by Nintendo after login. Used to validate the request and find the user ID (Nintendo
         * Switch subject) to link with.
         */
        IdentityToken: string;

    }

    export interface LinkNintendoSwitchDeviceIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the Nintendo Switch Device ID, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Nintendo Switch unique identifier for the user's device. */
        NintendoSwitchDeviceId: string;

    }

    export interface LinkNintendoSwitchDeviceIdResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkOpenIdConnectRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** A name that identifies which configured OpenID Connect provider relationship to use. Maximum 100 characters. */
        ConnectionId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to a specific OpenId Connect user, unlink the other user and re-link. */
        ForceLink?: boolean;
        /**
         * The JSON Web token (JWT) returned by the identity provider after login. Represented as the id_token field in the
         * identity provider's response. Used to validate the request and find the user ID (OpenID Connect subject) to link with.
         */
        IdToken: string;

    }

    export interface LinkPSNAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Authentication code provided by the PlayStation :tm: Network. */
        AuthCode: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Id of the PlayStation :tm: Network issuer environment. If null, defaults to production environment. */
        IssuerId?: number;
        /** Redirect URI supplied to PlayStation :tm: Network when requesting an auth code */
        RedirectUri: string;

    }

    export interface LinkPSNAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkSteamAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /**
         * Authentication token for the user, returned as a byte array from Steam, and converted to a string (for example, the byte
         * 0x08 should become "08").
         */
        SteamTicket: string;

    }

    export interface LinkSteamAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkTwitchAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Valid token issued by Twitch */
        AccessToken: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;

    }

    export interface LinkTwitchAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface LinkXboxAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** If another user is already linked to the account, unlink the other user and re-link. */
        ForceLink?: boolean;
        /** Token provided by the Xbox Live SDK/XDK method GetTokenAndSignatureAsync("POST", "https://playfabapi.com/", ""). */
        XboxToken: string;

    }

    export interface LinkXboxAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface ListUsersCharactersRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabId?: string;

    }

    export interface ListUsersCharactersResult extends PlayFabModule.IPlayFabResultCommon  {
        /** The requested list of characters. */
        Characters?: CharacterResult[];

    }

    export interface LocationModel {
        /** City name. */
        City?: string;
        /** The two-character continent code for this location */
        ContinentCode?: string;
        /** The two-character ISO 3166-1 country code for the country associated with the location */
        CountryCode?: string;
        /** Latitude coordinate of the geographic location. */
        Latitude?: number;
        /** Longitude coordinate of the geographic location. */
        Longitude?: number;

    }

    type LoginIdentityProvider = "Unknown"

        | "PlayFab"
        | "Custom"
        | "GameCenter"
        | "GooglePlay"
        | "Steam"
        | "XBoxLive"
        | "PSN"
        | "Kongregate"
        | "Facebook"
        | "IOSDevice"
        | "AndroidDevice"
        | "Twitch"
        | "WindowsHello"
        | "GameServer"
        | "CustomServer"
        | "NintendoSwitch"
        | "FacebookInstantGames"
        | "OpenIdConnect"
        | "Apple"
        | "NintendoSwitchAccount"
        | "GooglePlayGames";

    export interface LoginResult extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * If LoginTitlePlayerAccountEntity flag is set on the login request the title_player_account will also be logged in and
         * returned.
         */
        EntityToken?: EntityTokenResponse;
        /** Results for requested info. */
        InfoResultPayload?: GetPlayerCombinedInfoResultPayload;
        /** The time of this user's previous login. If there was no previous login, then it's DateTime.MinValue */
        LastLoginTime?: string;
        /** True if the account was newly created on this login. */
        NewlyCreated: boolean;
        /** Player's unique PlayFabId. */
        PlayFabId?: string;
        /** Unique token authorizing the user and game at the server level, for the current session. */
        SessionTicket?: string;
        /** Settings specific to this user. */
        SettingsForUser?: UserSettings;
        /** The experimentation treatments for this user at the time of login. */
        TreatmentAssignment?: TreatmentAssignment;

    }

    export interface LoginWithAndroidDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Specific model of the user's device. */
        AndroidDevice?: string;
        /** Android device identifier for the user's device. */
        AndroidDeviceId?: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Specific Operating System version for the user's device. */
        OS?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithAppleRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /**
         * The JSON Web token (JWT) returned by Apple after login. Represented as the identityToken field in the authorization
         * credential payload. If you choose to ignore the expiration date for identity tokens, you will receive an NotAuthorized
         * error if Apple rotates the signing key. In this case, users have to login to provide a fresh identity token.
         */
        IdentityToken: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithCustomIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** Custom unique identifier for the user, generated by the title. */
        CustomId?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithEmailAddressRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Email address for the account. */
        Email: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Password for the PlayFab account (6-100 characters) */
        Password: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithFacebookInstantGamesIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Facebook Instant Games signature for the user. */
        FacebookInstantGamesSignature: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithFacebookRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique identifier from Facebook for the user. */
        AccessToken: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithGameCenterRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Unique Game Center player id. */
        PlayerId?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /** The URL for the public encryption key that will be used to verify the signature. */
        PublicKeyUrl?: string;
        /** A random value used to compute the hash and keep it randomized. */
        Salt?: string;
        /** The verification signature of the authentication payload. */
        Signature?: string;
        /**
         * The integer representation of date and time that the signature was created on. PlayFab will reject authentication
         * signatures not within 10 minutes of the server's current time.
         */
        Timestamp?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithGoogleAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * OAuth 2.0 server authentication code obtained on the client by calling the getServerAuthCode()
         * (https://developers.google.com/identity/sign-in/android/offline-access) Google client API.
         */
        ServerAuthCode?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithGooglePlayGamesServicesRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * OAuth 2.0 server authentication code obtained on the client by calling the requestServerSideAccess()
         * (https://developers.google.com/games/services/android/signin) Google Play Games client API.
         */
        ServerAuthCode?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithIOSDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Vendor-specific iOS identifier for the user's device. */
        DeviceId?: string;
        /** Specific model of the user's device. */
        DeviceModel?: string;
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Specific Operating System version for the user's device. */
        OS?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithKongregateRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Token issued by Kongregate's client API for the user. */
        AuthTicket?: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Numeric user ID assigned by Kongregate */
        KongregateId?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithNintendoServiceAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** The JSON Web token (JWT) returned by Nintendo after login. */
        IdentityToken: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithNintendoSwitchDeviceIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Nintendo Switch unique identifier for the user's device. */
        NintendoSwitchDeviceId?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithOpenIdConnectRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** A name that identifies which configured OpenID Connect provider relationship to use. Maximum 100 characters. */
        ConnectionId: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /**
         * The JSON Web token (JWT) returned by the identity provider after login. Represented as the id_token field in the
         * identity provider's response.
         */
        IdToken: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithPlayFabRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Password for the PlayFab account (6-100 characters) */
        Password: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;
        /** PlayFab username for the account. */
        Username: string;

    }

    export interface LoginWithPSNRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Auth code provided by the PlayStation :tm: Network OAuth provider. */
        AuthCode?: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Id of the PlayStation :tm: Network issuer environment. If null, defaults to production environment. */
        IssuerId?: number;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /** Redirect URI supplied to PlayStation :tm: Network when requesting an auth code */
        RedirectUri?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithSteamRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Authentication token for the user, returned as a byte array from Steam, and converted to a string (for example, the byte
         * 0x08 should become "08").
         */
        SteamTicket?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithTwitchRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Token issued by Twitch's API for the user. */
        AccessToken?: string;
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;

    }

    export interface LoginWithXboxRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Automatically create a PlayFab account if one is not currently linked to this ID. */
        CreateAccount?: boolean;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;
        /** Token provided by the Xbox Live SDK/XDK method GetTokenAndSignatureAsync("POST", "https://playfabapi.com/", ""). */
        XboxToken?: string;

    }

    export interface LogStatement {
        /** Optional object accompanying the message as contextual information */
        Data?: any;
        /** 'Debug', 'Info', or 'Error' */
        Level?: string;
        Message?: string;

    }

    export interface MatchmakeRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Build version to match against. [Note: Required if LobbyId is not specified] */
        BuildVersion?: string;
        /** Character to use for stats based matching. Leave null to use account stats. */
        CharacterId?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Game mode to match make against. [Note: Required if LobbyId is not specified] */
        GameMode?: string;
        /** Lobby identifier to match make against. This is used to select a specific Game Server Instance. */
        LobbyId?: string;
        /** Region to match make against. [Note: Required if LobbyId is not specified] */
        Region?: string;
        /** Start a game session if one with an open slot is not found. Defaults to true. */
        StartNewIfNoneFound?: boolean;
        /** Player statistic to use in finding a match. May be null for no stat-based matching. */
        StatisticName?: string;
        /** Filter to include and/or exclude Game Server Instances associated with certain Tags */
        TagFilter?: CollectionFilter;

    }

    export interface MatchmakeResult extends PlayFabModule.IPlayFabResultCommon  {
        /** timestamp for when the server will expire, if applicable */
        Expires?: string;
        /** unique lobby identifier of the server matched */
        LobbyID?: string;
        /** time in milliseconds the application is configured to wait on matchmaking results */
        PollWaitTimeMS?: number;
        /** IPV4 address of the server */
        ServerIPV4Address?: string;
        /** IPV6 address of the server */
        ServerIPV6Address?: string;
        /** port number to use for non-http communications with the server */
        ServerPort?: number;
        /** Public DNS name (if any) of the server */
        ServerPublicDNSName?: string;
        /** result of match making process */
        Status?: string;
        /** server authorization ticket (used by RedeemMatchmakerTicket to validate user insertion into the game) */
        Ticket?: string;

    }

    type MatchmakeStatus = "Complete"

        | "Waiting"
        | "GameNotFound"
        | "NoAvailableSlots"
        | "SessionClosed";

    export interface MembershipModel {
        /** Whether this membership is active. That is, whether the MembershipExpiration time has been reached. */
        IsActive: boolean;
        /** The time this membership expires */
        MembershipExpiration: string;
        /** The id of the membership */
        MembershipId?: string;
        /**
         * Membership expirations can be explicitly overridden (via game manager or the admin api). If this membership has been
         * overridden, this will be the new expiration time.
         */
        OverrideExpiration?: string;
        /** The list of subscriptions that this player has for this membership */
        Subscriptions?: SubscriptionModel[];

    }

    export interface MicrosoftStorePayload {
        /** Microsoft store ID key. This is optional. Alternatively you can use XboxToken */
        CollectionsMsIdKey?: string;
        /** If collectionsMsIdKey is provided, this will verify the user id in the collectionsMsIdKey is the same. */
        UserId?: string;
        /**
         * Token provided by the Xbox Live SDK/XDK method GetTokenAndSignatureAsync("POST", "https://playfabapi.com/", ""). This is
         * optional. Alternatively can use CollectionsMsIdKey
         */
        XboxToken?: string;

    }

    export interface ModifyUserVirtualCurrencyResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Balance of the virtual currency after modification. */
        Balance: number;
        /**
         * Amount added or subtracted from the user's virtual currency. Maximum VC balance is Int32 (2,147,483,647). Any increase
         * over this value will be discarded.
         */
        BalanceChange: number;
        /** User currency was subtracted from. */
        PlayFabId?: string;
        /** Name of the virtual currency which was modified. */
        VirtualCurrency?: string;

    }

    export interface NameIdentifier {
        /** Id Identifier, if present */
        Id?: string;
        /** Name Identifier, if present */
        Name?: string;

    }

    export interface NintendoServiceAccountPlayFabIdPair {
        /** Unique Nintendo Switch Service Account identifier for a user. */
        NintendoServiceAccountId?: string;
        /**
         * Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Nintendo Switch Service Account
         * identifier.
         */
        PlayFabId?: string;

    }

    export interface NintendoSwitchPlayFabIdPair {
        /** Unique Nintendo Switch Device identifier for a user. */
        NintendoSwitchDeviceId?: string;
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Nintendo Switch Device identifier. */
        PlayFabId?: string;

    }

    export interface OpenTradeRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Players who are allowed to accept the trade. If null, the trade may be accepted by any player. If empty, the trade may
         * not be accepted by any player.
         */
        AllowedPlayerIds?: string[];
        /** Player inventory items offered for trade. If not set, the trade is effectively a gift request */
        OfferedInventoryInstanceIds?: string[];
        /** Catalog items accepted for the trade. If not set, the trade is effectively a gift. */
        RequestedCatalogItemIds?: string[];

    }

    export interface OpenTradeResponse extends PlayFabModule.IPlayFabResultCommon  {
        /** The information about the trade that was just opened. */
        Trade?: TradeInfo;

    }

    export interface PayForPurchaseRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Currency to use to fund the purchase. */
        Currency: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Purchase order identifier returned from StartPurchase. */
        OrderId: string;
        /** Payment provider to use to fund the purchase. */
        ProviderName: string;
        /** Payment provider transaction identifier. Required for Facebook Payments. */
        ProviderTransactionId?: string;

    }

    export interface PayForPurchaseResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Local credit applied to the transaction (provider specific). */
        CreditApplied: number;
        /** Purchase order identifier. */
        OrderId?: string;
        /** Provider used for the transaction. */
        ProviderData?: string;
        /** A token generated by the provider to authenticate the request (provider-specific). */
        ProviderToken?: string;
        /** URL to the purchase provider page that details the purchase. */
        PurchaseConfirmationPageURL?: string;
        /** Currency for the transaction, may be a virtual currency or real money. */
        PurchaseCurrency?: string;
        /** Cost of the transaction. */
        PurchasePrice: number;
        /** Status of the transaction. */
        Status?: string;
        /** Virtual currencies granted by the transaction, if any. */
        VCAmount?: { [key: string]: number };
        /** Current virtual currency balances for the user. */
        VirtualCurrency?: { [key: string]: number };

    }

    export interface PaymentOption {
        /** Specific currency to use to fund the purchase. */
        Currency?: string;
        /** Amount of the specified currency needed for the purchase. */
        Price: number;
        /** Name of the purchase provider for this option. */
        ProviderName?: string;
        /** Amount of existing credit the user has with the provider. */
        StoreCredit: number;

    }

    export interface PlayerLeaderboardEntry {
        /** Title-specific display name of the user for this leaderboard entry. */
        DisplayName?: string;
        /** PlayFab unique identifier of the user for this leaderboard entry. */
        PlayFabId?: string;
        /** User's overall position in the leaderboard. */
        Position: number;
        /** The profile of the user, if requested. */
        Profile?: PlayerProfileModel;
        /** Specific value of the user's statistic. */
        StatValue: number;

    }

    export interface PlayerProfileModel {
        /** List of advertising campaigns the player has been attributed to */
        AdCampaignAttributions?: AdCampaignAttributionModel[];
        /** URL of the player's avatar image */
        AvatarUrl?: string;
        /** If the player is currently banned, the UTC Date when the ban expires */
        BannedUntil?: string;
        /** List of all contact email info associated with the player account */
        ContactEmailAddresses?: ContactEmailInfoModel[];
        /** Player record created */
        Created?: string;
        /** Player display name */
        DisplayName?: string;
        /**
         * List of experiment variants for the player. Note that these variants are not guaranteed to be up-to-date when returned
         * during login because the player profile is updated only after login. Instead, use the LoginResult.TreatmentAssignment
         * property during login to get the correct variants and variables.
         */
        ExperimentVariants?: string[];
        /** UTC time when the player most recently logged in to the title */
        LastLogin?: string;
        /** List of all authentication systems linked to this player account */
        LinkedAccounts?: LinkedPlatformAccountModel[];
        /** List of geographic locations from which the player has logged in to the title */
        Locations?: LocationModel[];
        /** List of memberships for the player, along with whether are expired. */
        Memberships?: MembershipModel[];
        /** Player account origination */
        Origination?: string;
        /** PlayFab player account unique identifier */
        PlayerId?: string;
        /** Publisher this player belongs to */
        PublisherId?: string;
        /** List of configured end points registered for sending the player push notifications */
        PushNotificationRegistrations?: PushNotificationRegistrationModel[];
        /** List of leaderboard statistic values for the player */
        Statistics?: StatisticModel[];
        /** List of player's tags for segmentation */
        Tags?: TagModel[];
        /** Title ID this player profile applies to */
        TitleId?: string;
        /**
         * Sum of the player's purchases made with real-money currencies, converted to US dollars equivalent and represented as a
         * whole number of cents (1/100 USD). For example, 999 indicates nine dollars and ninety-nine cents.
         */
        TotalValueToDateInUSD?: number;
        /** List of the player's lifetime purchase totals, summed by real-money currency */
        ValuesToDate?: ValueToDateModel[];

    }

    export interface PlayerProfileViewConstraints {
        /** Whether to show player's avatar URL. Defaults to false */
        ShowAvatarUrl: boolean;
        /** Whether to show the banned until time. Defaults to false */
        ShowBannedUntil: boolean;
        /** Whether to show campaign attributions. Defaults to false */
        ShowCampaignAttributions: boolean;
        /** Whether to show contact email addresses. Defaults to false */
        ShowContactEmailAddresses: boolean;
        /** Whether to show the created date. Defaults to false */
        ShowCreated: boolean;
        /** Whether to show the display name. Defaults to false */
        ShowDisplayName: boolean;
        /** Whether to show player's experiment variants. Defaults to false */
        ShowExperimentVariants: boolean;
        /** Whether to show the last login time. Defaults to false */
        ShowLastLogin: boolean;
        /** Whether to show the linked accounts. Defaults to false */
        ShowLinkedAccounts: boolean;
        /** Whether to show player's locations. Defaults to false */
        ShowLocations: boolean;
        /** Whether to show player's membership information. Defaults to false */
        ShowMemberships: boolean;
        /** Whether to show origination. Defaults to false */
        ShowOrigination: boolean;
        /** Whether to show push notification registrations. Defaults to false */
        ShowPushNotificationRegistrations: boolean;
        /** Reserved for future development */
        ShowStatistics: boolean;
        /** Whether to show tags. Defaults to false */
        ShowTags: boolean;
        /** Whether to show the total value to date in usd. Defaults to false */
        ShowTotalValueToDateInUsd: boolean;
        /** Whether to show the values to date. Defaults to false */
        ShowValuesToDate: boolean;

    }

    export interface PlayerStatisticVersion {
        /** time when the statistic version became active */
        ActivationTime: string;
        /** time when the statistic version became inactive due to statistic version incrementing */
        DeactivationTime?: string;
        /** time at which the statistic version was scheduled to become active, based on the configured ResetInterval */
        ScheduledActivationTime?: string;
        /** time at which the statistic version was scheduled to become inactive, based on the configured ResetInterval */
        ScheduledDeactivationTime?: string;
        /** name of the statistic when the version became active */
        StatisticName?: string;
        /** version of the statistic */
        Version: number;

    }

    export interface PlayStation5Payload {
        /** An optional list of entitlement ids to query against PlayStation :tm: Network */
        Ids?: string[];
        /** Id of the PlayStation :tm: Network service label to consume entitlements from */
        ServiceLabel?: string;

    }

    export interface PSNAccountPlayFabIdPair {
        /**
         * Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the PlayStation :tm: Network
         * identifier.
         */
        PlayFabId?: string;
        /** Unique PlayStation :tm: Network identifier for a user. */
        PSNAccountId?: string;

    }

    export interface PurchaseItemRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version for the items to be purchased (defaults to most recent version. */
        CatalogVersion?: string;
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Unique identifier of the item to purchase. */
        ItemId: string;
        /** Price the client expects to pay for the item (in case a new catalog or store was uploaded, with new prices). */
        Price: number;
        /** Store to buy this item through. If not set, prices default to those in the catalog. */
        StoreId?: string;
        /** Virtual currency to use to purchase the item. */
        VirtualCurrency: string;

    }

    export interface PurchaseItemResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Details for the items purchased. */
        Items?: ItemInstance[];

    }

    export interface PurchaseReceiptFulfillment {
        /** Items granted to the player in fulfillment of the validated receipt. */
        FulfilledItems?: ItemInstance[];
        /**
         * Source of the payment price information for the recorded purchase transaction. A value of 'Request' indicates that the
         * price specified in the request was used, whereas a value of 'Catalog' indicates that the real-money price of the catalog
         * item matching the product ID in the validated receipt transaction and the currency specified in the request (defaulting
         * to USD) was used.
         */
        RecordedPriceSource?: string;
        /** Currency used to purchase the items (ISO 4217 currency code). */
        RecordedTransactionCurrency?: string;
        /** Amount of the stated currency paid for the items, in centesimal units */
        RecordedTransactionTotal?: number;

    }

    type PushNotificationPlatform = "ApplePushNotificationService"

        | "GoogleCloudMessaging";

    export interface PushNotificationRegistrationModel {
        /** Notification configured endpoint */
        NotificationEndpointARN?: string;
        /** Push notification platform */
        Platform?: string;

    }

    export interface RedeemCouponRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the coupon. If null, uses the default catalog */
        CatalogVersion?: string;
        /** Optional identifier for the Character that should receive the item. If null, item is added to the player */
        CharacterId?: string;
        /** Generated coupon code to redeem. */
        CouponCode: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface RedeemCouponResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Items granted to the player as a result of redeeming the coupon. */
        GrantedItems?: ItemInstance[];

    }

    export interface RefreshPSNAuthTokenRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Auth code returned by PlayStation :tm: Network OAuth system. */
        AuthCode: string;
        /** Id of the PlayStation :tm: Network issuer environment. If null, defaults to production environment. */
        IssuerId?: number;
        /** Redirect URI supplied to PlayStation :tm: Network when requesting an auth code */
        RedirectUri: string;

    }

    type Region = "USCentral"

        | "USEast"
        | "EUWest"
        | "Singapore"
        | "Japan"
        | "Brazil"
        | "Australia";

    export interface RegionInfo {
        /** indicates whether the server specified is available in this region */
        Available: boolean;
        /** name of the region */
        Name?: string;
        /** url to ping to get roundtrip time */
        PingUrl?: string;
        /** unique identifier for the region */
        Region?: string;

    }

    export interface RegisterForIOSPushNotificationRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Message to display when confirming push notification. */
        ConfirmationMessage?: string;
        /** Unique token generated by the Apple Push Notification service when the title registered to receive push notifications. */
        DeviceToken: string;
        /** If true, send a test push message immediately after sucessful registration. Defaults to false. */
        SendPushNotificationConfirmation?: boolean;

    }

    export interface RegisterForIOSPushNotificationResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface RegisterPlayFabUserRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** An optional parameter for setting the display name for this title (3-25 characters). */
        DisplayName?: string;
        /** User email address attached to their account */
        Email?: string;
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Flags for which pieces of info to return for the user. */
        InfoRequestParameters?: GetPlayerCombinedInfoRequestParams;
        /** Password for the PlayFab account (6-100 characters) */
        Password?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;
        /**
         * An optional parameter that specifies whether both the username and email parameters are required. If true, both
         * parameters are required; if false, the user must supply either the username or email parameter. The default value is
         * true.
         */
        RequireBothUsernameAndEmail?: boolean;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId?: string;
        /** PlayFab username for the account (3-20 characters) */
        Username?: string;

    }

    export interface RegisterPlayFabUserResult extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * If LoginTitlePlayerAccountEntity flag is set on the login request the title_player_account will also be logged in and
         * returned.
         */
        EntityToken?: EntityTokenResponse;
        /** PlayFab unique identifier for this newly created account. */
        PlayFabId?: string;
        /** Unique token identifying the user and game at the server level, for the current session. */
        SessionTicket?: string;
        /** Settings specific to this user. */
        SettingsForUser?: UserSettings;
        /** PlayFab unique user name. */
        Username?: string;

    }

    export interface RemoveContactEmailRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface RemoveContactEmailResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface RemoveFriendRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** PlayFab identifier of the friend account which is to be removed. */
        FriendPlayFabId: string;

    }

    export interface RemoveFriendResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface RemoveGenericIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Generic service identifier to be removed from the player. */
        GenericId: GenericServiceId;

    }

    export interface RemoveGenericIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface RemoveSharedGroupMembersRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** An array of unique PlayFab assigned ID of the user on whom the operation will be performed. */
        PlayFabIds: string[];
        /** Unique identifier for the shared group. */
        SharedGroupId: string;

    }

    export interface RemoveSharedGroupMembersResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface ReportAdActivityRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Type of activity, may be Opened, Closed, Start or End */
        Activity: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Unique ID of the placement to report for */
        PlacementId: string;
        /** Unique ID of the reward the player was offered */
        RewardId: string;

    }

    export interface ReportAdActivityResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface ReportPlayerClientRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Optional additional comment by reporting player. */
        Comment?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Unique PlayFab identifier of the reported player. */
        ReporteeId: string;

    }

    export interface ReportPlayerClientResult extends PlayFabModule.IPlayFabResultCommon  {
        /** The number of remaining reports which may be filed today. */
        SubmissionsRemaining: number;

    }

    export interface RestoreIOSPurchasesRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the restored items. If null, defaults to primary catalog. */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Base64 encoded receipt data, passed back by the App Store as a result of a successful purchase. */
        ReceiptData: string;

    }

    export interface RestoreIOSPurchasesResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Fulfilled inventory items and recorded purchases in fulfillment of the validated receipt transactions. */
        Fulfillments?: PurchaseReceiptFulfillment[];

    }

    export interface RewardAdActivityRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Placement unique ID */
        PlacementId: string;
        /** Reward unique ID */
        RewardId: string;

    }

    export interface RewardAdActivityResult extends PlayFabModule.IPlayFabResultCommon  {
        /** PlayStream Event ID that was generated by this reward (all subsequent events are associated with this event identifier) */
        AdActivityEventId?: string;
        /** Debug results from the grants */
        DebugResults?: string[];
        /** Id of the placement the reward was for */
        PlacementId?: string;
        /** Name of the placement the reward was for */
        PlacementName?: string;
        /** If placement has viewing limits indicates how many views are left */
        PlacementViewsRemaining?: number;
        /** If placement has viewing limits indicates when they will next reset */
        PlacementViewsResetMinutes?: number;
        /** Reward results */
        RewardResults?: AdRewardResults;

    }

    export interface ScriptExecutionError {
        /**
         * Error code, such as CloudScriptNotFound, JavascriptException, CloudScriptFunctionArgumentSizeExceeded,
         * CloudScriptAPIRequestCountExceeded, CloudScriptAPIRequestError, or CloudScriptHTTPRequestError
         */
        Error?: string;
        /** Details about the error */
        Message?: string;
        /** Point during the execution of the script at which the error occurred, if any */
        StackTrace?: string;

    }

    export interface SendAccountRecoveryEmailRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** User email address attached to their account */
        Email: string;
        /** The email template id of the account recovery email template to send. */
        EmailTemplateId?: string;
        /**
         * Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
         * title has been selected.
         */
        TitleId: string;

    }

    export interface SendAccountRecoveryEmailResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface SetFriendTagsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** PlayFab identifier of the friend account to which the tag(s) should be applied. */
        FriendPlayFabId: string;
        /** Array of tags to set on the friend account. */
        Tags: string[];

    }

    export interface SetFriendTagsResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface SetPlayerSecretRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only). */
        EncryptedRequest?: string;
        /** Player secret that is used to verify API request signatures (Enterprise Only). */
        PlayerSecret?: string;

    }

    export interface SetPlayerSecretResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface SharedGroupDataRecord {
        /** Timestamp for when this data was last updated. */
        LastUpdated: string;
        /** Unique PlayFab identifier of the user to last update this value. */
        LastUpdatedBy?: string;
        /** Indicates whether this data can be read by all users (public) or only members of the group (private). */
        Permission?: string;
        /** Data stored for the specified group data key. */
        Value?: string;

    }

    type SourceType = "Admin"

        | "BackEnd"
        | "GameClient"
        | "GameServer"
        | "Partner"
        | "Custom"
        | "API";

    export interface StartPurchaseRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version for the items to be purchased. Defaults to most recent catalog. */
        CatalogVersion?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Array of items to purchase. */
        Items: ItemPurchaseRequest[];
        /** Store through which to purchase items. If not set, prices will be pulled from the catalog itself. */
        StoreId?: string;

    }

    export interface StartPurchaseResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Cart items to be purchased. */
        Contents?: CartItem[];
        /** Purchase order identifier. */
        OrderId?: string;
        /** Available methods by which the user can pay. */
        PaymentOptions?: PaymentOption[];
        /** Current virtual currency totals for the user. */
        VirtualCurrencyBalances?: { [key: string]: number };

    }

    export interface StatisticModel {
        /** Statistic name */
        Name?: string;
        /** Statistic value */
        Value: number;
        /** Statistic version (0 if not a versioned statistic) */
        Version: number;

    }

    export interface StatisticNameVersion {
        /** unique name of the statistic */
        StatisticName: string;
        /** the version of the statistic to be returned */
        Version: number;

    }

    export interface StatisticUpdate {
        /** unique name of the statistic */
        StatisticName: string;
        /** statistic value for the player */
        Value: number;
        /**
         * for updates to an existing statistic value for a player, the version of the statistic when it was loaded. Null when
         * setting the statistic value for the first time.
         */
        Version?: number;

    }

    export interface StatisticValue {
        /** unique name of the statistic */
        StatisticName?: string;
        /** statistic value for the player */
        Value: number;
        /** for updates to an existing statistic value for a player, the version of the statistic when it was loaded */
        Version: number;

    }

    export interface SteamPlayFabIdPair {
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Steam identifier. */
        PlayFabId?: string;
        /** Unique Steam identifier for a user. */
        SteamStringId?: string;

    }

    export interface StoreItem {
        /** Store specific custom data. The data only exists as part of this store; it is not transferred to item instances */
        CustomData?: any;
        /** Intended display position for this item. Note that 0 is the first position */
        DisplayPosition?: number;
        /**
         * Unique identifier of the item as it exists in the catalog - note that this must exactly match the ItemId from the
         * catalog
         */
        ItemId: string;
        /** Override prices for this item for specific currencies */
        RealCurrencyPrices?: { [key: string]: number };
        /** Override prices for this item in virtual currencies and "RM" (the base Real Money purchase price, in USD pennies) */
        VirtualCurrencyPrices?: { [key: string]: number };

    }

    export interface StoreMarketingModel {
        /** Tagline for a store. */
        Description?: string;
        /** Display name of a store as it will appear to users. */
        DisplayName?: string;
        /** Custom data about a store. */
        Metadata?: any;

    }

    export interface SubscriptionModel {
        /** When this subscription expires. */
        Expiration: string;
        /** The time the subscription was orignially purchased */
        InitialSubscriptionTime: string;
        /** Whether this subscription is currently active. That is, if Expiration > now. */
        IsActive: boolean;
        /** The status of this subscription, according to the subscription provider. */
        Status?: string;
        /** The id for this subscription */
        SubscriptionId?: string;
        /** The item id for this subscription from the primary catalog */
        SubscriptionItemId?: string;
        /** The provider for this subscription. Apple or Google Play are supported today. */
        SubscriptionProvider?: string;

    }

    type SubscriptionProviderStatus = "NoError"

        | "Cancelled"
        | "UnknownError"
        | "BillingError"
        | "ProductUnavailable"
        | "CustomerDidNotAcceptPriceChange"
        | "FreeTrial"
        | "PaymentPending";

    export interface SubtractUserVirtualCurrencyRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Amount to be subtracted from the user balance of the specified virtual currency. */
        Amount: number;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Name of the virtual currency which is to be decremented. */
        VirtualCurrency: string;

    }

    export interface TagModel {
        /** Full value of the tag, including namespace */
        TagValue?: string;

    }

    type TitleActivationStatus = "None"

        | "ActivatedTitleKey"
        | "PendingSteam"
        | "ActivatedSteam"
        | "RevokedSteam";

    export interface TitleNewsItem {
        /** News item text. */
        Body?: string;
        /** Unique identifier of news item. */
        NewsId?: string;
        /** Date and time when the news item was posted. */
        Timestamp: string;
        /** Title of the news item. */
        Title?: string;

    }

    export interface TradeInfo {
        /** Item instances from the accepting player that are used to fulfill the trade. If null, no one has accepted the trade. */
        AcceptedInventoryInstanceIds?: string[];
        /** The PlayFab ID of the player who accepted the trade. If null, no one has accepted the trade. */
        AcceptedPlayerId?: string;
        /** An optional list of players allowed to complete this trade. If null, anybody can complete the trade. */
        AllowedPlayerIds?: string[];
        /** If set, The UTC time when this trade was canceled. */
        CancelledAt?: string;
        /** If set, The UTC time when this trade was fulfilled. */
        FilledAt?: string;
        /** If set, The UTC time when this trade was made invalid. */
        InvalidatedAt?: string;
        /** The catalogItem Ids of the item instances being offered. */
        OfferedCatalogItemIds?: string[];
        /** The itemInstance Ids that are being offered. */
        OfferedInventoryInstanceIds?: string[];
        /** The PlayFabId for the offering player. */
        OfferingPlayerId?: string;
        /** The UTC time when this trade was created. */
        OpenedAt?: string;
        /** The catalogItem Ids requested in exchange. */
        RequestedCatalogItemIds?: string[];
        /** Describes the current state of this trade. */
        Status?: string;
        /** The identifier for this trade. */
        TradeId?: string;

    }

    type TradeStatus = "Invalid"

        | "Opening"
        | "Open"
        | "Accepting"
        | "Accepted"
        | "Filled"
        | "Cancelled";

    type TransactionStatus = "CreateCart"

        | "Init"
        | "Approved"
        | "Succeeded"
        | "FailedByProvider"
        | "DisputePending"
        | "RefundPending"
        | "Refunded"
        | "RefundFailed"
        | "ChargedBack"
        | "FailedByUber"
        | "FailedByPlayFab"
        | "Revoked"
        | "TradePending"
        | "Traded"
        | "Upgraded"
        | "StackPending"
        | "Stacked"
        | "Other"
        | "Failed";

    export interface TreatmentAssignment {
        /** List of the experiment variables. */
        Variables?: Variable[];
        /** List of the experiment variants. */
        Variants?: string[];

    }

    export interface TwitchPlayFabIdPair {
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Twitch identifier. */
        PlayFabId?: string;
        /** Unique Twitch identifier for a user. */
        TwitchId?: string;

    }

    export interface UnlinkAndroidDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Android device identifier for the user's device. If not specified, the most recently signed in Android Device ID will be
         * used.
         */
        AndroidDeviceId?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkAndroidDeviceIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkAppleRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkCustomIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Custom unique identifier for the user, generated by the title. If not specified, the most recently signed in Custom ID
         * will be used.
         */
        CustomId?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkCustomIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkFacebookAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkFacebookAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkFacebookInstantGamesIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Facebook Instant Games identifier for the user. If not specified, the most recently signed in ID will be used. */
        FacebookInstantGamesId?: string;

    }

    export interface UnlinkFacebookInstantGamesIdResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkGameCenterAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkGameCenterAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkGoogleAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkGoogleAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkGooglePlayGamesServicesAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkGooglePlayGamesServicesAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkIOSDeviceIDRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Vendor-specific iOS identifier for the user's device. If not specified, the most recently signed in iOS Device ID will
         * be used.
         */
        DeviceId?: string;

    }

    export interface UnlinkIOSDeviceIDResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkKongregateAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkKongregateAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkNintendoServiceAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkNintendoSwitchDeviceIdRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Nintendo Switch Device identifier for the user. If not specified, the most recently signed in device ID will be used. */
        NintendoSwitchDeviceId?: string;

    }

    export interface UnlinkNintendoSwitchDeviceIdResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkOpenIdConnectRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** A name that identifies which configured OpenID Connect provider relationship to use. Maximum 100 characters. */
        ConnectionId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkPSNAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkPSNAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkSteamAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkSteamAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkTwitchAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Valid token issued by Twitch. Used to specify which twitch account to unlink from the profile. By default it uses the
         * one that is present on the profile.
         */
        AccessToken?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkTwitchAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlinkXboxAccountRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlinkXboxAccountResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UnlockContainerInstanceRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Specifies the catalog version that should be used to determine container contents. If unspecified, uses catalog
         * associated with the item instance.
         */
        CatalogVersion?: string;
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId?: string;
        /** ItemInstanceId of the container to unlock. */
        ContainerItemInstanceId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * ItemInstanceId of the key that will be consumed by unlocking this container. If the container requires a key, this
         * parameter is required.
         */
        KeyItemInstanceId?: string;

    }

    export interface UnlockContainerItemRequest extends PlayFabModule.IPlayFabRequestCommon {
        /**
         * Specifies the catalog version that should be used to determine container contents. If unspecified, uses default/primary
         * catalog.
         */
        CatalogVersion?: string;
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId?: string;
        /** Catalog ItemId of the container type to unlock. */
        ContainerItemId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UnlockContainerItemResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Items granted to the player as a result of unlocking the container. */
        GrantedItems?: ItemInstance[];
        /** Unique instance identifier of the container unlocked. */
        UnlockedItemInstanceId?: string;
        /** Unique instance identifier of the key used to unlock the container, if applicable. */
        UnlockedWithItemInstanceId?: string;
        /** Virtual currency granted to the player as a result of unlocking the container. */
        VirtualCurrency?: { [key: string]: number };

    }

    export interface UpdateAvatarUrlRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** URL of the avatar image. If empty, it removes the existing avatar URL. */
        ImageUrl: string;

    }

    export interface UpdateCharacterDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Key-value pairs to be written to the custom data. Note that keys are trimmed of whitespace, are limited in size, and may
         * not begin with a '!' character or be null.
         */
        Data?: { [key: string]: string | null };
        /**
         * Optional list of Data-keys to remove from UserData. Some SDKs cannot insert null-values into Data due to language
         * constraints. Use this to delete the keys directly.
         */
        KeysToRemove?: string[];
        /** Permission to be applied to all user data keys written in this request. Defaults to "private" if not set. */
        Permission?: string;

    }

    export interface UpdateCharacterDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * Indicates the current version of the data that has been set. This is incremented with every set call for that type of
         * data (read-only, internal, etc). This version can be provided in Get calls to find updated data.
         */
        DataVersion: number;

    }

    export interface UpdateCharacterStatisticsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;
        /** Statistics to be updated with the provided values, in the Key(string), Value(int) pattern. */
        CharacterStatistics?: { [key: string]: number };
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };

    }

    export interface UpdateCharacterStatisticsResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UpdatePlayerStatisticsRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Statistics to be updated with the provided values */
        Statistics: StatisticUpdate[];

    }

    export interface UpdatePlayerStatisticsResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UpdateSharedGroupDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Key-value pairs to be written to the custom data. Note that keys are trimmed of whitespace, are limited in size, and may
         * not begin with a '!' character or be null.
         */
        Data?: { [key: string]: string | null };
        /**
         * Optional list of Data-keys to remove from UserData. Some SDKs cannot insert null-values into Data due to language
         * constraints. Use this to delete the keys directly.
         */
        KeysToRemove?: string[];
        /** Permission to be applied to all user data keys in this request. */
        Permission?: string;
        /** Unique identifier for the shared group. */
        SharedGroupId: string;

    }

    export interface UpdateSharedGroupDataResult extends PlayFabModule.IPlayFabResultCommon  {

    }

    export interface UpdateUserDataRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * Key-value pairs to be written to the custom data. Note that keys are trimmed of whitespace, are limited in size, and may
         * not begin with a '!' character or be null.
         */
        Data?: { [key: string]: string | null };
        /**
         * Optional list of Data-keys to remove from UserData. Some SDKs cannot insert null-values into Data due to language
         * constraints. Use this to delete the keys directly.
         */
        KeysToRemove?: string[];
        /**
         * Permission to be applied to all user data keys written in this request. Defaults to "private" if not set. This is used
         * for requests by one player for information about another player; those requests will only return Public keys.
         */
        Permission?: string;

    }

    export interface UpdateUserDataResult extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * Indicates the current version of the data that has been set. This is incremented with every set call for that type of
         * data (read-only, internal, etc). This version can be provided in Get calls to find updated data.
         */
        DataVersion: number;

    }

    export interface UpdateUserTitleDisplayNameRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** New title display name for the user - must be between 3 and 25 characters. */
        DisplayName: string;

    }

    export interface UpdateUserTitleDisplayNameResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Current title display name for the user (this will be the original display name if the rename attempt failed). */
        DisplayName?: string;

    }

    export interface UserAccountInfo {
        /** User Android device information, if an Android device has been linked */
        AndroidDeviceInfo?: UserAndroidDeviceInfo;
        /** Sign in with Apple account information, if an Apple account has been linked */
        AppleAccountInfo?: UserAppleIdInfo;
        /** Timestamp indicating when the user account was created */
        Created: string;
        /** Custom ID information, if a custom ID has been assigned */
        CustomIdInfo?: UserCustomIdInfo;
        /** User Facebook information, if a Facebook account has been linked */
        FacebookInfo?: UserFacebookInfo;
        /** Facebook Instant Games account information, if a Facebook Instant Games account has been linked */
        FacebookInstantGamesIdInfo?: UserFacebookInstantGamesIdInfo;
        /** User Gamecenter information, if a Gamecenter account has been linked */
        GameCenterInfo?: UserGameCenterInfo;
        /** User Google account information, if a Google account has been linked */
        GoogleInfo?: UserGoogleInfo;
        /** User Google Play Games account information, if a Google Play Games account has been linked */
        GooglePlayGamesInfo?: UserGooglePlayGamesInfo;
        /** User iOS device information, if an iOS device has been linked */
        IosDeviceInfo?: UserIosDeviceInfo;
        /** User Kongregate account information, if a Kongregate account has been linked */
        KongregateInfo?: UserKongregateInfo;
        /** Nintendo Switch account information, if a Nintendo Switch account has been linked */
        NintendoSwitchAccountInfo?: UserNintendoSwitchAccountIdInfo;
        /** Nintendo Switch device information, if a Nintendo Switch device has been linked */
        NintendoSwitchDeviceIdInfo?: UserNintendoSwitchDeviceIdInfo;
        /** OpenID Connect information, if any OpenID Connect accounts have been linked */
        OpenIdInfo?: UserOpenIdInfo[];
        /** Unique identifier for the user account */
        PlayFabId?: string;
        /** Personal information for the user which is considered more sensitive */
        PrivateInfo?: UserPrivateAccountInfo;
        /** User PlayStation :tm: Network account information, if a PlayStation :tm: Network account has been linked */
        PsnInfo?: UserPsnInfo;
        /** User Steam information, if a Steam account has been linked */
        SteamInfo?: UserSteamInfo;
        /** Title-specific information for the user account */
        TitleInfo?: UserTitleInfo;
        /** User Twitch account information, if a Twitch account has been linked */
        TwitchInfo?: UserTwitchInfo;
        /** User account name in the PlayFab service */
        Username?: string;
        /** User XBox account information, if a XBox account has been linked */
        XboxInfo?: UserXboxInfo;

    }

    export interface UserAndroidDeviceInfo {
        /** Android device ID */
        AndroidDeviceId?: string;

    }

    export interface UserAppleIdInfo {
        /** Apple subject ID */
        AppleSubjectId?: string;

    }

    export interface UserCustomIdInfo {
        /** Custom ID */
        CustomId?: string;

    }

    type UserDataPermission = "Private"

        | "Public";

    export interface UserDataRecord {
        /** Timestamp for when this data was last updated. */
        LastUpdated: string;
        /**
         * Indicates whether this data can be read by all users (public) or only the user (private). This is used for GetUserData
         * requests being made by one player about another player.
         */
        Permission?: string;
        /** Data stored for the specified user data key. */
        Value?: string;

    }

    export interface UserFacebookInfo {
        /** Facebook identifier */
        FacebookId?: string;
        /** Facebook full name */
        FullName?: string;

    }

    export interface UserFacebookInstantGamesIdInfo {
        /** Facebook Instant Games ID */
        FacebookInstantGamesId?: string;

    }

    export interface UserGameCenterInfo {
        /** Gamecenter identifier */
        GameCenterId?: string;

    }

    export interface UserGoogleInfo {
        /** Email address of the Google account */
        GoogleEmail?: string;
        /** Gender information of the Google account */
        GoogleGender?: string;
        /** Google ID */
        GoogleId?: string;
        /** Locale of the Google account */
        GoogleLocale?: string;
        /** Name of the Google account user */
        GoogleName?: string;

    }

    export interface UserGooglePlayGamesInfo {
        /** Avatar image url of the Google Play Games player */
        GooglePlayGamesPlayerAvatarImageUrl?: string;
        /** Display name of the Google Play Games player */
        GooglePlayGamesPlayerDisplayName?: string;
        /** Google Play Games player ID */
        GooglePlayGamesPlayerId?: string;

    }

    export interface UserIosDeviceInfo {
        /** iOS device ID */
        IosDeviceId?: string;

    }

    export interface UserKongregateInfo {
        /** Kongregate ID */
        KongregateId?: string;
        /** Kongregate Username */
        KongregateName?: string;

    }

    export interface UserNintendoSwitchAccountIdInfo {
        /** Nintendo Switch account subject ID */
        NintendoSwitchAccountSubjectId?: string;

    }

    export interface UserNintendoSwitchDeviceIdInfo {
        /** Nintendo Switch Device ID */
        NintendoSwitchDeviceId?: string;

    }

    export interface UserOpenIdInfo {
        /** OpenID Connection ID */
        ConnectionId?: string;
        /** OpenID Issuer */
        Issuer?: string;
        /** OpenID Subject */
        Subject?: string;

    }

    type UserOrigination = "Organic"

        | "Steam"
        | "Google"
        | "Amazon"
        | "Facebook"
        | "Kongregate"
        | "GamersFirst"
        | "Unknown"
        | "IOS"
        | "LoadTest"
        | "Android"
        | "PSN"
        | "GameCenter"
        | "CustomId"
        | "XboxLive"
        | "Parse"
        | "Twitch"
        | "ServerCustomId"
        | "NintendoSwitchDeviceId"
        | "FacebookInstantGamesId"
        | "OpenIdConnect"
        | "Apple"
        | "NintendoSwitchAccount"
        | "GooglePlayGames";

    export interface UserPrivateAccountInfo {
        /** user email address */
        Email?: string;

    }

    export interface UserPsnInfo {
        /** PlayStation :tm: Network account ID */
        PsnAccountId?: string;
        /** PlayStation :tm: Network online ID */
        PsnOnlineId?: string;

    }

    export interface UserSettings {
        /** Boolean for whether this player is eligible for gathering device info. */
        GatherDeviceInfo: boolean;
        /** Boolean for whether this player should report OnFocus play-time tracking. */
        GatherFocusInfo: boolean;
        /** Boolean for whether this player is eligible for ad tracking. */
        NeedsAttribution: boolean;

    }

    export interface UserSteamInfo {
        /** what stage of game ownership the user is listed as being in, from Steam */
        SteamActivationStatus?: string;
        /** the country in which the player resides, from Steam data */
        SteamCountry?: string;
        /** currency type set in the user Steam account */
        SteamCurrency?: string;
        /** Steam identifier */
        SteamId?: string;
        /** Steam display name */
        SteamName?: string;

    }

    export interface UserTitleInfo {
        /** URL to the player's avatar. */
        AvatarUrl?: string;
        /**
         * timestamp indicating when the user was first associated with this game (this can differ significantly from when the user
         * first registered with PlayFab)
         */
        Created: string;
        /** name of the user, as it is displayed in-game */
        DisplayName?: string;
        /**
         * timestamp indicating when the user first signed into this game (this can differ from the Created timestamp, as other
         * events, such as issuing a beta key to the user, can associate the title to the user)
         */
        FirstLogin?: string;
        /** boolean indicating whether or not the user is currently banned for a title */
        isBanned?: boolean;
        /** timestamp for the last user login for this title */
        LastLogin?: string;
        /** source by which the user first joined the game, if known */
        Origination?: string;
        /** Title player account entity for this user */
        TitlePlayerAccount?: EntityKey;

    }

    export interface UserTwitchInfo {
        /** Twitch ID */
        TwitchId?: string;
        /** Twitch Username */
        TwitchUserName?: string;

    }

    export interface UserXboxInfo {
        /** XBox user ID */
        XboxUserId?: string;
        /** XBox user sandbox */
        XboxUserSandbox?: string;

    }

    export interface ValidateAmazonReceiptRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the fulfilled items. If null, defaults to the primary catalog. */
        CatalogVersion?: string;
        /** Currency used to pay for the purchase (ISO 4217 currency code). */
        CurrencyCode?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Amount of the stated currency paid, in centesimal units. */
        PurchasePrice: number;
        /** ReceiptId returned by the Amazon App Store in-app purchase API */
        ReceiptId: string;
        /** AmazonId of the user making the purchase as returned by the Amazon App Store in-app purchase API */
        UserId: string;

    }

    export interface ValidateAmazonReceiptResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Fulfilled inventory items and recorded purchases in fulfillment of the validated receipt transactions. */
        Fulfillments?: PurchaseReceiptFulfillment[];

    }

    export interface ValidateGooglePlayPurchaseRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the fulfilled items. If null, defaults to the primary catalog. */
        CatalogVersion?: string;
        /** Currency used to pay for the purchase (ISO 4217 currency code). */
        CurrencyCode?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Amount of the stated currency paid, in centesimal units. */
        PurchasePrice?: number;
        /** Original JSON string returned by the Google Play IAB API. */
        ReceiptJson: string;
        /** Signature returned by the Google Play IAB API. */
        Signature: string;

    }

    export interface ValidateGooglePlayPurchaseResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Fulfilled inventory items and recorded purchases in fulfillment of the validated receipt transactions. */
        Fulfillments?: PurchaseReceiptFulfillment[];

    }

    export interface ValidateIOSReceiptRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the fulfilled items. If null, defaults to the primary catalog. */
        CatalogVersion?: string;
        /** Currency used to pay for the purchase (ISO 4217 currency code). */
        CurrencyCode?: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Amount of the stated currency paid, in centesimal units. */
        PurchasePrice: number;
        /** Base64 encoded receipt data, passed back by the App Store as a result of a successful purchase. */
        ReceiptData: string;

    }

    export interface ValidateIOSReceiptResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Fulfilled inventory items and recorded purchases in fulfillment of the validated receipt transactions. */
        Fulfillments?: PurchaseReceiptFulfillment[];

    }

    export interface ValidateWindowsReceiptRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Catalog version of the fulfilled items. If null, defaults to the primary catalog. */
        CatalogVersion?: string;
        /** Currency used to pay for the purchase (ISO 4217 currency code). */
        CurrencyCode: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /** Amount of the stated currency paid, in centesimal units. */
        PurchasePrice: number;
        /** XML Receipt returned by the Windows App Store in-app purchase API */
        Receipt: string;

    }

    export interface ValidateWindowsReceiptResult extends PlayFabModule.IPlayFabResultCommon  {
        /** Fulfilled inventory items and recorded purchases in fulfillment of the validated receipt transactions. */
        Fulfillments?: PurchaseReceiptFulfillment[];

    }

    export interface ValueToDateModel {
        /** ISO 4217 code of the currency used in the purchases */
        Currency?: string;
        /**
         * Total value of the purchases in a whole number of 1/100 monetary units. For example, 999 indicates nine dollars and
         * ninety-nine cents when Currency is 'USD')
         */
        TotalValue: number;
        /**
         * Total value of the purchases in a string representation of decimal monetary units. For example, '9.99' indicates nine
         * dollars and ninety-nine cents when Currency is 'USD'.
         */
        TotalValueAsDecimal?: string;

    }

    export interface Variable {
        /** Name of the variable. */
        Name: string;
        /** Value of the variable. */
        Value?: string;

    }

    export interface VirtualCurrencyRechargeTime {
        /**
         * Maximum value to which the regenerating currency will automatically increment. Note that it can exceed this value
         * through use of the AddUserVirtualCurrency API call. However, it will not regenerate automatically until it has fallen
         * below this value.
         */
        RechargeMax: number;
        /** Server timestamp in UTC indicating the next time the virtual currency will be incremented. */
        RechargeTime: string;
        /** Time remaining (in seconds) before the next recharge increment of the virtual currency. */
        SecondsToRecharge: number;

    }

    export interface WriteClientCharacterEventRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Custom event properties. Each property consists of a name (string) and a value (JSON object). */
        Body?: { [key: string]: any };
        /** Unique PlayFab assigned ID for a specific character owned by a user */
        CharacterId: string;
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * The name of the event, within the namespace scoped to the title. The naming convention is up to the caller, but it
         * commonly follows the subject_verb_object pattern (e.g. player_logged_in).
         */
        EventName: string;
        /** The time (in UTC) associated with this event. The value defaults to the current time. */
        Timestamp?: string;

    }

    export interface WriteClientPlayerEventRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Custom data properties associated with the event. Each property consists of a name (string) and a value (JSON object). */
        Body?: { [key: string]: any };
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * The name of the event, within the namespace scoped to the title. The naming convention is up to the caller, but it
         * commonly follows the subject_verb_object pattern (e.g. player_logged_in).
         */
        EventName: string;
        /** The time (in UTC) associated with this event. The value defaults to the current time. */
        Timestamp?: string;

    }

    export interface WriteEventResponse extends PlayFabModule.IPlayFabResultCommon  {
        /**
         * The unique identifier of the event. The values of this identifier consist of ASCII characters and are not constrained to
         * any particular format.
         */
        EventId?: string;

    }

    export interface WriteTitleEventRequest extends PlayFabModule.IPlayFabRequestCommon {
        /** Custom event properties. Each property consists of a name (string) and a value (JSON object). */
        Body?: { [key: string]: any };
        /** The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.). */
        CustomTags?: { [key: string]: string | null };
        /**
         * The name of the event, within the namespace scoped to the title. The naming convention is up to the caller, but it
         * commonly follows the subject_verb_object pattern (e.g. player_logged_in).
         */
        EventName: string;
        /** The time (in UTC) associated with this event. The value defaults to the current time. */
        Timestamp?: string;

    }

    export interface XboxLiveAccountPlayFabIdPair {
        /** Unique PlayFab identifier for a user, or null if no PlayFab account is linked to the Xbox Live identifier. */
        PlayFabId?: string;
        /** Unique Xbox Live identifier for a user. */
        XboxLiveAccountId?: string;

    }


}

import { PlayFab } from "@/steam/bindings/PlayFabClientApi";

/**
 * @type {PlayFabClientModule.IPlayFabClient}
 */
const clientApi = PlayFab.ClientApi;
PlayFab.settings.titleId = "59813";

export function LoginWithSteam(ticket) {
  return makePromise(clientApi.LoginWithSteam, {
    SteamTicket: ticket,
    CreateAccount: true
  });
}

export function UpdateUserTitleDisplayName(displayName) {
  makeAuthorizedPromise(clientApi.UpdateUserTitleDisplayName, {
    DisplayName: displayName
  });
}

export function GetUserData() {
  return makeAuthorizedPromise(clientApi.GetUserData);
}

export function UpdateUserData(data) {
  return makeAuthorizedPromise(clientApi.UpdateUserData, {
    Data: data
  });
}

export function GetUserInventory() {
  return makeAuthorizedPromise(clientApi.GetUserInventory);
}

export function PurchaseItem(id, price, currency) {
  return makeAuthorizedPromise(clientApi.PurchaseItem, {
    ItemId: id,
    Price: price,
    VirtualCurrency: currency
  });
}

export function StartPurchase(itemId, quantity, annotation) {
  return makeAuthorizedPromise(clientApi.StartPurchase, {
    Items: [{
      ItemId: itemId,
      Quantity: quantity,
      Annotation: annotation
    }]
  });
}

export function PayForPurchase(orderId, currency, providerName) {
  return makeAuthorizedPromise(clientApi.PayForPurchase, {
    OrderId: orderId,
    Currency: currency,
    ProviderName: providerName
  });
}

export function ConfirmPurchase(orderId) {
  return makeAuthorizedPromise(clientApi.ConfirmPurchase, {
    OrderId: orderId
  });
}

export function ConsumeItem(itemInstanceId, consumeCount) {
  return makeAuthorizedPromise(clientApi.ConsumeItem, {
    ItemInstanceId: itemInstanceId,
    ConsumeCount: consumeCount
  });
}

export function AddUserVirtualCurrency(amount, virtualCurrency) {
  return makeAuthorizedPromise(clientApi.AddUserVirtualCurrency, {
    Amount: amount,
    VirtualCurrency: virtualCurrency
  });
}

/**
 * @template TRequest
 * @template TResponse
 * @param {(request: TRequest, callback: PlayFabModule.ApiCallback<TResponse>) => any} playFabFunction
 * @param {TRequest} [request]
 * @returns {Promise<TResponse>}
 */
function makeAuthorizedPromise(playFabFunction, request) {
  if (!clientApi.IsClientLoggedIn()) {
    return Promise.reject("PlayFab Client is not logged in.");
  }

  return makePromise(playFabFunction, request);
}

/**
 * So, apparently, PlayFab Web SDK is so bad, the promises they are
 * returning are not the actual promises for the api calls
 * (just take a look inside PlayFabClient.js). This wrapper
 * creates proper promises based on the callbacks.
 * @template TRequest
 * @template TResponse
 * @param {(request: TRequest, callback: PlayFabModule.ApiCallback<TResponse>) => any} playFabFunction
 * @param {TRequest} [request]
 * @returns {Promise<TResponse>}
 */
function makePromise(playFabFunction, request) {
  return new Promise((resolve, reject) => {
    playFabFunction(request ?? {}, (data, error) => {
      if (!error && data?.data) {
        resolve(data.data);
      } else {
        reject(error ?? data);
      }
    });
  });
}

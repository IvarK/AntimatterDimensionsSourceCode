import { MAC } from "@/env";
import { openExternalLink } from "@/utility/open-external-link";
import * as PlayFab from "./bindings/playfab";

export async function loginPlayFabWithSteam(ticket, screenName) {
  await PlayFab.LoginWithSteam(ticket);
  PlayFab.UpdateUserTitleDisplayName(screenName);
  validatePurchases();
  syncIAP();
}

export async function purchaseIAP(std) {
  const itemId = `${std}STD`;
  const quantity = 1;
  const annotation = "Purchased via in-game store";
  const order = await PlayFab.StartPurchase(itemId, quantity, annotation);

  const orderId = order.OrderId;
  const currency = "RM";
  const providerName = "Steam";
  const result = await PlayFab.PayForPurchase(orderId, currency, providerName);

  pendingValidations.push(result.OrderId);

  if (MAC) {
    const txnId = result.ProviderData;
    openExternalLink(`https://store.steampowered.com/checkout/approvetxn/${txnId}/?returnurl=steam`);
  }
}

let validateTimeout = 0;
let pendingValidations = [];
let isValidating = false;
let retryValidation = false;

export async function validatePurchases() {
  if (isValidating) {
    retryValidation = true;
    return;
  }

  clearTimeout(validateTimeout);
  isValidating = true;
  // Copy pendingValidations, because it will be modified in validatePurchase
  const orders = [...pendingValidations];
  for (const order of orders) {
    try {
      await validatePurchase(order);
    } catch {
      // Do nothing, will be retried.
    }
  }
  isValidating = false;
  const timeout = retryValidation ? 0 : 2000;
  validateTimeout = setTimeout(validatePurchases, timeout);
  retryValidation = false;
}

async function validatePurchase(orderId) {
  const confirm = await PlayFab.ConfirmPurchase(orderId);
  const purchaseName = confirm.Items[0].ItemId;
  const purchaseInstance = confirm.Items[0].ItemInstanceId;

  await PlayFab.ConsumeItem(purchaseInstance, 1);
  const stdsBought = Number(purchaseName.replace("STD", ""));
  pendingValidations = pendingValidations.filter(item => item !== orderId);
  await PlayFab.AddUserVirtualCurrency(stdsBought, "ST");
  GameUI.notify.info(`${stdsBought} STDs Obtained!`);
  syncIAP();
}

export function hasPendingPurchaseConfirmations() {
  return MAC && pendingValidations.length > 0;
}

async function syncIAP() {
  const userInventory = await PlayFab.GetUserInventory();
  ShopPurchaseData.totalSTD = userInventory.VirtualCurrency?.ST ?? 0;
  for (const key of Object.keys(GameDatabase.shopPurchases)) {
    const item = userInventory.Inventory.find(x => x.ItemId === key);
    ShopPurchaseData[key] = item?.RemainingUses ?? 0;
  }
  GameUI.update();

  const userData = await PlayFab.GetUserData();
  ShopPurchaseData.unlockedCosmetics = userData.Data.Cosmetics?.Value?.split(",") ?? [];
  GameUI.update();
}

export async function purchaseShopItem(key, cost, cosmeticId) {
  await PlayFab.PurchaseItem(key, cost, "ST");
  if (cosmeticId !== undefined) {
    await storeCosmetic(cosmeticId);
  }
  syncIAP();
}

async function storeCosmetic(id) {
  const userData = await PlayFab.GetUserData();
  const cosmetics = new Set(userData.Data?.Cosmetics?.Value?.split(",") ?? []);
  cosmetics.add(id);
  const updatedCosmetics = [...cosmetics];
  await PlayFab.UpdateUserData({
    Cosmetics: updatedCosmetics.join(",")
  });

  ShopPurchaseData.unlockedCosmetics = updatedCosmetics;
  GameUI.update();
}

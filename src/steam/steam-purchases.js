import { MAC } from "@/env";
import { openExternalLink } from "@/utility/open-external-link";
import * as PlayFab from "./bindings/playfab";

let pendingConfirmations = [];

export function hasPendingPurchaseConfirmations() {
  return MAC && pendingConfirmations.length > 0;
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

  pendingConfirmations.push(result.OrderId);

  if (MAC) {
    const txnId = result.ProviderData;
    openExternalLink(`https://store.steampowered.com/checkout/approvetxn/${txnId}/?returnurl=steam`);

    const macInterval = setInterval(() => {
      validatePurchases();
    }, 2000);

    setTimeout(() => {
      clearInterval(macInterval);
    }, 300000);
  }
}

export function validatePurchases() {
  for (const order of pendingConfirmations) {
    validatePurchase(order);
  }
}

async function validatePurchase(orderId) {
  const confirm = await PlayFab.ConfirmPurchase(orderId);
  const purchaseName = confirm.Items[0].ItemId;
  const purchaseInstance = confirm.Items[0].ItemInstanceId;

  await PlayFab.ConsumeItem(purchaseInstance, 1);
  const stdsBought = Number(purchaseName.replace("STD", ""));
  pendingConfirmations = pendingConfirmations.filter(item => item !== orderId);
  await PlayFab.AddUserVirtualCurrency(stdsBought, "ST");
  GameUI.notify.info(`${stdsBought} STDs Obtained!`);
  syncIAP();
}

export async function syncIAP() {
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

export async function purchaseShopItem(key, cost, cosmeticName) {
  await PlayFab.PurchaseItem(key, cost, "ST");
  await storeCosmetic(cosmeticName);
  syncIAP();
}

async function storeCosmetic(name) {
  if (name === undefined) {
    return;
  }

  const cosmetic = Object.values(GameDatabase.reality.glyphCosmeticSets)
    .find(x => x.name === name);
  if (cosmetic === undefined) {
    GameUI.notify.error(`Failed to store cosmetic "${name}"`);
    return;
  }

  const userData = await PlayFab.GetUserData();
  const cosmetics = new Set(userData.Data?.Cosmetics?.Value?.split(",") ?? []);
  cosmetics.add(cosmetic.id);
  const updatedCosmetics = [...cosmetics];
  await PlayFab.UpdateUserData({
    Cosmetics: updatedCosmetics.join(",")
  });

  ShopPurchaseData.unlockedCosmetics = updatedCosmetics;
  GameUI.update();
}

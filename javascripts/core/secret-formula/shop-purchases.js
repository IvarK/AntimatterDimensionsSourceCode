import { GameDatabase } from "./game-database";

// NOTE: IF ANY COSTS ARE CHANGED HERE, THEY ALSO NEED TO BE CHANGED ON THE BACKEND TOO
GameDatabase.shopPurchases = {
  dimPurchases: {
    key: "dimPurchases",
    cost: 30,
    description: "Double all your Antimatter Dimension multipliers. Forever.",
    multiplier: purchases => Math.pow(2, purchases)
  },
  IPPurchases: {
    key: "IPPurchases",
    cost: 40,
    description: "Double your Infinity Point gain from all sources. (additive)",
    multiplier: purchases => (purchases === 0 ? 1 : 2 * purchases),
  },
  EPPurchases: {
    key: "EPPurchases",
    cost: 50,
    description: "Triple your Eternity Point gain from all sources. (additive)",
    multiplier: purchases => (purchases === 0 ? 1 : 3 * purchases),
  },
  RMPurchases: {
    key: "RMPurchases",
    cost: 60,
    description: "Increase your Reality Machine gain by 100%. (additive)",
    multiplier: purchases => purchases + 1,
    formatEffect: x => formatX(x, 2),
  },
  allDimPurchases: {
    key: "allDimPurchases",
    cost: 60,
    description: "Double ALL Dimension multipliers (Antimatter, Infinity, Time) (multiplicative until 32x). Forever.",
    multiplier: purchases => (purchases > 4 ? 32 + (purchases - 5) * 2 : Math.pow(2, purchases)),
  },
  replicantiPurchases: {
    key: "replicantiPurchases",
    cost: 60,
    description: "Increase your Replicanti gain by 50%. (additive)",
    multiplier: purchases => (purchases === 0 ? 1 : 1 + 0.5 * purchases),
    formatEffect: x => formatX(x, 2, 1),
  },
  dilatedTimePurchases: {
    key: "dilatedTimePurchases",
    cost: 40,
    description: "Increase your Dilated Time gain by 50%. (additive)",
    multiplier: purchases => (purchases === 0 ? 1 : 1 + 0.5 * purchases),
    formatEffect: x => formatX(x, 2, 1),
  },
  smallTimeSkip: {
    key: "smallTimeSkip",
    cost: 10,
    description: "Get 6 hours worth of offline production. (Autobuyers don't work at full speed)",
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseTimeSkip();
    }
  },
  bigTimeSkip: {
    key: "bigTimeSkip",
    cost: 20,
    description: "Get 24 hours worth of offline production. (Autobuyers don't work at full speed)",
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseLongerTimeSkip();
    }
  },
  singleCosmeticSet: {
    key: "singleCosmeticSet",
    cost: 20,
    description: "Unlock a Glyph cosmetic set of your choice",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      GameUI.notify.info(
        `You have purchased the "${GlyphAppearanceHandler.chosenFromModal.name}" Set for Glyph cosmetics!`,
        10000);
      GlyphAppearanceHandler.chosenFromModal = null;
      GlyphAppearanceHandler.applyNotification();
    }
  },
  allCosmeticSets: {
    key: "allCosmeticSets",
    cost: () => {
      // Both of these are also on the payment backend, which would need to be changed as well
      const baseCost = 420;
      const totalSets = Object.keys(GameDatabase.reality.glyphCosmeticSets).length;

      // Using this instead of the actual set count maintains consistency with the backend price,
      // at the cost of the frontend UI being wrong for cheated saves
      const currentSetCount = GlyphAppearanceHandler.expectedSetCount;
      return Math.floor(baseCost * (totalSets - currentSetCount) / totalSets);
    },
    description: "Unlock all remaining Glyph cosmetic sets at once",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      GameUI.notify.info(`You have unlocked all sets for Glyph cosmetics!`, 15000);
      GlyphAppearanceHandler.applyNotification();
    }
  },
};

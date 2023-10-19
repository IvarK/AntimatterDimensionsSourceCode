import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class ChargedInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

export class InfinityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      // This applies the 4th column of infinity upgrades retroactively
      if (this.config.id.includes("skip")) skipResetsIfPossible();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_CHARGED);
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined;
  }

  get isCharged() {
    return player.celestials.ra.charged.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      Ra.chargesLeft !== 0 &&
      !Pelle.isDisabled("chargedInfinityUpgrades");
  }

  charge() {
    player.celestials.ra.charged.add(this.id);
  }

  disCharge() {
    player.celestials.ra.charged.delete(this.id);
  }
}

export function totalIPMult() {
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) {
    return DC.D1;
  }
  let ipMult = DC.D1
    .times(ShopPurchase.IPPurchases.currentMult)
    .timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
      InfinityUpgrade.ipMult,
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );
  ipMult = ipMult.times(Replicanti.amount.powEffectOf(AlchemyResource.exponential));
  return ipMult;
}

export function disChargeAll() {
  const upgrades = [
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.dim18mult,
    InfinityUpgrade.dim36mult,
    InfinityUpgrade.resetBoost,
    InfinityUpgrade.buy10Mult,
    InfinityUpgrade.dim27mult,
    InfinityUpgrade.dim45mult,
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.thisInfinityTimeMult,
    InfinityUpgrade.unspentIPMult,
    InfinityUpgrade.dimboostMult,
    InfinityUpgrade.ipGen
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.ra.disCharge = false;
  EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADES_DISCHARGED);
}

// The repeatable 2xIP upgrade has an odd cost structure - it follows a shallow exponential (step *10) up to e3M, at
// which point it follows a steeper one (step *1e10) up to e6M before finally hardcapping. At the hardcap, there's
// an extra bump that increases the multipler itself from e993k to e1M. All these numbers are specified in
// GameDatabase.infinity.upgrades.ipMult
class InfinityIPMultUpgrade extends GameMechanicState {
  get cost() {
    if (this.purchaseCount >= this.purchasesAtIncrease) {
      return this.config.costIncreaseThreshold
        .times(Decimal.pow(this.costIncrease, this.purchaseCount - this.purchasesAtIncrease));
    }
    return Decimal.pow(this.costIncrease, this.purchaseCount + 1);
  }

  get purchaseCount() {
    return player.IPMultPurchases;
  }

  get purchasesAtIncrease() {
    return this.config.costIncreaseThreshold.log10() - 1;
  }

  get hasIncreasedCost() {
    return this.purchaseCount >= this.purchasesAtIncrease;
  }

  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  }

  get isCapped() {
    return this.cost.gte(this.config.costCap);
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return Achievement(41).isUnlocked;
  }

  get canBeBought() {
    return !Pelle.isDoomed && !this.isCapped && Currency.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  }

  // This is only ever called with amount = 1 or within buyMax under conditions that ensure the scaling doesn't
  // change mid-purchase
  purchase(amount = 1) {
    if (!this.canBeBought) return;
    if (!TimeStudy(181).isBought) {
      Autobuyer.bigCrunch.bumpAmount(DC.D2.pow(amount));
    }
    Currency.infinityPoints.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    player.IPMultPurchases += amount;
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      // Only allow IP below the softcap to be used
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costIncreaseThreshold);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costCap);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0).toNumber();
      if (purchases <= 0) return;
      this.purchase(purchases);
    }
  }
}

export const InfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.upgrades,
  config => (config.id === "ipMult"
    ? new InfinityIPMultUpgrade(config)
    : new InfinityUpgradeState(config))
);

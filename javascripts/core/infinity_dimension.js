function infinityDimensionCommonMultiplier() {
  let mult = new Decimal(kongAllDimMult)
    .timesEffectsOf(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords
    );

  if (player.replicanti.unl && player.replicanti.amount.gt(1)) {
    mult = mult.times(replicantiMult());
  }
  return mult;
}

function resetInfDimensions() {

  if (player.infDimensionsUnlocked[0]) {
      player.infinityPower = new Decimal(0)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount.neq(0) && EternityChallenge(7).completions > 0){
      player.infinityDimension8.amount = new Decimal(player.infinityDimension8.baseAmount)
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount.neq(0)){
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount.neq(0)){
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount.neq(0)){
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount.neq(0)){
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount.neq(0)){
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount.neq(0)){
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount.neq(0)){
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }

}

function IDPurchasesToIDAmount(purchases) {
  // Because each ID purchase gives 10 IDs
  return purchases * 10;
}

function IDAmountToIDPurchases(baseAmount) {
  // Because each ID purchase gives 10 IDs
  return baseAmount / 10;
}

const initIDCost = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [null, 50, 30, 10, 5, 5, 5, 5, 5]
const HARDCAP_ID_PURCHASES = 2000000;

function buyManyInfinityDimension(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  dim.cost = Decimal.round(dim.cost.times(dim.costMultiplier));
  dim.power = dim.power.times(infPowerMults[tier])
  dim.power = dim.power.timesEffectsOf(tier === 8 ? GlyphSacrifice.infinity : null);
  dim.baseAmount += IDPurchasesToIDAmount(1)

  if (EternityChallenge(8).isRunning) {
    player.eterc8ids -= 1;
  }
  return true
}

function buyMaxInfDims(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  const costMult = dim.costMultiplier;

  let toBuy = Math.floor((player.infinityPoints.e - dim.cost.e) / Math.log10(costMult));
  const purchasesUntilHardcap = IDAmountToIDPurchases(dim.baseAmountCap - dim.baseAmount);
  toBuy = Math.min(toBuy, purchasesUntilHardcap);

  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  if (toBuy > 0) {
    const base = infPowerMults[tier] * Effects.product(tier === 8 ? GlyphSacrifice.infinity : null);
    dim.power = dim.power.times(Decimal.pow(base, toBuy));
  }
  dim.baseAmount += IDPurchasesToIDAmount(toBuy);
  buyManyInfinityDimension(tier)
}

function canBuyInfinityDimension(tier) {
  const dim = InfinityDimension(tier);
  return !dim.isCapped && dim.isAvailableForPuchase && dim.isUnlocked;

}

function buyMaxInfinityDimensions() {
  if (EternityChallenge(8).isRunning) return false;
  for (let tier of Array.dimensionTiers) {
    buyMaxInfDims(tier)
  }
}

function toggleAllInfDims() {
  const areEnabled = player.infDimBuyers[0];
  for (let i = 1; i < 9; i++) {
    player.infDimBuyers[i - 1] = !areEnabled;
  }
}

class InfinityDimensionState {
  constructor(tier) {
    this._props = player[`infinityDimension${tier}`];
    this._tier = tier;
    this._purchaseCap = tier === 8 ? Number.MAX_VALUE : HARDCAP_ID_PURCHASES;
    const UNLOCK_REQUIREMENTS = [
      undefined,
      new Decimal("1e1100"),
      new Decimal("1e1900"),
      new Decimal("1e2400"),
      new Decimal("1e10500"),
      new Decimal("1e30000"),
      new Decimal("1e45000"),
      new Decimal("1e54000"),
      new Decimal("1e60000"),
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
  }

  get tier() {
    return this._tier;
  }

  get cost() {
    return this._props.cost;
  }

  set cost(value) {
    this._props.cost = value;
  }

  get amount() {
    return this._props.amount;
  }

  set amount(value) {
    this._props.amount = value;
  }

  get bought() {
    return this._props.bought;
  }

  set bought(value) {
    this._props.bought = value;
  }

  get power() {
    return this._props.power;
  }

  set power(value) {
    this._props.power = value;
  }

  get baseAmount() {
    return this._props.baseAmount;
  }

  set baseAmount(value) {
    this._props.baseAmount = value;
  }

  get isUnlocked() {
    return player.infDimensionsUnlocked[this._tier - 1];
  }

  set isUnlocked(value) {
    player.infDimensionsUnlocked[this._tier - 1] = value;
  }

  get requirement() {
    return this._unlockRequirement;
  }

  get isAutobuyerUnlocked() {
    return player.eternities >= 10 + this._tier;
  }

  get isAvailableForPuchase() {
    return this.isAffordable && (player.eterc8ids > 0 || !EternityChallenge(8).isRunning);
  }

  get isAffordable() {
    return player.infinityPoints.gte(this.cost);
  }

  get hasRateOfChange() {
    return this._tier < 8 || EternityChallenge(7).completions > 0;
  }

  get rateOfChange() {
    const tier = this._tier;
    let toGain = new Decimal(0);
    if (tier === 8) {
      EternityChallenge(7).reward.applyEffect(v => toGain = v);
    }
    else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupFactor());
  }

  get productionPerSecond() {
    if (EternityChallenge(10).isRunning) {
      return new Decimal(0);
    }
    let production = this.amount;
    if (EternityChallenge(11).isRunning) {
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.dividedBy(Tickspeed.current.dividedBy(1000));
    }
    return production
      .timesEffectOf(InfinityChallenge(6).reward)
      .times(this.multiplier);
  }

  get multiplier() {
    const tier = this._tier;

    if (Laitela.isRunning && tier > 1) {
      return new Decimal(0)
    }

    if (EternityChallenge(2).isRunning) {
      return new Decimal(0);
    }
    if (EternityChallenge(11).isRunning) {
      return new Decimal(1);
    }
    let mult = this.power
      .times(GameCache.infinityDimensionCommonMultiplier.value)
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );

    mult = mult.clampMin(0);

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5)
    } else if (Laitela.isRunning) {
      mult = mult.pow(0.01)
    }

    return mult;
  }

  get costMultiplier() {
    let costMult = infCostMults[this._tier];
    EternityChallenge(12).reward.applyEffect(v => costMult = Math.pow(costMult, v));
    return costMult;
  }

  get purchaseCap() {
    return Enslaved.isRunning ? 1 : this._purchaseCap;
  }

  get baseAmountCap() {
    return this.purchaseCap * 10;
  }

  get isCapped() {
    return this.baseAmount >= this.baseAmountCap;
  }

  get hardcapIPAmount() {
    const initCost = new Decimal(initIDCost[this._tier]);
    return initCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }
}

function InfinityDimension(tier) {
  return new InfinityDimensionState(tier);
}

InfinityDimension.unlockNext = function() {
  if (InfinityDimension(8).isUnlocked) return;
  const next = InfinityDimension.next();
  if (!Perk.bypassIDAntimatter.isBought && player.money.lt(next.requirement)) return;
  next.isUnlocked = !next.isUnlocked;
  EventHub.dispatch(GameEvent.INFINITY_DIMENSION_UNLOCKED, next.tier);
};

InfinityDimension.next = function() {
  if (InfinityDimension(8).isUnlocked)
    throw "All Infinity Dimensions are unlocked";
  return Array.dimensionTiers
    .map(InfinityDimension)
    .first(dim => !dim.isUnlocked);
};

function tryUnlockInfinityDimensions() {
  if (player.eternities < 25 || InfinityDimension(8).isUnlocked) return;
  for (let tier = 1; tier <= 8; ++tier) {
    if (InfinityDimension(tier).isUnlocked) continue;
    if (Perk.bypassIDAntimatter.isBought || InfinityDimension(tier).requirement.lt(player.money)) {
      InfinityDimension(tier).isUnlocked = true;
      EventHub.dispatch(GameEvent.INFINITY_DIMENSION_UNLOCKED, tier);
      if (player.infDimBuyers[tier - 1] &&
        !EternityChallenge(2).isRunning && !EternityChallenge(8).isRunning && !EternityChallenge(10).isRunning) {
        buyMaxInfDims(tier);
      }
    }
  }
}

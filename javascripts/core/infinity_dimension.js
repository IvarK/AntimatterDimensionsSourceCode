function resetInfDimensions() {

  if (player.infDimensionsUnlocked[0]) {
      player.infinityPower = new Decimal(0)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0 && ECTimesCompleted("eterc7") > 0){
      player.infinityDimension8.amount = new Decimal(player.infinityDimension8.baseAmount)
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0){
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount != 0){
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount != 0){
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount != 0){
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount != 0){
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount != 0){
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount != 0){
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
const HARDCAP_ID_BASE_AMOUNT = IDPurchasesToIDAmount(HARDCAP_ID_PURCHASES);

function buyManyInfinityDimension(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  dim.cost = Decimal.round(dim.cost.times(dim.costMultiplier));
  if (tier == 8) dim.power = dim.power.times(infPowerMults[tier] * getGlyphSacEffect("infinity"))
  else dim.power = dim.power.times(infPowerMults[tier])
  dim.baseAmount += IDPurchasesToIDAmount(1)

  if (player.currentEternityChall == "eterc8") {
    player.eterc8ids -= 1;
  }
  return true
}

function buyMaxInfDims(tier) {
  if (!canBuyInfinityDimension(tier)) return false;
  const dim = InfinityDimension(tier);
  const costMult = dim.costMultiplier;

  var toBuy = Math.floor((player.infinityPoints.e - dim.cost.e) / Math.log10(costMult))
  if (tier !== 8) {
    const purchasesUntilHardcap = IDAmountToIDPurchases(HARDCAP_ID_BASE_AMOUNT - dim.baseAmount);
    toBuy = Math.min(toBuy, purchasesUntilHardcap);
  }
  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  if (toBuy > 0) {
    if (tier == 8) dim.power = dim.power.times(Decimal.pow(infPowerMults[tier] * getGlyphSacEffect("infinity"), toBuy))
    else dim.power = dim.power.times(Decimal.pow(infPowerMults[tier], toBuy))
  }
  dim.baseAmount += IDPurchasesToIDAmount(toBuy);
  buyManyInfinityDimension(tier)
}

function canBuyInfinityDimension(tier) {
  const dim = InfinityDimension(tier);
  if (dim.isCapped) return false;
  if (!dim.isAffordable) return false;
  if (player.currentEternityChall === "eterc8" && player.eterc8ids <= 0) return false;
  return true;
}

function buyMaxInfinityDimensions() {
    if (player.currentEternityChall == "eterc8") return false;
    for (var i=1; i<9; i++) {
        buyMaxInfDims(i)
    }
  }

function toggleAllInfDims() {
  const areEnabled = player.infDimBuyers[0];
  for (let i = 1; i < 9; i++) {
    player.infDimBuyers[i - 1] = !areEnabled;
  }
}

var infDimPow = 1


class InfinityDimensionInfo {
  constructor(tier) {
    this._props = player[`infinityDimension${tier}`];
    this._tier = tier;
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
    return player.infDimensionsUnlocked[this._tier - 1] || player.eternities >= 25;
  }

  get requirement() {
    return InfinityDimensionInfo.requirements[this._tier];
  }

  get isAutobuyerUnlocked() {
    return player.eternities >= 10 + this._tier;
  }

  get isAffordable() {
    return player.infinityPoints.gte(this.cost);
  }

  get hasRateOfChange() {
    return this._tier < 8 || ECTimesCompleted("eterc7") > 0;
  }

  get rateOfChange() {
    const tier = this._tier;
    let toGain = 0;
    if (tier === 8) {
      const ec7Completions = ECTimesCompleted("eterc7");
      if (ec7Completions) {
        toGain = TimeDimension(1).productionPerSecond.pow(ec7Completions * 0.2).minus(1).max(0)
      }
    }
    else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get productionPerSecond() {
    if (player.currentEternityChall === "eterc10") {
      return new Decimal(0);
    }
    let production = this.amount;
    if (player.currentEternityChall === "eterc11") {
      return production;
    }
    if (player.currentEternityChall === "eterc7") {
      production = production.dividedBy(player.tickspeed.dividedBy(1000));
    }
    if (player.challenges.includes("postc6")) {
      let tick = player.dilation.active ? dilatedTickspeed() : player.tickspeed;
      tick = new Decimal(1).dividedBy(tick);
      production = production.times(tick.times(1000).pow(0.0005))
    }
    return production.times(this.multiplier)
  }

  get multiplier() {
    const tier = this._tier;
    if (player.currentEternityChall === "eterc2") {
      return new Decimal(0);
    }
    if (player.currentEternityChall === "eterc11") {
      return new Decimal(1);
    }
    let mult = this.power;
    mult = mult.times(infDimPow);
    mult = mult.times(kongAllDimMult);

    if (isAchEnabled("r94") && tier === 1) mult = mult.times(2);
    if (isAchEnabled("r75")) mult = mult.times(player.achPow);

    if (player.replicanti.unl && player.replicanti.amount.gt(1)) {
      mult = mult.times(replicantiMult());
    }

    if (player.timestudy.studies.includes(72) && tier === 4) {
      mult = mult.times(Sacrifice.totalBoost.pow(0.04).max(1).min("1e30000"))
    }

    if (player.timestudy.studies.includes(82)) {
      mult = mult.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)))
    }

    if (player.eternityUpgrades.includes(1)) {
      mult = mult.times(player.eternityPoints.max(1))
    }

    if (player.eternityUpgrades.includes(2)) {
      mult = mult.times(Decimal.pow(Math.min(player.eternities, 100000)/200 + 1, Math.log(Math.min(player.eternities, 100000)*2+1)/Math.log(4)).times(new Decimal((player.eternities-100000)/200 + 1).times(Math.log((player.eternities- 100000)*2+1)/Math.log(4)).max(1)))
    }

    if (player.eternityUpgrades.includes(3)) {
      mult = mult.times(Decimal.pow(2,30000/Math.max(infchallengeTimes, isAchEnabled("r112") ? 610 : 750)))
    }

    if (player.timestudy.studies.includes(92)) {
      mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity/100, 20)))
    }
    if (player.timestudy.studies.includes(162)) {
      mult = mult.times(1e11)
    }

    if (tier === 1) {
      EternityChallenge(2).applyReward(value => mult = mult.times(value));
    }

    EternityChallenge(4).applyReward(value => mult = mult.times(value));
    EternityChallenge(9).applyReward(value => mult = mult.times(value));

    mult = mult.max(0);

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    mult = mult.pow(new Decimal(1).max(getAdjustedGlyphEffect("infinitypow")));

    return mult;
  }

  get costMultiplier() {
    let costMult = infCostMults[this._tier];
    EternityChallenge(12).applyReward(value => costMult = Math.pow(costMult, value));
    return costMult;
  }

  get isCapped() {
    return this._tier < 8 && this.baseAmount >= HARDCAP_ID_BASE_AMOUNT;
  }

  get hardcapIPAmount() {
    const initCost = new Decimal(initIDCost[this._tier]);
    return initCost.times(Decimal.pow(this.costMultiplier, HARDCAP_ID_PURCHASES));
  }
}

InfinityDimensionInfo.requirements = [
  null,
  new Decimal("1e1100"),
  new Decimal("1e1900"),
  new Decimal("1e2400"),
  new Decimal("1e10500"),
  new Decimal("1e30000"),
  new Decimal("1e45000"),
  new Decimal("1e54000"),
  new Decimal("1e60000")
];

function InfinityDimension(tier) {
  return new InfinityDimensionInfo(tier);
}

InfinityDimension.nextRequirement = function() {
  if (InfinityDimension(8).isUnlocked)
    throw "All Infinity Dimensions are unlocked";
  return Array.dimensionTiers
    .map(tier => InfinityDimension(tier))
    .first(dim => !dim.isUnlocked)
    .requirement;
};
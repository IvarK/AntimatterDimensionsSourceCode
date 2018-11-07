var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]
var timeDimIncScalingAmts = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456]

function buyTimeDimension(tier, upd, threshold) {
  if (upd === undefined) upd = true
  if (threshold == undefined) threshold = 1

  const dim = TimeDimension(tier);
  if (tier > 4 && !player.dilation.studies.includes(tier-3)) return false
  if (player.eternityPoints.lt(dim.cost.times(1/threshold))) return false

  player.eternityPoints = player.eternityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(1);
  dim.bought += 1
  dim.cost = Decimal.pow(timeDimCostMults[tier], dim.bought).times(timeDimStartCosts[tier])
  if (dim.cost.gte(Number.MAX_VALUE)) {
      dim.cost = Decimal.pow(timeDimCostMults[tier]*1.5, dim.bought).times(timeDimStartCosts[tier])
  }
  if (dim.cost.gte("1e1300")) {
    dim.cost = Decimal.pow(timeDimCostMults[tier]*2.2, dim.bought).times(timeDimStartCosts[tier])
  }
  if (dim.cost.gte("1e6000")) {
    dim.cost = Decimal.pow(timeDimCostMults[tier]*2.2, dim.bought + Math.pow(dim.bought-timeDimIncScalingAmts[tier], 1.3)).times(timeDimStartCosts[tier])
  }
  if (tier > 4) {
    dim.cost = Decimal.pow(timeDimCostMults[tier]*100, dim.bought).times(timeDimStartCosts[tier])
    if (dim.cost.gte("1e6000")) {
      dim.cost = Decimal.pow(timeDimCostMults[tier]*100, dim.bought + Math.pow(dim.bought-timeDimIncScalingAmts[tier], 1.3)).times(timeDimStartCosts[tier])
    }
  }
  if (tier == 8) dim.power = dim.power.times(2 * getGlyphSacEffect("time"))
  else dim.power = dim.power.times(2)
  if (upd) updateEternityUpgrades()
  return true
}

function resetTimeDimensions() {
  for (var i=1; i<9; i++) {
      var dim = player["timeDimension"+i]
      dim.amount = new Decimal(dim.bought)
  }

}

function toggleAllTimeDims() {
  const areEnabled = player.reality.tdbuyers[0];
  for (let i = 1; i < 9; i++) {
    player.reality.tdbuyers[i - 1] = !areEnabled;
  }
}

function buyMaxTimeDims(tier) {
  while(buyTimeDimension(tier, false)) continue
  updateEternityUpgrades()
}

function buyMaxTimeDimensions(threshold) {
  if (player.eternityPoints.gte(1e10)) {  // Default behavior: Buy as many as possible, starting with the highest dimension first (reduces overhead at higher EP)
    if (threshold == undefined) threshold = 1
    for(var i=8; i>0; i--) while(buyTimeDimension(i, false, threshold)) continue
  }
  else {  // Low EP behavior: Try to buy the highest affordable new dimension, then loop buying the cheapest possible
    for (let i=4; i > 0 && player["timeDimension"+i].bought == 0; i--)
      buyTimeDimension(i, false, threshold);
    
    for (let stop = 0; stop < 1000; stop++) { // Should never take more than like 50 iterations; explicit infinite loops make me nervous
      let cheapestDim = 1;
      let cheapestCost = player["timeDimension1"].cost;
      for (let i = 2; i <= 4; i++) {
        if (player["timeDimension"+i].cost.lte(player["timeDimension"+cheapestDim].cost)) {
          cheapestDim = i;
          cheapestCost = player["timeDimension"+cheapestDim].cost;
        }
      }
      let bought = false;
      if (player.eternityPoints.gte(cheapestCost))
        bought = buyTimeDimension(cheapestDim, false, threshold);
      if (!bought)
        break;
    }
  }
  updateEternityUpgrades()
}

class TimeDimensionInfo {
  constructor(tier) {
    this._props = player[`timeDimension${tier}`];
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

  get power() {
    return this._props.power;
  }

  set power(value) {
    this._props.power = value;
  }

  get bought() {
    return this._props.bought;
  }

  set bought(value) {
    this._props.bought = value;
  }

  get isUnlocked() {
    return this._tier < 5 || player.dilation.studies.includes(this._tier - 3);
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;
    if (player.currentEternityChall === "eterc11") return new Decimal(1);
    let mult = this.power.pow(2);

    if (player.timestudy.studies.includes(11) && tier === 1) {
      mult = mult.dividedBy(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).max(Decimal.fromMantissaExponent(1, -2500)));
    }
    if (isAchEnabled("r105")) {
      mult = mult.div(player.tickspeed.div(1000).pow(0.000005));
    }

    mult = mult.times(kongAllDimMult);

    if (player.eternityUpgrades.includes(4)) {
      mult = mult.times(player.achPow);
    }
    if (player.eternityUpgrades.includes(5)) {
      mult = mult.times(Math.max(player.timestudy.theorem, 1));
    }
    if (player.eternityUpgrades.includes(6)) {
      mult = mult.times(player.totalTimePlayed / 1000 / 60 / 60 / 24);
    }
    if (player.timestudy.studies.includes(73) && tier === 3) {
      mult = mult.times(Sacrifice.totalBoost.pow(0.005).min(new Decimal("1e1300")));
    }
    if (player.timestudy.studies.includes(93)) {
      mult = mult.times(Decimal.pow(player.totalTickGained, 0.25).max(1));
    }
    if (player.timestudy.studies.includes(103)) {
      mult = mult.times(Math.max(player.replicanti.galaxies, 1));
    }
    if (player.timestudy.studies.includes(151)) {
      mult = mult.times(1e4);
    }
    if (player.timestudy.studies.includes(221)) {
      mult = mult.times(Decimal.pow(1.0025, player.resets));
    }
    if (player.timestudy.studies.includes(227) && tier === 4) {
      mult = mult.times(Math.max(Math.pow(Sacrifice.totalBoost.log10(), 10), 1));
    }
    if (player.currentEternityChall === "eterc9") {
      mult = mult.times((Decimal.pow(Math.max(player.infinityPower.pow((7 + getAdjustedGlyphEffect("infinityrate")) / 7).log2(), 1), 4)).max(1));
    }

    EternityChallenge(1).applyReward(value => mult = mult.times(value));

    let ec10bonus = new Decimal(1);
    EternityChallenge(10).applyReward(value => ec10bonus = value);
    if (player.timestudy.studies.includes(31)) {
      ec10bonus = ec10bonus.pow(4);
    }
    mult = mult.times(ec10bonus);
    if (isAchEnabled("r128")) {
      mult = mult.times(Math.max(player.timestudy.studies.length, 1));
    }

    if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.dilation.upgrades.includes(5)) {
      let replmult = Decimal.pow(Decimal.log2(player.replicanti.amount), 2);
      if (player.timestudy.studies.includes(21)) {
        replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032));
      }
      if (player.timestudy.studies.includes(102)) {
        replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies));
      }
      mult = mult.times(replmult.pow(0.1));
    }

    if (player.reality.upg.includes(22)) {
      let days = player.thisReality / (1000 * 60 * 60 * 24);
      mult = mult.times(Decimal.pow(10,  Math.pow(1 + 2*Math.log10(days + 1), 1.6)));
    }

    mult = mult.max(0);
    mult = mult.pow(new Decimal(1).max(getAdjustedGlyphEffect("timepow")));

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    return mult;
  }

  get productionPerSecond() {
    if (player.currentEternityChall === "eterc1" || player.currentEternityChall === "eterc10") {
      return new Decimal(0);
    }
    if (player.currentEternityChall === "eterc11") {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (player.currentEternityChall === "eterc7") {
      production = production.dividedBy(player.tickspeed.dividedBy(1000));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return new Decimal(0);
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }
}

function TimeDimension(tier) {
  return new TimeDimensionInfo(tier);
}
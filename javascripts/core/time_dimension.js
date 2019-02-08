var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]
var timeDimIncScalingAmts = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456]

function buyTimeDimension(tier, upd, threshold) {
  if (upd === undefined) upd = true
  if (threshold == undefined) threshold = 1

  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false
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
  if (tier == 8) dim.power = dim.power.times(2 * Effects.product(GlyphSacrifice.time))
  else dim.power = dim.power.times(2)
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
}

class TimeDimensionState {
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
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;
    if (player.currentEternityChall === "eterc11") return new Decimal(1);
    let mult = this.power
      .pow(2)
      .times(kongAllDimMult)
      .timesEffectsOf(
        Achievement(105),
        Achievement(128),
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        TimeStudy(93),
        TimeStudy(103),
        TimeStudy(151),
        TimeStudy(221),
        tier === 4 ? TimeStudy(227) : null,
        EternityChallenge(1).reward,
        EternityChallenge(10).reward,
        EternityUpgrade.tdMultAchs,
        EternityUpgrade.tdMultTheorems,
        EternityUpgrade.tdMultRealTime,
        player.replicanti.unl && player.replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null
      );
    if (player.currentEternityChall === "eterc9") {
      mult = mult.times((Decimal.pow(Math.max(player.infinityPower.pow((7 + getAdjustedGlyphEffect("infinityrate")) / 7).log2(), 1), 4)).max(1));
    }

    if (player.reality.upg.includes(22)) {
      let days = player.thisReality / (1000 * 60 * 60 * 24);
      mult = mult.times(Decimal.pow(10,  Math.pow(1 + 2*Math.log10(days + 1), 1.6)));
    }

    mult = mult.clampMin(0).pow(new Decimal(1).max(getAdjustedGlyphEffect("timepow")));

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }
    
    if (Teresa.isRunning) {
      mult = Teresa.multiplier(mult);
    }

    return mult;
  }

  get productionPerSecond() {
    if (player.currentEternityChall === "eterc1" || player.currentEternityChall === "eterc10" || Enslaved.isRunning) {
      return new Decimal(0);
    }
    if (player.currentEternityChall === "eterc11") {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(7).isRunning) {
      production = production.dividedBy(Tickspeed.current.dividedBy(1000));
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
    return toGain.times(10).dividedBy(current).times(getGameSpeedupFactor());
  }
}

function TimeDimension(tier) {
  return new TimeDimensionState(tier);
}
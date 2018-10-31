//time dimensions

function getTimeDimensionPower(tier) {
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  var dim = player["timeDimension"+tier]
  var ret = dim.power.pow(2)

  if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.dividedBy(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).max(Decimal.fromMantissaExponent(1, -2500)))
  if (isAchEnabled("r105")) ret = ret.div(player.tickspeed.div(1000).pow(0.000005))

  ret = ret.times(kongAllDimMult)

  if (player.eternityUpgrades.includes(4)) ret = ret.times(player.achPow)
  if (player.eternityUpgrades.includes(5)) ret = ret.times(Math.max(player.timestudy.theorem, 1))
  if (player.eternityUpgrades.includes(6)) ret = ret.times(player.totalTimePlayed / 1000 / 60 / 60 / 24)
  if (player.timestudy.studies.includes(73) && tier == 3) ret = ret.times(calcTotalSacrificeBoost().pow(0.005).min(new Decimal("1e1300")))
  if (player.timestudy.studies.includes(93)) ret = ret.times(Decimal.pow(player.totalTickGained, 0.25).max(1))
  if (player.timestudy.studies.includes(103)) ret = ret.times(Math.max(player.replicanti.galaxies, 1))
  if (player.timestudy.studies.includes(151)) ret = ret.times(1e4)
  if (player.timestudy.studies.includes(221)) ret = ret.times(Decimal.pow(1.0025, player.resets))
  if (player.timestudy.studies.includes(227) && tier == 4) ret = ret.times(Math.max(Math.pow(calcTotalSacrificeBoost().log10(), 10), 1))
  if (player.currentEternityChall == "eterc9") ret = ret.times((Decimal.pow(Math.max(player.infinityPower.pow((7 + getAdjustedGlyphEffect("infinityrate")) / 7).log2(), 1), 4)).max(1))
  if (ECTimesCompleted("eterc1") !== 0) ret = ret.times(Math.pow(Math.max(player.thisEternity*10, 0.9), 0.3+(ECTimesCompleted("eterc1")*0.05)))
  let ec10bonus = new Decimal(1)
  if (ECTimesCompleted("eterc10") !== 0) ec10bonus = new Decimal(Math.max(Math.pow(getInfinitied(), 0.9) * ECTimesCompleted("eterc10") * 0.000002+1, 1))
  if (player.timestudy.studies.includes(31)) ec10bonus = ec10bonus.pow(4)
  ret = ret.times(ec10bonus)
  if (isAchEnabled("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))

  if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.dilation.upgrades.includes(5)) {
    var replmult = Decimal.pow(Decimal.log2(player.replicanti.amount), 2)

    if (player.timestudy.studies.includes(21)) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
    if (player.timestudy.studies.includes(102)) replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies))

    ret = ret.times(replmult.pow(0.1))
  }

  let days = player.thisReality / (1000 * 60 * 60 * 24);
  if (player.reality.upg.includes(22)) ret = ret.times(Decimal.pow(10,  Math.pow(1 + 2*Math.log10(days + 1), 1.6)))

  if (ret.lt(0)) {
    ret = new Decimal(0)
  }

  ret = ret.pow(new Decimal(1).max(getAdjustedGlyphEffect("timepow")))
  

  if (player.dilation.active) {
    ret = Decimal.pow(10, Math.pow(ret.log10(), 0.75))
    if (player.dilation.upgrades.includes(9)) {
      ret = Decimal.pow(10, Math.pow(ret.log10(), 1.05))
    }
  }

  

  return ret

}


function getTimeDimensionProduction(tier) {
  if (player.currentEternityChall == "eterc10") return new Decimal(0)
  var dim = player["timeDimension"+tier]
  if (player.currentEternityChall == "eterc11") return dim.amount
  var ret = dim.amount
  ret = ret.times(getTimeDimensionPower(tier))
  if (player.currentEternityChall == "eterc7") {
      ret = ret.dividedBy(player.tickspeed.dividedBy(1000))
  }
  if (player.currentEternityChall == "eterc1") return new Decimal(0)
  return ret
}


function getTimeDimensionRateOfChange(tier) {
  let toGain = getTimeDimensionProduction(tier+1)
  var current = Decimal.max(player["timeDimension"+tier].amount, 1);
  var change  = toGain.times(10).dividedBy(current);
  return change;
}

var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]
var timeDimIncScalingAmts = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456]

function buyTimeDimension(tier, upd, threshold) {
  if (upd === undefined) upd = true
  if (threshold == undefined) threshold = 1

  var dim = player["timeDimension"+tier]
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

  }
}

function TimeDimension(tier) {
  return new TimeDimensionInfo(tier);
}
//infinity dimensions


function DimensionDescription(tier) {
  var name = TIER_NAMES[tier];

  let description = shortenDimensions(player['infinityDimension'+tier].amount) + ' (' + player['infinityDimension'+tier].bought + ')';

  if (ECTimesCompleted("eterc7")) {
    if (tier < 9) {
        description += '  (+' + shorten(DimensionRateOfChange(tier)) + '%/s)';
    }
  } else {
    if (tier < 8) {
        description += '  (+' + shorten(DimensionRateOfChange(tier)) + '%/s)';
    }
  }

  return description;
}


function DimensionRateOfChange(tier) {
  if (tier === 8) var toGain = getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).minus(1).max(0)
  else var toGain = DimensionProduction(tier+1)
  var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
  var change  = toGain.times(10).dividedBy(current);
  return change;
}




function updateInfinityDimensions() {
  if (document.getElementById("infinitydimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 8; ++tier) {
        document.getElementById("infD"+tier).textContent = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenMoney(DimensionPower(tier));
        document.getElementById("infAmount"+tier).textContent = DimensionDescription(tier);
        var name = TIER_NAMES[tier];
        if (!player.infDimensionsUnlocked[tier-1]) {
            break;
        }

        document.getElementById("infRow"+tier).style.display = "table-row";
        document.getElementById("infRow"+tier).style.visibility = "visible";
    }
  }
}

function DimensionProduction(tier) {
  if (player.currentEternityChall == "eterc10") return new Decimal(0)
  var dim = player["infinityDimension"+tier]
  var ret = dim.amount
  if (player.currentEternityChall == "eterc11") return ret
  if (player.currentEternityChall == "eterc7") ret = ret.dividedBy(player.tickspeed.dividedBy(1000))
  if (player.challenges.includes("postc6")) {
      let tick = new Decimal(player.tickspeed)
      if (player.dilation.active) {
        tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 0.75))
        if (player.dilation.upgrades.includes(9)) {
          tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 1.05))
        }
      }
      tick = new Decimal(1).dividedBy(tick)
      return ret.times(DimensionPower(tier)).times(tick.times(1000).pow(0.0005))
  }
  else return ret.times(DimensionPower(tier))
}

function DimensionPower(tier) {
  var dim = player["infinityDimension"+tier]
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  var mult = dim.power

  mult = mult.times(infDimPow)

  mult = mult.times(kongAllDimMult)
  if (isAchEnabled("r94") && tier == 1) mult = mult.times(2);
  if (isAchEnabled("r75")) mult = mult.times(player.achPow);
  if (player.replicanti.unl && player.replicanti.amount.gt(1)) {
      var replmult = Decimal.pow(Decimal.log2(player.replicanti.amount), 2)
      if (player.timestudy.studies.includes(21)) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
      if (player.timestudy.studies.includes(102)) replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies))
      for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "replication" && glyph.effects.pow !== undefined) replmult = replmult.pow(glyph.effects.pow)
      }

      mult = mult.times(replmult)
  }

  if (player.timestudy.studies.includes(72) && tier == 4) {
      mult = mult.times(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))
  }

  if (player.timestudy.studies.includes(82)) {
      mult = mult.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)))
  }

  if (player.eternityUpgrades.includes(1)) {
      mult = mult.times(player.eternityPoints.plus(1))
  }

  if (player.eternityUpgrades.includes(2)) mult = mult.times(Decimal.pow(Math.min(player.eternities, 100000)/200 + 1, Math.log(Math.min(player.eternities, 100000)*2+1)/Math.log(4)).times(new Decimal((player.eternities-100000)/200 + 1).times(Math.log((player.eternities- 100000)*2+1)/Math.log(4)).max(1)))

  if (player.eternityUpgrades.includes(3)) mult = mult.times(Decimal.pow(2,30000/Math.max(infchallengeTimes, isAchEnabled("r112") ? 610 : 750)))

  if (player.timestudy.studies.includes(92)) mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity/100, 20)))
  if (player.timestudy.studies.includes(162)) mult = mult.times(1e11)
  if (ECTimesCompleted("eterc2") !== 0 && tier == 1) mult = mult.times(player.infinityPower.pow(1.5/(700-ECTimesCompleted("eterc2")*100)).min(new Decimal("1e100")).plus(1))
  if (player.currentEternityChall == "eterc2") mult = mult.times(0)

  if (ECTimesCompleted("eterc4") !== 0) mult = mult.times(player.infinityPoints.pow(0.003 + ECTimesCompleted("eterc4")*0.002).min(new Decimal("1e200")))

  if (ECTimesCompleted("eterc9") !== 0) mult = mult.times(player.timeShards.pow(ECTimesCompleted("eterc9")*0.1).plus(1).min(new Decimal("1e400")))

  if (mult.lt(0)) mult = new Decimal(0)

  if (player.dilation.active) {
    mult = Decimal.pow(10, Math.pow(mult.log10(), 0.75))
    if (player.dilation.upgrades.includes(9)) {
      mult = Decimal.pow(10, Math.pow(mult.log10(), 1.05))
    }
  }

  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "infinity" && glyph.effects.pow !== undefined) mult = mult.pow(glyph.effects.pow)
  }

  return mult
}




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

var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [null, 50, 30, 10, 5, 5, 5, 5, 5]

function buyManyInfinityDimension(tier) {
  if (player.eterc8ids <= 0 && player.currentEternityChall == "eterc8") return false
  var dim = player["infinityDimension"+tier]
  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false
  if (player.eterc8ids == 0) return false
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  if (ECTimesCompleted("eterc12")) {
      dim.cost = Decimal.round(dim.cost.times(Math.pow(infCostMults[tier], 1-ECTimesCompleted("eterc12")*0.008)))
  } else {
      dim.cost = Decimal.round(dim.cost.times(infCostMults[tier]))
  }
  if (tier == 8) dim.power = dim.power.times(infPowerMults[tier] * getGlyphSacEffect("infinity"))
  else dim.power = dim.power.times(infPowerMults[tier])
  dim.baseAmount += 10

  if (player.currentEternityChall == "eterc8") player.eterc8ids-=1
  document.getElementById("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
  return true
}

function buyMaxInfDims(tier) {
  var dim = player["infinityDimension"+tier]

  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false

  let costMult;
  if (ECTimesCompleted("eterc12")) {
      costMult = Math.pow(infCostMults[tier], 1-ECTimesCompleted("eterc12")*0.008)
  } else {
      costMult = infCostMults[tier]
  }

  var toBuy = Math.floor((player.infinityPoints.e - dim.cost.e) / Math.log10(costMult))
  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  if (tier == 8) dim.power = dim.power.times(Decimal.pow(infPowerMults[tier] * getGlyphSacEffect("infinity"), toBuy))
  else dim.power = dim.power.times(Decimal.pow(infPowerMults[tier], toBuy))
  dim.baseAmount += 10*toBuy
  buyManyInfinityDimension(tier)
}

function buyMaxInfinityDimensions() {
    if (player.currentEternityChall == "eterc8") return false;
    for (var i=1; i<9; i++) {
        buyMaxInfDims(i)
    }
  }

function switchAutoInf(tier) {
  if (player.infDimBuyers[tier-1]) {
      player.infDimBuyers[tier-1] = false
      document.getElementById("infauto"+tier).textContent = "Auto: OFF"
  } else {
      player.infDimBuyers[tier-1] = true
      document.getElementById("infauto"+tier).textContent = "Auto: ON"
  }
}

function toggleAllInfDims() {
  if (player.infDimBuyers[0]) {
      for (var i=1; i<9; i++) {
          player.infDimBuyers[i-1] = false
          document.getElementById("infauto"+i).textContent = "Auto: OFF"
      }
  } else {
      for (var i=1; i<9; i++) {
          if (player.eternities - 10>=i) {
              player.infDimBuyers[i-1] = true
              document.getElementById("infauto"+i).textContent = "Auto: ON"
          }
      }
  }
}

function loadInfAutoBuyers() {
  for (var i=1; i<9; i++) {
      if (player.infDimBuyers[i-1]) document.getElementById("infauto"+i).textContent = "Auto: ON"
      else document.getElementById("infauto"+i).textContent = "Auto: OFF"
  }
}

var infDimPow = 1
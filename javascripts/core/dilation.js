function startDilatedEternity() {
  if (!player.dilation.studies.includes(1)) return false
  clearInterval(gameLoopIntervalId);
  if (player.dilation.active) {
      eternity(true)
      setTimeout(function() {
          gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
      }, 250)
      return false
  }
  if (player.options.confirmations.dilation && !confirm("Dilating time will start a new eternity, and all of your Dimension/Infinity Dimension/Time Dimension multiplier's exponents and tickspeed multiplier's exponent will be reduced to ^ 0.75. If you can eternity while dilated, you'll be rewarded with tachyon particles based on your antimatter and tachyon particles.")) {
      setTimeout(function() {
          gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
      }, 250)
      return false
  }
  giveAchievement("I told you already, time is relative")
  eternity(true)
  player.dilation.active = true;
  totalMult = 1
  currentMult = 1
  infinitiedMult = 1
  achievementMult = 1
  challengeMult = 1
  unspentBonus = 1
  postc8Mult = new Decimal(0)
  mult18 = new Decimal(1)
  ec10bonus = new Decimal(1)
  setTimeout(function() {
      gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
  }, 250)
  return true
}


/**
*
* @param {Name of the ugrade} id
* @param {Cost of the upgrade} cost
* @param {Cost increase for the upgrade, only for rebuyables} costInc
*
* id 1-3 are rebuyables
*
* id 2 resets your dilated time and free galaxies
*
*/

const DIL_UPG_COSTS = [null, [1e5, 10], [1e6, 100], [1e7, 20],
                            5e6,        1e9,         5e7,
                            2e12,        1e10,         1e11,
                                          1e15]


function buyDilationUpgrade(id) {
  if (id > 3) { // Not rebuyable
      if (player.dilation.dilatedTime < DIL_UPG_COSTS[id]) return // Not enough dilated time
      if (player.dilation.upgrades.includes(id)) return // Has the upgrade
      player.dilation.dilatedTime = player.dilation.dilatedTime.minus(DIL_UPG_COSTS[id]);
      player.dilation.upgrades.push(id)
      if (id == 4) player.dilation.freeGalaxies *= 2 // Double the current galaxies
  } else { // Is rebuyable
      let upgAmount = player.dilation.rebuyables[id];
      let realCost = new Decimal(DIL_UPG_COSTS[id][0]).times( Decimal.pow(DIL_UPG_COSTS[id][1], (upgAmount)) )
      if (player.dilation.dilatedTime.lt(realCost)) return

      player.dilation.dilatedTime = player.dilation.dilatedTime.minus(realCost)
      player.dilation.rebuyables[id] += 1
      if (id == 2) {
          if (!player.reality.perks.includes(11)) player.dilation.dilatedTime = new Decimal(0)
          player.dilation.nextThreshold = new Decimal(1000)
          player.dilation.freeGalaxies = 0
      }
  }

  updateDilationUpgradeCosts()
  updateDilationUpgradeButtons()
  updateTimeStudyButtons()
}

function updateDilationUpgradeButtons() {
  for (var i = 1; i <= 10; i++) {
      if (i <= 3) {
          document.getElementById("dil"+i).className = ( new Decimal(DIL_UPG_COSTS[i][0]).times(Decimal.pow(DIL_UPG_COSTS[i][1],(player.dilation.rebuyables[i]))).gt(player.dilation.dilatedTime) ) ? "dilationupgrebuyablelocked" : "dilationupgrebuyable";
      } else if (player.dilation.upgrades.includes(i)) {
          document.getElementById("dil"+i).className = "dilationupgbought"
      } else {
          document.getElementById("dil"+i).className = ( DIL_UPG_COSTS[i] > player.dilation.dilatedTime ) ? "dilationupglocked" : "dilationupg";
      }
  }
  document.getElementById("dil7desc").textContent = "Currently: "+shortenMoney(player.dilation.dilatedTime.pow(1000).max(1))+"x"
  document.getElementById("dil10desc").textContent = "Currently: "+shortenMoney(Math.floor(player.dilation.tachyonParticles.div(20000).max(1)))+"/s"
}

function updateDilationUpgradeCosts() {
  document.getElementById("dil1cost").textContent = "Cost: " + shortenCosts( new Decimal(DIL_UPG_COSTS[1][0]).times(Decimal.pow(DIL_UPG_COSTS[1][1],(player.dilation.rebuyables[1]))) ) + " dilated time"
  document.getElementById("dil2cost").textContent = "Cost: " + shortenCosts( new Decimal(DIL_UPG_COSTS[2][0]).times(Decimal.pow(DIL_UPG_COSTS[2][1],(player.dilation.rebuyables[2]))) ) + " dilated time"
  document.getElementById("dil3cost").textContent = "Cost: " + shortenMultiplier(new Decimal(DIL_UPG_COSTS[3][0]).times(Decimal.pow(DIL_UPG_COSTS[3][1], (player.dilation.rebuyables[3])))) + " dilated time"
  document.getElementById("dil4cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[4]) + " dilated time"
  document.getElementById("dil5cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[5]) + " dilated time"
  document.getElementById("dil6cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[6]) + " dilated time"
  document.getElementById("dil7cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[7]) + " dilated time"
  document.getElementById("dil8cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[8]) + " dilated time"
  document.getElementById("dil9cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[9]) + " dilated time"
  document.getElementById("dil10cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[10]) + " dilated time"
}


function getDilationGainPerSecond() {
  var ret = new Decimal(player.dilation.tachyonParticles*Math.pow(2, player.dilation.rebuyables[1]))
  if (isAchEnabled("r132")) ret = ret.times(Math.max(Math.pow(player.galaxies, 0.04), 1))
  if (player.reality.rebuyables[1] > 0) ret = ret.times(Math.pow(3, player.reality.rebuyables[1]))
  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "dilation" && glyph.effects.dilationMult !== undefined) ret = ret.times(glyph.effects.dilationMult)
  }
  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "replication" && glyph.effects.dtgain !== undefined) ret = ret.times(Math.max(player.replicanti.amount.e * glyph.effects.dtgain, 1))
  }
  return ret
}

function getTachyonGain() {
  let mult = Math.pow(3, player.dilation.rebuyables[3])
  if (player.reality.rebuyables[4] > 0) mult *= Math.pow(3, player.reality.rebuyables[4])
  if (player.reality.upg.includes(8)) mult *= Math.sqrt(player.achPow)
  if (player.reality.upg.includes(15)) mult *= Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1)

  let tachyonGain = Math.max(Math.pow(Decimal.log10(player.money) / 400, 1.5) * (mult) - player.dilation.totalTachyonParticles, 0)            
  return tachyonGain
}

function getTachyonReq() {
  let mult = Math.pow(3, player.dilation.rebuyables[3])
  if (player.reality.rebuyables[4] > 0) mult *= Math.pow(3, player.reality.rebuyables[4])
  if (player.reality.upg.includes(8)) mult *= Math.sqrt(player.achPow)
  if (player.reality.upg.includes(15)) mult *= Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1)
  let sacEffect = getGlyphSacEffect("dilation")
  if (sacEffect > 1) mult *= sacEffect
  let req = Decimal.pow(10, Math.pow(player.dilation.tachyonParticles * Math.pow(400, 1.5) / mult, 2/3))
  return req
}


function updateDilation() {
  if (document.getElementById("dilation").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
      document.getElementById("tachyonParticleAmount").textContent = shortenMoney(player.dilation.tachyonParticles)
      document.getElementById("dilatedTimeAmount").textContent = shortenMoney(player.dilation.dilatedTime)
      document.getElementById("dilatedTimePerSecond").textContent = "+" + shortenMoney(getDilationGainPerSecond()) + "/s"
      document.getElementById("galaxyThreshold").textContent = shortenMoney(player.dilation.nextThreshold)
      document.getElementById("dilatedGalaxies").textContent = player.dilation.freeGalaxies
  }
}
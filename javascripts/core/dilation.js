function startDilatedEternity() {
  if (!TimeStudy.dilation.isBought) return false
  GameIntervals.gameLoop.stop();
  if (player.dilation.active) {
      eternity(true)
      setTimeout(function() {
        GameIntervals.gameLoop.start();
      }, 250)
      return false
  }
  if (player.options.confirmations.dilation && !confirm("Dilating time will start a new eternity, and all of your Dimension/Infinity Dimension/Time Dimension multiplier's exponents and tickspeed multiplier's exponent will be reduced to ^ 0.75. If you can eternity while dilated, you'll be rewarded with tachyon particles based on your antimatter and tachyon particles.")) {
      setTimeout(function() {
        GameIntervals.gameLoop.start();
      }, 250)
      return false
  }
  giveAchievement("I told you already, time is relative")
  eternity(true)
  player.dilation.active = true;
  postc8Mult = new Decimal(0)
  mult18 = new Decimal(1)
  ec10bonus = new Decimal(1)
  setTimeout(function() {
    GameIntervals.gameLoop.start();
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
    if (player.dilation.dilatedTime < DIL_UPG_COSTS[id]) return false // Not enough dilated time
    if (player.dilation.upgrades.includes(id)) return false // Has the upgrade
    player.dilation.dilatedTime = player.dilation.dilatedTime.minus(DIL_UPG_COSTS[id]);
    player.dilation.upgrades.push(id)
    if (id == 4) player.dilation.freeGalaxies *= 2 // Double the current galaxies
  } else { // Is rebuyable
    let upgAmount = player.dilation.rebuyables[id];
    let realCost = new Decimal(DIL_UPG_COSTS[id][0]).times( Decimal.pow(DIL_UPG_COSTS[id][1], (upgAmount)) )
    if (player.dilation.dilatedTime.lt(realCost)) return false

    player.dilation.dilatedTime = player.dilation.dilatedTime.minus(realCost)
    player.dilation.rebuyables[id] += 1
    if (id == 2) {
        if (!player.reality.perks.includes(11)) player.dilation.dilatedTime = new Decimal(0)
        player.dilation.nextThreshold = new Decimal(1000)
        player.dilation.baseFreeGalaxies = 0
        player.dilation.freeGalaxies = 0
    }

    if (id == 3) {
      if (player.reality.perks.includes(37)) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(3)
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.times(3)
      }
      else if (player.reality.perks.includes(36)) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(2.5)
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.times(2.5)
      }
      else if (player.reality.perks.includes(35)) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(2)
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.times(2)
      }
      else if (player.reality.perks.includes(34)) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(1.5)
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.times(1.5)
      }
    }
  }
  return true
}

function getFreeGalaxyMult() {
  const thresholdMult = 3.65 * DilationUpgrade.galaxyThreshold.effectValue + 0.05;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return thresholdMult * glyphReduction + 1.3;
}

function getDilationGainPerSecond() {
  let ret = new Decimal(player.dilation.tachyonParticles)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132)
    );
  if (player.reality.rebuyables[1] > 0) ret = ret.times(Math.pow(3, player.reality.rebuyables[1]))
  ret = ret.times(new Decimal(1).max(getAdjustedGlyphEffect("dilationdilationMult")));
  ret = ret.times(Math.max(player.replicanti.amount.e * getAdjustedGlyphEffect("replicationdtgain"), 1));
  return ret
}

function getTachyonGain() {
  let mult = DilationUpgrade.tachyonGain.effectValue;
  if (player.reality.rebuyables[4] > 0) mult = mult.times(Decimal.pow(3, player.reality.rebuyables[4]))
  if (player.reality.upg.includes(8)) mult = mult.times(Math.sqrt(player.achPow))
  if (player.reality.upg.includes(15)) mult = mult.times(Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1))
  let sacEffect = getGlyphSacEffect("dilation")
  if (sacEffect > 1) mult *= sacEffect

  let tachyonGain = new Decimal(Decimal.pow(Decimal.log10(player.money) / 400, 1.5).times(mult).minus(player.dilation.totalTachyonParticles)).max(0)
  return tachyonGain
}

function getTachyonReq() {
  let mult = DilationUpgrade.tachyonGain.effectValue;
  if (player.reality.rebuyables[4] > 0) mult *= Math.pow(3, player.reality.rebuyables[4])
  if (player.reality.upg.includes(8)) mult *= Math.sqrt(player.achPow)
  if (player.reality.upg.includes(15)) mult *= Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1)
  let sacEffect = getGlyphSacEffect("dilation")
  if (sacEffect > 1) mult *= sacEffect
  
  let req = Decimal.pow(10, Math.pow(player.dilation.totalTachyonParticles * Math.pow(400, 1.5) / mult, 2/3))
  return req
}

function dilatedValueOf(value) {
  const log10 = value.log10();
  const dilationPenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty));
}

class DilationUpgradeState extends PurchasableMechanicState {
  constructor(config) {
    super(config, Currency.dilatedTime, () => player.dilation.upgrades);
  }

  purchase() {
    const purchaseSucceeded = super.purchase();
    if (purchaseSucceeded && this.id === 4) {
      player.dilation.freeGalaxies *= 2;
    }
  }
}

class RebuyableDilationUpgradeState extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get cost() {
    return this.config.cost();
  }

  get isAffordable() {
    return player.dilation.dilatedTime.gte(this.cost);
  }

  get canBeApplied() {
    return true;
  }

  purchase() {
    buyDilationUpgrade(this.config.id);
  }
}

const DilationUpgrade = (function() {
  const db = GameDatabase.eternity.dilation;
  return {
    dtGain: new RebuyableDilationUpgradeState(db.dtGain),
    galaxyThreshold: new RebuyableDilationUpgradeState(db.galaxyThreshold),
    tachyonGain: new RebuyableDilationUpgradeState(db.tachyonGain),
    doubleGalaxies: new DilationUpgradeState(db.doubleGalaxies),
    tdMultReplicanti: new DilationUpgradeState(db.tdMultReplicanti),
    ndMultDT: new DilationUpgradeState(db.ndMultDT),
    ipMultDT: new DilationUpgradeState(db.ipMultDT),
    timeStudySplit: new DilationUpgradeState(db.timeStudySplit),
    dilationPenalty: new DilationUpgradeState(db.dilationPenalty),
    ttGenerator: new DilationUpgradeState(db.ttGenerator)
  };
})();
function startDilatedEternity() {
  if (!TimeStudy.dilation.isBought) return false
  GameIntervals.gameLoop.stop();
  if (player.dilation.active) {
      eternity(false, false, true)
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
  eternity(false, false, true)
  player.dilation.active = true;
  postc8Mult = new Decimal(0)
  mult18 = new Decimal(1)
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
                            2e12,       1e10,        1e11,
                                        1e15];


function buyDilationUpgrade(id) {
  // Upgrades 1-3 are rebuyable
  if (id > 3) {
    if (player.dilation.dilatedTime.lt(DIL_UPG_COSTS[id])) return false;
    if (player.dilation.upgrades.has(id)) return false;
    player.dilation.dilatedTime = player.dilation.dilatedTime.minus(DIL_UPG_COSTS[id]);
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.freeGalaxies *= 2;
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    const realCost = new Decimal(DIL_UPG_COSTS[id][0]).times(Decimal.pow(DIL_UPG_COSTS[id][1], (upgAmount)));
    if (player.dilation.dilatedTime.lt(realCost)) return false;

    let buying = Decimal.affordGeometricSeries(player.dilation.dilatedTime,
      DIL_UPG_COSTS[id][0], DIL_UPG_COSTS[id][1], upgAmount).toNumber();
    buying = Math.min(buying, player.celestials.teresa.dtBulk);
    const cost = Decimal.sumGeometricSeries(buying, DIL_UPG_COSTS[id][0], DIL_UPG_COSTS[id][1], upgAmount);
    player.dilation.dilatedTime = player.dilation.dilatedTime.minus(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassDGReset.isBought) player.dilation.dilatedTime = new Decimal(0);
      player.dilation.nextThreshold = new Decimal(1000);
      player.dilation.baseFreeGalaxies = 0;
      player.dilation.freeGalaxies = 0;
    }

    if (id === 3) {
      const retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(Decimal.pow(retroactiveTPFactor, buying))
      player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.times(Decimal.pow(retroactiveTPFactor, buying))
    }
  }
  return true
}

function getFreeGalaxyMult() {
  const thresholdMult = 3.65 * DilationUpgrade.galaxyThreshold.effectValue + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return thresholdMult * glyphReduction + 1;
}

function getDilationGainPerSecond() {
  let ret = new Decimal(player.dilation.tachyonParticles)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      RealityUpgrade(1)
    );
  ret = ret.times(getAdjustedGlyphEffect("dilationdilationMult"));
  ret = ret.times(Math.max(player.replicanti.amount.e * getAdjustedGlyphEffect("replicationdtgain"), 1));
  if (Enslaved.isRunning) ret = ret.times(Enslaved.adjustedDilationMultiplier)
  if (V.isRunning) ret = ret.pow(0.5)
  return ret
}

function getTachyonGain() {
  let mult = new Decimal(1).timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  );

  let tachyonGain = new Decimal(Decimal.pow(Decimal.log10(player.money) / 400, 1.5).times(mult).minus(player.dilation.totalTachyonParticles)).max(0)
  return tachyonGain
}

function getTachyonReq() {
  let mult = new Decimal(1).timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  );
  let req = Decimal.pow(10, Decimal.pow(player.dilation.totalTachyonParticles.times(Math.pow(400, 1.5)).divideBy(mult), 2/3))
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
"use strict";

function startDilatedEternity(auto) {
  if (!TimeStudy.dilation.isBought) return false;
  if (player.dilation.active) {
      eternity(false, auto, { switchingDilation: true });
      return false;
  }
  if (!auto && player.options.confirmations.dilation) {
    const confirmationMessage = "Dilating time will start a new eternity, and all of your Dimension/Infinity" +
      " Dimension/Time Dimension multiplier's exponents and tickspeed multiplier's exponent will be reduced to" +
      " ^ 0.75. If you can eternity while dilated, you'll be rewarded with tachyon particles based on your" +
      " antimatter and tachyon particles.";
    if (!confirm(confirmationMessage)) return false;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
  TimeCompression.isActive = false;
  return true;
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


function buyDilationUpgrade(id, bulk) {
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
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
    buying = Math.min(buying, Effects.max(1, PerkShopUpgrade.rmMult));
    if (!bulk) {
      buying = Math.min(buying, 1);
    }
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
      let retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      player.dilation.tachyonParticles = player.dilation.tachyonParticles.times(Decimal.pow(retroactiveTPFactor, buying))
    }
  }
  return true
}

// This two are separate to avoid an infinite loop as the compression unlock condition checks the free galaxy mult
function getFreeGalaxyMultBeforeCompression() {
  const thresholdMult = 3.65 * DilationUpgrade.galaxyThreshold.effectValue + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return 1 + thresholdMult * glyphReduction;
}

function getFreeGalaxyMult() {
  const compressionReduction = Effects.max(0, CompressionUpgrade.freeGalaxyScaling);
  return 1 + (getFreeGalaxyMultBeforeCompression() - 1) / (1 + compressionReduction);
}

function getDilationGainPerSecond() {
  let dtRate = new Decimal(player.dilation.tachyonParticles)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation
    );
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(Math.max(player.replicanti.amount.e * getAdjustedGlyphEffect("replicationdtgain"), 1));
  dtRate = dtRate.times(Ra.gamespeedDTMult());
  if (Enslaved.isRunning) {
    dtRate = Decimal.pow10(Math.pow(dtRate.plus(1).log10(), 0.85) - 1);
  }
  dtRate = dtRate.times(RA_UNLOCKS.TT_BOOST.effect.dilatedTime());
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  return dtRate;
}

function tachyonGainMultiplier() {
  return new Decimal(1).timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    Achievement(132),
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  );
}

function rewardTP() {
  player.dilation.tachyonParticles = Decimal.max(player.dilation.tachyonParticles, getTP());
}

// Returns the TP that would be gained this run
function getTP() {
  let tachyon = Decimal
    .pow(Decimal.log10(player.antimatter) / 400, 1.5)
    .times(tachyonGainMultiplier());
  if (Enslaved.isRunning) tachyon = tachyon.pow(Enslaved.tachyonNerf);
  return tachyon;
}

// Returns the amount of TP gained, subtracting out current TP; used only for displaying gained TP
function getTachyonGain() {
  return getTP().minus(player.dilation.tachyonParticles).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
function getTachyonReq() {
  let effectiveTP = player.dilation.tachyonParticles;
  if (Enslaved.isRunning) effectiveTP = effectiveTP.pow(1 / Enslaved.tachyonNerf);
  return Decimal.pow10(
    effectiveTP
      .times(Math.pow(400, 1.5))
      .dividedBy(tachyonGainMultiplier())
      .pow(2 / 3)
      .toNumber()
  );
}

function dilatedValueOf(value, depth) {
  if (depth !== undefined) {
    return recursiveDilation(value, depth);
  }
  if (player.dilation.active || Enslaved.isRunning) {
    return recursiveDilation(value, 1);
  }
  if (TimeCompression.isActive) {
    return recursiveDilation(value, TimeCompression.compressionDepth);
  }
  throw new Error("Invald dilation depth");
}

function recursiveDilation(value, depth) {
  if (depth === 0) {
    return value;
  }
  const log10 = value.log10();
  const basePenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  const alchemyReduction = (player.replicanti.amount.log10() / 1e6) * AlchemyResource.alternation.effectValue;
  const dilationPenalty = Math.min(1, basePenalty + (1 - basePenalty) * alchemyReduction);
  return recursiveDilation(Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty)), depth - 1);
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  purchase() {
    if (!super.purchase()) return;
    if (this.id === 4) {
      player.dilation.freeGalaxies *= 2;
    }
  }
}

class RebuyableDilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get boughtAmount() {
    return player.dilation.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.dilation.rebuyables[this.id] = value;
  }

  get autobuyerId() {
    return this.config.id - 1;
  }

  get isAutobuyerOn() {
    return player.dilation.auto[this.autobuyerId];
  }

  set isAutobuyerOn(value) {
    player.dilation.auto[this.autobuyerId] = value;
  }

  purchase(bulk) {
    buyDilationUpgrade(this.config.id, bulk);
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
    ttGenerator: new DilationUpgradeState(db.ttGenerator),
  };
}());

const DilationUpgrades = {
  rebuyable: [
    DilationUpgrade.dtGain,
    DilationUpgrade.galaxyThreshold,
    DilationUpgrade.tachyonGain,
  ],
  fromId: (function() {
    const upgradesById = [];
    for (const upgrade of Object.values(DilationUpgrade)) {
      upgradesById[upgrade.id] = upgrade;
    }
    return id => upgradesById[id];
  }()),
};

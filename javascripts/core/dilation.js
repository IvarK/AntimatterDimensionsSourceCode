"use strict";

function dilationAnimation() {
  document.body.style.animation = "dilate 2s 1 linear";
  setTimeout(() => {
      document.body.style.animation = "";
  }, 2000);
}

function undilationAnimation() {
  document.body.style.animation = "undilate 2s 1 linear";
  setTimeout(() => {
      document.body.style.animation = "";
  }, 2000);
}

function startDilatedEternityRequest() {
  if (!PlayerProgress.dilationUnlocked()) return;
  if (player.options.confirmations.dilation) {
    Modal.enterDilation.show({ epSinceLastDilation: new Decimal(0), OldEPSinceLastDilation: new Decimal(0), hasDilated: Achievement(136).active() });
  }
  if (player.dilation.active && player.options.animations.dilation && document.body.style.animation === "") {
    undilationAnimation();
    setTimeout(() => {
      eternity(false, false, { switchingDilation: true });
    }, 1000);
    return;
  }
  if (player.dilation.active) {
    eternity(false, false, { switchingDilation: true });
  }
}

function startDilatedEternity(auto) {
  if (!PlayerProgress.dilationUnlocked()) return;
  if (player.dilation.active) {
      eternity(false, auto, { switchingDilation: true });
      return;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
}

const DIL_UPG_NAMES = [
  null, "dtGain", "galaxyThreshold", "tachyonGain", "doubleGalaxies", "tdMultReplicanti",
  "ndMultDT", "ipMultDT", "timeStudySplit", "dilationPenalty", "ttGenerator"
];

function buyDilationUpgrade(id, bulk, extraFactor) {
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  // If a tick is really long (perhaps due to the player going offline), they can be automatically bought
  // several times in one tick, which is what the extraFactor variable is used for.
  if (id > 3) {
    if (player.dilation.dilatedTime.lt(upgrade.cost)) return false;
    if (player.dilation.upgrades.has(id)) return false;
    player.dilation.dilatedTime = player.dilation.dilatedTime.minus(upgrade.cost);
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.freeGalaxies *= 2;
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    if (player.dilation.dilatedTime.lt(upgrade.cost) || upgAmount >= upgrade.config.purchaseCap) return false;

    let buying = Decimal.affordGeometricSeries(player.dilation.dilatedTime,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, Effects.max(1, PerkShopUpgrade.bulkDilation) * extraFactor);
    buying = Math.clampMax(buying, upgrade.config.purchaseCap - upgAmount);
    if (!bulk) {
      buying = Math.clampMax(buying, 1);
    }
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
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
      player.dilation.tachyonParticles = player.dilation.tachyonParticles
        .times(Decimal.pow(retroactiveTPFactor, buying));
    }
  }
  return true;
}

function getFreeGalaxyMult() {
  const thresholdMult = 3.65 * DilationUpgrade.galaxyThreshold.effectValue + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return 1 + thresholdMult * glyphReduction;
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
  dtRate = dtRate.times(
    Math.clampMin(Decimal.log10(player.replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1));
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
  player.dilation.tachyonParticles = Decimal.max(player.dilation.tachyonParticles, getTP(Currency.antimatter.value));
}

// Returns the TP that would be gained this run
function getTP(antimatter) {
  let tachyon = Decimal
    .pow(Decimal.log10(antimatter) / 400, 1.5)
    .times(tachyonGainMultiplier());
  if (Enslaved.isRunning) tachyon = tachyon.pow(Enslaved.tachyonNerf);
  return tachyon;
}

// Returns the amount of TP gained, subtracting out current TP; used only for displaying gained TP
function getTachyonGain() {
  return getTP(Currency.antimatter.value).minus(player.dilation.tachyonParticles).clampMin(0);
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

function dilatedValueOf(value) {
  const log10 = value.log10();
  const dilationPenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty));
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  onPurchased() {
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
  
  get isCapped() {
    return this.config.reachedCapFn();
  }

  purchase(bulk, extraFactor = 1) {
    buyDilationUpgrade(this.config.id, bulk, extraFactor);
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

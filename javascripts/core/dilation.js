"use strict";

function animateAndDilate() {
  document.body.style.animation = "dilate 2s 1 linear";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 2000);
  setTimeout(startDilatedEternity, 1000);
}

function animateAndUndilate() {
  document.body.style.animation = "undilate 2s 1 linear";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 2000);
  setTimeout(() => {
    eternity(false, false, { switchingDilation: true });
  }, 1000);
}

function startDilatedEternityRequest() {
  if (!PlayerProgress.dilationUnlocked()) return;
  const playAnimation = player.options.animations.dilation && document.body.style.animation === "";
  if (player.dilation.active) {
    // TODO Dilation modal
    if (playAnimation) {
      animateAndUndilate();
    } else {
      eternity(false, false, { switchingDilation: true });
    }
  } else if (player.options.confirmations.dilation) {
    Modal.enterDilation.show();
  } else if (playAnimation) {
    animateAndDilate();
  } else {
    startDilatedEternity();
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

function buyDilationUpgrade(id, bulk = 1) {
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  if (id > 3) {
    if (player.dilation.upgrades.has(id)) return false;
    if (!Currency.dilatedTime.purchase(upgrade.cost)) return false;
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.totalTachyonGalaxies *= 2;
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    if (Currency.dilatedTime.lt(upgrade.cost) || upgAmount >= upgrade.config.purchaseCap) return false;

    let buying = Decimal.affordGeometricSeries(Currency.dilatedTime.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, bulk);
    buying = Math.clampMax(buying, upgrade.config.purchaseCap - upgAmount);
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.subtract(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = new Decimal(1000);
      player.dilation.baseTachyonGalaxies = 0;
      player.dilation.totalTachyonGalaxies = 0;
    }

    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      ) ** (Pelle.isDoomed ? 0.1 : 1);
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      Currency.tachyonParticles.multiply(Decimal.pow(retroactiveTPFactor, buying));
    }
  }
  return true;
}

function getTachyonGalaxyMult(thresholdUpgrade) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  const thresholdMult = 3.65 * upgrade + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  return 1 + thresholdMult * glyphReduction;
}

function getDilationGainPerSecond() {
  if (Pelle.isDisabled("dtMults")) return new Decimal(Currency.tachyonParticles.value).timesEffectsOf(DilationUpgrade.dtGain);
  let dtRate = new Decimal(Currency.tachyonParticles.value)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation
    );
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(
    Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1));
  dtRate = dtRate.times(Ra.gamespeedDTMult());
  if (Enslaved.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Math.pow(dtRate.plus(1).log10(), 0.85) - 1);
  dtRate = dtRate.times(RA_UNLOCKS.TT_BOOST.effect.dilatedTime());
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  return dtRate;
}

function tachyonGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) return new Decimal(1);
  return new Decimal(1).timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    Achievement(132),
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  ).pow(Pelle.isDoomed ? 0.1 : 1);
}

function rewardTP() {
  Currency.tachyonParticles.bumpTo(getTP(Currency.antimatter.value));
  player.dilation.lastEP.copyFrom(Currency.eternityPoints);
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
  return getTP(Currency.antimatter.value).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
function getTachyonReq() {
  let effectiveTP = Currency.tachyonParticles.value;
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
      player.dilation.totalTachyonGalaxies *= 2;
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

  get isCapped() {
    return this.config.reachedCapFn();
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

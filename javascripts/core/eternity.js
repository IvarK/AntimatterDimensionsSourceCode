function canEternity() {
  const challenge = EternityChallenge.current();
  if (challenge === undefined && player.infinityPoints.lt(Decimal.MAX_NUMBER)) return false;
  if (challenge !== undefined && !challenge.canBeCompleted) return false;
  return true;
}

function eternity(force, auto, switchingDilation) {
    if (switchingDilation) {
      if (!canEternity()) force = true;
    }
    if (force) {
      player.currentEternityChall = "";
    }
    else {
      if (!canEternity()) return false;
      if (!auto && !askEternityConfirmation()) return false;
      EventHub.dispatch(GameEvent.ETERNITY_RESET_BEFORE);
      if (player.thisEternity < player.bestEternity) {
        player.bestEternity = player.thisEternity;
      }
      player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints());
      addEternityTime(player.thisEternity, player.thisEternityRealTime, gainedEternityPoints());
    }
    if (player.eternities < 20 && Autobuyer.dimboost.isUnlocked) Autobuyer.dimboost.buyMaxInterval = 1;
    if (EternityChallenge.isRunning()) {
      const challenge = EternityChallenge.current();
      challenge.addCompletion();
      if (Perk.studyECBulk.isBought) {
        while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
          challenge.addCompletion();
        }
      }
      player.etercreq = 0;
      respecTimeStudies();
  }

    player.infinitiedBank = player.infinitiedBank.plusEffectsOf(
      Achievement(131),
      TimeStudy(191)
    );
    if (player.dilation.active && !force) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.plus(getTachyonGain());
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.plus(getTachyonGain())
    }
    RealityUpgrades.tryUnlock([6, 10]);
    if (!force) {
        player.eternities += Effects.product(RealityUpgrade(3));
    }
    player.sacrificed = new Decimal(0);
    player.challenges = [];
    if (EternityMilestone.keepAutobuyers.isReached) {
      for (let challenge of NormalChallenge.all) {
        challenge.complete();
      }
    }
    if (Achievement(133).isEnabled) {
      for (let challenge of InfinityChallenge.all) {
        challenge.complete();
      }
    }
    player.currentChallenge = "";
    player.infinitied = new Decimal(0);
    player.bestInfinityTime = 999999999999;
    player.thisInfinityTime = 0;
    player.thisInfinityRealTime = 0;
    player.resets = (player.eternities >= 4) ? 4  : 0;
    player.galaxies = (player.eternities >= 4) ? 1  : 0;
    player.tickDecrease = 0.9;
    if (player.eternities < 2) {
      Autobuyer.resetUnlockables();
    }
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.break= player.eternities >= 2 ? player.break : false;
    player.infMult = new Decimal(1);
    player.infMultCost = new Decimal(10);
    if (player.eternities < 20) {
      player.infinityRebuyables = [0, 0];
      GameCache.tickSpeedMultDecrease.invalidate();
      GameCache.dimensionMultDecrease.invalidate();
    }
    player.postChallUnlocked = Achievement(133).isEnabled ? 8 : 0;
    player.infDimensionsUnlocked = [false, false, false, false, false, false, false, false];
    player.infinityPower = new Decimal(1);
    player.timeShards = new Decimal(0);
    player.tickThreshold = new Decimal(1);
    player.thisEternity = 0;
    player.thisEternityRealTime = 0;
    player.totalTickGained = 0;
    player.offlineProd = player.eternities >= 20 ? player.offlineProd : 0;
    player.offlineProdCost = player.eternities >= 20 ? player.offlineProdCost : 1e7;
    player.challengeTarget = new Decimal(0);
    if (player.eternities < 7 && !Achievement(133).isEnabled) {
        player.autoSacrifice = 1;
    }
    player.eternityChallGoal = new Decimal(Decimal.MAX_NUMBER);
    player.currentEternityChall = "";
    player.autoIP = new Decimal(0);
    player.autoTime = 1e300;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.dimlife = true;
    player.dead = true;

    player.dilation.active = false;

    resetInfinityRuns();
    fullResetInfDimensions();
    eternityResetReplicanti();
    resetChallengeStuff();
    resetDimensions();
    if (player.respec) respecTimeStudies();
    player.respec = false;
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;

    if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
      NormalChallenge(1).complete();
      Autobuyer.tryUnlockAny();
    }
    
    if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked && player.infinityPoints.gt(Decimal.MAX_NUMBER)) {
      EffarigUnlock.eternity.unlock();
      Modal.message.show(`Effarig Eternity reward: Glyph Level cap raised to ${Effarig.glyphLevelCap} and IP multipliers apply with full effect; eternity count generates infinities and The Enslaved Ones have been unlocked.`);
    }
    
    resetInfinityPointsOnEternity();
    resetInfDimensions();
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    resetTimeDimensions();
    try {
        kong.submitStats('Eternities', player.eternities);
    } catch (err) {
        console.log("Couldn't load Kongregate API")
    }
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
    resetTickspeed();
    playerInfinityUpgradesOnEternity();
    if (player.eternities === 1 || (player.reality.rebuyables[3] > 0 && player.eternities === RealityUpgrade(3).effectValue && player.eternityPoints.lte(10))) {
        Tab.dimensions.time.show();
    }
    AchievementTimers.marathon2.reset();

    RealityUpgrades.tryUnlock([11, 12, 13, 14, 15, 25]);

    if (RealityUpgrade(13).isBought) {
        if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();
        for (var i = 1; i < 9; i++) {
            if (player.reality.tdbuyers[i - 1]) {
                buyMaxTimeDimTier(i);
            }
        }
    }

    if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.isBought) {
      for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
    }

    if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.isBought) {
      for (const id of [4, 5, 6]) player.eternityUpgrades.add(id);
    }

    resetMoney();

    EventHub.dispatch(GameEvent.ETERNITY_RESET_AFTER);
    return true;
}

function eternityResetReplicanti() {
    player.replicanti.amount = player.eternities >= 50 ? new Decimal(1) : new Decimal(0);
    player.replicanti.unl = player.eternities >= 50;
    player.replicanti.chance = 0.01;
    player.replicanti.chanceCost = new Decimal(1e150);
    player.replicanti.interval = 1000;
    player.replicanti.intervalCost = new Decimal(1e140);
    player.replicanti.gal = 0;
    player.replicanti.galaxies = 0;
    player.replicanti.galCost = new Decimal(1e170);
    player.replicanti.galaxybuyer = (player.eternities > 1) ? player.replicanti.galaxybuyer : undefined;
}

function fullResetInfDimensions() {
    const cost = [1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    for (let i = 0; i < 8; i++) {
        let dimension = player["infinityDimension" + (i + 1)];
        dimension.cost = new Decimal(cost[i]);
        dimension.amount = new Decimal(0);
        dimension.bought = 0;
        dimension.power = new Decimal(1);
        dimension.baseAmount = 0;
    }
}

function askEternityConfirmation() {
    if (!player.options.confirmations.eternity) {
        return true;
    }
    let message = "Eternity will reset everything except achievements and challenge records. " +
        "You will also gain an Eternity point and unlock various upgrades.";
    return confirm(message);
}

function resetInfinityPointsOnEternity() {
  resetInfinityPoints();
  Achievement(104).applyEffect(v => player.infinityPoints = player.infinityPoints.max(v));
}

function resetInfinityPoints() {
  player.infinityPoints = Effects.max(
    0,
    Perk.startIP1,
    Perk.startIP2
  ).toDecimal();
}

class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return player.eternities >= this.config.eternities;
  }
}

const EternityMilestone = function() {
  const db = GameDatabase.eternity.milestones;
  const infinityDims = Array.dimensionTiers
    .map(tier => new EternityMilestoneState(db["autobuyerID" + tier]));
  return {
    autobuyerIPMult: new EternityMilestoneState(db.autobuyerIPMult),
    keepAutobuyers: new EternityMilestoneState(db.keepAutobuyers),
    autobuyerReplicantiGalaxy: new EternityMilestoneState(db.autobuyerReplicantiGalaxy),
    keepInfinityUpgrades: new EternityMilestoneState(db.keepInfinityUpgrades),
    bigCrunchModes: new EternityMilestoneState(db.bigCrunchModes),
    autoIC: new EternityMilestoneState(db.autoIC),
    autobuyMaxGalaxies: new EternityMilestoneState(db.autobuyMaxGalaxies),
    autobuyMaxDimboosts: new EternityMilestoneState(db.autobuyMaxDimboosts),
    autobuyerID: tier => infinityDims[tier - 1],
    keepBreakUpgrades: new EternityMilestoneState(db.keepBreakUpgrades),
    autoUnlockID: new EternityMilestoneState(db.autoUnlockID),
    unlockAllND: new EternityMilestoneState(db.unlockAllND),
    autobuyerReplicantiChance: new EternityMilestoneState(db.autobuyerReplicantiChance),
    unlockReplicanti: new EternityMilestoneState(db.unlockReplicanti),
    autobuyerReplicantiInterval: new EternityMilestoneState(db.autobuyerReplicantiInterval),
    autobuyerReplicantiMaxGalaxies: new EternityMilestoneState(db.autobuyerReplicantiMaxGalaxies),
    autobuyerEternity: new EternityMilestoneState(db.autobuyerEternity),
  };
}();

class EternityUpgradeState extends PurchasableMechanicState {
  constructor(config) {
    super(config, Currency.eternityPoints, () => player.eternityUpgrades);
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.autobuyer = {
      get isUnlocked() {
        return RealityUpgrade(13).isBought;
      },
      get isOn() {
        return player.reality.epmultbuyer;
      },
      set isOn(value) {
        player.reality.epmultbuyer = value;
      }
    };
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => Decimal.pow(5, player.epmultUpgrades));
  }

  get canBeApplied() {
    return true;
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    const diff = value - player.epmultUpgrades;
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpLimit(Decimal.pow(5, diff));
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    player.eternityPoints = player.eternityPoints.minus(this.cost);
    ++this.boughtAmount;
    return true;
  }

  buyMax() {
    const bulk = bulkBuyBinarySearch(player.eternityPoints, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount);
    if (!bulk) return false;
    player.eternityPoints = player.eternityPoints.minus(bulk.purchasePrice);
    this.boughtAmount += bulk.quantity;
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  costAfterCount(count) {
    // Up to just past 1e100
    if (count <= 58) return Decimal.pow(50, count).times(500);
    // Up to just past Number.MAX_VALUE
    if (count <= 153) return Decimal.pow(100, count).times(500);
    // Up to just past 1e1300
    if (count <= 481) return Decimal.pow(500, count).times(500);
    // Up to 1e4000
    if (count <= 1333) return Decimal.pow(1000, count).times(500);
    return Decimal.pow(1000, count + Math.pow(count - 1334, 1.2)).times(500);
  }
}


const EternityUpgrade = (function() {
  const db = GameDatabase.eternity.upgrades;
  return {
    idMultEP: new EternityUpgradeState(db.idMultEP),
    idMultEternities: new EternityUpgradeState(db.idMultEternities),
    idMultICRecords: new EternityUpgradeState(db.idMultICRecords),
    tdMultAchs: new EternityUpgradeState(db.tdMultAchs),
    tdMultTheorems: new EternityUpgradeState(db.tdMultTheorems),
    tdMultRealTime: new EternityUpgradeState(db.tdMultRealTime),
    epMult: new EPMultiplierState(),
  };
}());

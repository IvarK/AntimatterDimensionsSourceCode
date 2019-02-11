function eternity(force, auto) {
    if (force) {
      player.currentEternityChall = String.empty;
    }
    else {
      const challenge = EternityChallenge.current();
      if (challenge === undefined && player.infinityPoints.lt(Number.MAX_VALUE)) return false;
      if (challenge !== undefined && !challenge.canBeCompleted) return false;
      if (!auto && !askEternityConfirmation()) return false;
      if (player.thisEternity < player.bestEternity) {
        player.bestEternity = player.thisEternity;
      }
      if (player.thisEternity < 30000) giveAchievement("That wasn't an eternity");
      if (player.thisEternity < 200) giveAchievement("Eternities are the new infinity");
      if (player.thisEternity <= 1) giveAchievement("Less than or equal to 0.001");
      if (player.infinitied < 10) giveAchievement("Do you really need a guide for this?");
      if (Decimal.round(player.replicanti.amount).eq(9)) giveAchievement("We could afford 9");
      if (player.dimlife) giveAchievement("8 nobody got time for that");
      if (player.dead) giveAchievement("You're already dead.");
      if (player.infinitied <= 1) giveAchievement("Do I really need to infinity");
      if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 60000 && player.dilation.active) {
        giveAchievement("Now you're thinking with dilation!");
      }
    }
    player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints());
    addEternityTime(player.thisEternity, player.thisEternityRealTime, gainedEternityPoints());
    if (player.eternities < 20) Autobuyer.dimboost.buyMaxInterval = 1;
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
      if (EternityChallenge.completedTiers() >= 50) {
        giveAchievement("5 more eternities until the update");
      }
    }

    player.infinitiedBank += Effects.sum(
      Achievement(131),
      TimeStudy(191)
    );
    if (player.infinitiedBank > 5000000000) giveAchievement("No ethical consumption");
    if (player.realities > 0 && (player.eternities === 0 || (player.eternities === 100 && player.reality.upg.includes(10))) && player.reality.upgReqChecks[0]) {
      unlockRealityUpgrade(6);
    }
    if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.plus(getTachyonGain());
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.plus(getTachyonGain())
    }
    if (player.realities > 0 && player.eternities === 0 && player.infinityPoints.gte(new Decimal("1e400"))) unlockRealityUpgrade(10);
    if (!force) {
        var tempEterGain = 1;
        if (player.reality.rebuyables[3] > 0) tempEterGain *= Math.pow(3, player.reality.rebuyables[3]);
        player.eternities += tempEterGain
    }
    player.sacrificed = new Decimal(0);
    player.challenges = [];
    if (EternityMilestone.keepAutobuyers.isReached) {
      for (let challenge of Challenge.all) {
        challenge.complete();
      }
    }
    if (Achievement(133).isEnabled) {
      for (let challenge of InfinityChallenge.all) {
        challenge.complete();
      }
    }
    player.currentChallenge = "";
    player.infinitied = 0;
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
    player.eternityChallGoal = new Decimal(Number.MAX_VALUE);
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
    giveAchievement("Time is relative");
    if (player.eternities >= 100) giveAchievement("This mile took an Eternity");
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;

    if (player.infinitied > 0 && !Challenge(1).isCompleted) {
      Challenge(1).complete();
      Autobuyer.tryUnlockAny();
    }
    
    if (Effarig.isRunning && !Effarig.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE) && player.infinityPoints.gt(Number.MAX_VALUE)) {
      Effarig.unlock(EFFARIG_UNLOCKS.ETERNITY_COMPLETE);
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
    if (player.eternities === 1 || (player.reality.rebuyables[3] > 0 && player.eternities == Math.pow(3, player.reality.rebuyables[3]) && player.eternityPoints.lte(10))) {
        Tab.dimensions.time.show();
    }
    Marathon2 = 0;
    if (player.realities > 0 && player.infinitiedBank > 1e12) unlockRealityUpgrade(11);
    if (player.eternityPoints.gte(1e70) && EternityChallenge(1).completions === 0) unlockRealityUpgrade(12);
    if (player.eternityPoints.gte(new Decimal("1e3500")) && player.timeDimension5.amount.equals(0)) unlockRealityUpgrade(13);
    if (player.realities > 0 && player.eternities > 1e6) unlockRealityUpgrade(14);
    if (player.epmult.equals(1) && player.eternityPoints.gte(1e10)) unlockRealityUpgrade(15);
    if (player.eternityPoints.gte("1e10500")) unlockRealityUpgrade(25)

    if (player.reality.upg.includes(13)) {
        if (player.reality.epmultbuyer) buyMaxEPMult();
        for (var i = 1; i < 9; i++) {
            if (player.reality.tdbuyers[i - 1]) {
                buyMaxTimeDims(i);
            }
        }
    }

    if (player.eternityUpgrades.length < 3 && Perk.autounlockEU1.isBought) {
      player.eternityUpgrades = [...new Set(player.eternityUpgrades).add(1).add(2).add(3)];
    }

    if (player.eternityUpgrades.length < 6 && Perk.autounlockEU2.isBought) {
      player.eternityUpgrades = [...new Set(player.eternityUpgrades).add(4).add(5).add(6)];
    }

    if (!player.achievements.includes("r143") && player.lastTenEternities[9][1] !== 1) {
        var n = 0;
        for (i = 0; i < 9; i++) {
            if (player.lastTenEternities[i][1].gte(player.lastTenEternities[i + 1][1].times(Number.MAX_VALUE))) n++;
        }
        if (n === 9) giveAchievement("Yo dawg, I heard you liked reskins...")
    }
  
    resetMoney();

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

const EternityUpgrade = function() {
  const db = GameDatabase.eternity.upgrades;
  return {
    idMultEP: new EternityUpgradeState(db.idMultEP),
    idMultEternities: new EternityUpgradeState(db.idMultEternities),
    idMultICRecords: new EternityUpgradeState(db.idMultICRecords),
    tdMultAchs: new EternityUpgradeState(db.tdMultAchs),
    tdMultTheorems: new EternityUpgradeState(db.tdMultTheorems),
    tdMultRealTime: new EternityUpgradeState(db.tdMultRealTime),

    epMult: {
      get isAffordable() {
        return player.eternityPoints.gte(player.epmultCost);
      },
      get cost() {
        return player.epmultCost;
      },
      purchase() {
        buyEPMult();
      },
      get effectValue() {
        return player.epmult;
      },
      autobuyer: {
        get isUnlocked() {
          return player.reality.upg.includes(13);
        },
        get isOn() {
          return player.reality.epmultbuyer;
        },
        set isOn(value) {
          player.reality.epmultbuyer = value;
        }
      }
    }
  };
}();
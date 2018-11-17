function startEternityChallenge(name, startgoal, goalIncrease) {
    if (player.eternityChallUnlocked === 0 || parseInt(name.split("c")[1]) !== player.eternityChallUnlocked) return false;
    if (!((!player.options.confirmations.challenges) || name === "" ? true : (confirm("You will start over with just your time studies, eternity upgrades and achievements. You need to reach a set IP with special conditions.")))) {
        return false
    }

    player.sacrificed = new Decimal(0);
    player.challenges = (player.eternities >= 2 && isAchEnabled("r133")) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12", "postc1", "postc2", "postc3", "postc4", "postc5", "postc6", "postc7", "postc8"] : (player.eternities >= 2) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : [];
    player.currentChallenge = "";
    player.infinitied = 0;
    player.bestInfinityTime = 9999999999;
    player.thisInfinityTime = 0;
    player.resets = (player.eternities >= 4) ? 4 : 0;
    player.galaxies = (player.eternities >= 4) ? 1 : 0;
    player.tickDecrease = 0.9;
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];
    player.tickspeedMultiplier = new Decimal(10);
    player.lastTenRuns = [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]];
    player.infMult = new Decimal(1);
    player.infMultCost = new Decimal(10);
    player.tickSpeedMultDecrease = player.eternities >= 20 ? player.tickSpeedMultDecrease : 10;
    player.tickSpeedMultDecreaseCost = player.eternities >= 20 ? player.tickSpeedMultDecreaseCost :3e6;
    player.dimensionMultDecrease = player.eternities >= 20 ? player.dimensionMultDecrease : 10;
    player.dimensionMultDecreaseCost = player.eternities >= 20 ? player.dimensionMultDecreaseCost : 1e8;
    player.postChallUnlocked = (isAchEnabled("r133")) ? 8 : 0;
    player.infDimensionsUnlocked = [false, false, false, false, false, false, false, false];
    player.infinityPower = new Decimal(1);
    player.timeShards = new Decimal(0);
    player.tickThreshold = new Decimal(1);
    player.thisEternity = 0;
    player.totalTickGained = 0;
    player.offlineProd = player.eternities >= 20 ? player.offlineProd : 0;
    player.offlineProdCost = player.eternities >= 20 ? player.offlineProdCost : 1e7;
    player.challengeTarget = 0;
    if (player.eternities < 7) {
      player.autoSacrifice = 1;
    }
    player.eternityChallGoal = startgoal.times(goalIncrease.pow(ECTimesCompleted(name))).max(startgoal);
    player.currentEternityChall = name;
    player.autoIP = new Decimal(0);
    player.autoTime = 1e300;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.dimlife = true;
    player.dead = true;

    player.dilation.active = false;
    fullResetInfDimensions();
    eternityResetReplicanti();
    resetChallengeStuff();
    resetDimensions();
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    hidePreMilestone30Elements();
    document.getElementById("matter").style.display = "none";
    updateAutobuyers();
    resetInfinityPointsOnEternity();
    resetInfDimensions();
    updateChallengeTimes();
    updateLastTenRuns();
    updateLastTenEternities();
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    updateMilestones();
    resetTimeDimensions();
    if (player.eternities < 20) Autobuyer.dimboost.buyMaxInterval = 1;
    kong.submitStats('Eternities', player.eternities);
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
    document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
    document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none";
    updateEternityUpgrades();
    resetTickspeed();
    updateTickSpeed();
    resetMoney();
    playerInfinityUpgradesOnEternity();
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">" + shortenDimensions(player.eternityPoints) + "</span> Eternity point" + ((player.eternityPoints.eq(1)) ? "." : "s.");
    Marathon2 = 0;

    return true
}

const TIERS_PER_EC = 5;

class EternityChallengeInfo {
  constructor(id) {
    this._id = id;
    this._fullId = `eterc${id}`;
    this._details = EternityChallengeInfo.details[id];
  }

  get fullId() {
    return this._fullId;
  }

  get isUnlocked() {
    return player.eternityChallUnlocked === this._id;
  }

  get isRunning() {
    return player.currentEternityChall === this.fullId;
  }

  get completions() {
    if (player.eternityChalls[this.fullId] === undefined) {
      return 0;
    }
    return player.eternityChalls[this.fullId];
  }

  get isFullyCompleted() {
    return this.completions === TIERS_PER_EC;
  }

  get initialGoal() {
    return this._details.goal;
  }

  get goalIncrease() {
    return this._details.goalIncrease;
  }

  get currentGoal() {
    return this.goalAtCompletions(this.completions);
  }

  goalAtCompletions(completions) {
    return completions > 0 ?
      this.initialGoal.times(this.goalIncrease.pow(completions)) :
      this.initialGoal;
  }

  get rewardValue() {
    const completions = this.completions;
    if (completions === 0) {
      throw `EC${this._id} has 0 completions - there's no effect yet`;
    }
    return this.rewardValueAtCompletions(completions);
  }

  get nextRewardValue() {
    const completions = this.completions;
    if (completions === TIERS_PER_EC) {
      throw `EC${this._id} has max completions - there's no effect value of next tier`;
    }
    return this.rewardValueAtCompletions(completions + 1);
  }

  rewardValueAtCompletions(completions) {
    return this._details.rewardValue(completions);
  }

  applyReward(applyFn) {
    if (this.completions > 0) {
      applyFn(this.rewardValue);
    }
  }

  addCompletion() {
    player.eternityChalls[this.fullId] = this.completions + 1
    if (this._id === 6) player.dimensionMultDecrease = parseFloat((player.dimensionMultDecrease - 0.2).toFixed(1));
    if (this._id === 11) player.tickSpeedMultDecrease = parseFloat((player.tickSpeedMultDecrease - 0.07).toFixed(2));
  }

  start() {
    startEternityChallenge(this.fullId, this.initialGoal, this.goalIncrease);
  }
}

EternityChallengeInfo.details = [
  null,
  {
    /* EC1 */
    goal: new Decimal('1e1800'),
    goalIncrease: new Decimal('1e200'),
    rewardValue: completions => Math.pow(Math.max(player.thisEternity * 10, 0.9), 0.3 + (completions * 0.05))
  },
  {
    /* EC2 */
    goal: new Decimal('1e975'),
    goalIncrease: new Decimal('1e175'),
    rewardValue: completions => player.infinityPower.pow(1.5 / (700 - completions * 100)).min(new Decimal("1e100")).plus(1)
  },
  {
    /* EC3 */
    goal: new Decimal('1e600'),
    goalIncrease: new Decimal('1e75'),
    rewardValue: completions => completions * 0.8
  },
  {
    /* EC4 */
    goal: new Decimal('1e2750'),
    goalIncrease: new Decimal('1e550'),
    rewardValue: completions => player.infinityPoints.pow(0.003 + completions * 0.002).min(new Decimal("1e200"))
  },
  {
    /* EC5 */
    goal: new Decimal('1e750'),
    goalIncrease: new Decimal('1e400'),
    rewardValue: completions => completions * 5
  },
  {
    /* EC6 */
    goal: new Decimal('1e850'),
    goalIncrease: new Decimal('1e250'),
    rewardValue: completions => completions * 0.2
  },
  {
    /* EC7 */
    goal: new Decimal('1e2000'),
    goalIncrease: new Decimal('1e530'),
    rewardValue: completions => TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).max(0)
  },
  {
    /* EC8 */
    goal: new Decimal('1e1300'),
    goalIncrease: new Decimal('1e900'),
    rewardValue: completions => Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10() + 1), 0.03 * completions) - 1, 0)
  },
  {
    /* EC9 */
    goal: new Decimal('1e1750'),
    goalIncrease: new Decimal('1e250'),
    rewardValue: completions => player.timeShards.pow(completions * 0.1).plus(1).min(new Decimal("1e400"))
  },
  {
    /* EC10 */
    goal: new Decimal('1e3000'),
    goalIncrease: new Decimal('1e300'),
    rewardValue: completions => new Decimal(Math.max(Math.pow(Player.totalInfinitied, 0.9) * completions * 0.000002 + 1, 1))
  },
  {
    /* EC11 */
    goal: new Decimal('1e500'),
    goalIncrease: new Decimal('1e200'),
    rewardValue: completions => completions * 0.07
  },
  {
    /* EC12 */
    goal: new Decimal('1e110000'),
    goalIncrease: new Decimal('1e12000'),
    rewardValue: completions => 1 - completions * 0.008
  }
];


function EternityChallenge(id) {
  return new EternityChallengeInfo(id);
}

/**
 * @returns {EternityChallengeInfo}
 */
EternityChallenge.current = function() {
  if (player.currentEternityChall === String.empty) return undefined;
  const id = parseInt(player.currentEternityChall.split("eterc")[1]);
  return EternityChallenge(id);
};

EternityChallenge.currentAutoCompleteThreshold = function() {
  if (player.reality.perks.includes(95)) return TimeSpan.fromHours(2).totalMilliseconds
  if (player.reality.perks.includes(94)) return TimeSpan.fromHours(4).totalMilliseconds
  if (player.reality.perks.includes(93)) return TimeSpan.fromHours(6).totalMilliseconds
  if (player.reality.perks.includes(92)) return TimeSpan.fromHours(8).totalMilliseconds
  if (player.reality.perks.includes(91)) return TimeSpan.fromHours(12).totalMilliseconds
  else return Infinity
}

EternityChallenge.autoCompleteNext = function() {
  for (let i=1; i<=12; i++) {
    let c = EternityChallenge(i)
    if (!c.isFullyCompleted) {
      c.addCompletion()
      return true
    }
  }
  return false
}

EternityChallenge.autoCompleteTick  = function() {
  let threshold = this.currentAutoCompleteThreshold()
  while (player.reality.lastAutoEC - threshold > 0) {
    this.autoCompleteNext()
    player.reality.lastAutoEC -= threshold
  }
}

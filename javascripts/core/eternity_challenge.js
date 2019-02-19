function startEternityChallenge() {
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
    player.infinitied = new Decimal(0);
    player.bestInfinityTime = 9999999999;
    player.thisInfinityTime = 0;
    player.thisInfinityRealTime = 0;
    player.resets = (player.eternities >= 4) ? 4 : 0;
    player.galaxies = (player.eternities >= 4) ? 1 : 0;
    player.tickDecrease = 0.9;
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];
    player.tickspeedMultiplier = new Decimal(10);
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
    if (player.eternities < 7) {
      player.autoSacrifice = 1;
    }
    player.autoIP = new Decimal(0);
    player.autoTime = 1e300;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.dimlife = true;
    player.dead = true;

    resetInfinityRuns();
    fullResetInfDimensions();
    eternityResetReplicanti();
    resetChallengeStuff();
    resetDimensions();
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    resetInfinityPointsOnEternity();
    resetInfDimensions();
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    resetTimeDimensions();
    if (player.eternities < 20) Autobuyer.dimboost.buyMaxInterval = 1;
    kong.submitStats('Eternities', player.eternities);
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
    resetTickspeed();
    resetMoney();
    playerInfinityUpgradesOnEternity();
    Marathon2 = 0;
    return true;
}

const TIERS_PER_EC = 5;

class EternityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get effectValue() {
    return this.config.effect(this._challenge.completions);
  }

  get canBeApplied() {
    return this._challenge.completions > 0;
  }
}

class EternityChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._fullId = `eterc${this.id}`;
    this._reward = new EternityChallengeRewardState(config.reward, this);
  }

  get fullId() {
    return this._fullId;
  }

  get isUnlocked() {
    return player.eternityChallUnlocked === this.id;
  }

  get isRunning() {
    return player.currentEternityChall === this.fullId;
  }

  get canBeApplied() {
    return this.isRunning;
  }

  get completions() {
    const completions = player.eternityChalls[this.fullId];
    return completions === undefined ? 0 : completions;
  }

  set completions(value) {
    player.eternityChalls[this.fullId] = Math.min(value, TIERS_PER_EC);
  }

  get isFullyCompleted() {
    return this.completions === TIERS_PER_EC;
  }

  get initialGoal() {
    return this.config.goal;
  }

  get goalIncrease() {
    return this.config.goalIncrease;
  }

  get currentGoal() {
    return this.goalAtCompletions(this.completions);
  }

  get isGoalReached() {
    return player.infinityPoints.gte(this.currentGoal);
  }

  get canBeCompleted() {
    return this.isGoalReached && this.isWithinRestriction;
  }

  goalAtCompletions(completions) {
    return completions > 0 ?
      this.initialGoal.times(this.goalIncrease.pow(completions)) :
      this.initialGoal;
  }

  addCompletion() {
    this.completions++;
    if (this.id === 6) {
      GameCache.dimensionMultDecrease.invalidate();
    }
    if (this.id === 11) {
      GameCache.tickSpeedMultDecrease.invalidate();
    }
  }

  start() {
    if (!this.isUnlocked) return false;
    if (player.options.confirmations.challenges) {
      const confirmation =
        "You will start over with just your time studies, " +
        "eternity upgrades and achievements. " +
        "You need to reach a set IP with special conditions.";
      if (!confirm(confirmation)) return false;
    }
    player.eternityChallGoal = this.currentGoal;
    player.currentEternityChall = this.fullId;
    return startEternityChallenge();
  }

  /**
   * @return {EternityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isWithinRestriction() {
    return this.config.restriction === undefined ||
      this.config.checkRestriction(this.config.restriction(this.completions));
  }
}

EternityChallengeState.all = mapGameData(
  GameDatabase.challenges.eternity,
  config => new EternityChallengeState(config)
);

/**
 * @param id
 * @return {EternityChallengeState}
 */
function EternityChallenge(id) {
  return EternityChallengeState.all[id];
}

/**
 * @type {EternityChallengeState[]}
 */
EternityChallenge.all = EternityChallengeState.all;

/**
 * @returns {EternityChallengeState}
 */
EternityChallenge.current = () => {
  if (player.currentEternityChall === String.empty) return undefined;
  const id = parseInt(player.currentEternityChall.split("eterc")[1]);
  return EternityChallenge(id);
};

EternityChallenge.isRunning = () => player.currentEternityChall !== String.empty;

EternityChallenge.TOTAL_TIER_COUNT = EternityChallenge.all.map(ec => ec.id).max() * TIERS_PER_EC;

EternityChallenge.completedTiers = () => {
  return EternityChallenge.all
    .map(ec => ec.completions)
    .sum();
};

EternityChallenge.remainingTiers = () => EternityChallenge.TOTAL_TIER_COUNT - EternityChallenge.completedTiers();

EternityChallenge.currentAutoCompleteThreshold = function() {
  let hours = Effects.min(
    Number.MAX_VALUE,
    Perk.autocompleteEC1,
    Perk.autocompleteEC2,
    Perk.autocompleteEC3,
    Perk.autocompleteEC4,
    Perk.autocompleteEC5
  );
  if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0])) hours /= V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[0].effect()
  return hours === Number.MAX_VALUE ? Infinity : TimeSpan.fromHours(hours).totalMilliseconds;
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
  let isPostEc = player.reality.upg.includes(10) ? player.eternities > 100 : player.eternities > 0
  if (!isPostEc || !player.autoEcIsOn) return
  let threshold = this.currentAutoCompleteThreshold()
  while (player.reality.lastAutoEC - threshold > 0) {
    this.autoCompleteNext()
    player.reality.lastAutoEC -= threshold
  }
}

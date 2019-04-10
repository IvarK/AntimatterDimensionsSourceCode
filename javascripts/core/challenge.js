function startChallenge(name, target) {
    if (!askChallengeConfirmation(name)) return;
    player.currentChallenge = name;
    player.challengeTarget = target;
    secondSoftReset();
    Tab.dimensions.normal.show();
}

function askChallengeConfirmation(challenge) {
    if (!player.options.confirmations.challenges || challenge === ""){
        return true;
    }
    let goal = challenge.includes("post") ? "a set goal" : "infinity";
    let message = "You will start over with just your infinity upgrades, and achievements. " +
        "You need to reach " + goal + " with special conditions. " +
        "NOTE: The rightmost infinity upgrade column doesn't work on challenges.";
    return confirm(message);
}

function setChallengeTime(id, time) {
  // Use splice so Vue could track changes
  player.challengeTimes.splice(id, 1, time);
  GameCache.challengeTimeSum.invalidate();
  GameCache.worstChallengeTime.invalidate();
  Achievements.tryUnlock([65, 74]);
}

function setInfChallengeTime(id, time) {
  // Use splice so Vue could track changes
  player.infchallengeTimes.splice(id, 1, time);
  GameCache.infinityChallengeTimeSum.invalidate();
  Achievement(112).tryUnlock();
}

class ChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._fullId = `challenge${this.id}`;
  }

  get fullId() {
    return this._fullId;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get isRunning() {
    const isPartOfIC1 = this.id !== 9 && this.id !== 12;
    return player.currentChallenge === this._fullId || (isPartOfIC1 && InfinityChallenge(1).isRunning);
  }

  start() {
    if (this.id === 1) return;
    startChallenge(this._fullId, new Decimal(Number.MAX_VALUE));
  }

  get isCompleted() {
    return player.challenges.includes(this._fullId);
  }

  complete() {
    if (this.isCompleted) return;
    player.challenges.push(this._fullId);
  }
}

ChallengeState.all = mapGameData(
  GameDatabase.challenges.normal,
  data => new ChallengeState(data)
);

/**
 * @param {number} id
 * @return {ChallengeState}
 */
function Challenge(id) {
  return ChallengeState.all[id];
}

/**
 * @returns {ChallengeState}
 */
Challenge.current = function() {
  const challenge = player.currentChallenge;
  if (!challenge.startsWith("challenge")) {
    return undefined;
  }
  return Challenge(parseInt(challenge.substr(9)));
};

Challenge.isRunning = () => Challenge.current() !== undefined;

/**
 * @type {ChallengeState[]}
 */
Challenge.all = Array.range(1, 12).map(Challenge);

class InfinityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get canBeApplied() {
    return this._challenge.isCompleted;
  }
}

class InfinityChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._fullId = `postc${this.id}`;
    this._reward = new InfinityChallengeRewardState(config.reward, this);
  }

  get fullId() {
    return this._fullId;
  }

  get isUnlocked() {
    return player.postChallUnlocked >= this.id;
  }

  get isRunning() {
    return player.currentChallenge === this._fullId;
  }

  start() {
    startChallenge(this._fullId, this.config.goal);
    player.break = true;
    if (EternityChallenge.isRunning())
      giveAchievement("I wish I had gotten 7 eternities");
  }

  get isCompleted() {
    return player.challenges.includes(this._fullId);
  }

  complete() {
    if (this.isCompleted) return;
    player.challenges.push(this._fullId);
  }

  get canBeApplied() {
    return this.isRunning;
  }

  /**
   * @return {InfinityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable;
  }
}

InfinityChallengeState.all = mapGameData(
  GameDatabase.challenges.infinity,
  data => new InfinityChallengeState(data)
);

/**
 * @param {number} id
 * @return {InfinityChallengeState}
 */
function InfinityChallenge(id) {
  return InfinityChallengeState.all[id];
}

/**
 * @returns {InfinityChallengeState}
 */
InfinityChallenge.current = function() {
  const challenge = player.currentChallenge;
  return challenge.startsWith("postc") ?
    InfinityChallenge(parseInt(challenge.substr(5))) :
    undefined;
};

/**
 * @return {boolean}
 */
InfinityChallenge.isRunning = function() {
  return InfinityChallenge.current() !== undefined;
};

/**
 * @type {InfinityChallengeState[]}
 */
InfinityChallenge.all = Array.range(1, 8).map(InfinityChallenge);

/**
 * @return {InfinityChallengeState[]}
 */
InfinityChallenge.completed = function() {
  return InfinityChallenge.all
    .filter(ic => ic.isCompleted);
};

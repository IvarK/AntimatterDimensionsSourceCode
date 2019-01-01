function startChallenge(name, target) {
    if (name === "challenge1") return;
    if (!askChallengeConfirmation(name)) {
        return;
    }
    player.currentChallenge = name;
    player.challengeTarget = target;
    secondSoftReset();
    if (player.currentChallenge.includes("post")) player.break = true;
    Tab.dimensions.normal.show();
    if (player.currentChallenge.includes("post") && player.currentEternityChall !== "")
        giveAchievement("I wish I had gotten 7 eternities");
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
}

function setInfChallengeTime(id, time) {
    // Use splice so Vue could track changes
    player.infchallengeTimes.splice(id, 1, time);
}

function isQuickResettable(challenge) {
  const resettableChallenges = [
    "challenge12",
    "challenge9",
    "challenge5",
    "postc1",
    "postc4",
    "postc5",
    "postc6",
    "postc8"
  ];
  return resettableChallenges.includes(challenge);
}

class ChallengeState {
  constructor(id) {
    this._id = id;
    this._fullId = `challenge${id}`;
  }

  get isRunning() {
    return player.currentChallenge === this._fullId;
  }

  get isCompleted() {
    return player.challenges.includes(this._fullId);
  }
}

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

  get isUnlocked() {
    return player.postChallUnlocked >= this.id;
  }

  get isRunning() {
    return player.currentChallenge === this._fullId;
  }

  start() {
    startChallenge(this._fullId, this.config.goal);
  }

  get isCompleted() {
    return player.challenges.includes(this._fullId);
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
 * @return {InfinityChallengeState[]}
 */
InfinityChallenge.completed = function() {
  return Array.range(1, 8)
    .map(InfinityChallenge)
    .filter(ic => ic.isCompleted);
};
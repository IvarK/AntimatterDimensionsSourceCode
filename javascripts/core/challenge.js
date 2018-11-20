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

class InfinityChallengeInfo {
  constructor(id) {
    this._id = id;
    this._fullId = `postc${id}`;
  }

  get isRunning() {
    return player.currentChallenge === this._fullId;
  }
}

function InfinityChallenge(id) {
  return new InfinityChallengeInfo(id);
}

/**
 * @returns {InfinityChallengeInfo}
 */
InfinityChallenge.current = function() {
  const challenge = player.currentChallenge;
  if (challenge === String.empty) return undefined;
  if (!challenge.includes("postc")) return undefined;
  const id = parseInt(challenge.split("postc")[1]);
  return InfinityChallenge(id);
};

InfinityChallenge.isRunning = function() {
  return InfinityChallenge.current() !== undefined;
};
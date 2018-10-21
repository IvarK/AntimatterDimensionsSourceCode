function startChallenge(name, target) {
    if (!askChallengeConfirmation(name)) {
        return;
    }
    player.currentChallenge = name;
    player.challengeTarget = target;
    secondSoftReset();
    if (player.currentChallenge.includes("post")) player.break = true;
    showTab("dimensions");
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
function startChallenge(name, target) {
    if (!askChallengeConfirmation(name)) {
        return;
    }
    player.currentChallenge = name;
    player.thisInfinityTime = 0;
    player.resets = 0;
    player.galaxies = 0;
    player.tickDecrease = 0.9;
    player.challengeTarget = target;
    resetChallengeStuff();
    resetDimensions();
    applyChallengeModifiers();
    skipResetsIfPossible();
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    setInitialDimensionPower();
    IPminpeak = new Decimal(0);
    hidePreMilestone30Elements();
    updateChallenges();
    showTab("dimensions");
    document.getElementById("replicantireset").innerHTML =
        "Reset replicanti amount, but get a free galaxy<br>" + player.replicanti.galaxies + " replicated galaxies created.";
    resetInfDimensions();
    resetTickspeed();
    updateTickSpeed();
    resetMoney();
    if (player.currentChallenge.includes("post") && player.currentEternityChall !== "")
        giveAchievement("I wish I had gotten 7 eternities");
    Marathon2 = 0;
    updateChallengeElements();
}

function updateChallengeElements() {
    document.getElementById("fifthRow").style.display = "none";
    document.getElementById("sixthRow").style.display = "none";
    document.getElementById("seventhRow").style.display = "none";
    document.getElementById("eightRow").style.display = "none";
    if (name === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6")
        document.getElementById("matter").style.display = "block";
    else
        document.getElementById("matter").style.display = "none";
    if (name === "challenge12" || name === "challenge9" || name === "challenge5" || player.currentChallenge === "postc1" || player.currentChallenge === "postc4" || player.currentChallenge === "postc5" || player.currentChallenge === "postc6" || player.currentChallenge === "postc8")
        document.getElementById("quickReset").style.display = "inline-block";
    else
        document.getElementById("quickReset").style.display = "none";
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
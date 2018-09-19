function startChallenge(name, target) {
    if (!askChallengeConfirmation(name)) {
        return;
    }
    if (player.currentChallenge !== "") document.getElementById(player.currentChallenge).textContent = "Start";
    player.money = new Decimal(10);
    player.tickSpeedCost = new Decimal(1000);
    player.tickspeed = new Decimal(1000);
    player.firstCost = new Decimal(10);
    player.secondCost = new Decimal(100);
    player.thirdCost = new Decimal(10000);
    player.fourthCost = new Decimal(1000000);
    player.fifthCost = new Decimal(1e9);
    player.sixthCost = new Decimal(1e13);
    player.seventhCost = new Decimal(1e18);
    player.eightCost = new Decimal(1e24);
    player.firstAmount = new Decimal(0);
    player.secondAmount = new Decimal(0);
    player.thirdAmount = new Decimal(0);
    player.fourthAmount = new Decimal(0);
    player.firstBought = 0;
    player.secondBought = 0;
    player.thirdBought = 0;
    player.fourthBought = 0;
    player.fifthAmount = new Decimal(0);
    player.sixthAmount = new Decimal(0);
    player.seventhAmount = new Decimal(0);
    player.eightAmount = new Decimal(0);
    player.fifthBought = 0;
    player.sixthBought = 0;
    player.seventhBought = 0;
    player.eightBought = 0;
    player.firstPow = new Decimal(1);
    player.secondPow = new Decimal(1);
    player.thirdPow = new Decimal(1);
    player.fourthPow = new Decimal(1);
    player.fifthPow = new Decimal(1);
    player.sixthPow = new Decimal(1);
    player.seventhPow = new Decimal(1);
    player.eightPow = new Decimal(1);
    player.sacrificed = new Decimal(0);
    player.currentChallenge = name;
    player.thisInfinityTime = 0;
    player.resets = 0;
    player.galaxies = 0;
    player.tickDecrease = 0.9;
    player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)];
    player.tickspeedMultiplier = new Decimal(10);
    player.chall2Pow = 1;
    player.chall3Pow = new Decimal(0.01);
    player.matter = new Decimal(0);
    player.chall11Pow = new Decimal(1);
    player.postC4Tier = 1;
    player.postC3Reward = new Decimal(1);
    player.challengeTarget = target;
    if (player.currentChallenge === "challenge10" || player.currentChallenge === "postc1") {
        player.thirdCost = new Decimal(100);
        player.fourthCost = new Decimal(500);
        player.fifthCost = new Decimal(2500);
        player.sixthCost = new Decimal(2e4);
        player.seventhCost = new Decimal(2e5);
        player.eightCost = new Decimal(4e6)
    }
    if (player.currentChallenge === "postc1") player.costMultipliers = [new Decimal(1e3), new Decimal(5e3), new Decimal(1e4), new Decimal(1.2e4), new Decimal(1.8e4), new Decimal(2.6e4), new Decimal(3.2e4), new Decimal(4.2e4)];
    if (player.currentChallenge === "postc2") {
        player.eightAmount = new Decimal(1);
        player.eightBought = 1;
        player.resets = 4;
    }
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    setInitialDimensionPower();
    IPminpeak = new Decimal(0);
    if (player.currentChallenge.includes("post")) player.break = trueif(isAchEnabled("r36"));
    player.tickspeed = player.tickspeed.times(0.98);
    if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);
    if (isAchEnabled("r66")) player.tickspeed = player.tickspeed.times(0.98);
    if (isAchEnabled("r83")) player.tickspeed = player.tickspeed.times(Decimal.pow(0.95, player.galaxies));
    if (player.eternities < 30) {
        document.getElementById("secondRow").style.display = "none";
        document.getElementById("thirdRow").style.display = "none";
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        document.getElementById("fourthRow").style.display = "none";
    }
    document.getElementById("fifthRow").style.display = "none";
    document.getElementById("sixthRow").style.display = "none";
    document.getElementById("seventhRow").style.display = "none";
    document.getElementById("eightRow").style.display = "none";
    if (name === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6") document.getElementById("matter").style.display = "block";
    else document.getElementById("matter").style.display = "none";
    if (name === "challenge12" || name === "challenge9" || name === "challenge5" || player.currentChallenge === "postc1" || player.currentChallenge === "postc4" || player.currentChallenge === "postc5" || player.currentChallenge === "postc6" || player.currentChallenge === "postc8") document.getElementById("quickReset").style.display = "inline-block";
    else document.getElementById("quickReset").style.display = "none";
    showTab('dimensions');
    updateChallenges();
    if (isAchEnabled("r21")) player.money = new Decimal(100).max(player.money);
    if (isAchEnabled("r37")) player.money = new Decimal(1000);
    if (isAchEnabled("r54")) player.money = new Decimal(2e5);
    if (isAchEnabled("r55")) player.money = new Decimal(1e10);
    if (isAchEnabled("r78")) player.money = new Decimal(1e25);
    showTab("dimensions");
    kong.submitStats('Infinitied', getInfinitied());
    kong.submitStats('Fastest Infinity time', Math.floor(player.bestInfinityTime / 10));
    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
    document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>" + player.replicanti.galaxies + " replicated galaxies created.";
    resetInfDimensions();
    player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained));
    updateTickSpeed();
    if (player.resets === 0 && player.currentChallenge === "") {
        if (player.infinityUpgrades.includes("skipReset1")) player.resets++;
        if (player.infinityUpgrades.includes("skipReset2")) player.resets++;
        if (player.infinityUpgrades.includes("skipReset3")) player.resets++;
        if (player.infinityUpgrades.includes("skipResetGalaxy")) {
            player.resets++;
            if (player.galaxies === 0) player.galaxies = 1
        }
    }
    if (player.currentChallenge.includes("post") && player.currentEternityChall !== "") giveAchievement("I wish I had gotten 7 eternities");
    Marathon2 = 0;
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
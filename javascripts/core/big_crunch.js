function bigCrunchReset() {
    var challNumber = parseInt(player.currentChallenge[player.currentChallenge.length-1]);
    if (player.currentChallenge.length === 11) challNumber = parseInt("1"+player.currentChallenge[player.currentChallenge.length-1]);
    const isInChallenge = player.currentChallenge !== "";
    const isInPreBreakChallenge = isInChallenge && !player.currentChallenge.includes("post");
    if (player.money.lt(Number.MAX_VALUE)) {
        return;
    }
    if (isInChallenge && player.money.lt(player.challengeTarget)) {
        return;
    }

    if ((player.bestInfinityTime > 60000 && !player.break) && implosionCheck === 0 && player.options.animations.bigCrunch) {
        implosionCheck = 1;
        document.getElementById("body").style.animation = "implode 2s 1";
        setTimeout(function() {
            document.getElementById("body").style.animation = "";
        }, 2000);
        setTimeout(bigCrunchReset, 1000);
        return
    }
    implosionCheck = 0;
    if (player.currentChallenge !== "" && !player.challenges.includes(player.currentChallenge)) {
        player.challenges.push(player.currentChallenge);
    }
    if (player.currentChallenge !== "" && player.challengeTimes[challNumber - 2] > player.thisInfinityTime) {
        setChallengeTime(challNumber - 2, player.thisInfinityTime);
    }
    if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber - 1] > player.thisInfinityTime) {
        setInfChallengeTime(challNumber - 1, player.thisInfinityTime);
    }
    if ((player.bestInfinityTime > 60000 && !player.break) || (player.currentChallenge !== "" && !player.options.retryChallenge)) showTab("dimensions");
    if (player.currentChallenge === "challenge5") {
        kong.submitStats('Challenge 9 time record (ms)', Math.floor(player.thisInfinityTime * 100));
    }
    let infinityPoints = gainedInfinityPoints();
    player.infinityPoints = player.infinityPoints.plus(infinityPoints);
    addTime(player.thisInfinityTime, infinityPoints);
    if (player.realities > 0 && getInfinitied() === 0 && player.eternities === 0 && player.galaxies <= 1) {
      unlockRealityUpgrade(7);
    }
    if (player.currentEternityChall === "eterc4" && player.infinitied >= 16 - (ECTimesCompleted("eterc4") * 4)) {
        failChallenge();
    }

    if (player.realities > 0 && (player.eternities === 0 || (player.reality.upg.includes(10) && player.eternities === 100)) && player.infinitied === 0) {
        if (checkForRUPG8()) unlockRealityUpgrade(8);
    }

    if (autoS && auto) {
        let autoIp = infinityPoints.dividedBy(player.thisInfinityTime / 100);
        if (autoIp.gt(player.autoIP) && !player.break) player.autoIP = autoIp;
        if (player.thisInfinityTime < player.autoTime) player.autoTime = player.thisInfinityTime;
    }

    auto = autoS; //only allow autoing if prev crunch was autoed
    autoS = true;
    player.infinitied = player.infinitied + Math.round(gainedInfinities());
    player.bestInfinityTime = Math.min(player.bestInfinityTime, player.thisInfinityTime);

    checkBigCrunchAchievements();
    if (!player.options.retryChallenge)
        player.currentChallenge = "";

    checkForEndMe();

    kong.submitStats('Infinitied', getInfinitied());
    kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime * 100));

    let currenReplicanti = player.replicanti.amount;
    let currentReplicantiGalaxies = player.replicanti.galaxies;
    secondSoftReset();

    if (isAchEnabled("r95")) {
        player.replicanti.amount = currenReplicanti;
    }
    if (player.timestudy.studies.includes(33)) {
        player.replicanti.galaxies = Math.floor(currentReplicantiGalaxies / 2);
    }

    if (player.eternities > 10 && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc10") {
        for (var i = 1; i < player.eternities - 9 && i < 9; i++) {
            if (player.infDimBuyers[i - 1]) {
                buyMaxInfDims(i);
                buyManyInfinityDimension(i)
            }
        }
    }

    if (player.eternities >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.chanceCost) && player.currentEternityChall !== "eterc8" && player.replicanti.chance < 1) upgradeReplicantiChance()
    }

    if (player.eternities >= 60 && player.replicanti.auto[1] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && ((player.timestudy.studies.includes(22)) ? player.replicanti.interval > 1 : player.replicanti.interval > 50)) upgradeReplicantiInterval()
    }

    if (player.eternities >= 80 && player.replicanti.auto[2] && player.currentEternityChall !== "eterc8") {
        while (player.infinityPoints.gte(player.replicanti.galCost)) upgradeReplicantiGalaxy()
    }

    updateChallengeTimes();
    updateLastTenRuns();
}

function secondSoftReset() {
    player.resets = 0;
    player.galaxies = 0;
    player.tickDecrease = 0.9;
    resetMoney();
    softReset(0);
    updateAutobuyers();
    resetInfDimensions();
    updateChallenges();
    IPminpeak = new Decimal(0);
    if (player.replicanti.unl)
        player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    player.thisInfinityTime = 0;
    document.getElementById("replicantireset").innerHTML =
        "Reset replicanti amount, but get a free galaxy<br>" + player.replicanti.galaxies + " replicated galaxies created.";
    updateChallengeElements();
    Marathon2 = 0;
}

function updateChallengeElements() {
    if (name === "challenge12" || player.currentChallenge === "postc1" || player.currentChallenge === "postc6")
        document.getElementById("matter").style.display = "block";
    else
        document.getElementById("matter").style.display = "none";
    if (name === "challenge12" || name === "challenge9" || name === "challenge5" || player.currentChallenge === "postc1" || player.currentChallenge === "postc4" || player.currentChallenge === "postc5" || player.currentChallenge === "postc6" || player.currentChallenge === "postc8")
        document.getElementById("quickReset").style.display = "inline-block";
    else
        document.getElementById("quickReset").style.display = "none";
}

function checkBigCrunchAchievements() {
    giveAchievement("To infinity!");
    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
    if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
    if (player.thisInfinityTime <= 7200000) giveAchievement("That's fast!");
    if (player.thisInfinityTime <= 600000) giveAchievement("That's faster!");
    if (player.thisInfinityTime <= 60000) giveAchievement("Forever isn't that long");
    if (player.thisInfinityTime <= 200) giveAchievement("Blink of an eye");
    if (player.eightAmount === 0) giveAchievement("You didn't need it anyway");
    if (player.galaxies === 1) giveAchievement("Claustrophobic");
    if (player.galaxies === 0 && player.resets === 0) giveAchievement("Zero Deaths");
    if (player.currentChallenge === "challenge2" && player.thisInfinityTime <= 180000) giveAchievement("Many Deaths");
    if (player.currentChallenge === "challenge11" && player.thisInfinityTime <= 180000) giveAchievement("Gift from the Gods");
    if (player.currentChallenge === "challenge5" && player.thisInfinityTime <= 180000) giveAchievement("Is this hell?");
    if (player.currentChallenge === "challenge3" && player.thisInfinityTime <= 10000) giveAchievement("You did this again just for the achievement right?");
    if (player.firstAmount === 1 && player.resets === 0 && player.galaxies === 0 && player.currentChallenge === "challenge12") giveAchievement("ERROR 909: Dimension not found");
    if (player.currentChallenge === "postc5" && player.thisInfinityTime <= 10000) giveAchievement("Hevipelle did nothing wrong");
    if (player.challenges.length >= 2) giveAchievement("Daredevil");
    if (player.challenges.length === 12) giveAchievement("AntiChallenged");
    if (player.challenges.length > 12) giveAchievement("Infinitely Challenging");
    if (player.challenges.length === 20) giveAchievement("Anti-antichallenged");
    if (player.break && player.currentChallenge === "") {
        const infinityPoints = gainedInfinityPoints();
        if (infinityPoints.gte(1e150)) giveAchievement("All your IP are belong to us");
        if (infinityPoints.gte(1e200) && player.thisInfinityTime <= 2000) giveAchievement("Ludicrous Speed");
        if (infinityPoints.gte(1e250) && player.thisInfinityTime <= 20000) giveAchievement("I brake for nobody")
    }
    if (!player.achievements.includes("r111") && player.lastTenRuns[9][1] !== 1) {
        var n = 0;
        for (i = 0; i < 9; i++) {
            if (player.lastTenRuns[i][1].gte(player.lastTenRuns[i + 1][1].times(Number.MAX_VALUE))) n++;
        }
        if (n === 9) giveAchievement("Yo dawg, I heard you liked infinities...")
    }
    if (player.bestInfinityTime <= 1) giveAchievement("Less than or equal to 0.001");
}

document.getElementById("bigcrunch").onclick = bigCrunchReset;
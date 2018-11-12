function eternity(force, auto) {
    if (!force && player.infinityPoints.lt(player.eternityChallGoal)) {
        return false;
    }
    if (!force && !auto && !askEternityConfirmation()) {
        return false;
    }
    if (player.currentEternityChall === "eterc4" && player.infinitied > Math.max(16 - (ECTimesCompleted("eterc4") * 4), 0)) {
        return false;
    }
    if (force) player.currentEternityChall = "";
    if (player.currentEternityChall !== "" && player.infinityPoints.lt(player.eternityChallGoal)) return false;
    if (player.thisEternity < player.bestEternity && !force) {
        player.bestEternity = player.thisEternity;
        if (player.bestEternity < 30000) giveAchievement("That wasn't an eternity");
        if (player.bestEternity <= 1) giveAchievement("Less than or equal to 0.001");
    }
    if (player.thisEternity < 200) giveAchievement("Eternities are the new infinity");
    if (player.infinitied < 10 && !force) giveAchievement("Do you really need a guide for this?");
    if (Decimal.round(player.replicanti.amount).eq(9)) giveAchievement("We could afford 9");
    if (player.dimlife && !force) giveAchievement("8 nobody got time for that");
    if (player.dead && !force) giveAchievement("You're already dead.");
    if (player.infinitied <= 1 && !force) giveAchievement("Do I really need to infinity");
    if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 60000 && player.dilation.active && !force) giveAchievement("Now you're thinking with dilation!");
    let temp = [];
    player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints());
    addEternityTime(player.thisEternity, gainedEternityPoints());
    if (player.currentEternityChall !== "") {
        var challNum = parseInt(player.currentEternityChall.split("eterc")[1]);
        var completitions = 1;
        if (player.reality.perks.includes(32)) {
            var maxEC4Valid = 5 - Math.ceil(player.infinitied / 4);
            var maxEC12Valid = 5 - Math.floor(player.thisEternity / 200);
            while (completitions < 5 - ECTimesCompleted(player.currentEternityChall) &&
            player.infinityPoints.gte(getECGoalIP(challNum, ECTimesCompleted(player.currentEternityChall) + completitions))) completitions += 1;
            var totalCompletions = ECTimesCompleted(player.currentEternityChall) + completitions;

            if (player.currentEternityChall === "eterc4" && totalCompletions >= maxEC4Valid)
                completitions = Math.min(totalCompletions, maxEC4Valid) - ECTimesCompleted(player.currentEternityChall);
            if (player.currentEternityChall === "eterc12" && totalCompletions >= maxEC12Valid)
                completitions = Math.min(totalCompletions, maxEC12Valid) - ECTimesCompleted(player.currentEternityChall)

        }
        if (player.currentEternityChall === "eterc6" && ECTimesCompleted("eterc6") < 5) player.dimensionMultDecrease = parseFloat((player.dimensionMultDecrease - 0.2 * completitions).toFixed(1));
        if (player.currentEternityChall === "eterc11" && ECTimesCompleted("eterc11") < 5) player.tickSpeedMultDecrease = parseFloat((player.tickSpeedMultDecrease - 0.07 * completitions).toFixed(2));
        if (player.eternityChalls[player.currentEternityChall] === undefined) {
            player.eternityChalls[player.currentEternityChall] = completitions
        } else if (player.eternityChalls[player.currentEternityChall] < 5) player.eternityChalls[player.currentEternityChall] += completitions;
        player.etercreq = 0;
        respecTimeStudies();
        if (Object.keys(player.eternityChalls).length >= 10) {
            var eterchallscompletedtotal = 0;
            for (let i = 1; i < Object.keys(player.eternityChalls).length + 1; i++) {
                eterchallscompletedtotal += player.eternityChalls["eterc" + i]
            }
            if (eterchallscompletedtotal >= 50) {
                giveAchievement("5 more eternities until the update");
            }
        }

    }
    for (let i = 0; i < player.challenges.length; i++) {
        if (!player.challenges[i].includes("post") && player.eternities > 1) temp.push(player.challenges[i])
    }
    if (player.timestudy.studies.includes(191)) player.infinitiedBank += Math.floor(player.infinitied * 0.05);
    if (isAchEnabled("r131")) player.infinitiedBank += Math.floor(player.infinitied * 0.05);
    if (player.infinitiedBank > 5000000000) giveAchievement("No ethical consumption");
    if (player.realities > 0 && (player.eternities === 0 || (player.eternities === 100 && player.reality.upg.includes(10))) && player.reality.upgReqChecks[0]) {
      unlockRealityUpgrade(6);
    }
    if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
        player.dilation.tachyonParticles = player.dilation.tachyonParticles.plus(getTachyonGain());
        player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.plus(getTachyonGain())
    }
    if (player.realities > 0 && player.eternities === 0 && player.infinityPoints.gte(new Decimal("1e400"))) unlockRealityUpgrade(10);
    player.challenges = temp;
    if (!force) {
        var tempEterGain = 1;
        if (player.reality.rebuyables[3] > 0) tempEterGain *= Math.pow(3, player.reality.rebuyables[3]);
        player.eternities += tempEterGain
    }
    player.sacrificed = new Decimal(0);
    player.challenges= (player.eternities >= 2 && isAchEnabled("r133")) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12", "postc1", "postc2", "postc3", "postc4", "postc5", "postc6", "postc7", "postc8"] : (player.eternities >= 2) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : [];
    player.currentChallenge = "";
    player.infinitied = 0;
    player.bestInfinityTime = 999999999999;
    player.thisInfinityTime = 0;
    player.resets = (player.eternities >= 4) ? 4  : 0;
    player.galaxies = (player.eternities >= 4) ? 1  : 0;
    player.tickDecrease = 0.9;
    player.autobuyers= (player.eternities >= 2) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.break= player.eternities >= 2 ? player.break : false;
    player.lastTenRuns = [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]];
    player.infMult = new Decimal(1);
    player.infMultCost = new Decimal(10);
    player.tickSpeedMultDecrease= player.eternities >= 20 ? player.tickSpeedMultDecrease : 10;
    player.tickSpeedMultDecreaseCost= player.eternities >= 20 ? player.tickSpeedMultDecreaseCost : 3e6;
    player.dimensionMultDecrease= player.eternities >= 20 ? player.dimensionMultDecrease : 10;
    player.dimensionMultDecreaseCost= player.eternities >= 20 ? player.dimensionMultDecreaseCost : 1e8;
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
    player.eternityChallGoal = new Decimal(Number.MAX_VALUE);
    player.currentEternityChall = "";
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
    if (player.respec) respecTimeStudies();
    player.respec = false;
    giveAchievement("Time is relative");
    if (player.eternities >= 100) giveAchievement("This mile took an Eternity");
    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    document.getElementById("respec").className = "storebtn";

    hidePreMilestone30Elements();

    document.getElementById("matter").style.display = "none";
    if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");

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
    if (player.eternities < 50) {
        document.getElementById("replicantidiv").style.display = "none";
        document.getElementById("replicantiunlock").style.display = "inline-block"
    } else if (document.getElementById("replicantidiv").style.display === "none" && player.eternities >= 50) {
        document.getElementById("replicantidiv").style.display = "inline-block";
        document.getElementById("replicantiunlock").style.display = "none"
    }
    try {
        kong.submitStats('Eternities', player.eternities);
    } catch (err) {
        console.log("Couldn't load Kongregate API")
    }
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
    document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
    document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
    document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>" + player.replicanti.galaxies + " replicated galaxies created.";
    document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none";
    updateEternityUpgrades();
    resetTickspeed();
    updateTickSpeed();
    resetMoney();
    playerInfinityUpgradesOnEternity();
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">" + shortenDimensions(player.eternityPoints) + "</span> Eternity point" + ((player.eternityPoints.eq(1)) ? "." : "s.");
    if (player.eternities === 1 || (player.reality.rebuyables[3] > 0 && player.eternities == Math.pow(3, player.reality.rebuyables[3]) && player.eternityPoints.lte(10))) {
        Tab.dimensions.time.show();
    }
    Marathon2 = 0;
    if (player.realities > 0 && player.infinitiedBank > 1e12) unlockRealityUpgrade(11);
    if (player.eternityPoints.gte(1e70) && ECTimesCompleted("eterc1") === 0) unlockRealityUpgrade(12);
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

    if (player.eternityUpgrades.length < 3 && player.reality.perks.includes(81)) {
      player.eternityUpgrades = [...new Set(player.eternityUpgrades).add(1).add(2).add(3)];
    }

    if (player.eternityUpgrades.length < 6 && player.reality.perks.includes(82)) {
      player.eternityUpgrades = [...new Set(player.eternityUpgrades).add(4).add(5).add(6)];
    }

    if (!player.achievements.includes("r143") && player.lastTenEternities[9][1] !== 1) {
        var n = 0;
        for (i = 0; i < 9; i++) {
            if (player.lastTenEternities[i][1].gte(player.lastTenEternities[i + 1][1].times(Number.MAX_VALUE))) n++;
        }
        if (n === 9) giveAchievement("Yo dawg, I heard you liked reskins...")
    }


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
  if (isAchEnabled("r104")) {
    player.infinityPoints = player.infinityPoints.max(2e25);
  }
}

function resetInfinityPoints() {
  let ip = 0;
  if (player.reality.perks.includes(54)) ip = 2e130;
  else if (player.reality.perks.includes(53)) ip = 2e15;
  player.infinityPoints = new Decimal(ip);
}
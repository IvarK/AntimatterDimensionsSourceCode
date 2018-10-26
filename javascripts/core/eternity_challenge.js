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
    player.autoSacrifice = player.eternities >= 7 ? player.autoSacrifice : 1;
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
    var autobuyers = document.getElementsByClassName('autoBuyerDiv');
    if (player.eternities < 2) {
        for (var i = 0; i < autobuyers.length; i++) autobuyers.item(i).style.display = "none"
        document.getElementById("buyerBtnDimBoost").style.display = "inline-block";
        document.getElementById("buyerBtnGalaxies").style.display = "inline-block";
        document.getElementById("buyerBtnInf").style.display = "inline-block";
        document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
    }
    updateAutobuyers();
    resetInfinityPointsOnEternity();
    resetInfDimensions();
    updateChallenges();
    updateChallengeTimes();
    updateLastTenRuns();
    updateLastTenEternities();
    var infchalls = Array.from(document.getElementsByClassName('infchallengediv'));
    for (var i = 0; i < infchalls.length; i++) infchalls[i].style.display = "none"
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    updateMilestones();
    resetTimeDimensions();
    if (player.eternities < 20) player.autobuyers[9].bulk = 1;
    if (player.eternities < 20) document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk;
    if (player.eternities < 50) {
        document.getElementById("replicantidiv").style.display = "none";
        document.getElementById("replicantiunlock").style.display = "inline-block"
    }
    kong.submitStats('Eternities', player.eternities);
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
    document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
    document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
    if (player.eternities < 2) document.getElementById("break").textContent = "BREAK INFINITY";
    document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>" + player.replicanti.galaxies + " replicated galaxies created.";
    document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none";
    document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: " + shorten(player.infMult.times(kongIPMult)) + "x<br>Cost: " + shortenCosts(player.infMultCost) + " IP";
    updateEternityUpgrades();
    resetTickspeed();
    updateTickSpeed();
    resetMoney();
    playerInfinityUpgradesOnEternity();
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">" + shortenDimensions(player.eternityPoints) + "</span> Eternity point" + ((player.eternityPoints.eq(1)) ? "." : "s.");
    updateChallenges();
    updateEternityChallenges();
    Marathon2 = 0;

    return true
}
function startEternityChallenge(name, startgoal, goalIncrease) {
    if (player.eternityChallUnlocked === 0 || parseInt(name.split("c")[1]) !== player.eternityChallUnlocked) return false;
    if (!((!player.options.confirmations.challenges) || name === "" ? true : (confirm("You will start over with just your time studies, eternity upgrades and achievements. You need to reach a set IP with special conditions.")))) {
        return false
    }
    player = {
        money: new Decimal(10),
        tickSpeedCost: new Decimal(1000),
        tickspeed: new Decimal(1000),
        firstCost: new Decimal(10),
        secondCost: new Decimal(100),
        thirdCost: new Decimal(10000),
        fourthCost: new Decimal(1000000),
        fifthCost: new Decimal(1e9),
        sixthCost: new Decimal(1e13),
        seventhCost: new Decimal(1e18),
        eightCost: new Decimal(1e24),
        firstAmount: new Decimal(0),
        secondAmount: new Decimal(0),
        thirdAmount: new Decimal(0),
        fourthAmount: new Decimal(0),
        firstBought: 0,
        secondBought: 0,
        thirdBought: 0,
        fourthBought: 0,
        fifthAmount: new Decimal(0),
        sixthAmount: new Decimal(0),
        seventhAmount: new Decimal(0),
        eightAmount: new Decimal(0),
        fifthBought: 0,
        sixthBought: 0,
        seventhBought: 0,
        eightBought: 0,
        firstPow: new Decimal(1),
        secondPow: new Decimal(1),
        thirdPow: new Decimal(1),
        fourthPow: new Decimal(1),
        fifthPow: new Decimal(1),
        sixthPow: new Decimal(1),
        seventhPow: new Decimal(1),
        eightPow: new Decimal(1),
        sacrificed: new Decimal(0),
        achievements: player.achievements,
        challenges: (player.eternities >= 2 && isAchEnabled("r133")) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12", "postc1", "postc2", "postc3", "postc4", "postc5", "postc6", "postc7", "postc8"] : (player.eternities >= 2) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : [],
        currentChallenge: "",
        infinityUpgrades: player.infinityUpgrades,
        infinityPoints: new Decimal(0),
        infinitied: 0,
        infinitiedBank: player.infinitiedBank,
        totalTimePlayed: player.totalTimePlayed,
        realTimePlayed: player.realTimePlayed,
        bestInfinityTime: 9999999999,
        thisInfinityTime: 0,
        resets: (player.eternities >= 4) ? 4 : 0,
        galaxies: (player.eternities >= 4) ? 1 : 0,
        tickDecrease: 0.9,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
        autobuyers: player.autobuyers,
        partInfinityPoint: 0,
        partInfinitied: 0,
        break: player.break,
        costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
        tickspeedMultiplier: new Decimal(10),
        chall2Pow: 1,
        chall3Pow: new Decimal(0.01),
        newsArray: player.newsArray,
        matter: new Decimal(0),
        chall11Pow: new Decimal(1),
        challengeTimes: player.challengeTimes,
        infchallengeTimes: player.infchallengeTimes,
        lastTenRuns: [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]],
        lastTenEternities: player.lastTenEternities,
        lastTenRealities: player.lastTenRealities,
        infMult: new Decimal(1),
        infMultCost: new Decimal(10),
        tickSpeedMultDecrease: player.eternities >= 20 ? player.tickSpeedMultDecrease : 10,
        tickSpeedMultDecreaseCost: player.eternities >= 20 ? player.tickSpeedMultDecreaseCost : 3e6,
        dimensionMultDecrease: player.eternities >= 20 ? player.dimensionMultDecrease : 10,
        dimensionMultDecreaseCost: player.eternities >= 20 ? player.dimensionMultDecreaseCost : 1e8,
        version: player.version,
        postChallUnlocked: (isAchEnabled("r133")) ? 8 : 0,
        postC4Tier: 1,
        postC3Reward: new Decimal(1),
        overXGalaxies: player.overXGalaxies,
        spreadingCancer: player.spreadingCancer,
        infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
        infinityPower: new Decimal(1),
        infinityDimension1: {
            cost: new Decimal(1e8),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension2: {
            cost: new Decimal(1e9),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension3: {
            cost: new Decimal(1e10),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension4: {
            cost: new Decimal(1e20),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension5: {
            cost: new Decimal(1e140),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension6: {
            cost: new Decimal(1e200),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension7: {
            cost: new Decimal(1e250),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infinityDimension8: {
            cost: new Decimal(1e280),
            amount: new Decimal(0),
            bought: 0,
            power: new Decimal(1),
            baseAmount: 0
        },
        infDimBuyers: player.infDimBuyers,
        timeShards: new Decimal(0),
        tickThreshold: new Decimal(1),
        timeDimension1: player.timeDimension1,
        timeDimension2: player.timeDimension2,
        timeDimension3: player.timeDimension3,
        timeDimension4: player.timeDimension4,
        timeDimension5: player.timeDimension5,
        timeDimension6: player.timeDimension6,
        timeDimension7: player.timeDimension7,
        timeDimension8: player.timeDimension8,
        eternityPoints: player.eternityPoints,
        eternities: player.eternities,
        thisEternity: 0,
        bestEternity: player.bestEternity,
        eternityUpgrades: player.eternityUpgrades,
        epmult: player.epmult,
        epmultCost: player.epmultCost,
        totalTickGained: 0,
        offlineProd: player.eternities >= 20 ? player.offlineProd : 0,
        offlineProdCost: player.eternities >= 20 ? player.offlineProdCost : 1e7,
        challengeTarget: 0,
        autoSacrifice: player.eternities >= 7 ? player.autoSacrifice : 1,
        replicanti: {
            amount: player.eternities >= 50 ? 1 : 0,
            unl: player.eternities >= 50,
            chance: 0.01,
            chanceCost: new Decimal(1e150),
            interval: 1000,
            intervalCost: new Decimal(1e140),
            gal: 0,
            galaxies: 0,
            galCost: new Decimal(1e170),
            galaxybuyer: (player.eternities >= 3) ? player.replicanti.galaxybuyer : undefined,
            auto: player.replicanti.auto
        },
        timestudy: player.timestudy,
        eternityChalls: player.eternityChalls,
        eternityChallGoal: startgoal.times(goalIncrease.pow(ECTimesCompleted(name))).max(startgoal),
        currentEternityChall: name,
        eternityChallUnlocked: player.eternityChallUnlocked,
        etercreq: player.etercreq,
        autoIP: new Decimal(0),
        autoTime: 1e300,
        infMultBuyer: player.infMultBuyer,
        autoCrunchMode: player.autoCrunchMode,
        autoEternityMode: player.autoEternityMode,
        respec: player.respec,
        eternityBuyer: player.eternityBuyer,
        eterc8ids: 50,
        eterc8repl: 40,
        dimlife: true,
        dead: true,
        dilation: {
            studies: player.dilation.studies,
            active: false,
            tachyonParticles: player.dilation.tachyonParticles,
            dilatedTime: player.dilation.dilatedTime,
            totalTachyonParticles: player.dilation.totalTachyonParticles,
            nextThreshold: player.dilation.nextThreshold,
            freeGalaxies: player.dilation.freeGalaxies,
            upgrades: player.dilation.upgrades,
            rebuyables: player.dilation.rebuyables
        },
        secretUnlocks: player.secretUnlocks,
        realities: player.realities,
        thisReality: player.thisReality,
        bestReality: player.bestReality,
        reality: player.reality,
        wormhole: player.wormhole,
        options: player.options
    };

    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1);
    player.replicanti.galaxies = 0;
    if (isAchEnabled("r36")) player.tickspeed = player.tickspeed.times(0.98);
    if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);
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
    document.getElementById("matter").style.display = "none";
    document.getElementById("quickReset").style.display = "none";
    var autobuyers = document.getElementsByClassName('autoBuyerDiv');
    if (player.eternities < 2) {
        for (var i = 0; i < autobuyers.length; i++) autobuyers.item(i).style.display = "none"
        document.getElementById("buyerBtnDimBoost").style.display = "inline-block";
        document.getElementById("buyerBtnGalaxies").style.display = "inline-block";
        document.getElementById("buyerBtnInf").style.display = "inline-block";
        document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
    }
    updateAutobuyers();
    if (isAchEnabled("r21")) player.money = new Decimal(100).max(player.money);
    if (isAchEnabled("r37")) player.money = new Decimal(1000);
    if (isAchEnabled("r54")) player.money = new Decimal(2e5);
    if (isAchEnabled("r55")) player.money = new Decimal(1e10);
    if (isAchEnabled("r78")) player.money = new Decimal(1e25);
    if (isAchEnabled("r104")) player.infinityPoints = new Decimal(2e25);
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
    document.getElementById("totaltickgained").textContent = "You've gained " + Math.max(player.totalTickGained, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " tickspeed upgrades.";
    updateTickSpeed();
    playerInfinityUpgradesOnEternity();
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">" + shortenDimensions(player.eternityPoints) + "</span> Eternity point" + ((player.eternityPoints.eq(1)) ? "." : "s.");
    updateChallenges();
    updateEternityChallenges();
    Marathon2 = 0;

    return true
}
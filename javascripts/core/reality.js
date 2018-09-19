function reality(force) {
    if (!((player.eternityPoints.gte("1e4000") && player.dilation.studies.includes(6) && (realizationCheck === 1 || !player.options.confirmations.reality || confirm("Reality will reset everything except challenge records, and will lock your achievements, which you will regain over the course of 2 days. You will also gain reality machines based on your EP, a glyph with a power level based on your EP, Replicanti, and Dilated Time, and unlock various upgrades."))) || force)) {
        return;
    }
    if (!glyphSelected && player.reality.perks.includes(0)) {
        possibleGlyphs.push(generateRandomGlyph(gainedGlyphLevel()));
        setTimeout(function() {
            possibleGlyphs.push(generateRandomGlyph(gainedGlyphLevel()))
        }, 50);
        setTimeout(function() {
            if (player.reality.perks.includes(22)) {
                setTimeout(function() {
                    possibleGlyphs.push(generateRandomGlyph(gainedGlyphLevel()));
                    generateGlyphSelection(4)
                }, 50)
            } else {
                generateGlyphSelection(3)
            }
        }, 100);
        return
    }
    if ((player.options.animations.reality) && realizationCheck === 0) {
        realizationCheck = 1;
        document.getElementById("container").style.animation = "realize 10s 1";
        document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
        document.getElementById("realityanimbg").style.display = "block";
        setTimeout(function() {
            document.getElementById("realityanimbg").play();
            document.getElementById("realityanimbg").currentTime = 0;
            document.getElementById("realityanimbg").play();
        }, 2000);
        setTimeout(function() {
            document.getElementById("container").style.animation = "";
            document.getElementById("realityanimbg").style.animation = "";
            document.getElementById("realityanimbg").style.display = "none";
        }, 10000);
        if (force === true) setTimeout(reality(true), 3000);
        else setTimeout(reality, 3000);
        return
    }
    realizationCheck = 0;
    if (!player.reality.perks.includes(0)) player.reality.glyphs.inventory.push(generateRandomGlyph(gainedGlyphLevel()));
    if (player.thisReality < player.bestReality && !force) {
        player.bestEternity = player.thisEternity
    }
    giveAchievement("Snap back to reality");
    player.reality.realityMachines = player.reality.realityMachines.plus(gainedRealityMachines());
    addRealityTime(player.thisReality, gainedRealityMachines(), gainedGlyphLevel());
    if (player.reality.glyphs.active.length === 1 && player.reality.glyphs.active[0].level >= 3) player.reality.upgReqs[9] = trueif(!player.reality.upgReqs[16] && player.reality.glyphs.active.length === 4);
    {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            if (player.reality.glyphs.active[i].rarity < 1.5) tempBool = false
        }
        player.reality.upgReqs[16] = tempBool
    }
    if (!player.reality.upgReqs[17] && player.reality.glyphs.active.length === 4) {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            let count = 0;
            for (let y in player.reality.glyphs.active[i].effects) {
                count++
            }
            if (count < 2 && i < 4) tempBool = false // Idk what caused this, but something made this loop 5 times, so I added the additional check
        }
        console.log(tempBool);
        player.reality.upgReqs[17] = tempBool
    }
    if (!player.reality.upgReqs[18] && player.reality.glyphs.active.length === 4) {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            if (player.reality.glyphs.active[i].level < 10) tempBool = false
        }
        player.reality.upgReqs[18] = tempBool
    }
    if (player.reality.glyphs.active.length + player.reality.glyphs.inventory.length >= 30) player.reality.upgReqs[19] = trueif(player.reality.respec);
    respecGlyphs();
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
        challenges: player.reality.upg.includes(10) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : [],
        currentChallenge: "",
        infinityUpgrades: player.reality.upg.includes(10) ? player.infinityUpgrades : [],
        infinityPoints: new Decimal(0),
        infinitied: 0,
        infinitiedBank: 0,
        totalTimePlayed: player.totalTimePlayed,
        realTimePlayed: player.realTimePlayed,
        bestInfinityTime: 999999999999,
        thisInfinityTime: 0,
        resets: player.reality.upg.includes(10) ? 4 : 0,
        galaxies: player.reality.upg.includes(10) ? 1 : 0,
        tickDecrease: 0.9,
        totalmoney: player.totalmoney,
        interval: null,
        lastUpdate: player.lastUpdate,
        achPow: player.achPow,
        autobuyers: player.reality.upg.includes(10) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        partInfinityPoint: 0,
        partInfinitied: 0,
        break: player.reality.upg.includes(10) ? player.break : false,
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
        lastTenEternities: [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]],
        lastTenRealities: player.lastTenRealities,
        infMult: new Decimal(1),
        infMultCost: new Decimal(10),
        tickSpeedMultDecrease: player.reality.upg.includes(10) ? Math.max(player.tickSpeedMultDecrease, 2) : 10,
        tickSpeedMultDecreaseCost: player.reality.upg.includes(10) ? player.tickSpeedMultDecreaseCost : 3e6,
        dimensionMultDecrease: player.reality.upg.includes(10) ? Math.max(player.dimensionMultDecrease, 3) : 10,
        dimensionMultDecreaseCost: player.reality.upg.includes(10) ? player.dimensionMultDecreaseCost : 1e8,
        version: player.version,
        postChallUnlocked: 0,
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
        infDimBuyers: player.reality.upg.includes(10) ? player.infDimBuyers : [false, false, false, false, false, false, false, false],
        timeShards: new Decimal(0),
        tickThreshold: new Decimal(1),
        totalTickGained: 0,
        timeDimension1: {
            cost: new Decimal(1),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension2: {
            cost: new Decimal(5),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension3: {
            cost: new Decimal(100),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension4: {
            cost: new Decimal(1000),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension5: {
            cost: new Decimal("1e2350"),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension6: {
            cost: new Decimal("1e2650"),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension7: {
            cost: new Decimal("1e3000"),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        timeDimension8: {
            cost: new Decimal("1e3350"),
            amount: new Decimal(0),
            power: new Decimal(1),
            bought: 0
        },
        eternityPoints: new Decimal(0),
        eternities: 0,
        thisEternity: 0,
        bestEternity: 999999999999,
        eternityUpgrades: [],
        epmult: new Decimal(1),
        epmultCost: new Decimal(500),
        totalTickGained: 0,
        offlineProd: player.reality.upg.includes(10) ? player.offlineProd : 0,
        offlineProdCost: player.reality.upg.includes(10) ? player.offlineProdCost : 1e7,
        challengeTarget: 0,
        autoSacrifice: player.reality.upg.includes(10) ? player.autoSacrifice : 1,
        replicanti: {
            amount: player.reality.upg.includes(10) ? new Decimal(1) : new Decimal(0),
            unl: player.reality.upg.includes(10) ? true : false,
            chance: 0.01,
            chanceCost: new Decimal(1e150),
            interval: 1000,
            intervalCost: new Decimal(1e140),
            gal: 0,
            galaxies: 0,
            galCost: new Decimal(1e170),
            galaxybuyer: player.reality.upg.includes(10) ? player.replicanti.galaxybuyer : undefined,
            auto: [player.reality.upg.includes(10) ? player.replicanti.auto[0] : false, player.reality.upg.includes(10) ? player.replicanti.auto[1] : false, player.reality.upg.includes(10) ? player.replicanti.auto[2] : false]
        },
        timestudy: {
            theorem: 0,
            amcost: new Decimal("1e20000"),
            ipcost: new Decimal(1),
            epcost: new Decimal(1),
            studies: []
        },
        eternityChalls: {},
        eternityChallGoal: new Decimal(Number.MAX_VALUE),
        currentEternityChall: "",
        eternityChallUnlocked: 0,
        etercreq: 0,
        autoIP: new Decimal(0),
        autoTime: 1e300,
        infMultBuyer: player.reality.upg.includes(10) ? player.infMultBuyer : false,
        autoCrunchMode: "amount",
        autoEternityMode: player.autoEternityMode,
        respec: false,
        eternityBuyer: {
            limit: new Decimal(0),
            isOn: false
        },
        eterc8ids: 50,
        eterc8repl: 40,
        dimlife: true,
        dead: true,
        dilation: {
            studies: [],
            active: false,
            tachyonParticles: new Decimal(0),
            dilatedTime: new Decimal(0),
            totalTachyonParticles: new Decimal(0),
            nextThreshold: new Decimal(1000),
            freeGalaxies: 0,
            upgrades: [],
            rebuyables: {
                1: 0,
                2: 0,
                3: 0
            }
        },
        secretUnlocks: player.secretUnlocks,
        realities: player.realities + 1,
        thisReality: 0,
        bestReality: Math.min(player.thisReality, player.bestReality),
        reality: player.reality,
        wormhole: player.wormhole,
        options: player.options
    };
    if (player.reality.upg.includes(10)) player.eternities = 100;
    player.reality.pp++;
    $("#pp").text("You have " + player.reality.pp + " Perk Points.");
    if (player.eternities <= 30) {
        document.getElementById("secondRow").style.display = "none";
        document.getElementById("thirdRow").style.display = "none";
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
        document.getElementById("fourthRow").style.display = "none";
        document.getElementById("fifthRow").style.display = "none";
        document.getElementById("sixthRow").style.display = "none";
        document.getElementById("seventhRow").style.display = "none";
        document.getElementById("eightRow").style.display = "none";
    }
    document.getElementById("matter").style.display = "none";
    document.getElementById("quickReset").style.display = "none";
    if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
    var autobuyers = document.getElementsByClassName('autoBuyerDiv');
    if (player.eternities < 2) {
        for (var i = 0; i < autobuyers.length; i++) autobuyers.item(i).style.display = "none"
        document.getElementById("buyerBtnDimBoost").style.display = "inline-block";
        document.getElementById("buyerBtnGalaxies").style.display = "inline-block";
        document.getElementById("buyerBtnInf").style.display = "inline-block";
        document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
    }
    if (player.realities === 4) player.reality.automatorCommands = [12, 23, 24];
    player.reality.upgReqChecks = [true];
    updateAutobuyers();
    resetInfDimensions();
    loadInfAutoBuyers();
    updateChallenges();
    updateChallengeTimes();
    updateLastTenRuns();
    updateLastTenEternities();
    updateLastTenRealities();
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    updateMilestones();
    resetTimeDimensions();
    if (player.eternities < 20) player.autobuyers[9].bulk = 1;
    if (player.eternities < 20) document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk;
    if(player.eternities < 50) {
        document.getElementById("replicantidiv").style.display = "none";
        document.getElementById("replicantiunlock").style.display = "inline-block"
    }
    else if (document.getElementById("replicantidiv").style.display === "none" && player.eternities >= 50) {
        document.getElementById("replicantidiv").style.display = "inline-block";
        document.getElementById("replicantiunlock").style.display = "none"
    }
    kong.submitStats('Eternities', player.eternities);
    if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = falsedocument.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points.";
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
    updateEternityChallenges();
    if (player.eternities <= 1) {
        showTab("dimensions");
        showDimTab("antimatterdimensions");
        loadAutoBuyerSettings()
    }
    Marathon2 = 0;
    toggleCrunchMode();
    toggleCrunchMode();
    toggleCrunchMode();
    toggleEternityMode();
    toggleEternityMode();
    toggleEternityMode();
    updateTimeStudyButtons();
    if (!player.reality.upg.includes(10)) {
        document.getElementById("infmultbuyer").textContent = "Autobuy IP mult OFF";
        document.getElementById("replauto1").textContent = "Auto: OFF";
        document.getElementById("replauto2").textContent = "Auto: OFF";
        document.getElementById("replauto3").textContent = "Auto: OFF"
    }
    generateGlyphTable();
    updateWormholeUpgrades();
    updateAutomatorRows();
    updateAutomatorTree();
    drawPerkNetwork();
    document.getElementById("pp").textContent = "You have " + player.reality.pp + " Perk Points."
}
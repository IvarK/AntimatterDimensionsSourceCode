function reality(force, reset, auto) {
    if (!((player.eternityPoints.gte("1e4000") && player.dilation.studies.includes(6) && (glyphSelected || realizationCheck === 1 || !player.options.confirmations.reality || confirm("Reality will reset everything except challenge records, and will lock your achievements, which you will regain over the course of 2 days. You will also gain reality machines based on your EP, a glyph with a power level based on your EP, Replicanti, and Dilated Time, and unlock various upgrades."))) || force)) {
        return;
    }
    if (!glyphSelected && player.reality.perks.includes(0) && !auto) {
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
    if ((player.options.animations.reality) && realizationCheck === 0 && !auto) {
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
    if ((!player.reality.perks.includes(0) || auto) && !reset) player.reality.glyphs.inventory.push(generateRandomGlyph(gainedGlyphLevel()));
    if (player.thisReality < player.bestReality && !force) {
        player.bestEternity = player.thisEternity
    }
    giveAchievement("Snap back to reality");
    if (!reset) player.reality.realityMachines = player.reality.realityMachines.plus(gainedRealityMachines());
    if (!reset) addRealityTime(player.thisReality, gainedRealityMachines(), gainedGlyphLevel());
    if (player.reality.glyphs.active.length === 1 && player.reality.glyphs.active[0].level >= 3 && !reset ) unlockRealityUpgrade(9);
    if(!player.reality.upgReqs[16] && player.reality.glyphs.active.length === 4) {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            if (player.reality.glyphs.active[i].rarity < 1.5) tempBool = false
        }
        if (tempBool) unlockRealityUpgrade(16)
    }
    if (!player.reality.upgReqs[17] && player.reality.glyphs.active.length === 4 && !reset ) {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            let count = 0;
            for (let y in player.reality.glyphs.active[i].effects) {
                count++
            }
            if (count < 2 && i < 4) tempBool = false // Idk what caused this, but something made this loop 5 times, so I added the additional check
        }
        if (tempBool) unlockRealityUpgrade(17)
    }
    if (!player.reality.upgReqs[18] && player.reality.glyphs.active.length === 4 && !reset) {
        var tempBool = true;
        for (let i in player.reality.glyphs.active) {
            if (player.reality.glyphs.active[i].level < 10) tempBool = false
        }
        if (tempBool) unlockRealityUpgrade(18)
    }
    if (player.reality.glyphs.active.length + player.reality.glyphs.inventory.length >= 30) unlockRealityUpgrade(19)
    if (player.thisReality < 15 * 60 * 1000 && !reset) unlockRealityUpgrade(23)
    if (player.reality.glyphs.active.length == 0 && gainedRealityMachines().gte(5000)) unlockRealityUpgrade(24)
    if (player.reality.respec) {
        respecGlyphs();
    }

    //reset global values to avoid a tick of unupdated production
    totalMult = 1;
    currentMult = 1;
    infinitiedMult = 1;
    achievementMult = 1;
    challengeMult = 1;
    unspentBonus = 1;
    infDimPow = 1;
    postc8Mult = new Decimal(0);
    mult18 = new Decimal(1);
    ec10bonus = new Decimal(1);

    player.sacrificed = new Decimal(0);
    player.challenges = player.reality.upg.includes(10) ? ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12"] : [];
    player.currentChallenge = "";
    player.infinityUpgrades = player.reality.upg.includes(10) ? player.infinityUpgrades : [];
    player.infinityPoints = new Decimal(0);
    player.infinitied = 0;
    player.infinitiedBank = 0;
    player.bestInfinityTime = 999999999999;
    player.thisInfinityTime = 0;
    player.resets = player.reality.upg.includes(10) ? 4 : 0;
    player.galaxies = player.reality.upg.includes(10) ? 1 : 0;
    player.tickDecrease = 0.9;
    player.interval = null;
    player.autobuyers = player.reality.upg.includes(10) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.break = player.reality.upg.includes(10) ? player.break : false;
    player.lastTenRuns = [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]];
    player.lastTenEternities = [[600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)], [600 * 60 * 24 * 31, new Decimal(1)]];
    player.infMult = new Decimal(1);
    player.infMultCost = new Decimal(10);
    player.tickSpeedMultDecrease = player.reality.upg.includes(10) ? Math.max(player.tickSpeedMultDecrease, 2) : 10;
    player.tickSpeedMultDecreaseCost = player.reality.upg.includes(10) ? player.tickSpeedMultDecreaseCost : 3e6;
    player.dimensionMultDecrease = player.reality.upg.includes(10) ? Math.max(player.dimensionMultDecrease, 3) : 10;
    player.dimensionMultDecreaseCost = player.reality.upg.includes(10) ? player.dimensionMultDecreaseCost : 1e8;
    player.postChallUnlocked = 0;
    player.infDimensionsUnlocked = [false, false, false, false, false, false, false, false];
    player.infinityPower = new Decimal(1);
    player.infDimBuyers = player.reality.upg.includes(10) ? player.infDimBuyers : [false, false, false, false, false, false, false, false];
    player.timeShards = new Decimal(0);
    player.tickThreshold = new Decimal(1);
    player.eternityPoints = new Decimal(0);
    player.eternities = 0;
    player.thisEternity = 0;
    player.bestEternity = 999999999999;
    player.eternityUpgrades = [];
    player.epmult = new Decimal(1);
    player.epmultCost = new Decimal(500);
    player.totalTickGained = 0;
    player.offlineProd = player.reality.upg.includes(10) ? player.offlineProd : 0;
    player.offlineProdCost = player.reality.upg.includes(10) ? player.offlineProdCost : 1e7;
    player.challengeTarget = 0;
    player.autoSacrifice = player.reality.upg.includes(10) ? player.autoSacrifice : 1;
    player.eternityChalls = {};
    player.eternityChallGoal = new Decimal(Number.MAX_VALUE);
    player.currentEternityChall = "";
    player.eternityChallUnlocked = 0;
    player.etercreq = 0;
    player.autoIP = new Decimal(0);
    player.autoTime = 1e300;
    player.infMultBuyer = player.reality.upg.includes(10) ? player.infMultBuyer : false;
    player.autoCrunchMode = player.reality.upg.includes(10) ? player.autoCrunchMode : "amount";
    player.respec = false;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.dimlife = true;
    player.dead = true;
    if (!reset) player.realities = player.realities + 1;
    if (!reset) player.bestReality = Math.min(player.thisReality, player.bestReality);
    player.thisReality = 0;
    player.timestudy.theorem = 0;
    player.timestudy.amcost = new Decimal("1e20000");
    player.timestudy.ipcost = new Decimal(1);
    player.timestudy.epcost = new Decimal(1);
    player.timestudy.studies = [];
    player.eternityBuyer.isOn = false;
    player.dilation.studies = [];
    player.dilation.active = false;
    player.dilation.tachyonParticles = new Decimal(0);
    player.dilation.dilatedTime = new Decimal(0);
    player.dilation.totalTachyonParticles = new Decimal(0);
    player.dilation.nextThreshold = new Decimal(1000);
    player.dilation.baseFreeGalaxies = 0;
    player.dilation.upgrades = [];
    player.dilation.rebuyables = {
        1: 0,
        2: 0,
        3: 0
    };

    fullResetInfDimensions();
    fullResetTimeDimensions();
    resetReplicanti();
    resetChallengeStuff();
    resetDimensions();
    if (player.reality.upg.includes(10)) player.eternities = 100;
    if (!reset) player.reality.pp++;
    $("#pp").text("You have " + player.reality.pp + " Perk Points.")
    hidePreMilestone30Elements();
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
    if (player.realities === 4) player.reality.automatorCommands = [12, 24, 25];
    player.reality.upgReqChecks = [true];
    updateAutobuyers();
    resetInfDimensions();
    loadInfAutoBuyers();
    loadTimeAutoBuyers()
    updateChallenges();
    updateChallengeTimes();
    updateLastTenRuns();
    updateLastTenEternities();
    updateLastTenRealities();
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);
    updateMilestones();
    resetTimeDimensions();
    showEternityTab('timestudies', true)
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
    resetTickspeed();
    updateTickSpeed();
    resetMoney();
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
    document.getElementById("eterc12div").innerHTML = document.getElementById("eterc12div").innerHTML.replace("1000x slower.", "1000x slower, wormholes and time glyph effects are disabled.")

    if (player.realities >= 4) giveAchievement("How does this work?")

    if (player.reality.perks.includes(53)) player.infinityPoints = new Decimal(1e15);
    if (player.reality.perks.includes(54)) player.infinityPoints = new Decimal(1e130);
    
    if (player.reality.perks.includes(55)) player.eternityPoints = new Decimal(10);
    if (player.reality.perks.includes(56)) player.eternityPoints = new Decimal(2000);
    if (player.reality.perks.includes(57)) player.eternityPoints = new Decimal(1e9);

    function resetReplicanti() {
        player.replicanti.amount = player.reality.upg.includes(10) ? new Decimal(1) : new Decimal(0);
        player.replicanti.unl = player.reality.upg.includes(10);
        player.replicanti.chance = 0.01;
        player.replicanti.chanceCost = new Decimal(1e150);
        player.replicanti.interval = 1000;
        player.replicanti.intervalCost = new Decimal(1e140);
        player.replicanti.gal = 0;
        player.replicanti.galaxies = 0;
        player.replicanti.galCost = new Decimal(1e170);
        player.replicanti.galaxybuyer = player.reality.upg.includes(10) ? player.replicanti.galaxybuyer : undefined;
        player.replicanti.auto = [player.reality.upg.includes(10) ? player.replicanti.auto[0] : false, player.reality.upg.includes(10) ? player.replicanti.auto[1] : false, player.reality.upg.includes(10) ? player.replicanti.auto[2] : false];
    }
    possibleGlyphs = []
    glyphSelected = false
    
    if (player.reality.upg.includes(13)) {
        if (player.reality.epmultbuyer) buyMaxEPMult();
        for (var i = 1; i < 9; i++) {
            if (player.reality.tdbuyers[i - 1]) {
                buyMaxTimeDims(i);
            }
        }
    }
}

function fullResetTimeDimensions() {
    const cost = [1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"];
    for (let i = 0; i < 8; i++) {
        let dimension = player["timeDimension" + (i + 1)];
        dimension.cost = new Decimal(cost[i]);
        dimension.amount = new Decimal(0);
        dimension.bought = 0;
        dimension.power = new Decimal(1);
    }
}

function unlockRealityUpgrade(id) {
  if (player.reality.upgReqs[id]) return
  player.reality.upgReqs[id] = true
  $.notify("You've unlocked a Reality upgrade!", "success");
}

function startRealityOver() {
    if(confirm("This will put you at the start of your reality and reset your progress in this reality. Are you sure you want to do this?")) {
        glyphSelected = true
        realizationCheck = 1
        reality(true, true)
    }
}
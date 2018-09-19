function bigCrunchReset() {
    var challNumber = parseInt(player.currentChallenge[player.currentChallenge.length-1])
    if (player.currentChallenge.length == 11) challNumber = parseInt("1"+player.currentChallenge[player.currentChallenge.length-1])
    if ((player.money.gte(Number.MAX_VALUE) && !player.currentChallenge.includes("post")) || (player.currentChallenge !== "" && player.money.gte(player.challengeTarget))) {
        if ((player.bestInfinityTime > 60000 && !player.break) && implosionCheck === 0 && player.options.animations.bigCrunch) {
            implosionCheck = 1;
            document.getElementById("body").style.animation = "implode 2s 1";
            setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 2000)
            setTimeout(function(){ document.getElementById("bigcrunch").onclick(); }, 1000)
            return
        }
        implosionCheck = 0;
        if (player.thisInfinityTime <= 7200000) giveAchievement("That's fast!");
        if (player.thisInfinityTime <= 600000) giveAchievement("That's faster!")
        if (player.thisInfinityTime <= 60000) giveAchievement("Forever isn't that long")
        if (player.thisInfinityTime <= 200) giveAchievement("Blink of an eye")
        if (player.eightAmount == 0) giveAchievement("You didn't need it anyway");
        if (player.galaxies == 1) giveAchievement("Claustrophobic");
        if (player.galaxies == 0 && player.resets == 0) giveAchievement("Zero Deaths")
        if (player.currentChallenge == "challenge2" && player.thisInfinityTime <= 180000) giveAchievement("Many Deaths")
        if (player.currentChallenge == "challenge11" && player.thisInfinityTime <= 180000) giveAchievement("Gift from the Gods")
        if (player.currentChallenge == "challenge5" && player.thisInfinityTime <= 180000) giveAchievement("Is this hell?")
        if (player.currentChallenge == "challenge3" && player.thisInfinityTime <= 10000) giveAchievement("You did this again just for the achievement right?");
        if (player.firstAmount == 1 && player.resets == 0 && player.galaxies == 0 && player.currentChallenge == "challenge12") giveAchievement("ERROR 909: Dimension not found")
        if (player.currentChallenge != "" && player.challengeTimes[challNumber-2] > player.thisInfinityTime) player.challengeTimes[challNumber-2] = player.thisInfinityTime
        if (player.currentChallenge.includes("post") && player.infchallengeTimes[challNumber-1] > player.thisInfinityTime) player.infchallengeTimes[challNumber-1] = player.thisInfinityTime
        if (player.currentChallenge == "postc5" && player.thisInfinityTime <= 10000) giveAchievement("Hevipelle did nothing wrong")
        if ((player.bestInfinityTime > 60000 && !player.break) || (player.currentChallenge != "" && !player.options.retryChallenge)) showTab("dimensions")
        if (player.currentChallenge == "challenge5") {
            kong.submitStats('Challenge 9 time record (ms)', Math.floor(player.thisInfinityTime*100));
        }
        if (player.currentChallenge != "" && !player.challenges.includes(player.currentChallenge)) {
            player.challenges.push(player.currentChallenge);
        }
        if (player.challenges.length > 12) giveAchievement("Infinitely Challenging");
        if (player.challenges.length == 20) giveAchievement("Anti-antichallenged");
        if (!player.break || player.currentChallenge != "") {
            player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints());
            addTime(player.thisInfinityTime, gainedInfinityPoints())
        }
        else {
            player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints())
            addTime(player.thisInfinityTime, gainedInfinityPoints())
            if (gainedInfinityPoints().gte(1e150)) giveAchievement("All your IP are belong to us")
            if (gainedInfinityPoints().gte(1e200) && player.thisInfinityTime <= 2000) giveAchievement("Ludicrous Speed")
            if (gainedInfinityPoints().gte(1e250) && player.thisInfinityTime <= 20000) giveAchievement("I brake for nobody")
        }
        if (!isAchEnabled("r111") && player.lastTenRuns[9][1] != 1) {
            var n = 0;
            for (i=0; i<9; i++) {
                if (player.lastTenRuns[i][1].gte(player.lastTenRuns[i+1][1].times(Number.MAX_VALUE))) n++;
            }
            if (n == 9) giveAchievement("Yo dawg, I heard you liked infinities...")
        }
        if (player.realities > 0 && getInfinitied() === 0 && player.eternities === 0 && player.galaxies <= 1) {
            player.reality.upgReqs[7] = true;
        }
        if (player.currentEternityChall == "eterc4" && player.infinitied >= 16 - (ECTimesCompleted("eterc4") * 4)) {
            failChallenge();
        }

        if (player.realities > 0 && (player.eternities == 0 || (player.reality.upg.includes(10) && player.eternities == 100)) && player.infinitied == 0) {
            if ( checkForRUPG8() ) player.reality.upgReqs[8] = true;
        }

        if (autoS && auto) {
            if (gainedInfinityPoints().dividedBy(player.thisInfinityTime/100).gt(player.autoIP) && !player.break) player.autoIP = gainedInfinityPoints().dividedBy(player.thisInfinityTime/100);
            if (player.thisInfinityTime<player.autoTime) player.autoTime = player.thisInfinityTime;
        }



        auto = autoS; //only allow autoing if prev crunch was autoed
        autoS = true;
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
        player.infinitied = player.infinitied + Math.round(gainedInfinities());
        player.bestInfinityTime = Math.min(player.bestInfinityTime, player.thisInfinityTime);
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

        if (player.bestInfinityTime <= 1) giveAchievement("Less than or equal to 0.001");

        if (!player.options.retryChallenge) player.currentChallenge = ""

        if (player.resets == 0 && player.currentChallenge == "") {
            if (player.infinityUpgrades.includes("skipReset1")) player.resets++;
            if (player.infinityUpgrades.includes("skipReset2")) player.resets++;
            if (player.infinityUpgrades.includes("skipReset3")) player.resets++;
            if (player.infinityUpgrades.includes("skipResetGalaxy")) {
                player.resets++;
                if (player.galaxies == 0) player.galaxies = 1
            }
        }

        if (player.replicanti.unl && !isAchEnabled("r95")) player.replicanti.amount = new Decimal(1)

        player.replicanti.galaxies = (player.timestudy.studies.includes(33)) ? Math.floor(player.replicanti.galaxies/2) :0

        setInitialDimensionPower();


        if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "block";
        else document.getElementById("matter").style.display = "none";

        document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."

        if (isAchEnabled("r36")) player.tickspeed = player.tickspeed.times(0.98);
        if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);
        if (isAchEnabled("r66")) player.tickspeed = player.tickspeed.times(0.98);
        if (isAchEnabled("r83")) player.tickspeed = player.tickspeed.times(Decimal.pow(0.95,player.galaxies));
        if (player.eternities < 30) {
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

        checkForEndMe()

        kong.submitStats('Infinitied', getInfinitied());
        kong.submitStats('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime * 100));
        giveAchievement("To infinity!");
        if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");
        if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");


        updateAutobuyers();
        if (isAchEnabled("r21")) player.money = new Decimal(100).max(player.money);
        if (isAchEnabled("r37")) player.money = new Decimal(1000);
        if (isAchEnabled("r54")) player.money = new Decimal(2e5);
        if (isAchEnabled("r55")) player.money = new Decimal(1e10);
        if (isAchEnabled("r78")) player.money = new Decimal(1e25);
        if (player.challenges.length >= 2) giveAchievement("Daredevil");
        if (player.challenges.length == 12) giveAchievement("AntiChallenged");
        resetInfDimensions();
        player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
        updateTickSpeed();
        if (player.challenges.length == 20) giveAchievement("Anti-antichallenged");
        IPminpeak = new Decimal(0)


        if (player.eternities > 10 && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc10") {
            for (var i=1;i<player.eternities-9 && i < 9; i++) {
                if (player.infDimBuyers[i-1]) {
                    buyMaxInfDims(i)
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

        Marathon2 = 0;


    }
    updateChallenges();
    updateChallengeTimes()
    updateLastTenRuns()


}

document.getElementById("bigcrunch").onclick = bigCrunchReset;
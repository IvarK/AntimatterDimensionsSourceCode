//test
var gameLoopIntervalId;
var Marathon = 0;
var Marathon2 = 0;
var auto = false;
var autoS = true;
var shiftDown = false;
var controlDown = false;
var justImported = false;
var saved = 0;
var keySequence = 0;
var failureCount = 0;
var implosionCheck = 0;
var realizationCheck = 0;
var statsTimer = 0;
var TIER_NAMES = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
var DISPLAY_NAMES = [ null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth" ];
var forceHardReset = false;
var player = {
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
    achievements: [],
    infinityUpgrades: [],
    challenges: [],
    currentChallenge: "",
    infinityPoints: new Decimal(0),
    infinitied: 0,
    infinitiedBank: 0,
    totalTimePlayed: 0,
    realTimePlayed: 0,
    bestInfinityTime: 999999999999,
    thisInfinityTime: 0,
    resets: 0,
    galaxies: 0,
    tickDecrease: 0.9,
    totalmoney: new Decimal(0),
    achPow: 1,
    newsArray: [],
    interval: null,
    lastUpdate: new Date().getTime(),
    autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
    tickspeedMultiplier: new Decimal(10),
    chall2Pow: 1,
    chall3Pow: new Decimal(0.01),
    matter: new Decimal(0),
    chall11Pow: new Decimal(1),
    partInfinityPoint: 0,
    partInfinitied: 0,
    break: false,
    challengeTimes: [60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31],
    infchallengeTimes: [60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31, 60000*60*24*31],
    lastTenRuns: [[60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1]],
    lastTenEternities: [[60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1], [60000*60*24*31, 1]],
    lastTenRealities: [[60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0], [60000*60*24*31, 1, 0]],
    infMult: new Decimal(1),
    infMultCost: new Decimal(10),
    tickSpeedMultDecrease: 10,
    tickSpeedMultDecreaseCost: 3e6,
    dimensionMultDecrease: 10,
    dimensionMultDecreaseCost: 1e8,
    overXGalaxies: 10,
    version: 10,
    infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
    infinityPower: new Decimal(1),
    spreadingCancer: 0,
    postChallUnlocked: 0,
    postC4Tier: 0,
    postC3Reward: new Decimal(1),
    eternityPoints: new Decimal(0),
    eternities: 0,
    thisEternity: 0,
    bestEternity: 999999999999,
    eternityUpgrades: [],
    epmult: new Decimal(1),
    epmultCost: new Decimal(500),
    infinityDimension1 : {
        cost: new Decimal(1e8),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension2 : {
        cost: new Decimal(1e9),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension3 : {
        cost: new Decimal(1e10),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension4 : {
        cost: new Decimal(1e20),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension5 : {
        cost: new Decimal(1e140),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension6 : {
        cost: new Decimal(1e200),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension7 : {
        cost: new Decimal(1e250),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infinityDimension8 : {
        cost: new Decimal(1e280),
        amount: new Decimal(0),
        bought: 0,
        power: new Decimal(1),
        baseAmount: 0
    },
    infDimBuyers: [false, false, false, false, false, false, false, false],
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
    offlineProd: 0,
    offlineProdCost: 1e7,
    challengeTarget: 0,
    autoSacrifice: 1,
    replicanti: {
        amount: new Decimal(0),
        unl: false,
        chance: 0.01,
        chanceCost: new Decimal(1e150),
        interval: 1000,
        intervalCost: new Decimal(1e140),
        gal: 0,
        galaxies: 0,
        galCost: new Decimal(1e170),
        auto: [false, false, false]
    },
    timestudy: {
        theorem: 0,
        amcost: new Decimal("1e20000"),
        ipcost: new Decimal(1),
        epcost: new Decimal(1),
        studies: [],
    },
    eternityChalls: {},
    eternityChallGoal: new Decimal(Number.MAX_VALUE),
    currentEternityChall: "",
    eternityChallUnlocked: 0,
    etercreq: 0,
    autoIP: new Decimal(0),
    autoTime: 1e300,
    infMultBuyer: false,
    autoCrunchMode: "amount",
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
            3: 0,
        }
    },
    why: 0,
    realities: 0,
    thisReality: 0,
    bestReality: 999999999999,
    reality: {
        realityMachines: new Decimal(0),
        glyphs: {
            active: [],
            inventory: [],
            slots: 3,
            last: ""
        },
        seed: Math.floor(Date.now() * Math.random()+1),
        upg: [],
        upgReqs: [null, true, true, true, true, true, false, false, false, false, false], 
        upgReqChecks: [false],
        automatorRows: 0,
        automatorCommands: [],
        respec: false
    },
    wormhole: {
        speed: 60 * 60, // Seconds to fill
        power: 5, // Multiplier from the wormhole
        duration: 10, // How long it lasts.
        phase: 0,
        active: false,
        unlocked: false
    },
    options: {
        newsHidden: false,
        notation: "Mixed scientific",
        //Standard = normal prefixed numbers, Scientific = standard form, Engineering = powers of 3.
        scientific: false,
        sacrificeConfirmation: true,
        retryChallenge: false,
        bulkOn: true,
        cloud: true,
        hotkeys: true,
        theme: undefined,
        secretThemeKey: 0,
        commas: true,
        updateRate: 50,
        chart: {
            updateRate: 1000,
            duration: 10,
            warning: 0,
        },
        animations: {
            floatingText: true,
            bigCrunch: true,
            eternity: true,
            tachyonParticles: true,
        }
    }

};


var defaultStart = $.extend(true, {}, player);





function setTheme(name) {
    document.querySelectorAll("link").forEach( function(e) {
        if (e.href.includes("theme")) e.remove();
    });

    if(name !== undefined && name.length < 3) giveAchievement("Shhh... It's a secret")
    if(name === undefined) {
        document.getElementById("theme").textContent = "Current theme: Normal"
    } else if(name === "S1") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if(name === "S2") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if(name === "S3") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if(name === "S4") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if(name === "S5") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if(name === "S6") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'white';
        normalDimChart.data.datasets[0].borderColor = '#FFF'
    } else if(name === "S7") {
        document.getElementById("theme").textContent="Current theme: " + player.options.secretThemeKey;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else {
        document.getElementById("theme").textContent="Current theme: " + name;
    }

    if (name === undefined) return;

    var head = document.head;
    var link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "stylesheets/theme-" + name + ".css";

    head.appendChild(link);
}

document.getElementById("theme").onclick = function () {
    if (player.options.theme === undefined) {
        player.options.theme = "Metro";
    } else if (player.options.theme === "Metro") {
        player.options.theme = "Dark";
        Chart.defaults.global.defaultFontColor = '#888';
        normalDimChart.data.datasets[0].borderColor = '#888'
    } else if (player.options.theme === "Dark") {
        player.options.theme = "Dark Metro";
    } else if (player.options.theme === "Dark Metro") {
        player.options.theme = "Inverted";
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    } else if (player.options.theme === "Inverted") {
        player.options.theme = "Inverted Metro";
    } else {
        player.options.theme = undefined;
        Chart.defaults.global.defaultFontColor = 'black';
        normalDimChart.data.datasets[0].borderColor = '#000'
    }

    setTheme(player.options.theme);

}


let kongIPMult = 1
let kongDimMult = 1
let kongAllDimMult = 1
let kongEPMult = 1








function showTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('tab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    if (document.getElementById("timestudies").style.display != "none" && document.getElementById("eternitystore").style.display != "none") document.getElementById("TTbuttons").style.display = "block";
    else document.getElementById("TTbuttons").style.display = "none"
    resizeCanvas();
    closeToolTip();
    if (tabName !== "statistics") statsTimer = 0
}




function updateMoney() {
    var element = document.getElementById("coinAmount");
    element.textContent = formatValue(player.options.notation, player.money, 2, 1);
    var element2 = document.getElementById("matter");
    if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") element2.textContent = "There is " + formatValue(player.options.notation, player.matter, 2, 1) + " matter."
    if (player.currentChallenge == "postc6") element2.textContent = "There is " + formatValue(player.options.notation, Decimal.pow(player.matter,20), 2, 1) + " matter."; //TODO
}

function updateCoinPerSec() {
    var element = document.getElementById("coinsPerSec");
    if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") {
      element.textContent = 'You are getting ' + shortenDimensions(getDimensionProductionPerSecond(1).times(player.chall3Pow)) + ' antimatter per second.'
    } else if (player.currentChallenge == "challenge7") {
      element.textContent = 'You are getting ' + (shortenDimensions(getDimensionProductionPerSecond(1).plus(getDimensionProductionPerSecond(2)))) + ' antimatter per second.'
    } else {
      element.textContent = 'You are getting ' + shortenDimensions(getDimensionProductionPerSecond(1)) + ' antimatter per second.'
    }
}

function getInfinitied() {return Math.max(player.infinitied + player.infinitiedBank, 0)}

function getETA(cost) {
    var a = 100;
    if (player.money.gte(cost)) return 0
    while (ETACalc(a).lt(cost)) {
        a *= 10;
        if (a > 1e20) return Infinity;
    }
    var b = a / 10;
    var q = ETACalc((a+b)/2);
    while (q.gt(cost.times(1.0001)) || q.lt(cost.dividedBy(1.0001))) {
        console.log("q = "+q)
        console.log("a = "+a)
        console.log("b = "+b)
        if (q.lt(cost)) a = (a+b)/2;
        else b = (a+b)/2;
        q = ETACalc((a+b)/2);
    }
    return (a+b)/2;
}

function ETACalc(t) {
    var value = player.money.plus(getDimensionProductionPerSecond(1).times(t));
    var div = 1;
    for (let tier = 2; tier <= 8; ++tier) {
        var name = TIER_NAMES[tier-1]
        div *= tier;
        value = value.plus(getDimensionProductionPerSecond(tier).times(getDimensionProductionPerSecond(tier-1)).times(Decimal.pow(t,tier)).dividedBy(Decimal.max(player[name+"Amount"].times(div).times(10), 1))) ;
    }
    return value
}



var worstChallengeTime = 1

function updateWorstChallengeTime() {
    worstChallengeTime = 1
    for (var i=0; i<10; i++) {
        if (player.challengeTimes[i]/100 > worstChallengeTime) worstChallengeTime = player.challengeTimes[i]/100
    }
}


function sacrificeConf() {
    player.options.sacrificeConfirmation = !player.options.sacrificeConfirmation
}




function updateDimensions() {
    if (document.getElementById("antimatterdimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {

        for (let tier = 1; tier <= 8; ++tier) {
            var name = TIER_NAMES[tier];
            if (!canBuyDimension(tier) && document.getElementById(name + "Row").style.display !== "table-row") {
                break;
            }
            document.getElementById(name + "D").childNodes[0].nodeValue = DISPLAY_NAMES[tier] + " Dimension x" + formatValue(player.options.notation, getDimensionFinalMultiplier(tier), 1, 1);
            document.getElementById(name + "Amount").textContent = getDimensionDescription(tier);
        }



        for (let tier = 1; tier <= 8; ++tier) {
            var name = TIER_NAMES[tier];
            if (!canBuyDimension(tier)) {
                break;
            }

            document.getElementById(name + "Row").style.display = "table-row";
            document.getElementById(name + "Row").style.visibility = "visible";


        }

        var shiftRequirement = getShiftRequirement(0);
        if (player.currentChallenge == "challenge4" ? shiftRequirement.tier < 6 : shiftRequirement.tier < 8) {
            document.getElementById("resetLabel").textContent = 'Dimension Shift ('+ player.resets +'): requires ' + shiftRequirement.amount + " " + DISPLAY_NAMES[shiftRequirement.tier] + " Dimensions"
        }
        else document.getElementById("resetLabel").textContent = 'Dimension Boost ('+ player.resets +'): requires ' + shiftRequirement.amount + " " + DISPLAY_NAMES[shiftRequirement.tier] + " Dimensions"

        if (player.currentChallenge == "challenge4" ? player.resets > 2 : player.resets > 3) {
            document.getElementById("softReset").textContent = "Reset the game for a boost"
        } else {
            document.getElementById("softReset").textContent = "Reset the game for a new Dimension"
        }
        let extraGals = player.replicanti.galaxies
        if (player.timestudy.studies.includes(225)) extraGals += Math.floor(player.replicanti.amount.e / 1000)
        if (player.timestudy.studies.includes(226)) extraGals += Math.floor(player.replicanti.gal / 15)
        var galString = ""
        if (player.galaxies >= 800) galString += "Remote Antimatter Galaxies (";
        else if (player.galaxies >= getGalaxyCostScalingStart() || player.currentEternityChall === "eterc5") galString += "Distant Antimatter Galaxies (";
        else galString += "Antimatter Galaxies (";
        galString += player.galaxies;
        if (extraGals > 0) galString += " + "+extraGals;
        if (player.dilation.freeGalaxies > 0) galString += " + "+player.dilation.freeGalaxies;
        galString += "): requires " + getGalaxyRequirement()
        if (player.currentChallenge == "challenge4") galString +=  " Sixth Dimensions";
        else galString +=  " Eighth Dimensions";
        document.getElementById("secondResetLabel").textContent = galString;
    }

    if (canBuyTickSpeed() || player.currentEternityChall == "eterc9") {
        var tickmult = getTickSpeedMultiplier()
        if (tickmult < 1e-9) document.getElementById("tickLabel").textContent = "Divide the tick interval by " + shortenDimensions(1 / tickmult) + '.'
        else {
            var places = 0
            if (tickmult < 0.2) places = Math.floor(Math.log10(Math.round(1/tickmult)))
            document.getElementById("tickLabel").textContent = 'Reduce the tick interval by ' + ((1 - tickmult) * 100).toFixed(places) + '%.'
        }

        document.getElementById("tickSpeed").style.visibility = "visible";
        document.getElementById("tickSpeedMax").style.visibility = "visible";
        document.getElementById("tickLabel").style.visibility = "visible";
        document.getElementById("tickSpeedAmount").style.visibility = "visible";
    } else {
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    }

    if (getInfinitied() === 0 && player.realities === 0 && player.eternities === 0) {
        $("#infinityStatistics").hide()
    } else {
        $("#infinityStatistics").show()
        if (player.bestInfinityTime === 999999999999) $("#bestInfinity").hide()
        else $("#bestInfinity").show()
        document.getElementById("bestInfinity").textContent = "Your fastest Infinity is in " + timeDisplay(player.bestInfinityTime) + "."
        document.getElementById("thisInfinity").textContent = "You have spent " + timeDisplay(player.thisInfinityTime) + " in this Infinity."
        if (player.infinityPoints.equals(1)) {
            document.getElementById("infinityPoints1").textContent = "You have 1 Infinity point."
            document.getElementById("infinityPoints2").textContent = "You have 1 Infinity point."
        }
        else {
            document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
            document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        }
        if (player.infinitied == 1) document.getElementById("infinitied").textContent = "You have infinitied 1 time."
        else document.getElementById("infinitied").textContent = "You have infinitied " + player.infinitied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ((player.infinitied === 1) ? " time." : " times.")
        if (player.infinitiedBank > 0) document.getElementById("infinitied").textContent = "You have infinitied " + player.infinitied.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " times this eternity."

    }

    if (document.getElementById("stats").style.display == "block" && document.getElementById("statistics").style.display == "block") {
        document.getElementById("totalmoney").textContent = 'You have made a total of ' + shortenMoney(player.totalmoney) + ' antimatter.'
        document.getElementById("totalresets").textContent = 'You have done ' + player.resets + ' dimensional boosts/shifts.'
        document.getElementById("galaxies").textContent = 'You have ' + Math.round(player.galaxies) + ' Antimatter Galaxies.'
        document.getElementById("totalRealTime").textContent = "You have played for " + timeDisplay(player.realTimePlayed) + "."
        
        if (player.realities == 0 ) {
            $("#totalTime").hide()
        } else {
            $("#totalTime").show()
            document.getElementById("totalTime").textContent = "Your existence has spanned " + timeDisplay(player.totalTimePlayed) + " of time."
        }

        if (player.eternities == 0 && player.realities === 0) {
            $("#eternityStatistics").hide()
        } else {
            $("#eternityStatistics").show()
            if (player.bestEternity === 999999999999) $("#besteternity").hide()
            else $("#besteternity").show()
            document.getElementById("eternitied").textContent = "You have Eternitied " + player.eternities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ((player.eternities === 1) ? " time." : " times.")
            document.getElementById("besteternity").textContent = "Your fastest Eternity is in "+timeDisplay(player.bestEternity)+"."
            document.getElementById("thiseternity").textContent = "You have spent "+timeDisplay(player.thisEternity)+" in this Eternity."
        }

        if (player.realities == 0) {
            $("#realityStatistics").hide()
        } else {
            $("#realityStatistics").show()
            document.getElementById("realitied").textContent = "You have Realitied " + player.realities.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ((player.realities === 1) ? " time." : " times.")
            document.getElementById("bestreality").textContent = "Your fastest Reality is in "+timeDisplay(player.bestReality)+"."
            document.getElementById("thisreality").textContent = "You have spent "+timeDisplay(player.thisReality)+" in this Reality."
        }
    }

    if (document.getElementById("infinity").style.display == "block") {
        if (document.getElementById("preinf").style.display == "block") {
            document.getElementById("infi11").innerHTML = "Normal dimensions gain a multiplier based on time played <br>Currently: " + (Math.pow(0.5 * player.totalTimePlayed / 60000, 0.15)).toFixed(2) + "x<br>Cost: 1 IP"
            document.getElementById("infi12").innerHTML = "First and Eighth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
            document.getElementById("infi13").innerHTML = "Third and Sixth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
            document.getElementById("infi22").innerHTML = "Second and seventh Dimensions gain a multiplier based on infinitied stat<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
            document.getElementById("infi23").innerHTML = "Fourth and Fifth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + formatValue(player.options.notation, dimMults(), 1, 1) + "x<br>Cost: 1 IP"
            document.getElementById("infi31").innerHTML = "Normal dimensions gain a multiplier based on time spent in current infinity<br>Currently: " + Decimal.max(Math.pow(player.thisInfinityTime / 240000, 0.25), 1).toFixed(2) + "x<br>Cost: 3 IP"
            document.getElementById("infi32").innerHTML = "Multiplier for unspent Infinity Points on 1st Dimension<br>Currently: " + formatValue(player.options.notation, player.infinityPoints.dividedBy(2).pow(1.5).plus(1), 2, 2) + "x<br>Cost: 5 IP"
            document.getElementById("infi34").innerHTML = "Infinity Point generation based on fastest infinity <br>Currently: "+shortenDimensions(player.infMult.times(kongIPMult * (isAchEnabled("r85") ? 4 : 1) * (isAchEnabled("r93") ? 4 : 1)))+" every " + timeDisplay(player.bestInfinityTime*10) + "<br>Cost: 10 IP"
        }
        else if (document.getElementById("postinf").style.display == "block") {
            document.getElementById("postinfi11").innerHTML = "Normal dimensions gain a multiplier based on total antimatter produced<br>Currently: "+ Math.pow(player.totalmoney.e+1, 0.5).toFixed(2)+"x<br>Cost: "+shortenCosts(1e4)+" IP"
            document.getElementById("postinfi21").innerHTML = "Normal dimensions gain a multiplier based on current antimatter<br>Currently: "+ Math.pow(player.money.e+1, 0.5).toFixed(2)+"x<br>Cost: "+shortenCosts(5e4)+" IP"
            document.getElementById("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>"+player.tickSpeedMultDecrease+"x -> "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenDimensions(player.tickSpeedMultDecreaseCost) +" IP"
            if (player.tickSpeedMultDecrease <= 2) document.getElementById("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>"+player.tickSpeedMultDecrease+"x"
            document.getElementById("postinfi22").innerHTML = "Normal dimensions gain a multiplier based on non-secret achievements completed <br>Currently: "+achievementMult.toFixed(2)+"x<br>Cost: "+shortenCosts(1e6)+" IP"
            document.getElementById("postinfi12").innerHTML = "Normal dimensions gain a multiplier based on amount infinitied <br>Currently: "+(1+Math.log10(getInfinitied()+1)*10).toFixed(2)+"x<br>Cost: "+shortenCosts(1e5)+" IP"
            if (player.timestudy.studies.includes(31)) document.getElementById("postinfi12").innerHTML = "Normal dimensions gain a multiplier based on amount infinitied <br>Currently: "+shortenMoney(Math.pow((Math.log10(getInfinitied()+1)*10).toFixed(2), 4))+"x<br>Cost: "+shortenCosts(1e5)+" IP"
            document.getElementById("postinfi41").innerHTML = "Make galaxies 50% stronger <br>Cost: "+shortenCosts(5e11)+" IP"
            document.getElementById("postinfi32").innerHTML = "Normal dimensions gain a multiplier based on slowest challenge run<br>Currently:"+Decimal.max(10*3000/worstChallengeTime, 1).toFixed(2)+"x<br>Cost: "+shortenCosts(1e7)+" IP"
            document.getElementById("postinfi42").innerHTML = "Dimension cost multiplier increase <br>"+player.dimensionMultDecrease+"x -> "+(player.dimensionMultDecrease-1)+"x<br>Cost: "+shortenCosts(player.dimensionMultDecreaseCost) +" IP"

            document.getElementById("postinfi13").innerHTML = "You passively generate Infinitied stat based on your fastest infinity.<br>1 Infinity every "+timeDisplay(player.bestInfinityTime*5)+ " <br>Cost: "+shortenCosts(20e6)+" IP"
            document.getElementById("postinfi23").innerHTML = "Option to bulk buy Dimension Boosts <br>Cost: "+shortenCosts(5e9)+" IP"
            document.getElementById("postinfi33").innerHTML = "Autobuyers work twice as fast <br>Cost:"+shortenCosts(1e15)+" IP"
            if (player.dimensionMultDecrease <= 3) document.getElementById("postinfi42").innerHTML = "Dimension cost multiplier increase <br>"+player.dimensionMultDecrease.toFixed(1)+"x"

            document.getElementById("offlineProd").innerHTML = "Generate "+player.offlineProd+"% > "+Math.max(Math.max(5, player.offlineProd + 5), Math.min(50, player.offlineProd + 5))+"% of your best IP/min from last 10 infinities, works offline<br>Currently: "+shortenMoney(bestRunIppm.times(player.offlineProd/100)) +"IP/min<br> Cost: "+shortenCosts(player.offlineProdCost)+" IP"
            if (player.offlineProd == 50) document.getElementById("offlineProd").innerHTML = "Generate "+player.offlineProd+"% of your best IP/min from last 10 infinities, works offline<br>Currently: "+shortenMoney(bestRunIppm.times(player.offlineProd/100)) +" IP/min"
        }
    }

    if (document.getElementById("eternityupgrades").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
        document.getElementById("eter1").innerHTML = "Infinity Dimensions multiplier based on unspent EP (x+1)<br>Currently: "+shortenMoney(player.eternityPoints.plus(1))+"x<br>Cost: 5 EP"
        document.getElementById("eter2").innerHTML = "Infinity Dimension multiplier based on eternities ((x/200)^log4(2x))<br>Currently: "+shortenMoney(Decimal.pow(Math.min(player.eternities, 100000)/200 + 1, Math.log(Math.min(player.eternities, 100000)*2+1)/Math.log(4)).times(new Decimal((player.eternities-100000)/200 + 1).times(Math.log((player.eternities- 100000)*2+1)/Math.log(4)).max(1)))+"x<br>Cost: 10 EP"
        document.getElementById("eter3").innerHTML = "Infinity Dimensions multiplier based on sum of Infinity Challenge times<br>Currently: "+shortenMoney(Decimal.pow(2,30000/Math.max(infchallengeTimes, isAchEnabled("r112") ? 610 : 750)))+"x<br>Cost: "+shortenCosts(50e3)+" EP"
        document.getElementById("eter4").innerHTML = "Your achievement bonus affects Time Dimensions"+"<br>Cost: "+shortenCosts(1e16)+" EP"
        document.getElementById("eter5").innerHTML = "Time Dimensions are multiplied by your unspent time theorems"+"<br>Cost: "+shortenCosts(1e40)+" EP"
        document.getElementById("eter6").innerHTML = "Time Dimensions are multiplied by days played"+"<br>Cost: "+shortenCosts(1e50)+" EP"
    }

    if (document.getElementById("dilation").style.display == "block") {
        if (player.dilation.active) {
            if (getTachyonGain() <= 0) {
                document.getElementById("enabledilation").innerHTML = "Disable dilation.<br>Reach " + shortenMoney(getTachyonReq()) + " antimatter to gain more Tachyon Particles."
            } else {
                document.getElementById("enabledilation").textContent = "Disable dilation."
            }
        }
        else document.getElementById("enabledilation").textContent = "Dilate time."
    }
}

function updateCosts() {
    document.getElementById("first").textContent = 'Cost: ' + shortenCosts(player.firstCost);
    document.getElementById("second").textContent = 'Cost: ' + shortenCosts(player.secondCost);
    document.getElementById("third").textContent = 'Cost: ' + shortenCosts(player.thirdCost);
    document.getElementById("fourth").textContent = 'Cost: ' + shortenCosts(player.fourthCost);
    document.getElementById("fifth").textContent = 'Cost: ' + shortenCosts(player.fifthCost);
    document.getElementById("sixth").textContent = 'Cost: ' + shortenCosts(player.sixthCost);
    document.getElementById("seventh").textContent = 'Cost: ' + shortenCosts(player.seventhCost);
    document.getElementById("eight").textContent = 'Cost: ' + shortenCosts(player.eightCost);

    document.getElementById("firstMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.firstCost.times(10 - dimBought(1)));
    document.getElementById("secondMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.secondCost.times(10 - dimBought(2)));
    document.getElementById("thirdMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.thirdCost.times(10 - dimBought(3)));
    document.getElementById("fourthMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.fourthCost.times(10 - dimBought(4)));
    document.getElementById("fifthMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.fifthCost.times(10 - dimBought(5)));
    document.getElementById("sixthMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.sixthCost.times(10 - dimBought(6)));
    document.getElementById("seventhMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.seventhCost.times(10 - dimBought(7)));
    document.getElementById("eightMax").textContent = 'Until 10, Cost: ' + shortenCosts(player.eightCost.times(10 - dimBought(8)));

    document.getElementById("tickSpeed").textContent = 'Cost: ' + shortenCosts(player.tickSpeedCost);


    for (var i=1; i<=8; i++) {

        document.getElementById("infMax"+i).textContent = "Cost: " + shortenCosts(player["infinityDimension"+i].cost) + " IP"
    }

    for (var i=1; i<=8; i++) {

        document.getElementById("timeMax"+i).textContent = "Cost: " + shortenDimensions(player["timeDimension"+i].cost) + " EP"
    }
}

function floatText(id, text, leftOffset = 150) {
    if (!player.options.animations.floatingText) return
    var el = $("#"+id)
    el.append("<div class='floatingText' style='left: "+leftOffset+"px'>"+text+"</div>")
    setTimeout(function() {
        el.children()[0].remove()
    }, 1000)
}




function isEterChall(elem) {
    return !elem.id.includes("eter")
}

function updateChallenges() {
    try {
        var buttons = Array.from(document.getElementsByClassName('onchallengebtn')).filter(isEterChall)
        for (var i=0; i < buttons.length; i++) {
            buttons[i].className = "challengesbtn";
            buttons[i].textContent = "Start"
        }

        var buttonss = Array.from(document.getElementsByClassName('completedchallengesbtn')).filter(isEterChall)
        for (var i=0; i < buttonss.length; i++) {
            buttonss[i].className = "challengesbtn";
            buttonss[i].textContent = "Start"
        }


        for (var i=0; i < player.challenges.length; i++) {
            document.getElementById(player.challenges[i]).className = "completedchallengesbtn";
            document.getElementById(player.challenges[i]).textContent = "Completed"
        }

        if (player.currentChallenge != "") {
            document.getElementById(player.currentChallenge).className = "onchallengebtn"
            document.getElementById(player.currentChallenge).textContent = "Running"
        }

        if (player.money.gte(new Decimal("1e2000")) || Object.keys(player.eternityChalls).length > 0 || player.eternityChallUnlocked !== 0) document.getElementById("challTabButtons").style.display = "table"
        for (var i=1; i<9; i++) {
            if (player.postChallUnlocked >= i) document.getElementById("postc"+i+"div").style.display = "inline-block"
            else document.getElementById("postc"+i+"div").style.display = "none"
        }



    } catch (err) {
        console.log(err)
        updateChallenges()

    }

}


function updateEternityChallenges() {

    for (var property in player.eternityChalls) {
        document.getElementById(property+"div").style.display = "inline-block"
        if (player.eternityChalls[property] < 5) {
            document.getElementById(property).textContent = "Locked"
            document.getElementById(property).className = "lockedchallengesbtn"
        }
        else {
            document.getElementById(property).textContent = "Completed"
            document.getElementById(property).className = "completedchallengesbtn"
        }
    }

    if (player.eternityChallUnlocked !== 0) {
        document.getElementById("eterc"+player.eternityChallUnlocked).textContent = "Start"
        document.getElementById("eterc"+player.eternityChallUnlocked).className = "challengesbtn"
        document.getElementById("eterctabbtn").style.display = "block"
    } else {
        for (i=1; i<13; i++) {
            if (player.eternityChalls["eterc"+i] !== 5) {
                document.getElementById("eterc"+i).textContent = "Locked"
                document.getElementById("eterc"+i).className = "lockedchallengesbtn"
            }
        }
    }

    if (player.eternityChallUnlocked == 0 && player.eternityChalls.eterc1 === undefined) {
        document.getElementById("eterctabbtn").style.display = "none"
        for (i=1; i<13; i++) {
            document.getElementById("eterc"+i+"div").style.display = "none"
        }
    }

    if (player.eternityChalls.eterc1 !== undefined) document.getElementById("eterctabbtn").style.display = "block"
    if (player.etercreq !== 0) document.getElementById("eterc"+player.etercreq+"div").style.display = "block"

    if (player.currentEternityChall !== "") {
        document.getElementById(player.currentEternityChall).textContent = "Running"
        document.getElementById(player.currentEternityChall).className = "onchallengebtn"
    }
}









function toggleChallengeRetry() {
    if (player.options.retryChallenge) {
        player.options.retryChallenge = false
        document.getElementById("retry").textContent = "Automatically retry challenges OFF"
    } else {
        player.options.retryChallenge = true
        document.getElementById("retry").textContent = "Automatically retry challenges ON"
    }
}

document.getElementById("news").onclick = function () {
    if (document.getElementById("news").textContent === "Click this to unlock a secret achievement.") {
        giveAchievement("Real news")
    }
};

document.getElementById("secretstudy").onclick = function () {
    document.getElementById("secretstudy").style.opacity = "1";
    document.getElementById("secretstudy").style.cursor = "default";
    giveAchievement("Go study in real life instead");
    setTimeout(drawStudyTree, 2000);
};

document.getElementById("The first one's always free").onclick = function () {
    giveAchievement("The first one's always free")
};




function glowText(id) {
  var text = document.getElementById(id);
  text.style.setProperty("-webkit-animation", "glow 1s");
  text.style.setProperty("animation", "glow 1s");
}





document.getElementById("maxall").onclick = function () {
    if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;
    buyMaxTickSpeed();

    for (var tier=1; tier<9;tier++) {
        var name = TIER_NAMES[tier];
        var cost = player[name + 'Cost'].times(10 - dimBought(tier))
        var multBefore = player[name + 'Pow']
        if (tier >= 3 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) {
            if (!canBuyDimension(tier)) continue
            if (player[TIER_NAMES[tier-2] + 'Amount'].lt(cost)) continue
                if (canBuyDimension(tier)) {
                    if (cost.lt(player[TIER_NAMES[tier-2]+"Amount"]) && dimBought(tier) != 0) {
                        player[TIER_NAMES[tier-2]+"Amount"] = player[TIER_NAMES[tier-2]+"Amount"].minus(cost)
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10 - dimBought(tier)))
                        player[name + 'Bought'] += (10 - dimBought(tier));
                        player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier))
                        player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                    }
                    while (player[TIER_NAMES[tier-2]+"Amount"].gt(player[name + "Cost"].times(10))) {
                        player[TIER_NAMES[tier-2]+"Amount"] = player[TIER_NAMES[tier-2]+"Amount"].minus(player[name + "Cost"].times(10))
                        player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                    }


                    onBuyDimension(tier);
                }
        } else {
        if (!canBuyDimension(tier)) continue
            if (cost.lt(player.money) && dimBought(tier) != 0) {
                player.money = player.money.minus(cost)
                player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10 - dimBought(tier)))
                player[name + 'Bought'] += (10 - dimBought(tier));
                player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier))
                player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
            }
            if (player.money.lt(player[name + "Cost"].times(10))) continue

            if ((player.dimensionMultDecrease > 3 || player.currentChallenge == "postc5" || player.currentChallenge == "challenge5")) {
                while ((player.money.gte(player[name + "Cost"].times(10)) && player.money.lte(Number.MAX_VALUE)) || (player.money.gte(player[name + "Cost"].times(10)) && player.currentChallenge != "challenge5")) {
                        player.money = player.money.minus(player[name + "Cost"].times(10))
                        if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
                        else multiplySameCosts(player[name + 'Cost'])
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                }
            } else {
                if (player[name + "Cost"].lt(Number.MAX_VALUE)) {
                    while (player.money.gte(player[name + "Cost"].times(10)) && player[name + "Cost"].lte(Number.MAX_VALUE)) {
                        player.money = player.money.minus(player[name + "Cost"].times(10))
                        if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
                        else multiplySameCosts(player[name + 'Cost'])
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                }
                }

                if (player[name + "Cost"].gte(Number.MAX_VALUE)) {
                    var a = Math.log10(Math.sqrt(player.dimensionMultDecrease))
                    var b = player.costMultipliers[tier-1].dividedBy(Math.sqrt(player.dimensionMultDecrease)).log10()
                    var c = player[name + "Cost"].dividedBy(player.money).log10()
                    var discriminant = Math.pow(b, 2) - (c *a* 4)
                    if (discriminant < 0) continue
                    var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
                    if (buying <= 0) return false
                    player[name+"Amount"] = Decimal.round(player[name+"Amount"].plus(10*buying))
                    preInfBuy = Math.floor(1 + (308 - initCost[tier].log10()) / costMults[tier].log10())
                    postInfBuy = player[name + 'Bought']/10+buying - preInfBuy - 1
                    postInfInitCost = initCost[tier].times(Decimal.pow(costMults[tier], preInfBuy))
                    player[name + 'Bought'] += 10*buying
                    player[name + "Pow"] = player[name + "Pow"].times(Decimal.pow(getDimensionPowerMultiplier(tier), buying))

                    newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(player.dimensionMultDecrease, postInfBuy * (postInfBuy+1)/2))
                    newMult = costMults[tier].times(Decimal.pow(player.dimensionMultDecrease, postInfBuy+1))
                    //if (buying > 0 )player[name + "Cost"] = player.costMultipliers[tier-1].times(Decimal.pow(player.dimensionMultDecrease, (buying * buying - buying)/2)).times(player[name + "Cost"])

                    player[name + "Cost"] = newCost
                    player.costMultipliers[tier-1] = newMult
                    if (player.money.gte(player[name + "Cost"]))player.money = player.money.minus(player[name + "Cost"])
                    player[name + "Cost"] = player[name + "Cost"].times(player.costMultipliers[tier-1])
                    player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                }


        }
        }
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
        if (player.currentChallenge == "postc1") clearDimensions(tier-1);
        player.postC4Tier = tier;
        onBuyDimension(tier)
        floatText(name + "D", "x" + shortenMoney(player[name + "Pow"].dividedBy(multBefore)))
    }
}

function confirmationOnOff(name) {
    if (player.options.confirmations[name]) player.options.confirmations[name] = false;
    else player.options.confirmations[name] = true;
    if (name == "challenges") document.getElementById("challengesConfBtn").textContent = "Challenges: " + ((player.options.confirmations.challenges) ? "ON" : "OFF")
    else if (name == "eternity") document.getElementById("eternityConfBtn").textContent = "Eternity: " + ((player.options.confirmations.eternity) ? "ON" : "OFF")
    else if (name == "dilation") document.getElementById("dilationConfBtn").textContent = "Dilation: " + ((player.options.confirmations.dilation) ? "ON" : "OFF")
    else if (name == "reality") document.getElementById("realityConfBtn").textContent = "Reality: " + ((player.options.confirmations.reality) ? "ON" : "OFF")
}

function buyInfinityUpgrade(name, cost) {
    if (player.infinityPoints.gte(cost) && !player.infinityUpgrades.includes(name)) {
        player.infinityUpgrades.push(name);
        player.infinityPoints = player.infinityPoints.minus(cost);
        return true
    } else return false
}

document.getElementById("infiMult").onclick = function() {
    if (player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost)) {
        player.infinityPoints = player.infinityPoints.minus(player.infMultCost)
        player.infMult = player.infMult.times(2);
        player.autoIP = player.autoIP.times(2);
        player.infMultCost = player.infMultCost.times(10)
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(2);
        if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
    }
}


function updateEternityUpgrades() {
    document.getElementById("eter1").className = (player.eternityUpgrades.includes(1)) ? "eternityupbtnbought" : (player.eternityPoints.gte(5)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter2").className = (player.eternityUpgrades.includes(2)) ? "eternityupbtnbought" : (player.eternityPoints.gte(10)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter3").className = (player.eternityUpgrades.includes(3)) ? "eternityupbtnbought" : (player.eternityPoints.gte(50e3)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter4").className = (player.eternityUpgrades.includes(4)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e16)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter5").className = (player.eternityUpgrades.includes(5)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e40)) ? "eternityupbtn" : "eternityupbtnlocked"
    document.getElementById("eter6").className = (player.eternityUpgrades.includes(6)) ? "eternityupbtnbought" : (player.eternityPoints.gte(1e50)) ? "eternityupbtn" : "eternityupbtnlocked"
}


function buyEternityUpgrade(name, cost) {
    if (player.eternityPoints.gte(cost) && !player.eternityUpgrades.includes(name)) {
        player.eternityUpgrades.push(name)
        player.eternityPoints = player.eternityPoints.minus(cost)
        updateEternityUpgrades()
    }
}


function buyEPMult() {
    if (player.eternityPoints.gte(player.epmultCost)) {
        player.epmult = player.epmult.times(5)
        player.eternityBuyer.limit = player.eternityBuyer.limit.times(5)
        document.getElementById("priority13").value = formatValue("Scientific", player.eternityBuyer.limit, 2, 0);
        player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
        let count = player.epmult.ln()/Math.log(5)
        if (player.epmultCost.gte(new Decimal("1e4000"))) player.epmultCost = Decimal.pow(1000, count + Math.pow(count-1334, 1.2)).times(500)
        else if (player.epmultCost.gte(new Decimal("1e1300"))) player.epmultCost = Decimal.pow(1000, count).times(500)
        else if (player.epmultCost.gte(Number.MAX_VALUE)) player.epmultCost = Decimal.pow(500, count).times(500)
        else if (player.epmultCost.gte(new Decimal("1e100"))) player.epmultCost = Decimal.pow(100, count).times(500)
        else player.epmultCost = Decimal.pow(50, count).times(500)
        document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
        updateEternityUpgrades()
    }
}

function buyMaxEPMult() {
    while (player.eternityPoints.gte(player.epmultCost)) {
        buyEPMult()
    }
}





function playerInfinityUpgradesOnEternity() {
    if (player.eternities < 4) player.infinityUpgrades = []
    else if (player.eternities < 20) player.infinityUpgrades = ["timeMult", "dimMult", "timeMult2", "skipReset1", "skipReset2", "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "skipReset3", "passiveGen", "45Mult", "resetBoost", "galaxyBoost", "skipResetGalaxy"]
    else player.infinityUpgrades = player.infinityUpgrades
}



document.getElementById("infi11").onclick = function () {
    buyInfinityUpgrade("timeMult",1);
}

document.getElementById("infi21").onclick = function () {
    buyInfinityUpgrade("dimMult",1);
}

document.getElementById("infi12").onclick = function () {
    if (player.infinityUpgrades.includes("timeMult")) buyInfinityUpgrade("18Mult",1);
}

document.getElementById("infi22").onclick = function () {
    if (player.infinityUpgrades.includes("dimMult")) buyInfinityUpgrade("27Mult",1);
}

document.getElementById("infi13").onclick = function () {
    if (player.infinityUpgrades.includes("18Mult")) buyInfinityUpgrade("36Mult",1);
}
document.getElementById("infi23").onclick = function () {
    if (player.infinityUpgrades.includes("27Mult")) buyInfinityUpgrade("45Mult",1);
}

document.getElementById("infi14").onclick = function () {
    if (player.infinityUpgrades.includes("36Mult")) buyInfinityUpgrade("resetBoost",1);
}

document.getElementById("infi24").onclick = function () {
    if (player.infinityUpgrades.includes("45Mult")) buyInfinityUpgrade("galaxyBoost",2);
}

document.getElementById("infi31").onclick = function() {
    buyInfinityUpgrade("timeMult2",3);
}

document.getElementById("infi32").onclick = function() {
    if (player.infinityUpgrades.includes("timeMult2")) buyInfinityUpgrade("unspentBonus",5);
}

document.getElementById("infi33").onclick = function() {
    if (player.infinityUpgrades.includes("unspentBonus")) buyInfinityUpgrade("resetMult",7);
}

document.getElementById("infi34").onclick = function() {
    if (player.infinityUpgrades.includes("resetMult")) buyInfinityUpgrade("passiveGen",10);
}

document.getElementById("infi41").onclick = function() {
    buyInfinityUpgrade("skipReset1",20);
}

document.getElementById("infi42").onclick = function() {
    if (player.infinityUpgrades.includes("skipReset1")) buyInfinityUpgrade("skipReset2", 40)
}

document.getElementById("infi43").onclick = function() {
    if (player.infinityUpgrades.includes("skipReset2")) buyInfinityUpgrade("skipReset3", 80)
}

document.getElementById("infi44").onclick = function() {
    if (player.infinityUpgrades.includes("skipReset3")) buyInfinityUpgrade("skipResetGalaxy", 500)
}


document.getElementById("postinfi11").onclick = function() {
    buyInfinityUpgrade("totalMult",1e4);
}

document.getElementById("postinfi21").onclick = function() {
    buyInfinityUpgrade("currentMult",5e4);
}

document.getElementById("postinfi31").onclick = function() {
    if (player.infinityPoints.gte(player.tickSpeedMultDecreaseCost) && player.tickSpeedMultDecrease > 2) {
        player.infinityPoints = player.infinityPoints.minus(player.tickSpeedMultDecreaseCost)
        player.tickSpeedMultDecreaseCost *= 5
        player.tickSpeedMultDecrease--;
        document.getElementById("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>"+player.tickSpeedMultDecrease+"x -> "+(player.tickSpeedMultDecrease-1)+"x<br>Cost: "+shortenCosts(player.tickSpeedMultDecreaseCost) +" IP"
        if (player.tickSpeedMultDecrease <= 2) document.getElementById("postinfi31").innerHTML = "Tickspeed cost multiplier increase <br>"+player.tickSpeedMultDecrease+"x"
    }
}

document.getElementById("postinfi41").onclick = function() {
    buyInfinityUpgrade("postGalaxy",5e11);
}

document.getElementById("postinfi12").onclick = function() {
    buyInfinityUpgrade("infinitiedMult",1e5);
}

document.getElementById("postinfi22").onclick = function() {
    buyInfinityUpgrade("achievementMult",1e6);
}

document.getElementById("postinfi32").onclick = function() {
    buyInfinityUpgrade("challengeMult",1e7);
}

document.getElementById("postinfi42").onclick = function() {
    if (player.infinityPoints.gte(player.dimensionMultDecreaseCost) && player.dimensionMultDecrease > 3) {
        player.infinityPoints = player.infinityPoints.minus(player.dimensionMultDecreaseCost)
        player.dimensionMultDecreaseCost *= 5000
        player.dimensionMultDecrease--;
        document.getElementById("postinfi42").innerHTML = "Dimension cost multiplier increase <br>"+player.dimensionMultDecrease+"x -> "+(player.dimensionMultDecrease-1)+"x<br>Cost: "+shortenCosts(player.dimensionMultDecreaseCost) +" IP"
        if (player.dimensionMultDecrease <= 3) document.getElementById("postinfi42").innerHTML = "Dimension cost multiplier increase <br>"+player.dimensionMultDecrease.toFixed(1)+"x"
    }
}

document.getElementById("offlineProd").onclick = function() {
    if (player.infinityPoints.gte(player.offlineProdCost) && player.offlineProd < 50) {
        player.infinityPoints = player.infinityPoints.minus(player.offlineProdCost)
        player.offlineProdCost *= 10
        player.offlineProd += 5

    }
}


function updateInfCosts() {

    document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
    if (document.getElementById("replicantis").style.display == "block" && document.getElementById("infinity").style.display == "block") {
        if (player.replicanti.chance < 1) document.getElementById("replicantichance").innerHTML = "Replicate chance: "+Math.round(player.replicanti.chance*100)+"%<br>+"+1+"% Costs: "+shortenCosts(player.replicanti.chanceCost)+" IP"
        else document.getElementById("replicantichance").textContent = "Replicate chance: "+Math.round(player.replicanti.chance*100)+"%"
        let replGalOver = 0
        if (player.timestudy.studies.includes(131)) replGalOver += Math.floor(player.replicanti.gal / 2)
        if (player.timestudy.studies.includes(233)) {
            if (replGalOver !== 0) document.getElementById("replicantimax").innerHTML = "Max Replicanti galaxies: "+player.replicanti.gal+"+"+replGalOver+"<br>+1 Costs: "+shortenCosts(player.replicanti.galCost.dividedBy(player.replicanti.amount.pow(0.3)))+" IP"
            else document.getElementById("replicantimax").innerHTML = "Max Replicanti galaxies: "+player.replicanti.gal+"<br>+1 Costs: "+shortenCosts(player.replicanti.galCost.dividedBy(player.replicanti.amount.pow(0.3)))+" IP"
        } else {
            if (replGalOver !== 0) document.getElementById("replicantimax").innerHTML = "Max Replicanti galaxies: "+player.replicanti.gal+"+"+replGalOver+"<br>+1 Costs: "+shortenCosts(player.replicanti.galCost)+" IP"
            else document.getElementById("replicantimax").innerHTML = "Max Replicanti galaxies: "+player.replicanti.gal+"<br>+1 Costs: "+shortenCosts(player.replicanti.galCost)+" IP"
        }
        document.getElementById("replicantiunlock").innerHTML = "Unlock Replicantis<br>Cost: "+shortenCosts(1e140)+" IP"
        let extraGals = 0
        if (player.timestudy.studies.includes(225)) extraGals += Math.floor(player.replicanti.amount.e / 1000)
        if (player.timestudy.studies.includes(226)) extraGals += Math.floor(player.replicanti.gal / 15)
        if (extraGals !== 0) document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + "+"+extraGals+ " replicated galaxies created."
        else document.getElementById("replicantireset").innerHTML = (player.replicanti.galaxies !== 1) ? "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created." : "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxy created."

        document.getElementById("replicantichance").className = (player.infinityPoints.gte(player.replicanti.chanceCost) && player.replicanti.chance < 1) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantiinterval").className = (player.infinityPoints.gte(player.replicanti.intervalCost) && ((player.replicanti.interval !== 50) || player.timestudy.studies.includes(22)) && (player.replicanti.interval !== 1)) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantimax").className = (player.infinityPoints.gte(player.replicanti.galCost)) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantireset").className = ((player.replicanti.galaxies < player.replicanti.gal && player.replicanti.amount.gte(Number.MAX_VALUE)) || (player.replicanti.galaxies < Math.floor(player.replicanti.gal * 1.5) && player.replicanti.amount.gte(Number.MAX_VALUE) && player.timestudy.studies.includes(131))) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantiunlock").className = (player.infinityPoints.gte(1e140)) ? "storebtn" : "unavailablebtn"
    }

    if (document.getElementById("timestudies").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
        document.getElementById("11desc").textContent = "Currently: "+shortenMoney(Decimal.fromMantissaExponent(10 -player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).mantissa, Math.abs(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).e)).min("1e2500").max(1))+"x"
        document.getElementById("32desc").textContent = "You gain "+Math.max(player.resets, 1)+"x more infinitied stat (based on dimension boosts)"
        document.getElementById("51desc").textContent = "You gain "+shortenCosts(1e15)+"x more IP"
        document.getElementById("71desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.25).max(1).min("1e210000"))+"x"
        document.getElementById("72desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))+"x"
        document.getElementById("73desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.005).max(1).min("1e1300"))+"x"
        document.getElementById("82desc").textContent = "Currently: "+shortenMoney(Decimal.pow(1.0000109, Decimal.pow(player.resets, 2)))+"x"
        document.getElementById("91desc").textContent = "Currently: "+shortenMoney(Decimal.pow(10, Math.min(player.thisEternity/100, 18000)/60))+"x"
        document.getElementById("92desc").textContent = "Currently: "+shortenMoney(Decimal.pow(2, 600/Math.max(player.bestEternity/100, 20)))+"x"
        document.getElementById("93desc").textContent = "Currently: "+shortenMoney(Decimal.pow(player.totalTickGained, 0.25))+"x"
        document.getElementById("121desc").textContent = "Currently: "+((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5).toFixed(1)+"x"
        document.getElementById("123desc").textContent = "Currently: "+Math.sqrt(1.39*player.thisEternity/1000).toFixed(1)+"x"
        document.getElementById("141desc").textContent = "Currently: "+shortenMoney(new Decimal(1e45).dividedBy(Decimal.pow(15, Math.log(player.thisInfinityTime/100)*Math.pow(player.thisInfinityTime/100, 0.125))).max(1))+"x"
        document.getElementById("142desc").textContent = "You gain "+shortenCosts(1e25)+"x more IP"
        document.getElementById("143desc").textContent = "Currently: "+shortenMoney(Decimal.pow(15, Math.log(player.thisInfinityTime/100)*Math.pow(player.thisInfinityTime/100, 0.125)))+"x"
        document.getElementById("151desc").textContent = shortenCosts(1e4)+"x multiplier on all Time dimensions"
        document.getElementById("161desc").textContent = shortenCosts(new Decimal("1e616"))+"x multiplier on all normal dimensions"
        document.getElementById("162desc").textContent = shortenCosts(1e11)+"x multiplier on all Infinity dimensions"
        document.getElementById("192desc").textContent = "You can get beyond "+shortenMoney(Number.MAX_VALUE)+" replicantis, but the interval is increased the more you have"
        document.getElementById("193desc").textContent = "Currently: "+shortenMoney(Decimal.pow(1.03, player.eternities).min("1e13000"))+"x"
        document.getElementById("212desc").textContent = "Currently: "+((Math.pow(player.timeShards.max(2).log2(), 0.005)-1)*100).toFixed(2)+"%"
        document.getElementById("214desc").textContent = "Currently: "+shortenMoney(((calcTotalSacrificeBoost().pow(8)).min("1e46000").times(calcTotalSacrificeBoost().pow(1.1)).div(calcTotalSacrificeBoost())).max(1).min(new Decimal("1e125000")))+"x"

        if (player.etercreq !== 1) document.getElementById("ec1unl").innerHTML = "Eternity Challenge 1<span>Requirement: "+(ECTimesCompleted("eterc1")+1)*20000+" Eternities<span>Cost: 30 Time Theorems"
        else document.getElementById("ec1unl").innerHTML = "Eternity Challenge 1<span>Cost: 30 Time Theorems"
        if (player.etercreq !== 2) document.getElementById("ec2unl").innerHTML = "Eternity Challenge 2<span>Requirement: "+(1300+(ECTimesCompleted("eterc2")*150))+" Tickspeed upgrades gained from time dimensions<span>Cost: 35 Time Theorems"
        else document.getElementById("ec2unl").innerHTML = "Eternity Challenge 2<span>Cost: 35 Time Theorems"
        if (player.etercreq !== 3) document.getElementById("ec3unl").innerHTML = "Eternity Challenge 3<span>Requirement: "+(17300+(ECTimesCompleted("eterc3")*1250))+" 8th dimensions<span>Cost: 40 Time Theorems"
        else document.getElementById("ec3unl").innerHTML = "Eternity Challenge 3<span>Cost: 40 Time Theorems"
        if (player.etercreq !== 4) document.getElementById("ec4unl").innerHTML = "Eternity Challenge 4<span>Requirement: "+(1e8 + (ECTimesCompleted("eterc4")*5e7)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" infinities<span>Cost: 70 Time Theorems"
        else document.getElementById("ec4unl").innerHTML = "Eternity Challenge 4<span>Cost: 70 Time Theorems"
        if (player.etercreq !== 5) document.getElementById("ec5unl").innerHTML = "Eternity Challenge 5<span>Requirement: "+(160+(ECTimesCompleted("eterc5")*14))+" antimatter galaxies<span>Cost: 130 Time Theorems"
        else document.getElementById("ec5unl").innerHTML = "Eternity Challenge 5<span>Cost: 130 Time Theorems"
        if (player.etercreq !== 6) document.getElementById("ec6unl").innerHTML = "Eternity Challenge 6<span>Requirement: "+(40+(ECTimesCompleted("eterc6")*5))+" replicanti galaxies<span>Cost: 85 Time Theorems"
        else document.getElementById("ec6unl").innerHTML = "Eternity Challenge 6<span>Cost: 85 Time Theorems"
        if (player.etercreq !== 7) document.getElementById("ec7unl").innerHTML = "Eternity Challenge 7<span>Requirement: "+shortenCosts(new Decimal("1e500000").times(new Decimal("1e300000").pow(ECTimesCompleted("eterc7"))))+" antimatter <span>Cost: 115 Time Theorems"
        else document.getElementById("ec7unl").innerHTML = "Eternity Challenge 7<span>Cost: 115 Time Theorems"
        if (player.etercreq !== 8) document.getElementById("ec8unl").innerHTML = "Eternity Challenge 8<span>Requirement: "+shortenCosts(new Decimal("1e4000").times(new Decimal("1e1000").pow(ECTimesCompleted("eterc8"))))+" IP <span>Cost: 115 Time Theorems"
        else document.getElementById("ec8unl").innerHTML = "Eternity Challenge 8<span>Cost: 115 Time Theorems"
        if (player.etercreq !== 9) document.getElementById("ec9unl").innerHTML = "Eternity Challenge 9<span>Requirement: "+shortenCosts(new Decimal("1e17500").times(new Decimal("1e2000").pow(ECTimesCompleted("eterc9"))))+" infinity power<span>Cost: 415 Time Theorems"
        else document.getElementById("ec9unl").innerHTML = "Eternity Challenge 9<span>Cost: 415 Time Theorems"
        if (player.etercreq !== 10) document.getElementById("ec10unl").innerHTML = "Eternity Challenge 10<span>Requirement: "+shortenCosts(new Decimal("1e100").times(new Decimal("1e20").pow(ECTimesCompleted("eterc10"))))+" EP<span>Cost: 550 Time Theorems"
        else document.getElementById("ec10unl").innerHTML = "Eternity Challenge 10<span>Cost: 550 Time Theorems"

        document.getElementById("ec11unl").innerHTML = "Eternity Challenge 11<span>Requirement: Use only the Normal Dimension path<span>Cost: 1 Time Theorem"
        document.getElementById("ec12unl").innerHTML = "Eternity Challenge 12<span>Requirement: Use only the Time Dimension path<span>Cost: 1 Time Theorem"

        if (player.dilation.studies.includes(1)) document.getElementById("dilstudy1").innerHTML = "Unlock time dilation<span>Cost: 5000 Time Theorems"
        else document.getElementById("dilstudy1").innerHTML = "Unlock time dilation<span>Requirement: 5 EC11 and EC12 completions and 13000 total theorems<span>Cost: 5000 Time Theorems"
    }
}



// Replicanti stuff



function updateMilestones() {
    var milestoneRequirements = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 25, 30, 40, 50, 60, 80, 100]
    for (i=0; i<milestoneRequirements.length; i++) {
        var name = "reward" + i;
        if (player.eternities >= milestoneRequirements[i]) {
            document.getElementById(name).className = "milestonereward"
        } else {
            document.getElementById(name).className = "milestonerewardlocked"
        }
    }
}

function infMultAutoToggle() {
    if (player.infMultBuyer) {
        player.infMultBuyer = false
        document.getElementById("infmultbuyer").textContent = "Autobuy IP mult OFF"
    } else {
        player.infMultBuyer = true
        document.getElementById("infmultbuyer").textContent = "Autobuy IP mult ON"
    }
}


function toggleCrunchMode() {
    if (player.autoCrunchMode == "amount") {
        player.autoCrunchMode = "time"
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
        document.getElementById("limittext").textContent = "Seconds between crunches:"
    } else if (player.autoCrunchMode == "time"){
        player.autoCrunchMode = "relative"
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
        document.getElementById("limittext").textContent = "X times last crunch:"
    } else {
        player.autoCrunchMode = "amount"
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
        document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
    }
}




function toggleCommas() {
    player.options.commas = !player.options.commas

    if (player.options.commas) document.getElementById("commas").textContent = "Commas on exponents"
    else document.getElementById("commas").textContent = "Notation on exponents"
}






buyAutobuyer = function(id) {
    if (player.infinityPoints.lt(player.autobuyers[id].cost)) return false;
    if (player.autobuyers[id].bulk >= 1e100) return false;
    player.infinityPoints = player.infinityPoints.minus(player.autobuyers[id].cost);
    if (player.autobuyers[id].interval <= 100) {
        player.autobuyers[id].bulk = Math.min(player.autobuyers[id].bulk * 2, 1e100);
        player.autobuyers[id].cost = Math.ceil(2.4*player.autobuyers[id].cost);
        var b1 = true;
	    for (let i=0;i<8;i++) {
            if (player.autobuyers[i].bulk < 512) b1 = false;
        }
        if (b1) giveAchievement("Bulked up");
    } else {
        player.autobuyers[id].interval = Math.max(player.autobuyers[id].interval*0.6, 100);
        if (player.autobuyers[id].interval > 120) player.autobuyers[id].cost *= 2; //if your last purchase wont be very strong, dont double the cost
    }
    updateAutobuyers();
}

document.getElementById("buyerBtn1").onclick = function () {
    buyAutobuyer(0);
}

document.getElementById("buyerBtn2").onclick = function () {

    buyAutobuyer(1);
}

document.getElementById("buyerBtn3").onclick = function () {
    buyAutobuyer(2);
}

document.getElementById("buyerBtn4").onclick = function () {
    buyAutobuyer(3);
}

document.getElementById("buyerBtn5").onclick = function () {
    buyAutobuyer(4);
}

document.getElementById("buyerBtn6").onclick = function () {
    buyAutobuyer(5);
}

document.getElementById("buyerBtn7").onclick = function () {
    buyAutobuyer(6);
}

document.getElementById("buyerBtn8").onclick = function () {
    buyAutobuyer(7);
}

document.getElementById("buyerBtnTickSpeed").onclick = function () {
    buyAutobuyer(8);
}

document.getElementById("buyerBtnDimBoost").onclick = function () {
    buyAutobuyer(9);
}

document.getElementById("buyerBtnGalaxies").onclick = function () {
    buyAutobuyer(10);
}

document.getElementById("buyerBtnInf").onclick = function () {
    buyAutobuyer(11);
}

toggleAutobuyerTarget = function(id) {
    if (player.autobuyers[id-1].target == id) {
        player.autobuyers[id-1].target = 10 + id
        document.getElementById("toggleBtn" + id).textContent = "Buys until 10"
    } else {
        player.autobuyers[id-1].target = id
        document.getElementById("toggleBtn" + id).textContent = "Buys singles"
    }
}

document.getElementById("toggleBtn1").onclick = function () {
    toggleAutobuyerTarget(1)
}

document.getElementById("toggleBtn2").onclick = function () {
    toggleAutobuyerTarget(2)
}

document.getElementById("toggleBtn3").onclick = function () {
    toggleAutobuyerTarget(3)
}

document.getElementById("toggleBtn4").onclick = function () {
    toggleAutobuyerTarget(4)
}

document.getElementById("toggleBtn5").onclick = function () {
    toggleAutobuyerTarget(5)
}

document.getElementById("toggleBtn6").onclick = function () {
    toggleAutobuyerTarget(6)
}

document.getElementById("toggleBtn7").onclick = function () {
    toggleAutobuyerTarget(7)
}

document.getElementById("toggleBtn8").onclick = function () {
    toggleAutobuyerTarget(8)
}

document.getElementById("toggleBtnTickSpeed").onclick = function () {
    if (player.autobuyers[8].target == 1) {
        player.autobuyers[8].target = 10
        document.getElementById("toggleBtnTickSpeed").textContent = "Buys max"
    } else {
        player.autobuyers[8].target = 1
        document.getElementById("toggleBtnTickSpeed").textContent = "Buys singles"
    }
}

document.getElementById("exportbtn").onclick = function () {
    let output = document.getElementById('exportOutput');
    let parent = output.parentElement;

    parent.style.display = "";
    output.value = btoa(JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; }));

    output.onblur = function() {
        parent.style.display = "none";
    }

    output.focus();
    output.select();

    try {
        if (document.execCommand('copy')) {
            $.notify("exported to clipboard", "info");
            output.blur();
        }
    } catch(ex) {
        // well, we tried.
    }
};


document.getElementById("save").onclick = function () {
    saved++
    if (saved > 99) giveAchievement("Just in case")
    save_game();
};

document.getElementById("load").onclick = function () {
    closeToolTip();
	for (var i = 0; i < 3; i++) {
		var _break = player.break;
        player.break = true;
        if (currentSave === i) document.querySelector("#save" + (i + 1) + " .save_antimatter").textContent = "Antimatter: " + shortenMoney(player.money);
        else document.querySelector("#save" + (i + 1) + " .save_antimatter").textContent = "Antimatter: " + shortenMoney(saves[i] ? new Decimal(saves[i].money) : 10);
		player.break = _break;
	}

	document.querySelectorAll(".save_selected").forEach(function(el) {
		el.style.display = "none";
	});

	document.querySelector("#save" + (currentSave + 1) + " .save_selected").style.display = "inline";

    document.getElementById("loadmenu").style.display = "flex";
};

document.getElementById("animationoptionsbtn").onclick = function () {
    closeToolTip();
    document.getElementById("animationoptions").style.display = "flex";
};

document.getElementById("confirmationoptionsbtn").onclick = function () {
    closeToolTip();
    document.getElementById("confirmationoptions").style.display = "flex";
};

function verify_save(obj) {
    if (typeof obj != 'object') return false;


    return true;
}

document.getElementById("importbtn").onclick = function () {
    var save_data = prompt("Input your save. (if you import a valid save, your current save file will be overwritten!)");
    if (save_data.constructor !== String) save_data = "";
    if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "80b7fdc794f5dfc944da6a445a3f21a2d0f7c974d044f2ea25713037e96af9e3") {
        document.getElementById("body").style.animation = "barrelRoll 5s 1";
        giveAchievement("Do a barrel roll!")
        setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 5000)
    }
    if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274") giveAchievement("So do I");
    if (sha512_256(save_data.toUpperCase()) === "ef853879b60fa6755d9599fd756c94d112f987c0cd596abf48b08f33af5ff537") {
        player.options.theme = "S1";
        player.options.secretThemeKey = save_data[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "078570d37e6ffbf06e079e07c3c7987814e03436d00a17230ef5f24b1cb93290") {
        player.options.theme = "S2";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "a3d64c3d1e1749b60b2b3dba10ed5ae9425300e9600ca05bcbafe4df6c69941f") {
        player.options.theme = "S3";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "d910565e1664748188b313768c370649230ca348cb6330fe9df73bcfa68d974d") {
        player.options.theme = "S4";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "cb72e4a679254df5f99110dc7a93924628b916d2e069e3ad206db92068cb0883") {
        player.options.theme = "S5";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "c8fac64da08d674123c32c936b14115ab384fe556fd24e431eb184a8dde21137") {
        player.options.theme = "S6";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else if (sha512_256(save_data.toUpperCase()) === "da3b3c152083f0c70245f104f06331497b97b52ac80edec05e26a33ee704cae7") {
        player.options.theme = "S7";
        player.options.secretThemeKey = save_data.toLowerCase()[0].toUpperCase()+save_data.substr(1).toLowerCase()
        setTheme(player.options.theme);
    } else {
        save_data = JSON.parse(atob(save_data), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
        if(verify_save(save_data)) forceHardReset = true
        if(verify_save(save_data)) document.getElementById("reset").click();
        forceHardReset = false
        if (!save_data || !verify_save(save_data)) {
            alert('could not load the save..');
            load_custom_game();
            return;
		}
        saved = 0;
        totalMult = 1
        currentMult = 1
        infinitiedMult = 1
        achievementMult = 1
        challengeMult = 1
        unspentBonus = 1
        infDimPow = 1
        postc8Mult = new Decimal(0)
        mult18 = new Decimal(1)
        ec10bonus = new Decimal(1)
        player = save_data;
        save_game();
        load_game();
        updateChallenges()
        transformSaveToDecimal()
    }
};




document.getElementById("reset").onclick = function () {
    if (forceHardReset) {
        if (window.location.href.split("//")[1].length > 20) set_save('dimensionTestSave', currentSave, defaultStart);
        else set_save('dimensionSave', currentSave, defaultStart);
        player = defaultStart
        infDimPow = 1;
        save_game();
        load_game();
        updateCosts();

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
        showDimTab('antimatterdimensions')
        updateTickSpeed();
        updateDimensions();
        updateChallenges();
        updateAutobuyers();
    } else if (confirm("Do you really want to erase all your progress?")) {
        if (window.location.href.split("//")[1].length > 20) set_save('dimensionTestSave', currentSave, defaultStart);
        else set_save('dimensionSave', currentSave, defaultStart);
        player = defaultStart
        infDimPow = 1;
        save_game();
        load_game();
        updateCosts();

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
        showDimTab('antimatterdimensions')
        updateTickSpeed();
        updateDimensions();
        updateChallenges();
        updateAutobuyers();
    }
};


function breakInfinity() {
    if (player.autobuyers[11]%1 === 0 || player.autobuyers[11].interval>100) return false
    if (player.break && !player.currentChallenge.includes("post")) {
        player.break = false
        if (player.dilation.active) giveAchievement("Time fixes everything")
        document.getElementById("break").textContent = "BREAK INFINITY"
    } else {
        player.break = true
        document.getElementById("break").textContent = "FIX INFINITY"
        giveAchievement("Limit Break")
    }
}

function gainedInfinityPoints() {
    let div = 308;
    if (player.timestudy.studies.includes(111)) div = 285;
    else if (isAchEnabled("r103")) div = 307.8;

    if(player.break) var ret = Decimal.pow(10, player.money.e/div -0.75).times(player.infMult).times(kongIPMult)
    else var ret = new Decimal(308/div).times(player.infMult).times(kongIPMult)
    if (player.timestudy.studies.includes(41)) ret = ret.times(Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies))
    if (player.timestudy.studies.includes(51)) ret = ret.times(1e15)
    if (player.timestudy.studies.includes(141)) ret = ret.times(new Decimal(1e45).dividedBy(Decimal.pow(15, Math.log(player.thisInfinityTime/100+1)*Math.pow(player.thisInfinityTime/100+1, 0.125))).max(1))
    if (player.timestudy.studies.includes(142)) ret = ret.times(1e25)
    if (player.timestudy.studies.includes(143)) ret = ret.times(Decimal.pow(15, Math.log(player.thisInfinityTime/100+1)*Math.pow(player.thisInfinityTime/100+1, 0.125)))
    if (isAchEnabled("r85")) ret = ret.times(4);
    if (isAchEnabled("r93")) ret = ret.times(4);
    if (isAchEnabled("r116")) ret = ret.times(Decimal.pow(2, Math.log10(getInfinitied()+1)))
    if (isAchEnabled("r125")) ret = ret.times(Decimal.pow(2, Math.log(player.thisInfinityTime/100+1)*Math.pow(player.thisInfinityTime/100+1, 0.11)))
    if (player.dilation.upgrades.includes(7)) ret = ret.times(player.dilation.dilatedTime.pow(1000))
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "infinity" && glyph.effects.ipgain !== undefined) ret = ret.times(glyph.effects.ipgain)
    }
    return ret.floor()
}

function gainedEternityPoints() {
    var ret = Decimal.pow(5, player.infinityPoints.plus(gainedInfinityPoints()).e/308 -0.7).times(player.epmult).times(kongEPMult)
    if (player.timestudy.studies.includes(61)) ret = ret.times(10)
    if (player.timestudy.studies.includes(121)) ret = ret.times(((253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5)) //x300 if tryhard, ~x60 if not
    else if (player.timestudy.studies.includes(122)) ret = ret.times(35)
    else if (player.timestudy.studies.includes(123)) ret = ret.times(Math.sqrt(1.39*player.thisEternity/1000))
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "time" && glyph.effects.eternity !== undefined) ret = ret.times(glyph.effects.eternity)
    }

    return ret.floor()
}

function gainedRealityMachines() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)

    return Decimal.floor(ret)
}

function percentToNextRealityMachine() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)
    return ((ret - Math.floor(ret)) * 100).toFixed(1);
}

function gainedGlyphLevel() {
    var replPow = 0.4
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "replication" && glyph.effects.glyphlevel !== undefined) replPow += glyph.effects.glyphlevel
    }
    var ret = Math.round(Math.pow(player.eternityPoints.e, 0.5) * Math.pow(player.replicanti.amount.e, replPow) * Math.pow(player.dilation.dilatedTime.log10(), 1.3) / 100000)
    if (ret == Infinity || isNaN(ret)) return 0
    return ret
}

function percentToNextGlyphLevel() {
    var replPow = 0.4
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "replication" && glyph.effects.glyphlevel !== undefined) replPow += glyph.effects.glyphlevel
    }
    var ret = Math.pow(player.eternityPoints.e, 0.5) * Math.pow(player.replicanti.amount.e, replPow) * Math.pow(player.dilation.dilatedTime.log10(), 1.3) / 100000
    var retOffset = 0;
    if (Math.round(ret) > ret) {
        retOffset = 0.5;
    } else {
        retOffset = -0.5;
    }
    if (ret == Infinity || isNaN(ret)) return 0
    return ((ret - Math.floor(ret)-retOffset) * 100).toFixed(1)
}


function setAchieveTooltip() {
    var apocAchieve = document.getElementById("Antimatter Apocalypse");
    var noPointAchieve = document.getElementById("There's no point in doing that");
    var sanic = document.getElementById("Supersanic")
    var forgotAchieve = document.getElementById("I forgot to nerf that")
    var potato = document.getElementById("Faster than a potato")
    let potato2 = document.getElementById("Faster than a squared potato")
    let potato3 = document.getElementById("Faster than a potato^286078")
    var dimensional = document.getElementById("Multidimensional")
    var IPBelongs = document.getElementById("All your IP are belong to us")
    var reference = document.getElementById("Yet another infinity reference")
    let blink = document.getElementById("Blink of an eye")
    let exist = document.getElementById("This achievement doesn't exist")
    let exist2 = document.getElementById("This achievement doesn't exist II")
    let spare = document.getElementById("I got a few to spare")
    let speed = document.getElementById("Ludicrous Speed")
    let speed2 = document.getElementById("I brake for nobody")
    let overdrive = document.getElementById("MAXIMUM OVERDRIVE")
    let minute = document.getElementById("Minute of infinity")
    let infiniteIP = document.getElementById("Can you get infinite IP?")
    let over9000 = document.getElementById("IT'S OVER 9000")
    let dawg = document.getElementById("Yo dawg, I heard you liked infinities...")
    let eatass = document.getElementById("Like feasting on a behind")
    let layer = document.getElementById("But I wanted another prestige layer...")
    let fkoff = document.getElementById("What do I have to do to get rid of you")
    let minaj = document.getElementById("Popular music")
    let infstuff = document.getElementById("I never liked this infinity stuff anyway")
    let when = document.getElementById("When will it be enough?")
    let thinking = document.getElementById("Now you're thinking with dilation!")
    let thisis = document.getElementById("This is what I have to do to get rid of you.")

    apocAchieve.setAttribute('ach-tooltip', "Get over " + formatValue(player.options.notation, 1e80, 0, 0) + " antimatter.");
    noPointAchieve.setAttribute('ach-tooltip', "Buy a single First Dimension when you have over " + formatValue(player.options.notation, 1e150, 0, 0) + " of them. Reward: First Dimensions are 10% stronger.");
    forgotAchieve.setAttribute('ach-tooltip', "Get any Dimension multiplier over " + formatValue(player.options.notation, 1e31, 0, 0)) + ". Reward: First Dimensions are 5% stronger.";
    sanic.setAttribute('ach-tooltip', "Have antimatter/sec exceed your current antimatter above " + formatValue(player.options.notation, 1e63, 0, 0));
    potato.setAttribute('ach-tooltip', "Get more than " + formatValue(player.options.notation, 1e29, 0, 0) + " ticks per second. Reward: Reduces starting tick interval by 2%.");
    potato2.setAttribute('ach-tooltip', "Get more than " + formatValue(player.options.notation, 1e58, 0, 0) + " ticks per second. Reward: Reduces starting tick interval by 2%.");
    potato3.setAttribute('ach-tooltip', "Get more than "+shortenCosts(new Decimal("1e8296262"))+" ticks per second.")
    dimensional.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 1e12, 0, 0) + " of all dimensions except 8th.");
    IPBelongs.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e150)+" IP. Reward: Additional 4x multiplier to IP.")
    reference.setAttribute('ach-tooltip', "Get a x"+shortenDimensions(Number.MAX_VALUE)+" multiplier in a single sacrifice. Reward: Sacrifices are stronger.")
    blink.setAttribute('ach-tooltip', "Get to Infinity in under 200 milliseconds. Reward: Start with " + formatValue(player.options.notation, 1e25, 0, 0) + " antimatter and all dimensions are stronger in first 300ms of Infinity.");
    spare.setAttribute('ach-tooltip', "Reach " +formatValue(player.options.notation, new Decimal("1e35000"), 0, 0)+" antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.");
    //exist.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 9.9999e9999, 0, 0) + " antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have."); (i like the 9 9s thing and no one will see it with a formatted value)
    //exist2.setAttribute('ach-tooltip', "Reach " + formatValue(player.options.notation, 1e35000, 0, 0) + " antimatter. Reward: Dimensions are more powerful the more unspent antimatter you have.")
    speed.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e200)+" IP in 2 seconds or less. Reward: All dimensions are significantly stronger in first 5 seconds of infinity.")
    speed2.setAttribute('ach-tooltip', "Big Crunch for "+shortenCosts(1e250)+" IP in 20 seconds or less. Reward: All dimensions are significantly stronger in first 60 seconds of infinity.")
    overdrive.setAttribute('ach-tooltip', "Big Crunch with " + shortenCosts(1e300) + " IP/min. Reward: Additional 4x multiplier to IP.")
    minute.setAttribute('ach-tooltip', "Reach " + shortenCosts(1e260) + " infinity power. Reward: Double infinity power gain.")
    infiniteIP.setAttribute('ach-tooltip', "Reach "+shortenCosts(new Decimal("1e30008"))+" IP.")
    over9000.setAttribute('ach-tooltip', "Get a total sacrifice multiplier of "+shortenCosts(new Decimal("1e9000"))+". Reward: Sacrifice doesn't reset your dimensions.")
    dawg.setAttribute('ach-tooltip', "Have all your past 10 infinities be at least "+shortenMoney(Number.MAX_VALUE)+" times higher IP than the previous one. Reward: Your antimatter doesn't reset on dimboost/galaxy.")
    eatass.setAttribute('ach-tooltip', "Reach "+shortenCosts(1e100)+" IP without any infinities or first dimensions. Reward: IP multiplier based on time spent this infinity.")
    layer.setAttribute('ach-tooltip', "Reach "+shortenMoney(Number.MAX_VALUE)+" EP.")
    fkoff.setAttribute('ach-tooltip', "Reach "+shortenCosts(new Decimal("1e22000"))+" IP without any time studies. Reward: Time dimensions are multiplied by the number of studies you have.")
    minaj.setAttribute('ach-tooltip', "Have 180 times more Replicanti Galaxies than Antimatter Galaxies. Reward: Replicanti galaxies divide your replicanti by "+shortenMoney(Number.MAX_VALUE)+" instead of resetting them to 1.")
    infstuff.setAttribute('ach-tooltip', "Reach "+shortenCosts(new Decimal("1e200000"))+" IP without buying IDs or IP multipliers. Reward: You start eternities with all Infinity Challenges unlocked and completed.")
    when.setAttribute('ach-tooltip', "Reach "+shortenCosts( new Decimal("1e20000"))+" replicanti. Reward: You gain replicanti 2 times faster under "+shortenMoney(Number.MAX_VALUE)+" replicanti.")
    thinking.setAttribute('ach-tooltip', "Eternity for "+shortenCosts( new Decimal("1e600"))+" EP in 1 minute or less while dilated.")
    thisis.setAttribute('ach-tooltip', "Reach "+shortenCosts(new Decimal('1e28000'))+" IP without any time studies while dilated. Reward: The active time study path doesn't disable your replicanti autobuyer.")
}

document.getElementById("notation").onclick = function () {
    player.options.scientific = !player.options.scientific;
    if (player.options.notation === "Infinity") {
        player.options.notation = "Scientific";
        document.getElementById("notation").textContent = ("Notation: Scientific")
    } else if (player.options.notation === "Scientific") {
        player.options.notation = "Engineering";
        document.getElementById("notation").textContent = ("Notation: Engineering")
    } else if (player.options.notation === "Engineering") {
        player.options.notation = "Letters";
        document.getElementById("notation").textContent = ("Notation: Letters")
    } else if (player.options.notation === "Letters") {
        player.options.notation = "Standard";
        document.getElementById("notation").textContent = ("Notation: Standard")
    } else if (player.options.notation === "Standard") {
        player.options.notation = "Cancer";
        document.getElementById("notation").textContent = ("Notation: Cancer")
    } else if (player.options.notation === "Cancer") {
        player.options.notation = "Mixed scientific";
        document.getElementById("notation").textContent = ("Notation: Mixed scientific")
    } else if (player.options.notation === "Mixed scientific") {
        player.options.notation = "Mixed engineering";
        document.getElementById("notation").textContent = ("Notation: Mixed engineering")
    } else if (player.options.notation === "Mixed engineering") {
        player.options.notation = "Logarithm";
        document.getElementById("notation").textContent = ("Notation: Logarithm")
    } else if (player.options.notation === "Logarithm") {
        player.options.notation = "Brackets";
        document.getElementById("notation").textContent = ("Notation: Brackets")
    } else if (player.options.notation === "Brackets") {
      player.options.notation = "Infinity";
      document.getElementById("notation").textContent = ("Notation: Infinity")
    }

    updateLastTenRuns();
    updateLastTenEternities();
    updateLastTenRealities();
    updateTickSpeed();
    setAchieveTooltip();
    updateCosts();
    updateDilationUpgradeCosts();
    updateAutobuyers();
    document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"
};


document.getElementById("newsbtn").onclick = function() {
  if (!player.options.newsHidden) {
    document.getElementById("game").style.display = "none";
    player.options.newsHidden = true
  } else {
    document.getElementById("game").style.display = "block";
    player.options.newsHidden = false
    scrollNextMessage()
  }
}


function resetDimensions() {
    var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];

    for (i = 1; i <= 8; i++) {
        player[tiers[i] + "Amount"] = new Decimal(0)
        player[tiers[i] + "Pow"] = new Decimal(1)
    }
    player.firstCost = new Decimal(10)
    player.secondCost = new Decimal(100)
    player.thirdCost = new Decimal(10000)
    player.fourthCost = new Decimal(1e6)
    player.fifthCost = new Decimal(1e9)
    player.sixthCost = new Decimal(1e13)
    player.seventhCost = new Decimal(1e18)
    player.eightCost = new Decimal(1e24)
    player.eightPow = new Decimal(player.chall11Pow)
}

function calcSacrificeBoost() {
    if (player.firstAmount == 0) return new Decimal(1);
    if (player.challenges.includes("postc2")) {
        if (player.timestudy.studies.includes(228)) return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.013).max(1)
        if (isAchEnabled("r88")) return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.011).max(1)
        return player.firstAmount.dividedBy(player.sacrificed.max(1)).pow(0.01).max(1)
    }
    if (player.currentChallenge != "challenge11") {
        var sacrificePow=2;
        if (isAchEnabled("r32")) sacrificePow += 0.2;
        if (isAchEnabled("r57")) sacrificePow += 0.2; //this upgrade was too OP lol
        return Decimal.pow((player.firstAmount.e/10.0), sacrificePow).dividedBy(((Decimal.max(player.sacrificed.e, 1)).dividedBy(10.0)).pow(sacrificePow).max(1)).max(1);
    } else {
        return player.firstAmount.pow(0.05).dividedBy(player.sacrificed.pow(0.04).max(1)).max(1);
    }
}

function calcTotalSacrificeBoost() {
    if (player.sacrificed == 0) return new Decimal(1);
    if (player.challenges.includes("postc2")) {
        if (player.timestudy.studies.includes(228)) return player.sacrificed.pow(0.013).max(1)
        if (isAchEnabled("r88")) return player.sacrificed.pow(0.011).max(1)
        else return player.sacrificed.pow(0.01)
    }
    if (player.currentChallenge != "challenge11") {
        var sacrificePow=2;
        if (isAchEnabled("r32")) sacrificePow += 0.2;
        if (isAchEnabled("r57")) sacrificePow += 0.2;
        return Decimal.pow((player.sacrificed.e/10.0), sacrificePow);
    } else {
        return player.sacrificed.pow(0.05) //this is actually off but like im not sure how youd make it good. not that it matters.
    }
}


function sacrifice(auto = false) {
    if (player.eightAmount == 0) return false;
    if (player.resets < 5) return false
    if (player.currentEternityChall == "eterc3") return false
    if (player.currentChallenge == "challenge11" && (calcTotalSacrificeBoost().gte(Number.MAX_VALUE) || player.chall11Pow.gte(Number.MAX_VALUE))) return false
    if (!auto) floatText("eightD", "x" + shortenMoney(calcSacrificeBoost()))
    if (calcSacrificeBoost().gte(Number.MAX_VALUE)) giveAchievement("Yet another infinity reference");
    player.eightPow = player.eightPow.times(calcSacrificeBoost())
    player.sacrificed = player.sacrificed.plus(player.firstAmount);
    if (player.currentChallenge != "challenge11") {
        if (player.currentChallenge == "challenge7" && !isAchEnabled("r118")) clearDimensions(6);
        else if (!isAchEnabled("r118")) clearDimensions(7);
    } else {
        player.chall11Pow = player.chall11Pow.times(calcSacrificeBoost())
        if (!isAchEnabled("r118")) resetDimensions();
        player.money = new Decimal(100)

    }
    if (calcTotalSacrificeBoost() >= 600) giveAchievement("The Gods are pleased");
    if (calcTotalSacrificeBoost().gte("1e9000")) giveAchievement("IT'S OVER 9000");
}




document.getElementById("sacrifice").onclick = function () {
    if (player.resets < 5) return false
    if (!document.getElementById("confirmation").checked) {
        if (!confirm("Dimensional Sacrifice will remove all of your first to seventh dimensions (with the cost and multiplier unchanged) for a boost to the Eighth Dimension based on the total amount of first dimensions sacrificed. It will take time to regain production.")) {
            return false;
        }
    }

    auto = false;
    return sacrifice();
}


function updateAutobuyers() {
    var autoBuyerDim1 = new Autobuyer (1)
    var autoBuyerDim2 = new Autobuyer (2)
    var autoBuyerDim3 = new Autobuyer (3)
    var autoBuyerDim4 = new Autobuyer (4)
    var autoBuyerDim5 = new Autobuyer (5)
    var autoBuyerDim6 = new Autobuyer (6)
    var autoBuyerDim7 = new Autobuyer (7)
    var autoBuyerDim8 = new Autobuyer (8)
    var autoBuyerDimBoost = new Autobuyer (9)
    var autoBuyerGalaxy = new Autobuyer (document.getElementById("secondSoftReset"))
    var autoBuyerTickspeed = new Autobuyer (document.getElementById("tickSpeed"))
    var autoBuyerInf = new Autobuyer (document.getElementById("bigcrunch"))
    var autoSacrifice = new Autobuyer(13)


    autoBuyerDim1.interval = 1500
    autoBuyerDim2.interval = 2000
    autoBuyerDim3.interval = 2500
    autoBuyerDim4.interval = 3000
    autoBuyerDim5.interval = 4000
    autoBuyerDim6.interval = 5000
    autoBuyerDim7.interval = 6000
    autoBuyerDim8.interval = 7500
    autoBuyerDimBoost.interval = 8000
    autoBuyerGalaxy.interval = 150000
    autoBuyerTickspeed.interval = 5000
    autoBuyerInf.interval = 300000

    autoSacrifice.interval = 100
    autoSacrifice.priority = 5

    autoBuyerDim1.tier = 1
    autoBuyerDim2.tier = 2
    autoBuyerDim3.tier = 3
    autoBuyerDim4.tier = 4
    autoBuyerDim5.tier = 5
    autoBuyerDim6.tier = 6
    autoBuyerDim7.tier = 7
    autoBuyerDim8.tier = 8
    autoBuyerTickSpeed.tier = 9

    if (player.challenges.includes("challenge1") && player.autobuyers[0] == 1) {
        player.autobuyers[0] = autoBuyerDim1
        document.getElementById("autoBuyer1").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge2") && player.autobuyers[1] == 2) {
        player.autobuyers[1] = autoBuyerDim2
        document.getElementById("autoBuyer2").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge3") && player.autobuyers[2] == 3) {
        player.autobuyers[2] = autoBuyerDim3
        document.getElementById("autoBuyer3").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge4") && player.autobuyers[9] == 10) {
        player.autobuyers[9] = autoBuyerDimBoost
        document.getElementById("autoBuyerDimBoost").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge5") && player.autobuyers[8] == 9) {
        player.autobuyers[8] = autoBuyerTickspeed
        document.getElementById("autoBuyerTickSpeed").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge6") && player.autobuyers[4] == 5) {
        player.autobuyers[4] = autoBuyerDim5
        document.getElementById("autoBuyer5").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge7") && player.autobuyers[11] == 12) {
        player.autobuyers[11] = autoBuyerInf
        document.getElementById("autoBuyerInf").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge8") && player.autobuyers[3] == 4) {
        player.autobuyers[3] = autoBuyerDim4
        document.getElementById("autoBuyer4").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge9") && player.autobuyers[6] == 7) {
        player.autobuyers[6] = autoBuyerDim7
        document.getElementById("autoBuyer7").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge10") && player.autobuyers[5] == 6) {
        player.autobuyers[5] = autoBuyerDim6
        document.getElementById("autoBuyer6").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge11") && player.autobuyers[7] == 8) {
        player.autobuyers[7] = autoBuyerDim8
        document.getElementById("autoBuyer8").style.display = "inline-block"
    }
    if (player.challenges.includes("challenge12") && player.autobuyers[10] == 11) {
        player.autobuyers[10] = autoBuyerGalaxy
        document.getElementById("autoBuyerGalaxies").style.display = "inline-block"
    }

    if (player.challenges.includes("postc2") && player.autoSacrifice == 1) {
        player.autoSacrifice = autoSacrifice
        document.getElementById("autoBuyerSac").style.display = "inline-block"
    } else {
        document.getElementById("autoBuyerSac").style.display = "none"
    }

    if (player.eternities < 100) {
        document.getElementById("autoBuyerEter").style.display = "none"
    }

    if (player.infinityUpgrades.includes("autoBuyerUpgrade")) {
        document.getElementById("interval1").textContent = "Current interval: " + (player.autobuyers[0].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval2").textContent = "Current interval: " + (player.autobuyers[1].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval3").textContent = "Current interval: " + (player.autobuyers[2].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval4").textContent = "Current interval: " + (player.autobuyers[3].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval5").textContent = "Current interval: " + (player.autobuyers[4].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval6").textContent = "Current interval: " + (player.autobuyers[5].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval7").textContent = "Current interval: " + (player.autobuyers[6].interval/2000).toFixed(2) + " seconds"
        document.getElementById("interval8").textContent = "Current interval: " + (player.autobuyers[7].interval/2000).toFixed(2) + " seconds"
        document.getElementById("intervalTickSpeed").textContent = "Current interval: " + (player.autobuyers[8].interval/2000).toFixed(2) + " seconds"
        document.getElementById("intervalDimBoost").textContent = "Current interval: " + (player.autobuyers[9].interval/2000).toFixed(2) + " seconds"
        document.getElementById("intervalGalaxies").textContent = "Current interval: " + (player.autobuyers[10].interval/2000).toFixed(2) + " seconds"
        document.getElementById("intervalInf").textContent = "Current interval: " + (player.autobuyers[11].interval/2000).toFixed(2) + " seconds"
        document.getElementById("intervalSac").textContent = "Current interval: 0.05 seconds"
    } else {
        document.getElementById("interval1").textContent = "Current interval: " + (player.autobuyers[0].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval2").textContent = "Current interval: " + (player.autobuyers[1].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval3").textContent = "Current interval: " + (player.autobuyers[2].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval4").textContent = "Current interval: " + (player.autobuyers[3].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval5").textContent = "Current interval: " + (player.autobuyers[4].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval6").textContent = "Current interval: " + (player.autobuyers[5].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval7").textContent = "Current interval: " + (player.autobuyers[6].interval/1000).toFixed(2) + " seconds"
        document.getElementById("interval8").textContent = "Current interval: " + (player.autobuyers[7].interval/1000).toFixed(2) + " seconds"
        document.getElementById("intervalTickSpeed").textContent = "Current interval: " + (player.autobuyers[8].interval/1000).toFixed(2) + " seconds"
        document.getElementById("intervalDimBoost").textContent = "Current interval: " + (player.autobuyers[9].interval/1000).toFixed(2) + " seconds"
        document.getElementById("intervalGalaxies").textContent = "Current interval: " + (player.autobuyers[10].interval/1000).toFixed(2) + " seconds"
        document.getElementById("intervalInf").textContent = "Current interval: " + (player.autobuyers[11].interval/1000).toFixed(2) + " seconds"
        document.getElementById("intervalSac").textContent = "Current interval: 0.10 seconds"
    }

    var maxedAutobuy = 0;
    var e100autobuy = 0;
    for (let tier = 1; tier <= 8; ++tier) {
    document.getElementById("toggleBtn" + tier).style.display = "inline-block";
        if (player.autobuyers[tier-1].bulk >= 1e100) {
        player.autobuyers[tier-1].bulk = 1e100;
        document.getElementById("buyerBtn" + tier).textContent = shortenDimensions(player.autobuyers[tier-1].bulk)+"x bulk purchase";
        e100autobuy++;
        }
        else {
        if (player.autobuyers[tier-1].interval <= 100) {
            if (player.autobuyers[tier-1].bulk * 2 >= 1e100) {
                document.getElementById("buyerBtn" + tier).innerHTML = shortenDimensions(1e100)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP";
            }
            else {
                document.getElementById("buyerBtn" + tier).innerHTML = shortenDimensions(player.autobuyers[tier-1].bulk*2)+"x bulk purchase<br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP";
            }
            maxedAutobuy++;
        }
        else document.getElementById("buyerBtn" + tier).innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[tier-1].cost) + " IP"
        }
    }

    if (player.autobuyers[8].interval <= 100) {
        document.getElementById("buyerBtnTickSpeed").style.display = "none"
        document.getElementById("toggleBtnTickSpeed").style.display = "inline-block"
        maxedAutobuy++;
    }
    if (player.autobuyers[9].interval <= 100) {
        document.getElementById("buyerBtnDimBoost").style.display = "none"
        maxedAutobuy++;
    }
    if (player.autobuyers[10].interval <= 100) {
        document.getElementById("buyerBtnGalaxies").style.display = "none"
        maxedAutobuy++;
    }
    if (player.autobuyers[11].interval <= 100) {
        document.getElementById("buyerBtnInf").style.display = "none"
        maxedAutobuy++;
    }

    if (maxedAutobuy >= 9) giveAchievement("Age of Automation");
    if (maxedAutobuy >= 12) giveAchievement("Definitely not worth it");
    if (e100autobuy >= 8) giveAchievement("Professional bodybuilder");

    document.getElementById("buyerBtnTickSpeed").innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[8].cost) + " IP"
    document.getElementById("buyerBtnDimBoost").innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[9].cost) + " IP"
    document.getElementById("buyerBtnGalaxies").innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[10].cost) + " IP"
    document.getElementById("buyerBtnInf").innerHTML = "40% smaller interval <br>Cost: " + shortenDimensions(player.autobuyers[11].cost) + " IP"


    for (var i=0; i<8; i++) {
        if (player.autobuyers[i]%1 !== 0) document.getElementById("autoBuyer"+(i+1)).style.display = "inline-block"
    }
    if (player.autobuyers[8]%1 !== 0) document.getElementById("autoBuyerTickSpeed").style.display = "inline-block"
    if (player.autobuyers[9]%1 !== 0) document.getElementById("autoBuyerDimBoost").style.display = "inline-block"
    if (player.autobuyers[10]%1 !== 0) document.getElementById("autoBuyerGalaxies").style.display = "inline-block"
    if (player.autobuyers[11]%1 !== 0) document.getElementById("autoBuyerInf").style.display = "inline-block"
    if (player.autoSacrifice%1 !== 0) document.getElementById("autoBuyerSac").style.display = "inline-block"

    for (var i=1; i<=12; i++) {
        player.autobuyers[i-1].isOn = document.getElementById(i + "ison").checked;
    }

    player.autoSacrifice.isOn = document.getElementById("13ison").checked
    player.eternityBuyer.isOn = document.getElementById("eternityison").checked
    priorityOrder()
}


/*function loadAutoBuyers() {
    for (var i=0; i<12; i++) {
        if (player.autobuyers[i]%1 !== 0 ) {
            switch(i) {
                case 8: player.autobuyers[i].target = "buyTickSpeed()";
                case 9: player.autobuyers[i].target = "document.getElementById('softReset').click";
                case 10: player.autobuyers[i].target = "document.getElementById('secondSoftReset').click";
                case 11: player.autobuyers[i].target = "document.getElementById('bigcrunch').click";
                default: player.autobuyers[i].target = "buyOneDimension(" + i+1 + ")";
            }
        }
    }

}*/


function autoBuyerArray() {
    var tempArray = []
    for (var i=0; i<player.autobuyers.length && i<9; i++) {
        if (player.autobuyers[i]%1 !== 0 ) {
            tempArray.push(player.autobuyers[i])
        }
    }
    return tempArray;
}


var priority = []


function priorityOrder() {
    var tempArray = []
    var i = 1;
    while(tempArray.length != autoBuyerArray().length) {

        for (var x=0 ; x< autoBuyerArray().length; x++) {
            if (autoBuyerArray()[x].priority == i) tempArray.push(autoBuyerArray()[x])
        }
        i++;
    }
    priority = tempArray;
}

function fromValue(value) {
  value = value.replace(/,/g, '')
  if (value.toUpperCase().split("E").length > 2 && value.split(" ")[0] !== value) {
      var temp = new Decimal(0)
      temp.mantissa = parseFloat(value.toUpperCase().split("E")[0])
      temp.exponent = parseFloat(value.toUpperCase().split("E")[1]+"e"+value.toUpperCase().split("E")[2])
      value = temp.toString()
  }
  if (value.includes(" ")) {
    const prefixes = [['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
    ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
    ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
    const prefixes2 = ['', 'MI', 'MC', 'NA', 'PC', 'FM', ' ']
    let e = 0;
    let m,k,l;
    if (value.split(" ")[1].length < 5) {
        for (l=101;l>0;l--) {
            if (value.includes(FormatList[l])) {
                e += l*3
                console.log("caught!"+l)

                break
            }
        }
        return Decimal.fromMantissaExponent(parseInt(value.split(" ")[0]), e)
    }
    for (let i=1;i<5;i++) {
        if (value.includes(prefixes2[i])) {
            m = value.split(prefixes2[i])[1]
            for (k=0;k<3;k++) {
                for (l=1;l<10;l++) {
                    if (m.includes(prefixes[k][l])) break;
                }
                if (l != 10) e += Math.pow(10,k)*l;
            }
            break;
        }
        return Decimal.fromMantissaExponent(value.split, e*3)
    }
    for (let i=1;i<=5;i++) {
        if (value.includes(prefixes2[i])) {
            for (let j=1;j+i<6;j++) {
                if (value.includes(prefixes2[i+j])) {
                    m=value.split(prefixes2[i+j])[1].split(prefixes2[i])[0]
                    if (m == "") e += Math.pow(1000,i);
                    else {
                        for (k=0;k<3;k++) {
                            for (l=1;l<10;l++) {
                                if (m.includes(prefixes[k][l])) break;
                            }
                            if (l != 10) e += Math.pow(10,k+i*3)*l;
                        }
                    }
                    break;
                }
            }
        }
    }
    return Decimal.fromMantissaExponent(parseFloat(value), i*3+3)
    //return parseFloat(value) + "e" + (e*3+3)
  }
  if (!isFinite(parseFloat(value[value.length-1]))) { //needs testing
    const l = " abcdefghijklmnopqrstuvwxyz"
    const v = value.replace(parseFloat(value),"")
    let e = 0;
    for (let i=0;i<v.length;i++) {
        for (let j=1;j<27;j++) {
            if (v[i] == l[j]) e += Math.pow(26,v.length-i-1)*j
        }
    }
    return Decimal.fromMantissaExponent(parseFloat(value), e*3)
    //return parseFloat(value) + "e" + (e*3)
  }
  value = value.replace(',','')
  if (value.split("e")[0] === "") return Decimal.fromMantissaExponent(Math.pow(10,parseFloat(value.split("e")[1])%1), parseInt(value.split("e")[1]))
  return Decimal.fromString(value)
}

function updatePriorities() {
    auto = false;
    for (var x=0 ; x < autoBuyerArray().length; x++) {
        if (x < 9) autoBuyerArray()[x].priority = parseInt(document.getElementById("priority" + (x+1)).value)
    }
    if (parseInt(document.getElementById("priority10").value) === 69
    || parseInt(document.getElementById("priority11").value) === 69
    || parseInt(fromValue(document.getElementById("priority12").value).toString()) === 69
    || parseInt(document.getElementById("bulkDimboost").value) === 69
    || parseInt(document.getElementById("overGalaxies").value) === 69
    || parseInt(fromValue(document.getElementById("prioritySac").value).toString()) === 69
    || parseInt(document.getElementById("bulkgalaxy").value) === 69
    || parseInt(fromValue(document.getElementById("priority13").value).toString()) === 69) giveAchievement("Nice.");
    player.autobuyers[9].priority = parseInt(document.getElementById("priority10").value)
    player.autobuyers[10].priority = parseInt(document.getElementById("priority11").value)
    player.autobuyers[11].priority = fromValue(document.getElementById("priority12").value)
    if (player.eternities < 10) {
        var bulk = Math.floor(Math.max(parseFloat(document.getElementById("bulkDimboost").value), 1))
    } else {
        var bulk = Math.max(parseFloat(document.getElementById("bulkDimboost").value), 0.05)
    }
    player.autobuyers[9].bulk = (isNaN(bulk)) ? 1 : bulk
    player.overXGalaxies = parseInt(document.getElementById("overGalaxies").value)
    player.autoSacrifice.priority = fromValue(document.getElementById("prioritySac").value)
    if (isNaN(player.autoSacrifice.priority) || player.autoSacrifice.priority === null || player.autoSacrifice.priority === undefined || player.autoSacrifice.priority <= 1) player.autoSacrifice.priority = Decimal.fromNumber(1.01)
    player.autobuyers[10].bulk = parseFloat(document.getElementById("bulkgalaxy").value)
    const eterValue = fromValue(document.getElementById("priority13").value)
    if (!isNaN(eterValue)) player.eternityBuyer.limit = eterValue

    priorityOrder()
}

function updateCheckBoxes() {
    for (var i = 0; i < 12; i++) {
        if (player.autobuyers[i]%1 !== 0) {
            if (player.autobuyers[i].isOn) document.getElementById((i+1) + "ison").checked = "true";
            else document.getElementById((i+1) + "ison").checked = ""
        }
    }
    if (player.autoSacrifice.isOn) document.getElementById("13ison").checked = "true"
    else document.getElementById("13ison").checked = ""
    document.getElementById("eternityison").checked = player.eternityBuyer.isOn

}


function toggleAutoBuyers() {
    var bool = player.autobuyers[0].isOn
    for (var i = 0; i<12; i++) {
        if (player.autobuyers[i]%1 !== 0) {
            player.autobuyers[i].isOn = !bool
        }
    }
    player.autoSacrifice.isOn = !bool
    player.eternityBuyer.isOn = !bool
    updateCheckBoxes()
    updateAutobuyers()
}

function toggleBulk() {

    if (player.options.bulkOn) {
        player.options.bulkOn = false
        document.getElementById("togglebulk").textContent = "Enable bulk buy"
    } else {
        player.options.bulkOn = true
        document.getElementById("togglebulk").textContent = "Disable bulk buy"
    }
}

function toggleHotkeys() {
    if (player.options.hotkeys) {
        player.options.hotkeys = false
        document.getElementById("hotkeys").textContent = "Enable hotkeys"
    } else {
        player.options.hotkeys = true
        document.getElementById("hotkeys").textContent = "Disable hotkeys"
    }
}








function updateChallengeTimes() {
document.getElementById("challengetime2").textContent = "Challenge  " + 2 + " time record: " + timeDisplayShort(player.challengeTimes[0])
    document.getElementById("challengetime3").textContent = "Challenge  " + 3 + " time record: " + timeDisplayShort(player.challengeTimes[1])
    document.getElementById("challengetime4").textContent = "Challenge  " + 4 + " time record: " + timeDisplayShort(player.challengeTimes[6])
    document.getElementById("challengetime5").textContent = "Challenge  " + 5 + " time record: " + timeDisplayShort(player.challengeTimes[4])
    document.getElementById("challengetime6").textContent = "Challenge  " + 6 + " time record: " + timeDisplayShort(player.challengeTimes[8])
    document.getElementById("challengetime7").textContent = "Challenge  " + 7 + " time record: " + timeDisplayShort(player.challengeTimes[7])
    document.getElementById("challengetime8").textContent = "Challenge  " + 8 + " time record: " + timeDisplayShort(player.challengeTimes[9])
    document.getElementById("challengetime9").textContent = "Challenge  " + 9 + " time record: " + timeDisplayShort(player.challengeTimes[3])
    document.getElementById("challengetime10").textContent = "Challenge " + 10 + " time record: " + timeDisplayShort(player.challengeTimes[2])
    document.getElementById("challengetime11").textContent = "Challenge " + 11 + " time record: " + timeDisplayShort(player.challengeTimes[10])
    document.getElementById("challengetime12").textContent = "Challenge " + 12 + " time record: " + timeDisplayShort(player.challengeTimes[5])
	var temp = 0
	for (var i=0; i<11; i++) {
		temp += player.challengeTimes[i]
	}
	document.getElementById("challengetimesum").textContent = "Sum of challenge time records is " + timeDisplayShort(temp)

	temp = 0
    for (var i=0; i<8; i++) {
        document.getElementById("infchallengetime"+(i+1)).textContent = "Infinity Challenge " + (i+1) + " time record: " + timeDisplayShort(player.infchallengeTimes[i])
		temp += player.infchallengeTimes[i]
    }
	document.getElementById("infchallengetimesum").textContent = "Sum of infinity challenge time records is " + timeDisplayShort(temp)
    updateWorstChallengeTime();
}

var bestRunIppm = new Decimal(0)
function updateLastTenRuns() {
    let tempBest = 0
    var tempTime = new Decimal(0)
    var tempIP = new Decimal(0)
    for (var i=0; i<10;i++) {
        tempTime = tempTime.plus(player.lastTenRuns[i][0])
        tempIP = tempIP.plus(player.lastTenRuns[i][1])
    }
    tempTime = tempTime.dividedBy(10)
    tempIP = tempIP.dividedBy(10)
    for (var i=0; i<10; i++) {
        var ippm = player.lastTenRuns[i][1].dividedBy(player.lastTenRuns[i][0]/60000)
        if (ippm.gt(tempBest)) tempBest = ippm
        var tempstring = shorten(ippm) + " IP/min"
        if (ippm<1) tempstring = shorten(ippm*60) + " IP/hour"
        if (i === 0) document.getElementById("run"+(i+1)).textContent = "The infinity "+(i+1)+" infinity ago took " + timeDisplayShort(player.lastTenRuns[i][0]) + " and gave " + shortenDimensions(player.lastTenRuns[i][1]) +" IP. "+ tempstring
        else document.getElementById("run"+(i+1)).textContent = "The infinity "+(i+1)+" infinities ago took " + timeDisplayShort(player.lastTenRuns[i][0]) + " and gave " + shortenDimensions(player.lastTenRuns[i][1]) +" IP. "+ tempstring
    }

    var ippm = tempIP.dividedBy(tempTime/60000)
    var tempstring = shorten(ippm) + " IP/min"
    if (ippm<1) tempstring = shorten(ippm*60) + " IP/hour"
    document.getElementById("averagerun").textContent = "Last 10 infinities average time: "+ timeDisplayShort(tempTime)+" Average IP gain: "+shortenDimensions(tempIP)+" IP. "+tempstring

    if (tempBest.gte(1e8)) giveAchievement("Oh hey, you're still here");
    if (tempBest.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");

    bestRunIppm = tempBest
}

var averageEp = new Decimal(0)
function updateLastTenEternities() {
    let tempBest = 0
    var tempTime = new Decimal(0)
    var tempEP = new Decimal(0)
    for (var i=0; i<10;i++) {
        tempTime = tempTime.plus(player.lastTenEternities[i][0])
        tempEP = tempEP.plus(player.lastTenEternities[i][1])
    }
    tempTime = tempTime.dividedBy(10)
    tempEP = tempEP.dividedBy(10)
    for (var i=0; i<10; i++) {
        var eppm = player.lastTenEternities[i][1].dividedBy(player.lastTenEternities[i][0]/60000)
        if (eppm.gt(tempBest)) tempBest = eppm
        var tempstring = shorten(eppm) + " EP/min"
        if (eppm<1) tempstring = shorten(eppm*60) + " EP/hour"
        if (i === 0) document.getElementById("eternityrun"+(i+1)).textContent = "The Eternity "+(i+1)+" eternity ago took " + timeDisplayShort(player.lastTenEternities[i][0]) + " and gave " + shortenDimensions(player.lastTenEternities[i][1]) +" EP. "+ tempstring
        else document.getElementById("eternityrun"+(i+1)).textContent = "The Eternity "+(i+1)+" eternities ago took " + timeDisplayShort(player.lastTenEternities[i][0]) + " and gave " + shortenDimensions(player.lastTenEternities[i][1]) +" EP. "+ tempstring
    }

    var eppm = tempEP.dividedBy(tempTime/60000)
    var tempstring = shorten(eppm) + " EP/min"
    averageEp = tempEP
    if (eppm<1) tempstring = shorten(eppm*60) + " EP/hour"
    document.getElementById("averageEternityRun").textContent = "Last 10 eternities average time: "+ timeDisplayShort(tempTime)+" Average EP gain: "+shortenDimensions(tempEP)+" EP. "+tempstring
}

function addEternityTime(time, ep) {
    for (var i=player.lastTenEternities.length-1; i>0; i--) {
        player.lastTenEternities[i] = player.lastTenEternities[i-1]
    }
    player.lastTenEternities[0] = [time, ep]
}

var averageRm = new Decimal(0)
function updateLastTenRealities() {
    let tempBest = 0
    var tempTime = new Decimal(0)
    var tempRM = new Decimal(0)
    for (var i=0; i<10;i++) {
        tempTime = tempTime.plus(player.lastTenRealities[i][0])
        tempRM = tempRM.plus(player.lastTenRealities[i][1])
    }
    tempTime = tempTime.dividedBy(10)
    tempRM = tempRM.dividedBy(10)
    for (var i=0; i<10; i++) {
        var rmpm = player.lastTenRealities[i][1].dividedBy(player.lastTenRealities[i][0]/60000)
        if (rmpm.gt(tempBest)) tempBest = rmpm
        var tempstring = shorten(rmpm) + " RM/min"
        if (rmpm<1) tempstring = shorten(rmpm*60) + " RM/hour"
        if (i === 0) document.getElementById("realityrun"+(i+1)).textContent = "The Reality "+(i+1)+" reality ago took " + timeDisplayShort(player.lastTenRealities[i][0]) + " and gave " + shortenDimensions(player.lastTenRealities[i][1])+((player.lastTenRealities[i][1].eq(1)) ? " reality machine and a level " : " reality machines and a level ")+player.lastTenRealities[i][2]+" glyph. "+ tempstring
        else document.getElementById("realityrun"+(i+1)).textContent = "The Reality "+(i+1)+" realities ago took " + timeDisplayShort(player.lastTenRealities[i][0]) + " and gave " + shortenDimensions(player.lastTenRealities[i][1])+((player.lastTenRealities[i][1].eq(1)) ? " reality machine and a level " : " reality machines and a level ")+player.lastTenRealities[i][2]+" glyph. "+ tempstring
    }

    var rmpm = tempRM.dividedBy(tempTime/60000)
    var tempstring = shorten(rmpm) + " RM/min"
    averageRm = tempRM
    if (rmpm<1) tempstring = shorten(rmpm*60) + " RM/hour"
    document.getElementById("averageRealityRun").textContent = "Last 10 realities average time: "+ timeDisplayShort(tempTime)+" Average EP gain: "+shortenDimensions(tempRM)+" reality machines. "+tempstring
}

function addRealityTime(time, rm, level) {
    for (var i=player.lastTenRealities.length-1; i>0; i--) {
        player.lastTenRealities[i] = player.lastTenRealities[i-1]
    }
    player.lastTenRealities[0] = [time, rm, level]
}


document.getElementById("postInfinityButton").onclick = function() {document.getElementById("bigcrunch").click()}

function addTime(time, ip) {
    for (var i=player.lastTenRuns.length-1; i>0; i--) {
        player.lastTenRuns[i] = player.lastTenRuns[i-1]
    }
    player.lastTenRuns[0] = [time, ip]
}

var infchallengeTimes = 999999999

function checkForEndMe() {
    var temp = 0
    for (var i=0; i<11; i++) {
        temp += player.challengeTimes[i]
    }
    if (temp <= 180000) giveAchievement("Not-so-challenging")
    if (temp <= 5000) giveAchievement("End me")
    var temp2 = 0
    for (var i=0; i<8;i++) {
        temp2 += player.infchallengeTimes[i]
    }
    infchallengeTimes = temp2
    if (temp2 <= 6666) giveAchievement("Yes. This is hell.")
}

function checkForRUPG8() {
    if ( player.thisReality < 600 * 24 * DAYS_FOR_ALL_ACHS * 60 * Math.pow(0.9, Math.max(player.realities-1, 0)) ) return false

    for (var row = 1; row <= 13; row++) {
        for (var col = 1; col <= 8; col++) {
            if (!player.achievements.includes(row*10 + col)) return false
        }
    }

    return true
}


document.getElementById("bigcrunch").onclick = function () {
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
            try {
                kongregate.stats.submit('Challenge 9 time record (ms)', Math.floor(player.thisInfinityTime));

            } catch (err) {console.log("Couldn't load Kongregate API")}
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
        let infGain = 1;
        if (player.thisInfinityTime > 5000 && isAchEnabled("r87")) infGain = 250;
        if (player.timestudy.studies.includes(32)) infGain *= Math.max(player.resets,1);
        if (player.reality.upg.includes(5)) infGain *= 5
        for (i in player.reality.glyphs.active) {
          var glyph = player.reality.glyphs.active[i]
          if (glyph.type == "infinity" && glyph.effects.infmult !== undefined) infGain *= glyph.effects.infmult
        }
        if (player.reality.upg.includes(7)) infGain *= (player.galaxies/30)
        if (player.currentEternityChall == "eterc4") {
            infGain = 1
            if (player.infinitied >= 16 - (ECTimesCompleted("eterc4")*4)) {
                document.getElementById("challfail").style.display = "block"
                setTimeout(exitChallenge, 500)
                giveAchievement("You're a mistake")
                failureCount++
                if (failureCount > 9) giveAchievement("You're a failure")
            }
        }
        if (autoS && auto) {
          if (gainedInfinityPoints().dividedBy(player.thisInfinityTime/100).gt(player.autoIP) && !player.break) player.autoIP = gainedInfinityPoints().dividedBy(player.thisInfinityTime/100);
          if (player.thisInfinityTime<player.autoTime) player.autoTime = player.thisInfinityTime;
        }
        auto = autoS; //only allow autoing if prev crunch was autoed
        autoS = true;
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
            challenges: player.challenges,
            currentChallenge: player.currentChallenge,
            infinityUpgrades: player.infinityUpgrades,
            infinityPoints: player.infinityPoints,
            infinitied: player.infinitied + infGain,
            infinitiedBank: player.infinitiedBank,
            totalTimePlayed: player.totalTimePlayed,
            realTimePlayed: player.realTimePlayed,
            bestInfinityTime: Math.min(player.bestInfinityTime, player.thisInfinityTime),
            thisInfinityTime: 0,
            resets: 0,
            galaxies: 0,
            tickDecrease: 0.9,
            totalmoney: player.totalmoney,
            interval: null,
            lastUpdate: player.lastUpdate,
            achPow: player.achPow,
            autobuyers: player.autobuyers,
            costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
            tickspeedMultiplier: new Decimal(10),
            chall2Pow: 1,
            chall3Pow: new Decimal(0.01),
            newsArray: player.newsArray,
            matter: new Decimal(0),
            chall11Pow: new Decimal(1),
            partInfinityPoint: player.partInfinityPoint,
            partInfinitied: player.partInfinitied,
            break: player.break,
            challengeTimes: player.challengeTimes,
            infchallengeTimes: player.infchallengeTimes,
            lastTenRuns: player.lastTenRuns,
            lastTenEternities: player.lastTenEternities,
            lastTenRealities: player.lastTenRealities,
            infMult: player.infMult,
            infMultCost: player.infMultCost,
            tickSpeedMultDecrease: player.tickSpeedMultDecrease,
            tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
            dimensionMultDecrease: player.dimensionMultDecrease,
            dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
            version: player.version,
            postChallUnlocked: player.postChallUnlocked,
            postC4Tier: 1,
            postC3Reward: new Decimal(1),
            overXGalaxies: player.overXGalaxies,
            spreadingCancer: player.spreadingCancer,
            infDimensionsUnlocked: player.infDimensionsUnlocked,
            infinityPower: player.infinityPower,
            infinityDimension1: player.infinityDimension1,
            infinityDimension2: player.infinityDimension2,
            infinityDimension3: player.infinityDimension3,
            infinityDimension4: player.infinityDimension4,
            infinityDimension5: player.infinityDimension5,
            infinityDimension6: player.infinityDimension6,
            infinityDimension7: player.infinityDimension7,
            infinityDimension8: player.infinityDimension8,
            infDimBuyers: player.infDimBuyers,
            timeShards: player.timeShards,
            tickThreshold: player.tickThreshold,
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
            thisEternity: player.thisEternity,
            bestEternity: player.bestEternity,
            eternityUpgrades: player.eternityUpgrades,
            epmult: player.epmult,
            epmultCost: player.epmultCost,
            totalTickGained: player.totalTickGained,
            offlineProd: player.offlineProd,
            offlineProdCost: player.offlineProdCost,
            challengeTarget: player.challengeTarget,
            autoSacrifice: player.autoSacrifice,
            replicanti: player.replicanti,
            timestudy: player.timestudy,
            eternityChalls: player.eternityChalls,
            eternityChallGoal: player.eternityChallGoal,
            currentEternityChall: player.currentEternityChall,
            eternityChallUnlocked: player.eternityChallUnlocked,
            etercreq: player.etercreq,
            autoIP: player.autoIP,
            autoTime: player.autoTime,
            infMultBuyer: player.infMultBuyer,
            autoCrunchMode: player.autoCrunchMode,
            respec: player.respec,
            eternityBuyer: player.eternityBuyer,
            eterc8ids: player.eterc8ids,
            eterc8repl: player.eterc8repl,
            dimlife: player.dimlife,
            dead: player.dead,
            dilation: player.dilation,
            secretUnlocks: player.secretUnlocks,
            realities: player.realities,
            thisReality: player.thisReality,
            bestReality: player.bestReality,
            reality: player.reality,
            wormhole: player.wormhole,
            options: player.options
        };

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

        try {
            kongregate.stats.submit('Infinitied', getInfinitied());
            kongregate.stats.submit('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime))

        } catch (err) {console.log("Couldn't load Kongregate API")}
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

        if (player.realities > 0 && player.eternities == 0 && player.infinitied == 1) {
            if ( checkForRUPG8() ) player.reality.upgReqs[8] = true;
        }

    }
  updateChallenges();
  updateChallengeTimes()
  updateLastTenRuns()


}


function respecToggle() {
    if (player.respec) {
        player.respec = false
        document.getElementById("respec").className = "storebtn"
    } else {
        player.respec = true
        document.getElementById("respec").className = "timestudybought"
    }
}

function eternity(force, auto) {
    if ((player.infinityPoints.gte(Number.MAX_VALUE) && (!player.options.confirmations.eternity || force || auto || confirm("Eternity will reset everything except achievements and challenge records. You will also gain an Eternity point and unlock various upgrades."))) || force === true) {
        if (player.currentEternityChall == "eterc4" && player.infinitied > 16 - (ECTimesCompleted("eterc4")*4)) return false
        if (force) player.currentEternityChall = "";
        if (player.currentEternityChall !== "" && player.infinityPoints.lt(player.eternityChallGoal)) return false
        if (player.thisEternity<player.bestEternity && !force) {
            player.bestEternity = player.thisEternity
            if (player.bestEternity < 30000) giveAchievement("That wasn't an eternity");
            if (player.bestEternity <= 1) giveAchievement("Less than or equal to 0.001");
        }
        if (player.thisEternity < 200) giveAchievement("Eternities are the new infinity")
        if (player.currentEternityChall == "eterc6" && ECTimesCompleted("eterc6") < 5) player.dimensionMultDecrease = parseFloat((player.dimensionMultDecrease - 0.2).toFixed(1))
        if (player.currentEternityChall == "eterc11" && ECTimesCompleted("eterc11") < 5) player.tickSpeedMultDecrease = parseFloat((player.tickSpeedMultDecrease - 0.07).toFixed(2))
        if (player.infinitied < 10 && !force) giveAchievement("Do you really need a guide for this?");
        if (Decimal.round(player.replicanti.amount) == 9) giveAchievement("We could afford 9");
        if (player.dimlife && !force) giveAchievement("8 nobody got time for that")
        if (player.dead && !force) giveAchievement("You're already dead.")
        if (player.infinitied <= 1 && !force) giveAchievement("Do I really need to infinity")
        if (gainedEternityPoints().gte("1e600") && player.thisEternity <= 60000 && player.dilation.active && !force) giveAchievement("Now you're thinking with dilation!")
        temp = []
        player.eternityPoints = player.eternityPoints.plus(gainedEternityPoints())
        addEternityTime(player.thisEternity, gainedEternityPoints())
        if (player.currentEternityChall !== "") {
            if (player.eternityChalls[player.currentEternityChall] === undefined) {
                player.eternityChalls[player.currentEternityChall] = 1
            } else if (player.eternityChalls[player.currentEternityChall] < 5) player.eternityChalls[player.currentEternityChall] += 1
            player.etercreq = 0
            respecTimeStudies()
            if (Object.keys(player.eternityChalls).length >= 10) {
                var eterchallscompletedtotal = 0;
                for (i=1; i<Object.keys(player.eternityChalls).length+1; i++) {
                    eterchallscompletedtotal += player.eternityChalls["eterc"+i]
                }
                if (eterchallscompletedtotal >= 50) {
                    giveAchievement("5 more eternities until the update");
                }
            }
        }
        for (var i=0; i<player.challenges.length; i++) {
            if (!player.challenges[i].includes("post") && player.eternities > 1) temp.push(player.challenges[i])
        }
        if (player.timestudy.studies.includes(191)) player.infinitiedBank += Math.floor(player.infinitied*0.05)
        if (isAchEnabled("r131")) player.infinitiedBank += Math.floor(player.infinitied*0.05)
        if (player.infinitiedBank > 5000000000) giveAchievement("No ethical consumption");
        if (player.realities > 0 && player.eternities === 0 && player.reality.upgReqChecks[0]) {
            player.reality.upgReqs[6] = true;
        } 
        if (player.dilation.active && (!force || player.infinityPoints.gte(Number.MAX_VALUE))) {
            player.dilation.tachyonParticles = player.dilation.tachyonParticles.plus(getTachyonGain())
            player.dilation.totalTachyonParticles = player.dilation.totalTachyonParticles.plus(getTachyonGain())
        }
        if (player.realities > 0 && player.eternities == 0 && player.infinityPoints.gte(new Decimal("1e600"))) player.reality.upgReqs[10] = true
        player.challenges = temp
        if (!force) player.eternities = player.eternities+((player.reality.upg.includes(3)) ? 3 : 1)
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
            bestInfinityTime: 999999999999,
            thisInfinityTime: 0,
            resets: (player.eternities >= 4) ? 4 : 0,
            galaxies: (player.eternities >= 4) ? 1 : 0,
            tickDecrease: 0.9,
            totalmoney: player.totalmoney,
            interval: null,
            lastUpdate: player.lastUpdate,
            achPow: player.achPow,
            autobuyers: (player.eternities >= 2) ? player.autobuyers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            partInfinityPoint: 0,
            partInfinitied: 0,
            break: player.eternities >= 2 ? player.break : false,
            costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
            tickspeedMultiplier: new Decimal(10),
            chall2Pow: 1,
            chall3Pow: new Decimal(0.01),
            newsArray: player.newsArray,
            matter: new Decimal(0),
            chall11Pow: new Decimal(1),
            challengeTimes: player.challengeTimes,
            infchallengeTimes: player.infchallengeTimes,
            lastTenRuns: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
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
            infinityDimension1 : {
                cost: new Decimal(1e8),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension2 : {
                cost: new Decimal(1e9),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension3 : {
                cost: new Decimal(1e10),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension4 : {
                cost: new Decimal(1e20),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension5 : {
                cost: new Decimal(1e140),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension6 : {
                cost: new Decimal(1e200),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension7 : {
                cost: new Decimal(1e250),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension8 : {
                cost: new Decimal(1e280),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infDimBuyers: player.infDimBuyers,
            timeShards: new Decimal(0),
            tickThreshold: new Decimal(1),
            totalTickGained: 0,
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
                amount: player.eternities >= 50 ? new Decimal(1) : new Decimal(0),
                unl: player.eternities >= 50 ? true : false,
                chance: 0.01,
                chanceCost: new Decimal(1e150),
                interval: 1000,
                intervalCost: new Decimal(1e140),
                gal: 0,
                galaxies: 0,
                galCost: new Decimal(1e170),
                galaxybuyer: (player.eternities > 1) ? player.replicanti.galaxybuyer : undefined,
                auto: player.replicanti.auto
            },
            timestudy: player.timestudy,
            eternityChalls: player.eternityChalls,
            eternityChallGoal: new Decimal(Number.MAX_VALUE),
            currentEternityChall: "",
            eternityChallUnlocked: player.eternityChallUnlocked,
            etercreq: player.etercreq,
            autoIP: new Decimal(0),
            autoTime: 1e300,
            infMultBuyer: player.infMultBuyer,
            autoCrunchMode: player.autoCrunchMode,
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
        
        if (player.respec) respecTimeStudies()
        player.respec = false
        giveAchievement("Time is relative")
        if (player.eternities >= 100) giveAchievement("This mile took an Eternity");
        if (player.replicanti.unl) player.replicanti.amount = new Decimal(1)
        player.replicanti.galaxies = 0
        document.getElementById("respec").className = "storebtn"
        if (isAchEnabled("r36")) player.tickspeed = player.tickspeed.times(0.98);
        if (isAchEnabled("r45")) player.tickspeed = player.tickspeed.times(0.98);

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

        for (i in player.reality.glyphs.active) {
            var glyph = player.reality.glyphs.active[i];
            if (glyph.type == "power" && glyph.effects.autochall !== undefined) {
                player.challenges = ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12", "postc1", "postc2", "postc3", "postc4", "postc5", "postc6", "postc7", "postc8"];
            }
        }

        document.getElementById("matter").style.display = "none";
        document.getElementById("quickReset").style.display = "none";
        if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
        var autobuyers = document.getElementsByClassName('autoBuyerDiv')
        if (player.eternities < 2) {
            for (var i=0; i<autobuyers.length;i++) autobuyers.item(i).style.display = "none"
            document.getElementById("buyerBtnDimBoost").style.display = "inline-block"
            document.getElementById("buyerBtnGalaxies").style.display = "inline-block"
            document.getElementById("buyerBtnInf").style.display = "inline-block"
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
        updateChallengeTimes()
        updateLastTenRuns()
        updateLastTenEternities()
        if (!isAchEnabled("r133")) {
            var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
            for (var i = 0; i< infchalls.length; i++) infchalls[i].style.display = "none"
        }
        IPminpeak = new Decimal(0)
        EPminpeak = new Decimal(0)
        updateMilestones()
        resetTimeDimensions()
        if (player.eternities < 20) player.autobuyers[9].bulk = 1
        if (player.eternities < 20) document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
        if (player.eternities < 50) {
            document.getElementById("replicantidiv").style.display="none"
            document.getElementById("replicantiunlock").style.display="inline-block"
        } else if (document.getElementById("replicantidiv").style.display === "none" && player.eternities >= 50) {
            document.getElementById("replicantidiv").style.display="inline-block"
            document.getElementById("replicantiunlock").style.display="none"
        }
        try {
            kongregate.stats.submit('Eternities', player.eternities);
        } catch (err) {console.log("Couldn't load Kongregate API")}
        if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        if (player.eternities < 2) document.getElementById("break").textContent = "BREAK INFINITY"
        document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        updateEternityUpgrades()
        document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
        updateTickSpeed();
        playerInfinityUpgradesOnEternity()
        document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
        updateEternityChallenges()
        if (player.eternities <= 1) {
            showTab("dimensions")
            showDimTab("timedimensions")
            loadAutoBuyerSettings()
        }
        Marathon2 = 0;

        return true
    }
    else return false
}

function reality(force) {
    if ((player.eternityPoints.gte("1e4000") && player.dilation.studies.includes(6) && (realizationCheck === 1 || !player.options.confirmations.reality || confirm("Reality will reset everything except achievements and challenge records. You will also gain reality machines based on your EP, a glyph with a power level based on your EP, Replicanti, and Dilated Time, and unlock various upgrades."))) || force === true) {
        if ((player.options.animations.reality) && realizationCheck === 0) {
            realizationCheck = 1;
            document.getElementById("container").style.animation = "realize 10s 1";
            document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
            setTimeout(function(){
                document.getElementById("realityanimbg").play();
                document.getElementById("realityanimbg").currentTime = 0;
                document.getElementById("realityanimbg").play();
            }, 2000)
            setTimeout(function(){
                document.getElementById("container").style.animation = "";
                document.getElementById("realityanimbg").style.animation = "";
            }, 10000)
            setTimeout(reality, 3000)
            return
        }
        realizationCheck = 0;
        if (player.thisReality<player.bestReality && !force) {
            player.bestEternity = player.thisEternity
        }
        player.reality.realityMachines = player.reality.realityMachines.plus(gainedRealityMachines())
        //TODO replace 1 with glyph power that you got from that reality
        player.reality.glyphs.inventory.push(generateRandomGlyph(gainedGlyphLevel()))
        addRealityTime(player.thisReality, gainedRealityMachines(), gainedGlyphLevel())
        if (player.reality.glyphs.active.length == 1 && player.reality.glyphs.active[0].level >= 3) player.reality.upgReqs[9] = true
        if (player.reality.respec) respecGlyphs()
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
            challenges: [],
            currentChallenge: "",
            infinityUpgrades: [],
            infinityPoints: new Decimal(0),
            infinitied: 0,
            infinitiedBank: 0,
            totalTimePlayed: player.totalTimePlayed,
            realTimePlayed: player.realTimePlayed,
            bestInfinityTime: 999999999999,
            thisInfinityTime: 0,
            resets: 0,
            galaxies: 0,
            tickDecrease: 0.9,
            totalmoney: player.totalmoney,
            interval: null,
            lastUpdate: player.lastUpdate,
            achPow: player.achPow,
            autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            partInfinityPoint: 0,
            partInfinitied: 0,
            break: false,
            costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
            tickspeedMultiplier: new Decimal(10),
            chall2Pow: 1,
            chall3Pow: new Decimal(0.01),
            newsArray: player.newsArray,
            matter: new Decimal(0),
            chall11Pow: new Decimal(1),
            challengeTimes: player.challengeTimes,
            infchallengeTimes: player.infchallengeTimes,
            lastTenRuns: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
            lastTenEternities: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
            lastTenRealities: player.lastTenRealities,
            infMult: new Decimal(1),
            infMultCost: new Decimal(10),
            tickSpeedMultDecrease: 10,
            tickSpeedMultDecreaseCost: 3e6,
            dimensionMultDecrease: 10,
            dimensionMultDecreaseCost: 1e8,
            version: player.version,
            postChallUnlocked: 0,
            postC4Tier: 1,
            postC3Reward: new Decimal(1),
            overXGalaxies: player.overXGalaxies,
            spreadingCancer: player.spreadingCancer,
            infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
            infinityPower: new Decimal(1),
            infinityDimension1 : {
                cost: new Decimal(1e8),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension2 : {
                cost: new Decimal(1e9),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension3 : {
                cost: new Decimal(1e10),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension4 : {
                cost: new Decimal(1e20),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension5 : {
                cost: new Decimal(1e140),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension6 : {
                cost: new Decimal(1e200),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension7 : {
                cost: new Decimal(1e250),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension8 : {
                cost: new Decimal(1e280),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infDimBuyers: [false, false, false, false, false, false, false, false],
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
            offlineProd: 0,
            offlineProdCost: 1e7,
            challengeTarget: 0,
            autoSacrifice: 1,
            replicanti: {
                amount: new Decimal(0),
                unl: false,
                chance: 0.01,
                chanceCost: new Decimal(1e150),
                interval: 1000,
                intervalCost: new Decimal(1e140),
                gal: 0,
                galaxies: 0,
                galCost: new Decimal(1e170),
                galaxybuyer: undefined,
                auto: [false, false, false]
            },
            timestudy: {
                theorem: 0,
                amcost: new Decimal("1e20000"),
                ipcost: new Decimal(1),
                epcost: new Decimal(1),
                studies: [],
            },
            eternityChalls: {},
            eternityChallGoal: new Decimal(Number.MAX_VALUE),
            currentEternityChall: "",
            eternityChallUnlocked: 0,
            etercreq: 0,
            autoIP: new Decimal(0),
            autoTime: 1e300,
            infMultBuyer: false,
            autoCrunchMode: "amount",
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
                    3: 0,
                }
            },
            secretUnlocks: player.secretUnlocks,
            realities: player.realities+1,
            thisReality: 0,
            bestReality: Math.min(player.thisReality, player.bestReality),
            reality: player.reality,
            wormhole: player.wormhole,
            options: player.options
        };

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

        for (i in player.reality.glyphs.active) {
            var glyph = player.reality.glyphs.active[i];
            if (glyph.type == "power" && glyph.effects.autochall !== undefined) {
                player.challenges = ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5", "challenge6", "challenge7", "challenge8", "challenge9", "challenge10", "challenge11", "challenge12", "postc1", "postc2", "postc3", "postc4", "postc5", "postc6", "postc7", "postc8"];
            }
        }
        document.getElementById("matter").style.display = "none";
        document.getElementById("quickReset").style.display = "none";
        if (player.infinitied >= 1 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1");
        var autobuyers = document.getElementsByClassName('autoBuyerDiv')
        if (player.eternities < 2) {
            for (var i=0; i<autobuyers.length;i++) autobuyers.item(i).style.display = "none"
            document.getElementById("buyerBtnDimBoost").style.display = "inline-block"
            document.getElementById("buyerBtnGalaxies").style.display = "inline-block"
            document.getElementById("buyerBtnInf").style.display = "inline-block"
            document.getElementById("buyerBtnTickSpeed").style.display = "inline-block"
        }
        if (player.reality.upg.includes(10)) player.eternities = 100
        updateAutobuyers();
        resetInfDimensions();
        updateChallenges();
        updateChallengeTimes()
        updateLastTenRuns()
        updateLastTenEternities()
        updateLastTenRealities()
        IPminpeak = new Decimal(0)
        EPminpeak = new Decimal(0)
        updateMilestones()
        resetTimeDimensions()
        if (player.eternities < 20) player.autobuyers[9].bulk = 1
        if (player.eternities < 20) document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
        if (player.eternities < 50) {
            document.getElementById("replicantidiv").style.display="none"
            document.getElementById("replicantiunlock").style.display="inline-block"
        } else if (document.getElementById("replicantidiv").style.display === "none" && player.eternities >= 50) {
            document.getElementById("replicantidiv").style.display="inline-block"
            document.getElementById("replicantiunlock").style.display="none"
        }
        try {
            kongregate.stats.submit('Eternities', player.eternities);
        } catch (err) {console.log("Couldn't load Kongregate API")}
        if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        if (player.eternities < 2) document.getElementById("break").textContent = "BREAK INFINITY"
        document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        updateEternityUpgrades()
        document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
        updateTickSpeed();
        playerInfinityUpgradesOnEternity()
        document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
        updateEternityChallenges()
        if (player.eternities <= 1) {
            showTab("dimensions")
            showDimTab("antimatterdimensions")
            loadAutoBuyerSettings()
        }
        Marathon2 = 0;
        toggleCrunchMode()
        toggleCrunchMode()
        toggleCrunchMode()
        generateGlyphTable();
        updateWormholeUpgrades()
        updateAutomatorRows()
    }
}

function exitChallenge() {
    if (player.currentChallenge !== "") {
        document.getElementById(player.currentChallenge).textContent = "Start"
        startChallenge("");
        updateChallenges();
    } else if (player.currentEternityChall !== "") {
        player.currentEternityChall = ""
        player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
        eternity(true)
        updateEternityChallenges();
    }
}

function startChallenge(name, target) {
  if(!player.options.confirmations.challenges || name == "" ? true : (name.includes("post")) ? confirm("You will start over with just your infinity upgrades, and achievements. You need to reach a set goal with special conditions. NOTE: The rightmost infinity upgrade column doesn't work on challenges.") : confirm("You will start over with just your infinity upgrades, and achievements. You need to reach infinity with special conditions. NOTE: The rightmost infinity upgrade column doesn't work on challenges.")) {
    if (player.currentChallenge != "") document.getElementById(player.currentChallenge).textContent = "Start"
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
      challenges: player.challenges,
      currentChallenge: name,
      infinityUpgrades: player.infinityUpgrades,
      infinityPoints: player.infinityPoints,
      infinitied: player.infinitied,
      infinitiedBank: player.infinitiedBank,
      totalTimePlayed: player.totalTimePlayed,
      realTimePlayed: player.realTimePlayed,
      bestInfinityTime: player.bestInfinityTime,
      thisInfinityTime: 0,
      resets: 0,
      galaxies: 0,
      tickDecrease: 0.9,
      totalmoney: player.totalmoney,
      interval: null,
      lastUpdate: player.lastUpdate,
      achPow: player.achPow,
      autobuyers: player.autobuyers,
      costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
      tickspeedMultiplier: new Decimal(10),
      chall2Pow: 1,
      chall3Pow: new Decimal(0.01),
      matter: new Decimal(0),
      newsArray: player.newsArray,
      chall11Pow: new Decimal(1),
      partInfinityPoint: player.partInfinityPoint,
      partInfinitied: player.partInfinitied,
      break: player.break,
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
      lastTenRuns: player.lastTenRuns,
      lastTenEternities: player.lastTenEternities,
      lastTenRealities: player.lastTenRealities,
      infMult: player.infMult,
      infMultCost: player.infMultCost,
      tickSpeedMultDecrease: player.tickSpeedMultDecrease,
      tickSpeedMultDecreaseCost: player.tickSpeedMultDecreaseCost,
      dimensionMultDecrease: player.dimensionMultDecrease,
      dimensionMultDecreaseCost: player.dimensionMultDecreaseCost,
      version: player.version,
      postChallUnlocked: player.postChallUnlocked,
      postC4Tier: 1,
      postC3Reward: new Decimal(1),
      overXGalaxies: player.overXGalaxies,
      spreadingCancer: player.spreadingCancer,
      infDimensionsUnlocked: player.infDimensionsUnlocked,
      infinityPower: player.infinityPower,
      infinityDimension1: player.infinityDimension1,
      infinityDimension2: player.infinityDimension2,
      infinityDimension3: player.infinityDimension3,
      infinityDimension4: player.infinityDimension4,
      infinityDimension5: player.infinityDimension5,
      infinityDimension6: player.infinityDimension6,
      infinityDimension7: player.infinityDimension7,
      infinityDimension8: player.infinityDimension8,
      infDimBuyers: player.infDimBuyers,
      timeShards: player.timeShards,
      tickThreshold: player.tickThreshold,
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
      thisEternity: player.thisEternity,
      bestEternity: player.bestEternity,
      eternityUpgrades: player.eternityUpgrades,
      epmult: player.epmult,
      epmultCost: player.epmultCost,
      totalTickGained: player.totalTickGained,
      offlineProd: player.offlineProd,
      offlineProdCost: player.offlineProdCost,
      challengeTarget: target,
      autoSacrifice: player.autoSacrifice,
      replicanti: player.replicanti,
      timestudy: player.timestudy,
      eternityChalls: player.eternityChalls,
      eternityChallGoal: player.eternityChallGoal,
      currentEternityChall: player.currentEternityChall,
      eternityChallUnlocked: player.eternityChallUnlocked,
      etercreq: player.etercreq,
      autoIP: player.autoIP,
      autoTime: player.autoTime,
      infMultBuyer: player.infMultBuyer,
      autoCrunchMode: player.autoCrunchMode,
      respec: player.respec,
      eternityBuyer: player.eternityBuyer,
      eterc8ids: player.eterc8ids,
      eterc8repl: player.eterc8repl,
      dimlife: player.dimlife,
      dead: player.dead,
      dilation: player.dilation,
      secretUnlocks: player.secretUnlocks,
      realities: player.realities,
      thisReality: player.thisReality,
      bestReality: player.bestReality,
      reality: player.reality,
      wormhole: player.wormhole,
      options: player.options
    };
	if (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1") {
        player.thirdCost = new Decimal(100)
        player.fourthCost = new Decimal(500)
        player.fifthCost = new Decimal(2500)
        player.sixthCost = new Decimal(2e4)
        player.seventhCost = new Decimal(2e5)
        player.eightCost = new Decimal(4e6)
    }
    if (player.currentChallenge == "postc1") player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
    if (player.currentChallenge == "postc2") {
        player.eightAmount = new Decimal(1);
        player.eightBought = 1;
        player.resets = 4;
    }

    if (player.replicanti.unl) player.replicanti.amount = new Decimal(1)
    player.replicanti.galaxies = 0

    // even if we're in a challenge, apparently if it's challenge 2 we might have four resets anyway.
    setInitialDimensionPower();

    IPminpeak = new Decimal(0)
    if (player.currentChallenge.includes("post")) player.break = true
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
    }
    document.getElementById("fifthRow").style.display= "none";
    document.getElementById("sixthRow").style.display= "none";
    document.getElementById("seventhRow").style.display= "none";
    document.getElementById("eightRow").style.display= "none";
    if (name == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "block";
    else document.getElementById("matter").style.display = "none";

    if (name == "challenge12" || name == "challenge9" || name == "challenge5" || player.currentChallenge == "postc1" || player.currentChallenge == "postc4" || player.currentChallenge == "postc5" || player.currentChallenge == "postc6" || player.currentChallenge == "postc8") document.getElementById("quickReset").style.display = "inline-block";
    else document.getElementById("quickReset").style.display = "none";

    showTab('dimensions');
    updateChallenges();
    if (isAchEnabled("r21")) player.money = new Decimal(100).max(player.money);
    if (isAchEnabled("r37")) player.money = new Decimal(1000);
    if (isAchEnabled("r54")) player.money = new Decimal(2e5);
    if (isAchEnabled("r55")) player.money = new Decimal(1e10);
    if (isAchEnabled("r78")) player.money = new Decimal(1e25);
    showTab("dimensions")
    try {
        kongregate.stats.submit('Infinitied', getInfinitied());
        kongregate.stats.submit('Fastest Infinity time (ms)', Math.floor(player.bestInfinityTime))
    } catch (err) {console.log("Couldn't load Kongregate API")}

    if (player.infinitied >= 10) giveAchievement("That's a lot of infinites");

    document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."

    resetInfDimensions();
    player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), player.totalTickGained))
    updateTickSpeed();

    if (player.resets == 0 && player.currentChallenge == "") {
        if (player.infinityUpgrades.includes("skipReset1")) player.resets++;
        if (player.infinityUpgrades.includes("skipReset2")) player.resets++;
        if (player.infinityUpgrades.includes("skipReset3")) player.resets++;
        if (player.infinityUpgrades.includes("skipResetGalaxy")) {
            player.resets++;
            if (player.galaxies == 0) player.galaxies = 1
        }
    }
    if (player.currentChallenge.includes("post") && player.currentEternityChall !== "") giveAchievement("I wish I had gotten 7 eternities")
    Marathon2 = 0;
}
}

function unlockEChall(idx) {
    if (player.eternityChallUnlocked == 0) {
        player.eternityChallUnlocked = idx
        document.getElementById("eterc"+player.eternityChallUnlocked+"div").style.display = "inline-block"
        if (!justImported) showTab("challenges")
        if (!justImported) showChallengesTab("eternitychallenges")
        if (idx !== 12 && idx !== 13) player.etercreq = idx
    }
    updateEternityChallenges()
    updateTimeStudyButtons()
}

function ECTimesCompleted(name) {
    if (player.eternityChalls[name] === undefined) return 0
    else return player.eternityChalls[name]
}

function canUnlockEC(idx, cost, study, study2) {
    study2 = (study2 !== undefined) ? study2 : 0;
    if (player.eternityChallUnlocked !== 0) return false
    if (!player.timestudy.studies.includes(study) && (player.study2 == 0 || !player.timestudy.studies.includes(study2))) return false
    if (player.timestudy.theorem < cost) return false
    if (player.etercreq == idx && idx !== 11 && idx !== 12) return true

    switch(idx) {
        case 1:
        if (player.eternities >= 20000+(ECTimesCompleted("eterc1")*20000)) return true
        break;

        case 2:
        if (player.totalTickGained >= 1300+(ECTimesCompleted("eterc2")*150)) return true
        break;

        case 3:
        if (player.eightAmount.gte(17300+(ECTimesCompleted("eterc3")*1250))) return true
        break;

        case 4:
        if (1e8 + (ECTimesCompleted("eterc4")*5e7) <= getInfinitied()) return true
        break;

        case 5:
        if (160 + (ECTimesCompleted("eterc5")*14) <= player.galaxies) return true
        break;

        case 6:
        if (40 + (ECTimesCompleted("eterc6")*5) <= player.replicanti.galaxies) return true
        break;

        case 7:
        if (player.money.gte(new Decimal("1e500000").times(new Decimal("1e300000").pow(ECTimesCompleted("eterc7"))))) return true
        break;

        case 8:
        if (player.infinityPoints.gte(new Decimal("1e4000").times(new Decimal("1e1000").pow(ECTimesCompleted("eterc8"))))) return true
        break;

        case 9:
        if (player.infinityPower.gte(new Decimal("1e17500").times(new Decimal("1e2000").pow(ECTimesCompleted("eterc9"))))) return true
        break;

        case 10:
        if (player.eternityPoints.gte(new Decimal("1e100").times(new Decimal("1e20").pow(ECTimesCompleted("eterc10"))))) return true
        break;

        case 11:
        if (player.timestudy.studies.includes(71) && !player.timestudy.studies.includes(72) && !player.timestudy.studies.includes(73)) return true
        break;

        case 12:
        if (player.timestudy.studies.includes(73) && !player.timestudy.studies.includes(71) && !player.timestudy.studies.includes(72)) return true
        break;
    }
}

function updateECUnlockButtons() {
    if (canUnlockEC(1, 30, 171)) {
        document.getElementById("ec1unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec1unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(2, 35, 171)) {
        document.getElementById("ec2unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec2unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(3, 40, 171)) {
        document.getElementById("ec3unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec3unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(4, 70, 143)) {
        document.getElementById("ec4unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec4unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(5, 130, 42)) {
        document.getElementById("ec5unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec5unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(6, 85, 121)) {
        document.getElementById("ec6unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec6unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(7, 115, 111)) {
        document.getElementById("ec7unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec7unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(8, 115, 123)) {
        document.getElementById("ec8unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec8unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(9, 415, 151)) {
        document.getElementById("ec9unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec9unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(10, 550, 181)) {
        document.getElementById("ec10unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec10unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(11, 1, 231, 232)) {
        document.getElementById("ec11unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec11unl").className = "eternitychallengestudylocked"
    }

    if (canUnlockEC(12, 1, 233, 234)) {
        document.getElementById("ec12unl").className = "eternitychallengestudy"
    } else {
        document.getElementById("ec12unl").className = "eternitychallengestudylocked"
    }

    if (player.eternityChallUnlocked !== 0 )document.getElementById("ec"+player.eternityChallUnlocked+"unl").className = "eternitychallengestudybought"
}

document.getElementById("ec1unl").onclick = function() {
    if (canUnlockEC(1, 30, 171)) {
        unlockEChall(1)
        player.timestudy.theorem -= 30
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec2unl").onclick = function() {
    if (canUnlockEC(2, 35, 171)) {
        unlockEChall(2)
        player.timestudy.theorem -= 35
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec3unl").onclick = function() {
    if (canUnlockEC(3, 40, 171)) {
        unlockEChall(3)
        player.timestudy.theorem -= 40
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec4unl").onclick = function() {
    if (canUnlockEC(4, 70, 143)) {
        unlockEChall(4)
        player.timestudy.theorem -= 70
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec5unl").onclick = function() {
    if (canUnlockEC(5, 130, 42)) {
        unlockEChall(5)
        player.timestudy.theorem -= 130
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec6unl").onclick = function() {
    if (canUnlockEC(6, 85, 121)) {
        unlockEChall(6)
        player.timestudy.theorem -= 85
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec7unl").onclick = function() {
    if (canUnlockEC(7, 115, 111)) {
        unlockEChall(7)
        player.timestudy.theorem -= 115
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec8unl").onclick = function() {
    if (canUnlockEC(8, 115, 123)) {
        unlockEChall(8)
        player.timestudy.theorem -= 115
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec9unl").onclick = function() {
    if (canUnlockEC(9, 415, 151)) {
        unlockEChall(9)
        player.timestudy.theorem -= 415
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec10unl").onclick = function() {
    if (canUnlockEC(10, 550, 181)) {
        unlockEChall(10)
        player.timestudy.theorem -= 550
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec11unl").onclick = function() {
    if (canUnlockEC(11, 1, 231, 232)) {
        unlockEChall(11)
        player.timestudy.theorem -= 1
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec12unl").onclick = function() {
    if (canUnlockEC(12, 1, 233, 234)) {
        unlockEChall(12)
        player.timestudy.theorem -= 1
        updateTheoremButtons()
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

function startEternityChallenge(name, startgoal, goalIncrease) {
    if (player.eternityChallUnlocked == 0 || parseInt(name.split("c")[1]) !== player.eternityChallUnlocked) return false
    if((!player.options.confirmations.challenges) || name == "" ? true :  (confirm("You will start over with just your time studies, eternity upgrades and achievements. You need to reach a set IP with special conditions."))) {
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
            lastTenRuns: [[600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)], [600*60*24*31, new Decimal(1)]],
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
            infinityDimension1 : {
                cost: new Decimal(1e8),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension2 : {
                cost: new Decimal(1e9),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension3 : {
                cost: new Decimal(1e10),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension4 : {
                cost: new Decimal(1e20),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension5 : {
                cost: new Decimal(1e140),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension6 : {
                cost: new Decimal(1e200),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension7 : {
                cost: new Decimal(1e250),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infinityDimension8 : {
                cost: new Decimal(1e280),
                amount: new Decimal(0),
                bought: 0,
                power: new Decimal(1),
                baseAmount: 0
            },
            infDimBuyers: player.infDimBuyers,
            timeShards: new Decimal(0),
            tickThreshold: new Decimal(1),
            totalTickGained: 0,
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
                unl: player.eternities >= 50 ? true : false,
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

        if (player.replicanti.unl) player.replicanti.amount = new Decimal(1)
        player.replicanti.galaxies = 0
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
        var autobuyers = document.getElementsByClassName('autoBuyerDiv')
        if (player.eternities < 2) {
            for (var i=0; i<autobuyers.length;i++) autobuyers.item(i).style.display = "none"
            document.getElementById("buyerBtnDimBoost").style.display = "inline-block"
            document.getElementById("buyerBtnGalaxies").style.display = "inline-block"
            document.getElementById("buyerBtnInf").style.display = "inline-block"
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
        updateChallengeTimes()
        updateLastTenRuns()
        updateLastTenEternities()
        var infchalls = Array.from(document.getElementsByClassName('infchallengediv'))
        for (var i = 0; i< infchalls.length; i++) infchalls[i].style.display = "none"
        IPminpeak = new Decimal(0)
        EPminpeak = new Decimal(0)
        updateMilestones()
        resetTimeDimensions()
        if (player.eternities < 20) player.autobuyers[9].bulk = 1
        if (player.eternities < 20) document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
        if (player.eternities < 50) {
            document.getElementById("replicantidiv").style.display="none"
            document.getElementById("replicantiunlock").style.display="inline-block"
        }
        try {
            kongregate.stats.submit('Eternities', player.eternities);
        } catch (err) {console.log("Couldn't load Kongregate API")}
        if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false
        document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
        if (player.eternities < 2) document.getElementById("break").textContent = "BREAK INFINITY"
        document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."
        document.getElementById("eternitybtn").style.display = player.infinityPoints.gte(player.eternityChallGoal) ? "inline-block" : "none"
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        updateEternityUpgrades()
        document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
        updateTickSpeed();
        playerInfinityUpgradesOnEternity()
        document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")
        updateEternityChallenges()
        Marathon2 = 0;

        return true
    } else return false
}

function startDilatedEternity() {
    if (!player.dilation.studies.includes(1)) return false
    clearInterval(gameLoopIntervalId);
    if (player.dilation.active) {
        eternity(true)
        setTimeout(function() {
            gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
        }, 250)
        return false
    }
    if (player.options.confirmations.dilation && !confirm("Dilating time will start a new eternity, and all of your Dimension/Infinity Dimension/Time Dimension multiplier's exponents and tickspeed multiplier's exponent will be reduced to ^ 0.75. If you can eternity while dilated, you'll be rewarded with tachyon particles based on your antimatter and tachyon particles.")) {
        setTimeout(function() {
            gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
        }, 250)
        return false
    }
    giveAchievement("I told you already, time is relative")
    eternity(true)
    player.dilation.active = true;
    totalMult = 1
    currentMult = 1
    infinitiedMult = 1
    achievementMult = 1
    challengeMult = 1
    unspentBonus = 1
    postc8Mult = new Decimal(0)
    mult18 = new Decimal(1)
    ec10bonus = new Decimal(1)
    setTimeout(function() {
        gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
    }, 250)
    return true
}

function unlockDilation() {
    if (player.dilation.studies.includes(1)) return false
    if (player.timestudy.theorem < 5000) return false
    if (ECTimesCompleted("eterc12") !== 5) return false
    if (ECTimesCompleted("eterc11") !== 5) return false
    player.timestudy.theorem -= 5000
    document.getElementById("dilationunlock").className = "dilationupgbought"
    updateTimeStudyButtons()
    showEternityTab("dilation")
    document.getElementById("dilationunlock").innerHTML = "Unlock time dilation<span>Cost: 5000 Time Theorems"
    return true
}


/**
 *
 * @param {Name of the ugrade} id
 * @param {Cost of the upgrade} cost
 * @param {Cost increase for the upgrade, only for rebuyables} costInc
 *
 * id 1-3 are rebuyables
 *
 * id 2 resets your dilated time and free galaxies
 *
 */

 const DIL_UPG_COSTS = [null, [1e5, 10], [1e6, 100], [1e7, 20],
                              5e6,        1e9,         5e7,
                              2e12,        1e10,         1e11,
                                            1e15]


function buyDilationUpgrade(id, costInc) {
    if (id > 3) { // Not rebuyable
        if (player.dilation.dilatedTime < DIL_UPG_COSTS[id]) return // Not enough dilated time
        if (player.dilation.upgrades.includes(id)) return // Has the upgrade
        player.dilation.dilatedTime = player.dilation.dilatedTime.minus(DIL_UPG_COSTS[id])
        player.dilation.upgrades.push(id)
        if (id == 4) player.dilation.freeGalaxies *= 2 // Double the current galaxies
    } else { // Is rebuyable
        let upgAmount = player.dilation.rebuyables[id];
        let realCost = new Decimal(DIL_UPG_COSTS[id][0]).times( Decimal.pow(DIL_UPG_COSTS[id][1], (upgAmount)) )
        if (player.dilation.dilatedTime.lt(realCost)) return

        player.dilation.dilatedTime = player.dilation.dilatedTime.minus(realCost)
        player.dilation.rebuyables[id] += 1
        if (id == 2) {
            player.dilation.dilatedTime = new Decimal(0)
            player.dilation.nextThreshold = new Decimal(1000)
            player.dilation.freeGalaxies = 0
        }
    }

    updateDilationUpgradeCosts()
    updateDilationUpgradeButtons()
    updateTimeStudyButtons()
}

function updateDilationUpgradeButtons() {
    for (var i = 1; i <= 10; i++) {
        if (i <= 3) {
            document.getElementById("dil"+i).className = ( new Decimal(DIL_UPG_COSTS[i][0]).times(Decimal.pow(DIL_UPG_COSTS[i][1],(player.dilation.rebuyables[i]))).gt(player.dilation.dilatedTime) ) ? "dilationupgrebuyablelocked" : "dilationupgrebuyable";
        } else if (player.dilation.upgrades.includes(i)) {
            document.getElementById("dil"+i).className = "dilationupgbought"
        } else {
            document.getElementById("dil"+i).className = ( DIL_UPG_COSTS[i] > player.dilation.dilatedTime ) ? "dilationupglocked" : "dilationupg";
        }
    }
    document.getElementById("dil7desc").textContent = "Currently: "+shortenMoney(player.dilation.dilatedTime.pow(1000).max(1))+"x"
    document.getElementById("dil10desc").textContent = "Currently: "+shortenMoney(Math.floor(player.dilation.tachyonParticles.div(20000).max(1)))+"/s"
}

function updateDilationUpgradeCosts() {
    document.getElementById("dil1cost").textContent = "Cost: " + shortenCosts( new Decimal(DIL_UPG_COSTS[1][0]).times(Decimal.pow(DIL_UPG_COSTS[1][1],(player.dilation.rebuyables[1]))) ) + " dilated time"
    document.getElementById("dil2cost").textContent = "Cost: " + shortenCosts( new Decimal(DIL_UPG_COSTS[2][0]).times(Decimal.pow(DIL_UPG_COSTS[2][1],(player.dilation.rebuyables[2]))) ) + " dilated time"
    document.getElementById("dil3cost").textContent = "Cost: " + formatValue(player.options.notation, new Decimal(DIL_UPG_COSTS[3][0]).times(Decimal.pow(DIL_UPG_COSTS[3][1],(player.dilation.rebuyables[3]))), 1, 1) + " dilated time"
    document.getElementById("dil4cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[4]) + " dilated time"
    document.getElementById("dil5cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[5]) + " dilated time"
    document.getElementById("dil6cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[6]) + " dilated time"
    document.getElementById("dil7cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[7]) + " dilated time"
    document.getElementById("dil8cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[8]) + " dilated time"
    document.getElementById("dil9cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[9]) + " dilated time"
    document.getElementById("dil10cost").textContent = "Cost: " + shortenCosts(DIL_UPG_COSTS[10]) + " dilated time"
}


function getDilationGainPerSecond() {
    var ret = new Decimal(player.dilation.tachyonParticles*Math.pow(2, player.dilation.rebuyables[1]))
    if (isAchEnabled("r132")) ret = ret.times(Math.max(Math.pow(player.galaxies, 0.04), 1))
    if (player.reality.upg.includes(1)) ret = ret.times(3)
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "dilation" && glyph.effects.dilationMult !== undefined) ret = ret.times(glyph.effects.dilationMult)
    }
    for (i in player.reality.glyphs.active) {
      var glyph = player.reality.glyphs.active[i]
      if (glyph.type == "replication" && glyph.effects.dtgain !== undefined) ret = ret.times(player.replicanti.amount.e * glyph.effects.dtgain)
    }
    return ret
}

function getTachyonGain() {
    let mult = Math.pow(3, player.dilation.rebuyables[3])
    if (player.reality.upg.includes(4)) mult *= 3
    if (player.reality.upg.includes(8)) mult *= Math.sqrt(player.achPow)

    let tachyonGain = Math.max(Math.pow(Decimal.log10(player.money) / 400, 1.5) * (mult) - player.dilation.totalTachyonParticles, 0)            
    return tachyonGain
}

function getTachyonReq() {
    let mult = Math.pow(3, player.dilation.rebuyables[3])
    if (player.reality.upg.includes(4)) mult *= 3
    if (player.reality.upg.includes(8)) mult *= Math.sqrt(player.achPow)

    let req = Decimal.pow(10, Math.pow(player.dilation.tachyonParticles * Math.pow(400, 1.5) / mult, 2/3))
    return req
}





function calcPerSec(amount, pow, hasMult) {
    if (!hasMult) return Decimal.floor(amount).times(pow).times(player.achPow).times(timeMult()).times(player.chall2Pow).dividedBy(player.tickspeed.dividedBy(1000));
    else return Decimal.floor(amount).times(pow).times(player.achPow).times(dimMults()).times(timeMult()).times(player.chall2Pow).dividedBy(player.tickspeed.dividedBy(1000));
}

document.getElementById("quickReset").onclick = function () {
    if (player.resets == 0) player.resets--;
    else player.resets -= 2;
    softReset(1);
}


function updateInfPower() {
    document.getElementById("infPowAmount").textContent = shortenMoney(player.infinityPower)
    if (player.currentEternityChall == "eterc9") document.getElementById("infDimMultAmount").textContent = shortenMoney((Decimal.pow(Math.max(player.infinityPower.log2(), 1), 4)).max(1))
    else document.getElementById("infDimMultAmount").textContent = shortenMoney(player.infinityPower.pow(7).max(1))
    if (player.currentEternityChall == "eterc7") document.getElementById("infPowPerSec").textContent = "You are getting " +shortenDimensions(DimensionProduction(1))+" Seventh Dimensions per second."
    else document.getElementById("infPowPerSec").textContent = "You are getting " +shortenDimensions(DimensionProduction(1))+" Infinity Power per second."
}

function updateTimeShards() {
    if (document.getElementById("timedimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
        document.getElementById("timeShardAmount").textContent = shortenMoney(player.timeShards)
        document.getElementById("tickThreshold").textContent = shortenMoney(player.tickThreshold)
        if (player.currentEternityChall == "eterc7") document.getElementById("timeShardsPerSec").textContent = "You are getting "+shortenDimensions(getTimeDimensionProduction(1))+" Eighth Infinity Dimensions per second."
        else document.getElementById("timeShardsPerSec").textContent = "You are getting "+shortenDimensions(getTimeDimensionProduction(1))+" Timeshards per second."
    }
}

function updateDilation() {
    if (document.getElementById("dilation").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
        document.getElementById("tachyonParticleAmount").textContent = shortenMoney(player.dilation.tachyonParticles)
        document.getElementById("dilatedTimeAmount").textContent = shortenMoney(player.dilation.dilatedTime)
        document.getElementById("dilatedTimePerSecond").textContent = "+" + shortenMoney(getDilationGainPerSecond()) + "/s"
        document.getElementById("galaxyThreshold").textContent = shortenMoney(player.dilation.nextThreshold)
        document.getElementById("dilatedGalaxies").textContent = player.dilation.freeGalaxies
    }
}


function getNewInfReq() {
    if (!player.infDimensionsUnlocked[0]) return new Decimal("1e1100")
    else if (!player.infDimensionsUnlocked[1]) return new Decimal("1e1900")
    else if (!player.infDimensionsUnlocked[2]) return new Decimal("1e2400")
    else if (!player.infDimensionsUnlocked[3]) return new Decimal("1e10500")
    else if (!player.infDimensionsUnlocked[4]) return new Decimal("1e30000")
    else if (!player.infDimensionsUnlocked[5]) return new Decimal("1e45000")
    else if (!player.infDimensionsUnlocked[6]) return new Decimal("1e54000")
    else return new Decimal("1e60000")
}


function newDimension() {
    if (player.money.gte(getNewInfReq())) {
        if (!player.infDimensionsUnlocked[0]) player.infDimensionsUnlocked[0] = true
        else if (!player.infDimensionsUnlocked[1]) player.infDimensionsUnlocked[1] = true
        else if (!player.infDimensionsUnlocked[2]) player.infDimensionsUnlocked[2] = true
        else if (!player.infDimensionsUnlocked[3]) {
            player.infDimensionsUnlocked[3] = true
            giveAchievement("NEW DIMENSIONS???")
        }
        else if (!player.infDimensionsUnlocked[4]) player.infDimensionsUnlocked[4] = true
        else if (!player.infDimensionsUnlocked[5]) player.infDimensionsUnlocked[5] = true
        else if (!player.infDimensionsUnlocked[6]) player.infDimensionsUnlocked[6] = true
        else if (!player.infDimensionsUnlocked[7]) {
            player.infDimensionsUnlocked[7] = true
            giveAchievement("0 degrees from infinity")
        }
    }
}
var blink = true
setInterval(function() {
    $.getJSON('version.txt', function(data){
        //data is actual content of version.txt, so
        //do whatever you need with it
        //I'd compare it with last result and if it's different
        //show the message received and nag for attention
        //like this:
        if (data.version > player.version) {
            player.version = data.version
            document.getElementById("update").style.display = "block"
            document.getElementById("updatePopup").innerHTML = data.message
            //or some more resilient method
            //like forced news bar with message running over and over
        }
    })
}, 60000)


const ETERNITY_CHALLS = {
    ec1: {
        start: new Decimal("1e1800"),
        inc: new Decimal("1e200")
    },
    ec2: {
        start: new Decimal("1e975"),
        inc: new Decimal("1e175")
    },
    ec3: {
        start: new Decimal("1e600"),
        inc: new Decimal("1e75")
    },
    ec4: {
        start: new Decimal("1e2750"),
        inc: new Decimal("1e550")
    },
    ec5: {
        start: new Decimal("1e750"),
        inc: new Decimal("1e400")
    },
    ec6: {
        start: new Decimal("1e850"),
        inc: new Decimal("1e250")
    },
    ec7: {
        start: new Decimal("1e2000"),
        inc: new Decimal("1e530")
    },
    ec8: {
        start: new Decimal("1e1300"),
        inc: new Decimal("1e900")
    },
    ec9: {
        start: new Decimal("1e1750"),
        inc: new Decimal("1e250")
    },
    ec10: {
        start: new Decimal("1e3000"),
        inc: new Decimal("1e300")
    },
    ec11: {
        start: new Decimal("1e500"),
        inc: new Decimal("1e200")
    },
    ec12: {
        start: new Decimal("1e110000"),
        inc: new Decimal("1e12000")
    },
}





setInterval(function() {
    try {
        kongregate.stats.submit('Log10 of total antimatter', player.totalmoney.e);
        kongregate.stats.submit('Log10 of Infinity Points', player.infinityPoints.e);
        kongregate.stats.submit('Log10 of Eternity Points', player.eternityPoints.e);
    } catch (err) {console.log("Couldn't load Kongregate API")}
}, 10000)

var nextAt = [new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e12000"), new Decimal("1e14000"), new Decimal("1e18000"), new Decimal("1e20000"), new Decimal("1e23000"), new Decimal("1e28000")]

var goals = [new Decimal("1e850"), new Decimal("1e10500"), new Decimal("1e5000"), new Decimal("1e13000"), new Decimal("1e11111"), new Decimal("2e22222"), new Decimal("1e10000"), new Decimal("1e27000")]
setInterval(function() {
    if (getDimensionFinalMultiplier(1).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(2).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(3).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(4).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(5).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(6).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(7).gte(new Decimal("1e308")) &&
        getDimensionFinalMultiplier(8).gte(new Decimal("1e308"))) giveAchievement("Can't hold all these infinities")

    if (getDimensionFinalMultiplier(1).lt(getDimensionFinalMultiplier(2)) &&
        getDimensionFinalMultiplier(2).lt(getDimensionFinalMultiplier(3)) &&
        getDimensionFinalMultiplier(3).lt(getDimensionFinalMultiplier(4)) &&
        getDimensionFinalMultiplier(4).lt(getDimensionFinalMultiplier(5)) &&
        getDimensionFinalMultiplier(5).lt(getDimensionFinalMultiplier(6)) &&
        getDimensionFinalMultiplier(6).lt(getDimensionFinalMultiplier(7)) &&
        getDimensionFinalMultiplier(7).lt(getDimensionFinalMultiplier(8))) giveAchievement("How the antitables have turned")



    if (player.infinitied == 0 && player.infinityPoints.lt(new Decimal(1e50)) && player.eternities <= 0) document.getElementById("infinityPoints2").style.display = "none"
    else document.getElementById("infinityPoints2").style.display = "inline-block"

    if (blink && !isAchEnabled("r78")) {
        document.getElementById("Blink of an eye").style.display = "none"
        blink = false
    }
    else {
        document.getElementById("Blink of an eye").style.display = "block"
        blink = true
    }
    if (player.challenges.includes("postc1")) {
        let temp = 1
        for (var i=0; i < player.challenges.length; i++) {
            if (player.challenges[i].includes("post")) {
                temp *= 1.3
                document.getElementById("infchallengetimes").style.display = "inline-block"
            }
        }
        infDimPow = temp
    } else {
        document.getElementById("infchallengetimes").style.display = "none"
    }

    if (player.money.gte(new Decimal("1e2000")) || Object.keys(player.eternityChalls).length > 0 || player.eternityChallUnlocked !== 0) document.getElementById("challTabButtons").style.display = "table"

    document.getElementById("kongip").textContent = "Double your IP gain from all sources (additive). Forever. Currently: x"+kongIPMult+", next: x"+(kongIPMult==1? 2: kongIPMult+2)
    document.getElementById("kongep").textContent = "Triple your EP gain from all sources (additive). Forever. Currently: x"+kongEPMult+", next: x"+(kongEPMult==1? 3: kongEPMult+3)
    document.getElementById("kongdim").textContent = "Double all your normal dimension multipliers (multiplicative). Forever. Currently: x"+kongDimMult+", next: x"+(kongDimMult*2)
    document.getElementById("kongalldim").textContent = "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. Currently: x"+kongAllDimMult+", next: x"+((kongAllDimMult < 32) ? kongAllDimMult * 2 : kongAllDimMult + 32)
    document.getElementById("eternityPoints2").innerHTML = "You have <span class=\"EPAmount2\">"+shortenDimensions(player.eternityPoints)+"</span> Eternity point"+((player.eternityPoints.eq(1)) ? "." : "s.")

    document.getElementById("eternitybtn").style.display = (player.infinityPoints.gte(player.eternityChallGoal) && (player.infDimensionsUnlocked[7] || player.eternities > 24)) ? "inline-block" : "none"


    if (player.eternities !== 0) document.getElementById("eternitystorebtn").style.display = "inline-block"
    else document.getElementById("eternitystorebtn").style.display = "none"
    for (var i=1; i <=8; i++) {
        document.getElementById("postc"+i+"goal").textContent = "Goal: "+shortenCosts(goals[i-1])
    }

    if (player.replicanti.galaxybuyer !== undefined) document.getElementById("replicantiresettoggle").style.display = "inline-block"
    else document.getElementById("replicantiresettoggle").style.display = "none"

    if (player.eternities > 0) document.getElementById("infmultbuyer").style.display = "inline-block"
    else document.getElementById("infmultbuyer").style.display = "none"
    if (player.eternities > 4) document.getElementById("togglecrunchmode").style.display = "inline-block"
    else document.getElementById("togglecrunchmode").style.display = "none"
    if (player.eternities > 8) document.getElementById("galaxybulk").style.display = "inline-block"
    else document.getElementById("galaxybulk").style.display = "none"

    document.getElementById("replicantichance").className = (player.infinityPoints.gte(player.replicanti.chanceCost) && player.replicanti.chance < 1) ? "storebtn" : "unavailablebtn"
    document.getElementById("replicantiinterval").className = (player.infinityPoints.gte(player.replicanti.intervalCost) && ((player.replicanti.interval !== 50) || player.timestudy.studies.includes(22)) && (player.replicanti.interval !== 1)) ? "storebtn" : "unavailablebtn"
    document.getElementById("replicantimax").className = (player.infinityPoints.gte(player.replicanti.galCost)) ? "storebtn" : "unavailablebtn"
    document.getElementById("replicantireset").className = (player.replicanti.galaxies < player.replicanti.gal && player.replicanti.amount.gte(Number.MAX_VALUE)) ? "storebtn" : "unavailablebtn"
    document.getElementById("replicantiunlock").className = (player.infinityPoints.gte(1e140)) ? "storebtn" : "unavailablebtn"
    updateTheoremButtons()

    if (getTickSpeedMultiplier() < 0.001) giveAchievement("Do you even bend time bro?")

    if (player.eternities > 9) document.getElementById("bulklabel").textContent = "Buy max dimboosts every X seconds:"
    else document.getElementById("bulklabel").textContent = "Bulk DimBoost Amount:"

    if (player.eternities > 10) {
        for (var i=1;i<player.eternities-9 && i < 9; i++) {
            document.getElementById("infauto"+i).style.visibility = "visible"
        }
        document.getElementById("toggleallinfdims").style.visibility = "visible"
    } else {
        for (var i=1; i<9; i++) {
            document.getElementById("infauto"+i).style.visibility = "hidden"
        }
        document.getElementById("toggleallinfdims").style.visibility = "hidden"
    }

    if (player.eternities >= 40) document.getElementById("replauto1").style.visibility = "visible"
    else document.getElementById("replauto1").style.visibility = "hidden"
    if (player.eternities >= 60) document.getElementById("replauto2").style.visibility = "visible"
    else document.getElementById("replauto2").style.visibility = "hidden"
    if (player.eternities >= 80) document.getElementById("replauto3").style.visibility = "visible"
    else document.getElementById("replauto3").style.visibility = "hidden"
    if (player.eternities >= 100) document.getElementById("autoBuyerEter").style.display = "inline-block"

    if (player.eternities == 0 && player.realities == 0) document.getElementById("pasteternities").style.display = "none"
    else document.getElementById("pasteternities").style.display = "inline-block"
    if (player.realities == 0) document.getElementById("pastrealities").style.display = "none"
    else document.getElementById("pastrealities").style.display = "inline-block"
    if (player.challenges.length > 1) document.getElementById("challengetimesbtn").style.display = "inline-block"
    else document.getElementById("challengetimesbtn").style.display = "none"
    if (player.infinitied > 0 || player.eternities > 0 || player.realities > 0) document.getElementById("pastinfs").style.display = "inline-block"
    else document.getElementById("pastinfs").style.display = "none"

    if (player.infinitied !== 0 || player.eternities !== 0 || player.realities !== 0) document.getElementById("bigCrunchAnimBtn").style.display = "inline-block"
    else document.getElementById("bigCrunchAnimBtn").style.display = "none"
    if (!player.dilation.tachyonParticles.eq(0) || player.realities !== 0) document.getElementById("tachyonParticleAnimBtn").style.display = "inline-block"
    else document.getElementById("tachyonParticleAnimBtn").style.display = "none"
    if (player.realities !== 0 ) document.getElementById("realityAnimBtn").style.display = "inline-block"
    else document.getElementById("realityAnimBtn").style.display = "none"

    if (player.eternities !== 0 || player.realities !== 0) document.getElementById("eternityConfBtn").style.display = "inline-block"
    else document.getElementById("eternityConfBtn").style.display = "none"
    if (!player.dilation.tachyonParticles.eq(0) || player.realities !== 0) document.getElementById("dilationConfBtn").style.display = "inline-block"
    else document.getElementById("dilationConfBtn").style.display = "none"
    if (player.realities !== 0) document.getElementById("realityConfBtn").style.display = "inline-block"
    else document.getElementById("realityConfBtn").style.display = "none"

    if (player.eternities > 10 && player.currentEternityChall !== "eterc8") {
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
        while (upgradeReplicantiGalaxy()) continue
    }

    document.getElementById("eterc1goal").textContent = "Goal: "+shortenCosts(new Decimal("1e1800").times(new Decimal("1e200").pow(ECTimesCompleted("eterc1"))).max(new Decimal("1e1800"))) + " IP"
    document.getElementById("eterc1completed").textContent = "Completed "+ECTimesCompleted("eterc1")+((player.eternityChalls.eterc1 === 1) ? " time." : " times.")

    document.getElementById("eterc2goal").textContent = "Goal: "+shortenCosts(new Decimal("1e975").times(new Decimal("1e175").pow(ECTimesCompleted("eterc2"))).max(new Decimal("1e975"))) + " IP"
    document.getElementById("eterc2completed").textContent = "Completed "+ECTimesCompleted("eterc2")+((player.eternityChalls.eterc2 === 1) ? " time." : " times.")

    document.getElementById("eterc3goal").textContent = "Goal: "+shortenCosts(new Decimal("1e600").times(new Decimal("1e75").pow(ECTimesCompleted("eterc3"))).max(new Decimal("1e575"))) + " IP"
    document.getElementById("eterc3completed").textContent = "Completed "+ECTimesCompleted("eterc3")+((player.eternityChalls.eterc3 === 1) ? " time." : " times.")

    document.getElementById("eterc4goal").textContent = "Goal: "+shortenCosts(new Decimal("1e2750").times(new Decimal("1e550").pow(ECTimesCompleted("eterc4"))).max(new Decimal("1e2750"))) + " IP in "+Math.max((16 - (ECTimesCompleted("eterc4")*4)), 0)+" infinities or less."
    document.getElementById("eterc4completed").textContent = "Completed "+ECTimesCompleted("eterc4")+((player.eternityChalls.eterc4 === 1) ? " time." : " times.")

    document.getElementById("eterc5goal").textContent = "Goal: "+shortenCosts(new Decimal("1e750").times(new Decimal("1e400").pow(ECTimesCompleted("eterc5"))).max(new Decimal("1e750"))) + " IP"
    document.getElementById("eterc5completed").textContent = "Completed "+ECTimesCompleted("eterc5")+((player.eternityChalls.eterc5 === 1) ? " time." : " times.")

    document.getElementById("eterc6goal").textContent = "Goal: "+shortenCosts(new Decimal("1e850").times(new Decimal("1e250").pow(ECTimesCompleted("eterc6"))).max(new Decimal("1e850"))) + " IP"
    document.getElementById("eterc6completed").textContent = "Completed "+ECTimesCompleted("eterc6")+((player.eternityChalls.eterc6 === 1) ? " time." : " times.")

    document.getElementById("eterc7goal").textContent = "Goal: "+shortenCosts(new Decimal("1e2000").times(new Decimal("1e530").pow(ECTimesCompleted("eterc7"))).max(new Decimal("1e2000"))) + " IP"
    document.getElementById("eterc7completed").textContent = "Completed "+ECTimesCompleted("eterc7")+((player.eternityChalls.eterc7 === 1) ? " time." : " times.")

    document.getElementById("eterc8goal").textContent = "Goal: "+shortenCosts(new Decimal("1e1300").times(new Decimal("1e900").pow(ECTimesCompleted("eterc8"))).max(new Decimal("1e1300"))) + " IP"
    document.getElementById("eterc8completed").textContent = "Completed "+ECTimesCompleted("eterc8")+((player.eternityChalls.eterc8 === 1) ? " time." : " times.")

    document.getElementById("eterc9goal").textContent = "Goal: "+shortenCosts(new Decimal("1e1750").times(new Decimal("1e250").pow(ECTimesCompleted("eterc9"))).max(new Decimal("1e1750"))) + " IP"
    document.getElementById("eterc9completed").textContent = "Completed "+ECTimesCompleted("eterc9")+((player.eternityChalls.eterc9 === 1) ? " time." : " times.")

    document.getElementById("eterc10goal").textContent = "Goal: "+shortenCosts(new Decimal("1e3000").times(new Decimal("1e300").pow(ECTimesCompleted("eterc10"))).max(new Decimal("1e3000"))) + " IP"
    document.getElementById("eterc10completed").textContent = "Completed "+ECTimesCompleted("eterc10")+((player.eternityChalls.eterc10 === 1) ? " time." : " times.")

    document.getElementById("eterc11goal").textContent = "Goal: "+shortenCosts(new Decimal("1e500").times(new Decimal("1e200").pow(ECTimesCompleted("eterc11"))).max(new Decimal("1e500"))) + " IP"
    document.getElementById("eterc11completed").textContent = "Completed "+ECTimesCompleted("eterc11")+((player.eternityChalls.eterc11 === 1) ? " time." : " times.")

    document.getElementById("eterc12goal").textContent = "Goal: "+shortenCosts(new Decimal("1e110000").times(new Decimal("1e12000").pow(ECTimesCompleted("eterc12"))).max(new Decimal("1e110000"))) + " IP in "+(Math.max(10 - ECTimesCompleted("eterc12")*2, 1)/10) + ((ECTimesCompleted("eterc12") === 0) ? " second or less." :" seconds or less." )
    document.getElementById("eterc12completed").textContent = "Completed "+ECTimesCompleted("eterc12")+((player.eternityChalls.eterc12 === 1) ? " time." : " times.")
    updateECUnlockButtons()




    if (player.currentEternityChall == "eterc8") {
        document.getElementById("eterc8repl").style.display = "block"
        document.getElementById("eterc8ids").style.display = "block"
        document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
        document.getElementById("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
    } else {
        document.getElementById("eterc8repl").style.display = "none"
        document.getElementById("eterc8ids").style.display = "none"
    }

    if (player.currentEternityChall == "eterc12" && player.thisEternity >= Math.max(200 * (5 - ECTimesCompleted("eterc12")), 100)) {
        document.getElementById("challfail").style.display = "block"
        setTimeout(exitChallenge, 500)
        giveAchievement("You're a mistake")
        failureCount++
        if (failureCount > 9) giveAchievement("You're a failure")
    }

    document.getElementById("infinitiedBank").style.display = (player.infinitiedBank > 0) ? "block" : "none"
    document.getElementById("infinitiedBank").textContent = "You have " + player.infinitiedBank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " banked infinities."

    if (infchallengeTimes < 750) giveAchievement("Never again")
    if (player.infinityPoints.gte(new Decimal("1e22000")) && player.timestudy.studies.length == 0) giveAchievement("What do I have to do to get rid of you")
    if (player.replicanti.galaxies >= 180*player.galaxies && player.galaxies > 0) giveAchievement("Popular music")
    if (player.eternityPoints.gte(Number.MAX_VALUE)) giveAchievement("But I wanted another prestige layer...")
    if (player.infinityPoints.gte(1e100) && player.firstAmount.equals(0) && player.infinitied == 0 && player.resets <= 4 && player.galaxies <= 1 && player.replicanti.galaxies == 0) giveAchievement("Like feasting on a behind")
    if (player.infinityPoints.gte('9.99999e999')) giveAchievement("This achievement doesn't exist II");
    if (player.infinityPoints.gte('1e30008')) giveAchievement("Can you get infinite IP?");
    if (player.infinitied > 2e6) giveAchievement("2 Million Infinities")
    if (player.money.gte("9.9999e9999")) giveAchievement("This achievement doesn't exist")
    if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")
    if (player.infinityPower.gt(1)) giveAchievement("A new beginning.");
    if (player.infinityPower.gt(1e6)) giveAchievement("1 million is a lot"); //TBD
    if (player.infinityPower.gt(1e260)) giveAchievement("Minute of infinity"); //TBD
    if (player.totalTickGained >= 308) giveAchievement("Infinite time");
    if (player.firstPow >= 10e30) giveAchievement("I forgot to nerf that")
    if (player.money >= 10e79) giveAchievement("Antimatter Apocalypse")
    if (player.totalTimePlayed >= 1000 * 60 * 60 * 24 * 8) giveAchievement("One for each dimension")
    if (player.seventhAmount > 1e12) giveAchievement("Multidimensional");
    if (player.tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
    if (player.tickspeed.lt(1e-55)) giveAchievement("Faster than a squared potato");
    if (Math.random() < 0.00001) giveAchievement("Do you feel lucky? Well do ya punk?")
    if ((player.matter.gte(2.586e15) && player.currentChallenge == "postc6") || player.matter.gte(Number.MAX_VALUE)) giveAchievement("It's not called matter dimensions is it?")

    document.getElementById("dilationTabbtn").style.display = (player.dilation.studies.includes(1)) ? "inline-block" : "none"
    updateDilationUpgradeButtons()

    if (player.infinityDimension1.baseAmount == 0 &&
        player.infinityDimension2.baseAmount == 0 &&
        player.infinityDimension3.baseAmount == 0 &&
        player.infinityDimension4.baseAmount == 0 &&
        player.infinityDimension5.baseAmount == 0 &&
        player.infinityDimension6.baseAmount == 0 &&
        player.infinityDimension7.baseAmount == 0 &&
        player.infinityDimension8.baseAmount == 0 &&
        player.infMultCost.equals(10) &&
        player.infinityPoints.gt(new Decimal("1e200000"))) {
        giveAchievement("I never liked this infinity stuff anyway")
    }

    if (player.replicanti.amount.gt(new Decimal("1e20000"))) giveAchievement("When will it be enough?")
    if (player.tickspeed.e < -8296262) giveAchievement("Faster than a potato^286078")
    if (player.timestudy.studies.length == 0 && player.dilation.active && player.infinityPoints.e >= 28000) giveAchievement("This is what I have to do to get rid of you.")
    if (player.secretUnlocks.why >= 1e5) giveAchievement("Should we tell them about buy max...")
    if ( player.realities > 0 || player.dilation.studies.includes(6)) $("#realitybtn").show()
    else $("#realitybtn").hide()

    updateAchievements()
    if (player.realities > 0) document.getElementById("nextAchAt").textContent = "Next achievement in " + timeDisplay(nextAchIn(), false)
    else document.getElementById("nextAchAt").textContent = ""

    $("#timeForAchievements").text("You will gain your achievements back over the span of " + timeDisplay(60000 * 24 * DAYS_FOR_ALL_ACHS * 60 * Math.pow(0.9, Math.max(player.realities, 0)) ) )

    if (player.realities > 3) {
        $("#automatorUnlock").hide()
        $(".automator-container").show()
    } else {
        $("#automatorUnlock").show()
        $(".automator-container").hide()
    }

    updateRealityUpgrades()

}, 1000)

var postC2Count = 0;
var IPminpeak = new Decimal(0)
var EPminpeak = new Decimal(0)
var replicantiTicks = 0


function gameLoop(diff) {
    var thisUpdate = new Date().getTime();
    if (thisUpdate - player.lastUpdate >= 21600000) giveAchievement("Don't you dare to sleep")
    if (typeof diff === 'undefined') var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
    if (diff < 0) diff = 1;
    if (player.wormhole.active) diff *= player.wormhole.power
    if (player.currentEternityChall === "eterc12") diff = diff / 1000;
    var speedMod = 1
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "time" && glyph.effects.speed !== undefined) {
            diff *= glyph.effects.speed
            speedMod = glyph.effects.speed
        }
    }
    if (player.wormhole.active) speedMod *= player.wormhole.power
    if (player.thisInfinityTime < -10) player.thisInfinityTime = Infinity
    if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity
    if (diff/100 > player.autoTime && !player.break) player.infinityPoints = player.infinityPoints.plus(player.autoIP.times((diff/100)/player.autoTime))
    /*if (player.currentChallenge == "postc6" && player.matter.gte(1)) player.matter = player.matter.plus(diff/10)
    else */
    player.matter = player.matter.times(Decimal.pow((1.03 + player.resets/200 + player.galaxies/100), diff/100));
    if (player.matter.gt(player.money) && (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1")) {
        if (player.resets > 0) player.resets--;
        softReset(0);
    }

    if (player.currentChallenge == "postc8") postc8Mult = postc8Mult.times(Math.pow(0.000000046416, diff/100))

    if (player.currentChallenge == "challenge3" || player.matter.gte(1)) player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff/100));
    player.chall2Pow = Math.min(player.chall2Pow + diff/100/1800, 1);
    if (player.currentChallenge == "postc2") {
        postC2Count++;
        if (postC2Count >= 8 || diff > 8000) {
            sacrifice();
            postC2Count = 0;
        }
    }
    if (player.infinityUpgrades.includes("passiveGen")) player.partInfinityPoint += diff / player.bestInfinityTime;
    if (player.partInfinityPoint >= 100) {
        player.infinityPoints = player.infinityPoints.plus(player.infMult.times(kongIPMult * (isAchEnabled("r85") ? 4 : 1) * (isAchEnabled("r93") ? 4 : 1) * (player.partInfinityPoint/10)));
        player.partInfinityPoint = 0;
    }

    if (player.partInfinityPoint >= 10) {
        player.partInfinityPoint -= 10;
        player.infinityPoints = player.infinityPoints.plus(player.infMult.times(kongIPMult * (isAchEnabled("r85") ? 4 : 1) * (isAchEnabled("r93") ? 4 : 1)));
    }



    if (player.infinityUpgrades.includes("infinitiedGeneration") && player.currentEternityChall !== "eterc4") player.partInfinitied += diff / player.bestInfinityTime;
    if (player.partInfinitied >= 50) {
        player.infinitied += Math.floor(player.partInfinitied/5)
        player.partInfinitied = 0;
    }

    if (player.partInfinitied >= 5) {
        player.partInfinitied -= 5;
        player.infinitied ++;
    }

    player.infinityPoints = player.infinityPoints.plus(bestRunIppm.times(player.offlineProd/100).times(diff/60000))

    if (player.money.lte(Number.MAX_VALUE) || (player.break && player.currentChallenge == "") || (player.currentChallenge != "" && player.money.lte(player.challengeTarget))) {

        if (player.currentChallenge != "challenge7" && player.currentEternityChall != "eterc3") {
            for (let tier = 7; tier >= 1; --tier) {
                var name = TIER_NAMES[tier];

                player[name + 'Amount'] = player[name + 'Amount'].plus(getDimensionProductionPerSecond(tier + 1).times(diff / 10000));
            }
        } else if (player.currentEternityChall != "eterc3") {
            for (let tier = 6; tier >= 1; --tier) {
                var name = TIER_NAMES[tier];

                player[name + 'Amount'] = player[name + 'Amount'].plus(getDimensionProductionPerSecond(tier + 2).times(diff / 10000));
            }
        } else {
            for (let tier = 3; tier >= 1; --tier) {
                var name = TIER_NAMES[tier];

                player[name + 'Amount'] = player[name + 'Amount'].plus(getDimensionProductionPerSecond(tier + 1).times(diff / 10000));
            }
        }

        if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") {
            player.money = player.money.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
        } else {
            player.money = player.money.plus(getDimensionProductionPerSecond(1).times(diff/1000));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(1).times(diff/1000));
        }
        if (player.currentChallenge == "challenge7") {
            player.money = player.money.plus(getDimensionProductionPerSecond(2).times(diff/1000));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(2).times(diff/1000))
        }
    }

    document.getElementById("dimTabButtons").style.display = "none"

    if (player.currentEternityChall === "eterc12") player.realTimePlayed += diff*1000 / speedMod
    else player.realTimePlayed += diff / speedMod
    player.totalTimePlayed += diff
    player.thisInfinityTime += diff
    player.thisEternity += diff
    player.thisReality += diff

    if (player.eternities > 0) document.getElementById("tdtabbtn").style.display = "inline-block"

    for (let tier=1;tier<9;tier++) {
        if (tier != 8 && (player.infDimensionsUnlocked[tier-1] || ECTimesCompleted("eterc7") > 0)) player["infinityDimension"+tier].amount = player["infinityDimension"+tier].amount.plus(DimensionProduction(tier+1).times(diff/10000))
        if (player.infDimensionsUnlocked[tier-1]) {
            document.getElementById("infRow"+tier).style.display = "inline-block"
            document.getElementById("dimTabButtons").style.display = "inline-block"
            var idtabshown = true;
        } else {
            document.getElementById("infRow"+tier).style.display = "none"
            document.getElementById("idtabbtn").style.display = "none"
        }
        if (idtabshown === true || player.eternities >= 1) {
            document.getElementById("idtabbtn").style.display = "inline-block"
        }

        if (tier <8) player["timeDimension"+tier].amount = player["timeDimension"+tier].amount.plus(getTimeDimensionProduction(tier+1).times(diff/10000))
    }

    if (player.infinitied > 0 && player.eternities < 1) {
        document.getElementById("dimTabButtons").style.display = "inline-block"
        document.getElementById("dtabbtn").style.display = "inline-block"
        document.getElementById("prodtabbtn").style.display = "inline-block"
    }
    if (player.eternities > 0) document.getElementById("dimTabButtons").style.display = "inline-block"

    if (player.currentEternityChall !== "eterc7") player.infinityPower = player.infinityPower.plus(DimensionProduction(1).times(diff/1000))
    else if (player.currentChallenge !== "challenge4" && player.currentChallenge !== "postc1") player.seventhAmount = player.seventhAmount.plus(DimensionProduction(1).times(diff/1000))




    if (player.currentEternityChall == "eterc7") player.infinityDimension8.amount = player.infinityDimension8.amount.plus(getTimeDimensionProduction(1).times(diff/1000))
    else player.timeShards = player.timeShards.plus(getTimeDimensionProduction(1).times(diff/1000))

    if (getTimeDimensionProduction(1).gt(0) && ECTimesCompleted("eterc7") > 0 && player.currentEternityChall !== "eterc12") player.infinityDimension8.amount = player.infinityDimension8.amount.plus(getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).minus(1).times(diff/1000))

    let gain;
    var tickmult = 1.33;
    if (player.timestudy.studies.includes(171)) tickmult = 1.25;
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i];
        if (glyph.type == "time" && glyph.effects.freeTickMult !== undefined) tickmult = 1+(tickmult-1)*glyph.effects.freeTickMult;
    }
    if (player.timeShards.gt(0)) {
        gain = Math.ceil(new Decimal(player.timeShards).dividedBy(player.tickThreshold).log10() / Math.log10(tickmult))
        player.totalTickGained += gain
        player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), gain))
        player.tickThreshold = new Decimal(1).times(tickmult).pow(player.totalTickGained)
        document.getElementById("totaltickgained").textContent = "You've gained "+player.totalTickGained.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
        updateTickSpeed();
    }

    if (player.eternities == 0) {
        document.getElementById("eternityPoints2").style.display = "none"
    }
    else {
        document.getElementById("eternityPoints2").style.display = "inline-block"
    }


    if (player.money.gte(Number.MAX_VALUE) && (!player.break || (player.currentChallenge != "" && player.money.gte(player.challengeTarget)))) {
        document.getElementById("bigcrunch").style.display = 'inline-block';
        if ((player.currentChallenge == "" || player.options.retryChallenge) && (player.bestInfinityTime <= 600 || player.break)) {}
        else showTab('emptiness');
    } else document.getElementById("bigcrunch").style.display = 'none';

    if (player.break && player.money.gte(Number.MAX_VALUE) && player.currentChallenge == "") {
        document.getElementById("postInfinityButton").style.display = "inline-block"
    } else {
        document.getElementById("postInfinityButton").style.display = "none"
    }


    if (player.break) document.getElementById("iplimit").style.display = "inline"
    else document.getElementById("iplimit").style.display = "none"

    var currentIPmin = gainedInfinityPoints().dividedBy(player.thisInfinityTime/60000)
    if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin
    if (IPminpeak.lte("1e100000")) document.getElementById("postInfinityButton").innerHTML = "<b>Big Crunch for "+shortenDimensions(gainedInfinityPoints())+" Infinity Points.</b><br>"+shortenDimensions(currentIPmin) + " IP/min"+"<br>Peaked at "+shortenDimensions(IPminpeak)+" IP/min"
    else document.getElementById("postInfinityButton").innerHTML = "<b>Big Crunch for "+shortenDimensions(gainedInfinityPoints())+" Infinity Points.</b>"

    if (nextAt[player.postChallUnlocked] === undefined) document.getElementById("nextchall").textContent = " "
    else document.getElementById("nextchall").textContent = "Next challenge unlocks at "+ shortenCosts(nextAt[player.postChallUnlocked]) + " antimatter."
    while (player.money.gte(nextAt[player.postChallUnlocked]) && player.challenges.includes("postc8") === false && player.postChallUnlocked != 8) {
        if (player.postChallUnlocked != 8) player.postChallUnlocked += 1
        if (player.eternities > 6) player.challenges.push("postc"+player.postChallUnlocked)
        updateChallenges()
    }
    replicantiLoop(diff)


    if (player.infMultBuyer) {
        var dif = player.infinityPoints.e - player.infMultCost.e +1
        if (dif > 0) {
            player.infMult = player.infMult.times(Decimal.pow(2, dif))
            player.infMultCost = player.infMultCost.times(Decimal.pow(10, dif))
            document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
            player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(10))
            if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(Decimal.pow(2, dif));
            if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = player.autobuyers[11].priority
        }
    }

    var currentEPmin = gainedEternityPoints().dividedBy(player.thisEternity/60000)
    if (currentEPmin.gt(EPminpeak) && player.infinityPoints.gte(Number.MAX_VALUE)) EPminpeak = currentEPmin
    document.getElementById("eternitybtn").innerHTML = (player.eternities == 0) ? "Other times await.. I need to become Eternal" : "<b>I need to become Eternal.</b><br>"+"Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+shortenDimensions(currentEPmin)+ " EP/min<br>Peaked at "+shortenDimensions(EPminpeak)+" EP/min"
    if (gainedEternityPoints().gte(1e6)) document.getElementById("eternitybtn").innerHTML = "Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+shortenDimensions(currentEPmin)+ " EP/min<br>Peaked at "+shortenDimensions(EPminpeak)+" EP/min"
    if (player.dilation.active) document.getElementById("eternitybtn").innerHTML = "Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+"+"+shortenMoney(getTachyonGain()) +" Tachyon particles."
    if (player.currentEternityChall !== "") document.getElementById("eternitybtn").textContent = "Other challenges await.. I need to become Eternal"
    updateMoney();
    updateCoinPerSec();
    updateDimensions()
    updateInfCosts()
    updateInfinityDimensions();
    updateInfPower();
    updateTimeDimensions()
    updateTimeShards()
    updateDilation()
    if (getDimensionProductionPerSecond(1).gt(player.money) && !isAchEnabled("r44")) {
        Marathon+=player.options.updateRate/1000;
        if (Marathon >= 30) giveAchievement("Over in 30 seconds");
    } else {
        Marathon = 0;
    }
    if (DimensionProduction(1).gt(player.infinityPower) && player.currentEternityChall != "eterc7" && !isAchEnabled("r113")) {
        Marathon2+=player.options.updateRate/1000;
        if (Marathon2 >= 60) giveAchievement("Long lasting relationship");
    } else {
        Marathon2 = 0;
    }
    if (player.eternities >= 1 && (player.options.notation == "Standard" || player.options.notation == "Cancer" || player.options.notation == "Brackets")) {
        player.secretUnlocks.painTimer += player.options.updateRate/1000;
        if (player.secretUnlocks.painTimer >= 600) giveAchievement("Do you enjoy pain?");
    }
    if (document.getElementById("statistics").style.display !== "none") {
        statsTimer += player.options.updateRate/1000;
        if (statsTimer >= 900) giveAchievement("Are you statisfied now?");
    }

    if(player.money.gt(Math.pow(10,63))) giveAchievement("Supersanic");

    for (let tier = 1; tier <= 8; ++tier) {
        var name = TIER_NAMES[tier];
        if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
            document.getElementById(name).className = canAfford(player[name + 'Cost']) ? 'storebtn' : 'unavailablebtn';
            document.getElementById(name + 'Max').className = canAfford(player[name + 'Cost'].times(10 - dimBought(tier))) ? 'storebtn' : 'unavailablebtn';
        } else {
            if (tier >= 3) {
                document.getElementById(name).className = player[TIER_NAMES[tier-2] + 'Amount'].gte(player[name + 'Cost']) ? 'storebtn' : 'unavailablebtn';
                document.getElementById(name + 'Max').className = player[TIER_NAMES[tier-2] + 'Amount'].gte(player[name + 'Cost'].times(10 - dimBought(tier))) ? 'storebtn' : 'unavailablebtn';
            } else {
                document.getElementById(name).className = canAfford(player[name + 'Cost']) ? 'storebtn' : 'unavailablebtn';
                document.getElementById(name + 'Max').className = canAfford(player[name + 'Cost'].times(10 - dimBought(tier))) ? 'storebtn' : 'unavailablebtn';
            }
        }
    }
    if (player.firstAmount.lt(1)) document.getElementById("first").className = 'storebtn';

    for (var tier = 1; tier < 9; tier++) {
        if (player.infinityPoints.gte(player["infinityDimension"+tier].cost)) document.getElementById("infMax"+tier).className = "storebtn"
        else document.getElementById("infMax"+tier).className = "unavailablebtn"
    }

    for (var tier = 1; tier < 9; tier++) {
        if (player.eternityPoints.gte(player["timeDimension"+tier].cost)) document.getElementById("timeMax"+tier).className = "storebtn"
        else document.getElementById("timeMax"+tier).className = "unavailablebtn"
    }

    if (player.dilation.studies.includes(1)) player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond()*diff/1000)

    if (player.dilation.nextThreshold.lte(player.dilation.dilatedTime)) {
        let thresholdMult = 3.65 * Math.pow(0.8, player.dilation.rebuyables[2])
        for (i in player.reality.glyphs.active) {
            var glyph = player.reality.glyphs.active[i]
            if (glyph.type == "dilation" && glyph.effects.galaxyThreshold !== undefined) thresholdMult = thresholdMult.times(glyph.effects.galaxyThreshold)
        }

        thresholdMult += 1.35
        // for (var i = 0; i < player.dilation.rebuyables[2]; i++) {
        //     thresholdMult *= Math.min( 1 - (Math.pow(0.8, i) / 10), 0.999)
        // }
        player.dilation.nextThreshold = player.dilation.nextThreshold.times(thresholdMult)
        player.dilation.freeGalaxies += 1
        if (player.dilation.upgrades.includes(4)) player.dilation.freeGalaxies += 1
    }

    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "dilation" && glyph.effects.TTgen !== undefined) player.timestudy.theorem = player.timestudy.theorem.plus(glyph.effects.TTgen*diff/1000)
    }



    if (canAfford(player.tickSpeedCost)) {
        document.getElementById("tickSpeed").className = 'storebtn';
        document.getElementById("tickSpeedMax").className = 'storebtn';
    } else {
        document.getElementById("tickSpeed").className = 'unavailablebtn';
        document.getElementById("tickSpeedMax").className = 'unavailablebtn';
    }

    if (player.infinityPoints.gt(0) || player.eternities !== 0) {
        document.getElementById("infinitybtn").style.display = "block";
        document.getElementById("infi11").className = "infinistorebtn1"
        document.getElementById("infi21").className = "infinistorebtn2"
        if (player.infinityUpgrades.includes("timeMult")) document.getElementById("infi12").className = "infinistorebtn1"
        else document.getElementById("infi12").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("dimMult")) document.getElementById("infi22").className = "infinistorebtn2"
        else document.getElementById("infi22").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("18Mult")) document.getElementById("infi13").className = "infinistorebtn1"
        else document.getElementById("infi13").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("27Mult")) document.getElementById("infi23").className = "infinistorebtn2"
        else document.getElementById("infi23").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("36Mult")) document.getElementById("infi14").className = "infinistorebtn1"
        else document.getElementById("infi14").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("45Mult") && player.infinityPoints.gte(2)) document.getElementById("infi24").className = "infinistorebtn2"
        else document.getElementById("infi24").className = "infinistorebtnlocked"
        if (player.infinityPoints.gte(3)) document.getElementById("infi31").className = "infinistorebtn3"
        else document.getElementById("infi31").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("timeMult2") && player.infinityPoints.gte(5)) document.getElementById("infi32").className = "infinistorebtn3"
        else document.getElementById("infi32").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("unspentBonus") && player.infinityPoints.gte(7)) document.getElementById("infi33").className = "infinistorebtn3"
        else document.getElementById("infi33").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("resetMult") && player.infinityPoints.gte(10)) document.getElementById("infi34").className = "infinistorebtn3"
        else document.getElementById("infi34").className = "infinistorebtnlocked"
        if (player.infinityPoints.gte(20)) document.getElementById("infi41").className = "infinistorebtn4"
        else document.getElementById("infi41").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("skipReset1") && player.infinityPoints.gte(40)) document.getElementById("infi42").className = "infinistorebtn4"
        else document.getElementById("infi42").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("skipReset2") && player.infinityPoints.gte(80)) document.getElementById("infi43").className = "infinistorebtn4"
        else document.getElementById("infi43").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("skipReset3") && player.infinityPoints.gte(500)) document.getElementById("infi44").className = "infinistorebtn4"
        else document.getElementById("infi44").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost)) {
            document.getElementById("infiMult").className = "infinimultbtn"
        } else document.getElementById("infiMult").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(1e4)) document.getElementById("postinfi11").className = "infinistorebtn1"
        else document.getElementById("postinfi11").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(5e4)) document.getElementById("postinfi21").className = "infinistorebtn1"
        else document.getElementById("postinfi21").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(player.tickSpeedMultDecreaseCost)) document.getElementById("postinfi31").className = "infinimultbtn"
        else document.getElementById("postinfi31").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(5e11)) document.getElementById("postinfi41").className = "infinistorebtn1"
        else document.getElementById("postinfi41").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(1e5)) document.getElementById("postinfi12").className = "infinistorebtn1"
        else document.getElementById("postinfi12").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(1e6)) document.getElementById("postinfi22").className = "infinistorebtn1"
        else document.getElementById("postinfi22").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(1e7)) document.getElementById("postinfi32").className = "infinistorebtn1"
        else document.getElementById("postinfi32").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(player.dimensionMultDecreaseCost)) document.getElementById("postinfi42").className = "infinimultbtn"
        else document.getElementById("postinfi42").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(20e6)) document.getElementById("postinfi13").className = "infinistorebtn1"
        else document.getElementById("postinfi13").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(5e9)) document.getElementById("postinfi23").className = "infinistorebtn1"
        else document.getElementById("postinfi23").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(1e15)) document.getElementById("postinfi33").className = "infinistorebtn1"
        else document.getElementById("postinfi33").className = "infinistorebtnlocked"

        if (player.infinityPoints.gte(player.offlineProdCost)) document.getElementById("offlineProd").className = "infinimultbtn"
        else document.getElementById("offlineProd").className = "infinistorebtnlocked"

    }
    if (player.infinityPoints.equals(0)){
        document.getElementById("infi11").className = "infinistorebtnlocked"
        document.getElementById("infi12").className = "infinistorebtnlocked"
        document.getElementById("infi13").className = "infinistorebtnlocked"
        document.getElementById("infi14").className = "infinistorebtnlocked"
        document.getElementById("infi21").className = "infinistorebtnlocked"
        document.getElementById("infi22").className = "infinistorebtnlocked"
        document.getElementById("infi23").className = "infinistorebtnlocked"
        document.getElementById("infi24").className = "infinistorebtnlocked"
        document.getElementById("infi31").className = "infinistorebtnlocked"
        document.getElementById("infi32").className = "infinistorebtnlocked"
        document.getElementById("infi33").className = "infinistorebtnlocked"
        document.getElementById("infi34").className = "infinistorebtnlocked"
        document.getElementById("infi41").className = "infinistorebtnlocked"
        document.getElementById("infi42").className = "infinistorebtnlocked"
        document.getElementById("infi43").className = "infinistorebtnlocked"
        document.getElementById("infi44").className = "infinistorebtnlocked"
        document.getElementById("infiMult").className = "infinistorebtnlocked"

    }

    if (player.autobuyers[11]%1 === 0 || player.autobuyers[11].interval>100) document.getElementById("break").className = "infinistorebtnlocked"
    else document.getElementById("break").className = "infinistorebtn2"


    if (player.resets > 4) {
        document.getElementById("confirmation").style.display = "inline-block";
        document.getElementById("sacrifice").style.display = "inline-block";
    } else {
        document.getElementById("confirmation").style.display = "none";
        document.getElementById("sacrifice").style.display = "none";
    }

    if (player.infinitied > 0) document.getElementById("sacrifice").style.display = "inline-block";

    if (player.eightAmount > 0 && player.resets > 4 && player.currentEternityChall !== "eterc3") document.getElementById("sacrifice").className = "storebtn"
    else document.getElementById("sacrifice").className = "unavailablebtn"

    if (player.autobuyers[11]%1 !== 0 && player.autobuyers[11].interval == 100) {
        document.getElementById("postinftable").style.display = "inline-block"
    } else {
        document.getElementById("postinftable").style.display = "none"
    }

    if (player.autobuyers[11].interval == 100) document.getElementById("abletobreak").style.display = "none"


    document.getElementById("infinitybtn").style.display = "none";
    document.getElementById("challengesbtn").style.display = "none";

    if (player.money.gte(Number.MAX_VALUE) && (((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) && !player.options.retryChallenge) || (player.bestInfinityTime > 600 && !player.break))) {
        document.getElementById("dimensionsbtn").style.display = "none";
        document.getElementById("optionsbtn").style.display = "none";
        document.getElementById("statisticsbtn").style.display = "none";
        document.getElementById("achievementsbtn").style.display = "none";
        document.getElementById("challengesbtn").style.display = "none";
        document.getElementById("infinitybtn").style.display = "none";
        document.getElementById("tickSpeed").style.visibility = "hidden";
        document.getElementById("tickSpeedMax").style.visibility = "hidden";
        document.getElementById("tickLabel").style.visibility = "hidden";
        document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    } else {
        document.getElementById("dimensionsbtn").style.display = "inline-block";
        document.getElementById("optionsbtn").style.display = "inline-block";
        document.getElementById("statisticsbtn").style.display = "inline-block";
        document.getElementById("achievementsbtn").style.display = "inline-block";
        if (player.infinitied > 0) {
            document.getElementById("infinitybtn").style.display = "inline-block";
            document.getElementById("challengesbtn").style.display = "inline-block";
        }
    }

    document.getElementById("epmult").className = player.eternityPoints.gte(player.epmultCost) ? "eternityupbtn" : "eternityupbtnlocked"

    if (player.infinityUpgrades.includes("bulkBoost")) document.getElementById("bulkdimboost").style.display = "inline"
    else document.getElementById("bulkdimboost").style.display = "none"

    if (player.infinityUpgrades.includes("timeMult")) document.getElementById("infi11").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("dimMult")) document.getElementById("infi21").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("18Mult")) document.getElementById("infi12").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("27Mult")) document.getElementById("infi22").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("36Mult")) document.getElementById("infi13").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("45Mult")) document.getElementById("infi23").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("resetBoost")) document.getElementById("infi14").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("galaxyBoost")) document.getElementById("infi24").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("timeMult2")) document.getElementById("infi31").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("unspentBonus")) document.getElementById("infi32").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("resetMult")) document.getElementById("infi33").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("passiveGen")) document.getElementById("infi34").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("skipReset1")) document.getElementById("infi41").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("skipReset2")) document.getElementById("infi42").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("skipReset3")) document.getElementById("infi43").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("skipResetGalaxy")) document.getElementById("infi44").className = "infinistorebtnbought"

    if (player.infinityUpgrades.includes("totalMult")) document.getElementById("postinfi11").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("currentMult")) document.getElementById("postinfi21").className = "infinistorebtnbought"
    if (player.tickSpeedMultDecrease <= 2) document.getElementById("postinfi31").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("achievementMult")) document.getElementById("postinfi22").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("infinitiedMult")) document.getElementById("postinfi12").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("postGalaxy")) document.getElementById("postinfi41").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("challengeMult")) document.getElementById("postinfi32").className = "infinistorebtnbought"
    if (player.dimensionMultDecrease <= 3) document.getElementById("postinfi42").className = "infinistorebtnbought"
    if (player.offlineProd == 50) document.getElementById("offlineProd").className = "infinistorebtnbought"


    if (player.infinityUpgrades.includes("infinitiedGeneration")) document.getElementById("postinfi13").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("bulkBoost")) document.getElementById("postinfi23").className = "infinistorebtnbought"
    if (player.infinityUpgrades.includes("autoBuyerUpgrade")) document.getElementById("postinfi33").className = "infinistorebtnbought"

    if (player.currentChallenge !== "") {
        document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
        document.getElementById("progresspercent").textContent = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(player.challengeTarget) * 100), 100).toFixed(2) + "%"
        document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to challenge goal")
    } else if (!player.break) {
        document.getElementById("progressbar").style.width = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
        document.getElementById("progresspercent").textContent = Decimal.min((Decimal.log10(player.money.plus(1)) / Decimal.log10(Number.MAX_VALUE) * 100), 100).toFixed(2) + "%"
        document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to Infinity")
    } else if (player.infDimensionsUnlocked.includes(false)) {
        document.getElementById("progressbar").style.width = Decimal.min(player.money.e / getNewInfReq().e * 100, 100).toFixed(2) + "%"
        document.getElementById("progresspercent").textContent = Decimal.min(player.money.e / getNewInfReq().e * 100, 100).toFixed(2) + "%"
        document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to next dimension unlock")
    } else {
        document.getElementById("progressbar").style.width = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(Number.MAX_VALUE)  * 100, 100).toFixed(2) + "%"
        document.getElementById("progresspercent").textContent = Decimal.min(Decimal.log10(player.infinityPoints.plus(1)) / Decimal.log10(Number.MAX_VALUE)  * 100, 100).toFixed(2) + "%"
        document.getElementById("progresspercent").setAttribute('ach-tooltip',"Percentage to Eternity")
    }

    if (player.eternities > 0) {
        document.getElementById("infinitybtn").style.display = "inline-block";
        document.getElementById("challengesbtn").style.display = "inline-block";
    }

    document.getElementById("ec1reward").textContent = "Reward: "+shortenMoney(Math.pow(Math.max(player.thisEternity*10, 1), 0.3+(ECTimesCompleted("eterc1")*0.05)))+"x on all Time Dimensions (based on time spent this Eternity)"
    document.getElementById("ec2reward").textContent = "Reward: Infinity power affects 1st Infinity Dimension with reduced effect, Currently: "+shortenMoney(player.infinityPower.pow(1.5/(700 - ECTimesCompleted("eterc2")*100)).min(new Decimal("1e100")).max(1))+"x"
    document.getElementById("ec3reward").textContent = "Reward: Increase the multiplier for buying 10 dimensions, Currently: "+getDimensionPowerMultiplier().toFixed(2)+"x"
    document.getElementById("ec4reward").textContent = "Reward: Infinity Dimension multiplier from unspent IP, Currently: "+shortenMoney(player.infinityPoints.pow(0.003 + ECTimesCompleted("eterc4")*0.002).min(new Decimal("1e200")))+"x"
    document.getElementById("ec5reward").textContent = "Reward: Galaxy cost scaling starts "+((ECTimesCompleted("eterc5")*5))+" galaxies later."
    document.getElementById("ec6reward").textContent = "Reward: Further reduce the dimension cost multiplier increase, Currently: "+player.dimensionMultDecrease.toFixed(1)+"x "
    document.getElementById("ec7reward").textContent = "Reward: First Time dimension produces Eighth Infinity Dimensions, Currently: "+shortenMoney(getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).minus(1).max(0))+" per second. "
    document.getElementById("ec8reward").textContent = "Reward: Infinity power powers up replicanti galaxies, Currently: " + (Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8"))-1, 0) * 100).toFixed(2) + "%"
    document.getElementById("ec9reward").textContent = "Reward: Infinity Dimension multiplier based on time shards, Currently: "+shortenMoney(player.timeShards.pow(ECTimesCompleted("eterc9")*0.1).min(new Decimal("1e400")))+"x "
    document.getElementById("ec10reward").textContent = "Reward: Time dimensions gain a multiplier from infinitied stat, Currently: "+shortenMoney(new Decimal(Math.max(Math.pow(getInfinitied(), 0.9) * ECTimesCompleted("eterc10") * 0.000002+1, 1)).pow((player.timestudy.studies.includes(31)) ? 4 : 1))+"x "
    document.getElementById("ec11reward").textContent = "Reward: Further reduce the tickspeed cost multiplier increase, Currently: "+player.tickSpeedMultDecrease.toFixed(2)+"x "
    document.getElementById("ec12reward").textContent = "Reward: Infinity Dimension cost multipliers are reduced. (x^"+(1-ECTimesCompleted("eterc12")*0.008)+")"

    // let extraGals = 0
    // if (player.timestudy.studies.includes(225)) extraGals += Math.floor(player.replicanti.amount.e / 2500)
    // if (player.timestudy.studies.includes(226)) extraGals += Math.floor(player.replicanti.gal / 40)
    // if (extraGals !== 0) document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + "+"+extraGals+ " replicated galaxies created."
    // else document.getElementById("replicantireset").innerHTML = "Reset replicanti amount, but get a free galaxy<br>"+player.replicanti.galaxies + " replicated galaxies created."

    document.getElementById("ec10span").textContent = shortenMoney(ec10bonus) + "x"
    var scale1 = [2.82e-45,1e-42,7.23e-30,5e-21,9e-17,6.2e-11,5e-8,3.555e-6,7.5e-4,1,2.5e3,2.6006e6,3.3e8,5e12,4.5e17,1.08e21,1.53e24,1.41e27,5e32,8e36,1.7e45,1.7e48,3.3e55,3.3e61,5e68,1e73,3.4e80,1e113,Number.MAX_VALUE,new Decimal("1e65000")];
    var scale2 = [" protons."," nucleui."," Hydrogen atoms."," viruses."," red blood cells."," grains of sand."," grains of rice."," teaspoons."," wine bottles."," fridge-freezers."," Olympic-sized swimming pools."," Great Pyramids of Giza."," Great Walls of China."," large asteroids.",
                " dwarf planets."," Earths."," Jupiters."," Suns."," red giants."," hypergiant stars."," nebulas."," Oort clouds."," Local Bubbles."," galaxies."," Local Groups."," Sculptor Voids."," observable universes."," Dimensions.", " Infinity Dimensions.", " Time Dimensions."];
    var id = 0;
    if (player.money.times(4.22419e-105).gt(2.82e-45)) {
        if (player.money.times(4.22419e-105).gt(scale1[scale1.length - 1])) id = scale1.length - 1;
        else {
            while (player.money.times(4.22419e-105).gt(scale1[id])) id++;
            if (id > 0) id--;
        }
        if (id >= 7 && id < 11) document.getElementById("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to fill " + formatValue(player.options.notation, player.money * 4.22419e-105 / scale1[id], 2, 1) + scale2[id];
        else document.getElementById("infoScale").textContent = "If every antimatter were a planck volume, you would have enough to make " + formatValue(player.options.notation, player.money.times(4.22419e-105).dividedBy(scale1[id]), 2, 1) + scale2[id];
    } else { //does this part work correctly? i doubt it does
        if (player.money.times(1e-54) < 2.82e-45) document.getElementById("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-54 / player.money, 2, 1) + " attometers cubed, you would have enough to make a proton."
        else if (player.money * 1e-63 < 2.82e-45) document.getElementById("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-63 / player.money, 2, 1) + " zeptometers cubed, you would have enough to make a proton."
        else if (player.money * 1e-72 < 2.82e-45) document.getElementById("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 1e-72 / player.money, 2, 1) + " yoctometers cubed, you would have enough to make a proton."
        else document.getElementById("infoScale").textContent = "If every antimatter were " + formatValue(player.options.notation,2.82e-45 / 4.22419e-105 / player.money, 2, 1) + " planck volumes, you would have enough to make a proton."
    }
    if (player.money.gt(new Decimal("1e100000"))) {
        document.getElementById("infoScale").innerHTML = "<br>If you wrote 3 numbers a second, it would take you <br>" + timeDisplay(player.money.log10()*1000/3) + "<br> to write down your antimatter amount.";
    }

    var shiftRequirement = getShiftRequirement(0);

    if (player[TIER_NAMES[shiftRequirement.tier] + 'Amount'] >= shiftRequirement.amount) {
        document.getElementById("softReset").className = 'storebtn';
    } else {
        document.getElementById("softReset").className = 'unavailablebtn';
    }

    if (player.eightAmount >= getGalaxyRequirement()) {
        document.getElementById("secondSoftReset").className = 'storebtn';
    } else {
        document.getElementById("secondSoftReset").className = 'unavailablebtn';
    }

    if (player.currentChallenge == "challenge4" && player.sixthAmount >= getGalaxyRequirement()) {
        document.getElementById("secondSoftReset").className = 'storebtn';
    }

    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") document.getElementById("chall2Pow").style.display = "inline-block"
    else document.getElementById("chall2Pow").style.display = "none"
    if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") document.getElementById("chall3Pow").style.display = "inline-block"
    else document.getElementById("chall3Pow").style.display = "none"

    document.getElementById("chall2Pow").textContent = (player.chall2Pow*100).toFixed(2) + "%"
    document.getElementById("chall3Pow").textContent = shorten(player.chall3Pow*100) + "%"


    if (player.infDimensionsUnlocked[7] == false && player.break && player.eternities <= 24) {
        document.getElementById("newDimensionButton").style.display = "inline-block"
    } else document.getElementById("newDimensionButton").style.display = "none"

    if (player.money.gte(getNewInfReq())) document.getElementById("newDimensionButton").className = "newdim"
    else document.getElementById("newDimensionButton").className = "newdimlocked"

    var infdimpurchasewhileloop = 1;
    while (player.eternities > 24 && getNewInfReq().lt(player.money) && player.infDimensionsUnlocked[7] === false) {
        for (i=0; i<8; i++) {
            if (player.infDimensionsUnlocked[i]) infdimpurchasewhileloop++
        }
        newDimension()
        if (player.infDimBuyers[i-1] && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc10") buyMaxInfDims(infdimpurchasewhileloop)
        infdimpurchasewhileloop = 1;
    }

    document.getElementById("newDimensionButton").textContent = "Get " + shortenCosts(getNewInfReq()) + " antimatter to unlock a new Dimension."

    document.getElementById("sacrifice").setAttribute('ach-tooltip', "Boosts 8th Dimension by " + formatValue(player.options.notation, calcSacrificeBoost(), 2, 2) + "x");

    document.getElementById("sacrifice").textContent = "Dimensional Sacrifice ("+formatValue(player.options.notation, calcSacrificeBoost(), 2, 2)+"x)"
    if (isNaN(player.totalmoney)) player.totalmoney = new Decimal(10)
    if (player.timestudy.studies.includes(181)) player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints().times(diff/100000))
    if (player.dilation.upgrades.includes(10)) {
        player.timestudy.theorem += parseFloat(player.dilation.tachyonParticles.div(20000).times(diff/1000).toString())
        if (document.getElementById("timestudies").style.display != "none" && document.getElementById("eternitystore").style.display != "none") {
            if (player.timestudy.theorem>99999) document.getElementById("timetheorems").innerHTML = "You have <span style='display:inline' class=\"TheoremAmount\">"+shortenMoney(player.timestudy.theorem)+"</span> Time "+"Theorems."
            else document.getElementById("timetheorems").innerHTML = "You have <span style='display:inline' class=\"TheoremAmount\">"+player.timestudy.theorem.toFixed(0)+"</span> Time "+ (player.timestudy.theorem == 1 ? "Theorem." : "Theorems.")
            updateTimeStudyButtons()
        }
    }

    document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
    document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity points."
    document.getElementById("realitymachine").innerHTML = "Make a new reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+" ("+percentToNextRealityMachine()+"%)<br>Glyph level: "+shortenDimensions(gainedGlyphLevel())+" ("+percentToNextGlyphLevel()+"%)"
    document.getElementById("realitymachines").innerHTML = "You have <span class=\"RMAmount1\">"+shortenDimensions(player.reality.realityMachines)+"</span> Reality Machines."
    if (player.wormhole.unlocked) wormHoleLoop(diff)

    player.lastUpdate = thisUpdate;
}

function simulateTime(seconds, real) {

    //the game is simulated at a base 50ms update rate, with a max of 1000 ticks. additional ticks are converted into a higher diff per tick
    //warning: do not call this function with real unless you know what you're doing
    document.getElementById("offlineprogress").style.display = "block"
    var ticks = seconds * 20;
    var bonusDiff = 0;
    var playerStart = Object.assign({}, player);
    if (ticks > 1000 && !real) {
        bonusDiff = (ticks - 1000) / 20;
        ticks = 1000;
    }
    let ticksDone = 0
    for (ticksDone=0; ticksDone<ticks; ticksDone++) {
        gameLoop(50+bonusDiff)
        autoBuyerTick();
        if (real) console.log(ticksDone)
    }
    var popupString = "While you were away"
    if (player.money.gt(playerStart.money)) popupString+= ",<br> your antimatter increased "+shortenMoney(player.money.log10() - (playerStart.money).log10())+" orders of magnitude"
    if (player.infinityPower.gt(playerStart.infinityPower)) popupString+= ",<br> infinity power increased "+shortenMoney(player.infinityPower.log10() - (Decimal.max(playerStart.infinityPower, 1)).log10())+" orders of magnitude"
    if (player.timeShards.gt(playerStart.timeShards)) popupString+= ",<br> time shards increased "+shortenMoney(player.timeShards.log10() - (Decimal.max(playerStart.timeShards, 1)).log10())+" orders of magnitude"
    if (player.infinitied > playerStart.infinitied || player.eternities > playerStart.eternities) popupString+= ","
    else popupString+= "."
    if (player.infinitied > playerStart.infinitied) popupString+= "<br>you infinitied "+(player.infinitied-playerStart.infinitied)+((player.infinitied-playerStart.infinitied === 1) ? " time." : " times.")
    if (player.eternities > playerStart.eternities) popupString+= " <br>you eternitied "+(player.eternities-playerStart.eternities)+((player.eternities-playerStart.eternities === 1) ? " time." : " times.")
    if (popupString === "While you were away.") {
        popupString+= ".. Nothing happened."
        giveAchievement("While you were away... Nothing happened.")
    }

    document.getElementById("offlinePopup").innerHTML = popupString
}

function startInterval() {
    gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
}

function enableChart() {
    if (document.getElementById("chartOnOff").checked) {
        player.options.chart.on = true;
        if (player.options.chart.warning < 1) alert("Warning: the chart can cause performance issues. Please disable it if you're experiencing lag.")
    } else {
        player.options.chart.on = false;
    }
}

function enableChartDips() {
    if (document.getElementById("chartDipsOnOff").checked) {
        player.options.chart.dips = true;
    } else {
        player.options.chart.dips = false;
    }
}

function updateChart(first) {
    if (first !== true && (player.infinitied >= 1 || player.eternities >= 1) && player.options.chart.on === true) {
        if (player.currentChallenge == "challenge3" || player.currentChallenge == "postc1") {
            addData(normalDimChart, "0", getDimensionProductionPerSecond(1).times(player.chall3Pow));
        } else {
            addData(normalDimChart, "0", getDimensionProductionPerSecond(1));
        }
    }
    if (player.options.chart.updateRate) {
        setTimeout(updateChart, player.options.chart.updateRate);
    } else {
        setTimeout(updateChart, 1000);
    }
}
updateChart(true);

var slider = document.getElementById("updaterateslider");
var sliderText = document.getElementById("updaterate");

slider.oninput = function() {
    player.options.updateRate = parseInt(this.value);
    sliderText.textContent = "Update rate: " + this.value + "ms"
    if (player.options.updateRate === 200) giveAchievement("You should download some more RAM")
    clearInterval(gameLoopIntervalId);
    gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
}

function dimBoolean() {
    var name = TIER_NAMES[getShiftRequirement(0).tier]
    if (!player.autobuyers[9].isOn) return false
    if (player.autobuyers[9].ticks*100 < player.autobuyers[9].interval) return false
    if (player[name + "Amount"] > getShiftRequirement(0)) return true
    if (player.eternities < 10 && player[name + "Amount"] < getShiftRequirement(player.autobuyers[9].bulk-1).amount) return false
    if (player.overXGalaxies <= player.galaxies) return true
    if ((player.currentChallenge =="challenge4" || player.currentChallenge == "postc1") && player.autobuyers[9].priority < getShiftRequirement(0).amount && getShiftRequirement(0).tier == 6) return false
    if (player.autobuyers[9].priority < getShiftRequirement(0).amount && getShiftRequirement(0).tier == 8) return false
    return true
}


function maxBuyGalaxies(manual) {
    if (player.currentEternityChall == "eterc6" || player.currentChallenge == "challenge11" || player.currentChallenge == "postc1" || player.currentChallenge == "postc7") return
    if (player.autobuyers[10].priority > player.galaxies || manual) {
        while(player.eightAmount >= getGalaxyRequirement() && (player.autobuyers[10].priority > player.galaxies || manual)) {
            if (player.options.notation == "Cancer") player.spreadingCancer+=1;
            player.galaxies++
        }
        player.galaxies--
        galaxyReset()
    }
}

function maxBuyDimBoosts(manual) {
    if (player.autobuyers[9].priority > player.resets || player.overXGalaxies <= player.galaxies || getShiftRequirement(0).tier < 8 || manual == true) {
        var r = 0;
        while(player[TIER_NAMES[getShiftRequirement(r).tier]+"Amount"] >= getShiftRequirement(r).amount && (player.autobuyers[9].priority > player.resets+r || player.overXGalaxies <= player.galaxies || getShiftRequirement(r).tier < 8 || manual == true)) r+=1;

        if (r >= 750) giveAchievement("Costco sells dimboosts now")
        if (r > 0) softReset(r)
    }

}

var timer = 0
function autoBuyerTick() {

    if (player.eternities >= 100 && player.eternityBuyer.isOn && gainedEternityPoints().gte(player.eternityBuyer.limit)) eternity(false, true)

    if (player.autobuyers[11]%1 !== 0) {
    if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money.gte(Number.MAX_VALUE)) {
        if (player.autobuyers[11].isOn) {
            if (player.autoCrunchMode == "amount") {
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.lt(gainedInfinityPoints())) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            } else if (player.autoCrunchMode == "time"){
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.lt(player.thisInfinityTime/1000)) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            } else {
                if (!player.break || player.currentChallenge != "" || gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(player.autobuyers[11].priority))) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            }
            player.autobuyers[11].ticks = 1;
        }
    } else player.autobuyers[11].ticks += 1;

    }


    if (player.autobuyers[10]%1 !== 0) {
        if (player.autobuyers[10].ticks*100 >= player.autobuyers[10].interval && (player.currentChallenge == "challenge4" ? player.sixthAmount >= getGalaxyRequirement() : player.eightAmount >= getGalaxyRequirement())) {
            if (player.eternities < 9 || player.autobuyers[10].bulk == 0) {
                if (player.autobuyers[10].isOn && player.autobuyers[10].priority > player.galaxies) {
                    autoS = false;
                    document.getElementById("secondSoftReset").click()
                    player.autobuyers[10].ticks = 1;
                }
            } else if (player.autobuyers[10].isOn && (Math.round(timer * 100))%(Math.round(player.autobuyers[10].bulk * 100)) == 0){
                maxBuyGalaxies()
            }
        } else player.autobuyers[10].ticks += 1;
    }


    if (player.autobuyers[9]%1 !== 0) {
        if (player.autobuyers[9].isOn && dimBoolean()) {
            if (player.resets < 4) softReset(1)
            else if (player.eternities < 10) softReset(player.autobuyers[9].bulk)
            else if ((Math.round(timer * 100))%(Math.round(player.autobuyers[9].bulk * 100)) == 0 && player.eightAmount >= getShiftRequirement(0).amount) maxBuyDimBoosts()
            player.autobuyers[9].ticks = 0
        }
        player.autobuyers[9].ticks += 1;
    }

    if (player.autoSacrifice%1 !== 0) {
        if (calcSacrificeBoost().gte(player.autoSacrifice.priority) && player.autoSacrifice.isOn) {
            sacrifice(true)
        }
    }




    for (var i=0; i<priority.length; i++) {
        if (priority[i].ticks*100 >= priority[i].interval || priority[i].interval == 100) {
            if ((priority[i].isOn && canBuyDimension(priority[i].tier)) ) {
                if (priority[i] == player.autobuyers[8] ) {
                    if (priority[i].target == 10) buyMaxTickSpeed()
                    else buyTickSpeed()
                } else {
                    if (priority[i].target > 10) {

                        if (player.options.bulkOn) buyManyDimensionAutobuyer(priority[i].target-10, priority[i].bulk)
                        else buyManyDimensionAutobuyer(priority[i].target-10, 1)
                    }
                    else {
                        buyOneDimension(priority[i].target)
                    }
                }
                priority[i].ticks = 0;
            }
        } else priority[i].ticks += 1;
    }
    updateCosts()

}


setInterval(function() {
    timer += 0.05
    if (!player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 100)

setInterval(function() {
    if (player.infinityUpgrades.includes("autoBuyerUpgrade")) autoBuyerTick()
}, 50)


  //start scrolling
  scrollNextMessage();

document.getElementById("challenge2").onclick = function () {
  startChallenge("challenge2", Number.MAX_VALUE)
}

document.getElementById("challenge3").onclick = function () {
  startChallenge("challenge3", Number.MAX_VALUE)
}

document.getElementById("challenge4").onclick = function () {
  startChallenge("challenge4", Number.MAX_VALUE)
}

document.getElementById("challenge5").onclick = function () {
  startChallenge("challenge5", Number.MAX_VALUE);
}

document.getElementById("challenge6").onclick = function () {
  startChallenge("challenge6", Number.MAX_VALUE);
}

document.getElementById("challenge7").onclick = function () {
  startChallenge("challenge7", Number.MAX_VALUE);
}

document.getElementById("challenge8").onclick = function () {
  startChallenge("challenge8", Number.MAX_VALUE);
}

document.getElementById("challenge9").onclick = function () {
  startChallenge("challenge9", Number.MAX_VALUE);
}

document.getElementById("challenge10").onclick = function () {
  startChallenge("challenge10", Number.MAX_VALUE);
}

document.getElementById("challenge11").onclick = function () {
    startChallenge("challenge11", Number.MAX_VALUE);
  }

document.getElementById("challenge12").onclick = function () {
  startChallenge("challenge12", Number.MAX_VALUE);
}



function showInfTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('inftab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showStatsTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('statstab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName && tab.id === "challengetimes") {
            tab.style.display = 'flex';
        } else if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showDimTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('dimtab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showChallengesTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('challengeTab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}

function showEternityTab(tabName, init) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('eternitytab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    if (tabName === 'timestudies' && !init) document.getElementById("TTbuttons").style.display = "block"
    else document.getElementById("TTbuttons").style.display = "none"
    resizeCanvas()
}

function showRealityTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('realitytab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
    resizeCanvas()
}

function showAchTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName
    var tabs = document.getElementsByClassName('achtab');
    var tab;
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs.item(i);
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    }
}




function init() {
    console.log('init');

    //setup the onclick callbacks for the buttons
    document.getElementById('dimensionsbtn').onclick = function () {
        showTab('dimensions');
    };
    document.getElementById('optionsbtn').onclick = function () {
        showTab('options');
    };
    document.getElementById('statisticsbtn').onclick = function () {
        showTab('statistics');
    };
    document.getElementById('achievementsbtn').onclick = function () {
        showTab('achievements');
    };
    document.getElementById('challengesbtn').onclick=function () {
      showTab('challenges');
    };
    document.getElementById('infinitybtn').onclick = function () {
        showTab('infinity');
    };
    document.getElementById("eternitystorebtn").onclick = function () {
        showTab('eternitystore')
    }
    document.getElementById("realitybtn").onclick = function () {
        showTab('reality')
    }
    document.getElementById("shopbtn").onclick = function () {
        showTab('shop')
        updateKongPurchases()
    }
    //show one tab during init or they'll all start hidden
    showTab('dimensions')
    showInfTab('preinf')
    showStatsTab('stats')
    showDimTab('antimatterdimensions')
    showChallengesTab('challenges')
    showEternityTab('timestudies', true)
    load_game();
    updateTickSpeed();
    updateAutobuyers();
    updateChallengeTimes()
    try {
        kongregateAPI.loadAPI(function () {
            window.kongregate = kongregateAPI.getAPI();
        });
        updateKongPurchases()
    } catch (err) {console.log("Couldn't load Kongregate API")}

    //if (typeof kongregate === 'undefined') document.getElementById("shopbtn").style.display = "none"

}









//Playfab stuff



function closeToolTip() {
    var elements = document.getElementsByClassName("popup")
    for (var i=0; i<elements.length; i++) elements[i].style.display = "none"
}

function tooltipLoad() {
    loadFromPlayFab()
    closeToolTip()
}

function tooltipSave() {
    saveToPlayFab()
    closeToolTip()
}



setInterval(function () {
    save_game()
}, 30000);

setInterval(function () {
    if (playFabId != -1 && player.options.cloud) playFabSaveCheck();
}, 1000*60*5)
updateCosts();
//updateInterval();
updateDimensions();
document.getElementById("hiddenheader").style.display = "none";


window.onload = function() {
    startInterval()
    setTimeout(function() {
        playFabLogin();
        updateKongPurchases()
        try {
            if (kongregate.services.getGameAuthToken() === undefined) document.getElementById("shopbtn").style.display = "none"
        } catch(e) {
            console.log(e)
            document.getElementById("shopbtn").style.display = "none"
        }
        document.getElementById("container").style.display = "block"
        document.getElementById("loading").style.display = "none"
    }, 1000)

}

window.addEventListener('keydown', function(event) {
    if (keySequence == 0 && event.keyCode == 38) {
        keySequence++
    } else if (keySequence == 1 && event.keyCode == 38) {
        keySequence++
    } else if (keySequence == 2 && event.keyCode == 40) {
        keySequence++
    } else if (keySequence == 3 && event.keyCode == 40) {
        keySequence++
    } else if (keySequence == 4 && event.keyCode == 37) {
        keySequence++
    } else if (keySequence == 5 && event.keyCode == 39) {
        keySequence++
    } else if (keySequence == 6 && event.keyCode == 37) {
        keySequence++
    } else if (keySequence == 7 && event.keyCode == 39) {
        keySequence++
    } else if (keySequence == 8 && event.keyCode == 66) {
        keySequence++
    } else if (keySequence == 9 && event.keyCode == 65) {
        giveAchievement("30 Lives")
        if (player.money.lt(30)) player.money = new Decimal(30)
    } else {
        keySequence = 0;
    }
    if (event.keyCode == 17) controlDown = true;
    if (event.keyCode == 16) {
        shiftDown = true;
        document.getElementById("studytreeloadsavetext").textContent = "save:"
        document.getElementById("automatorloadsavetext").textContent = "save:"
        drawStudyTree()
    }
    if ((controlDown && shiftDown && (event.keyCode == 67 || event.keyCode == 73 || event.keyCode == 74)) || event.keyCode == 123) {
        giveAchievement("Stop right there criminal scum!")
    }
}, false);

window.addEventListener('keyup', function(event) {
    if (event.keyCode == 17) controlDown = false;
    if (event.keyCode == 16) {
        shiftDown = false;
        document.getElementById("studytreeloadsavetext").textContent = "load:"
        document.getElementById("automatorloadsavetext").textContent = "load:"
        drawStudyTree()
    }
}, false);

window.onfocus = function() {
    controlDown = false;
    shiftDown = false;
    document.getElementById("studytreeloadsavetext").textContent = "load:"
    document.getElementById("automatorloadsavetext").textContent = "load:"
    drawStudyTree();
    drawAutomatorTree();
}

window.addEventListener('keydown', function(event) {
    if (!player.options.hotkeys || controlDown === true || document.activeElement.type === "text" || document.activeElement.type === "textarea") return false
    const tmp = event.keyCode;
    if (tmp >= 49 && tmp <= 56) {
        if (shiftDown) buyOneDimension(tmp-48)
        else buyManyDimension(tmp-48)
        return false;
    } else if (tmp >= 97 && tmp <= 104) {
        if (shiftDown) buyOneDimension(tmp-96)
        else buyManyDimension(tmp-96)
        return false;
    }
    switch (event.keyCode) {
        case 57: // D
            giveAchievement("That dimension doesn’t exist")
        break;

        case 65: // A
            toggleAutoBuyers();
        break;

        case 68: // D
            document.getElementById("softReset").onclick()
        break;

        case 71: // G
            document.getElementById("secondSoftReset").onclick()
        break;

        case 77: // M
            document.getElementById("maxall").onclick()
        break;

        case 83: // S
            document.getElementById("sacrifice").onclick()
        break;

        case 84: // T
            if (shiftDown) buyTickSpeed()
            else buyMaxTickSpeed()
        break;

        case 82: //R
            replicantiGalaxy()
        break;
    }
  }, false);

  window.addEventListener('keyup', function(event) {
    if (event.keyCode === 70) {
        $.notify("Paying respects", "info")
        giveAchievement("It pays to have respect")
    }
    if (!player.options.hotkeys || controlDown === true || document.activeElement.type === "text"  || document.activeElement.type === "textarea") return false
    switch (event.keyCode) {
        case 67: // C
            document.getElementById("bigcrunch").onclick()
        break;

        case 69: // E, also, nice.
        document.getElementById("eternitybtn").onclick();
        break;

    }
  }, false);



var totalMult = 1
var currentMult = 1
var infinitiedMult = 1
var achievementMult = 1
var challengeMult = 1
var unspentBonus = 1
var postc8Mult = new Decimal(0)
var mult18 = 1
var ec10bonus = new Decimal(1)
init();
setInterval( function() {
    totalMult = Math.pow(player.totalmoney.e+1, 0.5)
    currentMult = Math.pow(player.money.e+1, 0.5)
    if (player.timestudy.studies.includes(31)) infinitiedMult = 1 + Math.pow(Math.log10(getInfinitied()+1)*10, 4)
    else infinitiedMult = 1+Math.log10(getInfinitied()+1)*10
    achievementMult = Math.max(Math.pow((player.achievements.length-30-getSecretAchAmount()), 3)/40,1)
    challengeMult = Decimal.max(10*3000/worstChallengeTime, 1)
    unspentBonus = player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
    mult18 = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(8)).pow(0.02)
    if (player.currentEternityChall == "eterc10") {
        ec10bonus = Decimal.pow(getInfinitied(), 1000).max(1)
        if (player.timestudy.studies.includes(31)) ec10bonus = ec10bonus.pow(4)
    } else {
        ec10bonus = new Decimal(1)
    }
}, 100)

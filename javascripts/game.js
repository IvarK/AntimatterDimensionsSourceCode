var defaultStart = $.extend(true, {}, player);

let kongIPMult = 1
let kongDimMult = 1
let kongAllDimMult = 1
let kongEPMult = 1







function showTab(tabName) {
    //iterate over all elements in div_tab class. Hide everything that's not tabName and show tabName.
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
    tryShowtab(tabName);
    if (document.getElementById("timestudies").style.display != "none" && document.getElementById("eternitystore").style.display != "none") document.getElementById("TTbuttons").style.display = "flex";
    else document.getElementById("TTbuttons").style.display = "none"
    resizeCanvas();
    Modal.hide();
    tryStartTachyonAnimation();
    if (tabName !== "statistics") statsTimer = 0
    if (document.getElementById("perks").style.display !== "none") network.moveTo({position: {x:0, y:0}, scale: 0.8, offset: {x:0, y:0}})
}




function updateMoney() {
    var element = document.getElementById("coinAmount");
    element.textContent = shortenMoney(player.money);
    var element2 = document.getElementById("matter");
    if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") element2.textContent = "There is " + shortenMoney(player.matter) + " matter."
    if (player.currentChallenge == "postc6") element2.textContent = "There is " + shortenMoney(Decimal.pow(player.matter, 20)) + " matter."; //TODO
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
    player.options.noSacrificeConfirmation = !player.options.noSacrificeConfirmation
}




function updateDimensions() {
    if (Tab.dimensions.normal.isOpen) {
      const ndView = ui.view.tabs.dimensions.normal;
      for (let tier = 1; tier <= 8; tier++) {
        let dimView = ndView.dims[tier];
        const canBuy = canBuyDimension(tier);
        dimView.isAvailable = canBuy;
        if (!canBuy) {
          continue;
        }
        dimView.multiplier = getDimensionFinalMultiplier(tier);
        dimView.rateOfChange = getDimensionRateOfChange(tier);
        const dimension = new DimensionStats(tier);
        let canAffordSingle = false;
        let canAffordUntil10 = false;
        if ((player.currentChallenge === "challenge10" || player.currentChallenge === "postc1") && tier >= 3) {
          const lowerTier = new DimensionStats(tier - 2);
          canAffordSingle = lowerTier.amount.gte(dimension.cost);
          canAffordUntil10 = lowerTier.amount.gte(dimension.costUntil10);
        } else {
          canAffordSingle = canAfford(dimension.cost);
          canAffordUntil10 = canAfford(dimension.costUntil10);
        }
        dimView.isAffordable = canAffordSingle;
        dimView.isAffordableUntil10 = canAffordUntil10;
      }

      const shiftRequirement = getShiftRequirement(0);
      const shiftView = ndView.shift;
      shiftView.requirement.tier = shiftRequirement.tier;
      shiftView.requirement.amount = shiftRequirement.amount;
      shiftView.isBoost = player.currentChallenge === "challenge4" ?
        shiftRequirement.tier === 6 :
        shiftRequirement.tier === 8;

      let extraGals = player.replicanti.galaxies;
      if (player.timestudy.studies.includes(225)) {
        extraGals += Math.floor(player.replicanti.amount.e / 1000);
      }
      if (player.timestudy.studies.includes(226)) {
        extraGals += Math.floor(player.replicanti.gal / 15);
      }
      const galaxyRequirement = getGalaxyRequirement();
      const galaxyView = ndView.galaxy;
      galaxyView.type = GalaxyType.current();
      galaxyView.extra = extraGals;
      galaxyView.requirement.amount = galaxyRequirement;
      galaxyView.requirement.tier = player.currentChallenge === "challenge4" ? 6 : 8;
    }

    if (canBuyTickSpeed() || player.currentEternityChall == "eterc9") {
        var tickmult = getTickSpeedMultiplier()
        if (tickmult.lte(1e-9)) document.getElementById("tickLabel").textContent = "Divide the tick interval by " + shortenDimensions(tickmult.reciprocal()) + '.'
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

  if (!(getInfinitied() === 0 && player.realities === 0 && player.eternities === 0)) {
    if (player.infinityPoints.equals(1)) {
      document.getElementById("infinityPoints1").textContent = "You have 1 Infinity point."
      document.getElementById("infinityPoints2").textContent = "You have 1 Infinity point."
    }
    else {
      document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
      document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">" + shortenDimensions(player.infinityPoints) + "</span> Infinity points."
    }
  }

  if (document.getElementById("infinity").style.display == "block") {
        if (document.getElementById("preinf").style.display == "block") {
            document.getElementById("infi11").innerHTML = "Normal dimensions gain a multiplier based on time played <br>Currently: " + (Math.pow(0.5 * player.totalTimePlayed / 60000, 0.15)).toFixed(2) + "x<br>Cost: 1 IP"
            document.getElementById("infi12").innerHTML = "First and Eighth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + shortenMultiplier(dimMults()) + "x<br>Cost: 1 IP"
            document.getElementById("infi13").innerHTML = "Third and Sixth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + shortenMultiplier(dimMults()) + "x<br>Cost: 1 IP"
            document.getElementById("infi22").innerHTML = "Second and seventh Dimensions gain a multiplier based on infinitied stat<br>Currently: " + shortenMultiplier(dimMults()) + "x<br>Cost: 1 IP"
            document.getElementById("infi23").innerHTML = "Fourth and Fifth Dimensions gain a multiplier based on infinitied stat<br>Currently: " + shortenMultiplier(dimMults()) + "x<br>Cost: 1 IP"
            document.getElementById("infi31").innerHTML = "Normal dimensions gain a multiplier based on time spent in current infinity<br>Currently: " + Decimal.max(Math.pow(player.thisInfinityTime / 240000, 0.25), 1).toFixed(2) + "x<br>Cost: 3 IP"
            document.getElementById("infi32").innerHTML = "Multiplier for unspent Infinity Points on 1st Dimension<br>Currently: " + shorten(player.infinityPoints.dividedBy(2).pow(1.5).plus(1)) + "x<br>Cost: 5 IP"
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

            if (player.bestInfinityTime === 999999999999) document.getElementById("postinfi13").innerHTML = "You passively generate Infinitied stat based on your fastest infinity.<br>1 Infinity every hundred or so years<br>Cost: "+shortenCosts(20e6)+" IP"
            else document.getElementById("postinfi13").innerHTML = "You passively generate Infinitied stat based on your fastest infinity.<br>1 Infinity every "+timeDisplay(player.bestInfinityTime*5)+ " <br>Cost: "+shortenCosts(20e6)+" IP"
            document.getElementById("postinfi23").innerHTML = "Option to bulk buy Dimension Boosts <br>Cost: "+shortenCosts(5e9)+" IP"
            document.getElementById("postinfi33").innerHTML = "Autobuyers work twice as fast <br>Cost: "+shortenCosts(1e15)+" IP"
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
    document.getElementById("tickSpeed").textContent = 'Cost: ' + shortenCosts(player.tickSpeedCost);

    let initIDCost = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    for (var i=1; i<=8; i++) {
      if (player["infinityDimension"+i].baseAmount >= 10*hardcapIDPurchases && i != 8) {
        document.getElementById("infMax"+i).textContent = "Capped!"
        let capIP;
        if (ECTimesCompleted("eterc12")) {
          capIP = new Decimal(initIDCost[i]).times(Decimal.pow(Math.pow(infCostMults[i], 1-ECTimesCompleted("eterc12")*0.008),hardcapIDPurchases));
        } else {
          capIP = new Decimal(initIDCost[i]).times(Decimal.pow(infCostMults[i], hardcapIDPurchases));
        }
        document.getElementById("infMax"+i).setAttribute('ach-tooltip', "Limited to " + shortenCosts(hardcapIDPurchases) + " upgrades (" + shortenCosts(capIP) + " IP)")
      }
      else  document.getElementById("infMax"+i).textContent = "Cost: " + shortenCosts(player["infinityDimension"+i].cost) + " IP"
    }

    for (var i=1; i<=8; i++) {

        document.getElementById("timeMax"+i).textContent = "Cost: " + shortenDimensions(player["timeDimension"+i].cost) + " EP"
    }
}

let floatingTextKey = 0;
function floatText(tier, text) {
  if (!player.options.animations.floatingText) return;
  const floatingText = ui.view.tabs.dimensions.normal.dims[tier].floatingText;
  floatingText.push({ text: text, key: floatingTextKey++ });
  setTimeout(() => floatingText.shift(), 1000)
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

    if (player.eternityChallUnlocked == 0 && Object.keys(player.eternityChalls).length === 0) {
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





function maxAll() {
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
        floatText(tier, "x" + shortenMoney(player[name + "Pow"].dividedBy(multBefore)))
    }
}

function buyInfinityUpgrade(name, cost) {
    if (player.infinityPoints.gte(cost) && !player.infinityUpgrades.includes(name)) {
        player.infinityUpgrades.push(name);
        player.infinityPoints = player.infinityPoints.minus(cost);
        return true
    } else return false
}

document.getElementById("infiMult").onclick = function() {
    if (player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost) && player.infMultCost.lte("1e6000000")) {
        player.infinityPoints = player.infinityPoints.minus(player.infMultCost)
        player.infMult = player.infMult.times(2);
        player.autoIP = player.autoIP.times(2);
        if (player.infMultCost.gte("1e3000000")) player.infMultCost = player.infMultCost.times("1e10")
        else player.infMultCost = player.infMultCost.times(10)
        document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
        if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(2);
        if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = formatValue("Scientific", player.autobuyers[11].priority, 2, 0);
    }
    else if (player.infMultCost.gt("1e6000000")) {
      document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>(Capped at " +shortenCosts(new Decimal("1e6000000"))+ " IP)"
      document.getElementById("infiMult").className = "infinistorebtnlocked"
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


function buyEPMult(upd, threshold) {
    if (upd === undefined) upd = true // this stupid solution because IE can't handle default values in the row above
    if (threshold == undefined) threshold = 1
    if (player.eternityPoints.gte(player.epmultCost.times(1/threshold))) {
        player.epmult = player.epmult.times(5)
        if (player.autoEternityMode == "amount") {
            player.eternityBuyer.limit = player.eternityBuyer.limit.times(5)
            document.getElementById("priority13").value = formatValue("Scientific", player.eternityBuyer.limit, 2, 0);
        }
        player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
        let count = player.epmult.ln()/Math.log(5)
        if (player.epmultCost.gte(new Decimal("1e4000"))) player.epmultCost = Decimal.pow(1000, count + Math.pow(count-1334, 1.2)).times(500)
        else if (player.epmultCost.gte(new Decimal("1e1300"))) player.epmultCost = Decimal.pow(1000, count).times(500)
        else if (player.epmultCost.gte(Number.MAX_VALUE)) player.epmultCost = Decimal.pow(500, count).times(500)
        else if (player.epmultCost.gte(new Decimal("1e100"))) player.epmultCost = Decimal.pow(100, count).times(500)
        else player.epmultCost = Decimal.pow(50, count).times(500)
        updateEpMultButton();
        if (upd) updateEternityUpgrades()
    }
}

function updateEpMultButton() {
  document.getElementById("epmult").innerHTML = `You gain 5 times more EP<p>Currently: ${shortenDimensions(player.epmult)}x<p>Cost: ${shortenDimensions(player.epmultCost)} EP`
}

function buyMaxEPMult(threshold) {
    if (threshold == undefined) threshold = 1
    while (player.eternityPoints.gte(player.epmultCost.times(1/threshold))) {
        buyEPMult(false, threshold)
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
    if (player.infinityUpgrades.includes("skipReset3")) buyInfinityUpgrade("skipResetGalaxy", 300)
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
        if (isAchEnabled("r126")) document.getElementById("replicantireset").innerHTML = document.getElementById("replicantireset").innerHTML.replace("Reset replicanti amount", "Divide replicanti by e308")
        
        document.getElementById("replicantichance").className = (player.infinityPoints.gte(player.replicanti.chanceCost) && player.replicanti.chance < 1) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantiinterval").className = (player.infinityPoints.gte(player.replicanti.intervalCost) && ((player.replicanti.interval !== 50) || player.timestudy.studies.includes(22)) && (player.replicanti.interval !== 1)) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantimax").className = (player.infinityPoints.gte(player.replicanti.galCost)) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantireset").className = ((player.replicanti.galaxies < player.replicanti.gal && player.replicanti.amount.gte(Number.MAX_VALUE)) || (player.replicanti.galaxies < Math.floor(player.replicanti.gal * 1.5) && player.replicanti.amount.gte(Number.MAX_VALUE) && player.timestudy.studies.includes(131))) ? "storebtn" : "unavailablebtn"
        document.getElementById("replicantiunlock").className = (player.infinityPoints.gte(1e140)) ? "storebtn" : "unavailablebtn"
    }

    if (document.getElementById("timestudies").style.display == "block" && document.getElementById("eternitystore").style.display == "block") {
        document.getElementById("11desc").textContent = "Currently: "+shortenMoney(Decimal.fromMantissaExponent(10 -player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).mantissa, Math.abs(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).e)).min("1e2500").max(1))+"x"
        document.getElementById("32desc").textContent = "You gain "+Math.max(player.resets, 1)+"x more infinitied stat (based on dimension boosts)"
        document.getElementById("41desc").textContent = "Currently: "+shortenMoney(Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies))+"x"
        document.getElementById("51desc").textContent = "You gain "+shortenCosts(1e15)+"x more IP"
        document.getElementById("71desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.25).max(1).min("1e210000"))+"x"
        document.getElementById("72desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))+"x"
        document.getElementById("73desc").textContent = "Currently: "+shortenMoney(calcTotalSacrificeBoost().pow(0.005).max(1).min("1e1300"))+"x"
        document.getElementById("82desc").textContent = "Currently: "+shortenMoney(Decimal.pow(1.0000109, Decimal.pow(player.resets, 2)))+"x"
        document.getElementById("83desc").textContent = "Currently: "+shortenMoney(Decimal.pow(1.0004, player.totalTickGained).min("1e30"))+"x"
        document.getElementById("91desc").textContent = "Currently: "+shortenMoney(Decimal.pow(10, Math.min(player.thisEternity/100, 18000)/60))+"x"
        document.getElementById("92desc").textContent = "Currently: "+shortenMoney(Decimal.pow(2, 600/Math.max(player.bestEternity/100, 20)))+"x"
        document.getElementById("93desc").textContent = "Currently: "+shortenMoney(Decimal.pow(player.totalTickGained, 0.25).max(1))+"x"
        document.getElementById("101desc").textContent = "Currently: "+shortenMoney(Decimal.max(player.replicanti.amount, 1))+"x"
        document.getElementById("102desc").textContent = "Currently: "+shortenMoney(Decimal.pow(5, player.replicanti.galaxies, 150))+"x"
        document.getElementById("103desc").textContent = "Currently: "+Math.max(player.replicanti.galaxies, 1)+"x"

        var study121 = (253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5
        if (player.reality.perks.includes(72)) {
          study121 = 50
          document.getElementById("121").innerHTML = "You gain 50x more EP<span>Cost: 9 Time Theorems"
        }
        else
          document.getElementById("121desc").textContent = "Currently: "+study121.toFixed(1)+"x"

        var study123 = Math.sqrt(1.39*player.thisEternity/1000)
        if (player.reality.perks.includes(73)) study123 = Math.sqrt(1.39*(player.thisEternity + 15 * 60 * 1000)/1000)
        document.getElementById("123desc").textContent = "Currently: "+study123.toFixed(1)+"x"

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
        document.getElementById("225desc").textContent = "Currently: +" + Math.floor(player.replicanti.amount.exponent / 1000) + " RG"
        document.getElementById("226desc").textContent = "Currently: +" + Math.floor(player.replicanti.gal / 15) + " RG"

            // Text for EC unlock studies
            var ECUnlockQuantity = [0, player.eternities, player.totalTickGained, player.eightAmount, player.infinitied + player.infinitiedBank, player.galaxies, player.replicanti.galaxies, player.money, player.infinityPoints, player.infinityPower, player.eternityPoints];
        var ECUnlockResource = ["", "Eternities", "Tickspeed upgrades gained from time dimensions", "8th dimensions", "infinities", "antimatter galaxies", "replicanti galaxies", "antimatter", "IP", "infinity power", "EP"];
            var ECUnlockThresholds = [0, (ECTimesCompleted("eterc1") + 1) * 20000, 1300 + (ECTimesCompleted("eterc2") * 150), 17300 + (ECTimesCompleted("eterc3") * 1250), 1e8 + (ECTimesCompleted("eterc4") * 5e7), 160 + (ECTimesCompleted("eterc5") * 14), 40 + (ECTimesCompleted("eterc6") * 5), new Decimal("1e500000").times(new Decimal("1e300000").pow(ECTimesCompleted("eterc7"))), new Decimal("1e4000").times(new Decimal("1e1000").pow(ECTimesCompleted("eterc8"))), new Decimal("1e17500").times(new Decimal("1e2000").pow(ECTimesCompleted("eterc9"))), new Decimal("1e100").times(new Decimal("1e20").pow(ECTimesCompleted("eterc10")))];
        for (var ECnum = 1; ECnum <= 10; ECnum++) {
            if (player.reality.perks.includes(31)) document.getElementById("ec" + ECnum + "desc").textContent = "";
            else {
                if (ECnum <= 6)	// showing more than the maximum may lead to text overflowing
                    ECUnlockQuantity[ECnum] = Math.min(ECUnlockQuantity[ECnum], ECUnlockThresholds[ECnum]);
                else
                    ECUnlockQuantity[ECnum] = ECUnlockQuantity[ECnum].min(ECUnlockThresholds[ECnum]);

                if (ECnum <= 6 && ECnum != 4)	// requirements are doubles
                    document.getElementById("ec" + ECnum + "desc").textContent = "Requirement: " + ECUnlockQuantity[ECnum] + "/" + ECUnlockThresholds[ECnum] + " " + ECUnlockResource[ECnum];
                else if (ECnum == 4)			// regex stuff to add commas
                    document.getElementById("ec" + ECnum + "desc").textContent = "Requirement: " + ECUnlockQuantity[ECnum].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/" + ECUnlockThresholds[ECnum].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + ECUnlockResource[ECnum];
                else							// requirements are Decimals
                    document.getElementById("ec" + ECnum + "desc").textContent = "Requirement: " + shortenCosts(ECUnlockQuantity[ECnum]) + "/" + shortenCosts(ECUnlockThresholds[ECnum]) + " " + ECUnlockResource[ECnum];
            }
            try {
                document.getElementById("ec" + player.etercreq + "desc").textContent = "";
            }
            catch (err) {
                // Don't do anything if none of the ECs are currently unlocked
            }
        }
        if (player.reality.perks.includes(31)) {
            document.getElementById("ec11desc").textContent = '';
            document.getElementById("ec12desc").textContent = '';
        } else {
            document.getElementById("ec11desc").textContent = 'Requirement: Use only the Normal Dimension path';
            document.getElementById("ec12desc").textContent = 'Requirement: Use only the Time Dimension path';
        }
            if (player.dilation.studies.includes(1) || player.reality.perks.includes(13)) document.getElementById("dilstudy1").innerHTML = "Unlock time dilation<span>Cost: 5000 Time Theorems"
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

function eterMultAutoToggle() {
    if (player.reality.epmultbuyer) {
        player.reality.epmultbuyer = false
        document.getElementById("epmultbuyer").textContent = "Autobuy EP mult OFF"
    } else {
        player.reality.epmultbuyer = true
        document.getElementById("epmultbuyer").textContent = "Autobuy EP mult ON"
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

function toggleEternityMode() {
    if (player.autoEternityMode == "amount") {
        player.autoEternityMode = "time"
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: time"
        document.getElementById("eternitylimittext").textContent = "Seconds between eternities:"
    } else if (player.autoEternityMode == "time"){
        player.autoEternityMode = "relative"
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: X times last eternity"
        document.getElementById("eternitylimittext").textContent = "X times last eternity:"
    } else {
        player.autoEternityMode = "amount"
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: amount"
        document.getElementById("eternitylimittext").textContent = "Amount of EP to wait until reset:"
    }
}

function toggleRealityMode() {
    if (player.autoRealityMode == "rm") {
        player.autoRealityMode = "glyph"
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: glyph level"
    } else if (player.autoRealityMode == "glyph"){
        player.autoRealityMode = "either"
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: either"
    } else if (player.autoRealityMode == "either"){
        player.autoRealityMode = "both"
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: both"
    } else {
        player.autoRealityMode = "rm"
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: reality machines"
    }
}

function updatePrestigeAutoModes() {
    if (player.autoCrunchMode == "amount") {
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: amount"
        document.getElementById("limittext").textContent = "Amount of IP to wait until reset:"
    } else if (player.autoCrunchMode == "time"){
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: time"
        document.getElementById("limittext").textContent = "Seconds between crunches:"
    } else {
        document.getElementById("togglecrunchmode").textContent = "Auto crunch mode: X times last crunch"
        document.getElementById("limittext").textContent = "X times last crunch:"
    }

    if (player.autoEternityMode == "amount") {
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: amount"
        document.getElementById("eternitylimittext").textContent = "Amount of EP to wait until reset:"
    } else if (player.autoEternityMode == "time"){
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: time"
        document.getElementById("eternitylimittext").textContent = "Seconds between eternities:"
    } else {
        document.getElementById("toggleeternitymode").textContent = "Auto eternity mode: X times last eternity"
        document.getElementById("eternitylimittext").textContent = "X times last eternity:"
    }

    if (player.autoRealityMode == "rm") {
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: reality machines"
    } else if (player.autoRealityMode == "glyph"){
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: glyph level"
    } else if (player.autoRealityMode == "either"){
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: either"
    } else {
        document.getElementById("togglerealitymode").textContent = "Auto reality mode: both"
    }
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
    setAchieveTooltip()
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
    if (isAchEnabled("r141")) ret = ret.times(4)
    if (player.dilation.upgrades.includes(7)) ret = ret.times(player.dilation.dilatedTime.pow(1000).max(1))
    ret = ret.times(new Decimal(1).max(getAdjustedGlyphEffect("infinityipgain")));
    return ret.floor()
}

function gainedEternityPoints() {
    var ret = Decimal.pow(5, player.infinityPoints.plus(gainedInfinityPoints()).e/308 -0.7).times(player.epmult).times(kongEPMult)

    var study121 = (253 - averageEp.dividedBy(player.epmult).dividedBy(10).min(248).max(3))/5
    if (player.reality.perks.includes(72)) study121 = 50

    var study123 = Math.sqrt(1.39*player.thisEternity/1000)
    if (player.reality.perks.includes(73)) study123 = Math.sqrt(1.39*(player.thisEternity + 15 * 60 * 1000)/1000)
    if (player.timestudy.studies.includes(61)) ret = ret.times(10)
    if (player.timestudy.studies.includes(121)) ret = ret.times(study121)
    else if (player.timestudy.studies.includes(122)) ret = ret.times(35)
    else if (player.timestudy.studies.includes(123)) ret = ret.times(study123)
    ret = ret.times(new Decimal(1).max(getAdjustedGlyphEffect("timeeternity")));

    if (player.reality.upg.includes(12)) ret = ret.times(Decimal.max(Decimal.pow(Math.max(player.timestudy.theorem - 1e3, 2), Math.log2(player.realities)), 1))

    return ret.floor()
}

function gainedRealityMachines() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)

    return Decimal.floor(ret)
}

function percentToNextRealityMachine() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)
    return Math.min(((ret - Math.floor(ret)) * 100), 99.9).toFixed(1);
}

function gainedGlyphLevel(round) {
    if (round === undefined) round = true
    var replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
    var ret = Math.pow(player.eternityPoints.e, 0.5) * Math.pow(player.replicanti.amount.e, replPow) * Math.pow(player.dilation.dilatedTime.log10(), 1.3) / 100000
    if (player.reality.upg.includes(18)) ret *= Math.max(Math.sqrt(Math.log10(player.eternities)) * 0.45, 1)
    if (round) ret = Math.round(ret)
    if (player.reality.perks.includes(21)) ret += 1
    if (player.reality.perks.includes(24)) ret += 1
    if (ret == Infinity || isNaN(ret)) return 0
    return ret
}

function percentToNextGlyphLevel() {
    var replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
    var ret = gainedGlyphLevel(false)
    var retOffset = 0;
    if (Math.round(ret) > ret) {
        retOffset = 0.5;
    } else {
        retOffset = -0.5;
    }
    if (ret == Infinity || isNaN(ret)) return 0
    return Math.min(((ret - Math.floor(ret)-retOffset) * 100), 99.9).toFixed(1)
}

function resetDimensions() {
    for (var i = 1; i <= 8; i++) {
        player[TIER_NAMES[i] + "Amount"] = new Decimal(0)
        player[TIER_NAMES[i] + "Pow"] = new Decimal(1)
        player[TIER_NAMES[i] + "Bought"] = 0
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
    player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
}

function resetChallengeStuff() {
    player.chall2Pow = 1;
    player.chall3Pow = new Decimal(0.01)
    player.matter = new Decimal(0)
    player.chall11Pow = new Decimal(1)
    player.postC4Tier = 1
    player.postC3Reward = new Decimal(1)
}

function resetMoney() {
    let money = 10;
    if (player.reality.perks.includes(52)) money = 1e130
    else if (isAchEnabled("r78")) money = 1e25;
    else if (isAchEnabled("r55")) money = 1e10;
    else if (isAchEnabled("r54")) money = 2e5;
    else if (isAchEnabled("r37")) money = 1000;
    else if (isAchEnabled("r21")) money = 100;
    else if (player.reality.perks.includes(51)) money = 100;
    player.money = new Decimal(money);
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


function sacrifice(auto) {
    if (player.eightAmount == 0) return false;
    if (player.resets < 5) return false
    if (player.currentEternityChall == "eterc3") return false
    if ((!player.break || (!player.currentChallenge.includes("post") && player.currentChallenge !== "")) && player.money.gte(Number.MAX_VALUE)) return false
    if (player.currentChallenge == "challenge11" && (calcTotalSacrificeBoost().gte(Number.MAX_VALUE) || player.chall11Pow.gte(Number.MAX_VALUE))) return false
    if (!auto) floatText(8, "x" + shortenMoney(calcSacrificeBoost()))
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




function sacrificeBtnClick() {
    if (player.resets < 5) return false
    if (!player.options.noSacrificeConfirmation) {
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
    var autoBuyerGalaxy = new Autobuyer (10)
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

    if (!player.reality.upg.includes(25)) {
        document.getElementById("autoBuyerReality").style.display = "none"
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
    player.realityBuyer.isOn = document.getElementById("realityison").checked
    priorityOrder()
}


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
    const realityValue1 = fromValue(document.getElementById("priority14").value)
    if (!isNaN(realityValue1)) player.realityBuyer.rm = realityValue1
    player.realityBuyer.glyph = parseInt(document.getElementById("priority15").value)

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
    document.getElementById("realityison").checked = player.realityBuyer.isOn

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
    player.realityBuyer.isOn = !bool
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

function updateChallengeTimes() {
    updateWorstChallengeTime();
}

var bestRunIppm = new Decimal(0)
function updateLastTenRuns() {
  bestRunIppm = player.lastTenRuns
    .map(function(run) { return runRatePerMinute(run) })
    .reduce(Decimal.maxReducer);

  if (bestRunIppm.gte(1e8)) giveAchievement("Oh hey, you're still here");
  if (bestRunIppm.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");
}

function runRatePerMinute(run) {
    return ratePerMinute(run[1], run[0]);
}

function ratePerMinute(amount, time) {
    return Decimal.divide(amount, time / (60 * 1000));
}

function averageRun(runs) {
    let totalTime = runs
        .map(function(run) { return run[0] })
        .reduce(Decimal.sumReducer);
    let totalAmount = runs
        .map(function(run) { return run[1] })
        .reduce(Decimal.sumReducer);
    return [
        totalTime.dividedBy(runs.length),
        totalAmount.dividedBy(runs.length)
    ];
}

var averageEp = new Decimal(0)
function updateLastTenEternities() {
    averageEp = player.lastTenEternities
      .map(function(run) { return run[1] })
      .reduce(Decimal.sumReducer)
      .dividedBy(player.lastTenEternities.length);
}

function addEternityTime(time, ep) {
    player.lastTenEternities.pop();
    player.lastTenEternities.unshift([time, ep]);
}

var averageRm = new Decimal(0)
function updateLastTenRealities() {
  averageRm = player.lastTenRealities
    .map(function(run) { return run[1] })
    .reduce(Decimal.sumReducer)
    .dividedBy(player.lastTenRealities.length);
}

function addRealityTime(time, rm, level) {
    player.lastTenRealities.pop();
    player.lastTenRealities.unshift([time, rm, level]);
}


document.getElementById("postInfinityButton").onclick = function() {document.getElementById("bigcrunch").click()}

function addTime(time, ip) {
    player.lastTenRuns.pop();
    player.lastTenRuns.unshift([time, ip]);
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
    if (nextAchIn() !== 0) return false

    for (var row = 1; row <= 13; row++) {
        for (var col = 1; col <= 8; col++) {
            if (!player.achievements.includes("r" + (row*10 + col))) return false
        }
    }

    return true
}

function gainedInfinities() {
    let infGain = 1;
    if (player.thisInfinityTime > 5000 && isAchEnabled("r87")) infGain = 250;
    if (player.timestudy.studies.includes(32)) infGain *= Math.max(player.resets,1);
    if (player.reality.rebuyables[5] > 0) infGain *= Math.pow(5, player.reality.rebuyables[5])
    infGain *= Math.max(1, getAdjustedGlyphEffect("infinityinfmult"));
    if (player.reality.upg.includes(7)) infGain *= 1+(player.galaxies/30)

    if (player.currentEternityChall == "eterc4") {
        infGain = 1
    }

    return infGain
}

function failChallenge() {
    Modal.message.show("You failed the challenge, you will now exit it.");
    setTimeout(exitChallenge, 500);
    giveAchievement("You're a mistake");
    failureCount++;
    if (failureCount > 9) giveAchievement("You're a failure");
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

function selectGlyph(idx) {
    glyphSelected = true
    $("#glyphSelect").hide()
    if (player.options.animations.reality) setTimeout(function(){
        player.reality.glyphs.inventory.push(possibleGlyphs[idx])
        possibleGlyphs = []
    }, 3000)
    else {
        player.reality.glyphs.inventory.push(possibleGlyphs[idx])
        possibleGlyphs = []
    }
    reality()
}

function generateGlyphSelection(amount) {
  possibleGlyphs.push(generateRandomGlyph(gainedGlyphLevel()))
  $("#glyphSelect").show()
  var html = ""
  for (let idx = 0; idx< amount; idx++) {
      var glyph = possibleGlyphs[idx]
      var rarity = getRarity(glyph.strength)
      html += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+rarity.color+" !important; text-shadow: "+rarity.color+" -1px 1px 2px;' onclick='selectGlyph("+idx+")'><span class='tooltip'>"
      html += "<span class='glyphraritytext' style='color: "+rarity.color+"; float:left'>"+rarity.name+" glyph of "+glyph.type+" ("+((glyph.strength-1) / 2 * 100).toFixed(1)+"%)"+"</span> <span style='float: right'> Level: "+glyph.level+"</span><br><br>"
      for (i in glyph.effects)
        html += getDesc(glyph.type + i, glyph.effects[i], true) +" <br><br>"
      if ((player.reality.upg.includes(19) && (glyph.type === "power" || glyph.type === "time")) || player.reality.upg.includes(21))
        html += "<span style='color:#b4b4b4'>Can be sacrificed for " + (glyph.level * glyph.strength).toFixed(2) + " power</span>";
      html += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div>"
  }
  $("#glyphsToSelect").html(html)
  $(".tooltip").parent(".glyph").mousemove(function(e) {
      mouseOn.css({"left": e.pageX-150 + "px", "top": e.pageY-mouseOn.height()-35 + "px", "display": "block"})
  })

  $(".tooltip").parent(".glyph").mouseenter(function(e) {
      e.stopPropagation();
      mouseOn = $(this).find(".tooltip")
      mouseOn.appendTo("#body")
  })

  $(".tooltip").parent(".glyph").mouseleave(function(e) {
      e.stopPropagation();
      mouseOn.css({"left": "0", "top": "0px", "display": "none"})
      mouseOn.appendTo($(this))
      mouseOn = $("document")
  })
}

var possibleGlyphs = []
var glyphSelected = false

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
    if (player.reality.perks.includes(31)) return true

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
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec2unl").onclick = function() {
    if (canUnlockEC(2, 35, 171)) {
        unlockEChall(2)
        player.timestudy.theorem -= 35
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec3unl").onclick = function() {
    if (canUnlockEC(3, 40, 171)) {
        unlockEChall(3)
        player.timestudy.theorem -= 40
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec4unl").onclick = function() {
    if (canUnlockEC(4, 70, 143)) {
        unlockEChall(4)
        player.timestudy.theorem -= 70
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec5unl").onclick = function() {
    if (canUnlockEC(5, 130, 42)) {
        unlockEChall(5)
        player.timestudy.theorem -= 130
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec6unl").onclick = function() {
    if (canUnlockEC(6, 85, 121)) {
        unlockEChall(6)
        player.timestudy.theorem -= 85
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec7unl").onclick = function() {
    if (canUnlockEC(7, 115, 111)) {
        unlockEChall(7)
        player.timestudy.theorem -= 115
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec8unl").onclick = function() {
    if (canUnlockEC(8, 115, 123)) {
        unlockEChall(8)
        player.timestudy.theorem -= 115
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec9unl").onclick = function() {
    if (canUnlockEC(9, 415, 151)) {
        unlockEChall(9)
        player.timestudy.theorem -= 415
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec10unl").onclick = function() {
    if (canUnlockEC(10, 550, 181)) {
        unlockEChall(10)
        player.timestudy.theorem -= 550
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec11unl").onclick = function() {
    if (canUnlockEC(11, 1, 231, 232)) {
        unlockEChall(11)
        player.timestudy.theorem -= 1
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

document.getElementById("ec12unl").onclick = function() {
    if (canUnlockEC(12, 1, 233, 234)) {
        unlockEChall(12)
        player.timestudy.theorem -= 1
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } else return false
}

function quickReset() {
    if (player.resets == 0) player.resets--;
    else player.resets -= 2;
    softReset(1);
}

function updateInfPower() {
    document.getElementById("infPowAmount").textContent = shortenMoney(player.infinityPower)
    if (player.currentEternityChall == "eterc9") document.getElementById("infDimMultAmount").textContent = shortenMoney((Decimal.pow(Math.max(player.infinityPower.log2(), 1), 4)).max(1))
    else {
        var conversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
        document.getElementById("infDimMultAmount").textContent = shortenMoney(player.infinityPower.pow(conversionRate).max(1))
    }
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
            Modal.message.show(data.message);
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
    kong.submitStats('Log10 of total antimatter', player.totalmoney.e);
    kong.submitStats('Log10 of Infinity Points', player.infinityPoints.e);
    kong.submitStats('Log10 of Eternity Points', player.eternityPoints.e);
}, 10000)

var nextAt = [new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e12000"), new Decimal("1e14000"), new Decimal("1e18000"), new Decimal("1e20000"), new Decimal("1e23000"), new Decimal("1e28000")]

var goals = [new Decimal("1e850"), new Decimal("1e10500"), new Decimal("1e5000"), new Decimal("1e13000"), new Decimal("1e11111"), new Decimal("2e22222"), new Decimal("1e10000"), new Decimal("1e27000")]

var ttMaxTimer = 0
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
            }
        }
        infDimPow = temp
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

    if (player.reality.upg.includes(13)) {
        for (var i=1; i<9; i++) {
            document.getElementById("timeauto"+i).style.visibility = "visible"
        }
        document.getElementById("togglealltimedims").style.visibility = "visible"
    }

    if (player.eternities >= 40) document.getElementById("replauto1").style.visibility = "visible"
    else document.getElementById("replauto1").style.visibility = "hidden"
    if (player.eternities >= 60) document.getElementById("replauto2").style.visibility = "visible"
    else document.getElementById("replauto2").style.visibility = "hidden"
    if (player.eternities >= 80) document.getElementById("replauto3").style.visibility = "visible"
    else document.getElementById("replauto3").style.visibility = "hidden"
    if (player.eternities >= 100) document.getElementById("autoBuyerEter").style.display = "inline-block"
    if (player.reality.upg.includes(25)) {
        document.getElementById("autoBuyerReality").style.display = "inline-block"
    }

	
	// EC goal IP text
	for (var ECNum = 1; ECNum <= 12; ECNum++) {
		var ECComp = ECTimesCompleted("eterc" + ECNum);
		var extraText = "";
		if (ECNum == 4)
			extraText = " in "+Math.max((16 - 4*ECComp), 0)+" infinities or less.";
		if (ECNum == 12)
			extraText = " in "+(Math.max(10 - 2*ECComp, 1)/10) + ((ECComp == 0) ? " second or less." :" seconds or less.");
		
		document.getElementById("eterc" + ECNum + "goal").textContent = "Goal: "+shortenCosts(getECGoalIP(ECNum, ECComp)) + " IP" + extraText;
		document.getElementById("eterc" + ECNum + "completed").textContent = "Completed " + ECComp + ((ECComp == 1) ? " time." : " times.");
	}
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
        failChallenge();
    }

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
    if (player.infinityPower.gt(1e260)) giveAchievement("4.3333 minutes of Infinity"); //TBD
    if (player.totalTickGained >= 308) giveAchievement("Infinite time");
    if (player.firstPow >= 10e30) giveAchievement("I forgot to nerf that")
    if (player.money >= 10e79) giveAchievement("Antimatter Apocalypse")
    if (player.totalTimePlayed >= 1000 * 60 * 60 * 24 * 8) giveAchievement("One for each dimension")
    if (player.seventhAmount > 1e12) giveAchievement("Multidimensional");
    if (player.tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
    if (player.tickspeed.lt(1e-55)) giveAchievement("Faster than a squared potato");
    if (Math.random() < 0.00001) giveAchievement("Do you feel lucky? Well do ya punk?")
    if ((player.matter.gte(2.586e15) && player.currentChallenge == "postc6") || player.matter.gte(Number.MAX_VALUE)) giveAchievement("It's not called matter dimensions is it?")

    if (document.getElementById("eternitystore").style.display !== "none" && document.getElementById("eternityupgrades").style.display !== "none") updateEternityUpgrades()

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
    if (player.realities > 0 && nextAchIn() > 0) document.getElementById("nextAchAt").textContent = "Next achievement in " + timeDisplayNoDecimals(nextAchIn())
    else document.getElementById("nextAchAt").textContent = ""

    const totalAchTime = timeForAllAchievements() * 1000;
    if (player.reality.perks.includes(413) || player.realities == 0)
      $("#timeForAchievements").text("")
    else
      $("#timeForAchievements").text("You will gain your achievements back over the span of " + timeDisplay(totalAchTime))
	if (player.thisReality < totalAchTime && player.realities != 0)
		$("#allAchAt").text("(Remaining: " + timeDisplay(totalAchTime - player.thisReality) + ")")
	else
		$("#allAchAt").text("")
    if (player.realities > 3) {
        $("#automatorUnlock").hide()
        $(".automator-container").show()
    } else {
        $("#automatorUnlock").show()
        $(".automator-container").hide()
    }

    if (player.reality.upg.includes(13)) {
        document.getElementById("toggleeternitymode").style.display = "inline-block"
        document.getElementById("epmultbuyer").style.display = "inline-block"
    } else {
        document.getElementById("toggleeternitymode").style.display = "none"
        document.getElementById("epmultbuyer").style.display = "none"
    }

    if (player.reality.upg.includes(25)) document.getElementById("togglerealitymode").style.display = "inline-block"
    else document.getElementById("togglerealitymode").style.display = "none"


    updateRealityUpgrades()

    if (player.totalTimePlayed > 1000 * 60 * 60 * 24 * 365 * 2) unlockRealityUpgrade(20)
    if (player.replicanti.amount.gte(new Decimal("1e70000"))) unlockRealityUpgrade(21)
    if (player.dilation.dilatedTime.gte(1e75)) unlockRealityUpgrade(22)
    ttMaxTimer++;
    if (player.reality.perks.includes(8)) maxTheorems()
    else if (player.reality.perks.includes(7) && ttMaxTimer >= 3) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }
    else if (player.reality.perks.includes(6) && ttMaxTimer >= 5) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }
    else if (player.reality.perks.includes(5) && ttMaxTimer >= 10) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }
}, 1000)

function getECGoalIP(challNum, timesCompleted) {
	var ECBaseIPGoal = [0, 1800, 975, 600, 2750, 750, 850, 2000, 1300, 1750, 3000, 500, 110000];
	var ECPerComp = [0, 200, 175, 75, 550, 400, 250, 530, 900, 250, 300, 200, 12000]
	
	var baseDecimal = new Decimal("1e" + ECBaseIPGoal[challNum]);
	var perCompDecimal = new Decimal("1e" + ECPerComp[challNum]);
	return baseDecimal.times(perCompDecimal.pow(timesCompleted)).max(baseDecimal);
}

var postC2Count = 0;
var IPminpeak = new Decimal(0)
var EPminpeak = new Decimal(0)
var replicantiTicks = 0
var eternitiesGain = 0

// Consolidates all checks for game speed changes (EC12, time glyphs, wormhole)
function getGameSpeedupFactor(takeGlyphsIntoAccount = true) {
  let factor = 1;
  if (player.currentEternityChall === "eterc12") {
    return 1/1000;
  }
  if (takeGlyphsIntoAccount) {
    factor *= Math.max(1, getAdjustedGlyphEffect("timespeed"));
  }
  
  if (player.wormhole[0] !== undefined) {
    if (player.wormhole[0].active && !player.wormholePause) factor *= player.wormhole[0].power
    if (player.wormhole[0].active && player.wormhole[1].active && !player.wormholePause) factor *= player.wormhole[1].power
    if (player.wormhole[0].active && player.wormhole[1].active && player.wormhole[2].active && !player.wormholePause) factor *= player.wormhole[2].power
  } else dev.updateTestSave() // TODO, REMOVE
  
  return factor;
}

function gameLoop(diff) {
    let view;
    var thisUpdate = new Date().getTime();
    if (thisUpdate - player.lastUpdate >= 21600000) giveAchievement("Don't you dare to sleep")
    if (typeof diff === 'undefined') var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
    if (diff < 0) diff = 1;
    speedFactor = getGameSpeedupFactor();
    diff *= speedFactor;
    const diffTs = TimeSpan.fromMilliseconds(diff);
    if (player.thisInfinityTime < -10) player.thisInfinityTime = Infinity
    if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity

    // Why 20? No fucking idea!
    // Enjoy legacy!
    Autobuyer.intervalTimer += diff / 20;
    Autobuyer.tickTimer += diff;
    let autobuyerInterval = player.infinityUpgrades.includes("autoBuyerUpgrade") ? 50 : 100;
    while (Autobuyer.tickTimer >= autobuyerInterval) {
      Autobuyer.tickTimer -= autobuyerInterval;
      autoBuyerTick();
    }

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



    if (player.infinityUpgrades.includes("infinitiedGeneration") && player.currentEternityChall !== "eterc4") {
        if (player.reality.upg.includes(11)) {
            player.infinitied += Math.floor(gainedInfinities() * 0.1)
        } else player.partInfinitied += diff / player.bestInfinityTime;
    }
    if (player.partInfinitied >= 50) {
        player.infinitied += Math.floor(player.partInfinitied/5)
        player.partInfinitied = 0;
    }

    if (player.partInfinitied >= 5) {
        player.partInfinitied -= 5;
        player.infinitied ++;
    }

    if (player.reality.upg.includes(14)) {
        eternitiesGain += diff * player.realities / 1000
        if (player.reality.upg.includes(23)) eternitiesGain *= Math.pow(3, player.reality.rebuyables[3])
        if (eternitiesGain < 2) {
            player.eternities += 1
            player.eternitiesGain -= 1
        } else {
            player.eternities += Math.floor(eternitiesGain)
            eternitiesGain -= Math.floor(eternitiesGain)
        }
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

    player.realTimePlayed += diff / speedFactor
    player.totalTimePlayed += diff
    player.thisInfinityTime += diff
    player.thisEternity += diff
    player.thisReality += diff

    if (player.eternities > 0) document.getElementById("tdtabbtn").style.display = "inline-block"
    else document.getElementById("tdtabbtn").style.display = "none"

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

    if (getTimeDimensionProduction(1).gt(0) && ECTimesCompleted("eterc7") > 0) player.infinityDimension8.amount = player.infinityDimension8.amount.plus(getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).minus(1).times(diff/10))

    var tickmult = 1.33;
    if (player.timestudy.studies.includes(171)) tickmult = 1.25;
    if (getAdjustedGlyphEffect("timefreeTickMult") != 0) {
      tickmult = 1+(tickmult-1)*getAdjustedGlyphEffect("timefreeTickMult");
    }
    // Threshold gets +1 after softcap, can be reduced to +0.8 with glyphs
    let freeTickSoftcap = 300000;
    if (player.timeShards.gt(0)) {
      let softcapAddition = getAdjustedGlyphEffect("timefreeTickMult") == 0 ? 1 : 0.8 + 0.2*getAdjustedGlyphEffect("timefreeTickMult");
      let uncapped = Math.ceil(new Decimal(player.timeShards).log10() / Math.log10(tickmult));
      let softcapped = uncapped > freeTickSoftcap ? Math.ceil(freeTickSoftcap + (uncapped - freeTickSoftcap) * (Math.log10(tickmult) / Math.log10(softcapAddition+tickmult))) : uncapped;
      let gain = Math.max(0, softcapped - player.totalTickGained);
      player.totalTickGained += gain
      player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), gain))
      player.tickThreshold = player.totalTickGained > freeTickSoftcap ? new Decimal(tickmult).pow(freeTickSoftcap).times(new Decimal(1+tickmult).pow(softcapped-freeTickSoftcap)) : new Decimal(tickmult).pow(player.totalTickGained);
      document.getElementById("totaltickgained").textContent = "You've gained "+Math.max(player.totalTickGained, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+" tickspeed upgrades."
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
        if ((player.currentChallenge == "" || player.options.retryChallenge) && (player.bestInfinityTime <= 60000 || player.break)) {}
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


    if (player.infMultBuyer && player.infMultCost.lte("1e6000000")) {
        if (player.infMultCost.gte("1e3000000")) var dif = Math.floor((Math.min(player.infinityPoints.e, 6000000) - player.infMultCost.e) / 10) + 1;
        else var dif = player.infinityPoints.e - player.infMultCost.e + 1
        if (dif > 0) {
            if (player.infMultCost.lt("1e3000000")) {
                if (player.infMultCost.e + dif > 3000000) dif = Math.max(3000000 - player.infMultCost.e, 1)
            }
            player.infMult = player.infMult.times(Decimal.pow(2, dif))
            if (player.infMultCost.gte("1e3000000")) player.infMultCost = player.infMultCost.times(Decimal.pow("1e10", dif))
            else player.infMultCost = player.infMultCost.times(Decimal.pow(10, dif))
            document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
            if (player.infMultCost.gte("1e3000000")) player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(1e10))
            else player.infinityPoints = player.infinityPoints.minus(player.infMultCost.dividedBy(10))
            if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autoCrunchMode == "amount") player.autobuyers[11].priority = player.autobuyers[11].priority.times(Decimal.pow(2, dif));
            if (player.autoCrunchMode == "amount") document.getElementById("priority12").value = player.autobuyers[11].priority
        }
    }
    else if (player.infMultCost.gte("1e6000000")) {
      document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>(Capped at " +shortenCosts(new Decimal("1e6000000"))+ " IP)"
      document.getElementById("infiMult").className = "infinistorebtnlocked"
    }
    else {
      document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shorten(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"
    }
    
    if (player.reality.epmultbuyer) buyMaxEPMult();

	// Text on Eternity button
    var currentEPmin = gainedEternityPoints().dividedBy(player.thisEternity/60000)
    if (currentEPmin.gt(EPminpeak) && player.infinityPoints.gte(Number.MAX_VALUE)) EPminpeak = currentEPmin
    document.getElementById("eternitybtn").innerHTML = (player.eternities == 0) ? "Other times await.. I need to become Eternal" : "<b>I need to become Eternal.</b><br>"+"Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+shortenDimensions(currentEPmin)+ " EP/min<br>Peaked at "+shortenDimensions(EPminpeak)+" EP/min"
    if (gainedEternityPoints().gte(1e6)) document.getElementById("eternitybtn").innerHTML = "Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+shortenDimensions(currentEPmin)+ " EP/min<br>Peaked at "+shortenDimensions(EPminpeak)+" EP/min"
    if (player.dilation.active) document.getElementById("eternitybtn").innerHTML = "Gain <b>"+shortenDimensions(gainedEternityPoints())+"</b> Eternity points.<br>"+"+"+shortenMoney(getTachyonGain()) +" Tachyon particles."
    
	// EC completion
	if (player.currentEternityChall !== "") document.getElementById("eternitybtn").textContent = "Other challenges await.. I need to become Eternal"
    var challNum = parseInt(player.currentEternityChall.split("eterc")[1])
    if (player.reality.perks.includes(32) && player.infinityPoints.gte(getECGoalIP(challNum, ECTimesCompleted(player.currentEternityChall)))) {
		var completitions = 1
		// This assumes bulk completion won't go above x5 btw
		var maxEC4Valid = 5 - Math.ceil(player.infinitied / 4)
		var maxEC12Valid = 5 - Math.floor(player.thisEternity / 200)
		while (completitions < 5 - ECTimesCompleted(player.currentEternityChall) && 
				player.infinityPoints.gte(getECGoalIP(challNum, ECTimesCompleted(player.currentEternityChall) + completitions))) completitions += 1
		var totalCompletions = ECTimesCompleted(player.currentEternityChall) + completitions
		var nextGoalText = "<br>Next goal at " + shortenCosts(getECGoalIP(challNum, totalCompletions))
				
		if (player.currentEternityChall == "eterc4" && totalCompletions >= maxEC4Valid) {
			completitions = Math.min(totalCompletions, maxEC4Valid) - ECTimesCompleted(player.currentEternityChall)
			nextGoalText = "<br>(Too many infinities for more)"
		}
		if (player.currentEternityChall == "eterc12" && totalCompletions >= maxEC12Valid) {
			completitions = Math.min(totalCompletions, maxEC12Valid) - ECTimesCompleted(player.currentEternityChall)
			nextGoalText = "<br>(Too slow for more)"
		}
					  
		document.getElementById("eternitybtn").innerHTML = "Other challenges await.. <br>+" + completitions + " completitions on Eternity" +
                                                         ((completitions + ECTimesCompleted(player.currentEternityChall) == 5) ? "" : nextGoalText)
    }
	
	// Warning to not eternity immediately when reality launches (should only really show up when it matters, in terms of resetting very large amounts of replicanti)
	if (player.realities == 0 && player.eternityPoints.exponent >= 4000 && player.timestudy.theorem > 5e9 && player.replicanti.amount.exponent > 20000)
		document.getElementById("eternitybtn").innerHTML = "Gain <b>" + (player.dilation.active ? shortenMoney(getTachyonGain()) +" Tachyon particles</b><br>" : shortenDimensions(gainedEternityPoints()) + " EP</b><br>")
			+ "You should explore a bit and look at new content before clicking me!";
	
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
    if (player.eternities >= 1 && Notation.current().isPain()) {
        player.secretUnlocks.painTimer += player.options.updateRate/1000;
        if (player.secretUnlocks.painTimer >= 600) giveAchievement("Do you enjoy pain?");
    }

    if (Tab.statistics.isOpen) {
        statsTimer += player.options.updateRate/1000;
        if (statsTimer >= 900) giveAchievement("Are you statisfied now?");
    }

    if(player.money.gt(Math.pow(10,63))) giveAchievement("Supersanic");

    for (var tier = 1; tier < 9; tier++) {
        if (player.infinityPoints.gte(player["infinityDimension"+tier].cost)) document.getElementById("infMax"+tier).className = "storebtn"
        else document.getElementById("infMax"+tier).className = "unavailablebtn"
    }

    for (var tier = 1; tier < 9; tier++) {
        if (player.eternityPoints.gte(player["timeDimension"+tier].cost)) document.getElementById("timeMax"+tier).className = "storebtn"
        else document.getElementById("timeMax"+tier).className = "unavailablebtn"
    }

    if (player.dilation.studies.includes(1)) player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond()*diff/1000)

    // Free galaxies (2x doesn't apply past 1000)
    let freeGalaxyMult = 1;
    if (player.dilation.upgrades.includes(4)) 
      freeGalaxyMult = 2;
    if (player.dilation.baseFreeGalaxies == undefined)
      player.dilation.baseFreeGalaxies = player.dilation.freeGalaxies / freeGalaxyMult;
    let thresholdMult = getFreeGalaxyMult();
    player.dilation.baseFreeGalaxies = Math.max(player.dilation.baseFreeGalaxies, 1 + Math.floor(Decimal.log(player.dilation.dilatedTime.dividedBy(1000), new Decimal(thresholdMult))));
    player.dilation.nextThreshold = new Decimal(1000).times(new Decimal(thresholdMult).pow(player.dilation.baseFreeGalaxies));
    player.dilation.freeGalaxies = Math.min(player.dilation.baseFreeGalaxies * freeGalaxyMult, 1000) + Math.max(player.dilation.baseFreeGalaxies * freeGalaxyMult - 1000, 0) / freeGalaxyMult;

    player.timestudy.theorem += getAdjustedGlyphEffect("dilationTTgen")*diff/1000



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
        if (player.infinityUpgrades.includes("skipReset3") && player.infinityPoints.gte(300)) document.getElementById("infi44").className = "infinistorebtn4"
        else document.getElementById("infi44").className = "infinistorebtnlocked"
        if (player.infinityUpgrades.includes("skipResetGalaxy") && player.infinityUpgrades.includes("passiveGen") && player.infinityUpgrades.includes("galaxyBoost") && player.infinityUpgrades.includes("resetBoost") && player.infinityPoints.gte(player.infMultCost) && player.infMultCost.lte("1e6000000")) {
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

    ui.view.tabs.dimensions.normal.sacrifice.isAvailable = player.eightAmount > 0 && player.currentEternityChall !== "eterc3";

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

    view = ui.view.tabs.dimensions.normal.progress;
    function setProgress(current, goal, tooltip) {
      view.fill = Decimal.min(Decimal.log10(current.add(1)) / Decimal.log10(goal) * 100, 100);
      view.tooltip = tooltip;
    }
    if (player.currentChallenge !== "") {
        setProgress(player.money, player.challengeTarget, "Percentage to challenge goal");
    } else if (!player.break) {
        setProgress(player.money, Number.MAX_VALUE, "Percentage to Infinity");
    } else if (player.infDimensionsUnlocked.includes(false)) {
        setProgress(player.money, getNewInfReq(), "Percentage to next dimension unlock");
    } else if (player.currentEternityChall !== "") {
        setProgress(player.infinityPoints, player.eternityChallGoal, "Percentage to eternity challenge goal");
    } else {
        setProgress(player.infinityPoints, Number.MAX_VALUE, "Percentage to Eternity");
    }

    if (player.eternities > 0) {
        document.getElementById("infinitybtn").style.display = "inline-block";
        document.getElementById("challengesbtn").style.display = "inline-block";
    }

    document.getElementById("ec1reward").textContent = "Reward: Time dimensions gain a multiplier based on time spent this eternity, Currently: "+shortenMoney(Math.pow(Math.max(player.thisEternity*10, 1), 0.3+(ECTimesCompleted("eterc1")*0.05)))+"x"
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

    var shiftRequirement = getShiftRequirement(0);

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

    ui.view.tabs.dimensions.normal.sacrifice.boost = calcSacrificeBoost();
    if (isNaN(player.totalmoney)) player.totalmoney = new Decimal(10)
    if (player.timestudy.studies.includes(181)) player.infinityPoints = player.infinityPoints.plus(gainedInfinityPoints().times(diff/100000))
    if (player.dilation.upgrades.includes(10)) {
        player.timestudy.theorem += parseFloat(player.dilation.tachyonParticles.div(20000).times(diff/1000).toString())
        if (document.getElementById("timestudies").style.display != "none" && document.getElementById("eternitystore").style.display != "none") {
            updateTimeStudyButtons()
        }
    }

    document.getElementById("infinityPoints1").innerHTML = "You have <span class=\"IPAmount1\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity point" + ((player.infinityPoints.eq(1)) ? "." : "s.")
    document.getElementById("infinityPoints2").innerHTML = "You have <span class=\"IPAmount2\">"+shortenDimensions(player.infinityPoints)+"</span> Infinity point" + ((player.infinityPoints.eq(1)) ? "." : "s.")
  
  // Adjust the text on the reality button in order to minimize text overflowing
  let glyphLevelText = "<br>Glyph level: "+shortenDimensions(gainedGlyphLevel())+" ("+percentToNextGlyphLevel()+"%)";
  if (player.dilation.studies.length < 6) // Make sure reality has been unlocked again
    document.getElementById("realitymachine").innerHTML = "You need to purchase the study at the bottom of the tree to reality again!"
	else if (gainedRealityMachines() > 554)  // At more than (e7659 EP, 554 RM) each +1 EP exponent always adds at least one more RM, so drop the percentage entirely
		document.getElementById("realitymachine").innerHTML = "Make a new reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+glyphLevelText;
  else if (player.eternityPoints.exponent > 4986)  // At more than (4986 EP, 5.48 RM) each +1 EP exponent always adds at least one more RM percent, so drop the decimal points
		document.getElementById("realitymachine").innerHTML = "Make a new reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+" ("+Math.floor(percentToNextRealityMachine()).toFixed(0)+"%)"+glyphLevelText;
	else 
		document.getElementById("realitymachine").innerHTML = "Make a new reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+" ("+percentToNextRealityMachine()+"%)"+glyphLevelText
  document.getElementById("realitymachines").innerHTML = "You have <span class=\"RMAmount1\">"+shortenDimensions(player.reality.realityMachines)+"</span> Reality Machine" + ((player.reality.realityMachines.eq(1)) ? "." : "s.")
  
  // Tooltip for reality button stating more detailed RM and glyph level info
  let nextRMText = gainedRealityMachines() < 100 ? "Next RM gained at " + shortenDimensions(new Decimal("1e" + Math.ceil(4000*(1 + Math.log(parseInt(gainedRealityMachines().toFixed()) + 1)/Math.log(1000))))) + "<br><br>" : "";
  let EPFactor = Math.sqrt(player.eternityPoints.e / 4000);
  let replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  let replFactor = Math.pow(player.replicanti.amount.e, replPow) / Math.sqrt(100000 / Math.sqrt(4000));
  let DTFactor = Math.pow(player.dilation.dilatedTime.log10(), 1.3) / Math.sqrt(100000 / Math.sqrt(4000));
  if (player.dilation.dilatedTime.exponent == 0)
    DTFactor = 0;
  let eterFactor = Math.max(Math.sqrt(Math.log10(player.eternities)) * 0.45, 1);
  let perkFactor = 0;
  if (player.reality.perks.includes(21)) perkFactor++;
  if (player.reality.perks.includes(24)) perkFactor++;
  let factorNames = ["EP", "Replicanti", "DT", "Eternities", "Perks"];
  let factorNumbers = [EPFactor.toFixed(2), "x"+replFactor.toFixed(2), "x"+DTFactor.toFixed(2), "x"+eterFactor.toFixed(2), "+"+perkFactor]
  let isFactorDisplayed = [true, true, true, player.reality.upg.includes(18), perkFactor != 0]
  let glyphLevelFactorText = 'Glyph level factors:<table style="width:100%">';
  for (let i = 0; i < factorNames.length; i++)
    if (isFactorDisplayed[i])
      glyphLevelFactorText += "<tr><td>" + factorNames[i] + "</td><td>" + factorNumbers[i] + "</td></tr>";
  glyphLevelFactorText += "</table>";
  document.getElementById("realitymachine").className = "infotooltip"
  $("#realitymachine").append('<span class="infotooltiptext">' + nextRMText + glyphLevelFactorText + "</span>");
  
  if (player.wormhole[0].unlocked) {
    wormHoleLoop(diff, 0)
    wormHoleLoop(diff, 1)
    wormHoleLoop(diff, 2)
  }
		
	// Increased cost scaling tooltips
	if (player.eternityPoints.exponent > 6000)
		document.getElementById("maxTimeDimensions").setAttribute('ach-tooltip', "TD costs start increasing faster after " + shortenDimensions(new Decimal("1e6000")));
	
	// Achievement tooltip editing (for amount of time locked)
	if (player.realities > 0) {
		for (var key in allAchievements) {
			var achName = allAchievements[key];
			var oldText = document.getElementById(allAchievements[key]).getAttribute("ach-tooltip");
			var lockText = lockedString(key);
			var textLines = oldText.split("\n");
			document.getElementById(allAchievements[key]).setAttribute("ach-tooltip", textLines[0] + lockText);
		}
	}
  
  // Reality unlock and TTgen perk autobuy
	if (player.reality.perks.includes(65) && player.dilation.dilatedTime.gte(1e15))  buyDilationUpgrade(10);
  if (player.reality.perks.includes(66) && player.timeDimension8.bought != 0 && gainedRealityMachines() > 0)  buyDilationStudy(6, 5e9);
  
    player.lastUpdate = thisUpdate;
}

// Reducing boilerplate code a bit (runs a specified number of ticks with a specified length and triggers autobuyers after each tick)
function gameLoopWithAutobuyers(seconds, ticks, real) {
  for (let ticksDone = 0; ticksDone < ticks; ticksDone++) {
    gameLoop(1000 * seconds)
    autoBuyerTick();
    if (real)
      console.log(ticksDone)
  }
}

function simulateTime(seconds, real, fast) {

    //the game is simulated at a base 50ms update rate, with a max of 1000 ticks. additional ticks are converted into a higher diff per tick
    //warning: do not call this function with real unless you know what you're doing
    //calling it with fast will only simulate it with a max of 50 ticks
    var ticks = seconds * 20;
    var bonusDiff = 0;
    var playerStart = Object.assign({}, player);
    let wormholeActivations = 0;
    
    // Simulation code with wormhole (should be at most 600 ticks)
    if (player.wormhole[0].unlocked) {
      let wormholeCycleTime = player.wormhole[0].duration + player.wormhole[0].speed;
      wormholeActivations = Math.floor(seconds / wormholeCycleTime);
      
      if (wormholeActivations < 2)  // Should be fine to just simulate the ticks
        gameLoopWithAutobuyers(seconds / 600, 600, real)
      else {
        // Simulate until the start of the idle cycle (50 ticks each part) for code consistency
        let simulatedAtStart = 0;
        if (!player.wormhole[0].active) {
          let simulatedIdleTime = player.wormhole[0].speed - player.wormhole[0].phase;
          gameLoopWithAutobuyers(simulatedIdleTime / 50, 50, real);
          setWormhole(true, 0);
          simulatedAtStart += simulatedIdleTime;
        }
        let simulatedActiveTime = player.wormhole[0].duration - player.wormhole[0].phase;
        gameLoopWithAutobuyers(simulatedActiveTime / 50, 50, real);
        setWormhole(false, 0);
        simulatedAtStart += simulatedActiveTime;
        
        // Calculate how much time to simulate after cycles, "borrowing" time from one activation if needed
        let afterCycleTime = seconds - wormholeActivations * wormholeCycleTime - simulatedAtStart;
        if (afterCycleTime < 0) {
          afterCycleTime += wormholeCycleTime;
          wormholeActivations--;
        }
        
        // Simulate repeated wormhole activations
        if (wormholeActivations < 100) { // Run X ticks per activation, half on and half off, maximum 400
          let ticksPerActivation = Math.floor(400 / wormholeActivations);
          for (let act = 0; act < wormholeActivations; act++) {
            gameLoopWithAutobuyers(player.wormhole[0].speed / ticksPerActivation, ticksPerActivation, real)
            setWormhole(true, 0);
            gameLoopWithAutobuyers(player.wormhole[0].duration / ticksPerActivation, ticksPerActivation, real)
            setWormhole(false, 0);
          }
        }
        else {  // Calculates an average speedup and just does 400 ticks at that rate with the wormhole explicitly disabled after each tick
          let avgSpeed = (player.wormhole[0].speed + player.wormhole[0].power * player.wormhole[0].duration) / wormholeCycleTime;
          oldTotalTime = player.totalTimePlayed;
          oldRealTime = player.realTimePlayed;
          for (let ticksDone = 0; ticksDone < 400; ticksDone++) {
            gameLoop(avgSpeed * seconds);
            setWormhole(false, 0);
            autoBuyerTick();
          if (real)
            console.log(ticksDone)
          }
          player.totalTimePlayed = oldTotalTime + 1000*seconds * avgSpeed;
          player.realTimePlayed = oldRealTime + 1000*seconds;
        }
      
        // Simulates another 100 ticks after the wormhole stuff to get the right phase
        gameLoopWithAutobuyers(afterCycleTime / 100, 100, real);
      }
    }
      
    // This is pretty much the older simulation code
    else {  
      if (ticks > 1000 && !real && !fast) {
          bonusDiff = (ticks - 1000) / 20;
          ticks = 1000;
      } else if (ticks > 50 && fast) {
          bonusDiff = (ticks - 50);
          ticks = 50;
      }
      gameLoopWithAutobuyers((50+bonusDiff) / 1000, ticks, real)
    }
    var popupString = "While you were away"
    if (player.money.gt(playerStart.money)) popupString+= ",<br> your antimatter increased "+shortenMoney(player.money.log10() - (playerStart.money).log10())+" orders of magnitude"
    if (player.infinityPower.gt(playerStart.infinityPower)) popupString+= ",<br> infinity power increased "+shortenMoney(player.infinityPower.log10() - (Decimal.max(playerStart.infinityPower, 1)).log10())+" orders of magnitude"
    if (player.timeShards.gt(playerStart.timeShards)) popupString+= ",<br> time shards increased "+shortenMoney(player.timeShards.log10() - (Decimal.max(playerStart.timeShards, 1)).log10())+" orders of magnitude"
    if (player.infinitied > playerStart.infinitied || player.eternities > playerStart.eternities) popupString+= ","
    else popupString+= "."
    if (player.infinitied > playerStart.infinitied) popupString+= "<br>you infinitied "+(player.infinitied-playerStart.infinitied)+((player.infinitied-playerStart.infinitied === 1) ? " time." : " times.")
    if (player.eternities > playerStart.eternities) popupString+= " <br>you eternitied "+(player.eternities-playerStart.eternities)+((player.eternities-playerStart.eternities === 1) ? " time." : " times.")
    if (wormholeActivations != 0)  popupString+= " <br>The wormhole activated  "+ wormholeActivations + (wormholeActivations == 1 ? " time." : " times.")
    if (popupString === "While you were away.") {
        popupString+= ".. Nothing happened."
        giveAchievement("While you were away... Nothing happened.")
    }

    Modal.message.show(popupString);
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
            addChartData(getDimensionProductionPerSecond(1).times(player.chall3Pow));
        } else {
            addChartData(getDimensionProductionPerSecond(1));
        }
    }
    if (player.options.chart.updateRate) {
        setTimeout(updateChart, player.options.chart.updateRate);
    } else {
        setTimeout(updateChart, 1000);
    }
}
updateChart(true);

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
            if (Notation.current().isCancer()) player.spreadingCancer += 1;
            player.galaxies++
        }
        player.galaxies--
        galaxyReset()
    }
}

function maxBuyDimBoosts(manual) {
    let requirement = undefined;
    let bulk = 0;
    do {
        if (!ensureShift(bulk++)) return;
    } while (requirement.tier < 8);

    let availableBoosts = Number.MAX_VALUE;
    if (player.overXGalaxies > player.galaxies && !manual) {
        availableBoosts = player.autobuyers[9].priority - player.resets - bulk;
    }

    if (availableBoosts <= 0) {
        bulk += availableBoosts;
        tryBoost(bulk);
        return;
    }

    let firstBoost = requirement;
    let secondBoost = ensureShift(bulk);
    if (!secondBoost) return;

    let increase = secondBoost.amount - firstBoost.amount;
    let minBoosts = bulk;
    let maxBoosts = bulk + Math.floor((player.eightAmount - secondBoost.amount) / increase);
    maxBoosts = Math.min(maxBoosts, availableBoosts);

    // Usually enough, as boost scaling is linear most of the time
    if (canBoost(maxBoosts)){
        tryBoost(maxBoosts);
        return;
    }

    // But in case of EC5 it's not, so do binarysearch-like search for appropriate boost amount
    while (maxBoosts !== (minBoosts + 1)) {
        let middle = Math.floor((maxBoosts + minBoosts) / 2);
        if (canBoost(middle)) {
            minBoosts = middle;
        }
        else {
            maxBoosts = middle;
        }
    }

    tryBoost(maxBoosts - 1);

    function ensureShift(bulk) {
        requirement = getShiftRequirement(bulk);
        if (requirementIsMet(requirement)) {
            return requirement;
        }
        tryBoost(bulk);
        return undefined;
    }
    function canBoost(bulk) {
        return requirementIsMet(getShiftRequirement(bulk));
    }
    function requirementIsMet(requirement) {
        return player[TIER_NAMES[requirement.tier]+"Amount"] >= requirement.amount;
    }
    function tryBoost(bulk) {
        if (bulk > 0) {
            softReset(bulk);
        }
    }
}

var timer = 0
function autoBuyerTick() {
    if ( player.eternities >= 100 && player.eternityBuyer.isOn ) {
        if (player.autoEternityMode == "amount") {
            if (player.currentEternityChall != "" || gainedEternityPoints().gte(player.eternityBuyer.limit)) eternity(false, true)
        } else if (player.autoEternityMode == "time") {
            if (player.thisEternity / 1000 > player.eternityBuyer.limit  * getGameSpeedupFactor(false)) eternity(false, true)
        } else {
            if (gainedEternityPoints().gte(player.lastTenEternities[0][1].times(player.eternityBuyer.limit))) eternity(false, true)
        }   
    }

    if (player.reality.upg.includes(25) && player.realityBuyer.isOn ) {
        if (player.autoRealityMode == "rm") {
            if (gainedRealityMachines().gte(player.realityBuyer.rm)) reality(false, false, true)
        } else if (player.autoRealityMode == "glyph") {
            if (gainedGlyphLevel() >= player.realityBuyer.glyph) reality(false, false, true)
        } else if (player.autoRealityMode == "either") {
            if (gainedGlyphLevel() >= player.realityBuyer.glyph || gainedRealityMachines().gte(player.realityBuyer.rm)) reality(false, false, true)
        } else if (player.autoRealityMode == "both") {
            if (gainedGlyphLevel() >= player.realityBuyer.glyph && gainedRealityMachines().gte(player.realityBuyer.rm)) reality(false, false, true)
        }
    }

    if (player.autobuyers[11]%1 !== 0) {
    if (player.autobuyers[11].ticks*100 >= player.autobuyers[11].interval && player.money.gte(Number.MAX_VALUE)) {
        if (player.autobuyers[11].isOn) {
            if (player.autoCrunchMode == "amount") {
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.lt(gainedInfinityPoints())) {
                    autoS = false;
                    document.getElementById("bigcrunch").click()
                }
            } else if (player.autoCrunchMode == "time"){
                if (!player.break || player.currentChallenge != "" || player.autobuyers[11].priority.times(getGameSpeedupFactor(false)).lt(player.thisInfinityTime /1000)) {
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
                    secondSoftResetBtnClick();
                    player.autobuyers[10].ticks = 1;
                }
            } else if (player.autobuyers[10].isOn){
                const interval = player.autobuyers[10].bulk;
                if (Autobuyer.intervalTimer - Autobuyer.lastGalaxy >= interval) {
                  Autobuyer.lastGalaxy = Autobuyer.intervalTimer;
                  maxBuyGalaxies()
                }
            }
        } else player.autobuyers[10].ticks += 1;
    }


    if (player.autobuyers[9]%1 !== 0) {
        if (player.autobuyers[9].isOn && dimBoolean()) {
            if (player.resets < 4) softReset(1)
            else if (player.eternities < 10) softReset(player.autobuyers[9].bulk)
            else {
              const interval = player.autobuyers[9].bulk;
              if (Autobuyer.intervalTimer - Autobuyer.lastDimBoost >= interval) {
                Autobuyer.lastDimBoost = Autobuyer.intervalTimer;
                maxBuyDimBoosts()
              }
            }
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

function autoBuyDilationUpgrades() {
  if (player.reality.perks.includes(12)) {
    buyDilationUpgrade(1)
    buyDilationUpgrade(2)
    buyDilationUpgrade(3)
  }
}

function autoBuyReplicantiUpgrades() {
  if (player.eternities >= 40 && player.replicanti.auto[0] && player.currentEternityChall !== "eterc8") {
    while (player.infinityPoints.gte(player.replicanti.chanceCost) && player.currentEternityChall !== "eterc8" && nearestPercent(player.replicanti.chance) < getMaxReplicantiChance())
      if (!upgradeReplicantiChance())
        break;
  }

  if (player.eternities >= 60 && player.replicanti.auto[1] && player.currentEternityChall !== "eterc8") {
    while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && ((player.timestudy.studies.includes(22)) ? player.replicanti.interval > 1 : player.replicanti.interval > 50)) upgradeReplicantiInterval()
  }

  if (player.eternities >= 80 && player.replicanti.auto[2] && player.currentEternityChall !== "eterc8") {
    while (upgradeReplicantiGalaxy()) continue
  }
}

function autoBuyInfDims() {
  if (player.eternities > 10 && player.currentEternityChall !== "eterc8") {
    for (var i = 1; i < player.eternities - 9 && i < 9; i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i)
        buyManyInfinityDimension(i)
      }
    }
  }
}

function autoBuyTimeDims() {
    if (player.reality.upg.includes(13)) {
      for (var i = 1; i < 9; i++) {
        if (player.reality.tdbuyers[i - 1]) {
          buyMaxTimeDims(i)
        }
      }
    }
}

function autoBuyExtraTimeDims() {
  if (player.timeDimension8.bought == 0 && player.reality.perks.includes(64)) {
    buyDilationStudy(2, 1000000)
    buyDilationStudy(3, 1e7)
    buyDilationStudy(4, 1e8)
    buyDilationStudy(5, 1e9)
  }
}

var slowerAutobuyerTimer = 0
setInterval(function() {
  slowerAutobuyerTimer += 1/3
  if (player.reality.perks.includes(61)) autoBuyInfDims()
  if (player.reality.perks.includes(62)) autoBuyReplicantiUpgrades()
  if (player.reality.perks.includes(63)) autoBuyDilationUpgrades()

  if (slowerAutobuyerTimer > 1) {
    slowerAutobuyerTimer -= 1
    if (!player.reality.perks.includes(61)) autoBuyInfDims()
    if (!player.reality.perks.includes(62)) autoBuyReplicantiUpgrades()
    if (!player.reality.perks.includes(63)) autoBuyDilationUpgrades()
    autoBuyTimeDims()

    autoBuyExtraTimeDims()
  }
}, 333)


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

function showDimTab(tabName, init) {
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
    if (tabName === 'timestudies' && !init) document.getElementById("TTbuttons").style.display = "flex"
    else document.getElementById("TTbuttons").style.display = "none"
    resizeCanvas()
    tryStartTachyonAnimation();
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
    if (document.getElementById("perks").style.display !== "none") network.moveTo({position: {x:0, y:0}, scale: 0.8, offset: {x:0, y:0}})
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
    document.getElementById('dimensionsbtnvue').onclick = function () {
        showTab('dimensionsvue');
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
        kong.updatePurchases();
    }
    //show one tab during init or they'll all start hidden
    showTab('dimensions')
    showInfTab('preinf')
    showChallengesTab('challenges')
    showEternityTab('timestudies', true)
    load_game();
    updateTickSpeed();
    updateAutobuyers();
    updateChallengeTimes()
    kong.init();
    TLN.append_line_numbers("automator") // Automator line numbers

    //if (typeof kongregate === 'undefined') document.getElementById("shopbtn").style.display = "none"
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
        if (kong.enabled) {
            playFabLogin();
            kong.updatePurchases();
        }
        else {
            document.getElementById("shopbtn").style.display = "none";
        }
        document.getElementById("container").style.display = "flex"
        document.getElementById("loading").style.display = "none"
    }, 1000)

}

window.onfocus = function() {
    setControlKey(false);
    setShiftKey(false);
    drawAutomatorTree();
};

window.onblur = function() {
  Keyboard.stopSpins();
};

function setShiftKey(isDown) {
  shiftDown = isDown;
  ui.view.shiftDown = isDown;
  document.getElementById("automatorloadsavetext").textContent = isDown ? "save:" : "load:";
  drawStudyTree()
  if (isDown) showPerkLabels()
  else hidePerkLabels()
}

function setControlKey(isDown) {
  controlDown = isDown;
}

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

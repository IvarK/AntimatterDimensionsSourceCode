if (crashed) {
  throw "Initialization failed";
}

var defaultStart = deepmerge.all([{}, player]);

let kongIPMult = 1
let kongDimMult = 1
let kongAllDimMult = 1
let kongEPMult = 1

function showTab(tabName) {
    tryShowtab(tabName);
    hideLegacyTabs(tabName);
    resizeCanvas();
    Modal.hide();
    if (tabName !== "statistics") statsTimer = 0
    if (document.getElementById("perks").style.display !== "none") network.moveTo({position: {x:0, y:0}, scale: 0.8, offset: {x:0, y:0}})
}

function hideLegacyTabs(tabName) {
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
  // workaround for Vue mounted issues until reality tab is vue'd
  if (tabName === "reality") {
    if (!ui.view.tabs.reality.subtab) ui.view.tabs.reality.subtab = "glyphstab";
    ui.view.tabs.current = "reality-tab";
  }
}

function floatText(tier, text) {
  if (!player.options.animations.floatingText) return;
  const floatingText = ui.view.tabs.dimensions.normal.floatingText[tier];
  floatingText.push({ text: text, key: UIID.next() });
  setTimeout(() => floatingText.shift(), 1000)
}

document.getElementById("news").onclick = function () {
    if (document.getElementById("news").textContent === "Click this to unlock a secret achievement.") {
        giveAchievement("Real news")
    }
};

function maxAll() {
  if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;
  buyMaxTickSpeed();

  for (var tier = 1; tier < 9; tier++) {
    const dimension = NormalDimension(tier);
    var cost = dimension.cost.times(dimension.remainingUntil10)
    var multBefore = dimension.pow
    if (tier >= 3 && Challenge(6).isRunning) {
      const lowerTier = NormalDimension(tier - 2);
      if (!canBuyDimension(tier)) continue
      if (lowerTier.amount.lt(cost)) continue
      if (canBuyDimension(tier)) {
        if (cost.lt(lowerTier.amount) && dimension.boughtBefore10 !== 0) {
          lowerTier.amount = lowerTier.amount.minus(cost)
          dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10))
          dimension.bought += dimension.remainingUntil10;
          dimension.pow = dimension.pow.times(getBuyTenMultiplier())
          dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
        }
        while (lowerTier.amount.gt(dimension.cost.times(10))) {
          lowerTier.amount = lowerTier.amount.minus(dimension.cost.times(10))
          dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
          dimension.amount = Decimal.round(dimension.amount.plus(10))
          dimension.bought += 10
          dimension.pow = dimension.pow.times(getBuyTenMultiplier())
          if (dimension.cost.gte(Number.MAX_VALUE)) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease)
        }


        onBuyDimension(tier);
      }
    } else {
      if (!canBuyDimension(tier)) continue
      if (cost.lt(player.money) && dimension.boughtBefore10 !== 0) {
        player.money = player.money.minus(cost)
        dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10))
        dimension.bought += dimension.remainingUntil10;
        dimension.pow = dimension.pow.times(getBuyTenMultiplier())
        dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
      }
      if (player.money.lt(dimension.cost.times(10))) continue

      if ((!BreakInfinityUpgrade.dimCostMult.isMaxed || InfinityChallenge(5).isRunning || Challenge(9).isRunning)) {
        while ((player.money.gte(dimension.cost.times(10)) && player.money.lte(Number.MAX_VALUE)) || (player.money.gte(dimension.cost.times(10)) && !Challenge(9).isRunning)) {
          player.money = player.money.minus(dimension.cost.times(10))
          if (!Challenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
          else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier)
          else multiplySameCosts(dimension.cost)
          dimension.amount = Decimal.round(dimension.amount.plus(10))
          dimension.bought += 10
          dimension.pow = dimension.pow.times(getBuyTenMultiplier())
          if (dimension.cost.gte(Number.MAX_VALUE)) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease)
          if (Challenge(4).isRunning) clearDimensions(tier - 1)
        }
      } else {
        if (dimension.cost.lt(Number.MAX_VALUE)) {
          while (player.money.gte(dimension.cost.times(10)) && dimension.cost.lte(Number.MAX_VALUE)) {
            player.money = player.money.minus(dimension.cost.times(10))
            if (!Challenge(9).isRunning && !InfinityChallenge(5).isRunning) dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
            else if (InfinityChallenge(5).isRunning) multiplyPC5Costs(dimension.cost, tier)
            else multiplySameCosts(dimension.cost)
            dimension.amount = Decimal.round(dimension.amount.plus(10))
            dimension.bought += 10
            dimension.pow = dimension.pow.times(getBuyTenMultiplier())
            if (dimension.cost.gte(Number.MAX_VALUE)) player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease)
            if (Challenge(4).isRunning) clearDimensions(tier - 1)
          }
        }

        if (dimension.cost.gte(Number.MAX_VALUE)) {
          var a = Math.log10(Math.sqrt(Player.dimensionMultDecrease))
          var b = player.costMultipliers[tier - 1].dividedBy(Math.sqrt(Player.dimensionMultDecrease)).log10()
          var c = dimension.cost.dividedBy(player.money).log10()
          var discriminant = Math.pow(b, 2) - (c * a * 4)
          if (discriminant < 0) continue
          var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c * a * 4)) - b) / (2 * a)) + 1
          if (buying <= 0) return false
          dimension.amount = Decimal.round(dimension.amount.plus(10 * buying))
          preInfBuy = Math.floor(1 + (308 - initCost[tier].log10()) / costMults[tier].log10())
          postInfBuy = dimension.bought / 10 + buying - preInfBuy - 1
          postInfInitCost = initCost[tier].times(Decimal.pow(costMults[tier], preInfBuy))
          dimension.bought += 10 * buying
          dimension.pow = dimension.pow.times(Decimal.pow(getBuyTenMultiplier(), buying))

          newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(Player.dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2))
          newMult = costMults[tier].times(Decimal.pow(Player.dimensionMultDecrease, postInfBuy + 1))
          //if (buying > 0 )dimension.cost = player.costMultipliers[tier-1].times(Decimal.pow(Player.dimensionMultDecrease, (buying * buying - buying)/2)).times(dimension.cost)

          dimension.cost = newCost
          player.costMultipliers[tier - 1] = newMult
          if (player.money.gte(dimension.cost)) player.money = player.money.minus(dimension.cost)
          dimension.cost = dimension.cost.times(player.costMultipliers[tier - 1])
          player.costMultipliers[tier - 1] = player.costMultipliers[tier - 1].times(Player.dimensionMultDecrease)
        }


      }
    }
    if ((Challenge(11).isRunning || InfinityChallenge(6).isRunning) && player.matter.equals(0)) player.matter = new Decimal(1);
    if (Challenge(2).isRunning) player.chall2Pow = 0;
    if (player.currentChallenge == "postc1") clearDimensions(tier - 1);
    player.postC4Tier = tier;
    onBuyDimension(tier)
    floatText(tier, "x" + shortenMoney(dimension.pow.dividedBy(multBefore)))
  }
}

function buyEPMult(upd, threshold) {
    if (upd === undefined) upd = true // this stupid solution because IE can't handle default values in the row above
    if (threshold == undefined) threshold = 1
    if (player.eternityPoints.gte(player.epmultCost.times(1/threshold))) {
        player.epmult = player.epmult.times(5)
        Autobuyer.eternity.bumpLimit(5);
        player.eternityPoints = player.eternityPoints.minus(player.epmultCost)
        let count = player.epmult.ln()/Math.log(5)
        if (player.epmultCost.gte(new Decimal("1e4000"))) player.epmultCost = Decimal.pow(1000, count + Math.pow(count-1334, 1.2)).times(500)
        else if (player.epmultCost.gte(new Decimal("1e1300"))) player.epmultCost = Decimal.pow(1000, count).times(500)
        else if (player.epmultCost.gte(Number.MAX_VALUE)) player.epmultCost = Decimal.pow(500, count).times(500)
        else if (player.epmultCost.gte(new Decimal("1e100"))) player.epmultCost = Decimal.pow(100, count).times(500)
        else player.epmultCost = Decimal.pow(50, count).times(500)
    }
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

function breakInfinity() {
    if (!Autobuyer.infinity.isUnlocked || !Autobuyer.infinity.hasMaxedInterval) return false;
    if (player.break && !player.currentChallenge.includes("post")) {
        player.break = false
        if (player.dilation.active) giveAchievement("Time fixes everything")
    } else {
        player.break = true
        giveAchievement("Limit Break")
    }
    GameUI.update();
}

function gainedInfinityPoints() {
    const div = Effects.min(
      308,
      Achievement(103),
      TimeStudy(111)
    );
    let ip = player.break ?
      Decimal.pow(10, player.money.e / div - 0.75) :
      new Decimal(308 / div);
    ip = ip.times(totalIPMult());
    if (Teresa.isRunning) {
      ip = ip.pow(0.55);
    } else if (V.isRunning) {
      ip = ip.pow(0.5);
    }
    return ip.floor();
}

function gainedEternityPoints() {
  const ip = player.infinityPoints.plus(gainedInfinityPoints());
  let ep = Decimal.pow(5, ip.e / 308 - 0.7)
    .times(player.epmult)
    .times(kongEPMult)
    .timesEffectsOf(
      TimeStudy(61),
      TimeStudy(122),
      TimeStudy(121),
      TimeStudy(123),
      RealityUpgrade(12),
      GlyphEffect.epMult
    );

  if (Teresa.isRunning) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  }
  if (Enslaved.isRunning) return Decimal.pow(5, ip.e / 308 - 0.7).times(player.epmult).times(kongEPMult).floor()
  return ep.floor();
}

function gainedRealityMachines() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)
    ret = ret.times(Teresa.rmMultiplier)
    ret = ret.times(player.celestials.teresa.rmMult)
    ret = ret.times(getAdjustedGlyphEffect("effarigrm"))
    if (Enslaved.has(ENSLAVED_UNLOCKS.RM_MULT)) ret = ret.times(Decimal.pow(getGameSpeedupFactor(), 0.1))
    ret = ret.plusEffectOf(Perk.realityMachineGain)
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(Ra.rmMult)
    return Decimal.floor(ret)
}

function gainedGlyphLevel(round) {
    if (round === undefined) round = true
    const glyphState = getGlyphLevelInputs();
    let rawLevel = glyphState.rawLevel;
    if (round) rawLevel = Math.round(rawLevel)
    if (rawLevel == Infinity || isNaN(rawLevel)) rawLevel = 0;
    let actualLevel = glyphState.actualLevel;
    if (round) actualLevel = Math.round(actualLevel)
    if (actualLevel == Infinity || isNaN(actualLevel)) actualLevel = 0
    return {
      rawLevel: rawLevel,
      actualLevel: actualLevel
    }
}

function percentToNextGlyphLevel() {
    var ret = gainedGlyphLevel(false).actualLevel
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
  for (let dimension of NormalDimension.all) {
    dimension.amount = new Decimal(0)
    dimension.pow = new Decimal(1)
    dimension.bought = 0
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
    player.money = Effects.max(
      10,
      Perk.startAM1,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78).secondaryEffect,
      Perk.startAM2
    ).toDecimal();
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
            if (value.includes(Notation.standard.abbreviations[l])) {
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

function ratePerMinute(amount, time) {
    return Decimal.divide(amount, time / (60 * 1000));
}

function averageRun(runs) {
    let totalTime = runs
        .map(run => run[0])
        .reduce(Number.sumReducer);
    let totalAmount = runs
        .map(run => run[1])
        .reduce(Decimal.sumReducer);
    return [
        totalTime / runs.length,
        totalAmount.dividedBy(runs.length)
    ];
}

function addInfinityTime(time, realTime, ip) {
  player.lastTenRuns.pop();
  player.lastTenRuns.unshift([time, ip, realTime]);
  GameCache.bestRunIPPM.invalidate();
}

function resetInfinityRuns() {
  player.lastTenRuns = Array.from({length:10}, () => [600 * 60 * 24 * 31, new Decimal(1), 600 * 60 * 24 * 31]);
  GameCache.bestRunIPPM.invalidate();
}

function addEternityTime(time, realTime, ep) {
  player.lastTenEternities.pop();
  player.lastTenEternities.unshift([time, ep, realTime]);
  GameCache.averageEPPerRun.invalidate();
}

function resetEternityRuns() {
  player.lastTenEternities = Array.from({length:10}, () => [600 * 60 * 24 * 31, new Decimal(1), 600 * 60 * 24 * 31]);
  GameCache.averageEPPerRun.invalidate();
}

function addRealityTime(time, realTime, rm, level) {
  player.lastTenRealities.pop();
  player.lastTenRealities.unshift([time, rm, level, realTime]);
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

function gainedInfinities() {
    if (EternityChallenge(4).isRunning) {
        return new Decimal(1);
    }
    let infGain = Effects.max(
      1,
      Achievement(87)
    ).toDecimal();

    infGain = infGain.timesEffectsOf(
      TimeStudy(32),
      RealityUpgrade(5),
      RealityUpgrade(7)
    );
    infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
    return infGain;
}

function failChallenge() {
    Modal.message.show("You failed the challenge, you will now exit it.");
    setTimeout(exitChallenge, 500);
    giveAchievement("You're a mistake");
    failureCount++;
    if (failureCount > 9) giveAchievement("You're a failure");
}

function exitChallenge() {
    if (player.currentChallenge !== "") {
        startChallenge("", new Decimal(0));
    } else if (player.currentEternityChall !== "") {
        player.currentEternityChall = ""
        player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
        eternity(true)
    }
}

function unlockEChall(idx) {
    if (player.eternityChallUnlocked == 0) {
        player.eternityChallUnlocked = idx
        if (!justImported) {
          Tab.challenges.eternity.show();
        }
        if (idx !== 12 && idx !== 13) player.etercreq = idx
    }
}

function quickReset() {
    if (player.resets == 0) player.resets--;
    else player.resets -= 2;
    softReset(1);
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
    if (Perk.bypassIDAntimatter.isBought || (player.money.gte(getNewInfReq()))) {
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
setInterval(function() {
    $.getJSON('version.txt', function(data){
        //data is actual content of version.txt, so
        //do whatever you need with it
        //I'd compare it with last result and if it's different
        //show the message received and nag for attention
        //like this:
        if (data.version > player.version) {
            player.version = data.version
            Modal.message.show(data.message, updateRefresh);
            //or some more resilient method
            //like forced news bar with message running over and over
        }
    })
}, 60000);

// TODO: remove before release
(function() {
  if (isLocalEnvironment()) return;
  let commit;
  setInterval(() => {
    let url = "https://api.github.com/repos/IvarK/HahaSlabWontGetHere/commits/master";
    let headers = new Headers();
    // Yes, this is my GitHub API key for reading private repo details
    headers.append("Authorization", `Basic ${btoa("Razenpok:9b15284a7c7a1142b5766f81967a96f90b7879a8")}`);

    fetch(url, { method: "GET", headers: headers })
      .then(response => response.json())
      .then(json => {
        if (commit === undefined) {
          commit = json.sha;
          return;
        }
        if (commit === json.sha) return;
        // setTimeout so GH Pages get rebuilt
        setTimeout(() => {
          Modal.message.show(`Refresh the page (game will be saved), we've got new stuff: ${json.commit.message}`, updateRefresh, true);
        }, 30000)
      });
  }, 60000);
}());

function updateRefresh() {
  save_game(false, true);
  location.reload(true);
}

setInterval(function() {
    kong.submitStats('Log10 of total antimatter', player.totalmoney.e);
    kong.submitStats('Log10 of Infinity Points', player.infinityPoints.e);
    kong.submitStats('Log10 of Eternity Points', player.eternityPoints.e);
}, 10000)

var nextAt = [new Decimal("1e2000"), new Decimal("1e5000"), new Decimal("1e12000"), new Decimal("1e14000"), new Decimal("1e18000"), new Decimal("1e20000"), new Decimal("1e23000"), new Decimal("1e28000")]

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

    document.getElementById("kongip").textContent = "Double your IP gain from all sources (additive). Forever. Currently: x"+kongIPMult+", next: x"+(kongIPMult==1? 2: kongIPMult+2)
    document.getElementById("kongep").textContent = "Triple your EP gain from all sources (additive). Forever. Currently: x"+kongEPMult+", next: x"+(kongEPMult==1? 3: kongEPMult+3)
    document.getElementById("kongdim").textContent = "Double all your normal dimension multipliers (multiplicative). Forever. Currently: x"+kongDimMult+", next: x"+(kongDimMult*2)
    document.getElementById("kongalldim").textContent = "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. Currently: x"+kongAllDimMult+", next: x"+((kongAllDimMult < 32) ? kongAllDimMult * 2 : kongAllDimMult + 32)

    if (player.eternities !== 0) document.getElementById("eternitystorebtn").style.display = "inline-block"
    else document.getElementById("eternitystorebtn").style.display = "none"

    if (getTickSpeedMultiplier().lt(0.001)) giveAchievement("Do you even bend time bro?")

    if (EternityChallenge(12).isRunning && !EternityChallenge(12).isWithinRestriction) {
        failChallenge();
    }

    if (infchallengeTimes < 750) giveAchievement("Never again")
    if (player.infinityPoints.gte(new Decimal("1e22000")) && player.timestudy.studies.length == 0) giveAchievement("What do I have to do to get rid of you")
    if (player.replicanti.galaxies >= 180*player.galaxies && player.galaxies > 0) giveAchievement("Popular music")
    if (player.eternityPoints.gte(Number.MAX_VALUE)) giveAchievement("But I wanted another prestige layer...")
    if (player.infinityPoints.gte(1e100) && player.firstAmount.equals(0) && player.infinitied.eq(0) && player.resets <= 4 && player.galaxies <= 1 && player.replicanti.galaxies == 0) giveAchievement("Like feasting on a behind")
    if (player.infinityPoints.gte('9.99999e999')) giveAchievement("This achievement doesn't exist II");
    if (player.infinityPoints.gte('1e30008')) giveAchievement("Can you get infinite IP?");
    if (player.infinitied.gt(2e6)) giveAchievement("2 Million Infinities")
    if (player.money.gte("9.9999e9999")) giveAchievement("This achievement doesn't exist")
    if (player.money.gte("1e35000")) giveAchievement("I got a few to spare")
    if (player.infinityPower.gt(1)) giveAchievement("A new beginning.");
    if (player.infinityPower.gt(1e6)) giveAchievement("1 million is a lot"); //TBD
    if (player.infinityPower.gt(1e260)) giveAchievement("4.3333 minutes of Infinity"); //TBD
    if (player.totalTickGained >= 308) giveAchievement("Infinite time");
    if (player.firstPow.gt(10e30)) giveAchievement("I forgot to nerf that")
    if (player.money.gt(10e79)) giveAchievement("Antimatter Apocalypse")
    if (player.totalTimePlayed >= 1000 * 60 * 60 * 24 * 8) giveAchievement("One for each dimension")
    if (player.seventhAmount.gt(1e12)) giveAchievement("Multidimensional");
    if (player.tickspeed.lt(1e-26)) giveAchievement("Faster than a potato");
    if (player.tickspeed.lt(1e-55)) giveAchievement("Faster than a squared potato");
    if (Math.random() < 0.00001) giveAchievement("Do you feel lucky? Well do ya punk?")
    if ((player.matter.gte(2.586e15) && player.currentChallenge == "postc6") || player.matter.gte(Number.MAX_VALUE)) giveAchievement("It's not called matter dimensions is it?")

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

    if (RealityUpgrades.allBought) $("#celestialsbtn").show() // Rebuyables and that one null value = 6
    else $("#celestialsbtn").hide()

    if (player.realities > 3) {
        $("#automatorUnlock").hide()
        $(".automator-container").show()
    } else {
        $("#automatorUnlock").show()
        $(".automator-container").hide()
    }

    updateAchievementPower();

    RealityUpgrades.tryUnlock([20, 21, 22]);
    ttMaxTimer++;
    if (Perk.autobuyerTT4.isBought) maxTheorems()
    else if (Perk.autobuyerTT3.isBought && ttMaxTimer >= 3) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }
    else if (Perk.autobuyerTT2.isBought && ttMaxTimer >= 5) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }
    else if (Perk.autobuyerTT1.isBought && ttMaxTimer >= 10) {
      maxTheorems(); 
      ttMaxTimer = 0;
    }

    EternityChallenge.autoCompleteTick()
    if (!Teresa.has(TERESA_UNLOCKS.EFFARIG)) player.celestials.teresa.rmStore *= Math.pow(0.98, 1/60) // Teresa container leak, 2% every minute, only works online.

    if (Ra.isRunning && player.eternityPoints.gte(player.celestials.ra.maxEpGained)) player.celestials.ra.maxEpGained = player.eternityPoints
}, 1000)

var postC2Count = 0;
var IPminpeak = new Decimal(0)
var EPminpeak = new Decimal(0)
var replicantiTicks = 0

const GameSpeedEffect = {EC12: 1, TIMEGLYPH: 2, BLACKHOLE: 3}

function getGameSpeedupFactor(effectsToConsider, blackHoleOverride, blackHolesActiveOverride) {
  if (effectsToConsider === undefined) {
    effectsToConsider = [GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.BLACKHOLE];
  }
  let factor = 1;
  if (EternityChallenge(12).isRunning && effectsToConsider.includes(GameSpeedEffect.EC12)) {
    // If we're taking account of EC12 at all and we're in EC12, we'll never want to consider anything else,
    // since part of the effect of EC12 is to disable all other things that affect gamespeed.
    return 1/1000;
  }
  if (effectsToConsider.includes(GameSpeedEffect.TIMEGLYPH)) {
    factor *= getAdjustedGlyphEffect("timespeed");
  }

  if (player.blackHole[0] !== undefined && effectsToConsider.includes(GameSpeedEffect.BLACKHOLE)) {
    if (blackHoleOverride !== undefined) {
      factor *= blackHoleOverride;
    } else if (!player.blackHolePause) {
      for (let i = 0; i < player.blackHole.length && blackHoleIsUnlocked(player.blackHole[i]) &&
        ((blackHolesActiveOverride !== undefined) ? i <= blackHolesActiveOverride : player.blackHole[i].active); i++) {
        blackHole = player.blackHole[i];
        factor *= getBlackHolePower(blackHole);
        if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) factor *= V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1].effect()
      }
    }
  }
  
  if (Effarig.isRunning) {
    factor = Effarig.multiplier(factor).toNumber();
  }
  factor = Math.pow(factor, getAdjustedGlyphEffect("effarigblackhole"))
  if (tempSpeedupToggle) {
    factor *= tempSpeedupFactor;
  }
  return factor;
}

let autobuyerOnGameLoop = true;

function gameLoop(diff, options = {}) {
    PerformanceStats.start("Frame Time");
    PerformanceStats.start("Game Update");
    GameCache.normalDimensionCommonMultiplier.invalidate();
    GameCache.infinityDimensionCommonMultiplier.invalidate();
    GameCache.timeDimensionCommonMultiplier.invalidate();
    const thisUpdate = Date.now();
    if (thisUpdate - player.lastUpdate >= 21600000) giveAchievement("Don't you dare to sleep")
    if (diff === undefined) var diff = Math.min(thisUpdate - player.lastUpdate, 21600000);
    if (diff < 0) diff = 1;

    if (autobuyerOnGameLoop) {
      Autobuyer.intervalTimer += diff / 20;
      Autobuyer.tickTimer += diff;
      let autobuyerInterval = BreakInfinityUpgrade.autobuyerSpeed.isBought ? 50 : 100;
      if (Autobuyer.tickTimer >= autobuyerInterval) {
        Autobuyer.tickTimer -= autobuyerInterval;
        // failsafe
        if (Autobuyer.tickTimer > autobuyerInterval) {
          Autobuyer.tickTimer = autobuyerInterval;
        }
        Autobuyer.tick();
      }
    }

    const realDiff = diff;

    if (options.gameDiff === undefined) {
      let speedFactor;
      if (options.blackHoleSpeedup === undefined) {
        speedFactor = getGameSpeedupFactor();
      } else {
        // If we're in EC12, time shouldn't speed up at all, but options.blackHoleSpeedup will be 1 so we're fine.
        speedFactor = getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH], 1) * options.blackHoleSpeedup;
      }
      if (player.celestials.enslaved.isStoring) {
        const speedFactorWithoutBlackHole = getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH]);
        // Note that in EC12, this is 0, so it's not an issue there.
        const timeStoredFactor = speedFactor / speedFactorWithoutBlackHole - 1;
        // Note that if gameDiff is specified, we don't store enslaved time.
        // Currently this only happens in a tick where we're using all the enslaved time,
        // but if it starts happening in other cases this will have to be reconsidered.
        player.celestials.enslaved.stored += diff * timeStoredFactor;
        speedFactor = speedFactorWithoutBlackHole;
      }
      diff *= speedFactor;
    } else {
      diff = options.gameDiff;
    }

    DeltaTimeState.update(realDiff, diff);

    // Black hole is affected only by time glyphs.
    let blackHoleDiff = realDiff * getGameSpeedupFactor([GameSpeedEffect.TIMEGLYPH]);

    if (player.thisInfinityTime < -10) player.thisInfinityTime = Infinity
    if (player.bestInfinityTime < -10) player.bestInfinityTime = Infinity

    if (diff/100 > player.autoTime && !player.break) player.infinityPoints = player.infinityPoints.plus(player.autoIP.times((diff/100)/player.autoTime))
    /*if (player.currentChallenge == "postc6" && player.matter.gte(1)) player.matter = player.matter.plus(diff/10)
    else */
    player.matter = player.matter.times(Decimal.pow((1.03 + player.resets/200 + player.galaxies/100), diff/100));
    if (player.matter.gt(player.money) && Challenge(11).isRunning) {
        if (player.resets > 0) player.resets--;
        softReset(0);
    }

    if (player.currentChallenge == "postc8") postc8Mult = postc8Mult.times(Math.pow(0.000000046416, diff/100))

    if (Challenge(3).isRunning || player.matter.gte(1)) {
      player.chall3Pow = Decimal.min(Number.MAX_VALUE, player.chall3Pow.times(Decimal.pow(1.00038, diff/100)));
    }
    player.chall2Pow = Math.min(player.chall2Pow + diff/100/1800, 1);
    if (InfinityChallenge(2).isRunning) {
        if (postC2Count >= 8 || diff > 8000) {
            if (player.eightAmount.gt(0)) {
                sacrificeReset();
            }
            postC2Count = 0;
        }
        else {
          postC2Count++;
        }
    }
    if (InfinityUpgrade.ipGen.isBought) {
      const genPeriod = Time.bestInfinity.totalMilliseconds * 10;
      // player.partInfinityPoint - progress until next ipGen income (fractional, from 0 to 1)
      player.partInfinityPoint += Time.deltaTimeMs / genPeriod;
      if (player.partInfinityPoint >= 1) {
        const genCount = Math.floor(player.partInfinityPoint);
        if (Teresa.isRunning) {
          player.infinityPoints = player.infinityPoints.plus(totalIPMult().times(genCount).pow(0.55))
        } else if (V.isRunning) {
          player.infinityPoints = player.infinityPoints.plus(totalIPMult().times(genCount).pow(0.5))
        } else {
          player.infinityPoints = player.infinityPoints.plus(totalIPMult().times(genCount));
        }
        player.partInfinityPoint -= genCount;
      }
    }

  let infGen = new Decimal(0);
    if (BreakInfinityUpgrade.infinitiedGen.isBought && !EternityChallenge(4).isRunning) {
      if (RealityUpgrade(11).isBought) {
        infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
      } else {
        player.partInfinitied += diff / player.bestInfinityTime;
      }
    }
    if (player.partInfinitied >= 50) {
        infGen = infGen.plus(Math.floor(player.partInfinitied / 5));
        player.partInfinitied = 0;
    }

    if (player.partInfinitied >= 5) {
        player.partInfinitied -= 5;
        infGen = infGen.plus(1);
    }
    if (EffarigUnlock.eternity.isUnlocked && !EternityChallenge(4).isRunning) {
      infGen = infGen.plus(gainedInfinities().times(player.eternities).floor().times(diff/1000))
    }

    player.infinitied = player.infinitied.plus(infGen);
    Enslaved.trackInfinityGeneration(infGen);
    
    if (RealityUpgrade(14).isBought) {
      player.reality.partEternitied += Time.deltaTime * Effects.product(
        RealityUpgrade(3),
        RealityUpgrade(14)
      );
      player.eternities += Math.floor(player.reality.partEternitied);
      player.reality.partEternitied -= Math.floor(player.reality.partEternitied);
    }

    if (Teresa.has(TERESA_UNLOCKS.EPGEN)) { // Teresa EP gen.
      let isPostEc = RealityUpgrade(10).isBought ? player.eternities > 100 : player.eternities > 0
      if (isPostEc) {
        player.eternityPoints = player.eternityPoints.plus(EPminpeak.times(0.01).times(diff/1000))
      }
    }

    player.infinityPoints = player.infinityPoints.plus(Player.bestRunIPPM.times(player.offlineProd/100).times(diff/60000))

    if (player.money.lte(Number.MAX_VALUE) || (player.break && player.currentChallenge == "") || (player.currentChallenge != "" && player.money.lte(player.challengeTarget))) {

        let maxTierProduced = 7;
        if (Challenge(12).isRunning) {
          maxTierProduced = Math.min(maxTierProduced, 6);
        }
        if (EternityChallenge(3).isRunning) {
          maxTierProduced = Math.min(maxTierProduced, 3);
        }
        if (Challenge(12).isRunning) {
          for (let tier = maxTierProduced; tier >= 1; --tier) {
            const dimension = NormalDimension(tier);
            dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 2).times(diff / 10000));
          }
        } else {
          for (let tier = maxTierProduced; tier >= 1; --tier) {
            const dimension = NormalDimension(tier);
            dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 1).times(diff / 10000));
          }
        }

        if (Challenge(3).isRunning) {
            player.money = player.money.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
        } else {
            player.money = player.money.plus(getDimensionProductionPerSecond(1).times(diff/1000));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(1).times(diff/1000));
        }
        if (Challenge(12).isRunning) {
            player.money = player.money.plus(getDimensionProductionPerSecond(2).times(diff/1000));
            player.totalmoney = player.totalmoney.plus(getDimensionProductionPerSecond(2).times(diff/1000))
        }
    }

    player.realTimePlayed += realDiff;
    if (Perk.autocompleteEC1.isBought && player.reality.autoEC) player.reality.lastAutoEC += realDiff;
    player.totalTimePlayed += diff
    player.thisInfinityTime += diff
    player.thisInfinityRealTime += realDiff;
    player.thisEternity += diff
    player.thisEternityRealTime += realDiff;
    player.thisReality += diff
    player.thisRealityRealTime += realDiff;

    for (let tier = 1; tier < 9; tier++) {
      if (tier !== 8 && (player.infDimensionsUnlocked[tier - 1] || EternityChallenge(7).completions > 0)) {
        const dimension = InfinityDimension(tier);
        dimension.amount = dimension.amount.plus(InfinityDimension(tier + 1).productionPerSecond.times(diff / 10000));
      }
      if (tier < 8) {
        const dimension = TimeDimension(tier);
        dimension.amount = dimension.amount.plus(TimeDimension(tier + 1).productionPerSecond.times(diff / 10000))
      }
    }

    const ID1ProductionThisTick = InfinityDimension(1).productionPerSecond.times(diff / 1000);
    if (EternityChallenge(7).isRunning) {
      if (!Challenge(10).isRunning) {
        player.seventhAmount = player.seventhAmount.plus(ID1ProductionThisTick)
      }
    }
    else {
      player.infinityPower = player.infinityPower.plus(ID1ProductionThisTick);
    }

    const TD1Production = TimeDimension(1).productionPerSecond;
    const TD1ProductionThisTick = TD1Production.times(diff/1000);
    if (EternityChallenge(7).isRunning) {
      player.infinityDimension8.amount = player.infinityDimension8.amount.plus(TD1ProductionThisTick)
    }
    else {
      player.timeShards = player.timeShards.plus(TD1ProductionThisTick)
    }

    if (TD1Production.gt(0)) {
      const id8 = InfinityDimension(8);
      EternityChallenge(7).reward.applyEffect(v => id8.amount = id8.amount.plus(v.times(diff/10)));
    }

  const freeTickspeed = FreeTickspeed.fromShards(player.timeShards);
  let gain = Math.max(0, freeTickspeed.newAmount - player.totalTickGained);
  player.totalTickGained += gain;
  player.tickspeed = player.tickspeed.times(Decimal.pow(getTickSpeedMultiplier(), gain))
  player.tickThreshold = freeTickspeed.nextShards;

    if (player.money.gte(Number.MAX_VALUE) && (!player.break || (player.currentChallenge != "" && player.money.gte(player.challengeTarget)))) {
        document.getElementById("bigcrunch").style.display = 'inline-block';
        if ((player.currentChallenge == "" || player.options.retryChallenge) && (player.bestInfinityTime <= 60000 || player.break)) {}
        else showTab('emptiness');
    } else document.getElementById("bigcrunch").style.display = 'none';

    var currentIPmin = gainedInfinityPoints().dividedBy(Time.thisInfinity.totalMinutes)
    if (currentIPmin.gt(IPminpeak)) IPminpeak = currentIPmin

    while (player.money.gte(nextAt[player.postChallUnlocked]) && !InfinityChallenge(8).isCompleted && !InfinityChallenge(8).isUnlocked) {
        if (player.postChallUnlocked != 8) player.postChallUnlocked += 1
        if (player.eternities > 6) {
          player.challenges.push("postc"+player.postChallUnlocked)
          Autobuyer.tryUnlockAny();
        }
    }
    replicantiLoop(diff)


    if (player.infMultBuyer) {
      InfinityUpgrade.ipMult.autobuyerTick();
    }

    if (player.reality.epmultbuyer) buyMaxEPMult();

	// Text on Eternity button
    var currentEPmin = gainedEternityPoints().dividedBy(player.thisEternity/60000)
    if (currentEPmin.gt(EPminpeak) && player.infinityPoints.gte(Number.MAX_VALUE)) EPminpeak = currentEPmin

    if (!Achievement(44).isUnlocked && getDimensionProductionPerSecond(1).gt(player.money)) {
        Marathon+=player.options.updateRate/1000;
        if (Marathon >= 30) giveAchievement("Over in 30 seconds");
    } else {
        Marathon = 0;
    }
    if (!Achievement(113).isUnlocked && !EternityChallenge(7).isRunning && InfinityDimension(1).productionPerSecond.gt(player.infinityPower)) {
        Marathon2+=player.options.updateRate/1000;
        if (Marathon2 >= 60) giveAchievement("Long lasting relationship");
    } else {
        Marathon2 = 0;
    }
    if (player.eternities >= 1 && Notation.current.isPainful) {
        player.secretUnlocks.painTimer += player.options.updateRate/1000;
        if (player.secretUnlocks.painTimer >= 600) giveAchievement("Do you enjoy pain?");
    }

    if (Tab.statistics.isOpen) {
        statsTimer += player.options.updateRate/1000;
        if (statsTimer >= 900) giveAchievement("Are you statisfied now?");
    }

    mult18 = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(8)).pow(0.02)

    if(player.money.gt(Math.pow(10,63))) giveAchievement("Supersanic");

    if (TimeStudy.dilation.isBought) {
      player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond().times(diff / 1000));
    }
    // Free galaxies (2x doesn't apply past 1000)
    let freeGalaxyMult = Effects.max(
      1,
      DilationUpgrade.doubleGalaxies
    );
    if (player.dilation.baseFreeGalaxies == undefined)
      player.dilation.baseFreeGalaxies = player.dilation.freeGalaxies / freeGalaxyMult;
    let thresholdMult = getFreeGalaxyMult();
    player.dilation.baseFreeGalaxies = Math.max(player.dilation.baseFreeGalaxies, 1 + Math.floor(Decimal.log(player.dilation.dilatedTime.dividedBy(1000), thresholdMult)));
    player.dilation.nextThreshold = new Decimal(1000).times(new Decimal(thresholdMult).pow(player.dilation.baseFreeGalaxies));
    player.dilation.freeGalaxies = Math.min(player.dilation.baseFreeGalaxies * freeGalaxyMult, 1000) + Math.max(player.dilation.baseFreeGalaxies * freeGalaxyMult - 1000, 0) / freeGalaxyMult;

    if (!player.celestials.teresa.run) player.timestudy.theorem = player.timestudy.theorem.plus(getAdjustedGlyphEffect("dilationTTgen")*diff/1000)
    if (player.infinityPoints.gt(0) || player.eternities !== 0) {
        document.getElementById("infinitybtn").style.display = "block";
    }

    document.getElementById("infinitybtn").style.display = "none";
    document.getElementById("challengesbtn").style.display = "none";

    if (player.money.gte(Number.MAX_VALUE) && (((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) && !player.options.retryChallenge) || (player.bestInfinityTime > 600 && !player.break))) {
        ui.view.bigCrunch = true;
        document.getElementById("dimensionsbtn").style.display = "none";
        document.getElementById("optionsbtn").style.display = "none";
        document.getElementById("statisticsbtn").style.display = "none";
        document.getElementById("achievementsbtn").style.display = "none";
        document.getElementById("challengesbtn").style.display = "none";
        document.getElementById("infinitybtn").style.display = "none";
    } else {
        ui.view.bigCrunch = false;
        document.getElementById("dimensionsbtn").style.display = "inline-block";
        document.getElementById("optionsbtn").style.display = "inline-block";
        document.getElementById("statisticsbtn").style.display = "inline-block";
        document.getElementById("achievementsbtn").style.display = "inline-block";
        if (player.infinitied.gt(0)) {
            document.getElementById("infinitybtn").style.display = "inline-block";
            document.getElementById("challengesbtn").style.display = "inline-block";
        }
    }

    if (player.eternities > 0) {
        document.getElementById("infinitybtn").style.display = "inline-block";
        document.getElementById("challengesbtn").style.display = "inline-block";
    }

    var infdimpurchasewhileloop = 1;
    while (player.eternities > 24 && (getNewInfReq().lt(player.money) || Perk.bypassIDAntimatter.isBought) && player.infDimensionsUnlocked[7] === false) {
        for (i=0; i<8; i++) {
            if (player.infDimensionsUnlocked[i]) infdimpurchasewhileloop++
        }
        newDimension()
        if (player.infDimBuyers[i-1] && !EternityChallenge(2).isRunning && !EternityChallenge(8).isRunning && !EternityChallenge(10).isRunning) buyMaxInfDims(infdimpurchasewhileloop)
        infdimpurchasewhileloop = 1;
    }

    player.infinityPoints = player.infinityPoints.plusEffectOf(TimeStudy(181));
    DilationUpgrade.ttGenerator.applyEffect(gen =>
      player.timestudy.theorem = player.timestudy.theorem.plus(gen.times(Time.deltaTime))
    );

  document.getElementById("realitymachines").innerHTML = "You have <span class=\"RMAmount1\">" + shortenDimensions(player.reality.realityMachines) + "</span> Reality Machine" + ((player.reality.realityMachines.eq(1)) ? "." : "s.")
  if (player.blackHole[0].unlocked && !player.blackHolePause) {
    updateBlackHolePhases(blackHoleDiff);
    for (let i = 0; i < player.blackHole.length; i++) {
      updateBlackHoleStatusText(i);
      updateBlackHoleUpgradeDisplay(i);
    }
    updateBlackHoleGraphics();
  }
  // Reality unlock and TTgen perk autobuy
  if (Perk.autounlockDilation3.isBought && player.dilation.dilatedTime.gte(1e15))  buyDilationUpgrade(10);
  if (Perk.autounlockReality.isBought && player.timeDimension8.bought != 0 && gainedRealityMachines().gt(0))  buyDilationStudy(6, 5e9);

  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  V.checkForUnlocks()
  Laitela.handleRunUnlocks()
  matterDimensionLoop()

    GameUI.update();
    player.lastUpdate = thisUpdate;
    PerformanceStats.end("Game Update");
}

// Reducing boilerplate code a bit (runs a specified number of ticks with a specified length and triggers autobuyers after each tick)
function gameLoopWithAutobuyers(seconds, ticks, real) {
  for (let ticksDone = 0; ticksDone < ticks; ticksDone++) {
    gameLoop(1000 * seconds)
    Autobuyer.tick();
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
    var playerStart = deepmerge.all([{}, player]);
    autobuyerOnGameLoop = false;
    GameUI.notify.blackHoles = false;

    // Upper-bound the number of ticks (this also applies if the black hole is unlocked)
    if (ticks > 1000 && !real && !fast) {
      bonusDiff = (ticks - 1000) / 20;
      ticks = 1000;
    } else if (ticks > 50 && fast) {
      bonusDiff = (ticks - 50);
      ticks = 50;
    }
    
    // Simulation code with black hole
    if (player.blackHole[0].unlocked && !player.blackHolePause) {
      let remainingRealSeconds = seconds;
      for (let numberOfTicksRemaining = ticks; numberOfTicksRemaining > 0; numberOfTicksRemaining--) {
        let timeGlyphSpeedup = getGameSpeedupFactor([GameSpeedEffect.TIMEGLYPH]);
        // The black hole is affected by time glyphs, but nothing else.
        let remainingblackHoleSeconds = remainingRealSeconds * timeGlyphSpeedup;
        [realTickTime, blackHoleSpeedup] = calculateBlackHoleOfflineTick(remainingblackHoleSeconds, numberOfTicksRemaining, 0.0001);
        realTickTime /= timeGlyphSpeedup;
        remainingRealSeconds -= realTickTime;
        // As in gameLoopWithAutobuyers, we run autoBuyerTick after every game tick
        // (it doesn't run in gameLoop).
        gameLoop(1000 * realTickTime, {blackHoleSpeedup: blackHoleSpeedup});
        Autobuyer.tick();
      }
    }
      
    // This is pretty much the older simulation code
    else {
      gameLoopWithAutobuyers((50+bonusDiff) / 1000, ticks, real)
    }
    var popupString = "While you were away"
    if (player.money.gt(playerStart.money)) popupString+= ",<br> your antimatter increased "+shortenMoney(player.money.log10() - (playerStart.money).log10())+" orders of magnitude"
    if (player.infinityPower.gt(playerStart.infinityPower)) popupString+= ",<br> infinity power increased "+shortenMoney(player.infinityPower.log10() - (Decimal.max(playerStart.infinityPower, 1)).log10())+" orders of magnitude"
    if (player.timeShards.gt(playerStart.timeShards)) popupString+= ",<br> time shards increased "+shortenMoney(player.timeShards.log10() - (Decimal.max(playerStart.timeShards, 1)).log10())+" orders of magnitude"
    if (player.infinitied.gt(playerStart.infinitied) || player.eternities > playerStart.eternities) popupString+= ","
    else popupString += "."
    if (player.infinitied.gt(playerStart.infinitied)) popupString += "<br>you infinitied " + shorten(player.infinitied.sub(playerStart.infinitied), 4) + ((player.infinitied.sub(playerStart.infinitied).eq(1)) ? " time." : " times.");
    if (player.eternities > playerStart.eternities) popupString+= " <br>you eternitied " + (player.eternities-playerStart.eternities) + ((player.eternities-playerStart.eternities === 1) ? " time." : " times.");
    for (let i = 0; i < player.blackHole.length; i++) {
      let currentActivations = player.blackHole[i].activations;
      let oldActivations = playerStart.blackHole[i].activations;
      let activationsDiff = currentActivations - oldActivations;
      if (activationsDiff > 0)  popupString += " <br>Black hole "+(i+1)+" activated  " + activationsDiff + (activationsDiff == 1 ? " time." : " times.")
    }
    if (popupString === "While you were away.") {
        popupString+= ".. Nothing happened."
        giveAchievement("While you were away... Nothing happened.")
    }

    Modal.message.show(popupString);
    autobuyerOnGameLoop = true;
    GameUI.notify.blackHoles = true;
}

function updateChart(first) {
    if (first !== true && (player.infinitied.gte(1) || player.eternities >= 1) && player.options.chart.on === true) {
        if (Challenge(3).isRunning) {
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

function autoBuyDilationUpgrades() {
  if (Perk.autobuyerDilation.isBought) {
    buyDilationUpgrade(1)
    buyDilationUpgrade(2)
    buyDilationUpgrade(3)
  }
}

function autoBuyInfDims() {
  if (player.eternities > 10 && !EternityChallenge(8).isRunning) {
    for (var i = 1; i < player.eternities - 9 && i < 9; i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i)
        buyManyInfinityDimension(i)
      }
    }
  }
}

function autoBuyTimeDims() {
  if (RealityUpgrade(13).isBought) {
    for (let i = 1; i < 9; i++) {
      if (player.reality.tdbuyers[i - 1]) {
        buyMaxTimeDimTier(i)
      }
    }
  }
}

function autoBuyExtraTimeDims() {
  if (player.timeDimension8.bought == 0 && Perk.autounlockTD.isBought) {
    buyDilationStudy(2, 1000000)
    buyDilationStudy(3, 1e7)
    buyDilationStudy(4, 1e8)
    buyDilationStudy(5, 1e9)
  }
}

var slowerAutobuyerTimer = 0
setInterval(function() {
  slowerAutobuyerTimer += 1/3
  if (Perk.autobuyerFasterID.isBought) autoBuyInfDims()
  if (Perk.autobuyerFasterReplicanti.isBought) autoBuyReplicantiUpgrades()
  if (Perk.autobuyerFasterDilation.isBought) autoBuyDilationUpgrades()

  if (slowerAutobuyerTimer > 1) {
    slowerAutobuyerTimer -= 1
    if (!Perk.autobuyerFasterID.isBought) autoBuyInfDims()
    if (!Perk.autobuyerFasterReplicanti.isBought) autoBuyReplicantiUpgrades()
    if (!Perk.autobuyerFasterDilation.isBought) autoBuyDilationUpgrades()
    autoBuyTimeDims()

    autoBuyExtraTimeDims()
  }
}, 333)


//start scrolling
scrollNextMessage();

function showRealityTab(tabName) {
  if (ui.view.tabs.current !== "reality-tab") {
    showTab("reality")
    ui.view.tabs.current = "reality-tab";
  }
  ui.view.tabs.reality.subtab = tabName;
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

function init() {
    console.log('init');

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
        kong.updatePurchases();
    }
    document.getElementById('celestialsbtn').onclick = function () {
      showTab('celestials');
    };
    Tab.dimensions.normal.show();
    load_game();
    kong.init();
    TLN.append_line_numbers("automator") // Automator line numbers

    //if (typeof kongregate === 'undefined') document.getElementById("shopbtn").style.display = "none"
}

setInterval(function () {
    if (playFabId != -1 && player.options.cloud) playFabSaveCheck();
}, 1000*60*5)
document.getElementById("hiddenheader").style.display = "none";


window.onload = function() {
    GameIntervals.start();
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
  GameKeyboard.stopSpins();
};

function setShiftKey(isDown) {
  shiftDown = isDown;
  if (!isDown) controlShiftDown = isDown;
  ui.view.shiftDown = isDown;
  document.getElementById("automatorloadsavetext").textContent = isDown ? "save:" : "load:";
  if (isDown) showPerkLabels()
  else hidePerkLabels()
}

function setControlKey(isDown) {
  controlDown = isDown;
  if (!isDown) controlShiftDown = isDown;
}

function setControlShiftKey(isDown) {
  controlShiftDown = isDown;
}

var postc8Mult = new Decimal(0)
var mult18 = 1

init();

let tweenTime = 0;
(function() {
    let lastFrame;
    function animateTweens(time) {
        requestAnimationFrame(animateTweens);
        if (time === undefined || lastFrame === undefined) {
            lastFrame = time;
            return;
        }
        let delta = time - lastFrame;
        lastFrame = time;
        if (player.dilation.active) {
            delta /= 10;
        }
        tweenTime += delta;
        TWEEN.update(tweenTime);
    }

    animateTweens();
}());

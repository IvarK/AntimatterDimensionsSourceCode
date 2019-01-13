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
          dimension.pow = dimension.pow.times(getDimensionPowerMultiplier(tier))
          dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
        }
        while (lowerTier.amount.gt(dimension.cost.times(10))) {
          lowerTier.amount = lowerTier.amount.minus(dimension.cost.times(10))
          dimension.cost = dimension.cost.times(getDimensionCostMultiplier(tier))
          dimension.amount = Decimal.round(dimension.amount.plus(10))
          dimension.bought += 10
          dimension.pow = dimension.pow.times(getDimensionPowerMultiplier(tier))
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
        dimension.pow = dimension.pow.times(getDimensionPowerMultiplier(tier))
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
          dimension.pow = dimension.pow.times(getDimensionPowerMultiplier(tier))
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
            dimension.pow = dimension.pow.times(getDimensionPowerMultiplier(tier))
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
          dimension.pow = dimension.pow.times(Decimal.pow(getDimensionPowerMultiplier(tier), buying))

          newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(Player.dimensionMultDecrease, postInfBuy * (postInfBuy + 1) / 2))
          newMult = costMults[tier].times(Decimal.pow(Player.dimensionMultDecrease, postInfBuy + 1))
          //if (buying > 0 )dimension.cost = player.costMultipliers[tier-1].times(Decimal.pow(player.dimensionMultDecrease, (buying * buying - buying)/2)).times(dimension.cost)

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
    if (Effarig.isRunning) {
        ip = ip.pow(0.6);
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
      GlyphEffect.epMult
    );

  if (player.reality.upg.includes(12)) {
      ep = ep.times(Decimal.max(Decimal.pow(Math.max(player.timestudy.theorem - 1e3, 2), Math.log2(player.realities)), 1))
  }
  if (Effarig.isRunning) {
    ep = ep.pow(0.6);
  }
  return ep.floor();
}

function gainedRealityMachines() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)
    ret = ret.times(Effarig.rmMultiplier)
    ret = ret.times(player.celestials.effarig.rmMult)
    return Decimal.floor(ret)
}

function percentToNextRealityMachine() {
    var ret = Decimal.pow(1000, player.eternityPoints.plus(gainedEternityPoints()).e/4000 -1)
    return Math.min(((ret - Math.floor(ret)) * 100), 99.9).toFixed(1);
}

function gainedGlyphLevel(round) {
    if (round === undefined) round = true
    let glyphState = getGlyphLevelInputs();
    var ret = glyphState.finalLevel;
    if (round) ret = Math.round(ret)
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
      Perk(51),
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78).secondaryEffect,
      Perk(52)
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
    if (EternityChallenge(4).isRunning) {
        return 1;
    }
    let infGain = Effects.max(
      1,
      Achievement(87)
    );
    infGain *= Effects.product(
      TimeStudy(32)
    );
    if (player.reality.rebuyables[5] > 0) infGain *= Math.pow(5, player.reality.rebuyables[5])
    infGain *= Math.max(1, getAdjustedGlyphEffect("infinityinfmult"));
    if (player.reality.upg.includes(7)) infGain *= 1+(player.galaxies/30)
    return infGain
}

function failChallenge() {
    Modal.message.show("You failed the challenge, you will now exit it.");
    setTimeout(exitChallenge, 500);
    giveAchievement("You're a mistake");
    failureCount++;
    if (failureCount > 9) giveAchievement("You're a failure");
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
      html += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+rarity.color+" !important; text-shadow: "+rarity.color+" -1px 1px 2px;' onclick='selectGlyph("+idx+")'>"
      html += getGlyphTooltip(glyph)
      html += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div>"
  }
  $("#glyphsToSelect").html(html)
  
  updateTooltips();
}

var possibleGlyphs = []
var glyphSelected = false

function exitChallenge() {
    if (player.currentChallenge !== "") {
        startChallenge("");
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
        if (1e8 + (ECTimesCompleted("eterc4")*5e7) <= Player.totalInfinitied) return true
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

    if (getTickSpeedMultiplier() < 0.001) giveAchievement("Do you even bend time bro?")

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

    if ( [20, 21, 22, 23, 24, 25].every(id => { return player.reality.upg.includes(id)}) ) $("#celestialsbtn").show()
    else $("#celestialsbtn").hide()

    if (player.realities > 3) {
        $("#automatorUnlock").hide()
        $(".automator-container").show()
    } else {
        $("#automatorUnlock").show()
        $(".automator-container").hide()
    }

    updateAchievementPower();
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

    EternityChallenge.autoCompleteTick()
    if (!Effarig.has(EFFARIG_UNLOCKS.TERESA)) player.celestials.effarig.rmStore *= Math.pow(0.98, 1/60) // Effarig container leak, 2% every minute, only works online.
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

const GameSpeedEffect = {EC12: 1, TIMEGLYPH: 2, WORMHOLE: 3}

function getGameSpeedupFactor(effectsToConsider, wormholeOverride) {
  if (effectsToConsider === undefined) {
    effectsToConsider = [GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.WORMHOLE];
  }
  let factor = 1;
  if (player.currentEternityChall === "eterc12" && effectsToConsider.includes(GameSpeedEffect.EC12)) {
    // If we're taking account of EC12 at all and we're in EC12, we'll never want to consider anything else,
    // since part of the effect of EC12 is to disable all other things that affect gamespeed.
    return 1/1000;
  }
  if (effectsToConsider.includes(GameSpeedEffect.TIMEGLYPH)) {
    factor *= Math.max(1, getAdjustedGlyphEffect("timespeed"));
  }
  
  if (player.wormhole[0] !== undefined && effectsToConsider.includes(GameSpeedEffect.WORMHOLE)) {
    if (wormholeOverride !== undefined) {
      factor *= wormholeOverride;
    } else if (!player.wormholePause) {
      for (let wormhole of player.wormhole) {
        if (wormhole.active) {
          factor *= wormhole.power;
        } else {
          // If a wormhole is inactive, even if later wormholes have wormhole.active set to true
          // they aren't currently active (instead they will activate as soon as the previous wormhole is active).
          // Thus, as soon as we reach an inactive wormhole, we stop increasing the speedup factor.
          break;
        }
      }
    }
  }
  
  return factor;
}

let autobuyerOnGameLoop = true;

function gameLoop(diff, wormholeSpeedup) {
    PerformanceStats.start("Frame Time");
    PerformanceStats.start("Game Update");
    var thisUpdate = new Date().getTime();
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
        autoBuyerTick();
      }
    }

    let speedFactor;
    if (wormholeSpeedup === undefined) {
      speedFactor = getGameSpeedupFactor();
    } else {
      // If we're in EC12, time shouldn't speed up at all.
      speedFactor = getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.WORMHOLE], wormholeSpeedup);
    }
    // Wormhole is affected only by time glyphs.
    let wormholeDiff = diff * getGameSpeedupFactor([GameSpeedEffect.TIMEGLYPH]);
    DeltaTimeState.update(diff, speedFactor);
    diff *= speedFactor;
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

    if (Challenge(3).isRunning || player.matter.gte(1)) player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff/100));
    player.chall2Pow = Math.min(player.chall2Pow + diff/100/1800, 1);
    if (InfinityChallenge(2).isRunning) {
        if (postC2Count >= 8 || diff > 8000) {
            if (player.eightAmount > 0) {
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
        if (!player.celestials.effarig.run) player.infinityPoints = player.infinityPoints.plus(totalIPMult().times(genCount));
        else player.infinityPoints = player.infinityPoints.plus(totalIPMult().times(genCount).pow(0.6))
        player.partInfinityPoint -= genCount;
      }
    }

    if (BreakInfinityUpgrade.infinitiedGen.isBought && player.currentEternityChall !== "eterc4") {
        if (player.reality.upg.includes(11)) {
            player.infinitied += Math.floor(gainedInfinities() * 0.1) * diff/1000
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

    if (Effarig.has(EFFARIG_UNLOCKS.EPGEN)) { // Effarig EP gen.
      let isPostEc = player.reality.upg.includes(10) ? player.eternities > 100 : player.eternities > 0
      if (isPostEc) {
        player.eternityPoints = player.eternityPoints.plus(EPminpeak.times(0.01).times(diff/1000))
      }
    }

    player.infinityPoints = player.infinityPoints.plus(Player.bestRunIPPM.times(player.offlineProd/100).times(diff/60000))

    if (player.money.lte(Number.MAX_VALUE) || (player.break && player.currentChallenge == "") || (player.currentChallenge != "" && player.money.lte(player.challengeTarget))) {

        if (!Challenge(12).isRunning && !EternityChallenge(3).isRunning) {
            for (let tier = 7; tier >= 1; --tier) {
              const dimension = NormalDimension(tier);
              dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 1).times(diff / 10000));
            }
        } else if (EternityChallenge(3).isRunning) {
            for (let tier = 6; tier >= 1; --tier) {
              const dimension = NormalDimension(tier);
              dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 2).times(diff / 10000));
            }
        } else {
            for (let tier = 3; tier >= 1; --tier) {
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

    player.realTimePlayed += diff / speedFactor
    if (player.reality.perks.includes(91) && player.reality.autoEC) player.reality.lastAutoEC += diff / speedFactor
    player.totalTimePlayed += diff
    player.thisInfinityTime += diff
    player.thisInfinityRealTime += diff / speedFactor
    player.thisEternity += diff
    player.thisEternityRealTime += diff / speedFactor
    player.thisReality += diff
    player.thisRealityRealTime += diff / speedFactor

    for (let tier = 1; tier < 9; tier++) {
      if (tier !== 8 && (player.infDimensionsUnlocked[tier - 1] || ECTimesCompleted("eterc7") > 0)) {
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
    if (player.currentEternityChall === "eterc7") {
      player.infinityDimension8.amount = player.infinityDimension8.amount.plus(TD1ProductionThisTick)
    }
    else {
      player.timeShards = player.timeShards.plus(TD1ProductionThisTick)
    }

    if (TD1Production.gt(0) && ECTimesCompleted("eterc7") > 0) {
      player.infinityDimension8.amount = player.infinityDimension8.amount.plus(TD1Production.pow(ECTimesCompleted("eterc7")*0.2).minus(1).times(diff/10))
    }

    let tickmult = Effects.min(
      1.33,
      TimeStudy(171)
    );
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
    }

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
    if (player.eternities >= 1 && Notation.current().isPain()) {
        player.secretUnlocks.painTimer += player.options.updateRate/1000;
        if (player.secretUnlocks.painTimer >= 600) giveAchievement("Do you enjoy pain?");
    }

    if (Tab.statistics.isOpen) {
        statsTimer += player.options.updateRate/1000;
        if (statsTimer >= 900) giveAchievement("Are you statisfied now?");
    }

    if(player.money.gt(Math.pow(10,63))) giveAchievement("Supersanic");

    if (TimeStudy.dilation.isBought) player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond()*diff/1000)

    // Free galaxies (2x doesn't apply past 1000)
    let freeGalaxyMult = Effects.max(
      1,
      DilationUpgrade.doubleGalaxies
    );
    if (player.dilation.baseFreeGalaxies == undefined)
      player.dilation.baseFreeGalaxies = player.dilation.freeGalaxies / freeGalaxyMult;
    let thresholdMult = getFreeGalaxyMult();
    player.dilation.baseFreeGalaxies = Math.max(player.dilation.baseFreeGalaxies, 1 + Math.floor(Decimal.log(player.dilation.dilatedTime.dividedBy(1000), new Decimal(thresholdMult))));
    player.dilation.nextThreshold = new Decimal(1000).times(new Decimal(thresholdMult).pow(player.dilation.baseFreeGalaxies));
    player.dilation.freeGalaxies = Math.min(player.dilation.baseFreeGalaxies * freeGalaxyMult, 1000) + Math.max(player.dilation.baseFreeGalaxies * freeGalaxyMult - 1000, 0) / freeGalaxyMult;

    if (!player.celestials.effarig.run) player.timestudy.theorem += getAdjustedGlyphEffect("dilationTTgen")*diff/1000

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
        if (player.infinitied > 0) {
            document.getElementById("infinitybtn").style.display = "inline-block";
            document.getElementById("challengesbtn").style.display = "inline-block";
        }
    }

    if (player.eternities > 0) {
        document.getElementById("infinitybtn").style.display = "inline-block";
        document.getElementById("challengesbtn").style.display = "inline-block";
    }

    var infdimpurchasewhileloop = 1;
    while (player.eternities > 24 && getNewInfReq().lt(player.money) && player.infDimensionsUnlocked[7] === false) {
        for (i=0; i<8; i++) {
            if (player.infDimensionsUnlocked[i]) infdimpurchasewhileloop++
        }
        newDimension()
        if (player.infDimBuyers[i-1] && player.currentEternityChall !== "eterc2" && player.currentEternityChall !== "eterc8" && player.currentEternityChall !== "eterc10") buyMaxInfDims(infdimpurchasewhileloop)
        infdimpurchasewhileloop = 1;
    }

    if (isNaN(player.totalmoney)) player.totalmoney = new Decimal(10)
    player.infinityPoints = player.infinityPoints.plusEffectOf(TimeStudy(181));
    player.timestudy.theorem += Effects.sum(DilationUpgrade.ttGenerator) * Time.deltaTime;

  // Adjust the text on the reality button in order to minimize text overflowing
  let glyphLevelText = "<br>Glyph level: "+shortenDimensions(gainedGlyphLevel())+" ("+percentToNextGlyphLevel()+"%)";
  if (player.dilation.studies.length < 6) // Make sure reality has been unlocked again
    document.getElementById("realitymachine").innerHTML = "You need to purchase the study at the bottom of the tree to Reality again!"
	else if (gainedRealityMachines() > 554)  // At more than (e7659 EP, 554 RM) each +1 EP exponent always adds at least one more RM, so drop the percentage entirely
		document.getElementById("realitymachine").innerHTML = "Make a new Reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+glyphLevelText;
  else if (player.eternityPoints.exponent > 4986)  // At more than (4986 EP, 5.48 RM) each +1 EP exponent always adds at least one more RM percent, so drop the decimal points
		document.getElementById("realitymachine").innerHTML = "Make a new Reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+" ("+Math.floor(percentToNextRealityMachine()).toFixed(0)+"%)"+glyphLevelText;
	else 
		document.getElementById("realitymachine").innerHTML = "Make a new Reality<br>Machines gained: "+shortenDimensions(gainedRealityMachines())+" ("+percentToNextRealityMachine()+"%)"+glyphLevelText
  document.getElementById("realitymachines").innerHTML = "You have <span class=\"RMAmount1\">"+shortenDimensions(player.reality.realityMachines)+"</span> Reality Machine" + ((player.reality.realityMachines.eq(1)) ? "." : "s.")
  
  // Tooltip for reality button stating more detailed RM and glyph level info
  let nextRMText = gainedRealityMachines() < 100 ? "Next RM gained at " + shortenDimensions(new Decimal("1e" + Math.ceil(4000*(1 + Math.log(parseInt(gainedRealityMachines().toFixed()) + 1)/Math.log(1000))))) + "<br><br>" : "";
  let glyphInfo = getGlyphLevelInputs();
  let factorNames = ["EP", "Replicanti", "DT", "Eternities", "Perk Shop", "Instability", "Perks"];
  let factorNumbers = [
    "&nbsp;"+glyphInfo.epEffect .toFixed(3), "×"+glyphInfo.replEffect.toFixed(3),
    "×" + glyphInfo.dtEffect.toFixed(3), "×" + glyphInfo.eterEffect.toFixed(3),
    "+" + (glyphInfo.perkShop * 100 - 100).toFixed(1) + "%",
    "/" + glyphInfo.scalePenalty.toFixed(3),
    "+" + glyphInfo.perkFactor]
  let isFactorDisplayed = [true, true, true, player.reality.upg.includes(18), glyphInfo.scalePenalty > 1, glyphInfo.perkShop > 1, glyphInfo.perkFactor != 0]
  let glyphLevelFactorText = 'Glyph level factors:<table style="width:100%">';
  for (let i = 0; i < factorNames.length; i++)
    if (isFactorDisplayed[i])
      glyphLevelFactorText += "<tr><td>" + factorNames[i] + "</td><td>" + factorNumbers[i] + "</td></tr>";
  glyphLevelFactorText += "</table>Note: Level is rounded, not floored.";
  document.getElementById("realitymachine").className = "infotooltip"
  $("#realitymachine").append('<span class="infotooltiptext">' + nextRMText + glyphLevelFactorText + "</span>");
  
  if (player.wormhole[0].unlocked && !player.wormholePause) {
    updateWormholePhases(wormholeDiff);
    for (let i = 0; i < player.wormhole.length; i++) {
      updateWormholeStatusText(i);
    }
    updateWormholeGraphics();
  }
  
  // Reality unlock and TTgen perk autobuy
	if (player.reality.perks.includes(65) && player.dilation.dilatedTime.gte(1e15))  buyDilationUpgrade(10);
  if (player.reality.perks.includes(66) && player.timeDimension8.bought != 0 && gainedRealityMachines() > 0)  buyDilationStudy(6, 5e9);

    GameUI.update();
    player.lastUpdate = thisUpdate;
    PerformanceStats.end("Game Update");
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
    var playerStart = deepmerge.all([{}, player]);
    autobuyerOnGameLoop = false;

    // Upper-bound the number of ticks (this also applies if the wormhole is unlocked)
    if (ticks > 1000 && !real && !fast) {
      bonusDiff = (ticks - 1000) / 20;
      ticks = 1000;
    } else if (ticks > 50 && fast) {
      bonusDiff = (ticks - 50);
      ticks = 50;
    }
    
    // Simulation code with wormhole
    if (player.wormhole[0].unlocked && !player.wormholePause) {
      let remainingRealSeconds = seconds;
      for (let numberOfTicksRemaining = ticks; numberOfTicksRemaining > 0; numberOfTicksRemaining--) {
        let timeGlyphSpeedup = getGameSpeedupFactor([GameSpeedEffect.TIMEGLYPH]);
        // The wormhole is affected by time glyphs, but nothing else.
        let remainingWormholeSeconds = remainingRealSeconds * timeGlyphSpeedup;
        [realTickTime, wormholeSpeedup] = calculateWormholeOfflineTick(remainingWormholeSeconds, numberOfTicksRemaining, 0.0001);
        realTickTime /= timeGlyphSpeedup;
        remainingRealSeconds -= realTickTime;
        // As in gameLoopWithAutobuyers, we run autoBuyerTick after every game tick
        // (it doesn't run in gameLoop).
        gameLoop(1000 * realTickTime, wormholeSpeedup);
        autoBuyerTick();
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
    if (player.infinitied > playerStart.infinitied || player.eternities > playerStart.eternities) popupString+= ","
    else popupString+= "."
    if (player.infinitied > playerStart.infinitied) popupString+= "<br>you infinitied "+(player.infinitied-playerStart.infinitied)+((player.infinitied-playerStart.infinitied === 1) ? " time." : " times.")
    if (player.eternities > playerStart.eternities) popupString+= " <br>you eternitied "+(player.eternities-playerStart.eternities)+((player.eternities-playerStart.eternities === 1) ? " time." : " times.")
    for (let i = 0; i < player.wormhole.length; i++) {
      let currentActivations = player.wormhole[i].activations;
      let oldActivations = playerStart.wormhole[i].activations;
      let activationsDiff = currentActivations - oldActivations;
      if (activationsDiff > 0)  popupString += " <br>Wormhole "+(i+1)+" activated  " + activationsDiff + (activationsDiff == 1 ? " time." : " times.")
    }
    if (popupString === "While you were away.") {
        popupString+= ".. Nothing happened."
        giveAchievement("While you were away... Nothing happened.")
    }

    Modal.message.show(popupString);
    autobuyerOnGameLoop = true;
}

function startInterval() {
    gameLoopIntervalId = setInterval(gameLoop, player.options.updateRate);
}

function updateChart(first) {
    if (first !== true && (player.infinitied >= 1 || player.eternities >= 1) && player.options.chart.on === true) {
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

function autoBuyerTick() {
  Autobuyer.tick();
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
    while (player.infinityPoints.gte(player.replicanti.intervalCost) && player.currentEternityChall !== "eterc8" && (TimeStudy(22).isBought ? player.replicanti.interval > 1 : player.replicanti.interval > 50)) upgradeReplicantiInterval()
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
    save_game()
}, 30000);

setInterval(function () {
    if (playFabId != -1 && player.options.cloud) playFabSaveCheck();
}, 1000*60*5)
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
var ec10bonus = new Decimal(1)

init();
setInterval( function() {
    mult18 = getDimensionFinalMultiplier(1).times(getDimensionFinalMultiplier(8)).pow(0.02)
    if (EternityChallenge(10).isRunning) {
        ec10bonus = Decimal.pow(Player.totalInfinitied, 1000).max(1).pow(Effects.product(TimeStudy(31)));
    } else {
        ec10bonus = new Decimal(1)
    }
}, 100);

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

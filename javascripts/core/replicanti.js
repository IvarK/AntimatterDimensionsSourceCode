var repMs = 0;
function unlockReplicantis() {
  if (player.infinityPoints.gte(1e140)) {
      document.getElementById("replicantidiv").style.display="inline-block"
      document.getElementById("replicantiunlock").style.display="none"
      player.replicanti.unl = true
      player.replicanti.amount = new Decimal(1)
      player.infinityPoints = player.infinityPoints.minus(1e140)
  }
}

function getMaxReplicantiChance() { // Also shows up in the replicanti autobuyer loop
  return nearestPercent(1 + getGlyphSacEffect("replication") / 100);
}

// Rounding errors suck
function nearestPercent(x) {
  return Math.round(100 * x) / 100
}

function upgradeReplicantiChance() {
  if (player.infinityPoints.gte(player.replicanti.chanceCost) && nearestPercent(player.replicanti.chance) < getMaxReplicantiChance() && player.eterc8repl !== 0) {
      player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
      player.replicanti.chanceCost = player.replicanti.chanceCost.times(1e15)
      player.replicanti.chance = nearestPercent(player.replicanti.chance + 0.01)
      if (player.currentEternityChall == "eterc8") player.eterc8repl-=1
      document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
      return true
  }
  else
    return false
}

function upgradeReplicantiInterval() {
  if (player.infinityPoints.gte(player.replicanti.intervalCost) && (player.replicanti.interval > 50 || player.timestudy.studies.includes(22)) && player.replicanti.interval !== 1 && player.eterc8repl !== 0) {
      player.infinityPoints = player.infinityPoints.minus(player.replicanti.intervalCost)
      player.replicanti.intervalCost = player.replicanti.intervalCost.times(1e10)
      player.replicanti.interval *= 0.9
      if (!player.timestudy.studies.includes(22) && player.replicanti.interval < 50) player.replicanti.interval = 50
      if (player.timestudy.studies.includes(22) && player.replicanti.interval < 1) player.replicanti.interval = 1
      var places = Math.floor(Math.log10(player.replicanti.interval/1000)) * (-1)
      if (player.currentEternityChall == "eterc8") player.eterc8repl-=1
      document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
  }
}

function upgradeReplicantiGalaxy() {
    let cost = player.replicanti.galCost;
  if (player.timestudy.studies.includes(233)) cost = cost.dividedBy(player.replicanti.amount.pow(0.3))
  if (player.infinityPoints.gte(cost) && player.eterc8repl !== 0) {
      player.infinityPoints = player.infinityPoints.minus(cost)
      if (player.currentEternityChall == "eterc6") player.replicanti.galCost = player.replicanti.galCost.times(Decimal.pow(1e2, player.replicanti.gal)).times(1e2)
      else player.replicanti.galCost = player.replicanti.galCost.times(Decimal.pow(1e5, player.replicanti.gal)).times(1e25)
      if (player.replicanti.gal >= 100) player.replicanti.galCost = player.replicanti.galCost.times(Decimal.pow(1e50, player.replicanti.gal - 95))
      player.replicanti.gal += 1
      if (player.currentEternityChall == "eterc8") player.eterc8repl-=1
      document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
      return true
  }
  return false
}

function maxReplicantiGalaxy(diff) {
    var maxGal = player.replicanti.gal;
    var infiTime = Math.max(Math.log(Number.MAX_VALUE) / Math.log(player.replicanti.chance + 1) * getReplicantiInterval(true), 0);
    if (player.timestudy.studies.includes(131)) maxGal = Math.floor(player.replicanti.gal * 1.5);
    var curGal = player.replicanti.galaxies;
    let gainGal = 0;
    if (curGal < maxGal) { 
        if (diff / infiTime < maxGal - curGal) {
            gainGal = Math.floor(diff / infiTime);
            diff = diff % infiTime;
    }else {
        diff -= (maxGal - curGal) * infiTime; 
        gainGal = maxGal - curGal;
        }
        player.replicanti.galaxies += gainGal;
        player.galaxies -= 1;
        galaxyReset();
}
return diff;
}

function replicantiGalaxy() {
  var maxGal = player.replicanti.gal
  if (player.timestudy.studies.includes(131)) maxGal = Math.floor(player.replicanti.gal * 1.5)
  if (player.replicanti.amount.gte(Number.MAX_VALUE) && player.replicanti.galaxies < maxGal) {
      player.reality.upgReqChecks[0] = false;
      var galaxyGain = 1
      if (isAchEnabled("r126")) {
          if (player.replicanti.amount.e >= 616) {
              galaxyGain = Math.min(Math.floor(player.replicanti.amount.e / 308), maxGal - player.replicanti.galaxies)
              player.replicanti.amount = player.replicanti.amount.dividedBy(new Decimal("1e"+(308*galaxyGain)))
          }
          else player.replicanti.amount = player.replicanti.amount.dividedBy(Number.MAX_VALUE)
      }
      else player.replicanti.amount = new Decimal(1)
      player.replicanti.galaxies += galaxyGain
      player.galaxies-=1
      galaxyReset();
  }
}

function replicantiGalaxyAutoToggle() {
  if (player.replicanti.galaxybuyer) {
      player.replicanti.galaxybuyer = false
      if (player.timestudy.studies.includes(131) && !isAchEnabled("r138")) document.getElementById("replicantiresettoggle").textContent = "Auto galaxy OFF (disabled)"
      else document.getElementById("replicantiresettoggle").textContent = "Auto galaxy OFF"
  } else {
      player.replicanti.galaxybuyer = true
      if (player.timestudy.studies.includes(131) && !isAchEnabled("r138")) document.getElementById("replicantiresettoggle").textContent = "Auto galaxy ON (disabled)"
      else document.getElementById("replicantiresettoggle").textContent = "Auto galaxy ON"
  }
}

function toggleReplAuto(i) {
  if (i == "chance") {
      if (player.replicanti.auto[0]) {
          player.replicanti.auto[0] = false
          document.getElementById("replauto1").textContent = "Auto: OFF"
      } else {
          player.replicanti.auto[0] = true
          document.getElementById("replauto1").textContent = "Auto: ON"
      }
  } else if (i == "interval") {
      if (player.replicanti.auto[1]) {
          player.replicanti.auto[1] = false
          document.getElementById("replauto2").textContent = "Auto: OFF"
      } else {
          player.replicanti.auto[1] = true
          document.getElementById("replauto2").textContent = "Auto: ON"
      }
  } else if (i == "galaxy") {
      if (player.replicanti.auto[2]) {
          player.replicanti.auto[2] = false
          document.getElementById("replauto3").textContent = "Auto: OFF"
      } else {
          player.replicanti.auto[2] = true
          document.getElementById("replauto3").textContent = "Auto: ON"
      }
  }
}

function getReplicantiInterval(noMod) {
    let interval = player.replicanti.interval
    if (player.timestudy.studies.includes(62)) interval = interval/3
    if (player.timestudy.studies.includes(133) || (player.replicanti.amount.gt(Number.MAX_VALUE) || noMod)) interval *= 10
    if (player.timestudy.studies.includes(213)) interval /= 20
    if (player.reality.rebuyables[2] > 0) interval /= Math.pow(3, player.reality.rebuyables[1])
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "replication" && glyph.effects.speed !== undefined) interval = interval / glyph.effects.speed
    }
    if ((player.replicanti.amount.lt(Number.MAX_VALUE) || noMod) && isAchEnabled("r134")) interval /= 2
    if (player.replicanti.amount.gt(Number.MAX_VALUE) && !noMod) interval = Math.max(interval * Math.pow(1.2, (player.replicanti.amount.log10() - 308)/308), interval)
    if (player.reality.upg.includes(6)) interval /= 1+(player.replicanti.galaxies/50)
    return interval;
}

function replicantiLoop(diff) {
    if (diff > repMs) {
        diff -= repMs;
        repMs = 0;
    } else {
        repMs -= diff;
        return;
    }
    let interval = getReplicantiInterval();
    let intervalMult = 1;
    if (player.timestudy.studies.includes(62)) intervalMult /= 3
    if (player.timestudy.studies.includes(133) || player.replicanti.amount.gt(Number.MAX_VALUE)) intervalMult *= 10
    if (player.timestudy.studies.includes(213)) intervalMult /= 20
    if (player.reality.rebuyables[2] > 0) intervalMult /= Math.pow(3, player.reality.rebuyables[1])
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "replication" && glyph.effects.speed !== undefined) intervalMult = intervalMult / glyph.effects.speed
    }
    if (player.replicanti.amount.lt(Number.MAX_VALUE) && isAchEnabled("r134")) intervalMult /= 2
    if (player.replicanti.amount.gt(Number.MAX_VALUE)) intervalMult = Math.max(intervalMult * Math.pow(1.2, (player.replicanti.amount.log10() - 308)/308), intervalMult)
    if (player.reality.upg.includes(6)) intervalMult /= 1+(player.replicanti.galaxies/50)

    var est = Math.log(player.replicanti.chance+1) * 1000 / interval

    var current = player.replicanti.amount.ln();
    let speedCheck = Math.log(Number.MAX_VALUE) / Math.log(player.replicanti.chance + 1) * getReplicantiInterval(true) < diff / 2;
    if (speedCheck && player.replicanti.galaxybuyer && (!player.timestudy.studies.includes(131) || isAchEnabled("r138"))) diff = maxReplicantiGalaxy(diff);

    if (player.replicanti.unl && (diff > 500 || interval < 50 || player.timestudy.studies.includes(192))) {
        var gained = Decimal.pow(Math.E, current +(diff/100*est/10))
        if (player.timestudy.studies.includes(192)) gained = Decimal.pow(Math.E, current +Math.log((diff/100*est/10) * (Math.log10(1.2)/308)+1) / (Math.log10(1.2)/308))
        player.replicanti.amount = Decimal.min(Number.MAX_VALUE, gained)
        if (player.timestudy.studies.includes(192)) player.replicanti.amount = gained
        replicantiTicks = 0
    } else {
        if (interval <= replicantiTicks && player.replicanti.unl) {
            if (player.replicanti.amount.lte(100)) {
                var temp = player.replicanti.amount
                for (var i=0; temp.gt(i); i++) {
                    if (player.replicanti.chance > Math.random()) player.replicanti.amount = player.replicanti.amount.plus(1)
                }
            } else {
                var temp = Decimal.round(player.replicanti.amount.dividedBy(100))
                if (Math.round(player.replicanti.chance) !== 1) {
                    let counter = 0
                    for (var i=0; i<100; i++) {
                        if (player.replicanti.chance > Math.random()) {
                            counter++;
                        }
                    }
                    player.replicanti.amount = Decimal.min(Number.MAX_VALUE, temp.times(counter).plus(player.replicanti.amount))
                    if (player.timestudy.studies.includes(192)) player.replicanti.amount = temp.times(counter).plus(player.replicanti.amount)
                    counter = 0
                } else {
                    if (player.timestudy.studies.includes(192)) player.replicanti.amount = player.replicanti.amount.times(2)
                    else player.replicanti.amount = Decimal.min(Number.MAX_VALUE, player.replicanti.amount.times(2))

                }
            }
            replicantiTicks -= interval
        }

    }
    if (player.replicanti.amount !== 0 && player.replicanti.unl) replicantiTicks += player.options.updateRate


    if (current == Decimal.ln(Number.MAX_VALUE) && player.thisInfinityTime < 60000*30) giveAchievement("Is this safe?");
    if (player.replicanti.galaxies >= 10 && player.thisInfinityTime < 15000) giveAchievement("The swarm");

    if (player.replicanti.galaxybuyer && player.replicanti.amount.gte(Number.MAX_VALUE) && (!player.timestudy.studies.includes(131) || isAchEnabled("r138"))) {
        replicantiGalaxy();
    }
    if (player.timestudy.studies.includes(22) ? player.replicanti.interval !== 1 : (player.replicanti.interval !== 50)) document.getElementById("replicantiinterval").innerHTML = "Interval: " + (interval < 1000 ? (interval).toPrecision(3) : Math.floor(interval)) + "ms<br>-> " + (interval < 1000 ? Math.max(interval * 0.9, 1 * intervalMult).toPrecision(3) : Math.floor(Math.max(interval * 0.9, 1 * intervalMult))) + "ms Costs: " + shortenCosts(player.replicanti.intervalCost) + " IP"
    else document.getElementById("replicantiinterval").textContent = "Interval: " + (interval < 1000 ? (interval).toPrecision(3) + "ms" : timeDisplay(interval));
      if(speedCheck){
        var estimate = Math.max(Math.log(Number.MAX_VALUE) / Math.log(player.replicanti.chance+1) * getReplicantiInterval(true),0);
        var gps = 1000 / estimate;
          if (gps < 1000) document.getElementById("replicantiapprox").textContent = "You gain Approximately " + gps.toPrecision(3) + " RGs per Second";
          else document.getElementById("replicantiapprox").textContent = "You gain Approximately " + Math.floor(gps).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " RGs per Second"
      } else{
    var estimate = Math.max((Math.log(Number.MAX_VALUE) - current) / est, 0)
    document.getElementById("replicantiapprox").textContent ="Approximately "+ timeDisplay(estimate*1000) + " Until Infinite Replicanti"
  }
    document.getElementById("replicantiamount").textContent = shortenDimensions(player.replicanti.amount)
    var replmult = Decimal.pow(Decimal.log2(Decimal.max(player.replicanti.amount, 1)), 2)
    if (player.timestudy.studies.includes(21)) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
    if (player.timestudy.studies.includes(102))replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies, 150))
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "replication" && glyph.effects.pow !== undefined) replmult = replmult.pow(glyph.effects.pow)
    }
    document.getElementById("replicantimult").textContent = shorten(replmult.max(1))

}

document.getElementById('replicantireset').addEventListener("click", function () {
    if (Math.log(Number.MAX_VALUE) / Math.log(player.replicanti.chance + 1) * getReplicantiInterval(true) < player.options.updateRate && repMs === 0) repMs = player.options.updateRate - maxReplicantiGalaxy(player.options.updateRate);
})
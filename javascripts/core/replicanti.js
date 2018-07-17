function unlockReplicantis() {
  if (player.infinityPoints.gte(1e140)) {
      document.getElementById("replicantidiv").style.display="inline-block"
      document.getElementById("replicantiunlock").style.display="none"
      player.replicanti.unl = true
      player.replicanti.amount = new Decimal(1)
      player.infinityPoints = player.infinityPoints.minus(1e140)
  }
}

function upgradeReplicantiChance() {
  if (player.infinityPoints.gte(player.replicanti.chanceCost) && player.replicanti.chance < 1 && player.eterc8repl !== 0) {
      player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
      player.replicanti.chanceCost = player.replicanti.chanceCost.times(1e15)
      player.replicanti.chance += 0.01
      if (player.currentEternityChall == "eterc8") player.eterc8repl-=1
      document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
  }
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
  let cost = player.replicanti.galCost
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


function replicantiGalaxy() {
  if (player.replicanti.amount.gte(Number.MAX_VALUE) && (!player.timestudy.studies.includes(131) ? player.replicanti.galaxies < player.replicanti.gal : player.replicanti.galaxies < Math.floor(player.replicanti.gal * 1.5))) {
      if (isAchEnabled("r126")) player.replicanti.amount = player.replicanti.amount.dividedBy(Number.MAX_VALUE)
      else player.replicanti.amount = new Decimal(1)
      player.replicanti.galaxies += 1
      player.galaxies-=1
      galaxyReset()

  }
}

function replicantiGalaxyAutoToggle() {
  if (player.replicanti.galaxybuyer) {
      player.replicanti.galaxybuyer = false
      if (player.timestudy.studies.includes(131)) document.getElementById("replicantiresettoggle").textContent = "Auto galaxy OFF (disabled)"
      else document.getElementById("replicantiresettoggle").textContent = "Auto galaxy OFF"
  } else {
      player.replicanti.galaxybuyer = true
      if (player.timestudy.studies.includes(131)) document.getElementById("replicantiresettoggle").textContent = "Auto galaxy ON (disabled)"
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

function replicantiLoop(diff) {
  let interval = player.replicanti.interval
    if (player.timestudy.studies.includes(62)) interval = interval/3
    if (player.timestudy.studies.includes(133) || player.replicanti.amount.gt(Number.MAX_VALUE)) interval *= 10
    if (player.timestudy.studies.includes(213)) interval /= 20
    if (player.reality.upg.includes(2)) interval /= 3
    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "replication" && glyph.effects.speed !== undefined) interval = interval / glyph.effects.speed
    }
    if (player.replicanti.amount.lt(Number.MAX_VALUE) && isAchEnabled("r134")) interval /= 2
    if (player.replicanti.amount.gt(Number.MAX_VALUE)) interval = Math.max(interval * Math.pow(1.2, (player.replicanti.amount.log10() - 308)/308), interval)
    var est = Math.log(player.replicanti.chance+1) * 1000 / interval

    var current = player.replicanti.amount.ln()

    if (player.replicanti.unl && (diff > 5 || interval < 50 || player.timestudy.studies.includes(192))) {
        var gained = Decimal.pow(Math.E, current +(diff*est/10))
        if (player.timestudy.studies.includes(192)) gained = Decimal.pow(Math.E, current +Math.log((diff*est/10) * (Math.log10(1.2)/308)+1) / (Math.log10(1.2)/308))
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


    if (current == Decimal.ln(Number.MAX_VALUE) && player.thisInfinityTime < 600*30) giveAchievement("Is this safe?");
    if (player.replicanti.galaxies >= 10 && player.thisInfinityTime < 150) giveAchievement("The swarm");

    if (player.replicanti.galaxybuyer && player.replicanti.amount.gte(Number.MAX_VALUE) && !player.timestudy.studies.includes(131)) {
        document.getElementById("replicantireset").click()
    }
    if (player.timestudy.studies.includes(22) ? player.replicanti.interval !== 1 : (player.replicanti.interval !== 50)) document.getElementById("replicantiinterval").innerHTML = "Interval: "+(interval).toFixed(3)+"ms<br>-> "+Math.max(interval*0.9).toFixed(3)+" Costs: "+shortenCosts(player.replicanti.intervalCost)+" IP"
    else document.getElementById("replicantiinterval").textContent = "Interval: "+(interval).toFixed(3)+"ms"

    var estimate = Math.max((Math.log(Number.MAX_VALUE) - current) / est, 0)
    document.getElementById("replicantiapprox").textContent ="Approximately "+ timeDisplay(estimate*10) + " Until Infinite Replicanti"

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
var dev = {};
var specialGlyphSymbols = {key2600: "☀", key2601: "☁", key2602: "☂", key2603: "☃", key2604: "☄", key2605: "★", key2606: "☆", key2607: "☇", key2608: "☈", key2609: "☉", key260a: "☊", key260b: "☋", key260c: "☌", key260d: "☍", key260e: "☎", key260f: "☏", key2610: "☐", key2611: "☑", key2612: "☒", key2613: "☓", key2614: "☔", key2615: "☕", key2616: "☖", key2617: "☗", key2618: "☘", key2619: "☙", key261a: "☚", key261b: "☛", key261c: "☜", key261d: "☝", key261e: "☞", key261f: "☟", key2620: "☠", key2621: "☡", key2622: "☢", key2623: "☣", key2624: "☤", key2625: "☥", key2626: "☦", key2627: "☧", key2628: "☨", key2629: "☩", key262a: "☪", key262b: "☫", key262c: "☬", key262d: "☭", key262e: "☮", key262f: "☯", key2630: "☰", key2631: "☱", key2632: "☲", key2633: "☳", key2634: "☴", key2635: "☵", key2636: "☶", key2637: "☷", key2638: "☸", key2639: "☹", key263a: "☺", key263b: "☻", key263c: "☼", key263d: "☽", key263e: "☾", key263f: "☿", key2640: "♀", key2641: "♁", key2642: "♂", key2643: "♃", key2644: "♄", key2645: "♅", key2646: "♆", key2647: "♇", key2648: "♈", key2649: "♉", key264a: "♊", key264b: "♋", key264c: "♌", key264d: "♍", key264e: "♎", key264f: "♏", key2650: "♐", key2651: "♑", key2652: "♒", key2653: "♓", key2654: "♔", key2655: "♕", key2656: "♖", key2657: "♗", key2658: "♘", key2659: "♙", key265a: "♚", key265b: "♛", key265c: "♜", key265d: "♝", key265e: "♞", key265f: "♟", key2660: "♠", key2661: "♡", key2662: "♢", key2663: "♣", key2664: "♤", key2665: "♥", key2666: "♦", key2667: "♧", key2668: "♨", key2669: "♩", key266a: "♪", key266b: "♫", key266c: "♬", key266d: "♭", key266e: "♮", key266f: "♯", key2670: "♰", key2671: "♱", key2672: "♲", key2673: "♳", key2674: "♴", key2675: "♵", key2676: "♶", key2677: "♷", key2678: "♸", key2679: "♹", key267a: "♺", key267b: "♻", key267c: "♼", key267d: "♽", key267e: "♾", key267f: "♿", key2680: "⚀", key2681: "⚁", key2682: "⚂", key2683: "⚃", key2684: "⚄", key2685: "⚅", key2686: "⚆", key2687: "⚇", key2688: "⚈", key2689: "⚉", key268a: "⚊", key268b: "⚋", key268c: "⚌", key268d: "⚍", key268e: "⚎", key268f: "⚏", key2690: "⚐", key2691: "⚑", key2692: "⚒", key2693: "⚓", key2694: "⚔", key2695: "⚕", key2696: "⚖", key2697: "⚗", key2698: "⚘", key2699: "⚙", key269a: "⚚", key269b: "⚛", key269c: "⚜", key269d: "⚝", key269e: "⚞", key269f: "⚟", key26a0: "⚠", key26a1: "⚡", key26a2: "⚢", key26a3: "⚣", key26a4: "⚤", key26a5: "⚥", key26a6: "⚦", key26a7: "⚧", key26a8: "⚨", key26a9: "⚩", key26aa: "⚪", key26ab: "⚫", key26ac: "⚬", key26ad: "⚭", key26ae: "⚮", key26af: "⚯", key26b0: "⚰", key26b1: "⚱", key26b2: "⚲", key26b3: "⚳", key26b4: "⚴", key26b5: "⚵", key26b6: "⚶", key26b7: "⚷", key26b8: "⚸", key26b9: "⚹", key26ba: "⚺", key26bb: "⚻", key26bc: "⚼", key26bd: "⚽", key26be: "⚾", key26bf: "⚿", key26c0: "⛀", key26c1: "⛁", key26c2: "⛂", key26c3: "⛃", key26c4: "⛄", key26c5: "⛅", key26c6: "⛆", key26c7: "⛇", key26c8: "⛈", key26c9: "⛉", key26ca: "⛊", key26cb: "⛋", key26cc: "⛌", key26cd: "⛍", key26ce: "⛎", key26cf: "⛏", key26d0: "⛐", key26d1: "⛑", key26d2: "⛒", key26d3: "⛓", key26d4: "⛔", key26d5: "⛕", key26d6: "⛖", key26d7: "⛗", key26d8: "⛘", key26d9: "⛙", key26da: "⛚", key26db: "⛛", key26dc: "⛜", key26dd: "⛝", key26de: "⛞", key26df: "⛟", key26e0: "⛠", key26e1: "⛡", key26e2: "⛢", key26e3: "⛣", key26e4: "⛤", key26e5: "⛥", key26e6: "⛦", key26e7: "⛧", key26e8: "⛨", key26e9: "⛩", key26ea: "⛪", key26eb: "⛫", key26ec: "⛬", key26ed: "⛭", key26ee: "⛮", key26ef: "⛯", key26f0: "⛰", key26f1: "⛱", key26f2: "⛲", key26f3: "⛳", key26f4: "⛴", key26f5: "⛵", key26f6: "⛶", key26f7: "⛷", key26f8: "⛸", key26f9: "⛹", key26fa: "⛺", key26fb: "⛻", key26fc: "⛼", key26fd: "⛽", key26fe: "⛾", key26ff: "⛿"}

dev.giveAllAchievements = function() {
    Object.keys(allAchievements).forEach( function(key) {
        giveAchievement(allAchievements[key])
    })
}

dev.doubleEverything = function() {
    Object.keys(player).forEach( function(key) {
        if (typeof player[key] === "number") player[key] *= 2;
        if (typeof player[key] === "object" && player[key].constructor !== Object) player[key] = player[key].times(2);
        if (typeof player[key] === "object" && !isFinite(player[key])) {
            Object.keys(player[key]).forEach( function(key2) {
                if (typeof player[key][key2] === "number") player[key][key2] *= 2
                if (typeof player[key][key2] === "object" && player[key][key2].constructor !== Object) player[key][key2] = player[key][key2].times(2)
            })
        }
    })
}

dev.spin3d = function() {
    if (document.getElementById("body").style.animation === "") document.getElementById("body").style.animation = "spin3d 3s infinite"
    else document.getElementById("body").style.animation = ""
}

dev.spin4d = function() {
    if (document.getElementById("body").style.animation === "") document.getElementById("body").style.animation = "spin4d 3s infinite"
    else document.getElementById("body").style.animation = ""
}

dev.cancerize = function() {
    Theme.tryUnlock("Cancer");
    Notation.set("Cancer");
};

dev.fixSave = function() {
    var save = JSON.stringify(player, function(k, v) { return (v === Infinity) ? "Infinity" : v; })
  
    var fixed = save.replace(/NaN/gi, "10")
    var stillToDo = JSON.parse(fixed)
    for (var i=0; i<stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false
    console.log(stillToDo)
    
    var save_data = stillToDo
    if (!save_data || !verify_save(save_data)) {
        alert('could not load the save..');
        load_custom_game();
        return;
    }

    saved = 0;
    infDimPow = 1
    postc8Mult = new Decimal(0)
    mult18 = new Decimal(1)
    ec10bonus = new Decimal(1)
    player = save_data;
    save_game();
    load_game();
    transformSaveToDecimal()
}

dev.implode = function() {
    document.getElementById("body").style.animation = "implode 2s 1";
    setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 2000)
}

dev.updateTDCosts = function() {
    for (var i=1; i<9; i++) {
        var dim = player["timeDimension"+i]
        if (dim.cost.gte(Number.MAX_VALUE)) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*1.5, dim.bought).times(timeDimStartCosts[i])
        }
        if (dim.cost.gte("1e1300")) {
            dim.cost = Decimal.pow(timeDimCostMults[i]*2.2, dim.bought).times(timeDimStartCosts[i])
        }
        if (i > 4) {
          dim.cost = Decimal.pow(timeDimCostMults[i]*100, dim.bought).times(timeDimStartCosts[i])
        }
    }
}

dev.refundTimeDims = function() {
    for (var i=1; i<9; i++) {
        var dim = player["timeDimension"+i]
        dim.bought = 0;
        dim.power = new Decimal(1);
    }
    dev.updateTDCosts()
}

dev.refundEPMult = function() {
    player.epmult = new Decimal(1)
    player.epmultCost = new Decimal(500)
    updateEpMultButton();
}

dev.refundDilStudies = function() {
    for (var i=0; i<6; i++) {
        if (player.dilation.studies.includes(i+1)) {
            player.dilation.studies.splice(player.dilation.studies.indexOf(i+1), 1);
            console.log(document.getElementById("dilstudy"+(i+1)))
            player.timestudy.theorem += parseInt(document.getElementById("dilstudy"+(i+1)).textContent.split("Cost: ")[1].replace(/[, ]+/g, ""))
        }
    }
}

dev.generateSpecialGlyph = function(color, symbol, level) {
    var type = GLYPH_TYPES[Math.floor(random() * GLYPH_TYPES.length)]
    for (var i=0; player.reality.glyphs.last === type; i++) {
      type = GLYPH_TYPES[Math.floor(random() * GLYPH_TYPES.length)]
    }
    player.reality.glyphs.last = type;
    var strength = gaussian_bell_curve()
    var effectAmount = Math.min(Math.floor(Math.pow(random(), 1 - (Math.pow(level * strength, 0.5)) / 100)*1.5 + 1), 4)
    if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
      type = "power"
      effectAmount = 1
      player.reality.glyphs.last = "power"
    }
    var idx = 0
    var hasglyph = true
    while (hasglyph) {
      var slot = player.reality.glyphs.inventory.find(function(g) { return g.idx == idx })
      if (slot !== undefined) idx++;
      else hasglyph = false
    }
    var glyph = {
      id: Date.now(),
      idx: idx,
      type: type,
      strength: strength,
      level: level,
      color: color,
      symbol: symbol,
      effects: {}
    }
    return newGlyph(glyph, type, effectAmount)
}

dev.giveSpecialGlyph = function(color, symbol, level) {
    player.reality.glyphs.inventory.push(dev.generateSpecialGlyph(color, symbol, level))
    generateGlyphTable();
}

dev.giveMusicGlyph = function() {
    dev.giveSpecialGlyph("#FF80AB", "266b", 0)
}

dev.giveGlyph = function() {
    player.reality.glyphs.inventory.push(generateRandomGlyph(Math.ceil(Math.random() * 100)))
    generateGlyphTable();
}

dev.decriminalize = function() {
    player.achievements.splice(player.achievements.indexOf("s23"), 1);
    GameUI.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
}

dev.removeAch = function(name) {
    player.achievements.splice(player.achievements.indexOf(name), 1);
}

dev.realize = function() {
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
}

dev.respecPerks = function() {
    player.reality.pp += player.reality.perks.length
    player.reality.perks = [];
    Perks.updateAchSkipCount();
    document.getElementById("pp").textContent = "You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s.")
    drawPerkNetwork()
}

function isDevEnvironment() {
  const href = window.location.href;
  return href.split("//")[1].length > 20 || href.includes("127.0.0.1") || href.includes("localhost");
}

dev.updateTestSave = function() {
    if (!isDevEnvironment()) return false
    if (player.options.testVersion === undefined) {
        player.options.testVersion = 1;
        player.realTimePlayed *= 100;
        player.totalTimePlayed *= 100;
        player.thisInfinityTime*= 100;
        player.thisEternity *= 100;
        player.thisReality *= 100;
        if (player.bestInfinityTime === 9999999999) player.bestInfinityTime = 999999999999;
        else player.bestInfinityTime *= 100;
        if (player.bestEternity === 9999999999) player.bestEternity = 999999999999;
        else player.bestEternity *= 100;
        if (player.bestReality === 9999999999) player.bestReality = 999999999999;
        else player.bestReality *= 100;
        for (var i=0; i<10; i++) {
            player.lastTenRealities[i][0] *= 100;
            player.lastTenEternities[i][0] *= 100;
            player.lastTenRuns[i][0] *= 100;
        }
        for (var i=0; i<11; i++) {
            setChallengeTime(i, player.challengeTimes[i] * 100);
        }
        for (var i=0; i<8; i++) {
            setInfChallengeTime(i, player.infchallengeTimes[i] * 100);
        }
        updateLastTenRuns();
        updateLastTenEternities();
        updateLastTenRealities();
        updateChallengeTimes();
    }
    if (player.options.testVersion === 1) {
        player.options.testVersion = 2;
        player.reality.glyphs.last = "";
    }
    if (player.options.testVersion === 2) {
        player.options.testVersion = 3;
        player.secretUnlocks.themes = []
    }
    if (player.options.testVersion == 3) {
        player.wormhole.power *= 36
        player.options.testVersion = 4
    }
    if (player.options.testVersion == 4) {
        player.reality.rebuyables = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0,}
        for (var i=1; i<6; i++) {
            if (player.reality.upg.includes(i)) {
                player.reality.rebuyables[i] = 1
                player.reality.upg.splice(player.reality.upg.indexOf(i), 1)
            }
        }
        player.options.testVersion = 5
    }

    if (player.options.testVersion == 5) {
      player.reality.tdbuyer = {
        on: false,
        threshhold: 1
      }
      player.reality.epmultbuyer = {
        on: false,
        threshhold: 1
      }
      player.options.testVersion = 6
    }

    if (player.options.testVersion == 6) {
        player.reality.perks = []
        player.options.testVersion = 7
      }
    if (player.options.testVersion == 7) {
      player.reality.pp = 0
      player.options.testVersion = 8
    }
    if (player.options.testVersion == 8) {
        player.reality.pp = player.realities
        player.options.testVersion = 9
    }
    if (player.options.testVersion == 9) {
        //give starting perk
        if(player.reality.pp > 0) {
            player.reality.pp -= 1
            player.reality.perks.push(0)
        }
        player.options.testVersion = 10
    }
    if (player.options.testVersion == 10) {
        //var for s45
        player.secretUnlocks.dragging = 0;
        player.options.testVersion = 11
    }

    if (player.options.testVersion == 11) {
      for (i = 0; i < player.reality.glyphs.active.length; i++) {
        let glyph = player.reality.glyphs.active[i]
        if (glyph.effects.autochall !== undefined) {
          glyph.effects.autochall = undefined
          glyph.effects.buy10 = 1 + Math.pow(glyph.level * glyph.strength, 0.8) / 10
        }
      }

      for (i = 0; i < player.reality.glyphs.inventory.length; i++) {
        let glyph = player.reality.glyphs.inventory[i]
        if (glyph.effects.autochall !== undefined) {
          glyph.effects.autochall = undefined
          glyph.effects.buy10 = 1 + Math.pow(glyph.level * glyph.strength, 0.8) / 10
        }
      }
      player.options.testVersion = 12
    }
  
  if (player.options.testVersion == 12) {
    player.reality.upgReqs.push(false, false, false, false, false)
    player.options.testVersion = 13
  }

  if (player.options.testVersion === 13) {
      for (let i = 0; i < player.reality.automatorCommands.length; i++) {
          let temp = player.reality.automatorCommands[i];
          if (Math.floor(temp / 10) === 2 || Math.floor(temp / 10) === 3) temp += 1;
          player.reality.automatorCommands[i] = temp;
      }
      if (!player.reality.automatorCommands.includes(24)) player.reality.automatorCommands.push(24);
      if (!player.reality.automatorCommands.includes(25)) player.reality.automatorCommands.push(25);
      if (!player.reality.automatorCommands.includes(12)) player.reality.automatorCommands.push(12);
      player.reality.realityMachines = new Decimal(player.reality.realityMachines);
      updateAutomatorTree();
      player.options.testVersion = 14;
  }

  if (player.options.testVersion == 14) {
    player.reality.glyphs.sac = {
      power: 0,
      infinity: 0,
      time: 0,
      replication: 0,
      dilation: 0
    }
    player.options.testVersion = 15
  }

  if (player.options.testVersion == 15) {
    player.wormhole.pause = false

    player.options.testVersion = 16
  }
  if (player.options.testVersion == 16) {
    player.wormholePause = false;
    if (player.wormhole[0] === undefined) {
      player.wormhole = [player.wormhole, {
        speed: 60 * 6,
        power: 90,
        duration: 7,
        phase: 0,
        active: false,
        unlocked: false,
      },
        {
          speed: 6 * 6,
          power: 45,
          duration: 4,
          phase: 0,
          active: false,
          unlocked: false,
        }]
    }
    player.options.testVersion = 17
  }

  if (player.options.testVersion == 17) {
    if (player.reality.upg.includes(20)) {
      player.wormhole[1].unlocked = true
      $("#whupg2").show()
    }
    player.options.testVersion = 18
  }

  if (player.options.testVersion == 18) {
    player.reality.upgReqs.push(false, false, false, false, false)
    player.options.testVersion = 19
  }

  if (player.options.testVersion == 19) {
    player.reality.tdbuyer = undefined
    player.reality.tdbuyers = [false, false, false, false, false, false, false, false]
    player.reality.epmultbuyer = false
    player.options.testVersion = 20
  }

  if (player.options.testVersion === 20) {
    if (!Object.values(AutoRealityMode).includes(Autobuyer.reality.mode)) {
      Autobuyer.reality.mode = AutoRealityMode.RM;
    }
    player.options.testVersion = 21
  }

  if (player.options.testVersion === 21) {
    convertAutobuyerMode();
    player.options.testVersion = 22;
  }

  if (player.options.testVersion === 22) {
      for (i in player.celestials.teresa.glyphWeights) {
          player.celestials.teresa.glyphWeights[i] *= 100
      }
    player.options.testVersion = 23;
  }

  //the above line of code didn't work if loading a test save before celestials were added, whoops
  if (player.options.testVersion === 23) {
    for (i in player.celestials.teresa.glyphWeights) {
        player.celestials.teresa.glyphWeights[i] = 25
    }
  player.options.testVersion = 24;
  }
}

// Still WIP
dev.showProductionBreakdown = function() {
  let NDComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    NDComponent = NDComponent.times(getDimensionFinalMultiplier(i));
  }
  let tickComponent = player.tickspeed.reciprocal().pow(8);
  let NDPercent = 100 * NDComponent.log10() / (NDComponent.log10() + tickComponent.log10());
  let tickPercent = 100 - NDPercent;
  
  let totalTickspeedUpgrades = player.tickspeed.reciprocal().log10() / getTickSpeedMultiplier().reciprocal().log10();
  let freeTickPercent = 100 * player.totalTickGained / totalTickspeedUpgrades;
  let purchasedTickPercent = 100 - freeTickPercent;
  
  // Assumes >= 3 galaxies
  let effectiveGalaxyCount = Decimal.log(getTickSpeedMultiplier().divide(0.8), 0.965) + 2;
  let AGCount = player.galaxies
  let RGCount = player.replicanti.galaxies
  if (player.timestudy.studies.includes(133)) RGCount += player.replicanti.galaxies/2
  if (player.timestudy.studies.includes(132)) RGCount += player.replicanti.galaxies*0.4
  if (player.timestudy.studies.includes(225)) RGCount += Math.floor(player.replicanti.amount.e / 1000)
  if (player.timestudy.studies.includes(226)) RGCount += Math.floor(player.replicanti.gal / 15)
  RGCount += Math.min(player.replicanti.galaxies, player.replicanti.gal) * Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10()+1), 0.03 * ECTimesCompleted("eterc8"))-1, 0)
  let FGCount = player.dilation.freeGalaxies;
  let totalCount = AGCount + RGCount + FGCount;
  
  IC4pow = player.challenges.includes("postc4") ? 1.05 : 1;
  let IDComponent = player.infinityPower.pow(7 + getAdjustedGlyphEffect("infinityrate")).pow(8).pow(IC4pow);
  let DBComponent = DimBoost.power.pow(player.resets).pow(8).pow(IC4pow);
  let buyTenComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    buyTenComponent = buyTenComponent.times(new Decimal(getDimensionPowerMultiplier(i)).pow(player[TIER_NAMES[i] + 'Bought'] / 10));
  }
  buyTenComponent = buyTenComponent.pow(IC4pow);
  let sacrificeComponent = new Decimal(1);
  if (player.timestudy.studies.includes(71)) sacrificeComponent = sacrificeComponent.times(Sacrifice.totalBoost.pow(0.25).min("1e210000")).pow(7);
  if (player.timestudy.studies.includes(234)) sacrificeComponent = sacrificeComponent.times(Sacrifice.totalBoost);
  if (player.timestudy.studies.includes(214)) sacrificeComponent = sacrificeComponent.times((Sacrifice.totalBoost.pow(8)).min("1e46000").times(Sacrifice.totalBoost.pow(1.1).min(new Decimal("1e125000"))));
  sacrificeComponent = sacrificeComponent.pow(IC4pow);
  let IC8Component = mult18.pow(6).pow(IC4pow);
  let NDPowComponent = getAdjustedGlyphEffect("powerpow") == 0 ? 0 : (getAdjustedGlyphEffect("powerpow") - 1) / getAdjustedGlyphEffect("powerpow");
  
  let totalIDMults = new Decimal(1);
  for (let tier = 1; tier <= 8; tier++) {
    totalIDMults = totalIDMults.times(InfinityDimension(tier).multiplier);
  }
  let boughtIDComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    boughtIDComponent = boughtIDComponent.times(player["infinityDimension" + i].power);
  }
  let replicantiComponent = replicantiMult().pow(8);
  let TSmultToIDComponent = new Decimal(1);
  if (player.timestudy.studies.includes(72)) TSmultToIDComponent = TSmultToIDComponent.times(Sacrifice.totalBoost.pow(0.04).max(1).min("1e30000"))
  if (player.timestudy.studies.includes(82)) TSmultToIDComponent = TSmultToIDComponent.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)))
  let EU1Component = player.eternityPoints.plus(1).pow(8);
  let IDPowComponent = getAdjustedGlyphEffect("infinitypow") == 0 ? 0 : (getAdjustedGlyphEffect("infinitypow") - 1) / getAdjustedGlyphEffect("infinitypow");
  
  let totalTDMults = new Decimal(1);
  for (let tier = 1; tier <= 8; tier++) {
    totalTDMults = totalTDMults.times(TimeDimension(tier).multiplier);
  }
  let boughtTDComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    boughtTDComponent = boughtTDComponent.times(player["timeDimension" + i].power);
  }
  let tickspeedToTDComponent = isAchEnabled("r105") ? player.tickspeed.div(1000).pow(0.000005).reciprocal().pow(8) : 0;
  let TSmultToTDComponent = new Decimal(1);
  if (player.timestudy.studies.includes(11)) tickspeedToTDComponent = tickspeedToTDComponent.times(player.tickspeed.dividedBy(1000).pow(0.005).times(0.95).plus(player.tickspeed.dividedBy(1000).pow(0.0003).times(0.05)).max(Decimal.fromMantissaExponent(1, 2500)))
  if (player.timestudy.studies.includes(73)) TSmultToTDComponent = TSmultToTDComponent.times(Sacrifice.totalBoost.pow(0.005).min(new Decimal("1e1300")))
  if (player.timestudy.studies.includes(221)) TSmultToTDComponent = TSmultToTDComponent.times(Decimal.pow(1.0025, player.resets)).pow(8)
  if (player.timestudy.studies.includes(227)) TSmultToTDComponent = TSmultToTDComponent.times(Math.max(Math.pow(Sacrifice.totalBoost.log10(), 10), 1))
  let TDPowComponent = getAdjustedGlyphEffect("timepow") == 0 ? 0 : (getAdjustedGlyphEffect("timepow") - 1) / getAdjustedGlyphEffect("timepow");
  
  let productionText = ""
  productionText += tickPercent.toFixed(2) + "% from tickspeed (" + totalTickspeedUpgrades.toFixed(0) + " upgrades + " + effectiveGalaxyCount.toFixed(2) + " effective galaxies)\n";
  productionText += "  Tickspeed upgrades\n"
  productionText += "    " + purchasedTickPercent.toFixed(2) + "% purchased\n"
  productionText += "    " + freeTickPercent.toFixed(2) + "% from TDs\n"
  productionText += "  Galaxies\n"
  productionText += "    " + (100*AGCount/totalCount).toFixed(2) + "% Antimatter Galaxies\n"
  productionText += "    " + (100*RGCount/totalCount).toFixed(2) + "% Replicanti Galaxies\n"
  productionText += "    " + (100*FGCount/totalCount).toFixed(2) + "% Dilation Galaxies\n"
  productionText += NDPercent.toFixed(2) + "% from Normal Dimensions\n";
  productionText += "  " + (100*IDComponent.log10()/NDComponent.log10()).toFixed(2) + "% from Infinity Dimensions\n"
  productionText += "  " + (100*DBComponent.log10()/NDComponent.log10()).toFixed(2) + "% from Dimension Boosts\n"
  productionText += "  " + (100*buyTenComponent.log10()/NDComponent.log10()).toFixed(2) + "% from \"Buy 10\"\n"
  productionText += "  " + (100*sacrificeComponent.log10()/NDComponent.log10()).toFixed(2) + "% from sacrifice\n"
  productionText += "  " + (100*IC8Component.log10()/NDComponent.log10()).toFixed(2) + "% from IC8\n"
  productionText += "  " + (100*NDPowComponent).toFixed(2) + "% from ND power glyphs\n"
  productionText += "\nInfinity Dimension Multipliers:\n"
  productionText += "  " + (100*boughtIDComponent.log10()/totalIDMults.log10()).toFixed(2) + "% purchased\n"
  productionText += "  " + (100*replicantiComponent.log10()/totalIDMults.log10()).toFixed(2) + "% from replicanti\n"
  productionText += "  " + (100*TSmultToIDComponent.log10()/totalIDMults.log10()).toFixed(2) + "% from time studies\n"
  productionText += "  " + (100*EU1Component.log10()/totalIDMults.log10()).toFixed(2) + "% from EU1\n"
  productionText += "  " + (100*IDPowComponent).toFixed(2) + "% from ID power glyphs\n"
  productionText += "\nTime Dimension Multipliers:\n"
  productionText += "  " + (100*boughtTDComponent.log10()/totalTDMults.log10()).toFixed(2) + "% purchased\n"
  productionText += "  " + (100*tickspeedToTDComponent.log10()/totalTDMults.log10()).toFixed(2) + "% from tickspeed\n"
  productionText += "  " + (player.dilation.upgrades.includes(5) ? 10*replicantiComponent.log10()/totalTDMults.log10() : 0).toFixed(2) + "% from replicanti\n"
  productionText += "  " + (100*TSmultToTDComponent.log10()/totalTDMults.log10()).toFixed(2) + "% from other time studies\n"
  productionText += "  " + (100*TDPowComponent).toFixed(2) + "% from TD power glyphs\n"
  
  console.log(productionText);
}

dev.togglePerformanceStats = function() {
  PerformanceStats.toggle();
};
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
    if (document.getElementById("body").style.animation === "") document.getElementById("body").style.animation = "spin3d 2s infinite"
    else document.getElementById("body").style.animation = ""
}

dev.cancerize = function() {
    player.options.theme = "S4";
    player.options.secretThemeKey = "Cancer";
    setTheme(player.options.theme);
    player.options.notation = "Emojis"
    document.getElementById("theme").textContent = "SO"
    document.getElementById("notation").textContent = "BEAUTIFUL"
}

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

dev.implode = function() {
    document.getElementById("body").style.animation = "implode 2s 1";
    setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 2000)
}

dev.updateCosts = function() {
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
    var type = GLYPH_TYPES[Math.floor(Math.random() * GLYPH_TYPES.length)]
    var strength = gaussian_bell_curve()
    var effectAmount = Math.min(Math.floor(Math.pow(Math.random(), 1 - (Math.pow(level * strength, 0.5)) / 100)*1.5 + 1), 4)
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
    switch(type) {
        case "time":
        return timeGlyph(glyph, effectAmount)
        break;
    
        case "dilation":
        return dilationGlyph(glyph, effectAmount)
        break;
    
        case "replication":
        return replicationGlyph(glyph, effectAmount)
        break;
    
        case "infinity":
        return infinityGlyph(glyph, effectAmount)
        break;
    }
}

dev.giveSpecialGlyph = function(color, symbol, level) {
    player.reality.glyphs.inventory.push(dev.generateSpecialGlyph(color, symbol, level))
    generateGlyphTable();
}

dev.giveGlyph = function() {
    player.reality.glyphs.inventory.push(generateRandomGlyph(Math.random() * 100))
    generateGlyphTable();
}
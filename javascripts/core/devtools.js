import { DC } from "./constants.js";

/* eslint-disable no-console */
// Disabling no-console here seems
// reasonable, since these are the devtools after all
export const dev = {};
export const specialGlyphSymbols = {
  key2600: "☀", key2601: "☁", key2602: "☂", key2603: "☃", key2604: "☄", key2605: "★",
  key2606: "☆", key2607: "☇", key2608: "☈", key2609: "☉", key260a: "☊", key260b: "☋",
  key260c: "☌", key260d: "☍", key260e: "☎", key260f: "☏", key2610: "☐", key2611: "☑",
  key2612: "☒", key2613: "☓", key2614: "☔", key2615: "☕", key2616: "☖", key2617: "☗",
  key2618: "☘", key2619: "☙", key261a: "☚", key261b: "☛", key261c: "☜", key261d: "☝",
  key261e: "☞", key261f: "☟", key2620: "☠", key2621: "☡", key2622: "☢", key2623: "☣",
  key2624: "☤", key2625: "☥", key2626: "☦", key2627: "☧", key2628: "☨", key2629: "☩",
  key262a: "☪", key262b: "☫", key262c: "☬", key262d: "☭", key262e: "☮", key262f: "☯",
  key2630: "☰", key2631: "☱", key2632: "☲", key2633: "☳", key2634: "☴", key2635: "☵",
  key2636: "☶", key2637: "☷", key2638: "☸", key2639: "☹", key263a: "☺", key263b: "☻",
  key263c: "☼", key263d: "☽", key263e: "☾", key263f: "☿", key2640: "♀", key2641: "♁",
  key2642: "♂", key2643: "♃", key2644: "♄", key2645: "♅", key2646: "♆", key2647: "♇",
  key2648: "♈", key2649: "♉", key264a: "♊", key264b: "♋", key264c: "♌", key264d: "♍",
  key264e: "♎", key264f: "♏", key2650: "♐", key2651: "♑", key2652: "♒", key2653: "♓",
  key2654: "♔", key2655: "♕", key2656: "♖", key2657: "♗", key2658: "♘", key2659: "♙",
  key265a: "♚", key265b: "♛", key265c: "♜", key265d: "♝", key265e: "♞", key265f: "♟",
  key2660: "♠", key2661: "♡", key2662: "♢", key2663: "♣", key2664: "♤", key2665: "♥", key2666: "♦",
  key2667: "♧", key2668: "♨", key2669: "♩", key266a: "♪", key266b: "♫", key266c: "♬", key266d: "♭",
  key266e: "♮", key266f: "♯", key2670: "♰", key2671: "♱", key2672: "♲", key2673: "♳", key2674: "♴",
  key2675: "♵", key2676: "♶", key2677: "♷", key2678: "♸", key2679: "♹", key267a: "♺",
  key267b: "♻", key267c: "♼", key267d: "♽", key267e: "♾", key267f: "♿", key2680: "⚀",
  key2681: "⚁", key2682: "⚂", key2683: "⚃", key2684: "⚄", key2685: "⚅", key2686: "⚆",
  key2687: "⚇", key2688: "⚈", key2689: "⚉", key268a: "⚊", key268b: "⚋", key268c: "⚌",
  key268d: "⚍", key268e: "⚎", key268f: "⚏", key2690: "⚐", key2691: "⚑", key2692: "⚒",
  key2693: "⚓", key2694: "⚔", key2695: "⚕", key2696: "⚖", key2697: "⚗", key2698: "⚘",
  key2699: "⚙", key269a: "⚚", key269b: "⚛", key269c: "⚜", key269d: "⚝", key269e: "⚞",
  key269f: "⚟", key26a0: "⚠", key26a1: "⚡", key26a2: "⚢", key26a3: "⚣", key26a4: "⚤",
  key26a5: "⚥", key26a6: "⚦", key26a7: "⚧", key26a8: "⚨", key26a9: "⚩", key26aa: "⚪",
  key26ab: "⚫", key26ac: "⚬", key26ad: "⚭", key26ae: "⚮", key26af: "⚯", key26b0: "⚰",
  key26b1: "⚱", key26b2: "⚲", key26b3: "⚳", key26b4: "⚴", key26b5: "⚵", key26b6: "⚶", key26b7: "⚷",
  key26b8: "⚸", key26b9: "⚹", key26ba: "⚺", key26bb: "⚻", key26bc: "⚼", key26bd: "⚽",
  key26be: "⚾", key26bf: "⚿", key26c0: "⛀", key26c1: "⛁", key26c2: "⛂", key26c3: "⛃",
  key26c4: "⛄", key26c5: "⛅", key26c6: "⛆", key26c7: "⛇", key26c8: "⛈", key26c9: "⛉",
  key26ca: "⛊", key26cb: "⛋", key26cc: "⛌", key26cd: "⛍", key26ce: "⛎", key26cf: "⛏",
  key26d0: "⛐", key26d1: "⛑", key26d2: "⛒", key26d3: "⛓", key26d4: "⛔", key26d5: "⛕",
  key26d6: "⛖", key26d7: "⛗", key26d8: "⛘", key26d9: "⛙", key26da: "⛚", key26db: "⛛",
  key26dc: "⛜", key26dd: "⛝", key26de: "⛞", key26df: "⛟", key26e0: "⛠", key26e1: "⛡",
  key26e2: "⛢", key26e3: "⛣", key26e4: "⛤", key26e5: "⛥", key26e6: "⛦", key26e7: "⛧",
  key26e8: "⛨", key26e9: "⛩", key26ea: "⛪", key26eb: "⛫", key26ec: "⛬", key26ed: "⛭",
  key26ee: "⛮", key26ef: "⛯", key26f0: "⛰", key26f1: "⛱", key26f2: "⛲", key26f3: "⛳",
  key26f4: "⛴", key26f5: "⛵", key26f6: "⛶", key26f7: "⛷", key26f8: "⛸", key26f9: "⛹",
  key26fa: "⛺", key26fb: "⛻", key26fc: "⛼", key26fd: "⛽", key26fe: "⛾", key26ff: "⛿",
  key2700: "🌎", key2701: "🦒", key2702: "👻"
};

dev.hardReset = function() {
  GameStorage.hardReset();
};

dev.giveAllAchievements = function() {
  const allAchievements = Achievements.all.concat(SecretAchievements.all);
  for (const achievement of allAchievements) achievement.unlock();
};

// Know that both dev.doubleEverything and dev.tripleEverything are both broken
// with this error https://i.imgur.com/ZMEBNTv.png

dev.doubleEverything = function() {
  Object.keys(player).forEach(key => {
    if (typeof player[key] === "number") player[key] *= 2;
    if (typeof player[key] === "object" && player[key].constructor !== Object) player[key] = player[key].times(2);
    if (typeof player[key] === "object" && !isFinite(player[key])) {
      Object.keys(player[key]).forEach(key2 => {
        if (typeof player[key][key2] === "number") player[key][key2] *= 2;
        if (typeof player[key][key2] === "object" && player[key][key2].constructor !== Object)
          player[key][key2] = player[key][key2].times(2);
      });
    }
  });
};

dev.tripleEverything = function() {
  Object.keys(player).forEach(key => {
    if (typeof player[key] === "number") player[key] *= 3;
    if (typeof player[key] === "object" && player[key].constructor !== Object) player[key] = player[key].times(3);
    if (typeof player[key] === "object" && !isFinite(player[key])) {
      Object.keys(player[key]).forEach(key3 => {
        if (typeof player[key][key3] === "number") player[key][key3] *= 3;
        if (typeof player[key][key3] === "object" && player[key][key3].constructor !== Object)
          player[key][key3] = player[key][key3].times(3);
      });
    }
  });
};

dev.barrelRoll = function() {
  document.body.style.animation = "barrelRoll 5s 1";
  setTimeout(() => document.body.style.animation = "", 5000);
};

dev.spin3d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "spin3d 3s infinite";
  else document.body.style.animation = "";
};

dev.spin4d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "spin4d 3s infinite";
  else document.body.style.animation = "";
};

dev.cancerize = function() {
  Theme.tryUnlock("Cancer");
  Notation.cancer.setAsCurrent();
};

dev.fixSave = function() {
  const save = JSON.stringify(player, GameSaveSerializer.jsonConverter);
  const fixed = save.replace(/NaN/gui, "10");
  const saveData = JSON.parse(fixed);
  if (!saveData || GameStorage.checkPlayerObject(saveData) !== "") {
    Modal.message.show("Could not fix the save.");
    return;
  }
  GameStorage.loadPlayerObject(saveData);
  GameStorage.save();
};

dev.updateTDCosts = function() {
  for (let tier = 1; tier < 9; tier++) {
    const dim = TimeDimension(tier);
    dim.cost = dim.nextCost(dim.bought);
  }
};

dev.refundTimeDims = function() {
  for (const dimension of TimeDimensions.all) {
    dimension.bought = 0;
  }
  dev.updateTDCosts();
};

dev.refundEPMult = function() {
  player.epmultUpgrades = 0;
};

dev.refundDilStudies = function() {
  for (const study of GameDatabase.eternity.timeStudies.dilation) {
    if (player.dilation.studies.includes(study.id)) {
      player.dilation.studies.splice(player.dilation.studies.indexOf(study.id), 1);
      console.log(document.getElementById(`removed dilstudy${study.id}`));
      Currency.timeTheorems.add(study.cost);
    }
  }
};

dev.resetDilation = function() {
  player.dilation.dilatedTime = DC.D0;
  player.dilation.tachyonParticles = DC.D0;
  player.dilation.rebuyables[1] = 0;
  player.dilation.rebuyables[2] = 0;
  player.dilation.rebuyables[3] = 0;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
};

// We want to give a large degree of options
// when making a special glyph, so no max-params
// eslint-disable-next-line max-params
dev.giveSpecialGlyph = function(color, symbol, level, rawLevel = level) {
  if (!specialGlyphSymbols.hasOwnProperty(symbol)) return;
  if (Glyphs.freeInventorySpace === 0) return;
  const glyph = GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel });
  glyph.symbol = symbol;
  glyph.color = color;
  Glyphs.addToInventory(glyph);
};

dev.giveGlyph = function(level, rawLevel = level) {
  if (Glyphs.freeInventorySpace === 0) return;
  Glyphs.addToInventory(GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel }));
};

dev.giveRealityGlyph = function(level) {
  if (Glyphs.freeInventorySpace === 0) return;
  Glyphs.addToInventory(GlyphGenerator.realityGlyph(level));
};

dev.setCompanionGlyphEP = function(eternityPoints) {
  const glyph = player.reality.glyphs.active
    .concat(player.reality.glyphs.inventory)
    .filter(g => g.type === "companion")[0];
  glyph.strength = rarityToStrength(eternityPoints.log10() / 1e6);
};

dev.decriminalize = function() {
  SecretAchievement(23).lock();
  EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
};

dev.removeAch = function(name) {
  if (name === "all") {
    const allAchievements = Achievements.all.concat(SecretAchievements.all);
    for (const achievement of allAchievements) achievement.lock();
    return "removed all achievements";
  }
  if (typeof (name) === "number") return Achievement(name).lock();
  if (name.startsWith("r")) return Achievement(parseInt(name.slice(1), 10)).lock();
  if (name.startsWith("s")) return SecretAchievement(parseInt(name.slice(1), 10)).lock();
  return "failed to delete achievement";
};

window.nextNewsMessageId = undefined;

dev.setNextNewsMessage = function(id) {
  nextNewsMessageId = id;
};

dev.implode = function() {
  bigCrunchAnimation();
};

dev.eternify = function() {
  eternityAnimation();
};

dev.dilate = function() {
  animateAndDilate();
};

dev.undilate = function() {
  animateAndUndilate();
};

dev.realize = function() {
  runRealityAnimation();
};

dev.respecPerks = function() {
  player.reality.perkPoints += player.reality.perks.size;
  player.reality.perks = new Set();
  GameCache.achievementPeriod.invalidate();
  GameCache.buyablePerks.invalidate();
};

export function isDevEnvironment() {
  const href = window.location.href;
  return href.split("//")[1].length > 20 || isLocalEnvironment();
}

export function isLocalEnvironment() {
  const href = window.location.href;
  return href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
}

window.tempSpeedupToggle = false;
window.tempSpeedupFactor = 500;
// Speeds up game, intentionally doesn't persist between refreshes
// With no arguments, toggles on/off
dev.goFast = function(speed) {
  if (speed !== undefined && speed > 0) {
    tempSpeedupToggle = true;
    tempSpeedupFactor = speed;
  } else {
    tempSpeedupToggle = !tempSpeedupToggle;
  }
};

window.tempAmplifyToggle = false;
window.tempAmplifyFactor = 100;
// Amplifies every reality you do, intentionally doesn't persist between refreshes
// With no arguments, toggles on/off
dev.amplify = function(amplification) {
  if (amplification !== undefined && amplification > 0) {
    tempAmplifyToggle = true;
    tempAmplifyFactor = amplification;
  } else {
    tempAmplifyToggle = !tempAmplifyToggle;
  }
};

dev.togglePerformanceStats = function() {
  PerformanceStats.toggle();
};

// Buys all perks, will end up buying semi-randomly if not enough pp
dev.buyAllPerks = function() {
  const visited = [];
  const toVisit = [Perk.firstPerk];
  while (toVisit.length > 0) {
    if (player.reality.perkPoints < 1) break;
    const perk = toVisit.shift();
    visited.push(perk);
    toVisit.push(...perk.connectedPerks.filter(p => !visited.includes(p)));
    perk.purchase();
  }
};

(function() {
  let kongTest;
  const setKongTest = value => {
    kongTest = value;
    localStorage.setItem("kongTest", kongTest);
    if (kongTest) {
      document.documentElement.classList.add("_kong-test");
    } else {
      document.documentElement.classList.remove("_kong-test");
    }
  };
  setKongTest(localStorage.getItem("kongTest") === "true");
  dev.kongTest = () => setKongTest(!kongTest);
}());

// This should help for balancing different glyph types, strong rounding of values is intentional
dev.printResourceTotals = function() {
  console.log(`Antimatter: e${Currency.antimatter.exponent.toPrecision(3)}`);
  console.log(`RM: e${Math.round(MachineHandler.gainedRealityMachines.log10())}`);
  console.log(`Glyph level: ${100 * Math.floor(gainedGlyphLevel().actualLevel / 100 + 0.5)}`);

  console.log(`Tickspeed: e${-Tickspeed.current.exponent.toPrecision(3)}`);
  console.log(`Gamespeed: ${Math.pow(getGameSpeedupFactor(), 1.2).toPrecision(1)}`);
  const aGalaxy = 100 * Math.floor(player.galaxies / 100 + 0.5);
  const rGalaxy = 100 * Math.floor(Replicanti.galaxies.total / 100 + 0.5);
  const dGalaxy = 100 * Math.floor(player.dilation.totalTachyonGalaxies / 100 + 0.5);
  console.log(`Galaxies: ${aGalaxy}+${rGalaxy}+${dGalaxy} (${aGalaxy + rGalaxy + dGalaxy})`);
  console.log(`Tick reduction: e${-Math.round(getTickSpeedMultiplier().log10())}`);

  let ADmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    ADmults = ADmults.times(AntimatterDimension(i).multiplier);
  }
  console.log(`AD mults: e${ADmults.log10().toPrecision(3)}`);
  let IDmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    IDmults = IDmults.times(InfinityDimension(i).multiplier);
  }
  console.log(`ID mults: e${IDmults.log10().toPrecision(3)}`);
  let TDmults = DC.D1;
  for (let i = 1; i <= 8; i++) {
    TDmults = TDmults.times(TimeDimension(i).multiplier);
  }
  console.log(`TD mults: e${TDmults.log10().toPrecision(3)}`);
  console.log(`Tickspeed from TD: ${formatWithCommas(1000 * Math.floor(player.totalTickGained / 1000 + 0.5))}`);

  console.log(`Infinities: e${Math.round(player.infinities.log10())}`);
  console.log(`Eternities: e${Math.round(player.eternities.log10())}`);
  console.log(`Replicanti: e${formatWithCommas(1e5 * Math.floor(Replicanti.amount.log10() / 1e5 + 0.5))}`);

  console.log(`TT: e${Math.round(player.timestudy.theorem.log10())}`);
  console.log(`DT: e${Math.round(player.dilation.dilatedTime.log10())}`);
  console.log(`TP: e${Math.round(player.dilation.tachyonParticles.log10())}`);
};

dev.unlockCelestialQuotes = function(celestial) {
  const quotes = Celestials[celestial].quotes;
  for (const q of quotes.quotesById) {
    if (q === undefined) continue;
    quotes.show(q);
  }
};

// This doesn't check everything but hopefully it gets some of the more obvious ones.
dev.testReplicantiCode = function(singleId, useDebugger = false) {
  const situationLists = [
    [
      function() {
        player.infinities = DC.E12;
        player.celestials.effarig.unlockBits = 64;
      }
    ],
    [
      function() {
        player.replicanti.interval = 1;
      }
    ],
    [
      function() {
        player.timestudy.studies.push(33);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(62);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(131);
      },
      function() {
        player.timestudy.studies.push(132);
      },
      function() {
        player.timestudy.studies.push(133);
      },
      function() {
        player.timestudy.studies.push(131, 132, 133);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(192);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(213);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(225);
      }
    ],
    [
      function() {
        player.timestudy.studies.push(226);
      }
    ],
    [
      function() {
        // eslint-disable-next-line no-bitwise
        player.achievementBits[8] |= 16;
      }
    ],
    [
      function() {
        // eslint-disable-next-line no-bitwise
        player.achievementBits[12] |= 8;
      }
    ],
    [
      function() {
        // eslint-disable-next-line no-bitwise
        player.achievementBits[12] |= 128;
      }
    ],
    [
      function() {
        player.reality.perks = new Set([32]);
      }
    ],
    [
      function() {
        Autobuyer.replicantiGalaxy.isActive = true;
      }
    ],
    [
      function() {
        Replicanti.galaxies.isPlayerHoldingR = true;
      }
    ],
    [
      function() {
        player.replicanti.boughtGalaxyCap = 100;
      },
      function() {
        player.replicanti.boughtGalaxyCap = 100;
        player.replicanti.galaxies = 50;
      }
    ],
    [
      function() {
        // eslint-disable-next-line no-bitwise
        player.reality.upgReqs = (1 << 6);
        player.reality.upgradeBits = 64;
      }
    ]
  ];
  const situationCount = situationLists.map(x => x.length + 1).reduce((x, y) => x * y);
  const resultList = [];
  const runSituation = function(id) {
    Replicanti.galaxies.isPlayerHoldingR = false;
    GameStorage.loadPlayerObject(Player.defaultStart);
    player.infinities = DC.D1;
    player.infinityPoints = DC.E150;
    Replicanti.unlock();
    player.replicanti.chance = 1;
    for (let i = 0; i < situationLists.length; i++) {
      const div = situationLists.slice(0, i).map(x => x.length + 1).reduce((x, y) => x * y, 1);
      // eslint-disable-next-line no-empty-function
      const situation = [() => {}].concat(situationLists[i])[Math.floor(id / div) % (situationLists[i].length + 1)];
      situation();
    }
    function doReplicantiTicks() {
      for (let j = 0; j <= 5; j++) {
        replicantiLoop(Math.pow(10, j));
        resultList.push(Notation.scientific.formatDecimal(Replicanti.amount, 5, 5));
        resultList.push(player.replicanti.galaxies);
        resultList.push(Replicanti.galaxies.total);
      }
    }
    doReplicantiTicks();
    player.antimatter = DC.E309;
    player.records.thisInfinity.maxAM = DC.E309;
    bigCrunchReset();
    doReplicantiTicks();
  };
  if (singleId === undefined) {
    const total = 4000;
    const p = 10007;
    if (total * p < situationCount) {
      throw new Error("Prime p is not large enough to go through all situations.");
    }
    for (let i = 0; i < total; i++) {
      const actual = i * p % situationCount;
      if (i % 100 === 0) {
        console.log(`Considering situation #${i}/${total} (${actual})`);
      }
      runSituation(actual);
    }
  } else {
    runSituation(singleId);
  }
  const hash = sha512_256(resultList.toString());
  console.log(hash);
  if (useDebugger) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  return hash;
};

dev.testGlyphs = function(config) {
  const glyphLevel = config.glyphLevel || 6500;
  const duration = config.duration || 4000;
  let glyphId = Date.now();
  const save = GameSaveSerializer.serialize(player);
  const makeGlyph = (type, effects) => ({
    type,
    level: glyphLevel,
    strength: 3.5,
    rawLevel: glyphLevel,
    idx: null,
    id: glyphId++,
    effects: makeGlyphEffectBitmask(effects),
  });
  const makeAllEffectGlyph = type => makeGlyph(type, GlyphTypes[type].effects.map(e => e.id));
  const effarigGlyphs = [
    makeGlyph("effarig", ["effarigantimatter", "effarigdimensions", "effarigforgotten", "effarigblackhole"]),
    makeGlyph("effarig", ["effarigantimatter", "effarigdimensions", "effarigforgotten", "effarigachievement"]),
  ];
  function makeCombinationsWithRepeats(count, elements) {
    if (elements.length === 0) return [];
    if (count === 0) return [[]];
    const withoutFirst = makeCombinationsWithRepeats(count, elements.slice(1));
    const withFirst = makeCombinationsWithRepeats(count - 1, elements);
    withFirst.forEach(e => e.push(elements[0]));
    return withFirst.concat(withoutFirst);
  }
  const sets5 = makeCombinationsWithRepeats(5, BASIC_GLYPH_TYPES)
    .map(s => s.map(t => makeAllEffectGlyph(t)));
  const sets4 = makeCombinationsWithRepeats(4, BASIC_GLYPH_TYPES)
    .map(s => s.map(t => makeAllEffectGlyph(t)));
  const effarigSets = effarigGlyphs.map(g => sets4.map(s => [g].concat(s)));
  const glyphSets = sets5.concat(...effarigSets);
  function equipSet(index) {
    player.reality.glyphs.active = glyphSets[index].map((g, idx) => {
      g.idx = idx;
      return g;
    });
    Glyphs.active = Array.from(player.reality.glyphs.active);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  }
  function glyphToShortString(glyph) {
    if (glyph.type === "effarig") {
      return effarigGlyphs.findIndex(e => e.id === glyph.id).toString();
    }
    return GLYPH_SYMBOLS[glyph.type];
  }
  function padString(s, length, before = false) {
    if (s.length >= length) return s;
    return before ? (" ").repeat(length - s.length) + s : s + (" ").repeat(length - s.length);
  }
  function finishTrial(index) {
    const done = padString(`${Math.floor(100 * (index + 1) / glyphSets.length)}%`, 4, true);
    const rm = padString(MachineHandler.gainedRealityMachines.toPrecision(2), 9);
    const gl = padString(gainedGlyphLevel().actualLevel, 4);
    const ep = padString(player.eternityPoints.exponent.toString(), 6);
    const ip = padString(player.infinityPoints.exponent.toString(), 8);
    const am = padString(Currency.antimatter.exponent.toString(), 12);
    const dimboosts = DimBoost.purchasedBoosts;
    const galaxies = Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies;
    const glyphData = glyphSets[index].map(glyphToShortString).sum();
    console.log(`${done} ${glyphData} rm=${rm} gl=${gl} ep=${ep} ip=${ip} am=${am} ` +
      `dimboosts=${dimboosts} galaxies=${galaxies}`);
    GameStorage.import(save, Date.now());
    if (index < glyphSets.length - 1) {
      setTimeout(runTrial, 100, index + 1);
    }
  }
  function runTrial(index) {
    equipSet(index);
    AutomatorBackend.start();
    setTimeout(finishTrial, duration, index);
  }
  runTrial(0);
};

dev.devMode = function() {
  player.devMode = !player.devMode;
};

// May want to make this command in particular publicly known if automator gating is a common complaint post-release
dev.unlockAutomator = function() {
  player.reality.automator.forceUnlock = true;
};

dev.startSpeedrun = function(name) {
  GameStorage.hardReset();
  player.speedrun.isActive = true;
  // If a name isn't given, choose a somewhat-likely-to-be-unique big number instead
  if (name) player.speedrun.name = name;
  else player.speedrun.name = `AD Player #${Math.floor(1e7 * Math.random())}`;
  // "Fake News" Achievement, given for free to partially mitigate promoting weird strategies at the beginning of runs
  Achievement(22).unlock();
};

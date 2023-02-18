import { sha512_256 } from "js-sha512";

import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

/* eslint-disable no-console */
// Disabling no-console here seems
// reasonable, since these are the devtools after all
export const dev = {};

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
  FullScreenAnimationHandler.display("a-barrel-roll", 5);
};

dev.spin3d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "a-spin3d 3s infinite";
  else document.body.style.animation = "";
};

dev.spin4d = function() {
  if (document.body.style.animation === "") document.body.style.animation = "a-spin4d 3s infinite";
  else document.body.style.animation = "";
};

dev.cancerize = function() {
  Theme.tryUnlock("Design");
  Notation.emoji.setAsCurrent();
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
  if (GameCache.glyphInventorySpace.value === 0) return;
  const glyph = GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel });
  glyph.symbol = symbol;
  glyph.color = color;
  Glyphs.addToInventory(glyph);
};

dev.giveGlyph = function(level, rawLevel = level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  Glyphs.addToInventory(GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel }));
};

dev.giveRealityGlyph = function(level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
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
  Quotes[celestial].all.forEach(x => x.show());
};

dev.presentCelestialQuotes = function(celestial) {
  Quotes[celestial].all.forEach(x => x.present());
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
        player.achievementBits[8] |= 16;
      }
    ],
    [
      function() {
        player.achievementBits[12] |= 8;
      }
    ],
    [
      function() {
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
    GameStorage.offlineEnabled = false;
    GameStorage.import(save);
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

// May want to make this command in particular publicly known if automator gating is a common complaint post-release
dev.unlockAutomator = function() {
  player.reality.automator.forceUnlock = true;
};

// This bypasses any conflict checking and forces the current save to overwrite the cloud save. This largely exists
// because normal cloud saving checks for a conflict and then always shows a modal if a conflict is found, only actually
// saving if the player says to in the modal. The check can fail if the cloud save is somehow malformed and missing
// props. This can lead to the check always failing, the modal never showing up, and cloud saving never occurring. That
// should in principle only show up in dev, as migrations aren't run on cloud saves, but this allows fixing in case.
dev.forceCloudSave = async function() {
  const save = await Cloud.load();
  const root = GameSaveSerializer.deserialize(save);
  const saveId = GameStorage.currentSlot;
  if (!root.saves) root.saves = [];
  root.saves[saveId] = GameStorage.saves[saveId];
  Cloud.save(saveId);
};

// TODO Figure out if we want to remove this before release
dev.unlockAllCosmeticSets = function() {
  player.reality.glyphs.cosmetics.unlockedFromNG = Object.keys(GameDatabase.reality.glyphCosmeticSets);
};

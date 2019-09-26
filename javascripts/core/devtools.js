"use strict";
/* eslint-disable no-console */
// Disabling no-console here seems
// reasonable, since these are the devtools after all
const dev = {};
const specialGlyphSymbols = {
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
  key26fa: "⛺", key26fb: "⛻", key26fc: "⛼", key26fd: "⛽", key26fe: "⛾", key26ff: "⛿"
};

dev.giveAllAchievements = function() {
  const allAchievements = Achievements.all.concat(SecretAchievements.all);
  for (const achievement of allAchievements) achievement.unlock();
};

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
  if (!saveData || !GameStorage.verifyPlayerObject(saveData)) {
    Modal.message.show("Could not fix the save..");
    return;
  }
  GameStorage.loadPlayerObject(saveData);
  GameStorage.save();
};

dev.implode = function() {
    document.body.style.animation = "implode 2s 1";
    setTimeout(() => document.body.style.animation = "", 2000);
};

dev.updateTDCosts = function() {
    for (let tier = 1; tier < 9; tier++) {
        const dim = TimeDimension(tier);
        dim.cost = timeDimensionCost(tier, dim.bought);
    }
};

dev.refundTimeDims = function() {
    for (let i = 1; i < 9; i++) {
        const dim = TimeDimension(i);
        dim.bought = 0;
        dim.power = new Decimal(1);
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
            player.timestudy.theorem = player.timestudy.theorem.plus(study.cost);
        }
    }
};

dev.resetDilation = function() {
  player.dilation.dilatedTime = new Decimal(0);
  player.dilation.tachyonParticles = new Decimal(0);
  player.dilation.rebuyables[1] = 0;
  player.dilation.rebuyables[2] = 0;
  player.dilation.rebuyables[3] = 0;
  player.dilation.baseFreeGalaxies = 0;
  player.dilation.freeGalaxies = 0;
};

// We want to give a large degree of options
// when making a special glyph, so no max-params
// eslint-disable-next-line max-params
dev.giveSpecialGlyph = function(color, symbol, level, rawLevel = level) {
  if (!specialGlyphSymbols.hasOwnProperty(symbol)) return;
  if (!Player.hasFreeInventorySpace) return;
  const glyph = GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel });
  glyph.symbol = symbol;
  glyph.color = color;
  Glyphs.addToInventory(glyph);
};

dev.giveMusicGlyph = function() {
  const highestLevel = player.reality.glyphs.active
    .concat(player.reality.glyphs.inventory)
    .map(glyph => glyph.level)
    .max();
  dev.giveSpecialGlyph("#FF80AB", "key266b", Math.floor(0.8 * highestLevel), 1);
};

dev.giveGlyph = function(level, rawLevel = level) {
  if (!Player.hasFreeInventorySpace) return;
  Glyphs.addToInventory(GlyphGenerator.randomGlyph({ actualLevel: level, rawLevel }));
};

dev.giveRealityGlyph = function(level, rawLevel = level) {
  if (!Player.hasFreeInventorySpace) return;
  Glyphs.addToInventory(GlyphGenerator.realityGlyph({ actualLevel: level, rawLevel }, []));
};

dev.decriminalize = function() {
  player.secretAchievements.delete(23);
  EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
};

dev.removeAch = function(name) {
  if (typeof (name) === "number") return player.achievements.delete(name);
  if (name.startsWith("r")) return player.achievements.delete(parseInt(name.slice(1), 10));
  if (name.startsWith("s")) return player.achievements.delete(parseInt(name.slice(1), 10));
  return "failed to delete achievement";
};

dev.realize = function() {
    document.getElementById("container").style.animation = "realize 10s 1";
    document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
    setTimeout(() => {
        document.getElementById("realityanimbg").play();
        document.getElementById("realityanimbg").currentTime = 0;
        document.getElementById("realityanimbg").play();
    }, 2000);
    setTimeout(() => {
        document.getElementById("container").style.animation = "";
        document.getElementById("realityanimbg").style.animation = "";
    }, 10000);
};

dev.respecPerks = function() {
    player.reality.pp += player.reality.perks.size;
    player.reality.perks = new Set();
    GameCache.achSkipPerkCount.invalidate();
    GameCache.buyablePerks.invalidate();
};

function isDevEnvironment() {
  const href = window.location.href;
  return href.split("//")[1].length > 20 || isLocalEnvironment();
}

function isLocalEnvironment() {
  const href = window.location.href;
  return href.includes("file") || href.includes("127.0.0.1") || href.includes("localhost");
}

// Still WIP (appears to be slightly broken on "endgame" saves)
dev.showProductionBreakdown = function() {
  let NDComponent = new Decimal(1);
  GameCache.normalDimensionCommonMultiplier.invalidate();
  for (let i = 1; i <= 8; i++) {
    NDComponent = NDComponent.times(getDimensionFinalMultiplier(i));
  }
  const tickspeed = Tickspeed.current;
  const tickComponent = tickspeed.reciprocal().pow(8);
  const NDPercent = 100 * NDComponent.log10() / (NDComponent.log10() + tickComponent.log10());
  const tickPercent = 100 - NDPercent;

  const totalTickspeedUpgrades = tickspeed.reciprocal().log10() / getTickSpeedMultiplier().reciprocal().log10();
  const freeTickPercent = 100 * player.totalTickGained / totalTickspeedUpgrades;
  const purchasedTickPercent = 100 - freeTickPercent;

  const powerpow = getAdjustedGlyphEffect("powerpow");
  const infinitypow = getAdjustedGlyphEffect("infinitypow");
  const timepow = getAdjustedGlyphEffect("timepow");

  // Assumes >= 3 galaxies
  const effectiveGalaxyCount = Decimal.log(getTickSpeedMultiplier().divide(0.8), 0.965) + 2;
  const AGCount = player.galaxies;
  let RGCount = player.replicanti.galaxies;
  RGCount += Effects.sum(
    TimeStudy(133),
    TimeStudy(132),
    TimeStudy(225),
    TimeStudy(226)
  );
  RGCount += Math.min(player.replicanti.galaxies, player.replicanti.gal) *
    Math.max(Math.pow(Math.log10(player.infinityPower.plus(1).log10() + 1), 0.03 *
    EternityChallenge(8).completions) - 1, 0);
  const FGCount = player.dilation.freeGalaxies;
  const totalCount = AGCount + RGCount + FGCount;

  IC4pow = InfinityChallenge(4).isCompleted ? 1.05 : 1;
  const IDComponent = player.infinityPower.pow(getInfinityConversionRate()).pow(8).pow(IC4pow);
  const DBComponent = DimBoost.power.pow(DimBoost.totalBoosts).pow(8).pow(IC4pow);
  let buyTenComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    buyTenComponent = buyTenComponent.times(new Decimal(getBuyTenMultiplier()).pow(NormalDimension(i).bought / 10));
  }
  buyTenComponent = buyTenComponent.pow(IC4pow);
  let sacrificeComponent = new Decimal(1);
  if (player.timestudy.studies.includes(71))
    sacrificeComponent = sacrificeComponent
      .times(Sacrifice.totalBoost.pow(0.25).min("1e210000")).pow(7);
  if (player.timestudy.studies.includes(234))
    sacrificeComponent = sacrificeComponent
      .times(Sacrifice.totalBoost);
  if (player.timestudy.studies.includes(214))
    sacrificeComponent = sacrificeComponent
      .times((Sacrifice.totalBoost.pow(8)).min("1e46000")
      .times(Sacrifice.totalBoost.pow(1.1).min(new Decimal("1e125000"))));
  sacrificeComponent = sacrificeComponent.pow(IC4pow);
  const IC8Component = InfinityChallenge(8).reward.effectValue.pow(6).pow(IC4pow);
  const NDPowComponent = powerpow === 0 ? 0 : (powerpow - 1) / powerpow;

  let totalIDMults = new Decimal(1);
  for (let tier = 1; tier <= 8; tier++) {
    totalIDMults = totalIDMults.times(InfinityDimension(tier).multiplier);
  }
  let boughtIDComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    boughtIDComponent = boughtIDComponent.times(player[`infinityDimension${i}`].power);
  }
  const replicantiComponent = replicantiMult().pow(8);
  let TSmultToIDComponent = new Decimal(1);
  if (player.timestudy.studies.includes(72)) TSmultToIDComponent = TSmultToIDComponent
    .times(Sacrifice.totalBoost.pow(0.04).max(1).min("1e30000"));
  if (player.timestudy.studies.includes(82)) TSmultToIDComponent = TSmultToIDComponent
    .times(Decimal.pow(1.0000109, Math.pow(DimBoost.totalBoosts, 2)));
  const EU1Component = player.eternityPoints.plus(1).pow(8);
  const IDPowComponent = powerpow === 0 ? 0 : (powerpow - 1) / infinitypow;

  let totalTDMults = new Decimal(1);
  for (let tier = 1; tier <= 8; tier++) {
    totalTDMults = totalTDMults.times(TimeDimension(tier).multiplier);
  }
  let boughtTDComponent = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    boughtTDComponent = boughtTDComponent.times(TimeDimension(i).power);
  }
  let tickspeedToTDComponent = Achievement(105).isEnabled ? tickspeed.div(1000).pow(0.000005).reciprocal().pow(8) : 0;
  let TSmultToTDComponent = new Decimal(1);
  if (player.timestudy.studies.includes(11)) tickspeedToTDComponent = tickspeedToTDComponent
    .times(tickspeed
      .dividedBy(1000)
      .pow(0.005)
      .times(0.95)
      .plus(tickspeed.dividedBy(1000).pow(0.0003).times(0.05))
      .max(Decimal.fromMantissaExponent(1, 2500))
    );
  if (player.timestudy.studies.includes(73)) TSmultToTDComponent = TSmultToTDComponent
    .times(Sacrifice.totalBoost.pow(0.005).min(new Decimal("1e1300")));
  if (player.timestudy.studies.includes(221)) TSmultToTDComponent = TSmultToTDComponent
    .times(Decimal.pow(1.0025, DimBoost.totalBoosts)).pow(8);
  if (player.timestudy.studies.includes(227)) TSmultToTDComponent = TSmultToTDComponent
    .times(Math.max(Math.pow(Sacrifice.totalBoost.log10(), 10), 1));
  const TDPowComponent = timepow === 0 ? 0 : (timepow - 1) / timepow;

  const productionText =
`Tickspeed:
  ${tickPercent.toFixed(2)}% from tickspeed
  Tickspeed upgrades:
    ${purchasedTickPercent.toFixed(2)}% purchased
    ${freeTickPercent.toFixed(2)}% from TDs
    ${formatWithCommas(totalTickspeedUpgrades)} upgrades
  Galaxies:
    ${(100 * AGCount / totalCount).toFixed(2)}% Antimatter Galaxies
    ${(100 * RGCount / totalCount).toFixed(2)}% Replicanti Galaxies
    ${(100 * FGCount / totalCount).toFixed(2)}% Dilation Galaxies
    ${formatWithCommas(effectiveGalaxyCount)} effective galaxies
Dimensions:
  ${NDPercent.toFixed(2)}% from Normal Dimensions
  ${(100 * IDComponent.log10() / NDComponent.log10()).toFixed(2)}% from Infinity Dimensions
  ${(100 * DBComponent.log10() / NDComponent.log10()).toFixed(2)}% from Dimension Boosts
  ${(100 * buyTenComponent.log10() / NDComponent.log10()).toFixed(2)}% from "Buy 10"
  ${(100 * sacrificeComponent.log10() / NDComponent.log10()).toFixed(2)}% from sacrifice
  ${(100 * IC8Component.log10() / NDComponent.log10()).toFixed(2)}% from IC8
  ${(100 * NDPowComponent).toFixed(2)}% from ND power glyphs
Infinity Dimension Multipliers:
  ${(100 * boughtIDComponent.log10() / totalIDMults.log10()).toFixed(2)}% purchased
  ${(100 * replicantiComponent.log10() / totalIDMults.log10()).toFixed(2)}% from replicanti
  ${(100 * TSmultToIDComponent.log10() / totalIDMults.log10()).toFixed(2)}% from time studies
  ${(100 * EU1Component.log10() / totalIDMults.log10()).toFixed(2)}% from EU1
  ${(100 * IDPowComponent).toFixed(2)}% from ID power glyphs
Time Dimension Multipliers:
  ${(100 * boughtTDComponent.log10() / totalTDMults.log10()).toFixed(2)}% purchased
  ${(100 * tickspeedToTDComponent.log10() / totalTDMults.log10()).toFixed(2)}% from tickspeed
  ${(player.dilation.upgrades.has(5)
          ? 10 * replicantiComponent.log10() / totalTDMults.log10()
          : 0).toFixed(2)}% from replicanti
  ${(100 * TSmultToTDComponent.log10() / totalTDMults.log10()).toFixed(2)}% from other time studies
  ${(100 * TDPowComponent).toFixed(2)}% from TD power glyphs`;

  console.log(productionText);
};

let tempSpeedupToggle = false;
let tempSpeedupFactor = 500;
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

let tempAmplifyToggle = false;
let tempAmplifyFactor = 100;
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
  const toVisit = [Perk.glyphChoice3];
  while (toVisit.length > 0) {
    if (player.reality.pp < 1) break;
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
  console.log(`Antimatter: e${player.antimatter.exponent.toPrecision(3)}`);
  console.log(`RM: e${Math.round(gainedRealityMachines().log10())}`);
  console.log(`Glyph level: ${100 * Math.floor(gainedGlyphLevel().actualLevel / 100 + 0.5)}`);

  console.log(`Tickspeed: e${-Tickspeed.current.exponent.toPrecision(3)}`);
  console.log(`Gamespeed: ${Math.pow(getGameSpeedupFactor(), 1.2).toPrecision(1)}`);
  const aGalaxy = 100 * Math.floor(player.galaxies / 100 + 0.5);
  const rGalaxy = 100 * Math.floor(Replicanti.galaxies.total / 100 + 0.5);
  const dGalaxy = 100 * Math.floor(player.dilation.freeGalaxies / 100 + 0.5);
  console.log(`Galaxies: ${aGalaxy}+${rGalaxy}+${dGalaxy} (${aGalaxy + rGalaxy + dGalaxy})`);
  console.log(`Tick reduction: e${-Math.round(getTickSpeedMultiplier().log10())}`);

  let NDmults = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    NDmults = NDmults.times(getDimensionFinalMultiplier(i));
  }
  console.log(`ND mults: e${NDmults.log10().toPrecision(3)}`);
  let IDmults = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    IDmults = IDmults.times(InfinityDimension(i).multiplier);
  }
  console.log(`ID mults: e${IDmults.log10().toPrecision(3)}`);
  let TDmults = new Decimal(1);
  for (let i = 1; i <= 8; i++) {
    TDmults = TDmults.times(TimeDimension(i).multiplier);
  }
  console.log(`TD mults: e${TDmults.log10().toPrecision(3)}`);
  console.log(`Free tickspeed: ${formatWithCommas(1000 * Math.floor(player.totalTickGained / 1000 + 0.5))}`);

  console.log(`Infinities: e${Math.round(player.infinitied.log10())}`);
  console.log(`Eternities: e${Math.round(player.eternities.log10())}`);
  console.log(`Replicanti: e${formatWithCommas(1e5 * Math.floor(player.replicanti.amount.log10() / 1e5 + 0.5))}`);

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

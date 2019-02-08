var currentSave = 0;
var saves = {
  0: null,
  1: null,
  2: null
};

function importAutomatorScript(script) {
  var outputString = JSON.parse(script).join("\n")
  document.getElementById("automator").value = outputString
  updateState()
}

function updateState() {
    automatorRows = $("#automator").val().toLowerCase().split("\n").filter(function(row) { return row !== "" })
  }

function onLoad() {
  if (player.totalmoney === undefined || isNaN(player.totalmoney)) {
    player.totalmoney = player.money;
  }
  if (player.thisEternity === undefined) {
    player.thisEternity = player.totalTimePlayed;
  }
  player = deepmerge.all([defaultStart, player]); // This adds all the undefined properties to the save which are in player.js
  if (isDevEnvironment()) {
    guardFromNaNValues(player);
  }
  if (player.infinitied > 0 && !Challenge(1).isCompleted) {
    Challenge(1).complete();
  }
  $("#ttautobuyer").text(player.ttbuyer ? "Automator: ON" : "Automator: OFF")
  Theme.set(player.options.theme);
  if (player.secretUnlocks.fixed === "hasbeenfixed") {
    giveAchievement("Was it even broken?");
  }

  for (let i=0; i<12; i++) {
    if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].target % 1 !== 0) {
      player.autobuyers[i].target = AutobuyerMode.BUY_SINGLE;
    }

    if (player.autobuyers[i] % 1 !== 0 && (player.autobuyers[i].bulk === undefined || isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
      player.autobuyers[i].bulk = 1;
    }
  }

  IPminpeak = new Decimal(0)
  EPminpeak = new Decimal(0)

  if (typeof player.autobuyers[9].bulk !== "number") {
      player.autobuyers[9].bulk = 1
  }

  if (player.version === undefined) { // value will need to be adjusted when update goes live
      for (var i = 0; i < player.autobuyers.length; i++) {
          if (player.autobuyers[i]%1 !== 0) player.infinityPoints = player.infinityPoints + player.autobuyers[i].cost - 1
      }
      player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      player.version = 1
  }
  if (player.version == 1) {
      if (player.dimensionMultDecrease != 10) {
          if (player.dimensionMultDecrease == 9) {
              player.dimensionMultDecrease = 10
              player.dimensionMultDecreaseCost = 1e8
              player.infinityPoints = player.infinityPoints.plus(1e8)
          }
          if (player.dimensionMultDecrease == 8) {
              player.dimensionMultDecrease = 10
              player.dimensionMultDecreaseCost = 1e8
              player.infinityPoints = player.infinityPoints.plus(2.1e9)
          }
          if (player.dimensionMultDecrease == 7) {
              player.dimensionMultDecrease = 10
              player.dimensionMultDecreaseCost = 1e8
              player.infinityPoints = player.infinityPoints.plus(4.21e10)
          }
      }
      player.version = 2
  }
  if (player.version < 5) {
    player.newsArray = []
    player.version = 5
  }

  transformSaveToDecimal();
  clearOldAchieves()

  if (player.version < 9 ) {
      player.version = 9
      let achs = []
      if (player.achievements.includes("r22")) {
          achs.push("r35")
          player.achievements.splice(player.achievements.indexOf("r22"), 1)
      }
      if (player.achievements.includes("r35")) {
          achs.push("r76")
          player.achievements.splice(player.achievements.indexOf("r35"), 1)
      }
      if (player.achievements.includes("r41")) {
          achs.push("r22")
          player.achievements.splice(player.achievements.indexOf("r41"), 1)
      }
      if (player.achievements.includes("r76")) {
          achs.push("r41")
          player.achievements.splice(player.achievements.indexOf("r76"), 1)
      }

      for (var i=0; i<achs.length;i++) player.achievements.push(achs[i])
      player.replicanti.intervalCost = player.replicanti.intervalCost.dividedBy(1e20)
  }

  if (player.version < 9.5) {
      player.version = 9.5
      if (player.timestudy.studies.includes(191)) player.timestudy.theorem += 100
  }

  if (player.version < 10) {
      player.version = 10
      if (player.timestudy.studies.includes(72)) {
          for (i=4; i<8; i++) {
              player["infinityDimension"+i].amount = player["infinityDimension"+i].amount.div(Sacrifice.totalBoost.pow(0.02))
          }
      }
  }
  //updates TD costs to harsher scaling
  if (player.version < 12) {
      player.version = 12
      for (i=1; i<5; i++) {
        if (player["timeDimension"+i].cost.gte("1e1300")) {
            player["timeDimension"+i].cost = Decimal.pow(timeDimCostMults[i]*2.2, player["timeDimension"+i].bought).times(timeDimStartCosts[i])
          }
      }
      if (player.bestEternity <= 0.01 || player.bestInfinityTime <= 0.01) giveAchievement("Less than or equal to 0.001");
  }

  // player.version is currently 12 on live, and will be 13 after the update is released
  if (player.version < 12.1) {
    player.version = 12.1
    if (player.achievements.includes("s36")) {
        player.achievements.splice(player.achievements.indexOf("s36"), 1)
    }
  }

    //last update version check, fix emoji/cancer issue, account for new handling of r85/r93 rewards, change diff value from 1/10 of a second to 1/1000 of a second
    if (player.version < 13) {
        //TODO: REMOVE THE FOLLOWING LINE BEFORE RELEASE/MERGE FROM TEST (although it won't really do anything?)
        if (isDevEnvironment()) player.options.testVersion = 27;
        player.version = 13
        if (player.achievements.includes("r85")) player.infMult = player.infMult.div(4);
        if (player.achievements.includes("r93")) player.infMult = player.infMult.div(4);
        player.realTimePlayed = player.totalTimePlayed;
        player.thisReality = player.totalTimePlayed;
        player.realTimePlayed *= 100;
        player.totalTimePlayed *= 100;
        player.thisInfinityTime*= 100;
        player.thisEternity *= 100;
        player.thisReality *= 100;
        player.thisInfinityRealTime = player.thisInfinityTime;
        player.thisEternityRealTime = player.thisEternity;
        player.thisRealityRealTime = player.thisReality;
        if (player.bestInfinityTime === 9999999999) player.bestInfinityTime = 999999999999;
        else player.bestInfinityTime *= 100;
        if (player.bestEternity === 9999999999) player.bestEternity = 999999999999;
        else player.bestEternity *= 100;
        for (var i=0; i<10; i++) {
            player.lastTenEternities[i][0] *= 100;
            player.lastTenRuns[i][0] *= 100;
            player.lastTenEternities[i][2] = player.lastTenEternities[i][0];
            player.lastTenRuns[i][2] = player.lastTenRuns[i][0];
        }
        for (var i=0; i<11; i++) {
            setChallengeTime(i, player.challengeTimes[i] * 100);
        }
        for (var i=0; i<8; i++) {
            setInfChallengeTime(i, player.infchallengeTimes[i] * 100);
        }
        convertAutobuyerMode();
        unfuckChallengeIds();
        unfuckMultCosts();
    }

  //TODO: REMOVE THE FOLLOWING LINE BEFORE RELEASE/MERGE FROM TEST (although it won't really do anything?)
  if (player.version === 13) dev.updateTestSave()

  if (player.options.newsHidden) {
    document.getElementById("game").style.display = "none";
  }

	initializeWormhole();
  recalculateAllGlyphs();

  Autobuyer.tryUnlockAny();
  Autobuyer.checkAllAchievements();
  transformSaveToDecimal();
  updateAchievementPower();
  resizeCanvas();
  checkForEndMe();
  generateGlyphTable();
  updateRealityUpgrades();
  updateWormholeUpgrades()
  updateAutomatorRows()
  checkPerkValidity()
  GameCache.buyablePerks.invalidate();
  drawPerkNetwork();
  updatePerkColors()
  V.updateTotalRunUnlocks()

  const notation = player.options.notation;
  if (notation === undefined) {
    player.options.notation = "Standard";
  }
  const notationMigration = {
    "Mixed": "Mixed scientific",
    "Default": "Brackets",
    "Emojis": "Cancer"
  };
  if (notationMigration[notation] !== undefined) {
    player.options.notation = notationMigration[notation];
  }
  Notation.find(player.options.notation).setCurrent();

  $(".wormhole-upgrades").hide()
  if (player.wormhole[0].unlocked) {
    $("#wormholeunlock").hide()
    $("#wormholecontainer").show()
    $("#whupg1").show()
  }
  if (player.wormhole[1].unlocked) $("#whupg2").show()
  if (player.wormhole[2].unlocked) $("#whupg3").show()
  
  $("#pp").text("You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s."))
  if (player.reality.respec) {
    $("#glyphRespec").addClass("rUpgBought")
    document.getElementById("glyphRespec").setAttribute('ach-tooltip', "Respec is active and will place your currently-equipped glyphs into your inventory after reality.");
  }
  else
	  document.getElementById("glyphRespec").setAttribute('ach-tooltip', "Your currently-equipped glyphs will stay equipped on reality.");
    
  if (localStorage.getItem("automatorScript1") !== null) importAutomatorScript(localStorage.getItem("automatorScript1"));
  automatorOn = player.reality.automatorOn;
  if (automatorOn) $("#automatorOn")[0].checked = true
  automatorIdx = player.reality.automatorCurrentRow;

  GameCache.invalidate();

  let diff = new Date().getTime() - player.lastUpdate
  if (diff > 1000*1000) {
      simulateTime(diff/1000)
  }

  // Annoyingly, this has to be done after simulating time, since otherwise the graphics won't show the wormhole in the correct phase.
  for (let i = 0; i < player.wormhole.length; i++) {
    updateWormholeStatusText(i);
  }
  updateWormholeGraphics();
}

function convertAutobuyerMode() {
  for (let i = 1; i <= 8; i++) {
    const autobuyer = Autobuyer.dim(i);
    if (!autobuyer.isUnlocked) continue;
    if (autobuyer.mode < 10) {
      autobuyer.mode = AutobuyerMode.BUY_SINGLE;
    }
    else {
      autobuyer.mode = AutobuyerMode.BUY_10;
    }
  }
  const tickspeedAutobuyer = Autobuyer.tickspeed;
  if (tickspeedAutobuyer.isUnlocked) {
    if (tickspeedAutobuyer.mode < 10) {
      tickspeedAutobuyer.mode = AutobuyerMode.BUY_SINGLE;
    }
    else {
      tickspeedAutobuyer.mode = AutobuyerMode.BUY_MAX;
    }
  }
}

function unfuckChallengeIds() {
  function unfuckChallengeId(id) {
    if (!id.startsWith("challenge")) return id;
    const legacyId = parseInt(id.substr(9));
    const config = GameDatabase.challenges.normal.find(c => c.legacyId === legacyId);
    return Challenge(config.id).fullId;
  }

  player.currentChallenge = unfuckChallengeId(player.currentChallenge);
  player.challenges = player.challenges.map(unfuckChallengeId);
}

function unfuckMultCosts() {
  if (player.tickSpeedMultDecreaseCost !== undefined) {
    player.infinityRebuyables[0] = Math.round(Math.log(player.tickSpeedMultDecreaseCost / 3e6) / Math.log(5));
  }
  if (player.dimensionMultDecreaseCost !== undefined) {
    player.infinityRebuyables[1] = Math.round(Math.log(player.dimensionMultDecreaseCost / 1e8) / Math.log(5e3));
  }
  delete player.tickSpeedMultDecrease;
  delete player.tickSpeedMultDecreaseCost;
  delete player.dimensionMultDecrease;
  delete player.dimensionMultDecreaseCost;
}

function checkPerkValidity() {
  if (player.reality.perks.every(id => Perk.find(id) !== undefined)) return;
  dev.respecPerks();
  Modal.message.show("Your old Reality perks were invalid, your perks have been reset and your perk points refunded.");
}

function load_cloud_save(saveId, cloudPlayer) {
  saves[saveId] = cloudPlayer;

  if (isDevEnvironment()) set_save('dimensionTestSave', saveId, cloudPlayer);
  else set_save('dimensionSave', saveId, cloudPlayer);

  if (currentSave == saveId) {
    load_game();
    transformSaveToDecimal();
  }
}

function load_game(root) {
  if (!root) {
    if (isDevEnvironment()) var root = get_save('dimensionTestSave');
    else var root = get_save('dimensionSave');
  }

  // Start: Migration for old save format
  if (root && !root.saves) {
    var _root = getRootSaveObject();
    _root.saves[currentSave] = root;
    root = _root;

    player = root.saves[currentSave];
    save_game();
  }
  // End: Migration

  // If there's no save, insert default root object
  if (!root) root = getRootSaveObject();

  currentSave = root.current;
  saves = root.saves;

  if (saves[currentSave]) player = saves[currentSave];
  onLoad();
}


function save_game(changed, silent) {
  if ( possibleGlyphs.length > 0 ) return
  if (isDevEnvironment()) set_save('dimensionTestSave', currentSave, player);
  else set_save('dimensionSave', currentSave, player);
  if (!silent) GameUI.notify.info(changed ? "Game loaded" : "Game saved");
}

function change_save(saveId) {
  // Save previous save to make sure no changes are lost
  save_game(false, true);
  currentSave = saveId;
  saved = 0;
  postc8Mult = new Decimal(0)
  mult18 = new Decimal(1)
  IPminpeak = new Decimal(0)
  EPminpeak = new Decimal(0)
  player = saves[saveId] || defaultStart;
  save_game(true, false);
  load_game();
  transformSaveToDecimal()
  Tab.dimensions.normal.show();
  Modal.hide();
}

function transformSaveToDecimal() {
  if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autobuyers[11].priority !== "undefined")player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority)
  for (let i = 0; i < player.reality.glyphs.active.length; i++) {
    let glyph = player.reality.glyphs.active[i]
    if (glyph.type == "power" && glyph.effects.mult !== undefined) {
      glyph.effects.mult = new Decimal(glyph.effects.mult)
    }
  }

  for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
    let glyph = player.reality.glyphs.inventory[i]
    if (glyph.type == "power" && glyph.effects.mult !== undefined) {
      glyph.effects.mult = new Decimal(glyph.effects.mult)
    }
  }
}

function set_save(name, saveId, value) {
	saves[saveId] = value;
    localStorage.setItem(name, btoa(JSON.stringify(getRootSaveObject(), function(k, v) { return (v === Infinity) ? "Infinity" : v; })));
}

function get_save(name) {
  try {
    return JSON.parse(atob(localStorage.getItem(name)), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
  } catch(e) { console.log("Fuck IE", e); }
}

function getRootSaveObject() {
  return {
    current: currentSave,
    saves: saves
  };
}
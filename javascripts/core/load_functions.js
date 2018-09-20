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
  if (player.totalmoney === undefined || isNaN(player.totalmoney)) player.totalmoney = player.money;
  if (player.options === undefined) {
      player.options = {
          scientific: false,
          animationOn: true
      }
  }
  if (player.options.invert === true) Theme.set("Inverted"); player.options.invert = undefined;
  if (player.options.newsHidden === undefined) player.options.newsHidden = false;
  if (player.options.sacrificeConfirmation === undefined) player.options.sacrificeConfirmation = true;
  if (player.options.retryChallenge === undefined) player.options.retryChallenge = false;
  if (player.options.bulkOn === undefined) player.options.bulkOn = true
  if (player.options.cloud === undefined) player.options.cloud = true
  if (player.options.hotkeys === undefined) player.options.hotkeys = true
  if (player.options.themes === undefined) player.options.themes = "Normal"
  if (player.options.secretThemeKey === undefined) player.options.secretThemeKey = 0
  if (player.achievements === undefined) player.achievements = [];
  if (player.sacrificed === undefined) player.sacrificed = new Decimal(0);
  if (player.infinityUpgrades === undefined) player.infinityUpgrades = [];
  if (player.infinityPoints === undefined) player.infinityPoints = new Decimal(0);
  if (player.infinitied === undefined) player.infinitied = 0;
  if (player.totalTimePlayed === undefined) player.totalTimePlayed = 0;
  if (player.bestInfinityTime === undefined) player.bestInfinityTime = 9999999999;
  if (player.thisInfinityTime === undefined) player.thisInfinityTime = 9999999999;
  if (player.galaxies === undefined) player.galaxies = 0;
  if (player.lastUpdate === undefined) player.lastUpdate = new Date().getTime();
  if (player.achPow === undefined) player.achPow = 1;
  if (player.newsArray === undefined) player.newsArray = [];
  if (player.chall2Pow === undefined) player.chall2Pow = 1;
  if (player.chall3Pow === undefined) player.chall3Pow = 0.01;
  if (player.firstAmount !== 0) document.getElementById("secondRow").style.display = "table-row";
  if (player.challenges === undefined) player.challenges = []
  if (player.currentChallenge === undefined) player.currentChallenge = ""
  if (player.infinitied > 0 && !player.challenges.includes("challenge1")) player.challenges.push("challenge1")
  if (player.matter === undefined) player.matter = new Decimal(0)
  if (player.autobuyers === undefined) player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  if (player.costMultipliers === undefined) player.costMultipliers = [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
  if (player.tickspeedMultiplier === undefined) player.tickspeedMultiplier = new Decimal(10)
  if (player.partInfinityPoint === undefined) player.partInfinityPoint = 0
  if (player.challengeTimes === undefined) player.challengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
  if (player.infchallengeTimes === undefined) player.infchallengeTimes = [600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31, 600*60*24*31]
  if (player.lastTenRuns === undefined) player.lastTenRuns = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
  if (player.infMult === undefined) player.infMult = new Decimal(1)
  if (player.infMultCost === undefined) player.infMultCost = new Decimal(100)
  if (player.tickSpeedMultDecrease === undefined) player.tickSpeedMultDecrease = 10
  if (player.tickSpeedMultDecreaseCost === undefined) player.tickSpeedMultDecreaseCost = 3e6
  if (player.dimensionMultDecrease === undefined) player.dimensionMultDecrease = 10
  if (player.dimensionMultDecreaseCost === undefined) player.dimensionMultDecreaseCost = 1e8
  if (player.overXGalaxies === undefined) player.overXGalaxies = 10;
  if (player.partInfinitied === undefined) player.partInfinitied = 0
  if (player.spreadingCancer === undefined) player.spreadingCancer = 0
  if (player.postC4Tier === undefined) player.postC4Tier = 0
  if (player.postC3Reward === undefined) player.postC3Reward = new Decimal(1)
  if (player.offlineProd === undefined) player.offlineProd = 0
  if (player.offlineProdCost === undefined) player.offlineProdCost = 1e7
  if (player.autoSacrifice === undefined) player.autoSacrifice = 1
  if (player.postChallUnlocked === undefined) player.postChallUnlocked = 0
  if (player.infMultBuyer === undefined) player.infMultBuyer = false
  if (player.autoCrunchMode === undefined) player.autoCrunchMode = "amount"
  if (player.challengeTarget === undefined) {
      player.challengeTarget = 0
      if (player.currentChallenge != "") player.challengeTarget = Number.MAX_VALUE
  }
  if (player.lastTenEternities === undefined) player.lastTenEternities = [[600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1], [600*60*24*31, 1]]
  if (player.respec === undefined) player.respec = false
  if (player.options.commas === undefined) player.options.commas = true
  if (player.eternityChalls === undefined) player.eternityChalls = {}
  if (player.eternityChallGoal === undefined) player.eternityChallGoal = new Decimal(Number.MAX_VALUE)
  if (player.currentEternityChall === undefined) player.currentEternityChall = ""
  if (player.eternityChallUnlocked === undefined) player.eternityChallUnlocked = 0
  if (player.options.chart === undefined) player.options.chart = {}
  if (player.options.chart.updateRate === undefined) player.options.chart.updateRate = 1000
  if (player.options.chart.duration === undefined) player.options.chart.duration = 10
  if (player.options.chart.warning === undefined) player.options.chart.warning = 0
  if (player.options.chart.on === undefined) player.options.chart.on = false
  if (player.options.chart.dips === undefined) player.options.chart.dips = true
  if (player.etercreq === undefined) player.etercreq = 0
  if (player.options.updateRate === undefined) player.options.updateRate = 50
  if (player.eterc8ids === undefined) player.eterc8ids = 50
  if (player.eterc8repl === undefined) player.eterc8repl = 40
  if (player.infinitiedBank === undefined) player.infinitiedBank = 0
  if (player.dimlife === undefined) player.dimlife = false
  if (player.dead === undefined) player.dead = false
  if (player.dilation === undefined) player.dilation = {}
  if (player.dilation.studies === undefined) player.dilation.studies = []
  if (player.dilation.active === undefined) player.dilation.active = false
  if (player.dilation.tachyonParticles === undefined) player.dilation.tachyonParticles = new Decimal(0)
  if (player.dilation.dilatedTime === undefined) player.dilation.dilatedTime = new Decimal(0)
  if (player.dilation.totalTachyonParticles === undefined) player.dilation.totalTachyonParticles = new Decimal(0)
  if (player.dilation.nextThreshold === undefined) player.dilation.nextThreshold = new Decimal(1000)
  if (player.dilation.freeGalaxies === undefined) player.dilation.freeGalaxies = 0
  if (player.dilation.upgrades === undefined) player.dilation.upgrades = []
  if (player.dilation.rebuyables === undefined) player.dilation.rebuyables =  { 1: 0, 2: 0, 3: 0 }
  if (player.timeDimension5 === undefined) player.timeDimension5 = {cost: new Decimal("1e2350"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension6 === undefined) player.timeDimension6 = {cost: new Decimal("1e2650"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension7 === undefined) player.timeDimension7 = {cost: new Decimal("1e3000"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.timeDimension8 === undefined) player.timeDimension8 = {cost: new Decimal("1e3350"), amount: new Decimal(0), power: new Decimal(1), bought: 0 }
  if (player.why === undefined) player.why = 0
  if (player.options.animations === undefined) player.options.animations = {floatingText: true, bigCrunch: true, eternity: true, tachyonParticles: true}
  if (player.options.animations.reality === undefined) player.options.animations.reality = true;
  if (player.options.confirmations === undefined) player.options.confirmations = {challenges: player.options.challConf, eternity: player.options.eternityconfirm, dilation: true, reality: true};
  if (player.secretUnlocks === undefined) player.secretUnlocks = {painTimer: 0, why: player.why, fixed: "notyetfixed", dragging: 0, themes: []};
  if (player.realTimePlayed === undefined) player.realTimePlayed = player.totalTimePlayed;
  if (player.realities === undefined) player.realities = 0;
  if (player.thisReality === undefined) player.thisReality = player.totalTimePlayed;
  if (player.bestReality === undefined) player.bestReality = 999999999999;
  if (player.lastTenRealities === undefined) player.lastTenRealities = [[60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0], [60000*60*24*31, new Decimal(1), 0]];
  if (player.wormhole === undefined) player.wormhole = { speed: 60 * 60, power: 180, duration: 10, phase: 0, active: false, unlocked: false }
  if (player.reality === undefined) {
    player.reality = { 
      realityMachines: new Decimal(0), 
      glyphs: {
        active: [], 
        inventory: [], 
        slots: 3, 
        last: ""
      },
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0
      },
      seed: Math.floor(Date.now() * Math.random()+1), 
      rebuyables: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0,}, 
      upg: [], 
      upgReqs: [null, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false], 
      upgReqChecks: [false], 
      automatorRows: 0, 
      automatorCommands: [], 
      perks: [],
      respec: false,
      tdbuyer: {
        on: false,
        threshhold: 1
      },
      epmultbuyer: {
        on: false,
        threshhold: 1
      },
      pp: 0
    };
  }
  
  if (player.autoEternityMode === undefined) player.autoEternityMode = "amount";
  Theme.set(player.options.theme);

  if (player.secretUnlocks.fixed === "hasbeenfixed") {
    giveAchievement("Was it even broken?")
  }

  if (player.secondAmount !== 0) {
      document.getElementById("thirdRow").style.display = "table-row";
      document.getElementById("tickSpeed").style.visibility = "visible";
      document.getElementById("tickSpeedMax").style.visibility = "visible";
      document.getElementById("tickLabel").style.visibility = "visible";
      document.getElementById("tickSpeedAmount").style.visibility = "visible";
  }

  if (player.infinityPower === undefined) {
      player.infinityPower = new Decimal(1)
      player.infinityDimension1 = {
          cost: new Decimal(1e8),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infinityDimension2 = {
          cost: new Decimal(1e9),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infinityDimension3 = {
          cost: new Decimal(1e10),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infinityDimension4 = {
          cost: new Decimal(1e20),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infDimensionsUnlocked = [false, false, false, false]
  }

  if (player.timeShards === undefined) {
      player.timeShards = new Decimal(0)
      player.eternityPoints = new Decimal(0)
      player.tickThreshold = new Decimal(1)
      player.totalTickGained = 0
      player.eternities = 0
      player.timeDimension1 = {
          cost: new Decimal(1),
          amount: new Decimal(0),
          power: new Decimal(1),
          bought: 0
      }
      player.timeDimension2 = {
          cost: new Decimal(5),
          amount: new Decimal(0),
          power: new Decimal(1),
          bought: 0
      }
      player.timeDimension3 = {
          cost: new Decimal(100),
          amount: new Decimal(0),
          power: new Decimal(1),
          bought: 0
      }
      player.timeDimension4 = {
          cost: new Decimal(1000),
          amount: new Decimal(0),
          power: new Decimal(1),
          bought: 0
      }
  }

  if (player.infinityDimension1.baseAmount === undefined) {
      player.infinityDimension1.baseAmount = 0;
      player.infinityDimension2.baseAmount = 0;
      player.infinityDimension3.baseAmount = 0;
      player.infinityDimension4.baseAmount = 0;

      player.infinityDimension1.baseAmount = new Decimal(player.infinityDimension1.power).log(50).times(10).toNumber()
      player.infinityDimension2.baseAmount = new Decimal(player.infinityDimension2.power).log(30).times(10).toNumber()
      player.infinityDimension3.baseAmount = new Decimal(player.infinityDimension3.power).log(10).times(10).toNumber()
      player.infinityDimension4.baseAmount = new Decimal(player.infinityDimension4.power).log(5).times(10).toNumber()


  }
  if (player.autoIP === undefined) player.autoIP = new Decimal(0)
  if (player.autoTime === undefined) player.autoTime = 1e300;

  if (player.matter === null) player.matter = new Decimal(0)
  for (var i=0; i<12; i++) {
      if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].tier === undefined) {
          player.autobuyers[i].tier = i+1
      }
      if (player.autobuyers[i]%1 !== 0 && player.autobuyers[i].target%1 !== 0) {
          player.autobuyers[i].target = i+1
          if (i == 8) player.autobuyers[i].target = 1
      }

      if (player.autobuyers[i]%1 !== 0 && (player.autobuyers[i].bulk === undefined || isNaN(player.autobuyers[i].bulk) || player.autobuyers[i].bulk === null)) {
          player.autobuyers[i].bulk = 1
      }
  }
  if (player.autobuyers[8].tier == 10) player.autobuyers[8].tier = 9

  if (player.thirdAmount !== 0 || player.eternities >= 30) document.getElementById("fourthRow").style.display = "table-row";
  if (player.fourthAmount !== 0|| player.eternities >= 30)
  if (player.resets > 0) document.getElementById("fifthRow").style.display = "table-row";
  if (player.fifthAmount !== 0|| player.eternities >= 30)
  if (player.resets > 1) document.getElementById("sixthRow").style.display = "table-row";
  if (player.sixthAmount !== 0|| player.eternities >= 30)
  if (player.resets > 2 && player.currentChallenge !== "challenge4" && player.currentChallenge !== "postc1") document.getElementById("seventhRow").style.display = "table-row";
  if (player.seventhAmount !== 0|| player.eternities >= 30)
  if (player.resets > 3 && player.currentChallenge !== "challenge4") document.getElementById("eightRow").style.display = "table-row";

  document.getElementById("totaltickgained").textContent = "You've gained "+shortenDimensions(player.totalTickGained)+" tickspeed upgrades."

  var IPminpeak = new Decimal(0)
  var EPminpeak = new Decimal(0)

  if (typeof player.autobuyers[9].bulk !== "number") {
      player.autobuyers[9].bulk = 1
  }

  if (player.options.sacrificeConfirmation == false) document.getElementById("confirmation").checked = "true"
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

  if (player.infinityDimension5 === undefined) {
      player.infDimensionsUnlocked.push(false)
      player.infDimensionsUnlocked.push(false)
      player.infinityDimension5 = {
          cost: new Decimal(1e140),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infinityDimension6 = {
          cost: new Decimal(1e200),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.version = 6
  }

  if (player.infinityDimension7 == undefined) {
      player.infDimensionsUnlocked.push(false)
      player.infDimensionsUnlocked.push(false)
      player.infinityDimension7 = {
          cost: new Decimal(1e250),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
      player.infinityDimension8 = {
          cost: new Decimal(1e280),
          amount: new Decimal(0),
          bought: 0,
          power: new Decimal(1),
          baseAmount: 0
      }
  }

  if (player.replicanti === undefined) {
      player.replicanti = {
          amount: new Decimal(0),
          unl: false,
          chance: 0.01,
          chanceCost: new Decimal(1e150),
          interval: 1000,
          intervalCost: new Decimal(1e140),
          gal: 0,
          galaxies: 0,
          galCost: new Decimal(1e170)
      }
  }
  if (player.bestEternity === undefined) {
      player.bestEternity = 9999999999
      player.thisEternity = player.totalTimePlayed
  }
  if (player.timestudy === undefined) {
      player.timestudy = {
          theorem: 0,
          amcost: new Decimal("1e20000"),
          ipcost: new Decimal(1),
          epcost: new Decimal(1),
          studies: [],
      }
  }



  if (player.eternities == 0) {
      document.getElementById("eternityPoints2").style.display = "none";
      document.getElementById("eternitystorebtn").style.display = "none";
      document.getElementById("tdtabbtn").style.display = "none";
  }

  if (player.eternityUpgrades === undefined) player.eternityUpgrades = []

  if (player.infDimBuyers === undefined) player.infDimBuyers = [false, false, false, false, false, false, false, false]

  if (player.replicanti.auto === undefined) player.replicanti.auto = [false, false, false]
  if (player.eternityBuyer === undefined) {
      player.eternityBuyer = {
          limit: new Decimal(0),
          isOn: false
      }
  }

  transformSaveToDecimal();
  updateCosts();
  updateTickSpeed();
  updateAchievements();
  updateChallenges();
  toggleBulk()
  toggleBulk()
  respecToggle()
  respecToggle()
  if (!player.replicanti.auto[0]) document.getElementById("replauto1").textContent = "Auto: OFF"
  else document.getElementById("replauto1").textContent = "Auto: ON"
  if (!player.replicanti.auto[1]) document.getElementById("replauto2").textContent = "Auto: OFF"
  else document.getElementById("replauto2").textContent = "Auto: ON"
  if (!player.replicanti.auto[2]) document.getElementById("replauto3").textContent = "Auto: OFF"
  else document.getElementById("replauto3").textContent = "Auto: ON"

  updateLastTenRuns()
  updateLastTenEternities()
  updateLastTenRealities()

  updateInfCosts()


  if (player.replicanti.unl == true) {
      document.getElementById("replicantidiv").style.display="inline-block"
      document.getElementById("replicantiunlock").style.display="none"
  } else {
      document.getElementById("replicantidiv").style.display="none"
      document.getElementById("replicantiunlock").style.display="inline-block"
  }

  if (player.currentChallenge == "challenge12" || player.currentChallenge == "challenge9" || player.currentChallenge == "challenge5" ||
      player.currentChallenge == "postc1" || player.currentChallenge == "postc4" || player.currentChallenge == "postc5" || player.currentChallenge == "postc6" || player.currentChallenge == "postc8") document.getElementById("quickReset").style.display = "inline-block";
  else document.getElementById("quickReset").style.display = "none";


  if (player.break == true) document.getElementById("break").textContent = "FIX INFINITY"
  document.getElementById("infiMult").innerHTML = "Multiply infinity points from all sources by 2 <br>currently: "+shortenDimensions(player.infMult.times(kongIPMult)) +"x<br>Cost: "+shortenCosts(player.infMultCost)+" IP"

  if (player.infinitied == 0 && player.eternities == 0) document.getElementById("infinityPoints2").style.display = "none"

  if (player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") document.getElementById("matter").style.display = "inline-block";
  else document.getElementById("matter").style.display = "none";



  if (player.replicanti.galaxybuyer !== undefined) {
      replicantiGalaxyAutoToggle()
      replicantiGalaxyAutoToggle()
  }

  if (player.eternityChallUnlocked !== 0) document.getElementById("eterc"+player.eternityChallUnlocked+"div").style.display = "inline-block"


  if (player.infMultBuyer !== undefined) {
      infMultAutoToggle()
      infMultAutoToggle()
  }

  if (player.epmult === undefined || player.epmult == 0) {
      player.epmult = new Decimal(1)
      player.epmultCost = new Decimal(500)
  }

  clearOldAchieves()

  document.getElementById("epmult").innerHTML = "You gain 5 times more EP<p>Currently: "+shortenDimensions(player.epmult)+"x<p>Cost: "+shortenDimensions(player.epmultCost)+" EP"

  for (var i=0; i<player.timestudy.studies.length; i++) {
      if (player.timestudy.studies[i] == 71 || player.timestudy.studies[i] == 81 || player.timestudy.studies[i] == 91 || player.timestudy.studies[i] == 101) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought normaldimstudy"
      } else if (player.timestudy.studies[i] == 72 || player.timestudy.studies[i] == 82 || player.timestudy.studies[i] == 92 || player.timestudy.studies[i] == 102) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought infdimstudy"
      } else if (player.timestudy.studies[i] == 73 || player.timestudy.studies[i] == 83 || player.timestudy.studies[i] == 93 || player.timestudy.studies[i] == 103) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought timedimstudy"
      } else if (player.timestudy.studies[i] == 121 || player.timestudy.studies[i] == 131 || player.timestudy.studies[i] == 141) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought activestudy"
      } else if (player.timestudy.studies[i] == 122 || player.timestudy.studies[i] == 132 || player.timestudy.studies[i] == 142) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought passivestudy"
      } else if (player.timestudy.studies[i] == 123 || player.timestudy.studies[i] == 133 || player.timestudy.studies[i] == 143) {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought idlestudy"
      } else if (player.timestudy.studies[i] == 221 || player.timestudy.studies[i] == 224 || player.timestudy.studies[i] == 225 || player.timestudy.studies[i] == 228 || player.timestudy.studies[i] == 231 || player.timestudy.studies[i] == 234) {
          document.getElementById(player.timestudy.studies[i]).className = "timestudybought darkstudy"
      } else if (player.timestudy.studies[i] == 222 || player.timestudy.studies[i] == 223 || player.timestudy.studies[i] == 226 || player.timestudy.studies[i] == 227 || player.timestudy.studies[i] == 232 || player.timestudy.studies[i] == 233) {
          document.getElementById(player.timestudy.studies[i]).className = "timestudybought lightstudy"
      } else {
          document.getElementById(""+player.timestudy.studies[i]).className = "timestudybought"
      }
  }

  for (var i=0; i<player.reality.automatorCommands.length; i++) {
    if (player.reality.automatorCommands[i] == 11 || player.reality.automatorCommands[i] == 12) {
        document.getElementById("automator"+player.reality.automatorCommands[i]).className = "automatorinstructionbought command"
    } else {
        document.getElementById("automator"+player.reality.automatorCommands[i]).className = "automatorinstructionbought target"
    }
}

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
      updateAchievements()
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
              player["infinityDimension"+i].amount = player["infinityDimension"+i].amount.div(calcTotalSacrificeBoost().pow(0.02))
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
        updateAchievements();
    }
  }

    //TODO: REMOVE THE FOLLOWING LINE BEFORE RELEASE/MERGE FROM TEST (although it won't really do anything?)
    if (player.version === 13) dev.updateTestSave()

    //last update version check, fix emoji/cancer issue, account for new handling of r85/r93 rewards, change diff value from 1/10 of a second to 1/1000 of a second
    if (player.version < 13) {
        //TODO: REMOVE THE FOLLOWING LINE BEFORE RELEASE/MERGE FROM TEST (although it won't really do anything?)
        if (window.location.href.split("//")[1].length > 20) player.options.testVersion = 1;
        player.version = 13
        if (player.achievements.includes("r85")) player.infMult = player.infMult.div(4);
        if (player.achievements.includes("r93")) player.infMult = player.infMult.div(4);
        player.realTimePlayed *= 100;
        player.totalTimePlayed *= 100;
        player.thisInfinityTime*= 100;
        player.thisEternity *= 100;
        player.thisReality *= 100;
        if (player.bestInfinityTime === 9999999999) player.bestInfinityTime = 999999999999;
        else player.bestInfinityTime *= 100;
        if (player.bestEternity === 9999999999) player.bestEternity = 999999999999;
        else player.bestEternity *= 100;
        for (var i=0; i<10; i++) {
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

  toggleCrunchMode()
  toggleCrunchMode()
  toggleCrunchMode()
  updateCheckBoxes()
  loadAutoBuyerSettings()


  if (player.options.newsHidden) {
      document.getElementById("game").style.display = "none";
  }

  document.getElementById("chartDurationInput").value = player.options.chart.duration;
  document.getElementById("chartUpdateRateInput").value = player.options.chart.updateRate;
  if (player.options.chart.on) document.getElementById("chartOnOff").checked = true
  else document.getElementById("chartOnOff").checked = false
  if (player.options.chart.dips) document.getElementById("chartDipsOnOff").checked = true
  else document.getElementById("chartDipsOnOff").checked = false

  if (player.eternities < 30) {
    document.getElementById("secondRow").style.display = "none";
    document.getElementById("thirdRow").style.display = "none";
    document.getElementById("tickSpeed").style.visibility = "hidden";
    document.getElementById("tickSpeedMax").style.visibility = "hidden";
    document.getElementById("tickLabel").style.visibility = "hidden";
    document.getElementById("tickSpeedAmount").style.visibility = "hidden";
    document.getElementById("fourthRow").style.display = "none";
    document.getElementById("fifthRow").style.display = "none";
    document.getElementById("sixthRow").style.display = "none";
    document.getElementById("seventhRow").style.display = "none";
    document.getElementById("eightRow").style.display = "none";
  }
  if (player.wormhole.unlocked) $("#wormholecontainer").show()

  updateAutobuyers();
  setAchieveTooltip();
  updatePriorities();
  updateTheoremButtons();
  updateTimeStudyButtons();
  totalMult = Math.pow(player.totalmoney.e+1, 0.5)
  currentMult = Math.pow(player.money.e+1, 0.5)
  infinitiedMult = 1+Math.log10(getInfinitied()+1)*10
  achievementMult = Math.max(Math.pow((player.achievements.length-30), 3)/40,1)
  challengeMult = Decimal.max(10*3000/worstChallengeTime, 1)
  unspentBonus = player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
  transformSaveToDecimal();
  updateChallengeTimes();
  updateMilestones();
  updateEternityUpgrades();
  loadInfAutoBuyers();
  resizeCanvas();
  checkForEndMe();
  updateEternityChallenges();
  updateDilationUpgradeCosts();
  generateGlyphTable();
  updateRealityUpgrades();
  updateAutomatorTree();
  updateWormholeUpgrades()
  updateAutomatorRows()
  drawPerkNetwork()
  Notation.set(player.options.notation);

  if (player.wormhole.unlocked) $("#wormholeunlock").hide()
  else $(".wormhole-upgrades").hide()
  
  $("#pp").text("You have " + player.reality.pp + " Perk Points.")

  if (player.reality.respec) $("#glyphRespec").addClass("rUpgBought")
  if (localStorage.getItem("automatorScript1") !== null) importAutomatorScript(localStorage.getItem("automatorScript1"));
  let diff = new Date().getTime() - player.lastUpdate
  if (diff > 1000*1000) {
      simulateTime(diff/1000)
  }
}

function load_cloud_save(saveId, cloudPlayer) {
  saves[saveId] = cloudPlayer;

  if (window.location.href.split("//")[1].length > 20) set_save('dimensionTestSave', saveId, cloudPlayer);
  else set_save('dimensionSave', saveId, cloudPlayer);

  if (currentSave == saveId) {
    load_game();
    updateChallenges();
    transformSaveToDecimal();
  }
}

function load_game(root) {
  if (!root) {
    if (window.location.href.split("//")[1].length > 20) var root = get_save('dimensionTestSave');
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
    updateVue();
}


function save_game(changed, silent) {
  if ( possibleGlyphs.length > 0 ) return
  if (window.location.href.split("//")[1].length > 20) set_save('dimensionTestSave', currentSave, player);
  else set_save('dimensionSave', currentSave, player);
  if (!silent) $.notify(changed ? "Game loaded" : "Game saved", "info")
}

function change_save(saveId) {
  // Save previous save to make sure no changes are lost
  save_game(false, true);

  currentSave = saveId;

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
  IPminpeak = new Decimal(0)
  EPminpeak = new Decimal(0)
  player = saves[saveId] || defaultStart;
  save_game(true, false);
  load_game();
  updateChallenges()
  transformSaveToDecimal()
  showDimTab('antimatterdimensions', true)
  showChallengesTab('challenges')
  showEternityTab('timestudies', true)
  Modal.hide();
}

function transformSaveToDecimal() {

  player.infinityPoints = new Decimal(player.infinityPoints)
  document.getElementById("eternitybtn").style.display = (player.infinityPoints.gte(Number.MAX_VALUE) || player.eternities > 0) ? "inline-block" : "none"

  player.money = new Decimal(player.money)
  player.tickSpeedCost = new Decimal(player.tickSpeedCost)
  player.tickspeed = new Decimal(player.tickspeed)
  player.firstCost = new Decimal(player.firstCost)
  player.secondCost = new Decimal(player.secondCost)
  player.thirdCost = new Decimal(player.thirdCost)
  player.fourthCost = new Decimal(player.fourthCost)
  player.fifthCost = new Decimal(player.fifthCost)
  player.sixthCost = new Decimal(player.sixthCost)
  player.seventhCost = new Decimal(player.seventhCost)
  player.eightCost = new Decimal(player.eightCost)
  player.firstAmount = new Decimal(player.firstAmount)
  player.secondAmount = new Decimal(player.secondAmount)
  player.thirdAmount = new Decimal(player.thirdAmount)
  player.fourthAmount = new Decimal(player.fourthAmount)
  player.fifthAmount = new Decimal(player.fifthAmount)
  player.sixthAmount = new Decimal(player.sixthAmount)
  player.seventhAmount = new Decimal(player.seventhAmount)
  player.eightAmount = new Decimal(player.eightAmount)
  player.firstPow = new Decimal(player.firstPow)
  player.secondPow = new Decimal(player.secondPow)
  player.thirdPow = new Decimal(player.thirdPow)
  player.fourthPow = new Decimal(player.fourthPow)
  player.fifthPow = new Decimal(player.fifthPow)
  player.sixthPow = new Decimal(player.sixthPow)
  player.seventhPow = new Decimal(player.seventhPow)
  player.eightPow = new Decimal(player.eightPow)
  player.sacrificed = new Decimal(player.sacrificed)
  player.totalmoney = new Decimal(player.totalmoney)
  player.chall3Pow = new Decimal(player.chall3Pow)
  player.chall11Pow = new Decimal(player.chall11Pow)
  player.costMultipliers = [new Decimal(player.costMultipliers[0]), new Decimal(player.costMultipliers[1]), new Decimal(player.costMultipliers[2]), new Decimal(player.costMultipliers[3]), new Decimal(player.costMultipliers[4]), new Decimal(player.costMultipliers[5]), new Decimal(player.costMultipliers[6]), new Decimal(player.costMultipliers[7])]
  player.tickspeedMultiplier = new Decimal(player.tickspeedMultiplier)
  player.matter = new Decimal(player.matter)
  player.infinityPower = new Decimal(player.infinityPower)
  player.infinityDimension1.amount = new Decimal(player.infinityDimension1.amount)
  player.infinityDimension2.amount = new Decimal(player.infinityDimension2.amount)
  player.infinityDimension3.amount = new Decimal(player.infinityDimension3.amount)
  player.infinityDimension4.amount = new Decimal(player.infinityDimension4.amount)
  player.infinityDimension5.amount = new Decimal(player.infinityDimension5.amount)
  player.infinityDimension6.amount = new Decimal(player.infinityDimension6.amount)
  player.infinityDimension7.amount = new Decimal(player.infinityDimension7.amount)
  player.infinityDimension8.amount = new Decimal(player.infinityDimension8.amount)

  player.timeDimension1.amount = new Decimal(player.timeDimension1.amount)
  player.timeDimension2.amount = new Decimal(player.timeDimension2.amount)
  player.timeDimension3.amount = new Decimal(player.timeDimension3.amount)
  player.timeDimension4.amount = new Decimal(player.timeDimension4.amount)
  player.timeDimension5.amount = new Decimal(player.timeDimension5.amount)
  player.timeDimension6.amount = new Decimal(player.timeDimension6.amount)
  player.timeDimension7.amount = new Decimal(player.timeDimension7.amount)
  player.timeDimension8.amount = new Decimal(player.timeDimension8.amount)
  player.timeDimension1.cost = new Decimal(player.timeDimension1.cost)
  player.timeDimension2.cost = new Decimal(player.timeDimension2.cost)
  player.timeDimension3.cost = new Decimal(player.timeDimension3.cost)
  player.timeDimension4.cost = new Decimal(player.timeDimension4.cost)
  player.timeDimension5.cost = new Decimal(player.timeDimension5.cost)
  player.timeDimension6.cost = new Decimal(player.timeDimension6.cost)
  player.timeDimension7.cost = new Decimal(player.timeDimension7.cost)
  player.timeDimension8.cost = new Decimal(player.timeDimension8.cost)
  player.timeDimension1.power = new Decimal(player.timeDimension1.power)
  player.timeDimension2.power = new Decimal(player.timeDimension2.power)
  player.timeDimension3.power = new Decimal(player.timeDimension3.power)
  player.timeDimension4.power = new Decimal(player.timeDimension4.power)
  player.timeDimension5.power = new Decimal(player.timeDimension5.power)
  player.timeDimension6.power = new Decimal(player.timeDimension6.power)
  player.timeDimension7.power = new Decimal(player.timeDimension7.power)
  player.timeDimension8.power = new Decimal(player.timeDimension8.power)
  player.timeShards = new Decimal(player.timeShards)
  player.eternityPoints = new Decimal(player.eternityPoints)
  player.tickThreshold = new Decimal(player.tickThreshold)
  player.postC3Reward = new Decimal(player.postC3Reward)

  for (var i=0; i<10; i++) {
      player.lastTenRuns[i][1] = new Decimal(player.lastTenRuns[i][1])
      player.lastTenEternities[i][1] = new Decimal(player.lastTenEternities[i][1])
      player.lastTenRealities[i][1] = new Decimal(player.lastTenRealities[i][1])
  }
  player.lastTenRuns = [[parseFloat(player.lastTenRuns[0][0]), player.lastTenRuns[0][1]], [parseFloat(player.lastTenRuns[1][0]), player.lastTenRuns[1][1]], [parseFloat(player.lastTenRuns[2][0]), player.lastTenRuns[2][1]], [parseFloat(player.lastTenRuns[3][0]), player.lastTenRuns[3][1]], [parseFloat(player.lastTenRuns[4][0]), player.lastTenRuns[4][1]], [parseFloat(player.lastTenRuns[5][0]), player.lastTenRuns[5][1]], [parseFloat(player.lastTenRuns[6][0]), player.lastTenRuns[6][1]], [parseFloat(player.lastTenRuns[7][0]), player.lastTenRuns[7][1]], [parseFloat(player.lastTenRuns[8][0]), player.lastTenRuns[8][1]], [parseFloat(player.lastTenRuns[9][0]), player.lastTenRuns[9][1]]]
  player.replicanti.chanceCost = new Decimal(player.replicanti.chanceCost)
  player.replicanti.intervalCost = new Decimal(player.replicanti.intervalCost)
  player.replicanti.galCost = new Decimal(player.replicanti.galCost)

  for (var i=1; i<=8; i++) {
      player["infinityDimension"+i].cost = new Decimal(player["infinityDimension"+i].cost)
      player["infinityDimension"+i].power = new Decimal(player["infinityDimension"+i].power)
  }

  player.infMultCost = new Decimal(player.infMultCost)
  player.infMult = new Decimal(player.infMult)
  player.timestudy.amcost = new Decimal(player.timestudy.amcost)
  player.timestudy.ipcost = new Decimal(player.timestudy.ipcost)
  player.timestudy.epcost = new Decimal(player.timestudy.epcost)

  player.autoIP = new Decimal(player.autoIP)

  if (player.autobuyers[11].priority !== undefined && player.autobuyers[11].priority !== null && player.autobuyers[11].priority !== "undefined")player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority)

  player.epmultCost = new Decimal(player.epmultCost)
  player.epmult = new Decimal(player.epmult)
  player.eternityBuyer.limit = new Decimal(player.eternityBuyer.limit)
  player.eternityChallGoal = new Decimal(player.eternityChallGoal)
  player.replicanti.amount = new Decimal(player.replicanti.amount)

  player.dilation.tachyonParticles = new Decimal(player.dilation.tachyonParticles)
  player.dilation.dilatedTime = new Decimal(player.dilation.dilatedTime)
  player.dilation.totalTachyonParticles = new Decimal(player.dilation.totalTachyonParticles)
  player.dilation.nextThreshold = new Decimal(player.dilation.nextThreshold)

  player.reality.realityMachines = new Decimal(player.reality.realityMachines)

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


function loadAutoBuyerSettings() {
  for (var i=0; i<9; i++) {
      document.getElementById("priority" + (i+1)).selectedIndex = player.autobuyers[i].priority-1
      if (i == 8 && player.autobuyers[i].target == 10) document.getElementById("toggleBtnTickSpeed").textContent = "Buys max"
      else if (i == 8 && player.autobuyers[i].target !== 10) document.getElementById("toggleBtnTickSpeed").textContent = "Buys singles"
      else if (player.autobuyers[i].target > 10) document.getElementById("toggleBtn" + (i+1)).textContent = "Buys until 10"
      else document.getElementById("toggleBtn" + (i+1)).textContent = "Buys singles"

  }
  document.getElementById("priority10").value = player.autobuyers[9].priority
  document.getElementById("priority11").value = player.autobuyers[10].priority
  document.getElementById("priority12").value = player.autobuyers[11].priority
  document.getElementById("overGalaxies").value = player.overXGalaxies
  document.getElementById("bulkDimboost").value = player.autobuyers[9].bulk
  document.getElementById("prioritySac").value = player.autoSacrifice.priority
  document.getElementById("bulkgalaxy").value = player.autobuyers[10].bulk
  document.getElementById("priority13").value = player.eternityBuyer.limit
  $("#maxspentep").val(player.reality.epmultbuyer.threshhold * 100 + "%")
  $("#maxspenttd").val(player.reality.tdbuyer.threshhold * 100 + "%")

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

setTimeout(drawPerkNetwork, 100)
setTimeout(onLoad, 100)
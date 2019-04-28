"use strict";

/**
 * 
 * BUY STUDY 11:
 * Buys study
 * also can do BUY STUDYUNTIL X
 * 
 * You can also BUY TTMAX or BUY TTEP 3 or BUY TTAM 4 etc.
 * 
 * 
 * 
 * WAIT EP 1e20:
 * waits untils 1e20 ep
 * possible targets: ep, ip, antimatter, replicanti, rg, seconds
 * replicantigalaxy has a MAX option, which waits until you have as much as you can.
 * 
 * UNLOCK EC 1: you know
 * 
 * START EC 1: duh
 * 
 * CHANGE IPautobuyer 1e20:
 * changes the settings of autobuyers, currently only ip
 * 
 * RESPEC: makes next eternity respec
 * 
 * ETERNITY: does an eternity
 * 
 * STOP: stops the script
 * 
 * LOAD SCRIPT 2: loads the second script
 */

 /**
  * 
  * The player can use rows equal to Math.ceil(realities^0.5)
  */
var automatorRows = []
var automatorIdx = 0
var tryingToBuy = 0

function getAutomatorRows() {
  const realityFactor = Effects.max(0.7, Perk.automatorRowScaling);
  const realityRows = Math.ceil(Math.pow(player.realities, realityFactor));
  const perkRows = Effects.sum(
    Perk.automatorRowIncrease1,
    Perk.automatorRowIncrease2
  );
  return 6 + realityRows + perkRows;
}

function automatorOnOff() {
  automatorOn = !automatorOn;
  automatorIdx = 0
  if (!automatorOn) {
    $("#automator")[0].blur()
  }
  GameUI.notify.info(automatorOn ? "Automator turned on" : "Automator turned off");
}

function highlightcurrent() {
    var row = automatorRows[automatorIdx];
    var idx = automatorRows.slice(0, automatorIdx).reduce(function (acc, x) {
        return acc + x.length + 1;
    }, 0);
    
  if (idx >= 0) {
      $("#automator")[0].focus();
      $("#automator")[0].setSelectionRange(idx, idx + row.length);
  }
}

var automatorOn = false
var timeStamp = 0
var buying = false
function mainIteration() {
  if (automatorRows[0] === undefined) return false;
  var cont = false
  if (automatorRows[automatorIdx][0] == "*") cont = true
  if (automatorOn) {
    var row = automatorRows[automatorIdx].split(" ")
      if (cont) row.splice(0, 1);
      if (row.length == 1) {
          var current = {
              action: row[0]
          }
      } else if (row.length == 2) {
          var current = {
              action: row[0],
              target: row[1]
          }
      } else if (row.length == 3) {
          var current = {
              action: row[0],
              target: row[1],
              id: row[2]
          }          
      } else if (row.length >= 4) { //added more flexibility to allow for more arguments in automator commands
          var current = {
              action: row[0],
              target: row[1],
              id: row[2],
              args: row.slice(3)
          }
      }
    switch(current.action) {
      case "buy":
        if (buy(current) || cont) automatorIdx+=1
        break;
      case "wait":
        if (wait(current)) automatorIdx+=1
        break;
      case "unlock":
        if (unlock(current) || cont) automatorIdx+=1
        break;
      case "start":
        if (start(current) || cont) automatorIdx+=1
        break;
      case "change":
        if (change(current) || cont) automatorIdx+=1
        break;
      case "respec":
        if (!player.reality.automatorCommands.has(61)) return false
        player.respec = true
        automatorIdx+=1
        break;
      case "eternity":
        if (!player.reality.automatorCommands.has(62)) return false
        justImported = true;
        if (eternity(false, true) || cont) automatorIdx+=1
        justImported = false;
        break;
      case "stop":
        if (!player.reality.automatorCommands.has(72)) return false
        automatorOn = false
        $("#automatorOn")[0].checked = false
        break;
      case "load":
        if (!player.reality.automatorCommands.has(51)) return false
        automatorIdx = 0
        loadScript(current.id)
        break;
      case "toggle":
        if (!player.reality.automatorCommands.has(53)) return false
        toggle(current)
        automatorIdx+=1
        break;
      case "goto":
        if (!player.reality.automatorCommands.has(31)) return false
        automatorIdx = parseInt(current.target)-1
        break;

      case "if":
        if (!player.reality.automatorCommands.has(21)) return false;
          if (wait(current)) automatorIdx += 1
          else automatorIdx += 2
    }
    

    if (automatorRows.length - 1 < automatorIdx || automatorIdx + 1 > getAutomatorRows() ) automatorIdx = 0 //The player can use rows equal to Math.ceil(realities^0.7) + 6
    if ( $("#reality").css("display") == "block" && $("#automation").css("display") == "block") highlightcurrent()
  }
}

function buy(current) {
  switch(current.target) {
    case "study":
      id = parseInt(current.id)
      if (TimeStudy(id).isBought) return true;
      if (TimeStudy(id).purchase()) return true;
      return false;
      break;
      case "studyuntil":
          id = parseInt(current.id);
          if (!TimeStudy(id).isBought) {
              studiesUntil(id);//passes arguments into the studies until function.
        return true
      } else return false
          break;
      case "studypath":
          if (!player.reality.automatorCommands.has(26)) return false;
          studyPath(current.id, current.args);
          return true;
          break;
      case "studyimport":
          if (!player.reality.automatorCommands.has(36)) return false;
          importStudyTree(current.id);
          return true;
          break;
    case "ttmax":
      if (!player.reality.automatorCommands.has(44)) return false
      TimeTheorems.buyMax();
      return true
      break;
    case "ttip":
      if (!player.reality.automatorCommands.has(35)) return false
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (TimeTheorems.buyWithIP()) tryingToBuy++;
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
    case "ttep":
      if (!player.reality.automatorCommands.has(34)) return false
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (TimeTheorems.buyWithEP()) tryingToBuy++;
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
    case "ttam":
      if (!player.reality.automatorCommands.has(43)) return false
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (TimeTheorems.buyWithAntimatter()) tryingToBuy++;
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
    case "ttgen":
      if (buyDilationUpgrade(10)) return true
      else return false
  }
}

function unlock(current) {
  if (!player.reality.automatorCommands.has(54)) return false
  switch(current.target) {
    case "ec":
      if (!player.reality.automatorCommands.has(64)) return false
      if (player.challenge.eternity.unlocked === parseInt(current.id, 10)) return true;
      justImported = true;
      if (TimeStudy.eternityChallenge(current.id).purchase()) {
        justImported = false;
        return true;
      }
      else return false
      break;
    case "dilation":
      if (!player.reality.automatorCommands.has(63)) return false
      if (TimeStudy.dilation.purchase(true)) return true;
      else return false
      break;
  }
}

function wait(current) {
  if (!player.reality.automatorCommands.has(11)) return false
  let id;
  if (current.id !== "max" && current.target !== "time") id = new Decimal(current.id)
  switch(current.target) {
    case "ep":
      if (!player.reality.automatorCommands.has(23)) return false
      if (id.gt(player.eternityPoints)) return false
      else return true
      break;
    case "ip":
      if (!player.reality.automatorCommands.has(32)) return false
      if (id.gt(player.infinityPoints)) return false
      else return true
      break;
    case "antimatter":
      if (!player.reality.automatorCommands.has(22)) return false
      if (id.gt(player.money)) return false
      else return true
      break;
    case "replicanti":
      if (!player.reality.automatorCommands.has(33)) return false
      if (id.gt(player.replicanti.amount)) return false
      else return true
      break;
    case "rg":
      if (!player.reality.automatorCommands.has(42)) return false
      if (current.id == "max") {
        if (!player.reality.automatorCommands.has(51)) return false
        if ((!TimeStudy(131).isBought ? player.replicanti.gal : Math.floor(player.replicanti.gal * 1.5)) == player.replicanti.galaxies) return true
        else return false
      }
      if (id.gt(player.replicanti.galaxies)) return false
      else return true
      break;
    case "time":
      if (!player.reality.automatorCommands.has(41)) return false
      if (timeStamp == 0) {
        timeStamp = new Date().getTime()
        return false
      } else {
        if (timeStamp + current.id * 1000 < new Date().getTime()) {
          timeStamp = 0 
          return true
        }
        else return false
      }

      break;
    case "tt":
      if (id.gt(player.timestudy.theorem)) return false
      else return true
  }
}

function start(current) {
  if (!player.reality.automatorCommands.has(73)) return false
  switch(current.target) {
    case "ec":
      if (!player.reality.automatorCommands.has(84)) return false;
      const ec = EternityChallenge(current.id);
      if (ec.isRunning) return true;
      return ec.start();
    case "dilation":
      if (!player.reality.automatorCommands.has(83)) return false
      if (startDilatedEternity()) return true
      else return false
      break;
  }
}

function change(current) {
  if (!player.reality.automatorCommands.has(71)) return false
  switch(current.target) {
    case "ipautobuyer":
      Autobuyer.infinity.limit = new Decimal(current.id);
      return true
    case "epautobuyer":
      Autobuyer.eternity.limit = new Decimal(current.id);
      return true
  }
}

function toggle(current) {
    if (current.target === "rg") { //RG is handled differently
        replicantiGalaxyAutoToggle(current.id);
        return true;
    }
    let options = Array.range(1, 8)
      .map(tier => { return { name: `d${tier}`, autobuyer: Autobuyer.dim(tier) }; });
    options.push({ name: "tickspeed", autobuyer: Autobuyer.tickspeed });
    options.push({ name: "dimboost", autobuyer: Autobuyer.dimboost });
    options.push({ name: "galaxy", autobuyer: Autobuyer.galaxy });
    options.push({ name: "infinity", autobuyer: Autobuyer.infinity });
    options.push({ name: "sacrifice", autobuyer: Autobuyer.sacrifice });
    options.push({ name: "eternity", autobuyer: Autobuyer.eternity });
    let state;
    let id = options.map(o => o.name).indexOf(current.target);
    if (id === -1) return false; //Fails if the specified autobuyer doesnt exist
    const autobuyer = options[id].autobuyer;
    if (current.id === "on") state = true;
    else if (current.id === "off") state = false;
    else state = !autobuyer.isOn;
    autobuyer.isOn = state;
    return true;
}


function automatorSaveButton(num, forceSave) {
  if (shiftDown || forceSave) {
      localStorage.setItem("automatorScript"+num, JSON.stringify(automatorRows));
      GameUI.notify.info(`Automator script ${num} saved`);
  } else {
    loadScript(num)
  }
}

function loadScript(num) {
  if (localStorage.getItem("automatorScript"+num) !== null && localStorage.getItem("automatorScript"+num) !== "|0") {
    importAutomatorScript(localStorage.getItem("automatorScript"+num));
    automatorIdx = 0
    GameUI.notify.info(`Automator script ${num} loaded`);
  }
}

function importAutomatorScript(script) {
  var outputString = JSON.parse(script).join("\n")
  document.getElementById("automator").value = outputString
  updateAutomatorState()
}

function updateAutomatorState() {
  automatorRows = $("#automator").val().toLowerCase().split("\n").filter(function(row) { return row !== "" })
  automatorIdx = 0
}

function buyAutomatorInstruction(id) {
  if (!canBuyAutomatorInstruction(id)) return false
  if (player.reality.automatorCommands.has(id)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(Automator.InstructionsById[id].price)
  player.reality.automatorCommands.add(id)
  return true
}

function canBuyAutomatorInstruction(id) {
  var info = Automator.InstructionsById[id];
  if (player.reality.realityMachines.lt(info.price)) return false;
  return info.parent === undefined || player.reality.automatorCommands.has(info.parent);
}

function updateAutomatorRows() {
  const pow = Effects.max(0.7, Perk.automatorRowScaling);
  var rows = 6 + Math.ceil(Math.pow(player.realities, pow))
  var next = Math.ceil( Math.pow(rows - 6, 1 / pow) )
  $("#rowsAvailable").text("Your automator can use " + getAutomatorRows() + " rows; next row at " + next + " realities.")
}

setInterval(mainIteration, 50)

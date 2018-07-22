
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

var automatorRows = []
var automatorIdx = 0
var tryingToBuy = 0
function updateState() {
  automatorRows = $("#automator").val().toLowerCase().split("\n").filter(function(row) { return row !== "" })
}

function highlightcurrent() {
  var row = automatorRows[automatorIdx]
  var idx = $("#automator")[0].value.indexOf(row)
  if (idx >= 0) {
    $("#automator")[0].focus()
    $("#automator")[0].setSelectionRange(idx, idx + row.length)
  }
}

var automatorOn = false
var timer = 0
var now = Date.now()
var waiting = false
var buying = false
function mainIteration() {
  if (automatorRows[0] === undefined) return false; 
  if (automatorOn) {
    var row = automatorRows[automatorIdx].split(" ")
    if (row.length == 1) {
      var current = {
        action: row[0]
      }
    } else if (row.length == 2) {
      var current = {
        action: row[0],
        target: row[1]
      }
    } else {
      var current = {
        action: row[0],
        target: row[1],
        id: row[2]
      }
    }
    switch(current.action) {
      case "buy":
        if (buy(current)) automatorIdx+=1
        break;
      case "wait":
        if (wait(current)) automatorIdx+=1
        break;
      case "unlock":
        if (unlock(current)) automatorIdx+=1
        break;
      case "start":
        if (start(current)) automatorIdx+=1
        break;
      case "change":
        if (change(current)) automatorIdx+=1
        break;
      case "respec":
        player.respec = true
        automatorIdx+=1
        break;
      case "eternity":
        if (eternity(false, true)) automatorIdx+=1
        break;
      case "stop":
        automatorOn = false
        $("#automatorOn")[0].checked = false
        break;
      case "load":
        automatorIdx = 0
        loadScript(current.id)
        break;
    }

    if (automatorRows.length - 1 < automatorIdx) automatorIdx = 0
    if ( $("#reality").css("display") == "block" && $("#automation").css("display") == "block") highlightcurrent()
  }
}

function buy(current) {
  switch(current.target) {
    case "study":
      id = parseInt(current.id)
      if (player.timestudy.studies.includes(id)) return true
      else if ( buyTimeStudy(id, studyCosts[all.indexOf(id)], 0) ) return true
      else return false
      break;
    case "studyuntil":
      id = parseInt(current.id)
      if (!player.timestudy.studies.includes(id)) {
        studiesUntil(id)
        return false
      }
      else {
        return true
      }
      break;
    case "ttmax":
      maxTheorems()
      break;
    case "ttip":
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (buyWithIP()) tryingToBuy++
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
    case "ttep":
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (buyWithEP()) tryingToBuy++
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
    case "ttam":
      if (!buying) {
        buying = true
        tryingToBuy = 0
      }
      if (buyWithAntimatter()) tryingToBuy++
      if (tryingToBuy == parseInt(current.id)) {
        buying = false
        return true
      }
      else return false
      break;
  }
}

function unlock(current) {
  switch(current.target) {
    case "ec":
      if (player.eternityChallUnlocked == parseInt(current.id)) return true
      if ( document.getElementById("ec" + current.id + "unl").click() ) return true
      else return false
  }
}

function wait(current) {
  if (current.id !== "max") id = new Decimal(current.id)
  switch(current.target) {
    case "ep":
      if (id.gt(player.eternityPoints)) return false
      else return true
      break;
    case "ip":
      if (id.gt(player.infinityPoints)) return false
      else return true
      break;
    case "antimatter":
      if (id.gt(player.money)) return false
      else return true
      break;
    case "replicanti":
      if (id.gt(player.replicanti.amount)) return false
      else return true
      break;
    case "rg":
      if (current.id == "max") {
        if ((!player.timestudy.studies.includes(131) ? player.replicanti.gal : Math.floor(player.replicanti.gal * 1.5)) == player.replicanti.galaxies) return true
        else return false
      }
      if (id.gt(player.replicanti.galaxies)) return false
      else return true
      break;
    case "seconds":
      if (waiting = false) {
        waiting = true
        now = Date.now()
      }
      timer += (Date.now() - now) / 1000
      now = Date.now()
      if (timer < id) return false
      else {
        waiting = false
        return true
      }
      break;
  }
}

function start(current) {
  switch(current.target) {
    case "ec":
      if (player.currentEternityChall == "eterc" + current.id) return true
      if (startEternityChallenge("eterc" + current.id, ETERNITY_CHALLS["ec"+current.id].start, ETERNITY_CHALLS["ec"+current.id].inc)) return true
      else return false
  }
}

function change(current) {
  switch(current.target) {
    case "ipautobuyer":
      document.getElementById("priority12").value = current.id
      updatePriorities()
      return true
  }
}


function automatorSaveButton(num) {
  if (shiftDown) {
      localStorage.setItem("automatorScript"+num, JSON.stringify(automatorRows));
      $.notify("Automator script "+num+" saved", "info")
  } else {
    loadScript(num)
  }
}

function loadScript(num) {
  if (localStorage.getItem("automatorScript"+num) !== null && localStorage.getItem("automatorScript"+num) !== "|0") {
    importAutomatorScript(localStorage.getItem("automatorScript"+num));
    $.notify("Automator script "+num+" loaded", "info")
  }
}

function buyAutomatorInstruction(id, cost) {
  if (player.reality.realityMachines.lt(cost)) return false
  if (player.reality.automatorCommands.includes(id)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.reality.automatorCommands.push(id)
  if (id == 11 || id == 12) {
      document.getElementById("automator"+id).className = "automatorinstructionbought command"
  } else {
      document.getElementById("automator"+id).className = "automatorinstructionbought target"
  }
  updateAutomatorTree()
  return true
}

function canBuyAutomatorInstruction(id) {
  if (player.reality.realityMachines.lt(instructionCosts[allInstructions.indexOf(id)])) return false
  return true
}

var allInstructions = [11, 12, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51]
var instructionCosts = [1, 0,  3,  2,  0,  0,  3,  2,  3,  2,  3,  2,  3,  20, 2]
function updateAutomatorTree() {
  for (var i=0; i<allInstructions.length; i++) {
    if (!player.reality.automatorCommands.includes(allInstructions[i])) {
      if (canBuyAutomatorInstruction(allInstructions[i]) && player.reality.realityMachines.gte(instructionCosts[i])) {
        if (allInstructions[i] == 11 || allInstructions[i] == 12) {
          document.getElementById("automator"+allInstructions[i]).className = "automatorinstruction command"
        } else {
          document.getElementById("automator"+allInstructions[i]).className = "automatorinstruction target"
        }
      } else {
          if (allInstructions[i] == 11 || allInstructions[i] == 12) {
            document.getElementById("automator"+allInstructions[i]).className = "automatorinstructionlocked command"
          } else {
            document.getElementById("automator"+allInstructions[i]).className = "automatorinstructionlocked target"
          }
        }
    }
  }
}

setInterval(mainIteration, 50)
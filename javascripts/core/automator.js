
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
        if (!player.reality.automatorCommands.includes(61)) return false
        player.respec = true
        automatorIdx+=1
        break;
      case "eternity":
        if (!player.reality.automatorCommands.includes(62)) return false
        if (eternity(false, true)) automatorIdx+=1
        break;
      case "stop":
        if (!player.reality.automatorCommands.includes(72)) return false
        automatorOn = false
        $("#automatorOn")[0].checked = false
        break;
      case "load":
        if (!player.reality.automatorCommands.includes(51)) return false
        automatorIdx = 0
        loadScript(current.id)
        break;
      case "toggle":
        if (!player.reality.automatorCommands.includes(53)) return false
        toggle(current)
        automatorIdx+=1
        break;

    }

    if (automatorRows.length - 1 < automatorIdx || automatorIdx + 1 > 2 + Math.ceil(Math.sqrt(player.realities))) automatorIdx = 0 //The player can use rows equal to Math.ceil(realities^0.5) + 2
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
      if (!player.reality.automatorCommands.includes(44)) return false
      maxTheorems()
      break;
    case "ttip":
      if (!player.reality.automatorCommands.includes(34)) return false
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
      if (!player.reality.automatorCommands.includes(33)) return false
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
      if (!player.reality.automatorCommands.includes(43)) return false
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
  if (!player.reality.automatorCommands.includes(54)) return false
  switch(current.target) {
    case "ec":
      if (!player.reality.automatorCommands.includes(64)) return false
      if (player.eternityChallUnlocked == parseInt(current.id)) return true
      if ( document.getElementById("ec" + current.id + "unl").click() ) return true
      else return false
      break;
    case "dilation":
      if (!player.reality.automatorCommands.includes(63)) return false
      if (unlockDilation()) return true
      else return false
      break;
  }
}

function wait(current) {
  if (!player.reality.automatorCommands.includes(11)) return false
  if (current.id !== "max") id = new Decimal(current.id)
  switch(current.target) {
    case "ep":
      if (!player.reality.automatorCommands.includes(22)) return false
      if (id.gt(player.eternityPoints)) return false
      else return true
      break;
    case "ip":
      if (!player.reality.automatorCommands.includes(31)) return false
      if (id.gt(player.infinityPoints)) return false
      else return true
      break;
    case "antimatter":
      if (!player.reality.automatorCommands.includes(21)) return false
      if (id.gt(player.money)) return false
      else return true
      break;
    case "replicanti":
      if (!player.reality.automatorCommands.includes(32)) return false
      if (id.gt(player.replicanti.amount)) return false
      else return true
      break;
    case "rg":
      if (!player.reality.automatorCommands.includes(42)) return false
      if (current.id == "max") {
        if (!player.reality.automatorCommands.includes(51)) return false
        if ((!player.timestudy.studies.includes(131) ? player.replicanti.gal : Math.floor(player.replicanti.gal * 1.5)) == player.replicanti.galaxies) return true
        else return false
      }
      if (id.gt(player.replicanti.galaxies)) return false
      else return true
      break;
    case "time":
      if (!player.reality.automatorCommands.includes(41)) return false
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
  if (!player.reality.automatorCommands.includes(73)) return false
  switch(current.target) {
    case "ec":
      if (!player.reality.automatorCommands.includes(84)) return false
      if (player.currentEternityChall == "eterc" + current.id) return true
      if (startEternityChallenge("eterc" + current.id, ETERNITY_CHALLS["ec"+current.id].start, ETERNITY_CHALLS["ec"+current.id].inc)) return true
      else return false
      break;
    case "dilation":
      if (!player.reality.automatorCommands.includes(83)) return false
      if (startDilatedEternity) return true
      else return false
      break;
  }
}

function change(current) {
  if (!player.reality.automatorCommands.includes(71)) return false
  switch(current.target) {
    case "ipautobuyer":
      document.getElementById("priority12").value = current.id
      updatePriorities()
      return true
  }
}

function toggle(current) {
  if (current.target[0] == "d") {
    player.autobuyers[parseInt(current.target[1])].isOn = !player.autobuyers[parseInt(current.target[1])].isOn
    updateAutobuyers()
    return true
  } else {
    switch(current.target) {
      case "tickspeed":
        player.autobuyers[8].isOn = !player.autobuyers[8].isOn
        updateAutobuyers()
        return true
        break;
      case "dimboost":
        player.autobuyers[9].isOn = !player.autobuyers[9].isOn
        updateAutobuyers()
        return true
        break;
      case "galaxy":
        player.autobuyers[10].isOn = !player.autobuyers[9].isOn
        updateAutobuyers()
        return true
        break;
      case "infinity":
        player.autobuyers[11].isOn = !player.autobuyers[9].isOn
        updateAutobuyers()
        return true
        break;
      case "infinity":
        player.autobuyers[11].isOn = !player.autobuyers[9].isOn
        updateAutobuyers()
        return true
        break;
      case "sacrifice":
        player.autoSacrifice.isOn = !player.autoSacrifice.isOn
        updateAutobuyers()
        return true
        break;
      case "eternity":
        player.eternityBuyer.isOn = !player.eternityBuyer.isOn
        updateAutobuyers()
        return true
        break;
      case "rg":
        replicantiGalaxyAutoToggle()
        return true
        break;
    }
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

var allInstructions = [11, 12, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 81, 82, 83, 84]
var instructionCosts = [1, 0,  3,  2,  0,  0,  3,  2,  3,  2,  3,  2,  3,  20, 30, 10, 30, 30, 30, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30]
var automatorCommands = [11, 12, 51, 53, 54, 61, 62, 71, 72, 73]
function updateAutomatorTree() {
  for (var i=0; i<allInstructions.length; i++) {
    if (!player.reality.automatorCommands.includes(allInstructions[i])) {
      if (canBuyAutomatorInstruction(allInstructions[i]) && player.reality.realityMachines.gte(instructionCosts[i])) {
        if (automatorCommands.includes(allInstructions[i])) {
          document.getElementById("automator"+allInstructions[i]).className = "automatorinstruction command"
        } else {
          document.getElementById("automator"+allInstructions[i]).className = "automatorinstruction target"
        }
      } else {
          if (automatorCommands.includes(allInstructions[i])) {
            document.getElementById("automator"+allInstructions[i]).className = "automatorinstructionlocked command"
          } else {
            document.getElementById("automator"+allInstructions[i]).className = "automatorinstructionlocked target"
          }
        }
    }
  }
}

function updateAutomatorRows() {
  var rows = 2 + Math.ceil( Math.sqrt ( player.realities ) )
  var x = 1;
  while (x <= player.realities) {
    x *= 2
  }
  x++;
  $("#rowsAvailable").text("Your automator can use " + rows + " rows, next row at " + x + " realities")

}

setInterval(mainIteration, 50)
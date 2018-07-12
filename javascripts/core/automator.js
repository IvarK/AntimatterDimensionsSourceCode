
/**
 * 
 * BUY STUDY 11:
 * Buys study
 * also can do BUY STUDYUNTIL X
 * 
 * 
 * 
 * WAIT EP 1e20:
 * waits untils 1e20 ep
 * possible targets: ep, ip, antimatter, replicanti, replicantigalaxy, seconds
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
 */

var automatorRows = []
var automatorIdx = 0

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
  id = new Decimal(current.id)
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
    case "replicantigalaxy":
      if (current.id == "max") {
        if ((!player.timestudy.studies.includes(131) ? player.replicanti.gal : Math.floor(player.replicanti.gal * 1.5)) == player.replicanti.galaxies) return true
        else return false
      }
      if (id.gt(player.replicanti.galaxies)) return false
      else return true
      break;
    case "seconds":
      timer += (Date.now() - now) / 1000
      now = Date.now()
      if (timer < id) return false
      else return true
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
  } else if (localStorage.getItem("automatorScript"+num) !== null && localStorage.getItem("automatorScript"+num) !== "|0") {
      importAutomatorScript(localStorage.getItem("automatorScript"+num));
      $.notify("Automator script "+num+" loaded", "info")
  }
}

setInterval(mainIteration, 50)
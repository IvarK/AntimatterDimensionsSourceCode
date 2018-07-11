
/**
 * 
 * BUY STUDY 11:
 * Buys study
 * 
 * WAIT EP 1e20:
 * waits untils 1e20 ep
 * 
 * possible targets: ep, ip, antimatter, replicanti, replicantigalaxy
 */

var automatorRows = []
var automatorIdx = 0

function updateState() {
  automatorRows = $("#automator").val().toLowerCase().split("\n")
}

var automatorOn = false
function mainIteration() {
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
    }

    if (automatorRows.length - 1 < automatorIdx) automatorIdx = 0
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
  }
}

function unlock(current) {
  switch(current.target) {
    case "ec":
      //TODO, challgoal and challincrease are not in javascript yet
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
      if (id.gt(player.replicanti.galaxies)) return false
      else return true
      break;
  }
}

updateState()
setInterval(mainIteration, 50)
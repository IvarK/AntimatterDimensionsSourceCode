
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
let prefixLength = 5;
var automatorRows = []
var automatorIdx = 0
var tryingToBuy = 0
function updateState() {
    let rows = getAutomatorRows();
    console.log(rows);
    automatorRows = $("#automator").val().toLowerCase().split("\n").filter(function (row) { return row !== "" })
    automatorRows = automatorRows.map(function (x, i) { if (i < rows) return x.slice(prefixLength); else if (i > rows) return x; });
    automatorRows.splice(rows, 1);
}

function numberAutomator(script) {
    let rows = getAutomatorRows();
    let ret = "";
    for (let i = 1; i <= rows; i++) {
        ret += ">";
        for (let j = 0; j < 3 - i.toString().length; j++)ret += " ";
        ret += i + " ";
        if (script[i-1]) ret += script[i-1];
        ret += "\n";
    }
    ret += ">> END";
    if (script.length > rows) {
        ret += "\n";
        ret += script.slice(rows).join("\n");
    }
    document.getElementById('automator').value = ret;

}

document.getElementById("automator").addEventListener('keydown', function (e) {
    let key = e.which;
    let arr = e.srcElement.value.split("\n");
    let maxRows = getAutomatorRows();
    let sel = $("#automator").prop("selectionStart");
    let row;
    let col;
    let count = 0;
    let r;
    for (r = 0; r < arr.length; r++) {
        if (count + arr[r].length >= sel) break;
        count += arr[r].length + 1;
    }
    row = r;
    col = sel - count;
    if (row === maxRows || col < prefixLength && row < maxRows) {
        e.preventDefault();
        return;
    }
    if (key === 37 && row < maxRows && col === prefixLength) {
        e.preventDefault();
        document.getElementById('automator').selectionStart = sel - prefixLength - 1;
        document.getElementById('automator').selectionEnd = sel - prefixLength - 1;
    }
    if ((key === 38 || key === 37 && col === 0) && row - 1 === maxRows) {
        e.preventDefault();
        document.getElementById('automator').selectionStart = sel - 8;
        document.getElementById('automator').selectionEnd = sel - 8;
    }
    if (key === 38 && row === 0) {
        e.preventDefault();
        document.getElementById('automator').selectionStart = prefixLength;
        document.getElementById('automator').selectionEnd = prefixLength;
    }
    if (key === 39 && row < maxRows-1 && col === arr[row].length) {
        e.preventDefault();
        document.getElementById('automator').selectionStart = sel + prefixLength + 1;
        document.getElementById('automator').selectionEnd = sel + prefixLength + 1;
    }
    if ((key === 40 || key === 39 && col === arr[row].length) && row + 1 === maxRows) {
        e.preventDefault();
        if (arr.length > maxRows + 1) {
            document.getElementById('automator').selectionStart = sel + 8;
            document.getElementById('automator').selectionEnd = sel + 8;
        }
    }
    
    if (row < maxRows) {
        if (key === 13) {
            e.preventDefault();
            let ret = arr.slice(row + 1, maxRows);
            let ret2 = arr.slice(maxRows + 1).reverse();
            ret = ret.map(function (x) { return x.slice(prefixLength) });
            ret = ret.reverse();
            let str = arr[row].slice(Math.max(col, prefixLength));
            ret.push(str);
            ret = ret.reverse();
            ret2.push(ret.pop());
            ret2 = ret2.reverse();
            if (ret2[ret2.length - 1] === "" && row !== maxRows-1) ret2.pop();
            arr[row] = arr[row].slice(0, col);
            ret.forEach(function (x, i) { arr[i + row + 1] = arr[i + row + 1].slice(0, prefixLength) + x; });
            arr.splice(maxRows + 1);
            arr = arr.concat(ret2);
            e.srcElement.value = arr.join('\n');
            let mov = prefixLength + 1;
            if (row + 1 === maxRows) mov = 8;
            document.getElementById('automator').selectionStart = sel + mov;
            document.getElementById('automator').selectionEnd = sel + mov;
            return;
        }

        if (key === 8 && col === prefixLength && row > 1) {
            e.preventDefault();
            let ret = arr.slice(row + 1, maxRows);
            let ret2 = arr.slice(maxRows + 1).reverse();
            ret = ret.map(function (x) { return x.slice(prefixLength)});
            ret = ret.reverse();
            ret = ret.reverse();
            if (ret2.length > 0) ret.push(ret2.pop());
            else ret2.push("");
            ret2 = ret2.reverse();
            arr[row - 1] = arr[row - 1].concat(arr[row].slice(prefixLength));
            ret.forEach(function (x, i) { arr[i + row] = arr[i + row].slice(0, prefixLength) + x; });
            arr.splice(maxRows + 1);
            arr = arr.concat(ret2);
            e.srcElement.value = arr.join('\n');
            let mov = -prefixLength -1;
            document.getElementById('automator').selectionStart = sel + mov;
            document.getElementById('automator').selectionEnd = sel + mov;
            return;
        }
    }
}, { capture: true });

document.getElementById("automator").addEventListener('input', function (e) {
    let arr = e.srcElement.value.split("\n");
    let maxRows = getAutomatorRows();
    let sel = $("#automator").prop("selectionStart");
    let row;
    let col;
    let count = 0;
    let r;
    for (r = 0; r < arr.length; r++) {
        if (count + arr[r].length >= sel) break;
        count += arr[r].length + 1;
    }
    row = r;
    col = sel - count;
    if (row === maxRows && e.inputType === "deleteContentBackward") {
        let ret = arr[maxRows].slice(6);
        arr[maxRows - 1] += ret;
        arr[maxRows] = arr[maxRows].slice(0, 6);
        e.srcElement.value = arr.join('\n');
        document.getElementById('automator').selectionStart -= 7 + ret.length;
        document.getElementById('automator').selectionEnd -= 7 + ret.length;
    }
    if (row < maxRows && col < prefixLength) {
        document.getElementById('automator').selectionStart = sel + prefixLength - col;
        document.getElementById('automator').selectionEnd = sel + prefixLength - col;
    }
}, { capture: true });

document.getElementById("automator").addEventListener('click', function (e) {
    let arr = e.srcElement.value.split("\n");
    let maxRows = getAutomatorRows();
    let sel = $("#automator").prop("selectionStart");
    let row;
    let col;
    let count = 0;
    let r;
    for (r = 0; r < arr.length; r++) {
        if (count + arr[r].length >= sel) break;
        count += arr[r].length + 1;
    }
    row = r;
    col = sel - count;
    if (row < maxRows && col < prefixLength) {
        document.getElementById('automator').selectionStart = sel + prefixLength - col;
        document.getElementById('automator').selectionEnd = sel + prefixLength - col;
    }
    if (row === maxRows) {
        if (arr.length > maxRows+1) {
            document.getElementById('automator').selectionStart = sel + 7 - col;
            document.getElementById('automator').selectionEnd = sel + 7 - col;
        } else {
            e.srcElement.value += "\n";
        }
    }
}, { capture: true });


function getAutomatorRows() {
  var ret = 6 + Math.ceil(Math.pow(player.realities, 0.7) )
  if (player.reality.perks.includes(3)) ret = 6 + Math.ceil(Math.pow(player.realities, 0.85) )
  if (player.reality.perks.includes(1)) ret += 5
  if (player.reality.perks.includes(2)) ret += 10
  return ret
}

function automatorOnOff() {
  automatorOn = !automatorOn;
  if (!automatorOn) {
    $("#automator")[0].blur()
  }
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
var ifstatement = false
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
          if (row[0] == "if") {
              if (!player.reality.automatorCommands.includes(21)) return false;
              var current = {
                  action: row[0],
                  target: row[1],
                  id: row[2]
              }
              ifstatement = true
              if (wait(current)) automatorIdx += 1
              else automatorIdx += 2
          }
    if (!ifstatement) {
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
          if (!player.reality.automatorCommands.includes(61)) return false
          player.respec = true
          automatorIdx+=1
          break;
        case "eternity":
          if (!player.reality.automatorCommands.includes(62)) return false
          if (eternity(false, true) || cont) automatorIdx+=1
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
          case "goto":
          if (!player.reality.automatorCommands.includes(31)) return false
          automatorIdx = parseInt(current.target)-1
          break;
      }
    }

    if (automatorRows.length - 1 < automatorIdx || automatorIdx + 1 > getAutomatorRows() ) automatorIdx = 0 //The player can use rows equal to Math.ceil(realities^0.7) + 6
    if ( $("#reality").css("display") == "block" && $("#automation").css("display") == "block") highlightcurrent()
    if (ifstatement) ifstatement = false
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
          id = parseInt(current.id);
          if (!player.timestudy.studies.includes(id)) {
              studiesUntil(id);//passes arguments into the studies until function.
        return true
      } else return false
          break;
      case "studypath":
          if (!player.reality.automatorCommands.includes(26)) return false;
          studyPath(current.id, current.args);
          return true;
          break;
      case "studyimport":
          if (!player.reality.automatorCommands.includes(36)) return false;
          importStudyTree(current.id);
          return true;
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
      case "epautobuyer":
          document.getElementById("priority13").value = current.id
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
      case "sacrifice":
        player.autoSacrifice.isOn = !player.autoSacrifice.isOn
        updateAutobuyers()
        return true
        break;
      case "eternity":
        player.eternityBuyer.isOn = !player.eternityBuyer.isOn
        teupdateAutobuyers()
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
  if (!canBuyAutomatorInstruction(id)) return false
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

// child: parent
var automatorparents = {
  21: 11,
  22: 11,
  23: 11,
  31: 21,
  32: 11,
  33: 11,
  36: 26,
  41: 11,
  42: 11,
  51: 41,
  52: 42,
  53: 43,
  54: 44,
  61: 51,
  62: 52,
  63: 54,
  64: 54,
  71: 61,
  72: 62,
  73: 64,
  81: 71,
  82: 71,
  83: 73,
  84: 73,
}

function canBuyAutomatorInstruction(id) {
  if (player.reality.realityMachines.lt(instructionCosts[allInstructions.indexOf(id)])) return false
  var parent = automatorparents[id]
  if (parent === undefined || player.reality.automatorCommands.includes(parent)) return true
  return false
}

var allInstructions = [11, 12, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34, 35, 36, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 81, 82, 83, 84]
var instructionCosts = [1, 0, 1, 3,  2,  0,  0, 50, 1, 3,  2,  3,  2,  3,  2, 500,  3,  20, 30, 10, 30, 30, 30, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30]
var automatorCommands = [11, 12, 21, 31, 51, 53, 54, 61, 62, 71, 72, 73]
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
  var pow = 0.7
  if (player.reality.perks.includes(3)) pow = 0.85
  var rows = 6 + Math.ceil(Math.pow(player.realities, pow))
  var next = Math.ceil( Math.pow(rows - 6, 1 / pow) )
  $("#rowsAvailable").text("Your automator can use " + getAutomatorRows() + " rows, next row at " + next + " realities")
}

setInterval(mainIteration, 50)
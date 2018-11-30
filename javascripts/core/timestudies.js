// Time studies

function buyWithAntimatter() {
  if (player.money.gte(player.timestudy.amcost)) {
      player.money = player.money.minus(player.timestudy.amcost)
      player.timestudy.amcost = player.timestudy.amcost.times(new Decimal("1e20000"))
      player.timestudy.theorem += 1
      updateTimeStudyButtons()
      return true
  } else return false
}

function buyWithIP() {
  if (player.infinityPoints.gte(player.timestudy.ipcost)) {
      player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost)
      player.timestudy.ipcost = player.timestudy.ipcost.times(1e100)
      player.timestudy.theorem += 1
      updateTimeStudyButtons()
      return true
  } else return false
}

function buyWithEP() {
  if (player.timeDimension1.bought < 1 && player.realities === 0) {
      alert("You need to buy at least 1 time dimension before you can purchase theorems with Eternity points.")
      return false;
  }
  if (player.eternityPoints.gte(player.timestudy.epcost)) {
      player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost)
      player.timestudy.epcost = player.timestudy.epcost.times(2)
      player.timestudy.theorem += 1
      updateTimeStudyButtons()
      updateEternityUpgrades()
      return true
  } else return false
}

function maxTheorems() {
  var AMowned = player.timestudy.amcost.e / 20000 - 1
  if (player.money.gte(player.timestudy.amcost)) {
    player.timestudy.amcost.e = Math.floor(player.money.e / 20000 + 1) * 20000
    player.timestudy.theorem += Math.floor(player.money.e / 20000) - AMowned
    player.money = player.money.minus(Decimal.fromMantissaExponent(1, Math.floor(player.money.e / 20000) * 20000))
  }
  var IPowned = player.timestudy.ipcost.e / 100
  if (player.infinityPoints.gte(player.timestudy.ipcost)) {
    player.timestudy.ipcost.e = Math.floor(player.infinityPoints.e / 100 + 1) * 100
    player.timestudy.theorem += Math.floor(player.infinityPoints.e / 100 + 1) - IPowned
    player.infinityPoints = player.infinityPoints.minus(Decimal.fromMantissaExponent(1, Math.floor(player.infinityPoints.e / 100) * 100))
  }
  if (player.eternityPoints.gte(player.timestudy.epcost)) {
    let EPowned = Math.round(player.timestudy.epcost.log2());
    let finalEPCost = new Decimal(2).pow(Math.floor(player.eternityPoints.log2()));
    let totalEPCost = finalEPCost.minus(player.timestudy.epcost);
    player.timestudy.epcost = finalEPCost;
    player.eternityPoints = player.eternityPoints.minus(totalEPCost);
    player.timestudy.theorem += Math.round(player.timestudy.epcost.log2()) - EPowned
    buyWithEP();  // The above code block will sometimes buy one too few TT, but it never over-buys
  }
  
  updateTimeStudyButtons()
  updateEternityUpgrades()
}

function calculateTimeStudiesCost() {
    var totalCost = 0;
    for (var i=0; i<all.length; i++) {
        if (player.timestudy.studies.includes(all[i])) {
            totalCost += studyCosts[i]
        }
    }
    switch(player.eternityChallUnlocked) {
        case 1:
        totalCost += 30
        break;
  
        case 2:
        totalCost += 35
        break;
  
        case 3:
        totalCost += 40
        break;
  
        case 4:
        totalCost += 70
        break;
  
        case 5:
        totalCost += 130
        break;
  
        case 6:
        totalCost += 85
        break;
  
        case 7:
        totalCost += 115
        break;
  
        case 8:
        totalCost += 115
        break;
  
        case 9:
        totalCost += 415
        break;
  
        case 10:
        totalCost += 550
        break;
  
        case 11:
        totalCost += 1
        break;
  
        case 12:
        totalCost += 1
        break;
    }
    return totalCost
}

function buyTimeStudy(name, cost, check) {
  if (shiftDown && check === undefined) studiesUntil(name);
  if (player.timestudy.theorem >= cost && canBuyStudy(name) && !player.timestudy.studies.includes(name)) {
      player.timestudy.studies.push(name)
      player.timestudy.theorem -= cost
      if (name == 71 || name == 81 || name == 91 || name == 101) {
          document.getElementById(""+name).className = "timestudybought normaldimstudy"
      } else if (name == 72 || name == 82 || name == 92 || name == 102) {
          document.getElementById(""+name).className = "timestudybought infdimstudy"
      } else if (name == 73 || name == 83 || name == 93 || name == 103) {
          document.getElementById(""+name).className = "timestudybought timedimstudy"
      } else if (name == 121 || name == 131 || name == 141) {
          document.getElementById(""+name).className = "timestudybought activestudy"
      } else if (name == 122 || name == 132 || name == 142) {
          document.getElementById(""+name).className = "timestudybought passivestudy"
      } else if (name == 123 || name == 133 || name == 143) {
          document.getElementById(""+name).className = "timestudybought idlestudy"
      } else if (name == 221 || name == 224 || name == 225 || name == 228 || name == 231 || name == 234) {
          document.getElementById(name).className = "timestudybought darkstudy"
      } else if (name == 222 || name == 223 || name == 226 || name == 227 || name == 232 || name == 233) {
          document.getElementById(name).className = "timestudybought lightstudy"
      } else {
          document.getElementById(""+name).className = "timestudybought"
      }
      updateTimeStudyButtons()
      drawStudyTree()
      return true
  } else return false
}

function buyDilationStudy(name, cost) {
    if ((player.timestudy.theorem >= cost || (name === 6 && player.realities > 0)) && canBuyDilationStudy(name) && !player.dilation.studies.includes(name)) {
        if (name === 1) {
            showEternityTab("dilation")
            if (player.reality.perks.includes(14)) player.dilation.upgrades.push(4, 5, 6);
            if (player.reality.perks.includes(15)) player.dilation.upgrades.push(7, 8, 9);
            if (player.reality.perks.includes(33)) player.dilation.tachyonParticles = player.dilation.tachyonParticles.plus(10)
        }
        if (name === 6 && !player.reality.perks.includes(66)) {
            showTab("reality")
            showRealityTab("glyphstab");
        }
        player.dilation.studies.push(name)
        if (name !== 6) player.timestudy.theorem -= cost
        else if (player.realities === 0 && name === 6) player.timestudy.theorem -= cost
        document.getElementById("dilstudy"+name).className = "dilationupgbought"
        updateTimeStudyButtons()
        drawStudyTree()
        return true
    } return false
  }

function hasRow(row) {
  for (var i=0; i<player.timestudy.studies.length; i++) {
      if (Math.floor(player.timestudy.studies[i]/10) == row) return true
  }
}

function canBuyStudy(name) {
  var row = Math.floor(name/10)
  var col = name%10
  if (name == 33) {
      if (player.timestudy.studies.includes(21)) return true; else return false
  }
  if (name == 62) {
    return (player.reality.perks.includes(71) || player.eternityChalls.eterc5 !== undefined) && player.timestudy.studies.includes(42);
  }

    if ((name == 71 || name == 72) && player.eternityChallUnlocked == 12 && !player.reality.perks.includes(31)) {
    return false;
  }

  if ((name == 72 || name == 73) && player.eternityChallUnlocked == 11 && !player.reality.perks.includes(31)) {
    return false;
  }

  if (name == 181) {
      if ((player.reality.perks.includes(4) || player.eternityChalls.eterc1 !== undefined) && (player.eternityChalls.eterc2 !== undefined || player.reality.perks.includes(74)) && (player.eternityChalls.eterc3 !== undefined || player.reality.perks.includes(75)) && player.timestudy.studies.includes(171)) return true; else return false;
  }
  if (name == 201) if(player.timestudy.studies.includes(192) && !player.dilation.upgrades.includes(8)) return true; else return false
  if (name == 211) if(player.timestudy.studies.includes(191)) return true; else return false
  if (name == 212) if(player.timestudy.studies.includes(191)) return true; else return false
  if (name == 213) if(player.timestudy.studies.includes(193)) return true; else return false
  if (name == 214) if(player.timestudy.studies.includes(193)) return true; else return false
  switch(row) {

      case 1: return true
      break;

      case 2:
      case 5:
      case 6:
      case 11:
      case 15:
      case 16:
      case 17:
      if (hasRow(row-1)) return true; else return false
      break;

      case 3:
      case 4:
      case 8:
      case 9:
      case 10:
      case 13:
      case 14:
      if (player.timestudy.studies.includes((row-1)*10 + col)) return true; else return false
      break;

      case 12:
      if (hasRow(row-1) && !hasRow(row)) return true; else return false
      break;

      case 7:
      if (player.dilation.upgrades.includes(8)) {
        if (player.timestudy.studies.includes(61)) return true; else return false;
      } else if (!player.timestudy.studies.includes(201)) {
          if (player.timestudy.studies.includes(61) && !hasRow(row)) return true; else return false
      } else {
          if (player.timestudy.studies.filter(function(x) {return Math.floor(x / 10) == 7}).length < 2) return true; else return false
      }
      break;

      case 19:
      if (player.eternityChalls.eterc10 !== undefined && player.timestudy.studies.includes(181)) return true; else return false
      break;

      case 22:
      if (player.timestudy.studies.includes(210 + Math.round(col/2)) && ((name%2 == 0) ? !player.timestudy.studies.includes(name-1) : !player.timestudy.studies.includes(name+1))) return true; else return false
      break;

      case 23:
      if ( (player.timestudy.studies.includes(220 + Math.floor(col*2)) || player.timestudy.studies.includes(220 + Math.floor(col*2-1))) && !player.timestudy.studies.includes((name%2 == 0) ? name-1 : name+1)) return true; else return false;
      break;
  }
}

function canBuyDilationStudy(name) {
    if ((name == 1 && ((ECTimesCompleted("eterc11") >= 5 && ECTimesCompleted("eterc12") >= 5 && player.timestudy.theorem + calculateTimeStudiesCost() >= 13000) || player.reality.perks.includes(13)) && player.timestudy.theorem >= 5000) && (player.timestudy.studies.includes(231) || player.timestudy.studies.includes(232) || player.timestudy.studies.includes(233) || player.timestudy.studies.includes(234))) return true
    if (name == 6) {
        if (player.eternityPoints.gte("1e4000") && player.dilation.studies.includes(5) && (player.timestudy.theorem >= 5000000000 || player.realities > 0)) return true;
        else return false
    }
    if (player.dilation.studies.includes(name-1) && player.timestudy.theorem >= parseInt(document.getElementById("dilstudy"+name).textContent.split("Cost: ")[1].replace(/[, ]+/g, ""))) return true
    else return false
}

var all = [11, 21, 22, 33, 31, 32, 41, 42, 51, 61, 62, 71, 72, 73, 81, 82 ,83, 91, 92, 93, 101, 102, 103, 111, 121, 122, 123, 131, 132, 133, 141, 142, 143, 151, 161, 162, 171, 181, 191, 192, 193, 201, 211, 212, 213, 214, 221, 222, 223, 224, 225, 226, 227, 228, 231, 232, 233, 234]
var studyCosts = [1, 3, 2, 2, 3, 2, 4, 6, 3, 3, 3, 4, 6, 5, 4, 6, 5, 4, 5, 7, 4, 6, 6, 12, 9, 9, 9, 5, 5, 5, 4, 4, 4, 8, 7, 7, 15, 200, 400, 730, 300, 900, 120, 150, 200, 120, 900, 900, 900, 900, 900, 900, 900, 900, 500, 500, 500, 500]
function updateTimeStudyButtons() {
  for (var i=0; i<all.length; i++) {
      if (!player.timestudy.studies.includes(all[i])) {
          if (canBuyStudy(all[i]) && studyCosts[i]<=player.timestudy.theorem) {
              if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
                  document.getElementById(all[i]).className = "timestudy normaldimstudy"
              } else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
                  document.getElementById(all[i]).className = "timestudy infdimstudy"
              } else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
                  document.getElementById(all[i]).className = "timestudy timedimstudy"
              } else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
                  document.getElementById(all[i]).className = "timestudy activestudy"
              } else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
                  document.getElementById(all[i]).className = "timestudy passivestudy"
              } else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
                  document.getElementById(all[i]).className = "timestudy idlestudy"
              } else if (all[i] == 221 || all[i] == 224 || all[i] == 225 || all[i] == 228 || all[i] == 231 || all[i] == 234) {
                  document.getElementById(all[i]).className = "timestudy darkstudy"
              } else if (all[i] == 222 || all[i] == 223 || all[i] == 226 || all[i] == 227 || all[i] == 232 || all[i] == 233) {
                  document.getElementById(all[i]).className = "timestudy lightstudy"
              } else {
                  document.getElementById(all[i]).className = "timestudy"
              }
          }
          else {
              if (all[i] == 71 || all[i] == 81 || all[i] == 91 || all[i] == 101) {
                  document.getElementById(all[i]).className = "timestudylocked normaldimstudylocked"
              } else if (all[i] == 72 || all[i] == 82 || all[i] == 92 || all[i] == 102) {
                  document.getElementById(all[i]).className = "timestudylocked infdimstudylocked"
              } else if (all[i] == 73 || all[i] == 83 || all[i] == 93 || all[i] == 103) {
                  document.getElementById(all[i]).className = "timestudylocked timedimstudylocked"
              } else if (all[i] == 121 || all[i] == 131 || all[i] == 141) {
                  document.getElementById(all[i]).className = "timestudylocked activestudylocked"
              } else if (all[i] == 122 || all[i] == 132 || all[i] == 142) {
                  document.getElementById(all[i]).className = "timestudylocked passivestudylocked"
              } else if (all[i] == 123 || all[i] == 133 || all[i] == 143) {
                  document.getElementById(all[i]).className = "timestudylocked idlestudylocked"
              } else {
                  document.getElementById(all[i]).className = "timestudylocked"
              }
          }
      }
  }

  for (i=1; i<7; i++) {
    if (player.dilation.studies.includes(i)) document.getElementById("dilstudy"+i).className = "dilationupgbought"
    else if (canBuyDilationStudy(i)) document.getElementById("dilstudy"+i).className = "dilationupg"
    else document.getElementById("dilstudy"+i).className = "timestudylocked"
  }

  if (player.dilation.studies.includes(6) && player.realities === 0) document.getElementById("dilstudy6").innerHTML = "Unlock reality<span>Cost: 5,000,000,000 Time Theorems"
  else if (player.realities === 0) document.getElementById("dilstudy6").innerHTML = "Unlock reality<span>Requirement: 1e4000 EP<span>Cost: 5,000,000,000 Time Theorems"
  else if (player.dilation.studies.includes(6)) document.getElementById("dilstudy6").innerHTML = "Unlock reality"
  else document.getElementById("dilstudy6").innerHTML = "Unlock reality<span>Requirement: 1e4000 EP"
}

function studiesUntil(id) {
    let col = id % 10;
    let row = Math.floor(id / 10);
    let path = [0, 0];
    for (let i = 1; i < 4; i++) {
        if (player.timestudy.studies.includes(70 + i)) path[0] = i;
        if (player.timestudy.studies.includes(120 + i)) path[1] = i;
    }
  if ((row > 10 && path[0] === 0 && !player.dilation.upgrades.includes(8)) || (row > 14 && path[1] === 0)) return;
  for (let i = 1; i < row; i++) {
      let chosenPath = path[i > 11 ? 1 : 0];
      let secondPath;
      if (row > 6 && row < 11)secondPath = col;
      if ((i > 6 && i < 11) || (i > 11 && i < 15)) buyTimeStudy(i * 10 + (chosenPath === 0 ? col : chosenPath), studyCosts[all.indexOf(i * 10 + (chosenPath === 0 ? col : chosenPath))], 0);
      if ((i > 6 && i < 11) && player.timestudy.studies.includes(201)) buyTimeStudy(i * 10 + secondPath, studyCosts[all.indexOf(i * 10 + secondPath)], 0);
      else for (let j = 1; all.includes(i * 10 + j) ; j++) buyTimeStudy(i * 10 + j, studyCosts[all.indexOf(i * 10 + j)], 0);
  }
  buyTimeStudy(id, studyCosts[all.indexOf(id)], 0);
}

function studyPath(mode, args) {
    if (!(mode === 'none' || mode === 'all')) return false;
    if (args === undefined) args = [];
    args = args.map(function (x) { if (!isNaN(x)) return parseInt(x); else return x; });
    let row = 0;
    let master = [];
    let locks = [0, 0, 0];
    main: while (row < 24) {
        row++;
        if (mode === 'none') {
            if (row >= 2 && row <= 4) {
                for (let i = 20; i <= 40; i += 10) {
                    if (args.includes(i + 1) && !master.includes(row*10 + 1)) master.push(row*10 + 1);
                    if (args.includes(i + 2) && !master.includes(row*10 + 2)) master.push(row*10 + 2);
                }
                if (row === 3 && args.includes(33)) master.push(33);
                continue main;
            }
            if (row === 6) {
                if (args.includes(62)) master.push(61, 62);
                else master.push(61);
                continue main;
            }
            if (row === 16) {
                if (args.includes(161)) master.push(161);
                if (args.includes(162)) master.push(162);
                continue main;
            }
            if (row === 19) {
                if (args.includes(191)) master.push(191);
                if (args.includes(192) || args.includes(201)) master.push(192);
                if (args.includes(193)) master.push(193);
                continue main;
            }
            if (row === 21) {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (Math.floor(args[i] / 10) === 21 && args[i] % 10 < 5 && args[i] % 10 > 0) {
                            master.push(args[i]);
                        }
                    }

                }
                continue main;
            }
        }
        if (row >= 7 && row <= 10) {
            if (mode === 'all' && player.dilation.upgrades.includes(8)) {
                master.push(row*10 + 1, row*10 + 2, row*10 + 3);
                continue main;
            }
            if (locks[0] === 0) {
                let temp = [];
                let options = ['nd', 'id', 'td', 'normal', 'infinity', 'time'];
                for (let k = 0; k < args.length; k++) {
                    for (let i = 70; i <= 100; i += 10) {
                        for (let j = 1; j <= 3; j++) {
                            if (args[k] === i + j || args[k] === options[j - 1] || args[k] === options[j+3]) temp.push(j);
                        }
                    }
                }
                if (temp.length === 0) break main;
                locks[0] = temp[0];
                temp = temp.filter(function (x) { if (x !== locks[0]) return x;});
                if (temp.length > 0) locks[2] = temp[0];
            }
            master.push(row*10 + locks[0]);
            continue main;
        }
        if (row >= 12 && row <= 14) {
            if (locks[1] === 0) {
                let temp = [];
                let options = ['active', 'passive', 'idle'];
                for (let k = 0; k < args.length; k++) {
                    for (let i = 120; i <= 140; i += 10) {
                        for (let j = 1; j <= 3; j++) {
                            if (args[k] === i + j || args[k] === options[j - 1]) temp.push(j);
                        }
                    }
                }
                if (temp.length === 0) break main;
                locks[1] = temp[0];
            }
            master.push(row*10 + locks[1]);
            continue main;
        }
        if (row === 22 || row === 23) {
            col: for (let i = 1; i <= 8 / (row - 21); i += 2) {
                for (let j = 0; j < args.length; j++) {
                    for (let k = 0; k < 2; k++) {
                        if (args[j] === row*10 + i + k) {
                            master.push(args[j]);
                            continue col;
                        }
                    }
                }
            }
            continue main;
        }
        for (let i = 1; all.includes(row * 10 + i); i++)master.push(row * 10 + i);
    }
    if (locks[2] > 0) {
        master.push(70 + locks[2], 80 + locks[2], 90 + locks[2], 100 + locks[2]);
    }
    let string = master.reduce(function (acc, x) {
        return acc += x + ',';
    }, '');
    string = string.slice(0, -1);
    string += '|0';
    importStudyTree(string);
}


function respecTimeStudies() {
  for (var i=0; i<all.length; i++) {
      if (player.timestudy.studies.includes(all[i])) {
          player.timestudy.theorem += studyCosts[i]
      }
  }
  if (player.timestudy.studies.length === 0) giveAchievement("You do know how these work, right?")
  player.timestudy.studies = []
  switch(player.eternityChallUnlocked) {
      case 1:
      player.timestudy.theorem += 30
      break;

      case 2:
      player.timestudy.theorem += 35
      break;

      case 3:
      player.timestudy.theorem += 40
      break;

      case 4:
      player.timestudy.theorem += 70
      break;

      case 5:
      player.timestudy.theorem += 130
      break;

      case 6:
      player.timestudy.theorem += 85
      break;

      case 7:
      player.timestudy.theorem += 115
      break;

      case 8:
      player.timestudy.theorem += 115
      break;

      case 9:
      player.timestudy.theorem += 415
      break;

      case 10:
      player.timestudy.theorem += 550
      break;

      case 11:
      player.timestudy.theorem += 1
      break;

      case 12:
      player.timestudy.theorem += 1
      break;
  }
  player.eternityChallUnlocked = 0
  updateTimeStudyButtons()
  drawStudyTree()
}

function exportStudyTree() {
  copyToClipboardAndNotify(player.timestudy.studies + "|" + player.eternityChallUnlocked);
}

function importStudyTree(input) {
  if (typeof input !== 'string') var input = prompt()
  if (sha512_256(input) == "08b819f253b684773e876df530f95dcb85d2fb052046fa16ec321c65f3330608") giveAchievement("You followed the instructions")
  if (input === "") return false
  var studiesToBuy = input.split("|")[0].split(",");
  for (i=0; i<studiesToBuy.length; i++) {
    buyTimeStudy(parseInt(studiesToBuy[i]),studyCosts[all.indexOf(parseInt(studiesToBuy[i]))],0)
  }
  if (parseInt(input.split("|")[1]) !== 0) {
      justImported = true;
      document.getElementById("ec"+parseInt(input.split("|")[1])+"unl").click();
      setTimeout(function(){ justImported = false; }, 100);
  }
};

function studyTreeSaveButton(num, forceSave) {
    if (shiftDown || forceSave) {
        localStorage.setItem("studyTree"+num, player.timestudy.studies + "|" + player.eternityChallUnlocked);
        ui.notify.info("Study tree "+num+" saved")
    } else if (localStorage.getItem("studyTree"+num) !== null && localStorage.getItem("studyTree"+num) !== "|0") {
        importStudyTree(localStorage.getItem("studyTree"+num));
        ui.notify.info("Study tree "+num+" loaded")
    }
}

function toggleTTAutomation() {
  player.ttbuyer = !player.ttbuyer
  $("#ttautobuyer").text(player.ttbuyer ? "Automator: ON" : "Automator: OFF")
}

// Add long-press to all studies as shift click alternative
$(document).ready(function() {
  all.forEach(function(id) {
    obj = document.getElementById(id);
    if (obj.onclick) {
      var savedHandler = obj.onclick;
      LongPress.addTo(obj, 750, {
        longPress : function(e) {
          var savedShiftDown = shiftDown;
          shiftDown = true;
          savedHandler();
          shiftDown = savedShiftDown;
        },
        click : savedHandler
      })
    }
  });
});

const TimeStudyType = {
  NORMAL: 0,
  EC: 1,
  DILATION: 2
};

class TimeStudyInfo {
  constructor(props) {
    this._cost = props.cost;
    this.incomingConnections = [];
  }

  get cost() {
    return this._cost;
  }

  get isAffordable() {
    return player.timestudy.theorem >= this.cost;
  }

  get canBeBought() {
    return true;
  }
}

class NormalTimeStudyInfo extends TimeStudyInfo {
  constructor(props) {
    super(props);
    this._id = props.id;
    this._effect = props.effect;
    this.type = TimeStudyType.NORMAL;
  }

  get id() {
    return this._id;
  }

  get isBought() {
    return player.timestudy.studies.includes(this.id);
  }

  get canBeBought() {
    return canBuyStudy(this.id);
  }

  purchase() {
    if (!this.canBeBought && !this.isAffordable) return;
    buyTimeStudy(this.id, this.cost);
  }

  get effectValue() {
    return this._effect();
  }

  applyEffect(applyFn) {
    if (this.isBought) {
      applyFn(this.effectValue);
    }
  }
}

NormalTimeStudyInfo.studies = function() {
  // For studies 141 and 143
  const thisInfinityMult = () => {
    // All "this inf time" or "best inf time" mults are * 10
    const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
    return Decimal.pow(15, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.125));
  };
  const allProps = [
    {
      id: 11,
      cost: 1,
      effect: function() {
        const tickspeed = player.tickspeed.dividedBy(1000);
        const firstPart = tickspeed.pow(0.005).times(0.95);
        const secondPart = tickspeed.pow(0.0003).times(0.05);
        return firstPart.plus(secondPart).clampMin(Decimal.fromMantissaExponent(1, -2500));
      }
    },
    {
      id: 21,
      cost: 3,
      effect: () => Decimal.pow(player.replicanti.amount, 0.032)
    },
    {
      id: 22,
      cost: 2
    },
    {
      id: 31,
      cost: 3
    },
    {
      id: 32,
      cost: 2,
      effect: () => Math.max(player.resets, 1)
    },
    {
      id: 33,
      cost: 2
    },
    {
      id: 41,
      cost: 4,
      effect: () => Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies)
    },
    {
      id: 42,
      cost: 6
    },
    {
      id: 51,
      cost: 3,
      effect: () => 1e15
    },
    {
      id: 61,
      cost: 3,
      effect: () => 10
    },
    {
      id: 62,
      cost: 3
    },
    {
      id: 71,
      cost: 4,
      effect: () => Sacrifice.totalBoost.pow(0.25).clamp(1, "1e210000")
    },
    {
      id: 72,
      cost: 6,
      effect: () => Sacrifice.totalBoost.pow(0.04).clamp(1, "1e30000")
    },
    {
      id: 73,
      cost: 5,
      effect: () => Sacrifice.totalBoost.pow(0.005).clamp(1, "1e1300")
    },
    {
      id: 81,
      cost: 4
    },
    {
      id: 82,
      cost: 6,
      effect: () => Decimal.pow(1.0000109, Math.pow(player.resets, 2))
    },
    {
      id: 83,
      cost: 5,
      effect: () => Decimal.pow(1.0004, player.totalTickGained).min(1e30)
    },
    {
      id: 91,
      cost: 4,
      effect: () => Decimal.pow(10, Math.min(player.thisEternity / 100, 18000) / 60)
    },
    {
      id: 92,
      cost: 5,
      effect: () => Decimal.pow(2, 600 / Math.max(player.bestEternity / 100, 20))
    },
    {
      id: 93,
      cost: 7,
      effect: () => Decimal.pow(player.totalTickGained, 0.25).clampMin(1)
    },
    {
      id: 101,
      cost: 4,
      effect: () => Decimal.max(player.replicanti.amount, 1)
    },
    {
      id: 102,
      cost: 6,
      effect: () => Decimal.pow(5, player.replicanti.galaxies)
    },
    {
      id: 103,
      cost: 6,
      effect: () => Math.max(player.replicanti.galaxies, 1)
    },
    {
      id: 111,
      cost: 12
    },
    {
      id: 121,
      cost: 9,
      effect: () => (253 - averageEp.dividedBy(player.epmult.times(10)).clamp(3, 248)) / 5
    },
    {
      id: 122,
      cost: 9,
      effect: () => 35
    },
    {
      id: 123,
      cost: 9,
      effect: () => Math.sqrt(1.39 * Time.thisEternity.totalSeconds)
    },
    {
      id: 131,
      cost: 5
    },
    {
      id: 132,
      cost: 5
    },
    {
      id: 133,
      cost: 5
    },
    {
      id: 141,
      cost: 4,
      effect: () => Decimal.divide(1e45, thisInfinityMult()).clampMin(1)
    },
    {
      id: 142,
      cost: 4,
      effect: () => 1e25
    },
    {
      id: 143,
      cost: 4,
      effect: () => thisInfinityMult()
    },
    {
      id: 151,
      cost: 8
    },
    {
      id: 161,
      cost: 7
    },
    {
      id: 162,
      cost: 7
    },
    {
      id: 171,
      cost: 15
    },
    {
      id: 181,
      cost: 200
    },
    {
      id: 191,
      cost: 400
    },
    {
      id: 192,
      cost: 730
    },
    {
      id: 193,
      cost: 300,
      effect: () => Decimal.pow(1.03, player.eternities).clampMax("1e13000")
    },
    {
      id: 201,
      cost: 900
    },
    {
      id: 211,
      cost: 120
    },
    {
      id: 212,
      cost: 150,
      effect: () => Math.min(Math.pow(player.timeShards.clampMin(2).log2(), 0.005), 1.1)
    },
    {
      id: 213,
      cost: 200
    },
    {
      id: 214,
      cost: 120,
      effect: function() {
        (Sacrifice.totalBoost.pow(8)).min("1e46000").times(Sacrifice.totalBoost.pow(1.1).min(new Decimal("1e125000")))
        const totalBoost = Sacrifice.totalBoost;
        const firstPart = totalBoost.pow(8).clampMax("1e46000");
        const secondPart = totalBoost.pow(1.1).clampMax("1e125000");
        return firstPart.times(secondPart);
      }
    },
    {
      id: 221,
      cost: 900
    },
    {
      id: 222,
      cost: 900
    },
    {
      id: 223,
      cost: 900
    },
    {
      id: 224,
      cost: 900
    },
    {
      id: 225,
      cost: 900,
      effect: () => Math.floor(Replicanti.amount.exponent / 1000)
    },
    {
      id: 226,
      cost: 900,
      effect: () => Math.floor(player.replicanti.gal / 15)
    },
    {
      id: 227,
      cost: 900
    },
    {
      id: 228,
      cost: 900
    },
    {
      id: 231,
      cost: 500
    },
    {
      id: 232,
      cost: 500
    },
    {
      id: 233,
      cost: 500
    },
    {
      id: 234,
      cost: 500
    },
  ];

  const studies = [];
  for (let props of allProps) {
    studies[props.id] = new NormalTimeStudyInfo(props);
  }

  return studies;
}();

/**
 * @returns {NormalTimeStudyInfo}
 */
function TimeStudy(id) {
  return NormalTimeStudyInfo.studies[id];
}

class ECTimeStudyInfo extends TimeStudyInfo {
  constructor(props) {
    super(props);
    this._id = props.id;
    this.type = TimeStudyType.EC;
  }

  get id() {
    return this._id;
  }

  get isBought() {
    return player.eternityChallUnlocked === this._id;
  }
}

ECTimeStudyInfo.studies = [
  {
    id: 1,
    cost: 30
  },
  {
    id: 2,
    cost: 35
  },
  {
    id: 3,
    cost: 40
  },
  {
    id: 4,
    cost: 70
  },
  {
    id: 5,
    cost: 130
  },
  {
    id: 6,
    cost: 85
  },
  {
    id: 7,
    cost: 115
  },
  {
    id: 8,
    cost: 115
  },
  {
    id: 9,
    cost: 415
  },
  {
    id: 10,
    cost: 550
  },
  {
    id: 11,
    cost: 1
  },
  {
    id: 12,
    cost: 1
  }
].map(props => new ECTimeStudyInfo(props));

TimeStudy.eternityChallenge = function(id) {
  return ECTimeStudyInfo.studies[id - 1];
};

class DilationTimeStudy extends TimeStudyInfo {
  constructor(props) {
    super(props);
    this._id = props.id;
    this.type = TimeStudyType.DILATION;
  }

  get isBought() {
    return player.dilation.studies.includes(this._id);
  }
}

DilationTimeStudy.studies = [
  {
    id: 1,
    cost: 5000
  },
  {
    id: 2,
    cost: 1000000
  },
  {
    id: 3,
    cost: 10000000
  },
  {
    id: 4,
    cost: 100000000
  },
  {
    id: 5,
    cost: 1000000000
  },
  {
    id: 6,
    cost: 5000000000
  }
].map(props => new DilationTimeStudy(props));

TimeStudy.dilation = DilationTimeStudy.studies[0];

TimeStudy.timeDimension = function(tier) {
  return DilationTimeStudy.studies[tier - 4];
};

TimeStudy.reality = DilationTimeStudy.studies[5];

class TimeStudyConnection {
  constructor(from, to, override) {
    this._from = from;
    this._to = to;
    this._override = override;
  }

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get isOverridden() {
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}

/**
 * @type {TimeStudyConnection[]}
 */
TimeStudy.allConnections = function() {
  const TS = id => TimeStudy(id);
  const EC = id => TimeStudy.eternityChallenge(id);
  const connections = [
    [TS(11), TS(21)],
    [TS(11), TS(22)],

    [TS(21), TS(31)],
    [TS(21), TS(33)],
    [TS(22), TS(32)],

    [TS(31), TS(41)],
    [TS(32), TS(42)],

    [TS(41), TS(51)],
    [TS(42), TS(51)],
    [TS(42), EC(5)],

    [TS(51), TS(61)],
    [EC(5), TS(62)],

    [TS(61), TS(71)],
    [TS(61), TS(72)],
    [TS(61), TS(73)],

    [TS(71), TS(81)],
    [TS(72), TS(82)],
    [TS(73), TS(83)],

    [TS(81), TS(91)],
    [TS(82), TS(92)],
    [TS(83), TS(93)],

    [TS(91), TS(101)],
    [TS(92), TS(102)],
    [TS(93), TS(103)],

    [TS(101), TS(111)],
    [TS(102), TS(111)],
    [TS(103), TS(111)],

    [TS(111), EC(7)],

    [TS(111), TS(121)],
    [TS(111), TS(122)],
    [TS(111), TS(123)],

    [TS(121), TS(131)],
    [TS(122), TS(132)],
    [TS(123), TS(133)],
    [TS(121), EC(6)],
    [TS(123), EC(8)],

    [TS(131), TS(141)],
    [TS(132), TS(142)],
    [TS(133), TS(143)],

    [TS(141), TS(151)],
    [TS(142), TS(151)],
    [TS(143), TS(151)],
    [TS(143), EC(4)],

    [TS(151), EC(9)],

    [TS(151), TS(161)],
    [TS(151), TS(162)],

    [TS(161), TS(171)],
    [TS(162), TS(171)],

    [TS(171), EC(1)],
    [TS(171), EC(2)],
    [TS(171), EC(3)],

    [EC(1), TS(181)],
    [EC(2), TS(181)],
    [EC(3), TS(181)],

    [TS(181), EC(10)],

    [EC(10), TS(191)],
    [EC(10), TS(192)],
    [EC(10), TS(193)],

    [TS(192), TS(201)],

    [TS(191), TS(211)],
    [TS(191), TS(212)],
    [TS(193), TS(213)],
    [TS(193), TS(214)],

    [TS(211), TS(221)],
    [TS(211), TS(222)],
    [TS(212), TS(223)],
    [TS(212), TS(224)],
    [TS(213), TS(225)],
    [TS(213), TS(226)],
    [TS(214), TS(227)],
    [TS(214), TS(228)],

    [TS(221), TS(231)],
    [TS(222), TS(231)],
    [TS(223), TS(232)],
    [TS(224), TS(232)],
    [TS(225), TS(233)],
    [TS(226), TS(233)],
    [TS(227), TS(234)],
    [TS(228), TS(234)],

    [TS(231), EC(11)],
    [TS(232), EC(11)],
    [TS(233), EC(12)],
    [TS(234), EC(12)],

    [EC(11), TimeStudy.dilation],
    [EC(12), TimeStudy.dilation],

    [TimeStudy.dilation, TimeStudy.timeDimension(5)],
    [TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)],
    [TimeStudy.timeDimension(6), TimeStudy.timeDimension(7)],
    [TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)],
    [TimeStudy.timeDimension(8), TimeStudy.reality]
  ].map(props => new TimeStudyConnection(props[0], props[1], props[2]));

  for (let connection of connections) {
    connection.to.incomingConnections.push(connection);
  }
  return connections;
}();

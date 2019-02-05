// TODO, add more types
//TODO, add more effects for time and effects for dilation and replication and infinity

const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
                           "dilationpow", "powermult", "powerdimboost", "powerbuy10",
                           "dilationTTgen", "infinityinfmult", "infinityipgain", "timeeternity",
                           "dilationdilationMult", "replicationdtgain", "replicationspeed", "timespeed",
                           "timefreeTickMult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
                           "effarigwormhole", "effarigrm", "effarigglyph", "effarigachievement", "effarigforgotten", "effarigdimensions", "effarigantimatter"];


/**
 * More than 3 approx 0.001%
 * More than 2.5 approx 0.2%
 * More than 2 approx 6%
 * More than 1.5 approx 38.43%
 */
function random() {
  let x = Math.sin(player.reality.seed++) * 10000;
  return x - Math.floor(x);
}

function gaussian_bell_curve() { // This function is quite inefficient, don't do it too often
  let u = 0, v = 0;
  let minimumValue = 1;
  let ret = 1;
  if (Perk.glyphRarityIncrease.isBought) minimumValue += 0.125;
  while (ret <= minimumValue || u == 0 || v == 0) {
    u = random();
    v = random();
    ret = Math.pow(Math.max(Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) + 1, 1), 0.65)
  }
  // Each rarity% is 0.025 strength.
  return ret + getGlyphSacEffect("effarig") / 40;
}

// Level is a multiplier based on how far you got on the run, strength is a random bell curve modifier, we could add rarities based on that value (bigger than 3 is pretty rare)
/**
 * @param {number} level
 */
function generateRandomGlyph(level) {
  let type;
  let glyphTypesLength = GLYPH_TYPES.length - 1
  if (Effarig.has(EFFARIG_UNLOCKS.REALITY_COMPLETE)) glyphTypesLength++
  do {
    type = GLYPH_TYPES[Math.floor(random() * glyphTypesLength)]
  } while (player.reality.glyphs.last === type);
  player.reality.glyphs.last = type;
  let strength = gaussian_bell_curve();
  if (player.reality.upg.includes(16)) strength *= 1.3
  let effectAmount = Math.min(Math.floor(Math.pow(random(), 1 - (Math.pow(level * strength, 0.5)) / 100)*1.5 + 1), 4)
  if (player.reality.upg.includes(17) && random() > 0.5) effectAmount = Math.min(effectAmount + 1, 4)
  if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
    type = "power"
    effectAmount = 1
    player.reality.glyphs.last = "power"
  }
  let idx = 0
  let hasglyph = true
  while (hasglyph) {
    console.log(idx)
    let slot = player.reality.glyphs.inventory.find(g => g.idx === idx )
    if (slot !== undefined) idx++;
    else hasglyph = false
  }
  var glyph = {
    id: Date.now(),
    idx: idx,
    type: type,
    strength: strength,
    level: level,
    effects: {}
  }
  return newGlyph(glyph, type, effectAmount)
}

function newGlyph(glyph, type, effectAmount) {
  let effects = []
  while (effects.length < effectAmount) {
    let toAdd;
    switch (type) {
      case "time":
        toAdd = timeEffects[Math.floor(random() * timeEffects.length)];
        break;
      case "dilation":
        toAdd = dilationEffects[Math.floor(random() * dilationEffects.length)];
        break;
      case "replication":
        toAdd = replicationEffects[Math.floor(random() * replicationEffects.length)];
        break;
      case "infinity":
        toAdd = infinityEffects[Math.floor(random() * infinityEffects.length)];
        break;
      case "power":
        toAdd = powerEffects[Math.floor(random() * powerEffects.length)];
        if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) toAdd = "pow"
        break;
      case "effarig":
        toAdd = effarigEffects[Math.floor(random() * effarigEffects.length)];
        break;
    }
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }
  for (let effect of effects) {
    glyph.effects[effect] = getGlyphEffectStrength(type + effect, glyph.level, glyph.strength)
  };
  return glyph
}


// All glyph effects should be calculated here and will be recalculated on-load if rebalanced
function getGlyphEffectStrength(effectKey, level, strength) {
  switch (effectKey) {
    case "powerpow":
      return 1.015 + Math.pow(level, 0.25) * Math.pow(strength, 0.4)/75
    case "powermult":
      return Decimal.pow(level * strength * 10, level * strength * 10)
    case "powerdimboost":
      return Math.pow(level * strength, 0.5)
    case "powerbuy10":
      return 1 + Math.pow(level * strength, 0.8) / 10
    case "infinitypow":
      return 1.007 + Math.pow(level, 0.25) * Math.pow(strength, 0.4)/75
    case "infinityrate":
      return Math.pow(level, 0.25) * Math.pow(strength, 0.4) * 0.1
    case "infinityipgain":
      return Math.pow(level * strength, 5) * 100
    case "infinityinfmult":
      return Math.pow(level * strength, 1.5) * 2
    case "replicationspeed":
      return level * strength * 3
    case "replicationpow":
      return 1.1 + Math.pow(level, 0.5) * strength / 25
    case "replicationdtgain":
      return 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65) // player.replicanti.e * x
    case "replicationglyphlevel":
      return Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5)/50
    case "dilationdilationMult":
      return Math.pow(level * strength, 1.5) * 2
    case "dilationgalaxyThreshold":
      return 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35)/100
    case "dilationTTgen":
      return Math.pow(level * strength, 0.5) / 10000 //Per second
    case "dilationpow":
      return 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7)/25
    case "timepow":
      return 1.01 + Math.pow(level, 0.3) * Math.pow(strength, 0.45)/75
    case "timespeed":
      let ret = 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) * 5 / 100
      if (Enslaved.has(ENSLAVED_UNLOCKS.TIME_EFFECT_MULT)) {
        return ret * Math.max(Math.sqrt(Math.log10(Math.max(Enslaved.totalInfinities, 1))), 1)
      }
      else return ret
    case "timefreeTickMult":
      return 1 - Math.pow(level, 0.18) * Math.pow(strength, 0.35)/100
    case "timeeternity":
      return Math.pow(level * strength, 3) * 100
    case "effarigwormhole":
      return 1.02 + Math.pow(level, 0.3) * Math.pow(strength, 0.5)/75
    case "effarigrm":
      return Math.pow(level, 0.3) * Math.pow(strength, 0.5)
    case "effarigglyph":
      return Math.floor(level * strength / 10);
    case "effarigachievement":
      return 1.1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6)/50
    case "effarigforgotten":
      return 1 + Math.sqrt(level * strength) / 1000
    case "effarigdimensions":
      return level * strength
    case "effarigantimatter":
      return 1 + Math.sqrt(level * strength) / 10000
    default:
      return 0;
  }
}

/**
 * getTotalEffect outputs the softcap status as well; this is just shorthand
 * @param {string} effectKey
 * @return {number | Decimal}
 */
function getAdjustedGlyphEffect(effectKey) {
  return getTotalEffect(effectKey).value;
}

/**
 * Finds all equipped glyphs with the specified effect and returns an array of effect values.
 * @param {string} effectKey
 * @returns {number[]}
 */
function getGlyphEffectValues(effectKey) {
  let separated = separateEffectKey(effectKey);
  let type = separated[0];
  let effect = separated[1];
  let effectDef = GameDatabase.reality.glyphEffects[effectKey];
  if (effectDef === undefined) {
    throw crash(`Unknown glyph effect requested "${effectKey}"'`)
  }
  return player.reality.glyphs.active
    .filter(glyph => glyph.type === type && glyph.effects[effect] !== undefined)
    .map(glyph => glyph.effects[effect]);
}

// Combines all specified glyph effects, reduces some boilerplate
function getTotalEffect(effectKey) {
  return GameDatabase.reality.glyphEffects[effectKey].combine(getGlyphEffectValues(effectKey));
}

function recalculateAllGlyphs() {
  for (let i = 0; i < player.reality.glyphs.active.length; i++) {
    fixGlyph(player.reality.glyphs.active[i]);
  }
  // delete any glyphs that are in overflow spots:
  player.reality.glyphs.inventory = player.reality.glyphs.inventory.filter(
    glyph => glyph.idx < player.reality.glyphs.inventorySize);
  for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
    fixGlyph(player.reality.glyphs.inventory[i]);
  }
}

// Makes sure level is a positive whole number and rarity is >0% (retroactive fixes) and also recalculates effects accordingly
function fixGlyph(glyph) {
  if (glyph.color == undefined && glyph.symbol == undefined) {
    glyph.level = Math.max(1, Math.round(glyph.level));
    if (glyph.strength == 1)
      glyph.strength = gaussian_bell_curve()
    for (let effect in glyph.effects)
      if (glyph.effects.hasOwnProperty(effect)) {
        glyph.effects[effect] = getGlyphEffectStrength(glyph.type + effect, glyph.level, glyph.strength);
      }
  }
}

function getRarity(x) {
  var name, color;
  if (x >= 3.5) return { name: "Celestial", color: "#5151ec" } // ~0.0005%
  if (x >= 3.25) return { name: "Transcendent", color: "#03FFEC" } // ~0.0005%
  if (x >= 3) return { name: "Mythical", color: "#D50000" } // ~0.01%
  if (x >= 2.75) return { name: "Legendary", color:  "#FF9800" } // ~0.1%
  if (x >= 2.5) return { name:  "Epic", color:  "#9C27B0" } // ~0.654%
  if (x >= 2) return { name:  "Rare", color:  "#2196F3" } // ~2.84%
  if (x >= 1.5) return { name:  "Uncommon", color:  "#43A047" }  // ~19%
  if (x >= 1) return { name:  "Common", color:  "white" } // 100%
}

/**
 * key is type+effect
 */
function separateEffectKey(effectKey) {
  let type = "";
  let effect = ""
  for (let i = 0; i < GLYPH_TYPES.length; i++) {
    if (effectKey.substring(0, GLYPH_TYPES[i].length) === GLYPH_TYPES[i]) {
      type = GLYPH_TYPES[i];
      effect = effectKey.substring(GLYPH_TYPES[i].length);
      break;
    }
  }
  return [type, effect]
}

const NUMBERCOLOR = "#85ff85"
const CAPPED_EFFECT_COLOR = "#ff8000"
function getGlyphTooltipDesc(effectKey, x) {
  let spanPrefix = "<span style='color:" + NUMBERCOLOR + "'>"
  let spanSuffix = "</span>"
  let effect = GameDatabase.reality.glyphEffects[effectKey];
  return effect.singleDescSplit[0] + spanPrefix + effect.formatEffect(x) + spanSuffix + effect.singleDescSplit[1];
}

/**
 * @param {string} effectKey
 * @param {GlyphEffectInfo__combine_result} effectStatus
 */
function getGlyphTableDesc(effectKey, effectStatus) {
  let spanPrefix = effectStatus.capped ? "<span style='color:" + CAPPED_EFFECT_COLOR + "'>" : "<span>"
  let spanSuffix = "</span>"
  let effect = GameDatabase.reality.glyphEffects[effectKey];
  return effect.totalDescSplit[0] + spanPrefix + effect.formatEffect(effectStatus.value) +
         spanSuffix + effect.totalDescSplit[1];
}

function getGlyphTooltip(glyph) {
  let tooltipText = "";
  var rarity = getRarity(glyph.strength)
  tooltipText += "<span class='tooltip' style='flex-direction: column'><div style='display: flex;'><span class='glyphraritytext' style='color: "+rarity.color+"; text-shadow: -1px 1px 1px black, 1px 1px 1px black, -1px -1px 1px black, 1px -1px 1px black, 0px 0px 3px "+rarity.color+"; float:left'>"+rarity.name+" glyph of "+glyph.type+" ("+((glyph.strength-1) / 2.5 * 100).toFixed(1)+"%)"+"</span> <span style='margin-left: auto'> Level: "+glyph.level+"</span></div><div style='margin-top: 5px'>"
  for (let i = 0; i < orderedEffectList.length; i++) {
    let separated = separateEffectKey(orderedEffectList[i]);
    let type = separated[0];
    let effect = separated[1];
    if (glyph.type == type && glyph.effects["" + effect] !== undefined) {
      tooltipText += getGlyphTooltipDesc(orderedEffectList[i], glyph.effects[effect]) + "<br><br>"
    }
  }
  if ((player.reality.upg.includes(19) && (glyph.type === "power" || glyph.type === "time")) || player.reality.upg.includes(21)) {
    let gain = glyphSacrificeGain(glyph);
    tooltipText += "<span style='color:#b4b4b4'>Can be sacrificed for " + shorten(gain, 2, 2) + " power</span>";
  }
  tooltipText += "</div></span>"
  return tooltipText;
}

var mouseOn = $("document")
function generateGlyphTable() {
  var table = document.getElementById("glyphs")
  var html = ""

  var glyphs = player.reality.glyphs.inventory
  for (var row=1; row<=10; row++) {
    html += "<tr>"
    for (var cell=1; cell<=10; cell++) {
      var idx = ((row-1)*10 + cell - 1)
      html += "<td>"
      var glyph = glyphs.find(function(glyph) { return glyph.idx == idx })
      if (glyph !== undefined && glyph !== null) {
        if (glyph.color !== undefined)
          html += "<div class='glyphbg' ondragover='allowDrop(event)' ondrop='drop(event)' id='"+idx+"'><div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+glyph.color+" !important; border: 1px solid "+glyph.color+" !important; box-shadow: inset "+glyph.color+" 0px 0px 10px 2px, "+glyph.color+" 0px 0px 10px 2px !important; text-shadow: "+glyph.color+" -1px 1px 2px;' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)' onclick='deleteGlyph("+glyph.id+")'>"
        else
          html += "<div class='glyphbg' ondragover='allowDrop(event)' ondrop='drop(event)' id='"+idx+"'><div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+getRarity(glyph.strength).color+"; text-shadow: "+getRarity(glyph.strength).color+" -1px 1px 2px;"+"' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)' onclick='deleteGlyph("+glyph.id+")'>"
        html += getGlyphTooltip(glyph);
        if (glyph.symbol !== undefined)
          html += specialGlyphSymbols["key"+glyph.symbol]+"</div></div>"
        else
          html += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div></div>"
      } else {
        html += "<div class='glyph empty' id='"+idx+"' ondragover='allowDrop(event)' ondrop='drop(event)'></div>"
      }

      idx++;
      html += "</td>"
    }

    html += "</tr>"
  }

  $("#glyphslots").empty()
  for (var slot=0; slot<player.reality.glyphs.slots; slot++) {
    $("#glyphslots").append('<div id="active'+slot+'"class="glyph glyphactive" ondragover="allowDrop(event)" ondrop="drop(event)"></div>')
    var glyph = player.reality.glyphs.active.find(function(glyph) { return glyph.idx == slot })
    if (glyph !== undefined && glyph !== null) {
      var glyphhtml = ""
      if (glyph.color !== undefined)
        glyphhtml += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+glyph.color+" !important; border: 1px solid "+glyph.color+" !important; box-shadow: inset "+glyph.color+" 0px 0px 10px 2px, "+glyph.color+" 0px 0px 10px 2px !important; text-shadow: "+glyph.color+" -1px 1px 2px;' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)'>"
      else
        glyphhtml += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+getRarity(glyph.strength).color+"; text-shadow: "+getRarity(glyph.strength).color+" -1px 1px 2px;"+"'>"
      glyphhtml += getGlyphTooltip(glyph);
      if (glyph.symbol !== undefined)
        glyphhtml += "</span>"+specialGlyphSymbols["key"+glyph.symbol]+"</div>"
      else glyphhtml += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div>"
      $("#glyphslots").children()[slot].innerHTML = glyphhtml
    }
  }
  table.innerHTML = html

  // Update total effect box (order is specified for consistency
  let isGlyphSoftcapActive = false;
  let allActiveEffects = getActiveGlyphEffects();
  let activeEffectText = "";
  for (let effect of Object.keys(allActiveEffects)) {
    isGlyphSoftcapActive = isGlyphSoftcapActive || allActiveEffects[effect].capped;
    activeEffectText += "<br>" + getGlyphTableDesc(effect, allActiveEffects[effect]);
  };
  if (isGlyphSoftcapActive) {
    activeEffectText = "(<span style='color:"+CAPPED_EFFECT_COLOR+"'>Colored</span> numbers have a reduced effect)<br>" + activeEffectText;
  }
  activeEffectText = "Current Glyph Effects:<br>" + activeEffectText;
  $("#activeGlyphs").html(activeEffectText)
  updateTooltips();
  updateGlyphDescriptions()

  if (glyphs.length == 100) giveAchievement("Personal Space")
  if (glyphs.length == 0 && player.realities >= 100) giveAchievement("Do I really have to do this?")
  if (glyphs.some((g) => g.strength >= 3.5)) giveAchievement("Why did you have to add RNG to the game?")
  if (glyphs.every((g) => g.strength >= 2) && glyphs.length == 100) giveAchievement("I'm up all night to get lucky")
}

// returns both effect value and softcap status
function getActiveGlyphEffects() {
  /** @type{Object.<string, GlyphEffectInfo__combine_result>} */
  let allEffects = {};
  for (let effect of orderedEffectList) {
    let values = getGlyphEffectValues(effect);
    if (values.length > 0) {
      allEffects[effect] = GameDatabase.reality.glyphEffects[effect].combine(values);
    }
  };
  return allEffects;
}

function deleteGlyph(id) {
  var n = player.reality.glyphs.inventory.find(function(glyph) {
    return glyph.id == id
  })

  if (n.symbol === "266b") {
    var tempAudio = new Audio("images/note" + (n.idx % 10 + 1) + ".mp3");
    tempAudio.play();
  }
  if (!shiftDown  && !controlShiftDown) return false;

  if (player.reality.upg.includes(19) && (n.type == "power" || n.type == "time")) {
    sacrificeGlyph(n, controlShiftDown)
    return;
  }

  if (player.reality.upg.includes(21)) {
    sacrificeGlyph(n, controlShiftDown)
    return;
  }


  if (controlShiftDown || confirm("Do you really want to delete this glyph?")) {
    var inv = player.reality.glyphs.inventory
    var g = inv.find(function(glyph) {
      return glyph.id == id
    })
    player.reality.glyphs.inventory.splice(inv.indexOf(g),1)
    mouseOn.remove()
    mouseOn = $("document")
    // for (i in player.reality.glyphs.inventory) {
    //   console.log(id + " id "+player.reality.glyphs.inventory[i].id+" inv id" )
    //   if (id == player.reality.glyphs.inventory[i].id) player.reality.glyphs.inventory.splice(i,1);
    // }
    generateGlyphTable();
  }
}

function drag(ev) {
  var rect = ev.target.getBoundingClientRect()
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.style.opacity = 0.5
  mouseOn.css({"left": "0", "top": "0px", "display": "none"})
  mouseOn.appendTo($(ev.target))
  ev.dataTransfer.setDragImage(ev.target, ev.clientX-rect.left, ev.clientY-rect.top)
  mouseOn = $("document")
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dragover(e) {
  e.target.style.opacity = 1
}

function drop(ev) {
  ev.preventDefault();
  var data = parseInt(ev.dataTransfer.getData("text"));
  if (parseInt(ev.target.id) > 1000) {
    ev.target.style.opacity = 1
    return false
  }

  let canAddGlyph = !Effarig.isRunning || !player.celestials.effarig.glyphEquipped;
  if (ev.target.className.includes("glyphactive") && canAddGlyph) {
    var glyph = player.reality.glyphs.inventory.find(function(glyph) {
      return glyph.id == data
    })
    if (glyph.type == "effarig" && player.reality.glyphs.active.some((g) => g.type == "effarig")) return
    if (glyph !== undefined && glyph !== null) {
      glyph.idx = parseInt(ev.target.id.split("active")[1])
      player.reality.glyphs.inventory.splice(player.reality.glyphs.inventory.indexOf(glyph), 1)
      player.reality.glyphs.active.push(glyph)
    } else {
      var glyph = player.reality.glyphs.active.find(function(glyph) {
        return glyph.id == data
      })
      glyph.idx = parseInt(ev.target.id.split("active")[1])
    }
    
    // Force a maximum of one glyph in Effarig Reality before Eternity
    if (Effarig.isRunning && !Effarig.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)) {
      player.celestials.effarig.glyphEquipped = true
    }
    generateGlyphTable(); // TODO add some CSS stuff that indicates that other slots are blocked I guess
  } else if (!ev.target.className.includes("glyphactive")) {
    var glyph = player.reality.glyphs.active.find(function(glyph) {
      return glyph.id == data
    })
    if (glyph !== undefined && glyph !== null) {
      glyph.idx = parseInt(ev.target.id)
      player.reality.glyphs.active.splice(player.reality.glyphs.active.indexOf(glyph), 1)
      player.reality.glyphs.inventory.push(glyph)
    } else {
      var glyph = player.reality.glyphs.inventory.find(function(glyph) {
        return glyph.id == data
      })
      glyph.idx = parseInt(ev.target.id)
    }
  }
  generateGlyphTable()
  mouseOn.css({"left": "0", "top": "0px", "display": "none"})
  mouseOn.appendTo($(ev.target))
  mouseOn = $("document")
}

const REALITY_UPGRADE_COSTS = [null, 1, 2, 2, 3, 4, 15, 15, 15, 15, 15, 50, 50, 50, 50, 50, 1500, 1500, 1500, 1500, 1500, 1e5, 1e5, 1e5, 1e5, 1e5]
const REALITY_UPGRADE_COST_MULTS = [null, 30, 30, 30, 30, 50,]

function canBuyRealityUpg(id) {
  if (id < 6 && player.reality.realityMachines.lt(REALITY_UPGRADE_COSTS[id] * Math.pow(REALITY_UPGRADE_COST_MULTS[id], player.reality.rebuyables[id]))) return false // Has enough RM accounting for rebuyables
  if (player.reality.realityMachines.lt(REALITY_UPGRADE_COSTS[id])) return false // Has enough RM
  if (player.reality.upg.includes(id)) return false // Doesn't have it already
  if (!player.reality.upgReqs[id]) return false // Has done conditions
  var row = Math.floor( ( id - 1 ) / 5 )
  if (row < 2) return true
  else {
    for (var i = row*5 - 4; i <=row*5; i++) {
      if (!player.reality.upg.includes(i)) return false // This checks that you have all the upgrades from the previous row
    }
  }
  return true
}

function buyRealityUpg(id) {
  if (!canBuyRealityUpg(id)) return false
  if (id < 6) player.reality.realityMachines = player.reality.realityMachines.minus(REALITY_UPGRADE_COSTS[id] * Math.pow(REALITY_UPGRADE_COST_MULTS[id], player.reality.rebuyables[id]))
  else player.reality.realityMachines = player.reality.realityMachines.minus(REALITY_UPGRADE_COSTS[id])
  if (id < 6) player.reality.rebuyables[id]++
  else player.reality.upg.push(id)
  if (id == 9 || id == 24) {
    player.reality.glyphs.slots++
    generateGlyphTable()
  }
  if (id == 20) {
    if (!player.wormhole[0].unlocked) return
    player.wormhole[1].unlocked = true
    $("#whupg2").show()
  }

  if (player.reality.upg.length == REALITY_UPGRADE_COSTS.length - 6) giveAchievement("Master of Reality") // Rebuyables and that one null value = 6
  updateRealityUpgrades()
  if (id == 19 || id == 21) generateGlyphTable();   // Add sacrifice value to tooltips
  updateWormholeUpgrades()
  return true
}

function updateRealityUpgrades() {
  for (let i = 1; i <= $(".realityUpgrade").length - 5; i++) {
    if (!canBuyRealityUpg(i)) $("#rupg" + i).addClass("rUpgUn")
    else $("#rupg" + i).removeClass("rUpgUn")
  }

  player.reality.upgReqs.forEach((check, idx) => {
    if (idx > 0) {
      if (check) $("#rupg" + idx).removeClass("rUpgReqNotMet")
      else $("#rupg" + idx).addClass("rUpgReqNotMet")
    }
  });

  for (let i = 1; i <= $(".realityUpgrade").length - 5; i++) {
    if (player.reality.upg.includes(i)) $("#rupg" + i).addClass("rUpgBought")
    else $("#rupg" + i).removeClass("rUpgBought")
  }

  let row1Mults = [null, 3, 3, 3, 3, 5];
  let row1Costs = [null];
  for (var i = 1; i <= 5; i++) {
    row1Mults[i] = Math.pow(row1Mults[i], player.reality.rebuyables[i]);
    row1Costs.push(shortenDimensions(REALITY_UPGRADE_COSTS[i] * Math.pow(REALITY_UPGRADE_COST_MULTS[i], player.reality.rebuyables[i])));
  }

  $("#rupg1").html("You gain Dilated Time 3 times faster<br>Currently: " + row1Mults[1] + "x<br>Cost: " + row1Costs[1] + " RM")
  $("#rupg2").html("You gain Replicanti 3 times faster<br>Currently: " + row1Mults[2] + "x<br>Cost: " + row1Costs[2] + " RM")
  $("#rupg3").html("You gain 3 times more Eternities<br>Currently: " + row1Mults[3] + "x<br>Cost: " + row1Costs[3] + " RM")
  $("#rupg4").html("You gain 3 times more Tachyon Particles<br>Currently: " + row1Mults[4] + "x<br>Cost: " + row1Costs[4] + " RM")
  $("#rupg5").html("You gain 5 times more Infinities<br>Currently: " + row1Mults[5] + "x<br>Cost: " + row1Costs[5] + " RM")
  $("#rupg12").html("<b>Requires: 1e70 EP without EC1</b><br>EP mult based on Realities and TT, Currently " + shortenRateOfChange(Decimal.max(Decimal.pow(Math.max(player.timestudy.theorem - 1e3, 2), Math.log2(player.realities)), 1)) + "x<br>Cost: 50 RM")
  $("#rupg15").html("<b>Requires: Reach 1e10 EP without purchasing the 5xEP upgrade</b><br>Multiply TP gain based on EP mult, Currently " + shortenRateOfChange(Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1)) + "x<br>Cost: 50 RM")
  $("#rupg22").html("<b>Requires: 1e75 DT</b><br>Growing bonus to TD based on days spent in this Reality, Currently " + shortenRateOfChange(Decimal.pow(10, Math.pow(1 + 2 * Math.log10(player.thisReality / (1000 * 60 * 60 * 24) + 1), 1.6))) + "x<br>Cost: 100,000 RM")
}

function toggleGlyphRespec() {
  player.reality.respec = !player.reality.respec
  if (player.reality.respec) {
    $("#glyphRespec").addClass("rUpgBought")
    document.getElementById("glyphRespec").setAttribute("ach-tooltip", "Respec is active and will place your currently-equipped glyphs into your inventory after reality.");
  }
  else {
    $("#glyphRespec").removeClass("rUpgBought")
    document.getElementById("glyphRespec").setAttribute("ach-tooltip", "Your currently-equipped glyphs will stay equipped on reality.");
  }
}

function respecGlyphs() {
  let idx = 0
  let filledslots = []
  for (let i=0; i<player.reality.glyphs.inventory.length; i++) {
    filledslots[i] = player.reality.glyphs.inventory[i].idx
  }
  for (let i=0; i<player.reality.glyphs.active.length; i++) {
    let glyph = player.reality.glyphs.active[i]
    for (let l=0; l<=100; l++) {
      if (!filledslots.includes(l)) {
        filledslots[filledslots.length] = l;
        idx = l;
        break
      }
    }
    glyph.idx = idx
    player.reality.glyphs.inventory.push(glyph)
  }
  player.reality.glyphs.active = []
  toggleGlyphRespec()
  generateGlyphTable();
}

function getGlyphSacEffect(type) {
  switch(type) {
    case "power":
    return Math.floor(Math.sqrt(player.reality.glyphs.sac[type]) / 2)

    case "infinity":
    return 1 + Math.sqrt(player.reality.glyphs.sac[type]) / 100

    case "time":
    return 1 + Math.sqrt(player.reality.glyphs.sac[type]) / 100

    case "replication":
    return Math.pow(Math.max(player.reality.glyphs.sac[type], 0), 0.75)

    case "dilation":
    return Math.pow(Math.max(player.reality.glyphs.sac[type], 1), 0.4)

    case "effarig":
    return 5 * Math.log10(player.reality.glyphs.sac[type] / 1e5 + 1)
  }
}

function getGlyphSacDescription(type) {
  let amount = getGlyphSacEffect(type)
  let total = shorten(player.reality.glyphs.sac[type], 2, 2)
  if (player.reality.glyphs.sac[type] == 0) return ""
  switch(type) {
    case "power": {
      let nextDistantGalaxy = Math.pow(2 * (amount + 1), 2);
      return "Total power of " + type + " glyphs sacrificed: " + total + "<br>Remote galaxies start " + amount + " later (next at " + shorten(nextDistantGalaxy, 2, 2) + ")<br><br>"
    }
    case "infinity":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>" + amount.toPrecision(4) + "x bigger multiplier when buying 8th Infinity Dimension.<br><br>"

    case "time":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>" + amount.toPrecision(4) + "x bigger multiplier when buying 8th Time Dimension.<br><br>"

    case "replication":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>Raise maximum Replicanti chance cap by +" + (100*(getMaxReplicantiChance() - 1)).toFixed(0) + "%<br><br>"

    case "dilation":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>Multiply Tachyon Particle gain by " + shorten(amount, 2, 2) + "x<br><br>"

    case "effarig":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>+" + amount.toFixed(2) + "% additional glyph rarity<br><br>"
  }
}

function glyphSacrificeGain(glyph) {
  let gain = glyph.level * glyph.strength;
  if (glyph.type === 'effarig') {
    gain *= Math.pow(Teresa.runRewardMultiplier, 0.2);
  } else {
    gain *= Teresa.runRewardMultiplier;
  }
  return gain;
}

function sacrificeGlyph(glyph, force = false) {
  let toGain = glyphSacrificeGain(glyph);
  if (!force && !confirm("Do you really want to sacrifice this glyph? Your total power of sacrificed " + glyph.type + " glyphs will increase to " + (player.reality.glyphs.sac[glyph.type] + toGain).toFixed(2))) return
  player.reality.glyphs.sac[glyph.type] += toGain
  if (glyph.type == "time") player.timeDimension8.power = Decimal.pow(2 * getGlyphSacEffect("time"), player.timeDimension8.bought)
  if (glyph.type == "infinity") player.infinityDimension8.power = Decimal.pow(5 * getGlyphSacEffect("infinity"), IDAmountToIDPurchases(player.infinityDimension8.baseAmount))
  let inv = player.reality.glyphs.inventory
  let g = inv.find(function(x) {
    return x.id == glyph.id
  })
  inv.splice(inv.indexOf(g),1)
  mouseOn.remove()
  mouseOn = $("document")
  generateGlyphTable();

  if (glyph.strength >= 3.25) giveAchievement("Transcension sucked anyway")
  if (glyph.strength >= 3.5) giveAchievement("True Sacrifice")
}

function updateGlyphDescriptions() {
  let html = "Glyph Sacrifice Effects:<br><br>"
  for (let i in player.reality.glyphs.sac) {
    html += getGlyphSacDescription(i)
  }
  $("#sacrificedGlyphs").html(html)
}

function updateTooltips() {
  $(".tooltip").parent(".glyph").off("mousemove").mousemove(function(e) {
    mouseOn.css({"left": e.pageX-150 + "px", "top": e.pageY-mouseOn.height()-35 + "px", "display": "flex"})
  })
  $(".tooltip").parent(".glyph").off("mouseenter").mouseenter(function(e) {
    e.stopPropagation();
    mouseOn = $(this).find(".tooltip")
    mouseOn.appendTo("body")
  })

  $(".tooltip").parent(".glyph").off("mouseleave").mouseleave(function(e) {
    e.stopPropagation();
    mouseOn.css({"left": "0", "top": "0px", "display": "none"})
    mouseOn.appendTo($(this))
    mouseOn = $("document")
  })
}

function getGlyphLevelInputs() {
  // Glyph levels are the product of 3 or 4 sources (eternities are enabled via upgrade).
  // Once Effarig is unlocked, these contributions can be adjusted; the math is described in detail
  // below. These *Base values are the nominal inputs, as they would be multiplied without Effarig
  let epBase = Math.pow(player.eternityPoints.e / 4000, 0.5);
  // @ts-ignore
  var replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  // 0.025148668593658708 comes from 1/Math.sqrt(100000 / Math.sqrt(4000)), but really, the
  // factors assigned to repl and dt can be arbitrarily tuned
  let replBase = Math.pow(player.replicanti.amount.e, replPow) * 0.02514867;
  let dtBase = player.dilation.dilatedTime.exponent ?
    Math.pow(player.dilation.dilatedTime.log10(), 1.3) * 0.02514867 : 0;
  let eterBase = player.reality.upg.includes(18) ?
    Math.max(Math.sqrt(Math.log10(player.eternities)) * 0.45,1) : 1;
  // If the nomial blend of inputs is a * b * c * d, then the contribution can be tuend by
  // changing the exponents on the terms: aⁿ¹ * bⁿ² * cⁿ³ * dⁿ⁴
  // If n1..n4 just add up to 4, then the optimal strategy is to just max out the one over the
  // largest term -- so probably replicants, So, instead of using the weights directly, a
  // function of the weights is used: n_i = (4 w_i)^blendExp; put differently, the exponents
  // don't add up to 4, but their powers do (for blendExp = 1/3, the cubes of the exponents sum to
  // 4.
  // The optimal weights, given a blendExp, are proportional to log(x)^(1/(1- blendExp))
  const blendExp = 1/3;
  // Besides adding an exponent to a, b, c, and d, we can also scale them before exponentiation.
  // So, we'd have (s a)ⁿ¹ * (s b)ⁿ² * (s c)ⁿ³ * (s d)ⁿ⁴
  // Then, we can divide the result by s⁴; this does nothing for even weights
  // This can reduce the effect that Effarig can have; consider the following examples:
  // Inputs : 100, 1, 1, 1. Nominal result : 100
  // blendExp = 1/3; optimal weights: 1, 0, 0, 0; result = 1493
  // Scaling by 100: 10000, 100, 100, 100
  //                 optimal weights: 0.485, 0.17, 0.17, 0.17; result = 191.5
  // The degree of this effect depends on the scale of the inputs:
  // Inputs: 1000, 1, 1, 1. Nominal result: 1000
  //                 optimal weights: 1, 0, 0, 0; result = 57836
  // Scaling by 100: 100000, 100, 100, 100
  //                 optimal weights: 0.57, 0.14, 0.14, 0.14; result = 3675
  // Scaling does allow the user to produce results less than 1
  // 100000, 100, 100, 100 with weights of 0, 1, 0, 0 results in 1.49e-5
  // For display purposes, each term is divided independently by s.
  const preScale = 5;
  let weights =  player.celestials.effarig.glyphWeights;
  var adjustFactor = (input, weight) => input > 0 ? Math.pow(input * preScale, Math.pow(4 * weight, blendExp)) / preScale : 0;
  var epEffect = adjustFactor(epBase, weights.ep / 100);
  var replEffect = adjustFactor(replBase, weights.repl / 100);
  var dtEffect = adjustFactor(dtBase, weights.dt / 100);
  var eterEffect = adjustFactor(eterBase, weights.eternities / 100);
  // With begin = 1000 and rate = 250, a base level of 2000 turns into 1500; 4000 into 2000
  const glyphScaleBegin = 1000 + getAdjustedGlyphEffect("effarigglyph");
  const glyphScaleRate = 500;
  var glyphBaseLevel = epEffect * replEffect * dtEffect * eterEffect * player.celestials.teresa.glyphLevelMult;
  var glyphScalePenalty = 1;
  var glyphScaledLevel = glyphBaseLevel;
  if (glyphBaseLevel > glyphScaleBegin) {
    var excess = (glyphBaseLevel - glyphScaleBegin) / glyphScaleRate;
    glyphScaledLevel = glyphScaleBegin + 0.5*glyphScaleRate*(Math.sqrt(1 + 4*excess)-1);
    glyphScalePenalty = glyphBaseLevel / glyphScaledLevel;
  }
  let perkFactor = Effects.sum(
    Perk.glyphLevelIncrease1,
    Perk.glyphLevelIncrease2
  );
  return {
    epEffect: epEffect,
    replEffect: replEffect,
    dtEffect: dtEffect,
    eterEffect: eterEffect,
    perkShop: player.celestials.teresa.glyphLevelMult,
    scalePenalty: glyphScalePenalty,
    perkFactor: perkFactor,
    finalLevel: glyphScaledLevel + perkFactor,
  };
}

class GlyphEffectState {
  constructor(id, props) {
    this._id = id;
    this._adjustApply = props.adjustApply;
  }

  applyEffect(applyFn) {
    let effectValue = getAdjustedGlyphEffect(this._id);
    if (this._adjustApply !== undefined) {
      effectValue = this._adjustApply(effectValue);
    }
    applyFn(effectValue);
  }
}

const GlyphEffect = {
  dimBoostPower: new GlyphEffectState("powerdimboost", {
    adjustApply: value => Math.max(1, value)
  }),
  ipMult: new GlyphEffectState("infinityipgain", {
    adjustApply: value => Decimal.max(1, value)
  }),
  epMult: new GlyphEffectState("timeeternity", {
    adjustApply: value => Decimal.max(1, value)
  })
};


// TODO, add more types
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power"]
const GLYPH_SYMBOLS = {time:"Δ", dilation:"Ψ", replication:"Ξ", infinity:"∞", power:"Ω"}

/**
 * pow is for exponent on time dim multiplier (^1.02) or something like that
 * speed is for multiplied game speed
 * freeTickMult reduces the threshold between free tickspeed upgrades (Math.pow(multiplier, 1/x))
 * eternity is a static multiplier on EP gain NOT SURE IF THIS IS GOOD
 */
const timeEffects = ["pow", "speed", "freeTickMult", "eternity"]

/**
 * dilationMult multiplies dilation gain
 * 
 * galaxy threshold reduce free galaxy threshold multiplier
 * 
 * TTgen generates slowly TT, amount is per second.
 * 
 * pow: normal dim multipliers ^ x while dilated
 */
const dilationEffects = ["dilationMult", "galaxyThreshold", "TTgen", "pow"]

/**
 * 
 * replSpeed increases replication speed
 * 
 * pow raises repl mult to a power
 * 
 * replgain multiplies DT gain by replicanti amount ^ something
 * 
 * glyphlevel increases glyph level scaling from replicantis
 */
const replicationEffects = ["speed", "pow", "dtgain", "glyphlevel"]

/**
 * pow: inf dim mult ^ x
 * rate: inf power conversion rate, ^(7+x)
 * ipgain: ip gain ^ x
 * infMult: multiplier to Infinitied stat gain
 * 
 */
const infinityEffects = ["pow", "rate", "ipgain", "infmult"]

/**
 * pow: dim mult ^ x
 * mult: normal dim mult
 * dimboost: multiply dim boost effect
 * autochall: do challenges automatically.
 */
const powerEffects= ["pow", "mult", "dimboost", "buy10"]

//TODO, add more effects for time and effects for dilation and replication and infinity




function estimate_curve(iterations, moreThan) {
  min = 2
  max = 0
  over = 0
  for (var i=0; i< iterations; i++) {
    var x = gaussian_bell_curve()
    if (min > x) min = x
    if (max < x) max = x
    if (x > moreThan) over++
  }
  console.log("Maximum value of: " + max)
  console.log("Over" + moreThan +" percentage: "+(over / i * 100)+"%")
}

/**
 * More than 3 approx 0.001%
 * More than 2.5 approx 0.2%
 * More than 2 approx 6%
 * More than 1.5 approx 38.43%
 */
function random() {
  var x = Math.sin(player.reality.seed++) * 10000;
  return x - Math.floor(x);
}

function gaussian_bell_curve() { // This function is quite inefficient, don't do it too often
  var u = 0, v = 0;
  var minimumValue = 1
  var ret = 1
  if (player.reality.perks.includes(23)) minimumValue = 1.1
  while (ret <= minimumValue || u == 0 || v == 0) {
    u = random(); 
    v = random();
    ret = Math.pow(Math.max(Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) + 1, 1), 0.65)
  }
  return ret;
}

// Level is a multiplier based on how far you got on the run, strength is a random bell curve modifier, we could add rarities based on that value (bigger than 3 is pretty rare)
function generateRandomGlyph(level) {
  var type = GLYPH_TYPES[Math.floor(random() * GLYPH_TYPES.length)]
  for (var i=0; player.reality.glyphs.last === type; i++) {
    type = GLYPH_TYPES[Math.floor(random() * GLYPH_TYPES.length)]
  }
  player.reality.glyphs.last = type;
  var strength = gaussian_bell_curve()
  if (player.reality.upg.includes(16)) strength *= 1.3
  var effectAmount = Math.min(Math.floor(Math.pow(random(), 1 - (Math.pow(level * strength, 0.5)) / 100)*1.5 + 1), 4)
  if (player.reality.upg.includes(17) && random() > 0.5) effectAmount = Math.min(effectAmount + 1, 4)
  if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
    type = "power"
    effectAmount = 1
    player.reality.glyphs.last = "power"
  }
  var idx = 0
  var hasglyph = true
  while (hasglyph) {
    console.log(idx)
    var slot = player.reality.glyphs.inventory.find(function(g) { return g.idx == idx })
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
  switch(type) {
    case "time":
      return timeGlyph(glyph, effectAmount)
      break;

    case "dilation":
      return dilationGlyph(glyph, effectAmount)
      break;

    case "replication":
      return replicationGlyph(glyph, effectAmount)
      break;

    case "infinity":
      return infinityGlyph(glyph, effectAmount)
      break;

    case "power":
      return powerGlyph(glyph, effectAmount)
      break;
  }
}

function timeGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = timeEffects[Math.floor(random() * timeEffects.length)]
    console.log(toAdd)
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1.01 + Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.45)/75
        break;

      case "speed":
        glyph.effects.speed = 1 + Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.65) * 5 / 100
        break;

      case "freeTickMult":
        glyph.effects.freeTickMult = 1 - Math.pow(glyph.level, 0.18) * Math.pow(glyph.strength, 0.35)/100
        break;
        
      case "eternity":
        glyph.effects.eternity = Math.pow(glyph.level * glyph.strength, 3) * 100
        break;
    }
  }
  return glyph
}

function dilationGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = dilationEffects[Math.floor(random() * dilationEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "dilationMult":
        glyph.effects.dilationMult = Math.pow(glyph.level * glyph.strength, 1.5) * 2
        break;

      case "galaxyThreshold":
        glyph.effects.galaxyThreshold = 1 - Math.pow(glyph.level, 0.17) * Math.pow(glyph.strength, 0.35)/100
        break;

      case "TTgen":
        glyph.effects.TTgen = Math.pow(glyph.level * glyph.strength, 0.5) / 10000 //Per second
        break;
        
      case "pow":
        glyph.effects.pow = 1.1 + Math.pow(glyph.level, 0.7) * Math.pow(glyph.strength, 0.7)/25
        break;
    }
  }
  return glyph
}

function replicationGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = replicationEffects[Math.floor(random() * replicationEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "speed":
        glyph.effects.speed = glyph.level * glyph.strength * 3
        break;

      case "pow":
        glyph.effects.pow = 1.1 + Math.pow(glyph.level, 0.5) * glyph.strength / 25
        break;

      case "dtgain":
        glyph.effects.dtgain = 0.0003 * Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.65) // player.replicanti.e * x
        break;
        
      case "glyphlevel":
        glyph.effects.glyphlevel = Math.pow(Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4), 0.5)/50
        break;
    }
  }
  return glyph
}

function infinityGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = infinityEffects[Math.floor(random() * infinityEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1.007 + Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4)/75
        break;

      case "rate":
        glyph.effects.rate = Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4) * 0.1
        break;

      case "ipgain":
        glyph.effects.ipgain = Math.pow(glyph.level * glyph.strength, 5) * 100
        break;
        
      case "infmult":
        glyph.effects.infmult = Math.pow(glyph.level * glyph.strength, 1.5) * 2
        break;
    }
  }
  return glyph
}

function powerGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = powerEffects[Math.floor(random() * powerEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }
  if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
    effects = ["pow"]
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1.015 + Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4)/75
        break;

      case "mult":
        glyph.effects.mult = Decimal.pow(glyph.level * glyph.strength * 10, glyph.level * glyph.strength * 10)
        break;

      case "dimboost":
        glyph.effects.dimboost = Math.pow(glyph.level * glyph.strength, 0.5)
        break;
        
      case "buy10":
        glyph.effects.buy10 = 1 + Math.pow(glyph.level * glyph.strength, 0.8) / 10
        break;
    }
  }
  return glyph
}

function getRarity(x) {
  var name, color;
  if (x >= 3) return { name: "Perfect", color: "#FFE57F" } // ~0.0005%
  if (x >= 2.75) return { name: "Mythical", color: "#D50000" } // ~0.01%
  if (x >= 2.5) return { name: "Legendary", color:  "#FF9800" } // ~0.1%
  if (x >= 2.25) return { name:  "Epic", color:  "#9C27B0" } // ~0.654%
  if (x >= 2) return { name:  "Rare", color:  "#2196F3" } // ~2.84%
  if (x >= 1.5) return { name:  "Uncommon", color:  "#43A047" }  // ~19%
  if (x >= 1) return { name:  "Common", color:  "white" } // 100%
}

/**
 * key is type+effect
 */

const NUMBERCOLOR = "#85ff85"
function getDesc(typeeffect, x, coloredNumber) {
  let spanPrefix = "<span style='color:"+NUMBERCOLOR+"'>"
  let spanSuffix = "</span>"
  const EFFECT_DESCRIPTIONS = {
    timepow: "Time dimension multipliers ^" + spanPrefix + x.toFixed(3) + spanSuffix,
    timespeed: "Multiply game speed by " + spanPrefix + x.toFixed(3) + spanSuffix,
    timefreeTickMult: "Free tickspeed threshold multiplier x" + spanPrefix + x.toFixed(3) + spanSuffix,
    timeeternity: "Multiply EP gain by " + spanPrefix + shortenDimensions(x) + spanSuffix,
    dilationdilationMult: "Multiply dilated time gain by " + spanPrefix + shortenDimensions(x) + spanSuffix,
    dilationgalaxyThreshold: "Free galaxy threshold multiplier x" + spanPrefix + x.toFixed(3) + spanSuffix,
    dilationTTgen: "Generates " + spanPrefix + (3600*x).toFixed(2) + spanSuffix + " TT per hour",
    dilationpow: "Normal dimension multipliers <br>^" + spanPrefix + x.toFixed(3) + spanSuffix + " while dilated",
    replicationspeed: "Multiply replication speed by " + spanPrefix + shortenDimensions(x) + spanSuffix,
    replicationpow: "Replicanti multiplier ^" + spanPrefix + x.toFixed(3) + spanSuffix,
    replicationdtgain: "Multiply DT gain by <br>log10(replicanti) x" + spanPrefix + x.toFixed(5) + spanSuffix,
    replicationglyphlevel: "Replicanti scaling for next glyph level: <br>^0.4 -> ^(0.4 + " + spanPrefix + x.toFixed(3) + spanSuffix + ")",
    infinitypow: "Infinity dimension multipliers ^" + spanPrefix + x.toFixed(3) + spanSuffix,
    infinityrate: "Infinity power conversion rate: <br>^7 -> ^(7 + " + spanPrefix + x.toFixed(2) + spanSuffix + ")",
    infinityipgain: "Multiply IP gain by " + spanPrefix + shortenDimensions(x) + spanSuffix,
    infinityinfmult: "Multiply infinitied stat gain by " + spanPrefix + shortenDimensions(x) + spanSuffix,
    powerpow: "Normal dimension multipliers ^" + spanPrefix + x.toFixed(3) + spanSuffix,
    powermult: "Normal dimension multipliers x" + spanPrefix + shortenDimensions(x) + spanSuffix,
    powerdimboost: "Dimension boost multiplier x" + spanPrefix + x.toFixed(2) + spanSuffix,
    powerbuy10: "Multiplies the bonus gained from buying 10 dimensions by " + spanPrefix + x.toFixed(2) + spanSuffix
  }
  
  // Used for total glyph effects, slightly reworded/shortened
  const EFFECT_DESCRIPTIONS_SHORT = {
    timepow: "Time dimension multipliers ^" + x.toFixed(3),
    timespeed: "Game runs x" + x.toFixed(3) + " faster",
    timefreeTickMult: "Free tickspeed threshold multiplier x" + x.toFixed(3),
    timeeternity: "EP gain x" + shortenDimensions(x),
    dilationdilationMult: "DT gain x" + shortenDimensions(x),
    dilationgalaxyThreshold: "Free galaxy threshold multiplier x" + x.toFixed(3),
    dilationTTgen: "Generating " + (3600*x).toFixed(2) + " TT per hour",
    dilationpow: "Normal dimension multipliers ^" + x.toFixed(3) + " while dilated",
    replicationspeed: "Replication speed x" + shortenDimensions(x),
    replicationpow: "Replicanti multiplier ^" + x.toFixed(3),
    replicationdtgain: "DT gain from log10(replicanti) x" + x.toFixed(5),
    replicationglyphlevel: "Replicanti scaling for next glyph level: ^0.4 -> ^(0.4 + " + x.toFixed(3) + ")",
    infinitypow: "Infinity dimension multipliers ^" + x.toFixed(3),
    infinityrate: "Infinity power conversion rate ^7 -> ^(7 + " + x.toFixed(2) + ")",
    infinityipgain: "IP gain x" + shortenDimensions(x),
    infinityinfmult: "Infinity stat gain x" + shortenDimensions(x),
    powerpow: "Normal dimension multipliers ^" + x.toFixed(3),
    powermult: "Normal dimension multipliers x" + shortenDimensions(x),
    powerdimboost: "Dimension boost multiplier x" + x.toFixed(2),
    powerbuy10: "Multiplier from \"Buy 10\" x" + x.toFixed(2)
  }

  if (coloredNumber)  // Assuming non-colored number text will always be put in the total glyph box
    return EFFECT_DESCRIPTIONS[typeeffect]
  else
    return EFFECT_DESCRIPTIONS_SHORT[typeeffect]
}

function getGlyphTooltip(glyph) {
  let tooltipText = "";
  var rarity = getRarity(glyph.strength)
  tooltipText += "<span class='tooltip'><span class='glyphraritytext' style='color: "+rarity.color+"; float:left'>"+rarity.name+" glyph of "+glyph.type+" ("+((glyph.strength-1) / 2 * 100).toFixed(1)+"%)"+"</span> <span style='float: right'> Level: "+glyph.level+"</span><br><br>"
  for (i in glyph.effects)
    tooltipText += getDesc(glyph.type + i, glyph.effects[i], true) +" <br><br>"
  if (player.reality.upg.includes(19) && (glyph.type === "power" || glyph.type === "time"))
    tooltipText += "<span style='color:#b4b4b4'>Can be sacrificed for " + (glyph.level * glyph.strength).toFixed(2) + " power</span>";
  tooltipText += "</span>"
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
  
  // Update total effect box
  let allActiveEffects = getTotalGlyphEffects();
  let activeEffectText = "Current Glyph Effects:<br>";
  for (let effect in allActiveEffects)
    activeEffectText += "<br>" + getDesc(effect, allActiveEffects[effect], false);
  $("#activeGlyphs").html(activeEffectText)
  updateTickSpeed();

  $(".tooltip").parent(".glyph").mousemove(function(e) {
    mouseOn.css({"left": e.pageX-150 + "px", "top": e.pageY-mouseOn.height()-35 + "px", "display": "block"})
  })
  var that = this
  $(".tooltip").parent(".glyph").mouseenter(function(e) {
    e.stopPropagation();
    mouseOn = $(this).find(".tooltip")
    mouseOn.appendTo("#body")
  })

  $(".tooltip").parent(".glyph").mouseleave(function(e) {
    e.stopPropagation();
    mouseOn.css({"left": "0", "top": "0px", "display": "none"})
    mouseOn.appendTo($(this))
    mouseOn = $("document")
  })

  updateGlyphDescriptions()
}

function getTotalGlyphEffects() {
  let activeGlyphs = player.reality.glyphs.active;
  let allEffects = {};
  for (let i = 0; i < activeGlyphs.length; i++) {
    let currGlyph = activeGlyphs[i];
    for (let effect in currGlyph.effects) {
      uniqueEffect = currGlyph.type + effect;
      if (currGlyph.effects.hasOwnProperty(effect))
        if (allEffects[uniqueEffect] == undefined)
          allEffects[uniqueEffect] = currGlyph.effects[effect];
        else {  // Combine the effects appropriately (some are additive)
          if (uniqueEffect === "replicationglyphlevel" || uniqueEffect === "dilationTTgen" || uniqueEffect === "infinityrate" || uniqueEffect === "replicationdtgain")
            allEffects[uniqueEffect] += currGlyph.effects[effect];
          else if (uniqueEffect === "powermult") // This is a Decimal
            allEffects[uniqueEffect] = allEffects[uniqueEffect].times(currGlyph.effects[effect]);
          else
            allEffects[uniqueEffect] *= currGlyph.effects[effect];
        }
    }
  }
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
  if (!shiftDown) return false;

  if (player.reality.upg.includes(19) && (n.type == "power" || n.type == "time")) {
    sacrificeGlyph(n)
    return;
  }

  if (player.reality.upg.includes(21)) {
    sacrificeGlyph(n)
    return;
  }


  if (controlDown || confirm("Do you really want to delete this glyph?")) {
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
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.style.opacity = 0.5
  mouseOn.css({"left": "0", "top": "0px", "display": "none"})
  mouseOn.appendTo($(ev.target))
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

  if (ev.target.className.includes("glyphactive")) {
    var glyph = player.reality.glyphs.inventory.find(function(glyph) {
      return glyph.id == data
    })
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
  } else {
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
  updateRealityUpgrades()
  return true
}

function updateRealityUpgrades() {
  for (var i = 1; i <= $(".realityUpgrade").length-5; i++) {
    if (!canBuyRealityUpg(i)) $("#rupg"+i).addClass("rUpgUn")
    else $("#rupg"+i).removeClass("rUpgUn")
  }

  for (i in player.reality.upgReqs) {
    if (i == 0) continue
    var check = player.reality.upgReqs[i]
    if (check) $("#rupg"+i).removeClass("rUpgReqNotMet")
    else $("#rupg"+i).addClass("rUpgReqNotMet")
  }

  for (var i = 1; i <= $(".realityUpgrade").length-5; i++) {
    if (player.reality.upg.includes(i)) $("#rupg"+i).addClass("rUpgBought")
    else $("#rupg"+i).removeClass("rUpgBought")
  }
  
  row1Mults = [null, 3, 3, 3, 3, 5];
  row1Costs = [null];
  for (var i = 1; i <= 5; i++) {
	  row1Mults[i] = Math.pow(row1Mults[i], player.reality.rebuyables[i]);
	  row1Costs.push(shortenDimensions(REALITY_UPGRADE_COSTS[i] * Math.pow(REALITY_UPGRADE_COST_MULTS[i], player.reality.rebuyables[i])));
  }

  $("#rupg1").html("You gain dilated time 3 times faster<br>Currently: "+ row1Mults[1] +"x<br>Cost: "+row1Costs[1]+" RM")
  $("#rupg2").html("You gain replicanti 3 times faster<br>Currently: "+ row1Mults[2] +"x<br>Cost: "+row1Costs[2]+" RM")
  $("#rupg3").html("You gain 3 times more eternities<br>Currently: "+ row1Mults[3] +"x<br>Cost: "+row1Costs[3]+" RM")
  $("#rupg4").html("You gain 3 times more Tachyon Particles<br>Currently: "+ row1Mults[4] +"x<br>Cost: "+row1Costs[4]+" RM")
  $("#rupg5").html("You gain 5 times more infinities<br>Currently: "+ row1Mults[5] +"x<br>Cost: "+row1Costs[5]+" RM")
  $("#rupg12").html("<b>Requires: 1e70 EP without EC1</b><br>EP mult based on realities and TT, Currently "+shorten(Decimal.max(Decimal.pow(Math.max(player.timestudy.theorem - 1e3, 2), Math.log2(player.realities)), 1))+"x<br>Cost: 50 RM")
  $("#rupg15").html("<b>Requires: Reach 1e10 EP without EP multipliers (test)</b><br>Multiply TP gain based on EP mult, Currently "+shorten(Math.max(Math.sqrt(Decimal.log10(player.epmult)) / 3, 1))+"x<br>Cost: 50 RM")
  $("#rupg22").html("<b>Requires: 1e85 DT</b><br>Exponential bonus to TD based on days spent in this reality, Currently "+shorten(Decimal.pow(8,  Math.pow(player.thisReality / (1000 * 60 * 60 * 24), 0.4)))+"x<br>Cost: 100,000 RM")
}

$(".tooltip").parent().mousemove(function(e) {
  mouseOn.css({"left": e.pageX-150 + "px", "top": e.pageY-mouseOn.height()-35 + "px", "display": "block"})
})
$(".tooltip").parent().mouseenter(function(e) {
  e.stopPropagation();
  mouseOn = $(this).find(".tooltip")
  mouseOn.appendTo("#body")
})

$(".tooltip").parent().mouseleave(function(e) {
  e.stopPropagation();
  mouseOn.css({"left": "0", "top": "0px", "display": "none"})
  mouseOn.appendTo($(this))
  mouseOn = $("document")
})

function toggleGlyphRespec() {
  player.reality.respec = !player.reality.respec
  if (player.reality.respec) {
	  $("#glyphRespec").addClass("rUpgBought")
	  document.getElementById("glyphRespec").setAttribute('ach-tooltip', "Respec is active and will place your currently-equipped glyphs into your inventory after reality.");
  }
  else {
	  $("#glyphRespec").removeClass("rUpgBought")
	  document.getElementById("glyphRespec").setAttribute('ach-tooltip', "Your currently-equipped glyphs will stay equipped on reality.");
  }
}

function respecGlyphs() {
  var idx = 0
  var filledslots = []
  for (var i=0; i<player.reality.glyphs.inventory.length; i++) {
    filledslots[i] = player.reality.glyphs.inventory[i].idx
  }
  for (var i=0; i<player.reality.glyphs.active.length; i++) {
    var glyph = player.reality.glyphs.active[i]
    for (var l=0; l<=100; l++) {
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
    return Math.pow(Math.max(player.reality.glyphs.sac[type], 1), 0.75)

    case "dilation":
    return Math.pow(Math.max(player.reality.glyphs.sac[type], 1), 0.4)
  }
}

function getGlyphSacDescription(type) {
  let amount = getGlyphSacEffect(type)
  let total = shorten(player.reality.glyphs.sac[type])
  if (player.reality.glyphs.sac[type] == 0) return ""
  switch(type) {
    case "power":
    let nextDistantGalaxy = Math.pow(2*(amount + 1), 2);
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>Distant galaxies start " + amount + " later (next at " + nextDistantGalaxy.toFixed(0) + ")<br><br>"

    case "infinity":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>" + amount.toPrecision(4) + "x bigger multiplier when buying 8th infinity dimension.<br><br>"

    case "time":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>" + amount.toPrecision(4) + "x bigger multiplier when buying 8th time dimension.<br><br>"

    case "replication":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>Raise maximum replicanti chance cap by +" + Math.floor(amount) + "%<br><br>"

    case "dilation":
    return "Total power of "+type+" glyphs sacrificed: " + total + "<br>Multiply Tachyon Particle gain by " + shorten(amount) + "x<br><br>"
  }
}

function sacrificeGlyph(glyph) {
  let toGain = glyph.level * glyph.strength;
  if (!confirm("Do you really want to sacrifice this glyph? Your total power of sacrificed " + glyph.type + " glyphs will increase to " + (player.reality.glyphs.sac[glyph.type] + toGain).toFixed(2))) return
  player.reality.glyphs.sac[glyph.type] += toGain
  if (glyph.type == "time") player.timeDimension8.power = Decimal.pow(2 * getGlyphSacEffect("time"), player.timeDimension8.bought)
  if (glyph.type == "infinity") player.infinityDimension8.power = Decimal.pow(5 * getGlyphSacEffect("infinity"), player.infinityDimension8.baseAmount / 10)
  let inv = player.reality.glyphs.inventory
  let g = inv.find(function(x) {
    return x.id == glyph.id
  })
  inv.splice(inv.indexOf(g),1)
  mouseOn.remove()
  mouseOn = $("document")
  generateGlyphTable();
}

function updateGlyphDescriptions() {
  let html = ""
  for (let i in player.reality.glyphs.sac) {
    html += getGlyphSacDescription(i)
  }
  $("#sacrificedGlyphs").html(html)
}
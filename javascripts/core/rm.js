
// TODO, add more types
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "normal"]
const GLYPH_SYMBOLS = {time:"Δ", dilation:"Ψ", replication:"Ξ", infinity:"∞", normal:"Ω"}

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
const infinityEffects = ["pow", "rate", "ipgain", "infMult"]

/**
 * pow: dim mult ^ x
 * mult: normal dim mult
 * dimboost: multiply dim boost effect
 * autochall: do challenges automatically.
 */
const normalEffects= ["pow", "mult", "dimboost", "autochall"]

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
 * More than 3 approx 0.0005%
 * More than 2.5 approx 0.1%
 * More than 2 approx 3%
 * More than 1.5 approx 19.215
 * Exactly 1 approx 50%
 */
function gaussian_bell_curve() { // This function is quite inefficient, don't do it too often
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); 
  while(v === 0) v = Math.random();
  return Math.pow(Math.max(Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) + 1, 1), 0.65);
}

// Level is a multiplier based on how far you got on the run, strength is a random bell curve modifier, we could add rarities based on that value (bigger than 3 is pretty rare)
function generateRandomGlyph(level) {
  var type = GLYPH_TYPES[Math.floor(Math.random() * GLYPH_TYPES.length)]
  var strength = gaussian_bell_curve()
  var effectAmount = Math.min(Math.floor(Math.pow(Math.random(), 1 - (Math.pow(level * strength, 0.5)) / 100)*1.5 + 1), 4)
  if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
    type = "normal"
    effectAmount = 1
  }
  var idx = 0
  var hasglyph = true
  while (hasglyph) {
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

    case "normal":
      return normalGlyph(glyph, effectAmount)
      break;
  }
}

function timeGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = timeEffects[Math.floor(Math.random() * timeEffects.length)]
    console.log(toAdd)
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1 + Math.pow(glyph.level, 0.2) * Math.pow(glyph.strength, 0.4)/100
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
    var toAdd = dilationEffects[Math.floor(Math.random() * dilationEffects.length)]
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
        glyph.effects.pow = 1 + Math.pow(glyph.level, 0.2) * Math.pow(glyph.strength, 0.4)/100
        break;
    }
  }
  return glyph
}

function replicationGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = replicationEffects[Math.floor(Math.random() * replicationEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "speed":
        glyph.effects.speed = glyph.level * glyph.strength * 3
        break;

      case "pow":
        glyph.effects.pow = 1 + Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.4)/75
        break;

      case "dtgain":
        glyph.effects.dtgain = 0.0001 * Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.65) // player.replicanti.e * x
        break;
        
      case "glyphlevel":
        glyph.effects.glyphlevel = Math.pow(Math.pow(glyph.level, 0.2) * Math.pow(glyph.strength, 0.3), 0.5)/100
        break;
    }
  }
  return glyph
}

function infinityGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = infinityEffects[Math.floor(Math.random() * infinityEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1 + Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4)/75
        break;

      case "rate":
        glyph.effects.rate = Math.pow(glyph.level * glyph.strength, 0.5) * 4
        break;

      case "ipgain":
        glyph.effects.ipgain = Math.pow(glyph.level * glyph.strength, 5) * 100
        break;
        
      case "infmult":
        glyph.effects.ipgain = Math.pow(glyph.level * glyph.strength, 5) * 100
        break;
    }
  }
  return glyph
}

function normalGlyph(glyph, effectAmount) {
  var effects = []
  while (effects.length < effectAmount) {
    var toAdd = normalEffects[Math.floor(Math.random() * normalEffects.length)]
    if (!effects.includes(toAdd)) effects.push(toAdd)
  }
  if (player.reality.glyphs.inventory.length + player.reality.glyphs.inventory.length == 0 && player.realities == 0) {
    effects = ["pow"]
  }

  for (i in effects) {
    var effect = effects[i]
    switch(effect) {
      case "pow":
        glyph.effects.pow = 1 + Math.pow(glyph.level, 0.25) * Math.pow(glyph.strength, 0.4)/75
        break;

      case "mult":
        glyph.effects.mult = Math.pow(glyph.level * glyph.strength, 3)
        break;

      case "dimboost":
        glyph.effects.dimboost = Math.pow(glyph.level * glyph.strength, 0.5)
        break;
        
      case "autochall":
        glyph.effects.autochall = true
        break;
    }
  }
  return glyph
}

function getRarity(x) {
  var name, color;
  if (x >= 4) return { name: "Mythical", color: "blue" }
  if (x >= 3) return { name: "Legendary", color:  "gold" }
  if (x >= 2.5) return { name:  "Very rare", color:  "red" }
  if (x >= 2) return { name:  "Rare", color:  "green" }
  if (x >= 1.5) return { name:  "Uncommon", color:  "silver" }
  if (x >= 1) return { name:  "Common", color:  "white" }
}

/**
 * key is type+effect
 */

const NUMBERCOLOR = "#85ff85"
function getDesc(typeeffect, x) {
  const EFFECT_DESCRIPTIONS = {
    timepow: "Time dimension multiplier ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    timespeed: "Multiply game speed by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    timefreeTickMult: "Free tickspeed threshold multiplier x<span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    timeeternity: "Multiply EP gain by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    dilationdilationMult: "Multiply dilated time gain by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    dilationgalaxyThreshold: "Free galaxy threshold multiplier x<span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    dilationTTgen: "Generates <span style='color:"+NUMBERCOLOR+"'>" + x + "</span> TT per second.",
    dilationpow: "Normal dimension multiplier ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span> while dilated.",
    replicationspeed: "Multiply replication speed by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    replicationpow: "Replicanti multiplier ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    replicationdtgain: "Multiply DT gain by replicanti amount ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    replicationglyphlevel: "Glyph level modifier from replicanti. ^0.4 -> ^<span style='color:"+NUMBERCOLOR+"'>" + (0.4+parseInt(x)).toFixed(2) + "</span>",
    infinitypow: "Infinity dimension multiplier ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    infinityrate: "Infinity power conversion rate ^7 -> ^<span style='color:"+NUMBERCOLOR+"'>" + (7+parseInt(x)).toFixed(1) + "</span>",
    infinityipgain: "Multiply IP gain by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    infinityinfmult: "Multiply infinitied stat gain by <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    normalpow: "Normal dimension multiplier ^ <span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    normalmult: "Normal dimension multiplier x<span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    normaldimboost: "Dimension boost multiplier x<span style='color:"+NUMBERCOLOR+"'>" + x + "</span>",
    normalautochall: "Automatically complete normal and infinity challenges"
  }

  return EFFECT_DESCRIPTIONS[typeeffect]
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
        if (glyph.color !== undefined) html += "<div class='glyph' ondragover='allowDrop(event)' ondrop='drop(event)' id='"+idx+"'><div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+glyph.color+" !important; border: 1px solid "+glyph.color+" !important; box-shadow: inset "+glyph.color+" 0px 0px 10px 2px, "+glyph.color+" 0px 0px 10px 2px !important; text-shadow: "+glyph.color+" -1px 1px 2px;' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)' ><span class='tooltip'>"
        else html += "<div class='glyph' ondragover='allowDrop(event)' ondrop='drop(event)' id='"+idx+"'><div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)' ><span class='tooltip'>"
        var rarity = getRarity(glyph.strength)
        html += "<span style='color: "+rarity.color+"; float:left'>" + rarity.name + "</span> <span style='float: right'> Level: "+shorten(glyph.level)+"</span><br><br>"
        for (i in glyph.effects) {
          var effect = glyph.effects[i]
          html += getDesc(glyph.type + i, shorten(effect)) +" <br><br>"
        }
        if (glyph.symbol !== undefined) html += "</span>"+specialGlyphSymbols["key"+glyph.symbol]+"</div></div>"
        else html += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div></div>"
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
      if (glyph.color !== undefined) glyphhtml += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' style='color: "+glyph.color+" !important; border: 1px solid "+glyph.color+" !important; box-shadow: inset "+glyph.color+" 0px 0px 10px 2px, "+glyph.color+" 0px 0px 10px 2px !important; text-shadow: "+glyph.color+" -1px 1px 2px;' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)'><span class='tooltip'>"
      else glyphhtml += "<div id='"+glyph.id+"' class='glyph "+glyph.type+"glyph' draggable='true' ondragstart='drag(event)' ondragend='dragover(event)'><span class='tooltip'>"
      var rarity = getRarity(glyph.strength)
      glyphhtml += "<span style='color: "+rarity.color+"; float:left'>" + rarity.name + "</span> <span style='float: right'> Level: "+shorten(glyph.level)+"</span><br><br>"
      for (i in glyph.effects) {
        var effect = glyph.effects[i]
        glyphhtml += getDesc(glyph.type + i, shorten(effect)) +" <br><br>"
      }
      if (glyph.symbol !== undefined) glyphhtml += "</span>"+specialGlyphSymbols["key"+glyph.symbol]+"</div>"
      else glyphhtml += "</span>"+GLYPH_SYMBOLS[glyph.type]+"</div>"
      $("#glyphslots").children()[slot].innerHTML = glyphhtml
    }
  }
  table.innerHTML = html

  $(".tooltip").parent().mousemove(function(e) {
    mouseOn.css({"left": e.pageX-150 + "px", "top": e.pageY-mouseOn.height()-35 + "px", "display": "block"})
  })
  var that = this
  $(".tooltip").parent().mouseenter(function() {
    mouseOn = $(this).find(".tooltip")
    mouseOn.appendTo("#body")
  })

  $(".tooltip").parent().mouseleave(function() {
    mouseOn.css({"left": "0", "top": "0px", "display": "none"})
    mouseOn.appendTo($(this))
    mouseOn = $("document")
  })
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
      console.log(ev.target.id)
      glyph.idx = parseInt(ev.target.id)
    }
  }
  console.log(ev.target.className)
  //ev.target.appendChild(document.getElementById(data));
  generateGlyphTable()
  mouseOn.css({"left": "0", "top": "0px", "display": "none"})
  mouseOn.appendTo($(ev.target))
  mouseOn = $("document")
}
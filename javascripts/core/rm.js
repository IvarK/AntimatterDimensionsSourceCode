
// TODO, add more types
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity"]

/**
 * pow is for exponent on time dim multiplier (^1.02) or something like that
 * speed is for multiplied game speed
 * freeTickMult reduces the threshold between free tickspeed upgrades (Math.pow(multiplier, 1/x))
 * eternity is a static multiplier on EP gain NOT SURE IF THIS IS GOOD
 */
const timeEffects = ["pow", "speed", "freeTickMult", "eternity"]

/**
 * dilation gain multiplies dilation gain
 * 
 * galaxy threshold reduce free galaxy threshold multiplier
 * 
 * TTgen generates slowly TT, amount is per second.
 */
const dilationEffects = ["dilationMult", "galaxyThreshold", "TTgen", ""]

/**
 * 
 * replSpeed increases replication speed
 * 
 * pow raises repl mult to a power
 */
const replicationEffects = ["speed", "pow", "", ""]

/**
 * pow: inf dim mult ^ x
 * rate: inf power conversion rate, ^(7+x)
 * ipgain: ip gain ^ x
 * infMult: multiplier to Infinitied stat gain
 * 
 */
const infinityEffects = ["pow", "rate", "ipgain", "infMult"]

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
  var glyph = {
    id: Date.now(),
    idx: player.reality.glyphs.inventory.length,
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
        glyph.effects.speed = Math.pow(glyph.level, 0.3) * Math.pow(glyph.strength, 0.65) * 3
        break;

      case "freeTickMult":
        glyph.effects.freeTickMult = 1 - Math.pow(glyph.level, 0.2) * Math.pow(glyph.strength, 0.4)/100
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
        glyph.effects.galaxyThreshold = 1 - Math.pow(glyph.level, 0.2) * Math.pow(glyph.strength, 0.4)/100
        break;

      case "TTgen":
        glyph.effects.TTgen = Math.pow(glyph.level * glyph.strength, 0.5) / 10000 //Per second
        break;
        
      case "1":
        //stuff
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

      case "1":
        //stuff
        break;
        
      case "2":
        //stuff
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
        html += "<div class='glyph' ondragover='allowDrop(event)' ondrop='drop(event)' id='"+idx+"'><div id='"+glyph.id+"' class='"+glyph.type+"glyph' draggable='true' ondragstart='drag(event)' ach-tooltip='"
        html += "rarity: " + shorten(glyph.strength) + " "
        html += "level: " + shorten(glyph.level) + " "
        for (i in glyph.effects) {
          var effect = glyph.effects[i]
          html += i + ": " + shorten(effect) + " "
        }
        html += "'></div></div>"
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
      glyphhtml += "<div id='"+glyph.id+"' class='"+glyph.type+"glyph' draggable='true' ondragstart='drag(event)' ach-tooltip='"
      glyphhtml += "rarity: " + shorten(glyph.strength) + " "
      glyphhtml += "level: " + shorten(glyph.level) + " "
      for (i in glyph.effects) {
        var effect = glyph.effects[i]
        glyphhtml += i + ": " + shorten(effect) + " "
      }
      glyphhtml += "'></div>"
      $("#glyphslots").children()[slot].innerHTML = glyphhtml
    }
  }
  table.innerHTML = html
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  var data = parseInt(ev.dataTransfer.getData("text"));

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
}
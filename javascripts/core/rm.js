
// TODO, add more types
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity"]

/**
 * pow is for exponent on time dim multiplier (^1.02) or something like that
 * speed is for multiplied game speed
 * freeTickMult reduces the threshold between free tickspeed upgrades (Math.pow(multiplier, 1/x))
 * eternity is a static multiplier on EP gain NOT SURE IF THIS IS GOOD
 */
const timeEffects = ["pow", "speed", "freeTickMult", "eternity"]

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
  var effectAmount = Math.floor(Math.random()*3 + 1)
  switch(type) {
    case "time":
      var effects = []
      var glyph = {
        type: type,
        strength: strength,
        level: level,
        effects: {}
      }
      while (effects.length < effectAmount) {
        var toAdd = timeEffects[Math.floor(Math.random * timeEffects.length)]
        if (!effects.includes(toAdd)) effects.push(toAdd)
      }

      for (var effect of effects) {
        switch(effect) {
          case "pow":
            glyph.effects.pow = 1 + Math.pow(level, 0.2) * Math.pow(strength, 0.4)/100
            break;

          case "speed":
            glyph.effects.speed = Math.pow(level, 0.3) * Math.pow(strength, 0.65) * 3
            break;

          case "freeTickMult":
            glyph.effects.freeTickMult = 1 - Math.pow(level, 0.2) * Math.pow(strength, 0.4)/100
            break;
            
          case "eternity":
          glyph.effects.eternity = Math.pow(level * strength, 3) * 100
            break;
        }
      }
      break;

    case "dilation":
      //Do stuff
      break;

    case "replication":
      //Do stuff
      break;

    case "infinity":
      //Do stuff
      break;
  }
}
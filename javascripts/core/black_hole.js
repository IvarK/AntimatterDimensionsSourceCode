/**
 * Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x3.5, starts at 15
 * Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
 * Duration: starts at 10, x1.5 per upgrade, cost goes x4, starts at 10
 * 
 */

 /*
 How the black holes work:
 player.blackHole is a list (currently of length 3), each entry containing info about a black hole.
 blackHole.duration is the amount of time the black hole is active for.
 blackHole.power is the multiplier to time the black hole gives when active.
 blackHole.speed is the amount of time the black hole is inactive for between activations.
 blackHole.phase is the amount of time the black hole has spent since last state transition,
 so if it's active, it's the amount of time it's been active for, and if it's inactive,
 it's the amount of time it's been inactive for.
 blackHole.activations is the total number of times the black hole has become active (including offline)
 */

function updateBlackHoleUpgrades() {
  for (let i = 0; i < 3; i++) {
    $("#blackholeinterval" + (i+1)).html("Speed up the black hole by 25%<br>Current interval: "+(player.blackHole[i].speed).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getBlackHoleIntervalCost(i))+" RM")
    if (player.reality.realityMachines.lt(getBlackHoleIntervalCost(i))) $("#blackholeinterval" + (i+1)).addClass("rUpgUn")
    else $("#blackholeinterval" + (i+1)).removeClass("rUpgUn")

    $("#blackholepower" + (i+1)).html("Make the black hole 35% more powerful<br>Current power: "+shorten(player.blackHole[i].power)+"x<br>Cost: "+shortenDimensions(getBlackHolePowerCost(i))+" RM")
    if (player.reality.realityMachines.lt(getBlackHolePowerCost(i))) $("#blackholepower" + (i+1)).addClass("rUpgUn")
    else $("#blackholepower" + (i+1)).removeClass("rUpgUn")

    $("#blackholeduration" + (i+1)).html("Extend the black hole duration by 30%<br>Current duration: "+(player.blackHole[i].duration).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getBlackHoleDurationCost(i))+" RM")
    if (player.reality.realityMachines.lt(getBlackHoleDurationCost(i))) $("#blackholeduration" + (i+1)).addClass("rUpgUn")
    else $("#blackholeduration" + (i+1)).removeClass("rUpgUn")
  }
  if (planet !== undefined) // This function gets called once on-load before the black hole is initialized
    recalculateOrbit();
 }

function unlockBlackHole() {
    if (player.reality.realityMachines.lt(50)) return false
    if (player.blackHole[0].unlocked) return false
    player.blackHole[0].unlocked = true
    player.reality.realityMachines = player.reality.realityMachines.minus(50)
    giveAchievement("Is this an Interstellar reference?")
    $("#blackholecontainer").show()
    $("#bhupg1").show()
    $("#blackholeunlock").hide()
}

function getBlackHoleIntervalCost(i) {
  var amountOfPurchases = Math.round(Math.log(player.blackHole[i].speed / (3600 / (Math.pow(10, i)))) / Math.log(0.8))
  return getBlackHoleUpgradeCost(amountOfPurchases, i, 15, 3.5);
}

function getBlackHolePowerCost(i) {
  var amountOfPurchases = Math.round(Math.log(player.blackHole[i].power / (180 / Math.pow(2, i))) / Math.log(1.35))
  return getBlackHoleUpgradeCost(amountOfPurchases, i, 20, 2);
}

function getBlackHoleDurationCost(i) {
  var amountOfPurchases = Math.round(Math.log(player.blackHole[i].duration / (10 - i*3)) / Math.log(1.3))
  return getBlackHoleUpgradeCost(amountOfPurchases, i, 10, 4);
}

function getBlackHoleUpgradeCost(amountOfPurchases, i, initialCost, costMult) {
  let wormholeCostMultipliers = [1, 1000, 1e35];
  let costScalingStart = 1e35;
  initialCost *= wormholeCostMultipliers[i];
  let preScalingPurchases = Math.max(0, Math.floor(Math.log(costScalingStart / initialCost) / Math.log(costMult)));
  let preScalingCost = Math.ceil(Math.pow(costMult, Math.min(preScalingPurchases, amountOfPurchases)) * initialCost);
  let scaling = new LinearMultiplierScaling(costMult, 0.2);
  let postScalingCost = Math.exp(scaling.logTotalMultiplierAfterPurchases(Math.max(0, amountOfPurchases - preScalingPurchases)));
  return preScalingCost * postScalingCost;
}

function upgradeBlackHoleInterval(i) {
	totalPhase = getTotalPhase();
  var cost = getBlackHoleIntervalCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.blackHole[i].speed *= 0.8
  updateBlackHoleUpgrades()
  if (player.blackHole[i].speed < player.blackHole[i].duration) giveAchievement("Are you sure these are the right way around?")
}

function upgradeBlackHolePower(i) {
	totalPhase = getTotalPhase();
  var cost = getBlackHolePowerCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.blackHole[i].power *= 1.35
  updateBlackHoleUpgrades()
}

function upgradeBlackHoleDuration(i) {
	totalPhase = getTotalPhase();
  var cost = getBlackHoleDurationCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.blackHole[i].duration *= 1.3
  updateBlackHoleUpgrades()
  if (player.blackHole[i].speed < player.blackHole[i].duration) giveAchievement("Are you sure these are the right way around?")
}

function setBlackHole(state, i) {
  player.blackHole[i].active = state;
  player.blackHole[i].phase = 0;
}

function updateBlackHolePhases(blackHoleDiff) {
  // This code is intended to successfully update the black hole phases
  // even for very large values of blackHoleDiff.
  blackHoleDiff /= 1000;
  let activePeriods = getRealTimePeriodsWithBlackHoleActive(blackHoleDiff);
  for (let i = 0; i < player.blackHole.length && blackHoleIsUnlocked(player.blackHole[i]); i++) {
    let blackHole = player.blackHole[i];
    // Prevents a flickering black hole if phase gets set too high
    // (shouldn't ever happen in practice). Also, more importantly,
    // should work even if activePeriods[i] is very large. To check:
    // This used to always use the period of blackHole[0], now it doesn't,
    // will this cause other bugs?
    blackHole.phase += activePeriods[i];
    if (blackHole.phase >= blackHole.speed + blackHole.duration) {
      // One activation for each full cycle.
      blackHole.activations += Math.floor(blackHole.phase / (blackHole.speed + blackHole.duration));
      blackHole.phase %= blackHole.speed + blackHole.duration;
    }
    if (blackHole.active) {
      if (blackHole.phase >= blackHole.duration) {
        blackHole.phase -= blackHole.duration
        blackHole.active = false
        if (GameUI.notify.blackHoles) {
          GameUI.notify.success("Black hole "+ (i + 1) +" duration ended.");
        }
      }
    } else {
      if (blackHole.phase >= blackHole.speed) {
        blackHole.phase -= blackHole.speed
        blackHole.activations++;
        blackHole.active = true
        if (GameUI.notify.blackHoles) {
          GameUI.notify.success("Black hole "+ (i + 1) +" is active!");
        }
      }
    }
  }
  if (player.blackHole[0].phase >= 60 * 60 * 24) giveAchievement("Bruh, are you like, inside the hole?")
}

// All the black holes act unlocked while Enslaved is running.
function blackHoleIsUnlocked (blackHole) {
  return blackHole.unlocked || Enslaved.isRunning;
}

function updateBlackHoleUpgradeDisplay (i) {
  if (blackHoleIsUnlocked(player.blackHole[i])) {
    $("#bhupg" + (i + 1)).show();
  } else {
    $("#bhupg" + (i + 1)).hide();
  }
}

function updateBlackHoleStatusText(i) {
  let blackHole = player.blackHole[i];
  if (!blackHoleIsUnlocked(blackHole)) {
    document.getElementById("blackHoleStatus" + (i + 1)).textContent = "";
  } else if (blackHole.active && (i === 0 || player.blackHole[i-1].active)) {
    document.getElementById("blackHoleStatus" + (i + 1)).textContent = "Black hole "+ ( i + 1 ) +" is active for " + (blackHole.duration - blackHole.phase).toFixed(1) + " more seconds.";
  } else if (blackHole.active) {
    document.getElementById("blackHoleStatus" + (i + 1)).textContent = "Black hole "+ ( i + 1 ) +" will activate with black hole " + i + " (for " + (Math.max(0, blackHole.duration - blackHole.phase)).toFixed(1) + " sec)";
  } else {
    document.getElementById("blackHoleStatus" + (i + 1)).textContent = "Black hole "+ ( i + 1 ) +" will activate in " + (blackHole.speed - blackHole.phase).toFixed(1) + " seconds.";
  }
}

function updateBlackHoleGraphics() {
  totalPhase = getTotalPhase();

  // Update orbital position parameters (polar coordinates centered on hole, theta goes 0 to 1 because I'm apparently stupid)
  E0 = E(eccentricity, 2 * Math.PI * totalPhase / period);    // "eccentric anomaly"
  r = semimajorAxis*(1 - eccentricity*Math.cos(E0));
  theta = 2 * Math.atan(Math.sqrt((1+eccentricity)/(1-eccentricity) * Math.pow(Math.tan(E0/2), 2)));
  if (Math.tan(E0/2) < 0) theta *= -1;
  planet.radius = r;
  planet.angle = theta / (2*Math.PI);

  // Time dilation factor (Realistic formula, but only actually used for particle speed)
  delta = 1 / Math.sqrt(1 - bhSize/r);
        
  // Move+draw everything
  document.getElementById("blackHoleImage").getContext('2d').clearRect(0, 0, 400, 400);
  for (let i = 0; i < particleList.length; i++) {
    particleList[i].update();
    particleList[i].draw();
  }
}

// Drawing code that runs for each particle
let planetSize = 1.5;
function Dot(dotSize, dotType, r, theta) {
	this.size = dotSize;
	this.isParticle = dotType == 'particle';
	this.isPlanet = dotType == 'planet';
	this.isHole = dotType == 'hole';
	this.radius = r;
	this.angle = theta;
	this.respawnTick = true;  // Don't draw trails on the tick particles respawn
  this.isInside = false;
  this.canvas = document.getElementById("blackHoleImage");
	
  this.draw = function () {
    let disp = this.canvas.getContext('2d');
		let x = this.radius * Math.sin(2*Math.PI * this.angle);
		let y = this.radius * Math.cos(2*Math.PI * this.angle);
    disp.beginPath();
    disp.lineWidth = 2*this.size;
    
		// Black hole 1 active, draw some trails
		if (player.blackHole[0].active && this.isParticle && !this.respawnTick) {
      if (!this.isInside || (player.blackHole[0].active && player.blackHole[1].active)) {
        let prevX = this.prevRadius * Math.sin(2*Math.PI * this.prevAngle);
        let prevY = this.prevRadius * Math.cos(2*Math.PI * this.prevAngle);
        disp.lineCap = 'round';
        disp.lineWidth *= 1;
        disp.moveTo(x + 200, y + 200);
        disp.lineTo(prevX + 200, prevY + 200);
      }
		}
		else if (this.isHole) {  // Glowing effect to make the hole more visible on dark themes
      let glow = disp.createRadialGradient(x + 200, y + 200, 0, x + 200, y + 200, this.size * 2);
      glow.addColorStop(0, "rgba(0, 0, 0, 1)");
      glow.addColorStop(0.9, "rgba(0, 0, 0, 1)");
      glow.addColorStop(0.92, "rgba(100, 100, 100, 1)");
      glow.addColorStop(1, "rgba(100, 100, 100, 0)");
      disp.fillStyle = glow;
      disp.fillRect(0, 0, 400, 400);
    }
    else if (!this.isInside || (player.blackHole[0].active && player.blackHole[1].active)) {  // Particle and planet
      disp.arc(x + 200, y + 200, this.size, 0, 2*Math.PI);
    }
		
		if (this.isParticle) {
			if (player.blackHole[0].active) {
        if (this.radius > bhSize) { // Trails outside black hole
          let dist = Math.floor(127 * (this.radius - bhSize) / semimajorAxis);
          disp.strokeStyle = "rgb(" + (255-dist) + ", " + dist + ", " + dist + ")";
        }
        if (this.radius < bhSize) { // Trails inside black hole
          let dist = Math.floor(255 * Math.sqrt(this.radius / bhSize));
          disp.strokeStyle = "rgb(" + dist + ", 0, 0)";
        }
      }
			else disp.strokeStyle = "rgb(127, 127, 127)";
    }
		else if (this.isPlanet) disp.strokeStyle = "rgb(0, 0, 255)";
		else disp.strokeStyle = "rgb(0, 0, 0)";
    disp.stroke();
  }
		
	// Move particles
	this.update = function () {
    if (this.isParticle) {
      let particleSpeed = 0.05 * Math.min(Math.pow(Math.max(delta,2)/2, 3), 5);
      if (player.blackHole[0].active) {
        this.prevAngle = this.angle;
        this.prevRadius = this.radius;
      }
      if (!this.isInside) this.angle = (this.angle + 20*particleSpeed*Math.PI*Math.pow(this.radius, -1.5)) % 1;
      this.radius /= 1 + 0.3*particleSpeed*Math.pow(this.radius / bhSize, -2);
				
      if (this.radius < 0.1*bhSize) { // Particle fell in to the center
        this.respawn();
      }
      else if (this.radius <= bhSize) { // Particle is inside
        this.isInside = true;
      }
      else {
        this.respawnTick = false;
      }
    }
  }
    
  this.respawn = function () {
    this.radius = getRandomRadius();
    this.angle += Math.random();
    this.respawnTick = true;
    this.isInside = false;
  }
}
 
// Code was originally written to use phase over a cycle of active+inactive time and would be really difficult to rewrite to use the current black hole phase
// Example on what this is: if the black hole has intervals of 100+10 then this ranges from 0 to 110 and is active when less than 5 or more than 105
function getTotalPhase() {
	if (player.blackHole[0].active) {
		return (player.blackHole[0].phase - player.blackHole[0].duration/2 + period) % period;
  }
	else {
		return player.blackHole[0].phase + player.blackHole[0].duration/2;
  }
}

// Should only be run once on game load
let particleList = [];
function initializeBlackHole() {
	// Black hole and planet
  planet = new Dot(planetSize, 'planet', 0, 0);
	hole = new Dot(0, 'hole', 0, 0);
			
	// Orbital size parameters
	semimajorAxis = 100;   										// Basically orbit size in pixels, can be changed
	period = player.blackHole[0].speed + player.blackHole[0].duration;	// Time taken for one orbit (in seconds)
	totalPhase = getTotalPhase();
			
	// A fair bit of calculation, should probably only be called on-load and after upgrades
	calculateOrbitParams();
	hole.size = (bhSize - planetSize) / 2;	// Prevent planet+hole overlapping
			
	// Particles (scaled to take the same range as the orbit)
	particleList = [hole];
	numParticles = 120;
	for (let i = 0; i < numParticles; i++) {
		particleList.push(new Dot(planetSize / 3, 'particle', getRandomRadius(), Math.random()));
  }
	particleList.push(planet);
}

// Only run on purchase, recalculates orbital parameters and makes sure the planet doesn't move much after upgrades
let eccentricity, semimajorAxis, period, bhSize, planet, hole;
function recalculateOrbit() {
	let currOrbitPos = totalPhase / period;
	
	period = player.blackHole[0].speed + player.blackHole[0].duration;		// Update orbital period
	calculateOrbitParams();
	hole.size = (bhSize - planetSize) / 2;							// Prevent planet+hole overlapping
	
	// Do stuff to make sure the relative position of the planet stays about the same
	totalPhase = currOrbitPos * period;
	if (player.blackHole[0].active) {
    
	}
	else {
		player.blackHole[0].phase = totalPhase - player.blackHole[0].duration/2;
		if (player.blackHole[0].phase < 0) {
			player.blackHole[0].active = true;
			player.blackHole[0].phase += player.blackHole[0].duration/2;
		}
	}
}

// Calculates "eccentric anomaly" from "mean anomaly", see https://en.wikipedia.org/wiki/Kepler%27s_equation#Numerical_approximation_of_inverse_problem
// Needed for accurate Keplerian orbit shape and velocity, apparently math is hard
function E(eccentricity, M) {
    let E0 = M
    maxIter = 20;	// idk I hope 20 is enough to converge
    for (let k = 0; k < maxIter; k++) {
      E0 = M + eccentricity * Math.sin(E0);
    }
    return E0;
}

// Finds and sets orbital parameters so the black hole active time approximately corresponds to time with >2x
let activeThreshold = 2;
function calculateOrbitParams() {
  // Fixed-point iteration for eccentricity (I'm really hoping this always converges)
	y = (1 - Math.pow(activeThreshold, -2)) / (1 - Math.pow(player.blackHole[0].power, -2));
	eccentricity = 0.5;
	maxIter = 1000;
	for (let k = 0; k < maxIter; k++) {
		eccentricity = (y - 1) / (y*Math.cos(E(eccentricity, 2 * Math.PI * Math.min(0.9, player.blackHole[0].duration / period))) - 1)
  }
			
	// Black hole size, calculated from orbit shape in order to give the right max boost
	bhSize = semimajorAxis*(1 - eccentricity) * (1 - Math.pow(player.blackHole[0].power, -2));
}

// Used for particle spawning, note that particles can be farther out when active
function getRandomRadius() {
	return bhSize + 0.5*semimajorAxis*Math.random() * (player.blackHole[0].active ? 2 : 1);
}

function pauseBlackHole() {
  player.blackHolePause = !player.blackHolePause
  if (player.blackHolePause) $("#pauseButton").addClass("rUpgBought")
  else $("#pauseButton").removeClass("rUpgBought")
}

// This function takes the total real time spent offline,
// a number of ticks to simulate, a tolerance for how far ticks can be
// from average (explained later), and returns a single realTickTime and
// blackHoleSpeed representing the real time taken up by the first simulated tick
// and the game speed due to black holess during it.

// This code makes sure that the following conditions are satisfied:
// 1: realTickTime * blackHoleSpeed is exactly (up to some small
// multiple of floating-point precision) the game time which would be spent
// after realTickTime real time, accounting for black holess
// (but not for anything else).
// 2: No tick contains too much (more than a constant multiple of
// the mean game time per tick) of the game time.
// 3: No tick has negative or zero real time or (equivalently)
// negative or zero game time.
// Note that Patashu has convinced me that we do not want the property
// "No tick contains too much (more than a constant multiple of the
// mean real time per tick) of the real time." There's no reason to have it
// aside from the edge cases of EC12 (and if you're going offline during EC12
// then you should expect technically correct but somewhat annoying behavior)
// and auto EC completion (but auto EC completion shouldn't be that much
// of an issue).
function calculateBlackHoleOfflineTick(totalRealTime, numberOfTicks, tolerance) {
  // Cache speedups, so getGameTimeFromRealTime doesn't recalculate them every time.
  let speedups = calculateBlackHoleSpeedups();
  let totalGameTime = getGameTimeFromRealTime(totalRealTime, speedups);
  // We have this special case just in case some floating-point mess prevents binarySearch from working in the numberOfTicks = 1 case.
  // I doubt that's possible but it seems worth handling just in case.
  if (numberOfTicks === 1) {
    return [totalRealTime, totalGameTime / totalRealTime];
  }
  // We want getGameTimeFromRealTime(realTickTime, speedups) * numberOfTicks / totalGameTime to be roughly 1
  // (that is, the tick taking realTickTime real time has roughly average length in terms of game time).
  // We use binary search because it has somewhat better worst-case behavior than linear interpolation search here.
  // Suppose you have 3000 seconds without a black hole and then 100 seconds of a black hole with 3000x power, and you want to find
  // when 4000 seconds of game time have elapsed. With binary search it will take only 20 steps or so to get reasonable accuracy,
  // but with linear interpolation it will take about 100 steps.
  // These extra steps might always average out with cases where linear interpolation is quicker though.
  let realTickTime = binarySearch(0, totalRealTime, x => getGameTimeFromRealTime(x, speedups) * numberOfTicks / totalGameTime, 1, tolerance);
  let blackHoleSpeedup = getGameTimeFromRealTime(realTickTime, speedups) / realTickTime;
  return [realTickTime, blackHoleSpeedup];
}

// Standard implementation of binary search for a monotone increasing function.
// The only unusual thing is tolerance, which is a bound on
// Math.abs(evaluationFunction(result) - target).
function binarySearch(start, end, evaluationFunction, target, tolerance) {
  while (true) {
    let median = (start + end) / 2;
    let error = evaluationFunction(median) - target;
    if (Math.abs(error) < tolerance) {
      return median;
    }
    if (error < 0) {
      start = median;
    } else {
      end = median;
    }
  }
}

// Returns a list of length (number of unlocked black holes + 1),
// where each element is the *total* speedup while that black hole
// is the highest-numbered black hole active, the black holes being numbered
// starting from black hole 1 and black hole 0 being normal game.
function calculateBlackHoleSpeedups() {
  let speedupWithoutBlackHole = getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.BLACKHOLE], 1);
  let speedups = [1];
  for (let i = 0; i < player.blackHole.length && blackHoleIsUnlocked(player.blackHole[i]); i++) {
    speedups.push(getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.BLACKHOLE], undefined, i) / speedupWithoutBlackHole);
  }
  return speedups;
}

function getGameTimeFromRealTime(realTime, speedups) {
  let effectivePeriods = getRealTimePeriodsWithBlackHoleEffective(realTime, speedups);
  return effectivePeriods
    .map((period, i) => period * speedups[i])
    .sum();
}

// Returns the amount of real time spent with each unlocked black hole
// being the current "effective" black hole, that is, the active black hole
// with the highest index.
// For example:
// active periods = [100, 20, 5] (100ms of real time, 20ms of black hole 1, 5ms of black hole 2)
// effective periods = [80, 15, 5]
// 80ms of effective real time, because black hole 1 will be running in total 20ms => 100 - 20
// 15ms of effective black hole 1 time, because black hole 2 will be running in total 5ms => 20 - 5
// 5ms of effective black hole 2 time, because no higher black hole overlaps it, so it is effective for the whole active period
// Note: even though more than one black hole can be active
// (and thus effective) at once, the calling function first calculates the total speedups
// while each black hole is the highest-index black hole that's active and then acts
// as if only the highest-index black hole that's active is effective.
function getRealTimePeriodsWithBlackHoleEffective(realTime) {
  let activePeriods = getRealTimePeriodsWithBlackHoleActive(realTime);
  let effectivePeriods = [];
  for (let i = 0; i < activePeriods.length - 1; i++) {
    effectivePeriods.push(activePeriods[i] - activePeriods[i + 1]);
  }
  effectivePeriods.push(activePeriods.last());
  return effectivePeriods;
}

// Returns an array of real time periods spent in each black hole
// with first element being the "no black hole" state that is normal game.
function getRealTimePeriodsWithBlackHoleActive(realTime) {
  let activePeriods = [realTime];
  for (let blackHole of player.blackHole.filter(blackHoleIsUnlocked)) {
    const activeTime = getRealTimeWithBlackHoleActive(blackHole, activePeriods.last())
    activePeriods.push(activeTime);
  }
  return activePeriods;
}

// Given a black hole and the time for which the previous black hole is active,
// this function returns the time for which the given black hole is active.
// For example, if blackHole = player.blackHole[1], this function, given
// the time for which player.blackHole[0] is active, will return the time for which
// player.blackHole[1] is active during that time.
function getRealTimeWithBlackHoleActive(blackHole, time) {
  let nextDeactivation = timeUntilNextDeactivation(blackHole);
  let cooldown = blackHole.speed;
  let duration = blackHole.duration;
  let fullCycle = cooldown + duration;
  const currentActivationDuration = Math.min(nextDeactivation, duration);
  const activeCyclesUntilLastDeactivation = Math.floor((time - nextDeactivation) / fullCycle);
  const activeTimeUntilLastDeactivation = duration * activeCyclesUntilLastDeactivation;
  const timeLeftAfterLastDeactivation = (time - nextDeactivation + fullCycle) % fullCycle;
  const lastActivationDuration = Math.max(timeLeftAfterLastDeactivation - cooldown, 0);
  return currentActivationDuration + activeTimeUntilLastDeactivation + lastActivationDuration;
}

// Returns the time that the previous black hole must be active until the next change
// from the active state to the inactive state. For example, if blackHole = player.blackHole[1],
// this function will return the time player.blackHole[0] must be active for player.blackHole[1]
// to transition to the inactive state. This is useful since player.blackHole[1]'s phase
// only increases (that is, its state only changes) while player.blackHole[0] is active.
// In general, a black hole only changes state while the previous black hole is active.
// So figuring out how long a black hole would be active after some amount of real time
// (as we do) is best done iteratively via figuring out how long a black hole would be active
// after a given amount of time of the previous black hole being active.
function timeUntilNextDeactivation(blackHole) {
  if (blackHole.active) {
    return blackHole.duration - blackHole.phase;
  } else {
    return blackHole.duration + blackHole.speed - blackHole.phase;
  }
}

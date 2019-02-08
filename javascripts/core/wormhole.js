/**
 * Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x3.5, starts at 15
 * Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
 * Duration: starts at 10, x1.5 per upgrade, cost goes x4, starts at 10
 * 
 */

 /*
 How the wormholes work:
 player.wormholes is a list (currently of length 3), each entry containing info about a wormhole.
 wormhole.duration is the amount of time the wormhole is active for.
 wormhole.power is the multiplier to time the wormhole gives when active.
 wormhole.speed is the amount of time the wormhole is inactive for between activations.
 wormhole.phase is the amount of time the wormhole has spent since last state transition,
 so if it's active, it's the amount of time it's been active for, and if it's inactive,
 it's the amount of time it's been inactive for.
 wormhole.activations is the total number of times the wormhole has become active (including offline)
 */

function updateWormholeUpgrades() {
  for (let i = 0; i < 3; i++) {
    $("#wormholeinterval" + (i+1)).html("Speed up the wormhole up 25%<br>Current interval: "+(player.wormhole[i].speed).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeIntervalCost(i))+" RM")
    if (player.reality.realityMachines.lt(getWormholeIntervalCost(i))) $("#wormholeinterval" + (i+1)).addClass("rUpgUn")
    else $("#wormholeinterval" + (i+1)).removeClass("rUpgUn")

    $("#wormholepower" + (i+1)).html("Make the wormhole 35% more powerful<br>Current power: "+shorten(player.wormhole[i].power)+"x<br>Cost: "+shortenDimensions(getWormholePowerCost(i))+" RM")
    if (player.reality.realityMachines.lt(getWormholePowerCost(i))) $("#wormholepower" + (i+1)).addClass("rUpgUn")
    else $("#wormholepower" + (i+1)).removeClass("rUpgUn")

    $("#wormholeduration" + (i+1)).html("Extend the wormhole duration by 30%<br>Current duration: "+(player.wormhole[i].duration).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeDurationCost(i))+" RM")
    if (player.reality.realityMachines.lt(getWormholeDurationCost(i))) $("#wormholeduration" + (i+1)).addClass("rUpgUn")
    else $("#wormholeduration" + (i+1)).removeClass("rUpgUn")
  }
  if (planet !== undefined) // This function gets called once on-load before the wormhole is initialized
    recalculateOrbit();
 }

function unlockWormhole() {
    if (player.reality.realityMachines.lt(50)) return false
    if (player.wormhole[0].unlocked) return false
    player.wormhole[0].unlocked = true
    player.reality.realityMachines = player.reality.realityMachines.minus(50)
    giveAchievement("Is this an Interstellar reference?")
    $("#wormholecontainer").show()
    $("#whupg1").show()
    $("#wormholeunlock").hide()
}

function getWormholeIntervalCost(i) {
    var amountOfPurchases = Math.round(Math.log(player.wormhole[i].speed / (3600 / (Math.pow(10, i)))) / Math.log(0.8))
    if (i == 2) amountOfPurchases += 33
    return Math.ceil(Math.pow(3.5, amountOfPurchases) * 15 * Math.pow(1000, i))
}

function getWormholePowerCost(i) {
    var amountOfPurchases = Math.round(Math.log(player.wormhole[i].power / (180 / Math.pow(2, i))) / Math.log(1.35))
    if (i == 2) amountOfPurchases += 58
    return Math.ceil(Math.pow(2, amountOfPurchases) * 20 * Math.pow(1000, i))
}

function getWormholeDurationCost(i) {
    var amountOfPurchases = Math.round(Math.log(player.wormhole[i].duration / (10 - i*3)) / Math.log(1.3))
    if (i == 2) amountOfPurchases += 30
    return Math.ceil(Math.pow(4, amountOfPurchases) * 10 * Math.pow(1000, i))
}

function upgradeWormholeInterval(i) {
	totalPhase = getTotalPhase();
  var cost = getWormholeIntervalCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.wormhole[i].speed *= 0.8
  updateWormholeUpgrades()
  if (player.wormhole[i].speed < player.wormhole[i].duration) giveAchievement("Are you sure these are the right way around?")
}

function upgradeWormholePower(i) {
	totalPhase = getTotalPhase();
  var cost = getWormholePowerCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.wormhole[i].power *= 1.35
  updateWormholeUpgrades()
}

function upgradeWormholeDuration(i) {
	totalPhase = getTotalPhase();
  var cost = getWormholeDurationCost(i)
  if (player.reality.realityMachines.lt(cost)) return false
  player.reality.realityMachines = player.reality.realityMachines.minus(cost)
  player.wormhole[i].duration *= 1.3
  updateWormholeUpgrades()
  if (player.wormhole[i].speed < player.wormhole[i].duration) giveAchievement("Are you sure these are the right way around?")
}

function setWormhole(state, i) {
  player.wormhole[i].active = state;
  player.wormhole[i].phase = 0;
}

function updateWormholePhases(wormholeDiff) {
  // This code is intended to successfully update the wormhole phases
  // even for very large values of wormholeDiff.
  wormholeDiff /= 1000;
  let activePeriods = getRealTimePeriodsWithWormholeActive(wormholeDiff);
  for (let i = 0; i < player.wormhole.length && wormholeIsUnlocked(player.wormhole[i]); i++) {
    let wormhole = player.wormhole[i];
    // Prevents a flickering wormhole if phase gets set too high
    // (shouldn't ever happen in practice). Also, more importantly,
    // should work even if activePeriods[i] is very large. To check:
    // This used to always use the period of wormhole[0], now it doesn't,
    // will this cause other bugs?
    wormhole.phase += activePeriods[i];
    if (wormhole.phase >= wormhole.speed + wormhole.duration) {
      // One activation for each full cycle.
      wormhole.activations += Math.floor(wormhole.phase / (wormhole.speed + wormhole.duration));
      wormhole.phase %= wormhole.speed + wormhole.duration;
    }
    if (wormhole.active) {
      if (wormhole.phase >= wormhole.duration) {
        wormhole.phase -= wormhole.duration
        wormhole.active = false
        if (GameUI.notify.wormholes) {
          GameUI.notify.success("Wormhole "+ (i + 1) +" duration ended.");
        }
      }
    } else {
      if (wormhole.phase >= wormhole.speed) {
        wormhole.phase -= wormhole.speed
        wormhole.activations++;
        wormhole.active = true
        if (GameUI.notify.wormholes) {
          GameUI.notify.success("Wormhole "+ (i + 1) +" is active!");
        }
      }
    }
  }
  if (player.wormhole[0].phase >= 60 * 60 * 24) giveAchievement("Bruh, are you like, inside the hole?")
}

// All the wormholes act unlocked while Enslaved is running.
function wormholeIsUnlocked (wormhole) {
  return wormhole.unlocked || Enslaved.isRunning;
}

function updateWormholeUpgradeDisplay (i) {
  if (wormholeIsUnlocked(player.wormhole[i])) {
    $("#whupg" + (i + 1)).show();
  } else {
    $("#whupg" + (i + 1)).hide();
  }
}

function updateWormholeStatusText(i) {
  let wormhole = player.wormhole[i];
  if (!wormholeIsUnlocked(wormhole)) {
    document.getElementById("wormholeStatus" + (i + 1)).textContent = "";
  } else if (wormhole.active && (i === 0 || player.wormhole[i-1].active)) {
    document.getElementById("wormholeStatus" + (i + 1)).textContent = "Wormhole "+ ( i + 1 ) +" is active for " + (wormhole.duration - wormhole.phase).toFixed(1) + " more seconds.";
  } else if (wormhole.active) {
    document.getElementById("wormholeStatus" + (i + 1)).textContent = "Wormhole "+ ( i + 1 ) +" will activate with wormhole " + i + " (for " + (Math.max(0, wormhole.duration - wormhole.phase)).toFixed(1) + " sec)";
  } else {
    document.getElementById("wormholeStatus" + (i + 1)).textContent = "Wormhole "+ ( i + 1 ) +" will activate in " + (wormhole.speed - wormhole.phase).toFixed(1) + " seconds.";
  }
}

function updateWormholeGraphics() {
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
  document.getElementById("wormholeImage").getContext('2d').clearRect(0, 0, 400, 400);
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
  this.canvas = document.getElementById("wormholeImage");
	
  this.draw = function () {
    let disp = this.canvas.getContext('2d');
		let x = this.radius * Math.sin(2*Math.PI * this.angle);
		let y = this.radius * Math.cos(2*Math.PI * this.angle);
    disp.beginPath();
    disp.lineWidth = 2*this.size;
    
		// Wormhole 1 active, draw some trails
		if (player.wormhole[0].active && this.isParticle && !this.respawnTick) {
      if (!this.isInside || (player.wormhole[0].active && player.wormhole[1].active)) {
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
    else if (!this.isInside || (player.wormhole[0].active && player.wormhole[1].active)) {  // Particle and planet
      disp.arc(x + 200, y + 200, this.size, 0, 2*Math.PI);
    }
		
		if (this.isParticle) {
			if (player.wormhole[0].active) {
        if (this.radius > bhSize) { // Trails outside wormhole
          let dist = Math.floor(127 * (this.radius - bhSize) / semimajorAxis);
          disp.strokeStyle = "rgb(" + (255-dist) + ", " + dist + ", " + dist + ")";
        }
        if (this.radius < bhSize) { // Trails inside wormhole
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
      if (player.wormhole[0].active) {
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
 
// Code was originally written to use phase over a cycle of active+inactive time and would be really difficult to rewrite to use the current wormhole phase
// Example on what this is: if the wormhole has intervals of 100+10 then this ranges from 0 to 110 and is active when less than 5 or more than 105
function getTotalPhase() {
	if (player.wormhole[0].active) {
		return (player.wormhole[0].phase - player.wormhole[0].duration/2 + period) % period;
  }
	else {
		return player.wormhole[0].phase + player.wormhole[0].duration/2;
  }
}

// Should only be run once on game load
let particleList = [];
function initializeWormhole() {
	// Black hole and planet
  planet = new Dot(planetSize, 'planet', 0, 0);
	hole = new Dot(0, 'hole', 0, 0);
			
	// Orbital size parameters
	semimajorAxis = 100;   										// Basically orbit size in pixels, can be changed
	period = player.wormhole[0].speed + player.wormhole[0].duration;	// Time taken for one orbit (in seconds)
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
	
	period = player.wormhole[0].speed + player.wormhole[0].duration;		// Update orbital period
	calculateOrbitParams();
	hole.size = (bhSize - planetSize) / 2;							// Prevent planet+hole overlapping
	
	// Do stuff to make sure the relative position of the planet stays about the same
	totalPhase = currOrbitPos * period;
	if (player.wormhole[0].active) {
    
	}
	else {
		player.wormhole[0].phase = totalPhase - player.wormhole[0].duration/2;
		if (player.wormhole[0].phase < 0) {
			player.wormhole[0].active = true;
			player.wormhole[0].phase += player.wormhole[0].duration/2;
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

// Finds and sets orbital parameters so the wormhole active time approximately corresponds to time with >2x
let activeThreshold = 2;
function calculateOrbitParams() {
  // Fixed-point iteration for eccentricity (I'm really hoping this always converges)
	y = (1 - Math.pow(activeThreshold, -2)) / (1 - Math.pow(player.wormhole[0].power, -2));
	eccentricity = 0.5;
	maxIter = 1000;
	for (let k = 0; k < maxIter; k++) {
		eccentricity = (y - 1) / (y*Math.cos(E(eccentricity, 2 * Math.PI * Math.min(0.9, player.wormhole[0].duration / period))) - 1)
  }
			
	// Black hole size, calculated from orbit shape in order to give the right max boost
	bhSize = semimajorAxis*(1 - eccentricity) * (1 - Math.pow(player.wormhole[0].power, -2));
}

// Used for particle spawning, note that particles can be farther out when active
function getRandomRadius() {
	return bhSize + 0.5*semimajorAxis*Math.random() * (player.wormhole[0].active ? 2 : 1);
}

function pauseWormhole() {
  player.wormholePause = !player.wormholePause
  if (player.wormholePause) $("#pauseButton").addClass("rUpgBought")
  else $("#pauseButton").removeClass("rUpgBought")
}

// This function takes the total real time spent offline,
// a number of ticks to simulate, a tolerance for how far ticks can be
// from average (explained later), and returns a single realTickTime and
// wormholeSpeed representing the real time taken up by the first simulated tick
// and the game speed due to wormholes during it.

// This code makes sure that the following conditions are satisfied:
// 1: realTickTime * wormholeSpeed is exactly (up to some small
// multiple of floating-point precision) the game time which would be spent
// after realTickTime real time, accounting for wormholes
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
function calculateWormholeOfflineTick(totalRealTime, numberOfTicks, tolerance) {
  // Cache speedups, so getGameTimeFromRealTime doesn't recalculate them every time.
  let speedups = calculateWormholeSpeedups();
  let totalGameTime = getGameTimeFromRealTime(totalRealTime, speedups);
  // We have this special case just in case some floating-point mess prevents binarySearch from working in the numberOfTicks = 1 case.
  // I doubt that's possible but it seems worth handling just in case.
  if (numberOfTicks === 1) {
    return [totalRealTime, totalGameTime / totalRealTime];
  }
  // We want getGameTimeFromRealTime(realTickTime, speedups) * numberOfTicks / totalGameTime to be roughly 1
  // (that is, the tick taking realTickTime real time has roughly average length in terms of game time).
  // We use binary search because it has somewhat better worst-case behavior than linear interpolation search here.
  // Suppose you have 3000 seconds without a wormhole and then 100 seconds of a wormhole with 3000x power, and you want to find
  // when 4000 seconds of game time have elapsed. With binary search it will take only 20 steps or so to get reasonable accuracy,
  // but with linear interpolation it will take about 100 steps.
  // These extra steps might always average out with cases where linear interpolation is quicker though.
  let realTickTime = binarySearch(0, totalRealTime, x => getGameTimeFromRealTime(x, speedups) * numberOfTicks / totalGameTime, 1, tolerance);
  let wormholeSpeedup = getGameTimeFromRealTime(realTickTime, speedups) / realTickTime;
  return [realTickTime, wormholeSpeedup];
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

// Returns a list of length (number of unlocked wormholes + 1),
// where each element is the *total* speedup while that wormhole
// is the highest-numbered wormhole active, the wormholes being numbered
// starting from wormhole 1 and wormhole 0 being normal game.
// speedups[0] is thus 1, and speedups[i + 1] is speedups[i] * player.wormhole[i].power
// (player.wormhole[i].power being the speedup from player.wormhole[i]).
function calculateWormholeSpeedups() {
  let speedups = [1];
  for (let wormhole of player.wormhole.filter(wormholeIsUnlocked)) {
    speedups.push(speedups.last() * wormhole.power);
  }
  return speedups;
}

function getGameTimeFromRealTime(realTime, speedups) {
  let effectivePeriods = getRealTimePeriodsWithWormholeEffective(realTime, speedups);
  return effectivePeriods
    .map((period, i) => period * speedups[i])
    .sum();
}

// Returns the amount of real time spent with each unlocked wormhole
// being the current "effective" wormhole, that is, the active wormhole
// with the highest index.
// For example:
// active periods = [100, 20, 5] (100ms of real time, 20ms of wormhole 1, 5ms of wormhole 2)
// effective periods = [80, 15, 5]
// 80ms of effective real time, because wormhole 1 will be running in total 20ms => 100 - 20
// 15ms of effective wormhole 1 time, because wormhole 2 will be running in total 5ms => 20 - 5
// 5ms of effective wormhole 2 time, because no higher wormhole overlaps it, so it is effective for the whole active period
// Note: even though more than one wormhole can be active
// (and thus effective) at once, the calling function first calculates the total speedups
// while each wormhole is the highest-index wormhole that's active and then acts
// as if only the highest-index wormhole that's active is effective.
function getRealTimePeriodsWithWormholeEffective(realTime) {
  let activePeriods = getRealTimePeriodsWithWormholeActive(realTime);
  let effectivePeriods = [];
  for (let i = 0; i < activePeriods.length - 1; i++) {
    effectivePeriods.push(activePeriods[i] - activePeriods[i + 1]);
  }
  effectivePeriods.push(activePeriods.last());
  return effectivePeriods;
}

// Returns an array of real time periods spent in each wormhole
// with first element being the "no wormhole" state that is normal game.
function getRealTimePeriodsWithWormholeActive(realTime) {
  let activePeriods = [realTime];
  for (let wormhole of player.wormhole.filter(wormholeIsUnlocked)) {
    const activeTime = getRealTimeWithWormholeActive(wormhole, activePeriods.last())
    activePeriods.push(activeTime);
  }
  return activePeriods;
}

// Given a wormhole and the time for which the previous wormhole is active,
// this function returns the time for which the given wormhole is active.
// For example, if wormhole = player.wormhole[1], this function, given
// the time for which player.wormhole[0] is active, will return the time for which
// player.wormhole[1] is active during that time.
function getRealTimeWithWormholeActive(wormhole, time) {
  let nextDeactivation = timeUntilNextDeactivation(wormhole);
  let cooldown = wormhole.speed;
  let duration = wormhole.duration;
  let fullCycle = cooldown + duration;
  const currentActivationDuration = Math.min(nextDeactivation, duration);
  const activeCyclesUntilLastDeactivation = Math.floor((time - nextDeactivation) / fullCycle);
  const activeTimeUntilLastDeactivation = duration * activeCyclesUntilLastDeactivation;
  const timeLeftAfterLastDeactivation = (time - nextDeactivation + fullCycle) % fullCycle;
  const lastActivationDuration = Math.max(timeLeftAfterLastDeactivation - cooldown, 0);
  return currentActivationDuration + activeTimeUntilLastDeactivation + lastActivationDuration;
}

// Returns the time that the previous wormhole must be active until the next change
// from the active state to the inactive state. For example, if wormhole = player.wormhole[1],
// this function will return the time player.wormhole[0] must be active for player.wormhole[1]
// to transition to the inactive state. This is useful since player.wormhole[1]'s phase
// only increases (that is, its state only changes) while player.wormhole[0] is active.
// In general, a wormhole only changes state while the previous wormhole is active.
// So figuring out how long a wormhole would be active after some amount of real time
// (as we do) is best done iteratively via figuring out how long a wormhole would be active
// after a given amount of time of the previous wormhole being active.
function timeUntilNextDeactivation(wormhole) {
  if (wormhole.active) {
    return wormhole.duration - wormhole.phase;
  } else {
    return wormhole.duration + wormhole.speed - wormhole.phase;
  }
}

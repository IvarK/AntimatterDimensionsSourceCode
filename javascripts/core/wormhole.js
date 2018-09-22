/**
 * Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x3.5, starts at 15
 * Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
 * Duration: starts at 10, x1.5 per upgrade, cost goes x4, starts at 10
 * 
 */

 function updateWormholeUpgrades() {
    $("#wormholeinterval").html("Speed up the wormhole up 25%<br>Current interval: "+(player.wormhole.speed).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeIntervalCost())+"RM")
    if (player.reality.realityMachines < getWormholeIntervalCost()) $("#wormholeinterval").addClass("rUpgUn")
    else $("#wormholeinterval").removeClass("rUpgUn")

    $("#wormholepower").html("Make the wormhole 35% more powerful<br>Current power: "+(player.wormhole.power).toFixed(1)+"x<br>Cost: "+shortenDimensions(getWormholePowerCost())+"RM")
    if (player.reality.realityMachines < getWormholePowerCost()) $("#wormholepower").addClass("rUpgUn")
    else $("#wormholepower").removeClass("rUpgUn")

    $("#wormholeduration").html("Extend the wormhole duration by 30%<br>Current duration: "+(player.wormhole.duration).toFixed(1)+" seconds<br>Cost: "+shortenDimensions(getWormholeDurationCost())+"RM")
    if (player.reality.realityMachines < getWormholeDurationCost()) $("#wormholeduration").addClass("rUpgUn")
    else $("#wormholeduration").removeClass("rUpgUn")

	recalculateOrbit();
 }

function unlockWormhole() {
    if (player.reality.realityMachines.lt(50)) return false
    if (player.wormhole.unlocked) return false
    player.wormhole.unlocked = true
    player.reality.realityMachines = player.reality.realityMachines.minus(50)
    $("#wormholecontainer").show()
    $(".wormhole-upgrades").show()
    $("#wormholeunlock").hide()
}

function getWormholeIntervalCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.speed / 3600) / Math.log(0.8))
    return Math.ceil(Math.pow(3.5, amountOfPurchases) * 15)
}

function getWormholePowerCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.power / 180) / Math.log(1.35))
    return Math.ceil(Math.pow(2, amountOfPurchases) * 20)
}

function getWormholeDurationCost() {
    var amountOfPurchases = Math.round(Math.log(player.wormhole.duration / 10) / Math.log(1.5))
    return Math.ceil(Math.pow(4, amountOfPurchases) * 10)
}

function upgradeWormholeInterval() {
	totalPhase = getTotalPhase();
    var cost = getWormholeIntervalCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.speed *= 0.8
    updateWormholeUpgrades()
}

function upgradeWormholePower() {
	totalPhase = getTotalPhase();
    var cost = getWormholePowerCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.power *= 1.35
    updateWormholeUpgrades()
}

function upgradeWormholeDuration() {
	totalPhase = getTotalPhase();
    var cost = getWormholeDurationCost()
    if (player.reality.realityMachines.lt(cost)) return false
    player.reality.realityMachines = player.reality.realityMachines.minus(cost)
    player.wormhole.duration *= 1.3
    updateWormholeUpgrades()
}

function setWormhole(state) {
  player.wormhole.active = state;
  player.wormhole.phase = 0;
}

let totalPhase;
function wormHoleLoop(diff) {
	// Change wormhole state
	let incPhase = diff / 1000;
    if (player.wormhole.active) {
      incPhase /= player.wormhole.power;
      document.getElementById("wormholeStatus").textContent = "Wormhole is active for " + (player.wormhole.duration - player.wormhole.phase).toFixed(1) + " more seconds.";
      if (player.wormhole.phase >= player.wormhole.duration) {
        player.wormhole.phase -= player.wormhole.duration
        player.wormhole.active = false
        updateTickSpeed();
      }
    } else {
      document.getElementById("wormholeStatus").textContent = "Wormhole will activate in " + (player.wormhole.speed - player.wormhole.phase).toFixed(1) + " seconds.";
      if (player.wormhole.phase >= player.wormhole.speed) {
        player.wormhole.phase -= player.wormhole.speed
        player.wormhole.active = true
        updateTickSpeed();
      }
    }
	player.wormhole.phase += incPhase;
	totalPhase = getTotalPhase();
			
    // Update orbital position parameters (polar coordinates centered on hole, theta goes 0 to 1 because I'm apparently stupid)
    E0 = E(eccentricity, 2 * Math.PI * totalPhase / period);    // "eccentric anomaly"
    r = semimajorAxis*(1 - eccentricity*Math.cos(E0));
    theta = 2 * Math.atan(Math.sqrt((1+eccentricity)/(1-eccentricity) * Math.pow(Math.tan(E0/2), 2)));
    if (Math.tan(E0/2) < 0)
        theta *= -1;
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
	this.respawn = true;
  this.canvas = document.getElementById("wormholeImage");
	
  this.draw = function () {
    let disp = this.canvas.getContext('2d');
		let x = this.radius * Math.sin(2*Math.PI * this.angle);
		let y = this.radius * Math.cos(2*Math.PI * this.angle);
    disp.beginPath();
    disp.lineWidth = 2*this.size;
		
		// Wormhole active, draw some trails
		if (player.wormhole.active && this.isParticle && !this.respawn) {
			let prevX = this.prevRadius * Math.sin(2*Math.PI * this.prevAngle);
			let prevY = this.prevRadius * Math.cos(2*Math.PI * this.prevAngle);
			disp.lineCap = 'round';
			disp.lineWidth *= 1;
			disp.moveTo(x + 200, y + 200);
			disp.lineTo(prevX + 200, prevY + 200);
		}
		else {
      if (this.isHole) {  // Glowing effect to make it more visible on dark themes
        let glow = disp.createRadialGradient(x + 200, y + 200, 0, x + 200, y + 200, this.size * 2);
        glow.addColorStop(0, "rgba(0, 0, 0, 1)");
        glow.addColorStop(0.9, "rgba(0, 0, 0, 1)");
        glow.addColorStop(0.92, "rgba(100, 100, 100, 1)");
        glow.addColorStop(1, "rgba(100, 100, 100, 0)");
        disp.fillStyle = glow;
        disp.fillRect(0, 0, 400, 400);
      }
      else
        disp.arc(x + 200, y + 200, this.size, 0, 2*Math.PI);
    }
		
		if (this.isParticle)
			if (player.wormhole.active) {
        let dist = Math.floor(127 * (this.radius - bhSize) / semimajorAxis);
				disp.strokeStyle = "rgb(" + (255-dist) + ", " + dist + ", " + dist + ")";
      }
			else
				disp.strokeStyle = "rgb(127, 127, 127)";
		else if (this.isPlanet)
			disp.strokeStyle = "rgb(0, 0, 255)";
		else
			disp.strokeStyle = "rgb(0, 0, 0)";
        disp.stroke();
		}
		
		// Move particles
		this.update = function () {
		if (this.isParticle) {
			let particleSpeed = 0.05 * Math.min(Math.pow(Math.max(delta,2)/2, 3), 5);
			if (player.wormhole.active) {
				this.prevAngle = this.angle;
				this.prevRadius = this.radius;
			}
			this.angle = (this.angle + 20*particleSpeed*Math.PI*Math.pow(this.radius, -1.5)) % 1;
			this.radius /= 1 + 0.3*particleSpeed*Math.pow(this.radius / bhSize, -2);
				
			if (this.radius < bhSize) {		// Particle fell in, disable the trail and respawn it outside
				this.radius = getRandomRadius();
				this.angle += Math.random();
				this.respawn = true;
			}
			else
				this.respawn = false;
		}
	}
 }
 
 // Code was originally written to use phase over a cycle of active+inactive time and would be really difficult to rewrite to use the current wormhole phase
 // Example on what this is: if the wormhole has intervals of 100+10 then this ranges from 0 to 110 and is active when less than 5 or more than 105
function getTotalPhase() {
	if (player.wormhole.active)
		return (player.wormhole.phase - player.wormhole.duration/2 + period) % period;
	else
		return player.wormhole.phase + player.wormhole.duration/2;
 }

// Should only be run once on game load
let particleList = [];
function initializeWormhole() {
	// Black hole and planet
    planet = new Dot(planetSize, 'planet', 0, 0);
	hole = new Dot(0, 'hole', 0, 0);
			
	// Orbital size parameters
	semimajorAxis = 100;   										// Basically orbit size in pixels, can be changed
	period = player.wormhole.speed + player.wormhole.duration;	// Time taken for one orbit (in seconds)
	totalPhase = getTotalPhase();
			
	// A fair bit of calculation, should probably only be called on-load and after upgrades
	calculateOrbitParams();
	hole.size = (bhSize - planetSize) / 2;	// Prevent planet+hole overlapping
			
	// Particles (scaled to take the same range as the orbit)
	particleList = [hole];
	numParticles = 80;
	for (let i = 0; i < numParticles; i++)
		particleList.push(new Dot(planetSize / 3, 'particle', getRandomRadius(), Math.random()));
	particleList.push(planet);
}

// Only run on purchase, recalculates orbital parameters and makes sure the planet doesn't move much after upgrades
let eccentricity, semimajorAxis, period, bhSize, planet, hole;
function recalculateOrbit() {
	let currOrbitPos = totalPhase / period;
	
	period = player.wormhole.speed + player.wormhole.duration;		// Update orbital period
	calculateOrbitParams();
	hole.size = (bhSize - planetSize) / 2;							// Prevent planet+hole overlapping
	
	// Do stuff to make sure the relative position of the planet stays about the same
	totalPhase = currOrbitPos * period;
	if (player.wormhole.active) {
		
	}
	else {
		player.wormhole.phase = totalPhase - player.wormhole.duration/2;
		if (player.wormhole.phase < 0) {
			player.wormhole.active = true;
			player.wormhole.phase += player.wormhole.duration/2;
		}
	}
}

// Calculates "eccentric anomaly" from "mean anomaly", see https://en.wikipedia.org/wiki/Kepler%27s_equation#Numerical_approximation_of_inverse_problem
// Needed for accurate Keplerian orbit shape and velocity, apparently math is hard
function E(eccentricity, M) {
    let E0 = M
    maxIter = 20;	// idk I hope 20 is enough to converge
    for (let k = 0; k < maxIter; k++)
        E0 = M + eccentricity * Math.sin(E0);
    return E0;
}

// Finds and sets orbital parameters so the wormhole active time approximately corresponds to time with >2x
let activeThreshold = 2;
function calculateOrbitParams() {
    // Fixed-point iteration for eccentricity (I'm really hoping this always converges)
	y = (1 - Math.pow(activeThreshold, -2)) / (1 - Math.pow(player.wormhole.power, -2));
	eccentricity = 0.5;
	maxIter = 1000;
	for (let k = 0; k < maxIter; k++)
		eccentricity = (y - 1) / (y*Math.cos(E(eccentricity, 2 * Math.PI * (player.wormhole.duration / period))) - 1)
			
	// Black hole size, calculated from orbit shape in order to give the right max boost
	bhSize = semimajorAxis*(1 - eccentricity) * (1 - Math.pow(player.wormhole.power, -2));
}

// Used for particle spawning, note that particles can be farther out when active
function getRandomRadius() {
	return bhSize + 0.5*semimajorAxis*Math.random() * (player.wormhole.active ? 2 : 1);
}
export const BlackHoleAnimation = (function() {
  const PLANET_SIZE = 1.5;
  const PARTICLE_SIZE = 0.5;
  const PARTICLE_COUNT = 120;
  // Basically orbit size in pixels
  const SEMIMAJOR_AXIS = 100;
  // Black Hole active time approximately corresponds to time with >2x
  const ACTIVE_THRESHOLD = 2;

  let holeSize;

  // Calculates "eccentric anomaly" from "mean anomaly",
  // see https://en.wikipedia.org/wiki/Kepler%27s_equation#Numerical_approximation_of_inverse_problem
  // Needed for accurate Keplerian orbit shape and velocity, apparently math is hard
  function eccentricAnomaly(eccentricity, meanAnomaly) {
    let E0 = meanAnomaly;
    // I hope 20 is enough to converge
    const maxIter = 20;
    for (let k = 0; k < maxIter; k++) {
      E0 = meanAnomaly + eccentricity * Math.sin(E0);
    }
    return E0;
  }

  class Dot {
    draw(context) {
      context.beginPath();
      context.lineWidth = 2 * this.size;
      this.performDraw(context);
      context.stroke();
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-empty-function, no-unused-vars
    performDraw(context) { }

    static calculatePosition(distance, angle) {
      return {
        x: distance * Math.sin(2 * Math.PI * angle),
        y: distance * Math.cos(2 * Math.PI * angle)
      };
    }
  }

  class Planet extends Dot {
    constructor() {
      super();
      this.angle = 0;
      this.distance = 0;
      this.size = PLANET_SIZE;
    }

    update(totalPhase, eccentricity, period) {
      // Update orbital position parameters (polar coordinates centered on hole,
      // theta goes 0 to 1 because I'm apparently stupid)
      const E0 = eccentricAnomaly(eccentricity, 2 * Math.PI * totalPhase / period);
      const r = SEMIMAJOR_AXIS * (1 - eccentricity * Math.cos(E0));
      let theta = 2 * Math.atan(Math.sqrt((1 + eccentricity) / (1 - eccentricity) * Math.pow(Math.tan(E0 / 2), 2)));
      if (Math.tan(E0 / 2) < 0) theta *= -1;
      this.distance = r;
      this.angle = theta / (2 * Math.PI);
    }

    performDraw(context) {
      const { x, y } = Dot.calculatePosition(this.distance, this.angle);
      context.arc(x + 200, y + 200, PLANET_SIZE, 0, 2 * Math.PI);
      context.strokeStyle = "rgb(0, 0, 255)";
    }
  }

  class Hole extends Dot {
    constructor(size) {
      super();
      this.size = size;
    }

    performDraw(context) {
      // Glowing effect to make the hole more visible on dark themes
      const glow = context.createRadialGradient(200, 200, 0, 200, 200, this.size * 2);
      if (BlackHoles.areNegative) {
        glow.addColorStop(0, "rgba(255, 255, 255, 1)");
        glow.addColorStop(0.85, "rgba(190, 190, 190, 1)");
        glow.addColorStop(0.87, "rgba(170, 170, 170, 1)");
        glow.addColorStop(1, "rgba(135, 135, 135, 0)");
      } else {
        glow.addColorStop(0, "rgba(0, 0, 0, 1)");
        glow.addColorStop(0.9, "rgba(0, 0, 0, 1)");
        glow.addColorStop(0.92, "rgba(100, 100, 100, 1)");
        glow.addColorStop(1, "rgba(100, 100, 100, 0)");
      }
      context.fillStyle = glow;
      context.fillRect(0, 0, 400, 400);
      context.strokeStyle = "black";
    }
  }

  const blobs = "";
  class Particle extends Dot {
    constructor() {
      super();
      this.size = PARTICLE_SIZE;
      this.respawn();
    }

    respawn() {
      this.distance = Particle.randomDistance();
      this.lastDistance = this.distance;
      this.preLastDistance = this.distance;
      this.angle = Math.random();
      this.lastAngle = this.angle;
      this.preLastAngle = this.angle;
      this.respawnTick = true;
      this.isInside = BlackHoles.areNegative;
      this.blob = blobs[Math.floor(Math.random() * blobs.length)];
      this.isBlob = Theme.currentName() === "S11";
    }

    static randomDistance() {
      return BlackHoles.areNegative
        ? (1.97 * Math.random() + 0.03) * holeSize
        : holeSize + 0.5 * SEMIMAJOR_AXIS * Math.random() * (BlackHole(1).isActive ? 2 : 1);
    }

    update(delta, dilationFactor) {
      const baseSpeed = 1.5;
      const speedFactor = Math.min(Math.pow(Math.max(dilationFactor, 2) / 2, 3), 5);
      const particleSpeed = baseSpeed * speedFactor * Math.min(delta, 16) / 1000;

      if (!this.isInside) {
        this.preLastAngle = this.lastAngle;
        this.lastAngle = this.angle;
        this.angle = (this.angle + 20 * particleSpeed * Math.PI * Math.pow(this.distance, -1.5)) % 1;
      }

      this.preLastDistance = this.lastDistance;
      this.lastDistance = this.distance;
      const distFactor = 1 + 0.3 * particleSpeed * Math.pow(this.distance / holeSize, -2);
      if (BlackHoles.areNegative) {
        this.distance *= distFactor;
      } else {
        this.distance /= distFactor;
      }

      // This magic number is a numerical result from the arcane (and probably now-unneeded) math below
      // in the Animation constructor, assuming reasonable values for the game state at the point when
      // inverting is unlocked. The end result is that particles despawn in the inverted animation at
      // roughly the maximum spawning distance as the forward animation
      if (this.distance > 2.74645 * holeSize && BlackHoles.areNegative) {
        this.respawn();
      } else if (this.distance < 0.01 * holeSize && !BlackHoles.areNegative) {
        this.respawn();
        return;
      }

      this.isInside = this.distance <= holeSize * 0.865;
      this.respawnTick = false;
    }

    performDraw(context) {
      this.drawTrail(context);

      if (!BlackHole(1).isActive) {
        context.strokeStyle = "rgb(127, 127, 127)";
        return;
      }

      const { distance } = this;

      if (distance > holeSize) {
        // Trails outside black hole
        const dist = Math.floor(127 * (distance - holeSize) / SEMIMAJOR_AXIS);
        context.strokeStyle = `rgb(${135 - dist}, ${dist}, ${dist})`;
      }

      if (distance <= holeSize) {
        // Trails inside black hole
        const dist = Math.floor(255 * Math.sqrt(distance / holeSize));
        context.strokeStyle = `rgb(${dist}, 0, 0)`;
      }
    }

    drawTrail(context) {
      if (this.isInside && !BlackHole(2).isActive) {
        return;
      }
      const { x, y } = Dot.calculatePosition(this.distance, this.angle);
      if (this.respawnTick || !BlackHole(1).isActive) {
        context.arc(x + 200, y + 200, this.size, 0, 2 * Math.PI);
        if (this.isBlob) this.drawAndRotateBlob(context, x, y);
        return;
      }
      const angle = this.isInside ? this.angle : this.preLastAngle;
      const { x: lastX, y: lastY } = Dot.calculatePosition(this.preLastDistance, angle);
      context.lineCap = "round";

      if (this.isBlob) {
        this.drawAndRotateBlob(context, x, y);
      } else {
        context.lineWidth *= 1;
        context.moveTo(x + 200, y + 200);
        context.lineTo(lastX + 200, lastY + 200);
      }
    }

    drawAndRotateBlob(context, x, y) {
      const FONT_SIZE = 18;
      context.textAlign = "center";
      context.fillStyle = "orange";

      if (this.distance <= holeSize) {
        const scale = this.distance / holeSize;
        const px = FONT_SIZE * Math.sqrt(scale);
        const green = 165 * scale ** 2;

        context.fillStyle = `rgba(255, ${green}, 0, ${scale * 2})`;
        context.font = `${px}px Typewriter`;
      } else {
        context.font = `${FONT_SIZE}px Typewriter`;
      }

      context.save();
      context.translate(x + 200, y + 200);
      context.rotate(-this.angle * Math.PI * 2 + Math.PI);
      context.fillText(this.blob, 0, 0);
      context.restore();
    }
  }

  return class Animation {
    constructor(context) {
      this.context = context;
      this.planet = new Planet();

      // Time taken for one orbit (in seconds)
      this.period = BlackHole(1).cycleLength;
      // Fixed-point iteration for eccentricity (I'm really hoping this always converges)
      const y = (1 - Math.pow(ACTIVE_THRESHOLD, -2)) / (1 - Math.pow(BlackHole(1).power, -2));
      let eccentricity = 0.5;
      const maxIter = 1000;
      const meanAnomaly = 2 * Math.PI * Math.min(0.9, BlackHole(1).duration / this.period);
      for (let k = 0; k < maxIter; k++) {
        const E0 = eccentricAnomaly(eccentricity, meanAnomaly);
        eccentricity = (y - 1) / (y * Math.cos(E0) - 1);
      }
      this.eccentricity = eccentricity;

      // Black Hole size, calculated from orbit shape in order to give the right max boost
      holeSize = SEMIMAJOR_AXIS * (1 - eccentricity) * (1 - Math.pow(BlackHole(1).power, -2));
      // Prevent planet + hole overlapping
      this.hole = new Hole((holeSize - PLANET_SIZE) / 2);

      // Particles (scaled to take the same range as the orbit)
      this.particles = Array.range(0, PARTICLE_COUNT).map(() => new Particle());
      this.frameRequest = requestAnimationFrame(time => this.update(time));
    }

    update(time) {
      this.frameRequest = requestAnimationFrame(t => this.update(t));
      if (time === undefined || this.lastFrame === undefined) {
        this.lastFrame = time;
        return;
      }
      const delta = time - this.lastFrame;
      this.lastFrame = time;

      this.planet.update(this.totalPhase(), this.eccentricity, this.period);

      this.context.clearRect(0, 0, 400, 400);
      this.hole.draw(this.context);
      for (const particle of this.particles) {
        particle.draw(this.context);
      }

      if (BlackHoles.arePaused && !BlackHoles.areNegative) return;


      // Time dilation factor (Realistic formula, but only actually used for particle speed)
      const dilationFactor = 1 / Math.sqrt(1 - holeSize / this.planet.distance);
      for (const particle of this.particles) {
        particle.update(delta, dilationFactor);
      }
    }

    // Code was originally written to use phase over a cycle of active+inactive time and
    // would be really difficult to rewrite to use the current black hole phase
    // Example on what this is: if the black hole has intervals of 100+10 then this ranges
    // from 0 to 110 and is active when less than 5 or more than 105
    totalPhase() {
      const blackHole = BlackHole(1);
      if (blackHole.isActive) {
        return (blackHole.phase - blackHole.duration / 2 + this.period) % this.period;
      }

      return blackHole.phase + blackHole.duration / 2;
    }

    unmount() {
      cancelAnimationFrame(this.frameRequest);
    }
  };
}());

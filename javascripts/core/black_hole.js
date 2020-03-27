"use strict";

class BlackHoleUpgradeState {
  constructor(config) {
    const { getAmount, setAmount, calculateValue, initialCost, costMult } = config;
    this.incrementAmount = () => setAmount(getAmount() + 1);
    this._lazyValue = new Lazy(() => calculateValue(getAmount()));
    this._lazyCost = new Lazy(() => getHybridCostScaling(getAmount(),
      1e30,
      initialCost,
      costMult,
      0.2,
      new Decimal("1e310"),
      1e5,
      10));
    this.id = config.id;
    this.hasAutobuyer = config.hasAutobuyer;
    this.onPurchase = config.onPurchase;
  }

  get value() {
    return this._lazyValue.value;
  }

  get cost() {
    return this._lazyCost.value;
  }

  get isAffordable() {
    return player.reality.realityMachines.gte(this.cost);
  }
  
  get autobuyerId() {
    return this.id - 1;
  }
  
  get isAutobuyerOn() {
    if (this.hasAutobuyer) {
      return player.blackHole[this.autobuyerId].autoPower;
    }
    throw new Error("Trying to get status of the autobuyer of a black hole upgrade without an autobuyer.");
  }

  set isAutobuyerOn(value) {
    if (this.hasAutobuyer) {
      player.blackHole[this.autobuyerId].autoPower = value;
    } else {
      throw new Error("Trying to set status of the autobuyer of a black hole upgrade without an autobuyer.");
    }
  }

  purchase() {
    if (!this.isAffordable || this.value === 0) return;
    player.reality.realityMachines = player.reality.realityMachines.minus(this.cost);
    this.incrementAmount();
    this._lazyValue.invalidate();
    this._lazyCost.invalidate();
    if (this.onPurchase) {
      this.onPurchase();
    }
    EventHub.dispatch(GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT);
  }
}

class BlackHoleState {
  constructor(id) {
    this.id = id + 1;
    const blackHoleCostMultipliers = [1, 1000];
    // Interval: starts at 3600, x0.8 per upgrade, upgrade cost goes x3.5, starts at 15
    this.intervalUpgrade = new BlackHoleUpgradeState({
      id: this.id,
      getAmount: () => this._data.intervalUpgrades,
      setAmount: amount => this._data.intervalUpgrades = amount,
      calculateValue: amount => {
        const baseAmount = (3600 / (Math.pow(10, id))) * Math.pow(0.8, amount);
        return baseAmount < 0.1 ? 0 : baseAmount;
      },
      initialCost: 15 * blackHoleCostMultipliers[id],
      costMult: 3.5,
      hasAutobuyer: false,
      onPurchase: () => {
        if (!this.isCharged) {
          this._data.phase = Math.clampMax(this.interval, this._data.phase);
        }
      }
    });
    // Power: starts at 5, x1.35 per upgrade, cost goes x2, starts at 20
    this.powerUpgrade = new BlackHoleUpgradeState({
      id: this.id,
      getAmount: () => this._data.powerUpgrades,
      setAmount: amount => this._data.powerUpgrades = amount,
      calculateValue: amount => (180 / Math.pow(2, id)) * Math.pow(1.35, amount),
      initialCost: 20 * blackHoleCostMultipliers[id],
      costMult: 2,
      hasAutobuyer: true
    });
    // Duration: starts at 10, x1.5 per upgrade, cost goes x4, starts at 10
    this.durationUpgrade = new BlackHoleUpgradeState({
      id: this.id,
      getAmount: () => this._data.durationUpgrades,
      setAmount: amount => this._data.durationUpgrades = amount,
      calculateValue: amount => (10 - (id) * 3) * Math.pow(1.3, amount),
      initialCost: 10 * blackHoleCostMultipliers[id],
      costMult: 4,
      hasAutobuyer: false
    });
  }

  /**
   * @private
   */
  get _data() {
    return player.blackHole[this.id - 1];
  }

  /**
   * Amount of time the black hole is inactive for between activations.
   */
  get interval() {
    return this.intervalUpgrade.value;
  }

  /**
   * Multiplier to time the black hole gives when active.
   */
  get power() {
    return this.powerUpgrade.value;
  }

  /**
   * Amount of time the black hole is active for.
   */
  get duration() {
    return this.durationUpgrade.value;
  }

  get isUnlocked() {
    return this._data.unlocked && !Enslaved.isRunning;
  }

  get isCharged() {
    return this._data.active;
  }

  // When inactive, returns time until active; when active, returns time until inactive (or paused for hole 2)
  get timeToNextStateChange() {
    let remainingTime = this.isCharged
      ? this.duration - this.phase
      : this.interval - this.phase;

    if (this.id === 1) return remainingTime;

    // 2nd hole activation logic (not bothering generalizing since we're not adding that 3rd hole again)
    if (this.isCharged) {
      if (BlackHole(1).isCharged) return Math.min(remainingTime, BlackHole(1).timeToNextStateChange);
      return BlackHole(1).timeToNextStateChange;
    }
    if (BlackHole(1).isCharged) {
      if (remainingTime < BlackHole(1).timeToNextStateChange) return remainingTime;
      remainingTime -= BlackHole(1).timeToNextStateChange;
    }
    let totalTime = BlackHole(1).isCharged
      ? BlackHole(1).timeToNextStateChange + BlackHole(1).interval
      : BlackHole(1).timeToNextStateChange;
    totalTime += Math.floor(remainingTime / BlackHole(1).duration) * BlackHole(1).cycleLength;
    totalTime += remainingTime % BlackHole(1).duration;
    return totalTime;
  }

  // This is a value which counts up from 0 to 1 when inactive, and 1 to 0 when active
  get stateProgress() {
    if (this.isCharged) {
      return 1 - this.phase / this.duration;
    }
    return this.phase / this.interval;
  }

  // The logic to determine what state the black hole is in for displaying is nontrivial and used in multiple places
  get displayState() {
    if (Enslaved.isAutoReleasing) {
      if (Enslaved.autoReleaseTick < 3) return `<i class="fas fa-compress-arrows-alt u-fa-padding"></i> Pulsing`;
      return `<i class="fas fa-expand-arrows-alt u-fa-padding"></i> Pulsing`;
    }
    if (Enslaved.isStoringGameTime) {
      if (Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME)) {
        const storedTimeWeight = player.celestials.enslaved.storedFraction;
        if (storedTimeWeight !== 0) {
          return `<i class="fas fa-compress-arrows-alt"></i> Charging (${formatPercents(storedTimeWeight, 1)})`;
        }
      } else {
        return `<i class="fas fa-compress-arrows-alt"></i> Charging`;
      }
    }
    if (BlackHoles.areNegative) return `<i class="fas fa-caret-left"></i> Inverted`;
    if (BlackHoles.arePaused) return `<i class="fas fa-pause"></i> Paused`;
    if (this.isPermanent) return `<i class="fas fa-infinity"></i> Permanent`;

    const timeString = TimeSpan.fromSeconds(this.timeToNextStateChange).toStringShort(true);
    if (this.isActive) return `<i class="fas fa-play"></i> Active (${timeString})`;
    return `<i class="fas fa-redo"></i> Inactive (${timeString})`;
  }

  get isActive() {
    return this.isCharged && (this.id === 1 || BlackHole(this.id - 1).isActive);
  }

  get isPermanent() {
    return this.interval === 0;
  }

  /**
   * Amount of time the black hole has spent since last state transition,
   * so if it's active, it's the amount of time it's been active for, and if it's inactive,
   * it's the amount of time it's been inactive for.
   */
  get phase() {
    return this._data.phase;
  }

  get cycleLength() {
    return this.interval + this.duration;
  }

  updatePhase(activePeriod) {
    // Prevents a flickering black hole if phase gets set too high
    // (shouldn't ever happen in practice). Also, more importantly,
    // should work even if activePeriods[i] is very large. To check:
    // This used to always use the period of blackHole[0], now it doesn't,
    // will this cause other bugs?
    this._data.phase += activePeriod;
    if (this.phase >= this.cycleLength) {
      // One activation for each full cycle.
      this._data.activations += Math.floor(this.phase / this.cycleLength);
      this._data.phase %= this.cycleLength;
    }
    if (this.isCharged) {
      if (this.phase >= this.duration) {
        this._data.phase -= this.duration;
        this._data.active = false;
        if (GameUI.notify.showBlackHoles) {
          GameUI.notify.blackHole(`${this.description(true)} duration ended.`);
        }
      }
    } else if (this.phase >= this.interval) {
      this._data.phase -= this.interval;
      this._data.activations++;
      this._data.active = true;
      if (GameUI.notify.showBlackHoles) {
        GameUI.notify.blackHole(`${this.description(true)} has activated!`);
      }
    }
  }

  /**
   * Given the time for which the previous black hole is active,
   * this function returns the time for which current black hole is active.
   * For example, for BlackHole(2), this function, given
   * the time for which for BlackHole(1) is active, will return the time for which
   * BlackHole(2) is active during that time.
   */
  realTimeWhileActive(time) {
    const nextDeactivation = this.timeUntilNextDeactivation;
    const cooldown = this.interval;
    const duration = this.duration;
    const fullCycle = this.cycleLength;
    const currentActivationDuration = Math.min(nextDeactivation, duration);
    const activeCyclesUntilLastDeactivation = Math.floor((time - nextDeactivation) / fullCycle);
    const activeTimeUntilLastDeactivation = duration * activeCyclesUntilLastDeactivation;
    const timeLeftAfterLastDeactivation = (time - nextDeactivation + fullCycle) % fullCycle;
    const lastActivationDuration = Math.max(timeLeftAfterLastDeactivation - cooldown, 0);
    return currentActivationDuration + activeTimeUntilLastDeactivation + lastActivationDuration;
  }

  /**
   * Returns the time that the previous black hole must be active until the next change
   * from the active state to the inactive state. For example, for BlackHole(2),
   * this function will return the time BlackHole(1) must be active for BlackHole(2)
   * to transition to the inactive state. This is useful since BlackHole(2)'s phase
   * only increases (that is, its state only changes) while BlackHole(1) is active.
   * In general, a black hole only changes state while the previous black hole is active.
   * So figuring out how long a black hole would be active after some amount of real time
   * (as we do) is best done iteratively via figuring out how long a black hole would be active
   * after a given amount of time of the previous black hole being active.
   */
  get timeUntilNextDeactivation() {
    if (this.isCharged) {
      return this.duration - this.phase;
    }
    return this.cycleLength - this.phase;
  }
  
  description(capitalized) {
    if (RealityUpgrade(20).isBought) {
      return `Black Hole ${this.id}`;
    }
    return capitalized ? "The Black Hole" : "the Black Hole";
  }
}

BlackHoleState.list = Array.range(0, 2).map(id => new BlackHoleState(id));

/**
 * @param {number} id
 * @return {BlackHoleState}
 */
function BlackHole(id) {
  return BlackHoleState.list[id - 1];
}

const BlackHoles = {
  // In seconds
  ACCELERATION_TIME: 5,
  /**
   * @return {BlackHoleState[]}
   */
  get list() {
    return BlackHoleState.list;
  },

  get canBeUnlocked() {
    return player.reality.realityMachines.gte(100) && !this.areUnlocked;
  },

  get areUnlocked() {
    return BlackHole(1).isUnlocked;
  },

  unlock() {
    if (!this.canBeUnlocked) return;
    player.blackHole[0].unlocked = true;
    player.reality.realityMachines = player.reality.realityMachines.minus(100);
    Achievement(144).unlock();
  },

  togglePause: () => {
    if (!BlackHoles.areUnlocked) return;
    if (player.blackHolePause) player.minNegativeBlackHoleThisReality = 1;
    player.blackHolePause = !player.blackHolePause;
    player.blackHolePauseTime = player.realTimePlayed;
    const pauseType = BlackHoles.areNegative ? "inverted" : "paused";
    GameUI.notify.blackHole(player.blackHolePause ? `Black Hole ${pauseType}` : "Black Hole unpaused");
  },

  get unpauseAccelerationFactor() {
    return Math.clamp((player.realTimePlayed - player.blackHolePauseTime) / (1000 * this.ACCELERATION_TIME), 0, 1);
  },

  get arePaused() {
    return player.blackHolePause;
  },

  get areNegative() {
    return this.arePaused && player.blackHoleNegative < 1;
  },

  get arePermanent() {
    return BlackHoles.list.every(bh => bh.isPermanent);
  },

  updatePhases(blackHoleDiff) {
    if (!this.areUnlocked || this.arePaused) return;
    // This code is intended to successfully update the black hole phases
    // even for very large values of blackHoleDiff.
    const seconds = blackHoleDiff / 1000;
    const activePeriods = this.realTimePeriodsWithBlackHoleActive(seconds);
    for (const blackHole of this.list) {
      if (!blackHole.isUnlocked) break;
      blackHole.updatePhase(activePeriods[blackHole.id - 1]);
    }
  },

  /**
   * This function takes the total real time spent offline,
   * a number of ticks to simulate, a tolerance for how far ticks can be
   * from average (explained later), and returns a single realTickTime and
   * blackHoleSpeed representing the real time taken up by the first simulated tick
   * and the game speed due to black holess during it.
   *
   * This code makes sure that the following conditions are satisfied:
   * 1: realTickTime * blackHoleSpeed is exactly (up to some small
   * multiple of floating-point precision) the game time which would be spent
   * after realTickTime real time, accounting for black holess
   * (but not for anything else).
   * 2: No tick contains too much (more than a constant multiple of
   * the mean game time per tick) of the game time.
   * 3: No tick has negative or zero real time or (equivalently)
   * negative or zero game time.
   * Note that Patashu has convinced me that we do not want the property
   * "No tick contains too much (more than a constant multiple of the
   * mean real time per tick) of the real time." There's no reason to have it
   * aside from the edge cases of EC12 (and if you're going offline during EC12
   * then you should expect technically correct but somewhat annoying behavior)
   * and auto EC completion (but auto EC completion shouldn't be that much
   * of an issue).
   */
  calculateOfflineTick(totalRealTime, numberOfTicks, tolerance) {
    // Cache speedups, so calculateGameTimeFromRealTime doesn't recalculate them every time.
    const speedups = this.calculateSpeedups();
    const totalGameTime = this.calculateGameTimeFromRealTime(totalRealTime, speedups);
    // We have this special case just in case some floating-point mess prevents
    // binarySearch from working in the numberOfTicks = 1 case.
    // I doubt that's possible but it seems worth handling just in case.
    if (numberOfTicks === 1) {
      return [totalRealTime, totalGameTime / totalRealTime];
    }
    // We want calculateGameTimeFromRealTime(realTickTime, speedups) * numberOfTicks / totalGameTime to be roughly 1
    // (that is, the tick taking realTickTime real time has roughly average length in terms of game time).
    // We use binary search because it has somewhat better worst-case behavior than linear interpolation search here.
    // Suppose you have 3000 seconds without a black hole and then 100 seconds of a black hole with 3000x power,
    // and you want to find when 4000 seconds of game time have elapsed. With binary search it will take only
    // 20 steps or so to get reasonable accuracy, but with linear interpolation it will take about 100 steps.
    // These extra steps might always average out with cases where linear interpolation is quicker though.
    const realTickTime = this.binarySearch(
      0,
      totalRealTime,
      x => this.calculateGameTimeFromRealTime(x, speedups) * numberOfTicks / totalGameTime,
      1,
      tolerance
    );
    const blackHoleSpeedup = this.calculateGameTimeFromRealTime(realTickTime, speedups) / realTickTime;
    return [realTickTime, blackHoleSpeedup];
  },

  /**
   * Standard implementation of binary search for a monotone increasing function.
   * The only unusual thing is tolerance, which is a bound on
   * Math.abs(evaluationFunction(result) - target).
   */
  // eslint-disable-next-line max-params
  binarySearch(start, end, evaluationFunction, target, tolerance) {
    let middle;
    for (let iter = 0; iter < 100; ++iter) {
      middle = (start + end) / 2;
      const error = evaluationFunction(middle) - target;
      if (Math.abs(error) < tolerance) break;
      if (error < 0) {
        // eslint-disable-next-line no-param-reassign
        start = middle;
      } else {
        // eslint-disable-next-line no-param-reassign
        end = middle;
      }
    }
    return middle;
  },

  /**
   * Returns a list of length (number of unlocked black holes + 1),
   * where each element is the *total* speedup while that black hole
   * is the highest-numbered black hole active, the black holes being numbered
   * starting from black hole 1 and black hole 0 being normal game.
   */
  calculateSpeedups() {
    const effectsToConsider = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH,
      GAME_SPEED_EFFECT.MOMENTUM, GAME_SPEED_EFFECT.NERFS];
    const speedupWithoutBlackHole = getGameSpeedupFactor(effectsToConsider);
    const speedups = [1];
    effectsToConsider.push(GAME_SPEED_EFFECT.BLACK_HOLE);
    for (const blackHole of this.list) {
      if (!blackHole.isUnlocked) break;
      speedups.push(getGameSpeedupFactor(effectsToConsider, blackHole.id) / speedupWithoutBlackHole);
    }
    return speedups;
  },

  calculateGameTimeFromRealTime(realTime, speedups) {
    const effectivePeriods = this.realTimePeriodsWithBlackHoleEffective(realTime, speedups);
    return effectivePeriods
      .map((period, i) => period * speedups[i])
      .sum();
  },

  /**
   * Returns the amount of real time spent with each unlocked black hole
   * being the current "effective" black hole, that is, the active black hole
   * with the highest index.
   * For example:
   * active periods = [100, 20, 5] (100ms of real time, 20ms of black hole 1, 5ms of black hole 2)
   * effective periods = [80, 15, 5]
   * 80ms of effective real time, because black hole 1 will be running in total 20ms => 100 - 20
   * 15ms of effective black hole 1 time, because black hole 2 will be running in total 5ms => 20 - 5
   * 5ms of effective black hole 2 time, because no higher black hole overlaps it,
   * so it is effective for the whole active period
   * Note: even though more than one black hole can be active
   * (and thus effective) at once, the calling function first calculates the total speedups
   * while each black hole is the highest-index black hole that's active and then acts
   * as if only the highest-index black hole that's active is effective.
   */
  realTimePeriodsWithBlackHoleEffective(realTime) {
    const activePeriods = this.realTimePeriodsWithBlackHoleActive(realTime);
    const effectivePeriods = [];
    for (let i = 0; i < activePeriods.length - 1; i++) {
      effectivePeriods.push(activePeriods[i] - activePeriods[i + 1]);
    }
    effectivePeriods.push(activePeriods.last());
    return effectivePeriods;
  },

  /**
   * Returns an array of real time periods spent in each black hole
   * with first element being the "no black hole" state that is normal game.
   */
  realTimePeriodsWithBlackHoleActive(realTime) {
    const activePeriods = [realTime];
    for (const blackHole of this.list) {
      if (!blackHole.isUnlocked) break;
      const activeTime = blackHole.realTimeWhileActive(activePeriods.last());
      activePeriods.push(activeTime);
    }
    return activePeriods;
  }
};

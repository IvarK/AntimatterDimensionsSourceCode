import { DC } from "./constants";
import { SpeedrunMilestones } from "./speedrun";

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
      DC.E310,
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
    return Currency.realityMachines.gte(this.cost);
  }

  purchase() {
    if (!this.isAffordable || this.value === 0) return;

    // Keep the cycle phase consistent before and after purchase so that upgrading doesn't cause weird behavior
    // such as immediately activating it when inactive (or worse, skipping past the active segment entirely).
    const bh = BlackHole(this.id);
    const beforeProg = bh.isCharged ? 1 - bh.stateProgress : bh.stateProgress;

    Currency.realityMachines.purchase(this.cost);
    this.incrementAmount();
    this._lazyValue.invalidate();
    this._lazyCost.invalidate();
    if (this.onPurchase) {
      this.onPurchase();
    }

    // Adjust the phase to what it was before purchase by changing it directly. This will often result in passing
    // in a negative argument to updatePhase(), but this shouldn't cause any problems because it'll never make
    // the phase itself negative. In very rare cases this may result in a single auto-pause getting skipped
    const stateTime = bh.isCharged ? bh.duration : bh.interval;
    bh.updatePhase(stateTime * beforeProg - bh.phase);

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
      calculateValue: amount => (3600 / (Math.pow(10, id))) * Math.pow(0.8, amount),
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
   * Exists to avoid recursion in calculation of whether the black hole is permanent.
   */
  get rawInterval() {
    return this.intervalUpgrade.value * Achievement(145).effectOrDefault(1);
  }

  /**
   * Amount of time the black hole is inactive for between activations.
   */
  get interval() {
    return this.isPermanent ? 0 : this.rawInterval;
  }

  /**
   * Multiplier to time the black hole gives when active.
   */
  get power() {
    return this.powerUpgrade.value * Achievement(158).effectOrDefault(1);
  }

  /**
   * Amount of time the black hole is active for.
   */
  get duration() {
    return this.durationUpgrade.value * Achievement(155).effectOrDefault(1);
  }

  get isUnlocked() {
    return this._data.unlocked && !Enslaved.isRunning && !Pelle.isDisabled("blackhole");
  }

  get isCharged() {
    return this._data.active;
  }

  get timeWithPreviousActiveToNextStateChange() {
    return this.isCharged ? this.duration - this.phase : this.interval - this.phase;
  }

  // When inactive, returns time until active; when active, returns time until inactive (or paused for hole 2)
  get timeToNextStateChange() {
    let remainingTime = this.timeWithPreviousActiveToNextStateChange;

    if (this.id === 1) return remainingTime;

    // 2nd hole activation logic (not bothering generalizing since we're not adding that 3rd hole again)
    if (this.isCharged) {
      if (BlackHole(1).isCharged) return Math.min(remainingTime, BlackHole(1).timeToNextStateChange);
      return BlackHole(1).timeToNextStateChange;
    }
    return BlackHole(1).timeUntilTimeActive(remainingTime);
  }
  
  // Given x, return time it takes for this black hole to get x time active
  timeUntilTimeActive(timeActive) {
    if (this.isCharged) {
      if (timeActive < this.timeToNextStateChange) return timeActive;
      timeActive -= this.timeToNextStateChange;
    }
    let totalTime = this.isCharged
      ? this.timeToNextStateChange + this.interval
      : this.timeToNextStateChange;
    totalTime += Math.floor(timeActive / this.duration) * this.cycleLength;
    totalTime += timeActive % this.duration;
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
    if (Pelle.isDisabled("blackhole")) return `<i class="fas fa-ban"></i> Disabled`;
    if (Enslaved.isAutoReleasing) {
      if (Enslaved.autoReleaseTick < 3) return `<i class="fas fa-compress-arrows-alt u-fa-padding"></i> Pulsing`;
      return `<i class="fas fa-expand-arrows-alt u-fa-padding"></i> Pulsing`;
    }
    if (Enslaved.isStoringGameTime) {
      if (Ra.unlocks.adjustableStoredTime.canBeApplied) {
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
    return this.isCharged && (this.id === 1 || BlackHole(this.id - 1).isActive) && !Pelle.isDisabled("blackhole");
  }

  get isPermanent() {
    // If the black hole is active 99.99% of the time, the duration is exactly
    // 9999 times longer than the interval.
    return this.duration / this.rawInterval >= 9999;
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
    if (this.isPermanent) return;
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
export function BlackHole(id) {
  return BlackHoleState.list[id - 1];
}

export const BlackHoles = {
  // In seconds
  ACCELERATION_TIME: 5,
  /**
   * @return {BlackHoleState[]}
   */
  get list() {
    return BlackHoleState.list;
  },

  get canBeUnlocked() {
    return Currency.realityMachines.gte(100) && !this.areUnlocked;
  },

  get areUnlocked() {
    return BlackHole(1).isUnlocked;
  },

  unlock() {
    if (!this.canBeUnlocked) return;
    player.blackHole[0].unlocked = true;
    Currency.realityMachines.purchase(100);
    SpeedrunMilestones(17).tryComplete();
    Achievement(144).unlock();
    EventHub.dispatch(GAME_EVENT.BLACK_HOLE_UNLOCKED);
  },

  togglePause: (automatic=false) => {
    if (!BlackHoles.areUnlocked) return;
    if (player.blackHolePause) player.requirementChecks.reality.slowestBH = 1;
    player.blackHolePause = !player.blackHolePause;
    player.blackHolePauseTime = player.records.realTimePlayed;
    const blackHoleString = RealityUpgrade(20).isBought ? "Black Holes" : "Black Hole";
    const pauseType = player.blackHolePause ? (BlackHoles.areNegative ? "inverted" : "paused") : 'unpaused';
    const automaticString = automatic ? "automatically " : "";
    GameUI.notify.blackHole(`${blackHoleString} ${automaticString}${pauseType}`);
  },

  get unpauseAccelerationFactor() {
    if (this.arePermanent) return 1;
    return Math.clamp((player.records.realTimePlayed - player.blackHolePauseTime) /
      (1000 * this.ACCELERATION_TIME), 0, 1);
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
    // With auto-pause settings, this code also has to take account of that.
    const rawSeconds = blackHoleDiff / 1000;
    const [autoPause, seconds] = this.autoPauseData(rawSeconds);
    const activePeriods = this.realTimePeriodsWithBlackHoleActive(seconds, true);
    for (const blackHole of this.list) {
      if (!blackHole.isUnlocked) break;
      blackHole.updatePhase(activePeriods[blackHole.id - 1]);
    }
    if (autoPause) {
      BlackHoles.togglePause(true);
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
      GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS];
    const speedupWithoutBlackHole = getGameSpeedupFactor(effectsToConsider);
    const speedups = [1];
    effectsToConsider.push(GAME_SPEED_EFFECT.BLACK_HOLE);
    // Crucial thing: this works even if the black holes are paused, it's just that the speedups will be 1.
    for (const blackHole of this.list) {
      if (!blackHole.isUnlocked) break;
      speedups.push(getGameSpeedupFactor(effectsToConsider, blackHole.id) / speedupWithoutBlackHole);
    }
    return speedups;
  },

  calculateGameTimeFromRealTime(realTime, speedups) {
    const [_, realerTime] = this.autoPauseData(realTime);
    const effectivePeriods = this.realTimePeriodsWithBlackHoleEffective(realerTime, speedups);
    // This adds in time with black holes paused at the end of the list.
    effectivePeriods[0] += realTime - realerTime;
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
  },
  
  timeToNextPause(bhNum) {
    if (bhNum === 1) {
      // This is the warm-up case for the much, much more complicated case of Black Hole 2.
      let bh = BlackHole(1);
      // In general, if no blackhole gaps are as long as the warmup time, we're fine.
      if (bh.interval <= BlackHoles.ACCELERATION_TIME) {
        return null;
      }
      // Find the time until next activation.
      let t = (bh.isCharged ? bh.duration : 0) + bh.interval - bh.phase;
      // If the time until next activation is less than the acceleration time, we have to wait until the activation after that.
      return (t < BlackHoles.ACCELERATION_TIME) ?
      t + bh.duration + bh.interval - BlackHoles.ACCELERATION_TIME : t - BlackHoles.ACCELERATION_TIME;
    }
    // Now the actual code starts
    let bh1 = BlackHole(1);
    let bh2 = BlackHole(2);
    // If the intervals are too small we don't pause.
    if (bh1.interval <= BlackHoles.ACCELERATION_TIME && bh2.interval <= BlackHoles.ACCELERATION_TIME) {
      return null;
    }
    // There are two times we could use here: the next BH2 activation (if there's a gap of at least 5 seconds before it),
    // or the next time BH2 is active after a BH1 activation
    // OK, now we calculate the BH1 active time until bh2 becomes charged...
    let t2 = (bh2.isCharged ? bh2.duration : 0) + bh2.interval - bh2.phase;
    // Then we transform that BH1 active time to an actual real amount of time...
    let t1 = bh1.timeUntilTimeActive(t2);
    // And then we need to recalculate it if it's less than 5 seconds from now, to take the time BH2 becomes charged after next
    // rather than the too-imminent next one.
    let t3 = (t1 < BlackHoles.ACCELERATION_TIME) ?
    bh1.timeUntilTimeActive(t2 + bh2.duration + bh2.interval) - BlackHoles.ACCELERATION_TIME : t1 - BlackHoles.ACCELERATION_TIME;
    // But we're not done! We might be able to stop at a BH1 activation while BH2 is charged, which might be sooner than the next
    // time BH2 becomes charged. If BH2 isn't charged, or the gaps between BH1 activations aren't large enough, we are done, though.
    if ((bh2.interval >= BlackHoles.ACCELERATION_TIME && t1 >= BlackHoles.ACCELERATION_TIME && !bh2.isCharged) ||
    bh1.interval <= BlackHoles.ACCELERATION_TIME) {
      return t3;
    }
    // We can determine that *if* we stop at a BH1 activation, it has to be the next one that's not in the next 5 seconds.
    // This is because whichever BH1 activation we use, either BH2 has to be active for it. If not, we should stop 
    // This is the BH1 time until the next BH1 activation.
    let s1 = (bh1.isCharged ? bh1.duration : 0) + bh1.interval - bh1.phase;
    // This is the time BH1 will spend active until the next usable BH1 activation.
    let bh1Active = ((s1 < BlackHoles.ACCELERATION_TIME) ? bh1.duration : 0) + (bh1.isCharged ? bh1.duration - bh1.phase : 0);
    let bh2Left = (bh2.isCharged ? 0 : bh2.interval) + bh2.duration - bh2.phase;
    let strictposmod = (a, b) => (a % b === 0) ? b : ((a % b + b) % b);
    let adjustment = Math.max(strictposmod(bh2Left - bh1Active, bh2.interval + bh2.duration) - bh2.duration, 0);
    s1 += adjustment;
    let s2 = (s1 < BlackHoles.ACCELERATION_TIME) ?
    s1 + bh1.duration + bh1.interval - BlackHoles.ACCELERATION_TIME : s1 - BlackHoles.ACCELERATION_TIME;
    return (bh1Active < bh2Left || bh2.interval < BlackHoles.ACCELERATION_TIME) ? s2 : t3;
  },
  
  
  autoPauseData(realTime) {
    // This can be called when determining offline time if the black holes are already paused.
    // In that case we don't need to pause them (need to pause = false), but they're already paused (0 time).
    // This saves us some computation.
    if (this.arePaused) return [false, 0];
    if (player.blackHoleAutoPauseMode === BLACK_HOLE_PAUSE_MODE.NO_PAUSE) {
      return [false, realTime];
    }
    let timeLeft = this.timeToNextPause(player.blackHoleAutoPauseMode);
    // Probably rounding error
    if (timeLeft === null || timeLeft < 1e-9 || timeLeft > realTime) {
      return [false, realTime];
    }
    return [true, timeLeft];
  }
};

"use strict";

const ENSLAVED_UNLOCKS = {
  FREE_TICKSPEED_SOFTCAP: {
    id: 0,
    price: TimeSpan.fromYears(1e35).totalMilliseconds,
    secondaryRequirement: () => true,
    description: () => `Increase the free tickspeed upgrade softcap by ${formatInt(1e5)}`,
  },
  RUN: {
    id: 1,
    price: TimeSpan.fromYears(1e40).totalMilliseconds,
    secondaryRequirement() {
      const hasLevelRequirement = player.bestGlyphLevel >= 5000;
      const hasRarityRequirement = strengthToRarity(player.bestGlyphStrength) >= 100;
      return hasLevelRequirement && hasRarityRequirement;
    },
    description: () => `Unlock The Enslaved Ones' Reality (requires
      a level ${formatInt(5000)} glyph and a rarity ${formatRarity(100)} glyph)`,
  }
};

const Enslaved = {
  displayName: "Enslaved",
  boostReality: false,
  BROKEN_CHALLENGES: [2, 3, 4, 5, 7, 8, 10, 11, 12],
  nextTickDiff: 50,
  isReleaseTick: false,
  autoReleaseTick: 0,
  autoReleaseSpeed: 0,
  timeCap: 1e300,
  glyphLevelMin: 5000,
  currentBlackHoleStoreAmountPerMs: 0,
  tachyonNerf: 0.3,
  toggleStoreBlackHole() {
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring;
    player.celestials.enslaved.isStoringReal = false;
    if (!Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME)) {
      player.celestials.enslaved.storedFraction = 1;
    }
  },
  toggleStoreReal() {
    player.celestials.enslaved.isStoringReal = !player.celestials.enslaved.isStoringReal;
    player.celestials.enslaved.isStoring = false;
  },
  toggleAutoStoreReal() {
    player.celestials.enslaved.autoStoreReal = !player.celestials.enslaved.autoStoreReal;
  },
  get isStoringGameTime() {
    return player.celestials.enslaved.isStoring && !BlackHoles.arePaused;
  },
  get isStoringRealTime() {
    return player.celestials.enslaved.isStoringReal;
  },
  get storedRealTimeEfficiency() {
    return 0.7;
  },
  get storedRealTimeCap() {
    const addedCap = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME)
      ? RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeCap()
      : 0;
    return 1000 * 3600 * 8 + addedCap;
  },
  get isAutoReleasing() {
    return player.celestials.enslaved.isAutoReleasing && !BlackHoles.areNegative;
  },
  storeRealTime() {
    const thisUpdate = Date.now();
    const diff = Math.max(thisUpdate - player.lastUpdate, 0);
    const efficiency = this.storedRealTimeEfficiency;
    const maxTime = this.storedRealTimeCap;
    player.celestials.enslaved.storedReal += diff * efficiency;
    if (player.celestials.enslaved.storedReal > maxTime) {
      player.celestials.enslaved.isStoringReal = false;
      player.celestials.enslaved.storedReal = maxTime;
    }
    player.lastUpdate = thisUpdate;
  },
  autoStoreRealTime(diffMs) {
    const maxGain = this.storedRealTimeCap - player.celestials.enslaved.storedReal;
    const used = Math.min(diffMs, Math.max(0, maxGain / this.storedRealTimeEfficiency));
    player.celestials.enslaved.storedReal += used * this.storedRealTimeEfficiency;
    player.lastUpdate += used;
    return diffMs - used;
  },
  canRelease(auto) {
    return !Enslaved.isStoringRealTime && !EternityChallenge(12).isRunning && !Laitela.isRunning &&
      !(Enslaved.isRunning && auto);
  },
  // "autoRelease" should only be true when called with the Ra upgrade
  useStoredTime(autoRelease) {
    if (!this.canRelease(autoRelease)) return;
    if (EternityChallenge(12).isRunning) return;
    player.minNegativeBlackHoleThisReality = 1;
    let release = player.celestials.enslaved.stored;
    if (Enslaved.isRunning) {
      release = Enslaved.storedTimeInsideEnslaved(release);
      if (Time.thisReality.totalYears > 1) EnslavedProgress.storedTime.giveProgress();
    }
    if (autoRelease) release *= 0.01;
    this.nextTickDiff = Math.clampMax(release, this.timeCap);
    this.isReleaseTick = true;
    // Effective gamespeed from stored time assumes a "default" 50 ms update rate for consistency
    const effectiveGamespeed = release / 50;
    player.celestials.ra.peakGamespeed = Math.max(player.celestials.ra.peakGamespeed, effectiveGamespeed);
    this.autoReleaseSpeed = release / player.options.updateRate / 5;
    player.celestials.enslaved.stored *= autoRelease ? 0.99 : 0;
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id);
  },
  canBuy(info) {
    return player.celestials.enslaved.stored >= info.price && info.secondaryRequirement() && !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuy(info)) return false;
    if (info.id === ENSLAVED_UNLOCKS.RUN.id) this.quotes.show(this.quotes.UNLOCK_RUN);
    player.celestials.enslaved.stored -= info.price;
    player.celestials.enslaved.unlocks.push(info.id);
    return true;
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.enslaved.run = true;
    // Round to the nearest multiple of 2 to make the secret study hide
    player.secretUnlocks.secretTS += player.secretUnlocks.secretTS % 2;
    this.feltEternity = false;
    this.quotes.show(this.quotes.START_RUN);
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  completeRun() {
    player.celestials.enslaved.completed = true;
    this.quotes.show(this.quotes.COMPLETE_REALITY);
  },
  get isCompleted() {
    return player.celestials.enslaved.completed;
  },
  get isUnlocked() {
    return EffarigUnlock.eternity.isUnlocked;
  },
  get realityBoostRatio() {
    const baseRealityBoostRatio = tempAmplifyToggle ? tempAmplifyFactor : 1;
    return Math.max(baseRealityBoostRatio, Math.floor(player.celestials.enslaved.storedReal /
      Math.max(1000, Time.thisRealityRealTime.totalMilliseconds)));
  },
  storedTimeInsideEnslaved(stored) {
    if (stored <= 1e3) return stored;
    return Math.pow(10, Math.pow(Math.log10(stored / 1e3), 0.55)) * 1e3;
  },
  feelEternity() {
    if (!this.feltEternity) {
      EnslavedProgress.feelEternity.giveProgress();
      this.feltEternity = true;
      Modal.message.show("Time in eternity will be scaled by number of eternities");
    }
  },
  get feltEternity() {
    return player.celestials.enslaved.feltEternity;
  },
  set feltEternity(value) {
    player.celestials.enslaved.feltEternity = value;
  },
  get nextHintCost() {
    return TimeSpan.fromYears(1e40 * Math.pow(3, this.hintCostIncreases)).totalMilliseconds;
  },
  get hintCostIncreases() {
    const hintTime = player.celestials.enslaved.zeroHintTime - Date.now();
    return Math.clampMin(hintTime / TimeSpan.fromDays(1).totalMilliseconds, 0);
  },
  spendTimeForHint() {
    if (player.celestials.enslaved.stored < this.nextHintCost) return false;
      player.celestials.enslaved.stored -= this.nextHintCost;
      if (Enslaved.hintCostIncreases === 0) {
        player.celestials.enslaved.zeroHintTime = Date.now() + TimeSpan.fromDays(1).totalMilliseconds;
      } else {
        player.celestials.enslaved.zeroHintTime += TimeSpan.fromDays(1).totalMilliseconds;
      }
      return true;
  },
  get tesseractCost() {
    return Tesseracts.costs[player.celestials.enslaved.tesseracts];
  },
  get nextDimCapIncrease() {
    return Tesseracts.increases[player.celestials.enslaved.tesseracts];
  },
  get canBuyTesseract() {
    return player.infinityPoints.gte(this.tesseractCost);
  },
  buyTesseract() {
    if (!this.canBuyTesseract) return;

    player.celestials.enslaved.totalDimCapIncrease += this.nextDimCapIncrease;
    player.celestials.enslaved.tesseracts++;
  },
  quotes: new CelestialQuotes("enslaved", {
    INITIAL: {
      id: 1,
      lines: [
        "A visitor? I haven’t had one... eons.",
        "I am... had a name. It’s been lost... to this place.",
        "The others... won't let me rest. I do their work with time...",
        "Place time ... into places ... that need it...",
        "Watch myself grow... pass and die.",
        "Perhaps you... will break these chains... I will wait",
      ]
    },
    UNLOCK_RUN: {
      id: 2,
      lines: [
        "The others ... used me. Will use... or destroy you",
        "End my suffering ... power will be yours ... ",
      ]
    },
    START_RUN: {
      id: 3,
      lines: [
        "So little space... but no... prison... is perfect",
        "They squeezed... this reality... too tightly. Cracks appeared.",
        "Search... everywhere. I will help... where I can",
      ]
    },
    COMPLETE_REALITY: {
      id: 4,
      lines: [
        "All... fragments... clones... freed.",
        "I have given... tools... of my imprisoning. Use them...",
        "...",
        "Freedom from torture... is torture itself.",
      ]
    },
    EC6C10: CelestialQuotes.singleLine(
      5, "... did not ... underestimate you ..."
    ),
    HINT_UNLOCK: {
      id: 6,
      lines: [
        "... you need ... to look harder ...",
        "I think ... I can help ...",
        "* You have unlocked help from The Enslaved Ones"
      ]
    },
  }),
};

class EnslavedProgressState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (this.id < 0 || this.id > 31) throw new Error(`Id ${this.id} out of bit range`);
  }

  get hasProgress() {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.enslaved.progressBits & (1 << this.id));
  }

  get hasHint() {
    // eslint-disable-next-line no-bitwise
    return this.hasProgress || Boolean(player.celestials.enslaved.hintBits & (1 << this.id));
  }

  giveProgress() {
    // Bump the last hint time appropriately if the player found the hint
    if (this.hasHint && !this.hasProgress) {
      player.celestials.enslaved.zeroHintTime -= Math.log(2) / Math.log(3) * TimeSpan.fromDays(1).totalMilliseconds;
      GameUI.notify.success("You found a crack in The Enslaved Ones' Reality!");
    }
    // eslint-disable-next-line no-bitwise
    player.celestials.enslaved.progressBits |= (1 << this.id);
  }

  giveHint() {
    // eslint-disable-next-line no-bitwise
    player.celestials.enslaved.hintBits |= (1 << this.id);
  }
}

const EnslavedProgress = (function() {
  const db = GameDatabase.celestials.enslaved.progress;
  return {
    hintsUnlocked: new EnslavedProgressState(db.hintsUnlocked),
    ec1: new EnslavedProgressState(db.ec1),
    feelEternity: new EnslavedProgressState(db.feelEternity),
    ec6: new EnslavedProgressState(db.ec6),
    c10: new EnslavedProgressState(db.c10),
    secretStudy: new EnslavedProgressState(db.secretStudy),
    storedTime: new EnslavedProgressState(db.storedTime),
    challengeCombo: new EnslavedProgressState(db.challengeCombo),
  };
}());

const Tesseracts = {
  costs: (function() {
    const costs = [Decimal.pow10(20e6), Decimal.pow10(40e6), Decimal.pow10(60e6)];
    for (let i = 0; i < 32; i++) {
      costs.push(costs[i + 2].pow(2 * (i + 1)));
    }
    return costs;
  }()),

  increases: (function() {
    const increases = [];
    for (let i = 0; i < 34; i++) {
      increases.push(500e3 * Math.pow(2, i));
    }
    increases.unshift(500e3);
    return increases;
  }())
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.enslaved.isOpen) Enslaved.quotes.show(Enslaved.quotes.INITIAL);
});

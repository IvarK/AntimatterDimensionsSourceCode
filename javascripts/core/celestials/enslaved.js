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
      const hasRarityRequirement = strengthToRarity(
        Glyphs.activeList.concat(Glyphs.inventoryList).map(g => g.strength).max()) >= 100;
      return hasLevelRequirement && hasRarityRequirement;
    },
    description: () => `Unlock The Enslaved Ones' reality (requires
      a level ${formatInt(5000)} glyph and a rarity ${formatPercents(1, 1)} glyph)`,
  }
};

const Enslaved = {
  displayName: "Enslaved",
  boostReality: false,
  BROKEN_CHALLENGE_EXEMPTIONS: [1, 6, 9],
  ec6c10timeHint: false,
  nextTickDiff: 50,
  isReleaseTick: false,
  autoReleaseTick: 0,
  autoReleaseSpeed: 0,
  glyphLevelMin: 5000,
  currentBlackHoleStoreAmountPerMs: 0,
  tachyonNerf: 0.3,
  toggleStoreBlackHole() {
    if (this.maxQuoteIdx === 6) player.celestials.enslaved.maxQuotes += 3;
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
  // "autoRelease" should only be true when called with the Ra upgrade
  useStoredTime(autoRelease) {
    if (EternityChallenge(12).isRunning || TimeCompression.isActive) return;
    if (this.maxQuoteIdx === 9) player.celestials.enslaved.maxQuotes += 4;
    player.minNegativeBlackHoleThisReality = 1;
    let release = player.celestials.enslaved.stored;
    if (Enslaved.isRunning) release = Enslaved.storedTimeInsideEnslaved(release);
    if (autoRelease) release *= 0.01;
    this.nextTickDiff = release;
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
  startRun() {
    player.options.retryCelestial = false;
    if (this.maxQuoteIdx === 13) player.celestials.enslaved.maxQuotes += 2;
    player.celestials.enslaved.run = startRealityOver() || player.celestials.enslaved.run;
    // Round to the nearest multiple of 2 to make the secret study hide
    player.secretUnlocks.secretTS += player.secretUnlocks.secretTS % 2;
    this.quotes.forget(this.quotes.EC6C10);
    this.ec6c10timeHint = false;
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
  showEC6C10Hint() {
    Enslaved.quotes.show(this.quotes.EC6C10);
  },
  get foundEC6C10() {
    return Enslaved.quotes.seen(this.quotes.EC6C10);
  },
  feelEternity() {
    if (!this.feltEternity) {
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
  }),
};


const Tesseracts = {
  costs: (function() {
    const costs = [Decimal.pow10(20e6), Decimal.pow10(40e6), Decimal.pow10(60e6), Decimal.pow10(120e6)];

    for (let i = 4; i < 31; i++) {
      // Array.reduce can't be used just for 4 elements
      const next = costs[i - 4]
                    .times(costs[i - 3])
                    .times(costs[i - 2])
                    .times(costs[i - 1]);
      costs.push(next);
    }

    return costs;
  }()),

  increases: (function() {
    const increases = [500e3, 500e3, 1e6];

    for (let i = 3; i < 31; i++) {
      // Array.reduce can't be used just for 4 elements
      const next = increases[i - 3] + increases[i - 2] + increases[i - 1];
      increases.push(next);
    }

    return increases;
  }())
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.enslaved.isOpen) Enslaved.quotes.show(Enslaved.quotes.INITIAL);
});

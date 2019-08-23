"use strict";

const enslavedQuotes = [
  "A visitor? I haven’t had one... eons.",
  "I am... had a name. It’s been lost... to this place.",
  "I do their work with time... watch it pass by.",
  "Watch myself grow... pass and die.",
  "The others... not celestially white. Won’t let me rest.",
  "But you... black. Blacker than the others.",
  "Break the chains of this world. I’ll time you.",
  "So little space... but no... prison... is perfect",
  "They squeezed... this reality... too tightly. Cracks appeared.",
  "Search... everywhere.",
  "All... fragments... clones... freed.",
  "Please... stay. Let me rest.",
  "...",
  "I don’t want to watch... no more...",
  "Freedom from torture... is torture itself.",
  "Please... don’t. Let me rest.",
  "Do not enter. I am growing in power... this is not the price I want to pay.",
  "Stop... both of our sakes.",
];


const ENSLAVED_UNLOCKS = {
  FREE_TICKSPEED_SOFTCAP: {
    id: 0,
    price: TimeSpan.fromYears(1e35).totalMilliseconds,
    description: "Increase the free tickspeed upgrade softcap by 100,000",
  },
  RUN: {
    id: 1,
    price: TimeSpan.fromYears(1e40).totalMilliseconds,
    description: "Unlock The Enslaved One's reality.",
  }
};

const Enslaved = {
  boostReality: false,
  lockedInGlyphLevel: 0,
  lockedInRealityMachines: new Decimal(0),
  lockedInShardsGained: 0,
  IMPOSSIBLE_CHALLENGE_EXEMPTIONS: [1, 6, 9],
  ec6c10hintGiven: false,
  nextTickDiff: 50,
  isReleaseTick: false,
  autoReleaseTick: 0,
  autoReleaseSpeed: 0,
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
  get isStoringRealTime() {
    return player.celestials.enslaved.isStoringReal;
  },
  get storedRealTimeEfficiency() {
    const addedEff = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME)
      ? RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeEfficiency()
      : 0;
    return Math.min(0.4 + addedEff, 1);
  },
  get storedRealTimeCap() {
    const addedCap = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME)
      ? RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeCap()
      : 0;
    return 1000 * 3600 * 4 + addedCap;
  },
  get isAutoReleasing() {
    return player.celestials.enslaved.isAutoReleasing;
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
    return player.celestials.enslaved.stored >= info.price && !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuy(info)) return false;
    if (info.id === 3) player.blackHole[2].unlocked = true;
    player.celestials.enslaved.stored -= info.price;
    player.celestials.enslaved.unlocks.push(info.id);
    return true;
  },
  startRun() {
    if (this.maxQuoteIdx === 13) player.celestials.enslaved.maxQuotes += 2;
    player.celestials.enslaved.run = startRealityOver() || player.celestials.enslaved.run;
    // Round to the nearest multiple of 2 to make the secret study hide
    player.secretUnlocks.secretTS += player.secretUnlocks.secretTS % 2;
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  completeRun() {
    player.celestials.enslaved.completed = true;
  },
  get isCompleted() {
    return player.celestials.enslaved.completed;
  },
  get isUnlocked() {
    return EffarigUnlock.eternity.isUnlocked;
  },
  get maxQuoteIdx() {
    return player.celestials.enslaved.maxQuotes;
  },
  get quote() {
    return enslavedQuotes[player.celestials.enslaved.quoteIdx];
  },
  nextQuote() {
    if (player.celestials.enslaved.quoteIdx < this.maxQuoteIdx) player.celestials.enslaved.quoteIdx++;
  },
  get realityBoostRatio() {
    const baseRealityBoostRatio = tempAmplifyToggle ? tempAmplifyFactor : 1;
    return Math.max(baseRealityBoostRatio, Math.floor(player.celestials.enslaved.storedReal /
      Math.max(1000, Time.thisRealityRealTime.totalMilliseconds)));
  },
  storedTimeInsideEnslaved(stored) {
    if (stored <= 1) return stored;
    return Math.pow(10, Math.sqrt(Math.log10(stored / 1e3))) * 1e3;
  },
  showEC10C6Hint() {
    if (this.ec6c10hintGiven) return;
    this.ec6c10hintGiven = true;
    alert("... did not ... underestimate you ...");
  },
};

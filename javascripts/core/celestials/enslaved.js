const enslavedQuotes = [
  "A visitor? I haven’t had one... eons.",
  "I am... had a name. It’s been lost to my own domain.",
  "I do their work with time... watch it pass by.",
  "Watch myself grow... pass and die.",
  "The others... not celestially white. Won’t let me rest.",
  "But you... black. Blacker than the others.",
  "Break the chains of this world. I’ll time you.",
  "You’ve... stopped. Paused... My... we thank you.",
  "All... fragments... clones... freed.",
  "Please... stay. Let me rest.",
  "...",
  "I don’t want to watch... no more...",
  "Freedom from torture... is torture itself.",
  "Please... don’t. Let me rest.",
  "Do not enter. I am growing in power... this is not the price I want to pay.",
  "Stop... both of our sakes.",
]


const ENSLAVED_UNLOCKS = {
  RUN: {
    id: 0,
    price: TimeSpan.fromYears(1e40).totalMilliseconds,
    description: "Unlock The Enslaved One's reality.",
  },
  TIME_EFFECT_MULT: {
    id: 1,
    price: TimeSpan.fromYears(1e45).totalMilliseconds,
    description: "Multiplier to time speed glyph effect based on infinities"
  },
  RM_MULT: {
    id: 2,
    price: TimeSpan.fromYears(1e50).totalMilliseconds,
    description: "Multiplier to RM based on current time modifier, unlock V, the Celestial of Achievements"
  },
  BLACK_HOLE: {
    id: 3,
    price: TimeSpan.fromYears(1e60).totalMilliseconds,
    description: "Unlock the 3rd Black Hole"
  }
}

const Enslaved = {
  boostReality: false,
  // When the player hits the reality button, we don't want their boost decaying if we are showing
  // the animation. So, the ratio at the time of click is stored here:
  lockedInBoostRatio: 1,
  lockedInGlyphLevel: 0,
  lockedInRealityMachines: new Decimal(0),
  infinityTracking: [],
  totalInfinities: new Decimal(0),
  toggleStoreBlackHole() {
    if (this.maxQuoteIdx === 6) player.celestials.enslaved.maxQuotes += 3;
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring;
    player.celestials.enslaved.isStoringReal = false;
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
    return 1 / 3;
  },
  get storedRealTimeCap() {
    return 1000 * 3600 * 4;
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
  useStoredTime() {
    if (this.maxQuoteIdx === 9) player.celestials.enslaved.maxQuotes += 4;
    gameLoop(0, { gameDiff: player.celestials.enslaved.stored });
    player.celestials.enslaved.stored = 0;
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id);
  },
  buyUnlock(info) {
    if (player.celestials.enslaved.stored < info.price) return false;
    if (this.has(info)) return false;
    if (info.id === 3) player.blackHole[2].unlocked = true;
    player.celestials.enslaved.stored -= info.price;
    player.celestials.enslaved.unlocks.push(info.id);
    return true;
  },
  startRun() {
    if (this.maxQuoteIdx === 13) player.celestials.enslaved.maxQuotes += 2;
    player.celestials.enslaved.run = startRealityOver();
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  get isUnlocked() {
    return EffarigUnlock.eternity.isUnlocked;
  },
  get adjustedDilationMultiplier() {
    return this.totalInfinities.div(1e100);
  },
  trackInfinityGeneration(infinities) {
    const ticksNeeded = 10 * 1000 / player.options.updateRate;
    this.infinityTracking.push(infinities.floor());
    this.totalInfinities = this.totalInfinities.plus(infinities.floor());
    if (this.infinityTracking.length - 1 > ticksNeeded) {
      this.totalInfinities = this.totalInfinities.minus(this.infinityTracking.shift());
    }
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
    return Math.max(1, Math.floor(player.celestials.enslaved.storedReal /
      Math.max(1000, Time.thisRealityRealTime.totalMilliseconds)));
  }
};

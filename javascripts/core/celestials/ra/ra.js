import { BitUpgradeState, GameMechanicState } from "../../game-mechanics/index";
import { CelestialQuotes } from "../quotes";

class RaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.ra.unlockBits; }
  set bits(value) { player.celestials.ra.unlockBits = value; }

  get disabledByPelle() {
    return Pelle.isDoomed && this.config.disabledByPelle;
  }

  get isEffectActive() {
    return this.isUnlocked && !this.disabledByPelle;
  }

  get requirementText() {
    const pet = this.pet.name;
    return this.level === 1
      ? `Unlock ${pet}`
      : `Get ${pet} to level ${this.level}`;
  }

  get reward() {
    return typeof this.config.reward === "function"
      ? this.config.reward()
      : this.config.reward;
  }

  get displayIcon() {
    return this.disabledByPelle ? `<span class="fas fa-ban"></span>` : this.config.displayIcon;
  }

  get pet() {
    return Ra.pets[this.config.pet];
  }

  get level() {
    return this.config.level;
  }

  get canBeUnlocked() {
    return this.pet.level >= this.level && !this.isUnlocked;
  }

  onUnlock() {
    this.config.onUnlock?.();
  }
}

const unlocks = mapGameDataToObject(
  GameDatabase.celestials.ra.unlocks,
  config => new RaUnlockState(config)
);

class RaPetState extends GameMechanicState {
  get data() {
    return player.celestials.ra.pets[this.id];
  }

  get name() {
    return this.config.name;
  }

  get chunkGain() {
    return this.config.chunkGain;
  }

  get memoryGain() {
    return this.config.memoryGain;
  }

  get color() {
    return this.config.color;
  }

  get requiredUnlock() {
    return this.config.requiredUnlock?.();
  }

  get rawMemoryChunksPerSecond() {
    return this.config.rawMemoryChunksPerSecond();
  }

  get memoryProductionMultiplier() {
    return this.config.memoryProductionMultiplier();
  }

  get isUnlocked() {
    return this.requiredUnlock === undefined || this.requiredUnlock.isUnlocked;
  }

  get isCapped() {
    return this.level >= Ra.levelCap;
  }

  get level() {
    return this.isUnlocked ? this.data.level : 0;
  }

  set level(value) {
    this.data.level = value;
  }

  get memories() {
    return this.data.memories;
  }

  set memories(value) {
    this.data.memories = value;
  }

  get memoryChunks() {
    return this.data.memoryChunks;
  }

  set memoryChunks(value) {
    this.data.memoryChunks = value;
  }

  get requiredMemories() {
    return Ra.requiredMemoriesForLevel(this.level);
  }

  get memoryChunksPerSecond() {
    if (!this.canGetMemoryChunks) return 0;
    let res = this.rawMemoryChunksPerSecond * this.chunkUpgradeCurrentMult *
      Ra.unlocks.continuousTTBoost.effects.memoryChunks.effectOrDefault(1);
    if (this.hasRecollection) res *= Ra.recollection.multiplier;
    return res;
  }

  get canGetMemoryChunks() {
    return this.isUnlocked && Ra.isRunning;
  }

  get hasRecollection() {
    return Ra.petWithRecollection === this.name;
  }

  get memoryUpgradeCurrentMult() {
    return Math.pow(1.3, this.data.memoryUpgrades);
  }

  get chunkUpgradeCurrentMult() {
    return Math.pow(1.5, this.data.chunkUpgrades);
  }

  get memoryUpgradeCost() {
    return 1000 * Math.pow(5, this.data.memoryUpgrades);
  }

  get chunkUpgradeCost() {
    return 5000 * Math.pow(25, this.data.chunkUpgrades);
  }

  get canBuyMemoryUpgrade() {
    return this.memoryUpgradeCost <= this.memories;
  }

  get canBuyChunkUpgrade() {
    return this.chunkUpgradeCost <= this.memories;
  }

  get memoryUpgradeCapped() {
    return this.memoryUpgradeCost >= 0.5 * Ra.requiredMemoriesForLevel(Ra.levelCap - 1);
  }

  get chunkUpgradeCapped() {
    return this.chunkUpgradeCost >= 0.5 * Ra.requiredMemoriesForLevel(Ra.levelCap - 1);
  }

  purchaseMemoryUpgrade() {
    if (!this.canBuyMemoryUpgrade || this.memoryUpgradeCapped) return;

    this.memories -= this.memoryUpgradeCost;
    this.data.memoryUpgrades++;
  }

  purchaseChunkUpgrade() {
    if (!this.canBuyChunkUpgrade || this.chunkUpgradeCapped) return;

    this.memories -= this.chunkUpgradeCost;
    this.data.chunkUpgrades++;
  }

  levelUp() {
    if (this.memories < this.requiredMemories) return;

    this.memories -= this.requiredMemories;
    this.level++;
    Ra.checkForUnlocks();
  }

  get unlocks() {
    return Ra.unlocks.all
      .filter(x => x.pet === this)
      .sort((a, b) => a.level - b.level);
  }

  tick(realDiff, generateChunks) {
    const seconds = realDiff / 1000;
    const newMemoryChunks = generateChunks
      ? seconds * this.memoryChunksPerSecond
      : 0;
    // Adding memories from half of the gained chunks this tick results in the best mathematical behavior
    // for very long simulated ticks
    const newMemories = seconds * (this.memoryChunks + newMemoryChunks / 2) * Ra.productionPerMemoryChunk *
      this.memoryUpgradeCurrentMult;
    this.memoryChunks += newMemoryChunks;
    this.memories += newMemories;
  }

  reset() {
    this.data.level = 1;
    this.data.memories = 0;
    this.data.memoryChunks = 0;
    this.data.memoryUpgrades = 0;
    this.data.chunkUpgrades = 0;
  }
}

const pets = mapGameDataToObject(
  GameDatabase.celestials.ra.pets,
  config => new RaPetState(config)
);

export const Ra = {
  displayName: "Ra",
  unlocks,
  pets,
  recollection: {
    multiplier: 3,
    requiredLevels: 20,
    get isUnlocked() {
      return Ra.totalPetLevel >= this.requiredLevels;
    }
  },
  // Dev/debug function for easier testing
  reset() {
    const data = player.celestials.ra;
    data.unlockBits = 0;
    data.run = false;
    data.charged = new Set();
    data.disCharge = false;
    data.peakGamespeed = 1;
    for (const pet of Ra.pets.all) pet.reset();
  },
  // Scans through all glyphs and fills base resources to the maximum allowed by the cap
  // TODO update/delete this function when we get back to alchemy, it's outdated since it's not linear any more
  fillAlchemyResources() {
    for (const resource of AlchemyResources.base) {
      resource.amount = Math.min(this.alchemyResourceCap, player.records.bestReality.glyphLevel);
    }
  },
  memoryTick(realDiff, generateChunks) {
    if (!this.isUnlocked) return;
    for (const pet of Ra.pets.all) pet.tick(realDiff, generateChunks);
  },
  get productionPerMemoryChunk() {
    let res = Effects.product(Ra.unlocks.continuousTTBoost.effects.memories, Achievement(168));
    for (const pet of Ra.pets.all) {
      if (pet.isUnlocked) res *= pet.memoryProductionMultiplier;
    }
    return res;
  },
  get memoryBoostResources() {
    const boostList = [];
    for (const pet of Ra.pets.all) {
      if (pet.memoryProductionMultiplier !== 1) boostList.push(pet.memoryGain);
    }
    if (Ra.unlocks.continuousTTBoost.canBeApplied) boostList.push("current Time Theorems");

    if (boostList.length === 1) return `${boostList[0]}`;
    if (boostList.length === 2) return `${boostList[0]} and ${boostList[1]}`;
    return `${boostList.slice(0, -1).join(", ")}, and ${boostList[boostList.length - 1]}`;
  },
  // This is the exp required ON "level" in order to reach "level + 1"
  requiredMemoriesForLevel(level) {
    if (level >= Ra.levelCap) return Infinity;
    const adjustedLevel = level + Math.pow(level, 2) / 10;
    const post15Scaling = Math.pow(1.5, Math.max(0, level - 15));
    return Math.floor(Math.pow(adjustedLevel, 5.52) * post15Scaling * 1e6);
  },
  // Calculates the cumulative exp needed to REACH a level starting from nothing.
  // TODO mathematically optimize this once Ra exp curves and balancing are finalized
  totalExpForLevel(maxLevel) {
    let runningTotal = 0;
    for (let lv = 1; lv < maxLevel; lv++) runningTotal += this.requiredMemoriesForLevel(lv);
    return runningTotal;
  },
  get totalPetLevel() {
    return this.pets.all.map(pet => (pet.isUnlocked ? pet.level : 0)).sum();
  },
  get levelCap() {
    return 25;
  },
  get maxTotalPetLevel() {
    return this.levelCap * this.pets.all.length;
  },
  checkForUnlocks() {
    if (!VUnlocks.raUnlock.canBeApplied) return;
    for (const unl of Ra.unlocks.all) {
      unl.unlock();
    }

    Ra.checkForQuotes();
  },
  checkForQuotes() {
    for (const quote of Object.values(Ra.quotes)) {
      // Quotes without requirements will be shown in other ways - need to check if it exists before calling though
      if (quote.requirement && quote.requirement()) {
        // TODO If multiple quotes show up simultaneously, this only seems to actually show one of them and skips the
        // rest. This might be related to the modal stacking issue
        Ra.quotes.show(quote);
      }
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.ra.run = true;
    this.quotes.show(this.quotes.realityEnter);
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  // This gets widely used in lots of places since the relevant upgrade is "all forms of continuous non-dimension
  // production", which in this case is infinities, eternities, replicanti, dilated time, and time theorem generation.
  // It also includes the 1% IP time study, Teresa's 1% EP upgrade, and the charged RM generation upgrade. Note that
  // removing the hardcap of 10 may cause runaways.
  theoremBoostFactor() {
    return Math.min(10, Math.max(0, Currency.timeTheorems.value.pLog10() - 350) / 50);
  },
  get isUnlocked() {
    return V.spaceTheorems >= 36;
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Ra.unlocks.chargedInfinityUpgrades.effectOrDefault(0);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get canBuyTriad() {
    return Ra.unlocks.unlockHardV.canBeApplied;
  },
  get petWithRecollection() {
    return player.celestials.ra.petWithRecollection;
  },
  set petWithRecollection(name) {
    player.celestials.ra.petWithRecollection = name;
  },
  updateAlchemyFlow(realityRealTime) {
    const perSecond = 1000 / realityRealTime;
    for (const resource of AlchemyResources.all) {
      resource.ema.addValue((resource.amount - resource.before) * perSecond);
      resource.before = resource.amount;
    }
  },
  applyAlchemyReactions(realityRealTime) {
    if (!Ra.unlocks.effarigUnlock.canBeApplied) return;
    const sortedReactions = AlchemyReactions.all
      .compact()
      .sort((r1, r2) => r2.priority - r1.priority);
    for (const reaction of sortedReactions) {
      reaction.combineReagents();
    }
    this.updateAlchemyFlow(realityRealTime);
  },
  get alchemyResourceCap() {
    return 25000;
  },
  get momentumValue() {
    const hoursFromUnlock = TimeSpan.fromMilliseconds(player.celestials.ra.momentumTime).totalHours;
    return Math.clampMax(1 + 0.002 * hoursFromUnlock, AlchemyResource.momentum.effectValue);
  },
  quotes: new CelestialQuotes("ra", GameDatabase.celestials.quotes.ra),
  symbol: "<i class='fas fa-sun'></i>"
};

export const GlyphAlteration = {
  // Adding a secondary effect to some effects
  get additionThreshold() {
    return 1e36;
  },
  // One-time massive boost of a single effect
  get empowermentThreshold() {
    return 1e43;
  },
  // Scaling boost from sacrifice quantity
  get boostingThreshold() {
    return 1e60;
  },
  getSacrificePower(type) {
    if (Pelle.isDisabled("alteration")) return 0;
    const sacPower = player.reality.glyphs.sac[type];
    if (sacPower === undefined) {
      throw new Error("Unknown sacrifice type");
    }
    return sacPower;
  },
  get isUnlocked() {
    if (Pelle.isDisabled("alteration")) return false;
    return Ra.unlocks.alteredGlyphs.canBeApplied;
  },
  isAdded(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.additionThreshold;
  },
  isEmpowered(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.empowermentThreshold;
  },
  isBoosted(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.boostingThreshold;
  },
  sacrificeBoost(type) {
    const capped = Math.clampMax(this.getSacrificePower(type), GlyphSacrificeHandler.maxSacrificeForEffects);
    return Math.log10(Math.clampMin(capped / this.boostingThreshold, 1)) / 2;
  },
  getAdditionColor(type) {
    return this.isAdded(type)
      ? "#CCCCCC"
      : undefined;
  },
  getEmpowermentColor(type) {
    return this.isEmpowered(type)
      ? "#EEEE30"
      : undefined;
  },
  getBoostColor(type) {
    return this.isBoosted(type)
      ? "#60DDDD"
      : undefined;
  },
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.ra.isOpen) Ra.quotes.show(Ra.quotes.unlock);
});

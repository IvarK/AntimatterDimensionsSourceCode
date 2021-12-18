import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

export function eternityResetRequest(auto) {
  if (!Reset.eternity.canBePerformed) return;
  if (EternityChallenge.isRunning) {
    Reset.exitEternityChallenge.request({ auto });
    return;
  }
  if (player.dilation.active) {
    Reset.exitDilation.request({ auto });
    return;
  }

  Reset.eternity.request({ auto });
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    return Currency.eternities.gte(this.config.eternities);
  }
}

export const EternityMilestone = (function() {
  const db = GameDatabase.eternity.milestones;
  const infinityDims = Array.dimensionTiers
    .map(tier => new EternityMilestoneState(db[`autobuyerID${tier}`]));
  return {
    autobuyerIPMult: new EternityMilestoneState(db.autobuyerIPMult),
    keepAutobuyers: new EternityMilestoneState(db.keepAutobuyers),
    autobuyerReplicantiGalaxy: new EternityMilestoneState(db.autobuyerReplicantiGalaxy),
    keepInfinityUpgrades: new EternityMilestoneState(db.keepInfinityUpgrades),
    bigCrunchModes: new EternityMilestoneState(db.bigCrunchModes),
    autoEP: new EternityMilestoneState(db.autoEP),
    autoIC: new EternityMilestoneState(db.autoIC),
    autobuyMaxGalaxies: new EternityMilestoneState(db.autobuyMaxGalaxies),
    unlockReplicanti: new EternityMilestoneState(db.unlockReplicanti),
    autobuyerID: tier => infinityDims[tier - 1],
    keepBreakUpgrades: new EternityMilestoneState(db.keepBreakUpgrades),
    autoUnlockID: new EternityMilestoneState(db.autoUnlockID),
    unlockAllND: new EternityMilestoneState(db.unlockAllND),
    replicantiNoReset: new EternityMilestoneState(db.replicantiNoReset),
    autobuyerReplicantiChance: new EternityMilestoneState(db.autobuyerReplicantiChance),
    autobuyerReplicantiInterval: new EternityMilestoneState(db.autobuyerReplicantiInterval),
    autobuyerReplicantiMaxGalaxies: new EternityMilestoneState(db.autobuyerReplicantiMaxGalaxies),
    autobuyerEternity: new EternityMilestoneState(db.autobuyerEternity),
    autoEternities: new EternityMilestoneState(db.autoEternities),
    autoInfinities: new EternityMilestoneState(db.autoInfinities),
  };
}());

export const EternityMilestones = {
  // This is a bit of a hack because autobuyerID is a function that returns EternityMilestoneState objects instead of a
  // EternityMilestoneState object itself
  all: Object.values(EternityMilestone)
    .filter(m => typeof m !== "function")
    .concat(Array.dimensionTiers
      .map(tier => new EternityMilestoneState(GameDatabase.eternity.milestones[`autobuyerID${tier}`]))
    )
};

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Math.clampMin(value - player.epmultUpgrades, 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    ++this.boughtAmount;
    return true;
  }

  buyMax() {
    const bulk = bulkBuyBinarySearch(Currency.eternityPoints.value, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount);
    if (!bulk) return false;
    Currency.eternityPoints.subtract(bulk.purchasePrice);
    this.boughtAmount += bulk.quantity;
    return true;
  }

  reset() {
    this.boughtAmount = 0;
  }

  get costIncreaseThresholds() {
    return [DC.E100, Decimal.NUMBER_MAX_VALUE, DC.E1300, DC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    return DC.E3.pow(count + Math.pow(Math.clampMin(count - 1334, 0), 1.2)).times(500);
  }
}


export const EternityUpgrade = (function() {
  const db = GameDatabase.eternity.upgrades;
  return {
    idMultEP: new EternityUpgradeState(db.idMultEP),
    idMultEternities: new EternityUpgradeState(db.idMultEternities),
    idMultICRecords: new EternityUpgradeState(db.idMultICRecords),
    tdMultAchs: new EternityUpgradeState(db.tdMultAchs),
    tdMultTheorems: new EternityUpgradeState(db.tdMultTheorems),
    tdMultRealTime: new EternityUpgradeState(db.tdMultRealTime),
    epMult: new EPMultiplierState(),
  };
}());

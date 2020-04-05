"use strict";

class AnnihilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return player.celestials.laitela.higgs;
  }

  set currency(value) {
     player.celestials.laitela.higgs = value;
  }

  get cost() {
    const base = Decimal.pow(this.config.costMult, this.boughtAmount).times(this.config.startCost);
    if (DarkEnergyUpgrade.annihilationUpgradeCostReduction.isBought) {
      return base.dividedBy(DarkEnergyUpgrade.annihilationUpgradeCostReduction.effect);
    }
    return base;
  }

  get description() {
    return this.config.description;
  }

  get canBeBought() {
    return this.currency.gte(this.cost);
  }

  get boughtAmount() {
    const upgrade = player.celestials.laitela.upgrades[this.id];
    return upgrade === undefined ? 0 : upgrade;
  }

  set boughtAmount(value) {
    const upgrade = player.celestials.laitela.upgrades[this.id];
    if (upgrade === undefined) player.celestials.laitela.upgrades[this.id] = 0;
    player.celestials.laitela.upgrades[this.id] = value;
  }

  get effect() {
    return this.config.effect(this.boughtAmount);
  }

  get nextEffect() {
    return this.config.effect(this.boughtAmount + 1);
  }

  get formattedEffect() {
    return this.config.effectFormat(this.effect);
  }

  get formattedNextEffect() {
    return this.config.effectFormat(this.nextEffect);
  }

  purchase() {
    if (!this.canBeBought) return;
    this.currency = this.currency.minus(this.cost);
    this.boughtAmount++;
  }
}

const AnnihilationUpgrade = (function() {
  const db = GameDatabase.annihilationUpgrades;
  return {
    realityReward: new AnnihilationUpgradeState(db.realityReward),
    intervalPower: new AnnihilationUpgradeState(db.intervalPower),
    darkEnergyMult: new AnnihilationUpgradeState(db.darkEnergyMult),
    infConversion: new AnnihilationUpgradeState(db.infConversion),
    freeTickDecrease: new AnnihilationUpgradeState(db.freeTickDecrease),
    dimCostMult: new AnnihilationUpgradeState(db.dimCostMult),
  };
}());

AnnihilationUpgrade.all = Object.values(AnnihilationUpgrade);

class DarkEnergyUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.laitela.darkEnergyUpgrades;
  }

  get currency() {
    return player.celestials.laitela.darkEnergy;
  }

  set currency(value) {
    player.celestials.laitela.darkEnergy = value;
  }

  get description() {
    return this.config.description;
  }

  get canBeBought() {
    if (this.isBought) return false;
    return this.currency > this.cost;
  }

  get effect() {
    return this.config.effect();
  }

  get formattedEffect() {
    if (this.config.effectFormat === undefined) return `${format(this.effect, 2, 2)}x`;

    return this.config.effectFormat(this.effect);
  }

  purchase() {
    if (!this.canBeBought) return;
    this.currency -= this.cost;
    this.isBought = true;
  }
}

const DarkEnergyUpgrade = (function() {
  const db = GameDatabase.darkEnergyUpgrade;
  return {
    matterDimensionMult: new DarkEnergyUpgradeState(db.matterDimensionMult),
    annihilationUpgradeCostReduction: new DarkEnergyUpgradeState(db.annihilationUpgradeCostReduction),
    bosonMult: new DarkEnergyUpgradeState(db.bosonMult),
    realityPenaltyReduction: new DarkEnergyUpgradeState(db.realityPenaltyReduction),
    reactionPower: new DarkEnergyUpgradeState(db.reactionPower),
    darkEnergy6: new DarkEnergyUpgradeState(db.darkEnergy6),
  };
}());

DarkEnergyUpgrade.all = Object.values(DarkEnergyUpgrade);

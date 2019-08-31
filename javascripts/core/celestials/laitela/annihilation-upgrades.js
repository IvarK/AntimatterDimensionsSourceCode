"use strict";

class AnnihilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return player.celestials.laitela.higgs;
  }

  set currency(value) {
     player.celestials.laitela.higgs = value;
  }
  
  get cost() {
    return Decimal.pow(this.config.costMult, this.boughtAmount).times(this.config.startCost);
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
"use strict";

/**
 * @abstract
 */
class TimeTheoremPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount += amount; }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    if (Perk.ttFree.isBought) {
      return Math.floor(this.currency.value.divide(this.cost).log(this.costIncrement.toNumber()) + 1);
    }
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0).toNumber();
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount - 1));
  }

  purchase(bulk) {
    if (this.currency.lt(this.cost)) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    const buyFn = cost => (Perk.ttFree.isBought ? this.currency.gt(cost) : this.currency.purchase(cost));
    // This will sometimes buy one too few for EP, so we just have to buy 1 after.
    if (bulk && buyFn(this.bulkCost(amount))) {
      Currency.timeTheorems.add(amount);
      this.add(amount);
      purchased = true;
    }
    if (buyFn(this.cost)) {
      Currency.timeTheorems.add(1);
      this.add(1);
      purchased = true;
    }
    if (purchased) player.requirementChecks.reality.noPurchasedTT = false;
    return purchased;
  }

  reset() {
    this.amount = 0;
  }
}

TimeTheoremPurchaseType.am = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.amBought; }
  set amount(value) { player.timestudy.amBought = value; }

  get currency() { return Currency.antimatter; }
  get costBase() { return new Decimal("1e20000"); }
  get costIncrement() { return new Decimal("1e20000"); }
}();

TimeTheoremPurchaseType.ip = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.ipBought; }
  set amount(value) { player.timestudy.ipBought = value; }

  get currency() { return Currency.infinityPoints; }
  get costBase() { return new Decimal(1); }
  get costIncrement() { return new Decimal(1e100); }
}();

TimeTheoremPurchaseType.ep = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.epBought; }
  set amount(value) { player.timestudy.epBought = value; }

  get currency() { return Currency.eternityPoints; }
  get costBase() { return new Decimal(1); }
  get costIncrement() { return new Decimal(2); }

  bulkCost(amount) {
    if (Perk.ttFree.isBought) return this.cost.times(this.costIncrement.pow(amount - 1));
    return this.costIncrement.pow(amount + this.amount).subtract(this.cost);
  }
}();

const TimeTheorems = {
  checkForBuying(auto) {
    if (PlayerProgress.realityUnlocked() || TimeDimension(1).bought) return true;
    if (!auto) Modal.message.show("You need to buy at least 1 Time Dimension before you can purchase Time Theorems.");
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return 0;
    if (!TimeTheoremPurchaseType[type].purchase(false)) return 0;
    return 1;
  },

  buyMax(auto = false, isMax) {
    if (!this.checkForBuying(auto)) return 0;
    const ttAM = TimeTheoremPurchaseType.am.purchase(isMax);
    const ttIP = TimeTheoremPurchaseType.ip.purchase(isMax);
    const ttEP = TimeTheoremPurchaseType.ep.purchase(isMax);
    return ttAM + ttIP + ttEP;
  },

  totalPurchased() {
    return TimeTheoremPurchaseType.am.amount +
          TimeTheoremPurchaseType.ip.amount +
          TimeTheoremPurchaseType.ep.amount;
  },

  calculateTimeStudiesCost() {
    let totalCost = TimeStudy.boughtNormalTS()
      .map(ts => ts.cost)
      .reduce(Number.sumReducer, 0);
    const ecStudy = TimeStudy.eternityChallenge.current();
    if (ecStudy !== undefined) {
      totalCost += ecStudy.cost;
    }
    // Secret time study
    if (Enslaved.isRunning && player.secretUnlocks.viewSecretTS) totalCost -= 100;
    return totalCost;
  }
};

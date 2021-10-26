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
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0).toNumber();
  }

  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount - 1));
  }

  purchase(bulk) {
    if (this.currency.lt(this.cost)) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    // This will sometimes buy one too few for EP, so we just have to buy 1 after.
    if (bulk && this.currency.purchase(this.bulkCost(amount))) {
      Currency.timeTheorems.add(amount);
      this.add(amount);
      purchased = true;
    }
    if (this.currency.purchase(this.cost)) {
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
  get costBase() { return DC.E20000; }
  get costIncrement() { return DC.E20000; }
}();

TimeTheoremPurchaseType.ip = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.ipBought; }
  set amount(value) { player.timestudy.ipBought = value; }

  get currency() { return Currency.infinityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E100; }
}();

TimeTheoremPurchaseType.ep = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.epBought; }
  set amount(value) { player.timestudy.epBought = value; }

  get currency() { return Currency.eternityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.D2; }

  bulkCost(amount) { return this.costIncrement.pow(amount + this.amount).subtract(this.cost); }
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

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return 0;
    const ttAM = TimeTheoremPurchaseType.am.purchase(true);
    const ttIP = TimeTheoremPurchaseType.ip.purchase(true);
    const ttEP = TimeTheoremPurchaseType.ep.purchase(true);
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

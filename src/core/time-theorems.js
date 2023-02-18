import { DC } from "./constants";

/**
 * @abstract
 */
export class TimeTheoremPurchaseType {
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
    if (Perk.ttFree.canBeApplied) {
      return Math.floor(this.currency.value.divide(this.cost).log10() / this.costIncrement.log10() + 1);
    }
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0).toNumber();
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount - 1));
  }

  purchase(bulk) {
    if (!this.canAfford) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    const buyFn = cost => (Perk.ttFree.canBeApplied ? this.currency.gte(cost) : this.currency.purchase(cost));
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
    if (TimeTheorems.totalPurchased() > 114) PelleStrikes.ECs.trigger();
    return purchased;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && !player.eternities.eq(0);
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

  bulkCost(amount) {
    if (Perk.ttFree.canBeApplied) return this.cost.times(this.costIncrement.pow(amount - 1));
    return this.costIncrement.pow(amount + this.amount).subtract(this.cost);
  }
}();

export const TimeTheorems = {
  checkForBuying(auto) {
    if (PlayerProgress.realityUnlocked() || TimeDimension(1).bought) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Time Dimension before you can purchase
      Time Theorems.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return 0;
    if (!TimeTheoremPurchaseType[type].purchase(false)) return 0;
    return 1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return 0;
    const ttAM = this.buyOne(true, "am");
    const ttIP = this.buyOne(true, "ip");
    const ttEP = this.buyOne(true, "ep");
    return ttAM + ttIP + ttEP;
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
    if (Enslaved.isRunning && player.celestials.enslaved.hasSecretStudy) totalCost -= 100;
    return totalCost;
  }
};

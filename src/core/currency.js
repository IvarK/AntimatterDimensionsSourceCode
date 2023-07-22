import { DC } from "./constants";


/**
 * @abstract
 */
class MathOperations {
  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  multiply(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  divide(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  max(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  min(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  eq(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gte(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lte(left, right) { throw new NotImplementedError(); }
}

MathOperations.number = new class NumberMathOperations extends MathOperations {
  add(left, right) { return left + right; }
  subtract(left, right) { return left - right; }
  multiply(left, right) { return left * right; }
  divide(left, right) { return left / right; }
  max(left, right) { return Math.max(left, right); }
  min(left, right) { return Math.min(left, right); }
  eq(left, right) { return left === right; }
  gt(left, right) { return left > right; }
  gte(left, right) { return left >= right; }
  lt(left, right) { return left < right; }
  lte(left, right) { return left <= right; }
}();

MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
  add(left, right) { return Decimal.add(left, right); }
  subtract(left, right) { return Decimal.subtract(left, right); }
  multiply(left, right) { return Decimal.multiply(left, right); }
  divide(left, right) { return Decimal.divide(left, right); }
  max(left, right) { return Decimal.max(left, right); }
  min(left, right) { return Decimal.min(left, right); }
  eq(left, right) { return Decimal.eq(left, right); }
  gt(left, right) { return Decimal.gt(left, right); }
  gte(left, right) { return Decimal.gte(left, right); }
  lt(left, right) { return Decimal.lt(left, right); }
  lte(left, right) { return Decimal.lte(left, right); }
}();

/**
 * @abstract
 */
export class Currency {
  /**
   * @abstract
   */
  get value() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   * @type {MathOperations}
   */
  get operations() { throw new NotImplementedError(); }

  add(amount) {
    this.value = this.operations.add(this.value, amount);
  }

  subtract(amount) {
    this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.divide(this.value, amount);
  }

  eq(amount) {
    return this.operations.eq(this.value, amount);
  }

  gt(amount) {
    return this.operations.gt(this.value, amount);
  }

  gte(amount) {
    return this.operations.gte(this.value, amount);
  }

  lt(amount) {
    return this.operations.lt(this.value, amount);
  }

  lte(amount) {
    return this.operations.lte(this.value, amount);
  }

  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.subtract(cost);
    return true;
  }

  bumpTo(value) {
    this.value = this.operations.max(this.value, value);
  }

  dropTo(value) {
    this.value = this.operations.min(this.value, value);
  }

  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }
}

/**
 * @abstract
 */
class NumberCurrency extends Currency {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get mantissa() { return this.value.mantissa; }
  get exponent() { return this.value.exponent; }
  get startingValue() { return DC.D0; }
}
window.DecimalCurrency = DecimalCurrency;

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }

  set value(value) {
    if (InfinityChallenges.nextIC) InfinityChallenges.notifyICUnlock(value);
    if (GameCache.cheapestAntimatterAutobuyer.value && value.gte(GameCache.cheapestAntimatterAutobuyer.value)) {
      // Clicking into the automation tab clears the trigger and prevents it from retriggering as long as the player
      // stays on the tab; leaving the tab with an available autobuyer will immediately force it to trigger again
      TabNotification.newAutobuyer.clearTrigger();
      TabNotification.newAutobuyer.tryTrigger();
    }
    player.antimatter = value;
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.max(value);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.max(value);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalAntimatter = player.celestials.pelle.records.totalAntimatter.max(value);
    }
  }

  add(amount) {
    super.add(amount);
    if (amount.gt(0)) {
      player.records.totalAntimatter = player.records.totalAntimatter.add(amount);
      player.requirementChecks.reality.noAM = false;
    }
  }

  get productionPerSecond() {
    return NormalChallenge(12).isRunning
      ? AntimatterDimension(1).productionPerRealSecond.plus(AntimatterDimension(2).productionPerRealSecond)
      : AntimatterDimension(1).productionPerRealSecond;
  }

  get startingValue() {
    if (Pelle.isDisabled()) return new Decimal(100);
    return Effects.max(
      10,
      Perk.startAM,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78)
    ).toDecimal();
  }
}();

Currency.matter = new class extends DecimalCurrency {
  get value() { return player.matter; }
  set value(value) {
    player.matter = Decimal.min(value, Decimal.MAX_VALUE);
  }
}();

Currency.infinities = new class extends DecimalCurrency {
  get value() { return player.infinities; }
  set value(value) { player.infinities = value; }
}();

Currency.infinitiesBanked = new class extends DecimalCurrency {
  get value() { return player.infinitiesBanked; }
  set value(value) { player.infinitiesBanked = value; }
}();

Currency.infinitiesTotal = new class extends DecimalCurrency {
  get value() { return player.infinities.plus(player.infinitiesBanked); }
  set value(value) { player.infinities = value; }
}();

Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) {
    player.infinityPoints = value;
    player.records.thisEternity.maxIP = player.records.thisEternity.maxIP.max(value);
    player.records.thisReality.maxIP = player.records.thisReality.maxIP.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalInfinityPoints =
        player.celestials.pelle.records.totalInfinityPoints.max(value);
    }
  }

  get startingValue() {
    if (Pelle.isDisabled()) return new Decimal(0);
    return Effects.max(
      0,
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    ).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisEternity.maxIP = this.startingValue;
  }
}();

Currency.infinityPower = new class extends DecimalCurrency {
  get value() { return player.infinityPower; }
  set value(value) { player.infinityPower = value; }
}();

Currency.eternities = new class extends DecimalCurrency {
  get value() { return player.eternities; }
  set value(value) { player.eternities = value; }

  get startingValue() {
    if (Pelle.isDoomed) return new Decimal(0);
    return Effects.max(
      0,
      RealityUpgrade(10)
    ).toDecimal();
  }
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) {
    player.eternityPoints = value;
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.max(value);
    if (player.records.bestReality.bestEP.lt(value)) {
      player.records.bestReality.bestEP = value;
      player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalEternityPoints =
        player.celestials.pelle.records.totalEternityPoints.max(value);
    }
  }

  get startingValue() {
    if (Pelle.isDisabled()) return new Decimal(0);
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    ).toDecimal();
  }

  reset() {
    super.reset();
    player.records.thisReality.maxEP = this.startingValue;
  }
}();

Currency.timeShards = new class extends DecimalCurrency {
  get value() { return player.timeShards; }
  set value(value) { player.timeShards = value; }
}();

Currency.timeTheorems = new class extends DecimalCurrency {
  get value() { return player.timestudy.theorem; }
  set value(value) {
    player.timestudy.theorem = value;
    player.timestudy.maxTheorem = value.plus(TimeTheorems.calculateTimeStudiesCost());
  }

  get max() { return player.timestudy.maxTheorem; }

  add(amount) {
    super.add(amount);
    player.timestudy.maxTheorem = player.timestudy.maxTheorem.plus(amount);
  }

  reset() {
    respecTimeStudies(true);
    super.reset();
    TimeTheoremPurchaseType.am.reset();
    TimeTheoremPurchaseType.ip.reset();
    TimeTheoremPurchaseType.ep.reset();
    player.timestudy.maxTheorem = this.startingValue;
  }
}();

Currency.tachyonParticles = new class extends DecimalCurrency {
  get value() { return player.dilation.tachyonParticles; }
  set value(value) { player.dilation.tachyonParticles = value; }
}();

Currency.dilatedTime = new class extends DecimalCurrency {
  get value() { return player.dilation.dilatedTime; }
  set value(value) {
    player.dilation.dilatedTime = value;
    player.records.thisReality.maxDT = player.records.thisReality.maxDT.max(value);
  }
}();

Currency.realities = new class extends NumberCurrency {
  get value() { return player.realities; }
  set value(value) { player.realities = value; }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) {
    const newValue = Decimal.min(value, MachineHandler.hardcapRM);
    const addedThisReality = newValue.minus(player.reality.realityMachines);
    player.reality.realityMachines = newValue;
    player.reality.maxRM = Decimal.max(player.reality.maxRM, newValue);
    if (player.records.bestReality.RM.lt(addedThisReality)) {
      player.records.bestReality.RM = addedThisReality;
      player.records.bestReality.RMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }
  }
}();

Currency.perkPoints = new class extends NumberCurrency {
  get value() { return player.reality.perkPoints; }
  set value(value) { player.reality.perkPoints = value; }
}();

Currency.relicShards = new class extends NumberCurrency {
  get value() { return player.celestials.effarig.relicShards; }
  set value(value) { player.celestials.effarig.relicShards = value; }
}();

Currency.imaginaryMachines = new class extends NumberCurrency {
  get value() { return player.reality.imaginaryMachines; }
  set value(value) {
    player.reality.imaginaryMachines = Math.clampMax(value, MachineHandler.currentIMCap);
  }
}();

Currency.darkMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.darkMatter; }
  set value(value) {
    const capped = Decimal.min(value, Number.MAX_VALUE);
    player.celestials.laitela.darkMatter = capped;
    player.celestials.laitela.maxDarkMatter = player.celestials.laitela.maxDarkMatter.max(capped);
  }

  get max() { return player.celestials.laitela.maxDarkMatter; }
  set max(value) { player.celestials.laitela.maxDarkMatter = value; }
}();

Currency.darkEnergy = new class extends NumberCurrency {
  get value() { return player.celestials.laitela.darkEnergy; }
  set value(value) { player.celestials.laitela.darkEnergy = value; }

  get productionPerSecond() {
    return DarkMatterDimensions.all
      .map(d => d.productionPerSecond)
      .sum();
  }
}();

Currency.singularities = new class extends NumberCurrency {
  get value() { return player.celestials.laitela.singularities; }
  set value(value) { player.celestials.laitela.singularities = value; }
}();

Currency.remnants = new class extends NumberCurrency {
  get value() { return player.celestials.pelle.remnants; }
  set value(value) { player.celestials.pelle.remnants = value; }
}();

Currency.realityShards = new class extends DecimalCurrency {
  get value() { return player.celestials.pelle.realityShards; }
  set value(value) { player.celestials.pelle.realityShards = value; }
}();

Currency.replicanti = new class extends DecimalCurrency {
  get value() { return player.replicanti.amount; }
  set value(value) { player.replicanti.amount = value; }
}();

Currency.galaxyGeneratorGalaxies = new class extends NumberCurrency {
  get value() {
    return player.galaxies + GalaxyGenerator.galaxies;
  }

  set value(value) {
    const spent = player.galaxies + GalaxyGenerator.galaxies - value;
    player.celestials.pelle.galaxyGenerator.spentGalaxies += spent;
  }
}();

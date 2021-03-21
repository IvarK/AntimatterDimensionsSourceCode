"use strict";

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
class Currency {
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
  get startingValue() { return new Decimal(0); }
}

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }

  set value(value) {
    player.antimatter = value;
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.max(value);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.max(value);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.max(value);
  }

  add(amount) {
    super.add(amount);
    player.records.totalAntimatter = player.records.totalAntimatter.plus(amount);
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.plus(amount);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.plus(amount);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.plus(amount);
    if (amount.gt(0)) player.achievementChecks.noAntimatterProduced = false;
  }

  get productionPerSecond() {
    let production = AntimatterDimension(1).productionPerRealSecond;
    if (NormalChallenge(12).isRunning) {
      production = production.plus(AntimatterDimension(2).productionPerRealSecond);
    }
    return production;
  }

  get startingValue() {
    return Effects.max(
      10,
      Perk.startAM1,
      Perk.startAM2,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78)
    ).toDecimal();
  }
}();

Currency.infinityPower = new class extends DecimalCurrency {
  get value() { return player.infinityPower; }
  set value(value) { player.infinityPower = value; }
}();

Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) {
    player.infinityPoints = value;
    player.records.thisEternity.maxIP = player.records.thisEternity.maxIP.max(value);
    player.records.thisReality.maxIP = player.records.thisReality.maxIP.max(value);
  }

  add(amount) {
    super.add(amount);
    player.records.thisEternity.maxIP = player.records.thisEternity.maxIP.plus(amount);
    player.records.thisReality.maxIP = player.records.thisReality.maxIP.plus(amount);
  }

  get startingValue() {
    return Effects.max(
      0,
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    ).toDecimal();
  }
}();

Currency.timeShards = new class extends DecimalCurrency {
  get value() { return player.timeShards; }
  set value(value) { player.timeShards = value; }
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) {
    player.eternityPoints = value;
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.max(value);
  }

  add(amount) {
    super.add(amount);
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.plus(amount);
  }

  get startingValue() {
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    ).toDecimal();
  }
}();

Currency.timeTheorems = new class extends DecimalCurrency {
  get value() { return player.timestudy.theorem; }
  set value(value) { player.timestudy.theorem = value; }
}();

Currency.tachyonParticles = new class extends DecimalCurrency {
  get value() { return player.dilation.tachyonParticles; }
  set value(value) { player.dilation.tachyonParticles = value; }
}();


Currency.dilatedTime = new class extends DecimalCurrency {
  get value() { return player.dilation.dilatedTime; }
  set value(value) { player.dilation.dilatedTime = value; }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) { player.reality.realityMachines = value; }
}();

Currency.perkPoints = new class extends NumberCurrency {
  get value() { return player.reality.perkPoints; }
  set value(value) { player.reality.perkPoints = value; }
}();

Currency.relicShards = new class extends NumberCurrency {
  get value() { return player.celestials.effarig.relicShards; }
  set value(value) { player.celestials.effarig.relicShards = value; }
}();

Currency.darkMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.darkMatter; }
  set value(value) {
    player.celestials.laitela.darkMatter = value;
    player.celestials.laitela.maxDarkMatter = player.celestials.laitela.maxDarkMatter.max(value);
  }

  get max() { return player.celestials.laitela.maxDarkMatter; }
  set max(value) { player.celestials.laitela.maxDarkMatter = value; }
}();

Currency.darkEnergy = new class extends NumberCurrency {
  get value() { return player.celestials.laitela.darkEnergy; }
  set value(value) { player.celestials.laitela.darkEnergy = value; }

  get productionPerSecond() {
    return Array.range(1, 4)
      .map(n => MatterDimension(n))
      .filter(d => d.amount.gt(0))
      .map(d => d.powerDE * 1000 / d.interval)
      .sum();
  }
}();

Currency.singularities = new class extends NumberCurrency {
  get value() { return player.celestials.laitela.singularities; }
  set value(value) { player.celestials.laitela.singularities = value; }

  get timeUntil() { return Singularity.cap / Currency.darkEnergy.productionPerSecond; }
}();

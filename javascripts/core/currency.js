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
    this.value = this.operations.max(this.operations.subtract(this.value, amount), this.startingValue);
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.max(this.operations.divide(this.value, amount), this.startingValue);
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

  /**
   * @abstract
   */
  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }

  /**
  * @abstract
  */
/*  get gainedCurrency() { throw new NotImplementedError(); } */
}
/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
/**
 * @abstract
 */
class NumberCurrency extends Currency {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
//  get gainedCurrency() { return 0; }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get mantissa() { return this.value.mantissa; }
  get exponent() { return this.value.exponent; }
  get startingValue() { return new Decimal(0); }
//  get gainedCurrency() { return new Decimal(0); }
}

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }

  set value(value) {
    player.antimatter = value;
    player.records.totalAntimatter = player.records.totalAntimatter.max(value);
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.max(value);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.max(value);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.max(value);
  }

  add(amount) {
    super.add(amount);
    if (amount.gt(0)) player.achievementChecks.noAntimatterProduced = false;
  }

  get productionPerSecond() {
    return NormalChallenge(12).isRunning ? AntimatterDimension(1).productionPerRealSecond
      : AntimatterDimension(1).productionPerRealSecond.plus(AntimatterDimension(2).productionPerRealSecond);
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

Currency.infinities = new class extends DecimalCurrency {
  get value() { return player.infinities; }
  set value(value) { player.infinities = value; }

/*  get gainedCurrency() {
    if (EternityChallenge(4).isRunning) return new Decimal(1);
    let infGain = Effects.max(
      1,
      Achievement(87)
    ).toDecimal();

    infGain = infGain.timesEffectsOf(
      TimeStudy(32),
      RealityUpgrade(5),
      RealityUpgrade(7),
      Achievement(164)
    );
    infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
    infGain = infGain.times(RA_UNLOCKS.TT_BOOST.effect.infinity());
    infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
    return infGain;
  } */
}();

Currency.infinitiesBanked = new class extends DecimalCurrency {
  get value() { return player.infinitiesBanked; }
  set value(value) { player.infinitiesBanked = value; }

/*  get gainedCurrency() {
    return Achievement(131).effectOrDefault(0).plus(TimeStudy(191).effectOrDefault(0));
  } */
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
  }

  get startingValue() {
    return Effects.max(
      0,
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    ).toDecimal();
  }

/*  get gainedCurrency() {
    const div = Effects.min(
      308,
      Achievement(103),
      TimeStudy(111)
    );
    let ip = player.break
      ? Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75)
      : new Decimal(308 / div);
    if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
      ip = ip.min(1e200);
    }
    ip = ip.times(GameCache.totalIPMult.value);
    if (Teresa.isRunning) {
      ip = ip.pow(0.55);
    } else if (V.isRunning) {
      ip = ip.pow(0.5);
    } else if (Laitela.isRunning) {
      ip = dilatedValueOf(ip);
    }
    if (GlyphAlteration.isAdded("infinity")) {
      ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
    }
    return ip.floor();
  } */
}();

Currency.infinityPower = new class extends DecimalCurrency {
  get value() { return player.infinityPower; }
  set value(value) { player.infinityPower = value; }
}();

Currency.eternities = new class extends DecimalCurrency {
  get value() { return player.eternities; }
  set value(value) { player.eternities = value; }

  get startingValue() {
    return Effects.max(
      0,
      RealityUpgrade(10)
    ).toDecimal();
  }

/*  get gainedCurrency() {
    return RealityUpgrade(3).effectValue;
  } */
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) {
    player.eternityPoints = value;
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.max(value);
    if (player.records.bestReality.bestEP.lt(value)) {
      player.records.bestReality.bestEP.copyFrom(Currency.eternityPoints);
      player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }
  }

  get startingValue() {
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    ).toDecimal();
  }

/*  get gainedCurrency() {
    let ep = Decimal.pow(5, Currency.infinityPoints.value.plus(gainedInfinityPoints()).log10() / 308 - 0.7).times(
      getAdjustedGlyphEffect("cursedEP")
        .times(ShopPurchase.EPPurchases.currentMult)
        .timesEffectsOf(
          EternityUpgrade.epMult,
          TimeStudy(61),
          TimeStudy(122),
          TimeStudy(121),
          TimeStudy(123),
          RealityUpgrade(12),
          GlyphEffect.epMult
        )
    );

    if (Teresa.isRunning) {
      ep = ep.pow(0.55);
    } else if (V.isRunning) {
      ep = ep.pow(0.5);
    } else if (Laitela.isRunning) {
      ep = dilatedValueOf(ep);
    }
    if (GlyphAlteration.isAdded("time")) {
      ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
    }
    return ep.floor();
  } */
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
    if (new Decimal(amount).gt(0)) player.achievementChecks.noTheoremPurchases = false;
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
  set value(value) { player.dilation.dilatedTime = value; }
}();

Currency.realities = new class extends NumberCurrency {
  get value() { return player.realities; }
  set value(value) { player.realities = value; }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) { player.reality.realityMachines = value; }

/*  get gainedCurrency() {
    let log10FinalEP = Currency.eternityPoints.value.plus(gainedEternityPoints()).log10();
    if (!PlayerProgress.realityUnlocked() && log10FinalEP > 6000 && player.saveOverThresholdFlag) {
      log10FinalEP -= (log10FinalEP - 6000) * 0.75;
    }
    let rmGain = Decimal.pow(1000, log10FinalEP / 4000 - 1);
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = new Decimal(27 / 4000 * log10FinalEP - 26);
    rmGain = rmGain.times(getRealityMachineMultiplier());
    // This happens around ee10 and is necessary to reach e9e15 antimatter without having to deal with the various
    // potential problems associated with having ee9 RM, of which there are lots (both balance-wise and design-wise).
    // The softcap here squishes every additional OoM in the exponent into another factor of e1000 RM, putting e9e15
    // antimatter around e7000 RM instead of e1000000000 RM.
    const softcapRM = new Decimal("1e1000");
    if (rmGain.gt(softcapRM)) {
      const exponentOOMAboveCap = Math.log10(rmGain.log10() / softcapRM.log10());
      rmGain = softcapRM.pow(1 + exponentOOMAboveCap);
    }
    return Decimal.floor(rmGain);
  } */
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

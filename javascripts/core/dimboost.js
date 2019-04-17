class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return NormalDimension(this.tier).amount.gte(this.amount);
  }
}

class DimBoost {
  static get power() {
    if (NormalChallenge(8).isRunning) {
      return new Decimal(1);
    }

    return Effects
      .max(
        2,
        InfinityUpgrade.dimboostMult,
        InfinityChallenge(7).reward,
        InfinityChallenge(7),
        TimeStudy(81)
      )
      .toDecimal()
      .timesEffectsOf(
        TimeStudy(83),
        TimeStudy(231),
        Achievement(101),
        Achievement(142),
        GlyphEffect.dimBoostPower
      ).powEffectsOf(InfinityUpgrade.dimboostMult.chargedEffect);
  }

  static get maxShiftTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get isShift() {
    // Player starts with 4 unlocked dimensions,
    // hence there are just 4 (or 2, if in Auto DimBoosts challenge) shifts
    return player.resets + 4 < this.maxShiftTier;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    let targetResets = player.resets + bulk;
    let tier = Math.min(targetResets + 3, this.maxShiftTier);
    let amount = 20;

    if (tier === 6 && NormalChallenge(10).isRunning) {
      amount += Math.ceil((targetResets - 3) * 20);
    }
    else if (tier === 8) {
      const mult = 15 - Effects.sum(
        TimeStudy(211),
        TimeStudy(222)
      );
      amount += Math.ceil((targetResets - 5) * mult);
    }
    if (EternityChallenge(5).isRunning) {
      amount += Math.pow(targetResets - 1, 3) + targetResets;
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;

    return new DimBoostRequirement(tier, amount);
  }
}

function applyDimensionBoost() {
    const power = DimBoost.power;
    for (let tier = 1; tier <= 8; tier++) {
        NormalDimension(tier).pow = power.pow(player.resets + 1 - tier).max(1);
    }
}

function softReset(bulk) {
    //if (bulk < 1) bulk = 1 (fixing issue 184)
    if (!player.break && player.money.gt(Decimal.MAX_NUMBER)) return;
    EventHub.dispatch(GameEvent.DIMBOOST_BEFORE, bulk);
    player.resets += bulk;

    /**
     * All reset stuff are in these functions now. (Hope this works)
     */
    player.sacrificed = new Decimal(0);
    resetChallengeStuff();
    resetDimensions();
    applyDimensionBoost();
    applyChallengeModifiers();
    skipResetsIfPossible();
    resetTickspeed();
    const currentMoney = player.money;
    resetMoney();
    if (Achievement(111).isEnabled) {
        player.money = player.money.max(currentMoney);
    }
    EventHub.dispatch(GameEvent.DIMBOOST_AFTER, bulk);
}

function applyChallengeModifiers() {
    if (NormalChallenge(6).isRunning) {
        player.thirdCost = new Decimal(100);
        player.fourthCost = new Decimal(500);
        player.fifthCost = new Decimal(2500);
        player.sixthCost = new Decimal(2e4);
        player.seventhCost = new Decimal(2e5);
        player.eightCost = new Decimal(4e6);
    }
    if (InfinityChallenge(1).isRunning)
        player.costMultipliers = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
}

function skipResetsIfPossible() {
  if (NormalChallenge.current() || InfinityChallenge.current()) {
    return;
  }
  if (InfinityUpgrade.skipResetGalaxy.isBought && player.resets < 4) {
    player.resets = 4;
    if (player.galaxies === 0) player.galaxies = 1;
  }
  else if (InfinityUpgrade.skipReset3.isBought && player.resets < 3) player.resets = 3;
  else if (InfinityUpgrade.skipReset2.isBought && player.resets < 2) player.resets = 2;
  else if (InfinityUpgrade.skipReset1.isBought && player.resets < 1) player.resets = 1;
}

function softResetBtnClick() {
  if ((!player.break && player.money.gt(Decimal.MAX_NUMBER)) || !DimBoost.requirement.isSatisfied) return;
  if (Ra.isRunning) return;
  auto = false;
  if (BreakInfinityUpgrade.bulkDimBoost.isBought) maxBuyDimBoosts(true);
  else softReset(1)
  
  for (let tier = 1; tier<9; tier++) {
    const mult = DimBoost.power.pow(player.resets + 1 - tier);
    if (mult.gt(1)) floatText(tier, "x" + shortenDimensions(mult));
  }
}

function maxBuyDimBoosts(manual) {
  // Shifts are bought one at a time, unlocking the next dimension
  if (DimBoost.isShift) {
    if (DimBoost.requirement.isSatisfied) softReset(1);
    return;
  }
  let availableBoosts = Number.MAX_VALUE;
  if (player.overXGalaxies > player.galaxies && !manual) {
    availableBoosts = Autobuyer.dimboost.maxDimBoosts - player.resets;
  }
  if (availableBoosts <= 0) return;

  const req1 = DimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = DimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) return softReset(1);
  // Linearly extrapolate dimboost costs. req1 = a * 1 + b, req2 = a * 2 + b
  // so a = req2 - req1, b = req1 - a = 2 req1 - req2, num = (dims - b) / a
  const increase = req2.amount - req1.amount;
  let maxBoosts = Math.min(availableBoosts,
    1 + Math.floor((NormalDimension(req1.tier).amount.toNumber() - req1.amount) / increase));
  if (DimBoost.bulkRequirement(maxBoosts).isSatisfied) return softReset(maxBoosts);

  // But in case of EC5 it's not, so do binary search for appropriate boost amount
  let minBoosts = 2;
  while (maxBoosts !== minBoosts + 1) {
    const middle = Math.floor((maxBoosts + minBoosts) / 2);
    if (DimBoost.bulkRequirement(middle).isSatisfied) minBoosts = middle;
    else maxBoosts = middle;
  }
  softReset(minBoosts);
}

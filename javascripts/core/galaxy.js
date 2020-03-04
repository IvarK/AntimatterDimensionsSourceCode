"use strict";

const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    return NormalDimension(this.tier).amount.gte(this.amount);
  }
}

class Galaxy {
  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency) {
    let constantTerm = Galaxy.baseCost;
    let linearTerm = Galaxy.costMult;
    let quadraticBegin = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart - 1;
    // Separate because it's applied post remote scaling:
    const finalOffset = Effects.sum(InfinityUpgrade.resetBoost) +
      (InfinityChallenge(5).isCompleted ? 1 : 0);
      
    const costDivision = GlyphAlteration.isAdded("power") ? getSecondaryGlyphEffect("powerpow") : 1;
    
    let quantity = (currency / costDivision - constantTerm + finalOffset) / linearTerm;
    
    let unroundedGalaxyAmount;
    
    if (quantity < quadraticBegin) {
      unroundedGalaxyAmount = quantity;
    } else {
      // Cost is x + ((x - quadraticBegin) ** 2 + x - quadraticBegin) / linearTerm =
      // x + x ** 2 / linearTerm - 2 * x * quadraticBegin / linearTerm + quadraticBegin ** 2 / linearTerm +
      // x / linearTerm - quadraticBegin / linearTerm = (1 / linearTerm) * x ** 2 +
      // (1 + (-2 * quadraticBegin + 1) / linearTerm) * x + (quadraticBegin ** 2 - quadraticBegin) / linearTerm.
      let quadraticCoefficient = 1 / linearTerm;
      let linearCoefficient = 1 + (-2 * quadraticBegin + 1) / linearTerm;
      let constantCoefficient = (Math.pow(quadraticBegin, 2) - quadraticBegin) / linearTerm - quantity;
      unroundedGalaxyAmount = (-linearCoefficient + Math.sqrt(
        Math.pow(linearCoefficient, 2) - 4 * quadraticCoefficient * constantCoefficient)) / (2 * quadraticCoefficient);
    }
    
    let galaxyAmount = Math.round(unroundedGalaxyAmount);
    
    if (this.requirementAt(galaxyAmount).amount > currency) {
      galaxyAmount -= 1;
    }
    
    if (galaxyAmount >= 800 && !RealityUpgrade(21).isBought) {
      // We haven't considered remote scaling, give up and do binary search.
      const bulk = bulkBuyBinarySearch(new Decimal(currency), {
        costFunction: x => this.requirementAt(x).amount,
        cumulative: false,
      }, 800);
      if (!bulk) throw new Error("Unexpected failure to calculate galaxy purchase");
      // The formula we are using is the formula for the price of the *next* galaxy, given
      // a quantity. So we add 1 when we return
      return 800 + bulk.quantity;
    }
    
    return galaxyAmount + 1;
  }

  static requirementAt(galaxies) {
    let amount = Galaxy.baseCost + (galaxies * Galaxy.costMult);

    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT && EternityChallenge(5).isRunning) {
      amount += Math.pow(galaxies, 2) + galaxies;
    } else if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      amount += Math.pow((galaxies) - (galaxyCostScalingStart - 1), 2) + (galaxies) - (galaxyCostScalingStart - 1);
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount = amount * Math.pow(1.002, galaxies - 800);
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;
    
    if (GlyphAlteration.isAdded("power")) amount = amount * getSecondaryGlyphEffect("powerpow");
    
    amount = Math.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    return Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42));
  }

  static get baseCost() {
    return NormalChallenge(10).isRunning ? 99 : 80;
  }

  static get requiredTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get canBeBought() {
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    return player.break || player.antimatter.lt(Decimal.NUMBER_MAX_VALUE);
  }

  static get costScalingStart() {
    return (100 + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
      GlyphSacrifice.power
    )) * TriadStudy(2).effectOrDefault(1);
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies >= 800 && !RealityUpgrade(21).isBought) {
      return GALAXY_TYPE.REMOTE;
    }
    if (EternityChallenge(5).isRunning || galaxies >= this.costScalingStart) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  }
}

function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies++;
  player.dimensionBoosts = 0;
  softReset(0);
  if (Notations.current === Notation.cancer) player.spreadingCancer += 1;
  player.noSacrifices = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

function requestGalaxyReset(bulk, limit = Number.MAX_VALUE) {
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) return maxBuyGalaxies(limit);
  if (player.galaxies >= limit || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  galaxyReset();
  return true;
}

function maxBuyGalaxies(limit = Number.MAX_VALUE) {
  if (player.galaxies >= limit || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const newGalaxies = Math.min(limit, Galaxy.buyableGalaxies(Math.round(NormalDimension(req.tier).amount.toNumber())));
  if (Notations.current === Notation.cancer) player.spreadingCancer += newGalaxies - player.galaxies;
  // galaxyReset increments galaxies, so we add one less than we should:
  player.galaxies = newGalaxies - 1;
  galaxyReset();
  return true;
}

"use strict";

const GalaxyType = {
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

    let quantity = Math.floor((currency - constantTerm + finalOffset) / linearTerm);
    if (quantity < quadraticBegin) {
      // Check the seemingly impossible case of going directly to remote scaling, somehow:
      if (quantity >= 800 && !RealityUpgrade(21).isBought) {
        const bulk = bulkBuyBinarySearch(new Decimal(currency), {
          costFunction: x => Math.floor((x * linearTerm + constantTerm) * Math.pow(1.002, x - 800)) - finalOffset,
          cumulative: false,
        }, 800);
        if (!bulk) throw crash("Unexpected failure to calculate galaxy purchase");
        // The formula we are using is the formula for the price of the *next* galaxy, given
        // a quantity. So we add 1 when we return
        return bulk.quantity + 800 + 1;
      }
      return quantity + 1;
    }
    constantTerm += quadraticBegin * (quadraticBegin - 1);
    linearTerm += 1 - 2 * quadraticBegin;
    const quadSol = 0.5 * (-linearTerm + Math.sqrt(Math.pow(linearTerm, 2) - 4 * (constantTerm - currency - finalOffset)));
    // There might be a small rounding error, and if we use floor, we might underestimate the quantity.
    // Instead, we use round, then check if the resulting price is too high, and go down one if need be.
    quantity = Math.round(quadSol);
    let price = Math.pow(quantity, 2) + linearTerm * quantity + constantTerm - finalOffset;
    if (price > currency) {
      quantity--;
      price = Math.pow(quantity, 2) + linearTerm * quantity + constantTerm - finalOffset;
    }
    // Check for remote scaling
    if (quantity >= 800 && !RealityUpgrade(21).isBought) {
      const bulk = bulkBuyBinarySearch(new Decimal(currency), {
        costFunction: x => Math.floor((x * x + x * linearTerm + constantTerm) * Math.pow(1.002, x - 800)) - finalOffset,
        cumulative: false,
      }, 800);
      if (!bulk) throw crash("Unexpected failure to calculate galaxy purchase");
      return bulk.quantity + 800 + 1;
    }
    return quantity + 1;
  }

  static requirementAt(galaxies) {
    let amount = Galaxy.baseCost + (galaxies * Galaxy.costMult);

    const type = Galaxy.typeAt(galaxies);

    if (type === GalaxyType.DISTANT && EternityChallenge(5).isRunning) {
      amount += Math.pow(galaxies, 2) + galaxies;
    } else if (type === GalaxyType.DISTANT || type === GalaxyType.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      amount += Math.pow((galaxies) - (galaxyCostScalingStart - 1), 2) + (galaxies) - (galaxyCostScalingStart - 1);
    }

    if (type === GalaxyType.REMOTE) {
      amount = Math.floor(amount * Math.pow(1.002, galaxies - 800));
    }

    amount -= Effects.sum(InfinityUpgrade.resetBoost);
    if (InfinityChallenge(5).isCompleted) amount -= 1;
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    return NormalChallenge(10).isRunning ? 90 : Effects.min(60, TimeStudy(42));
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
    return player.break || player.antimatter.lt(Decimal.MAX_NUMBER);
  }

  static get costScalingStart() {
    return 100 + Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
      GlyphSacrifice.power
    );
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies >= 800 && !RealityUpgrade(21).isBought) {
      return GalaxyType.REMOTE;
    }
    if (EternityChallenge(5).isRunning || galaxies >= this.costScalingStart) {
      return GalaxyType.DISTANT;
    }
    return GalaxyType.NORMAL;
  }
}

function galaxyReset() {
  EventHub.dispatch(GameEvent.GALAXY_RESET_BEFORE);
  player.galaxies++;
  player.tickDecrease -= 0.03;
  player.resets = 0;
  softReset(0);
  if (Notation.current === Notation.cancer) player.spreadingCancer += 1;
  player.noSacrifices = true;
  EventHub.dispatch(GameEvent.GALAXY_RESET_AFTER);
}

function galaxyResetBtnClick() {
  if (player.eternities >= 7 && !shiftDown) return maxBuyGalaxies(true);
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  galaxyReset();
  return true;
}

function maxBuyGalaxies(manual) {
  const limit = !manual && Autobuyer.galaxy.limitGalaxies ? Autobuyer.galaxy.maxGalaxies : Number.MAX_VALUE;
  if (player.galaxies >= limit || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const newGalaxies = Math.min(limit, Galaxy.buyableGalaxies(Math.round(NormalDimension(req.tier).amount.toNumber())));
  if (Notation.current === Notation.cancer) player.spreadingCancer += newGalaxies - player.galaxies;
  // galaxyReset increments galaxies, so we add one less than we should:
  player.galaxies = newGalaxies - 1;
  galaxyReset();
  return true;
}

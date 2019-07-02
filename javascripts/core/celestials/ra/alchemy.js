"use strict";

class AlchemyResourceState extends GameMechanicState {
  get name() {
    return this.config.name;
  }

  get symbol() {
    return this.config.symbol;
  }

  get isBaseResource() {
    return this.config.isBaseResource === true;
  }

  get formattedEffect() {
    return this.config.formatEffect(this.effectValue);
  }

  get amount() {
    return player.celestials.ra.alchemy[this.id];
  }

  set amount(value) {
    player.celestials.ra.alchemy[this.id] = value;
  }

  // Base decay for now, will add player-controllable stuff later
  get decayRate() {
    return AlchemyResource.decoherence.effectValue;
  }

  get reactionText() {
    if (this.reaction === null) return "Base Resource";
    const isReality = this.reaction._product.id === ALCHEMY_RESOURCE.REALITY;
    const reagentStrings = [];
    for (const reagent of this.reaction._reagents) {
      reagentStrings.push(`${isReality ? "" : reagent.cost}${reagent.resource.symbol}`);
    }
    const produced = `${Math.floor(100 * this.reaction.baseProduction * this.reaction.reactionEfficiency) / 100}`;
    return `${reagentStrings.join(" + ")} ➜ ${isReality ? "" : produced}${this.reaction._product.symbol}`;
  }

  get reaction() {
    return AlchemyReactions.all[this.id];
  }
}

// Note: Base reaction efficiency should be 30% (or something like that?)
class AlchemyReaction {
  constructor(product, reagents) {
    this._product = product;
    this._reagents = reagents;
  }

  // Returns a percentage of a reaction that can be done, accounting for limiting reagents and capping at 100%
  get reactionYield() {
    const totalYield = this._reagents
      .map(r => r.resource.amount / r.cost)
      .min();
      return Math.min(totalYield, 1);
  }

  get isReality() {
    return this._product.id === ALCHEMY_RESOURCE.REALITY;
  }

  // Reactions are per-10 products because that avoids decimals in the UI for reagents, but efficiency losses can make
  // products have decimal coefficients.
  get baseProduction() {
    return this.isReality ? 1 : 10;
  }

  get reactionEfficiency() {
    return this.isReality ? 1 : AlchemyResource.synergism.effectValue;
  }

  // Cap products at the minimum amount of all reagents before the reaction occurs, eg. 200Ξ and 350Ψ will not
  // bring ω above 200.  This only checks for reagent totals before the reaction and not after, so reagents being
  // used up during a reaction may make the cap appear to be slightly too generous.
  combineReagents() {
    const maxFromReaction = this.baseProduction * this.reactionYield * this.reactionEfficiency;
    const productCap = this._reagents
      .map(r => r.resource.amount)
      .min();
    const maxFromCap = Math.max(0, productCap - this._product.amount);
    const adjustedYield = maxFromReaction > maxFromCap
      ? this.reactionYield * (maxFromCap / maxFromReaction)
      : this.reactionYield;
    const reagentStrings = [];
    for (const reagent of this._reagents) {
      reagent.resource.amount -= adjustedYield * reagent.cost;
      reagentStrings.push(`${adjustedYield * reagent.cost}${reagent.resource.symbol}`);
    }
    this._product.amount += this.baseProduction * adjustedYield * this.reactionEfficiency;
    console.log(`${reagentStrings.join(" + ")} ➜ ` +
      `${this.baseProduction * adjustedYield * this.reactionEfficiency}${this._product.symbol}`);
  }
}

// The three arrays in the beginning are a declaration for a list of concentric circles with equally-spaced
// points along its circumference.  The number of points are effectively taken from the starting indices, as
// each circle will have the number of points equal to the difference between adjacent entries.
//    circleStart: id value to start a circle
//    circleRadii: radius of the circle
//    angleOffset: the first node is by default at the top; this array specifies where to put the first node
// All angles are in radians to avoid unnecessary factors in trig functions.
function getNodePlacement(id) {
  const circleStart = [0, 5, 10, 14, 20];
  const circleRadii = [4, 3, 2, 1, 0];
  const angleOffset = [0, Math.PI / 5, 0, 0, 0];

  const circleIndex = circleStart.filter(num => num <= id).length - 1;
  const numPointsInCircle = circleIndex === circleStart.length - 1
    ? 1
    : circleStart[circleIndex + 1] - circleStart[circleIndex];
  
  const radius = circleRadii[circleIndex];
  const angle = 2 * Math.PI * (id - circleStart[circleIndex]) / numPointsInCircle + angleOffset[circleIndex];

  const xOffset = 0;
  const yOffset = 0;
  return {
    x: radius * Math.sin(angle) + xOffset,
    y: radius * Math.cos(angle) + yOffset
  }
}

const AlchemyResource = (function() {
  function createResource(resource) {
    const config = GameDatabase.celestials.alchemy.resources[resource];
    config.id = resource;
    return new AlchemyResourceState(config);
  }

  return {
    power: createResource(ALCHEMY_RESOURCE.POWER),
    infinity: createResource(ALCHEMY_RESOURCE.INFINITY),
    time: createResource(ALCHEMY_RESOURCE.TIME),
    replication: createResource(ALCHEMY_RESOURCE.REPLICATION),
    dilation: createResource(ALCHEMY_RESOURCE.DILATION),
    cardinality: createResource(ALCHEMY_RESOURCE.CARDINALITY),
    eternity: createResource(ALCHEMY_RESOURCE.ETERNITY),
    dimensionality: createResource(ALCHEMY_RESOURCE.DIMENSIONALITY),
    inflation: createResource(ALCHEMY_RESOURCE.INFLATION),
    alternation: createResource(ALCHEMY_RESOURCE.ALTERNATION),
    effarig: createResource(ALCHEMY_RESOURCE.EFFARIG),
    synergism: createResource(ALCHEMY_RESOURCE.SYNERGISM),
    momentum: createResource(ALCHEMY_RESOURCE.MOMENTUM),
    decoherence: createResource(ALCHEMY_RESOURCE.DECOHERENCE),
    exponential: createResource(ALCHEMY_RESOURCE.EXPONENTIAL),
    force: createResource(ALCHEMY_RESOURCE.FORCE),
    uncountability: createResource(ALCHEMY_RESOURCE.UNCOUNTABILITY),
    boundless: createResource(ALCHEMY_RESOURCE.BOUNDLESS),
    multiversal: createResource(ALCHEMY_RESOURCE.MULTIVERSAL),
    unpredictability: createResource(ALCHEMY_RESOURCE.UNPREDICTABILITY),
    reality: createResource(ALCHEMY_RESOURCE.REALITY)
  };
}());

const AlchemyResources = {
  all: Object.values(AlchemyResource)
};

const AlchemyReactions = (function() {
  // For convenience and readability, stuff is named differently in GameDatabase
  function mapReagents(resource) {
    return resource.config.reagents
      .map(r => ({
        resource: AlchemyResources.all[r.resource],
        cost: r.amount
      }));
  }
  return {
    all: AlchemyResources.all
      .map(r => (r.isBaseResource ? null : new AlchemyReaction(r, mapReagents(r))))
  };
}());

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

  get data() {
    return player.celestials.ra.alchemy[this.id];
  }

  get amount() {
    return this.data.amount;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get canBeApplied() {
    return true;
  }

  get effectValue() {
    return this.config.effect(this.amount);
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

class AlchemyReaction {
  constructor(product, reagents) {
    this._product = product;
    this._reagents = reagents;
  }

  get product() {
    return this._product;
  }

  get reagents() {
    return this._reagents;
  }

  // Returns a percentage of a reaction that can be done, accounting for limiting reagents and capping at 100%
  get reactionYield() {
    const totalYield = this._reagents
      .map(r => r.resource.amount / r.cost)
      .min();
    return Math.min(totalYield, 1);
  }

  get isActive() {
    return this._product.data.reaction;
  }

  set isActive(value) {
    this._product.data.reaction = value;
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

  get production() {
    return Math.floor(100 * this.baseProduction * this.reactionEfficiency) / 100;
  }

  // Cap products at the minimum amount of all reagents before the reaction occurs, eg. 200Ξ and 350Ψ will not bring
  // ω above 200.  In fact, since some Ξ will be used during the reaction, the actual cap will be a bit lower.
  combineReagents() {
    if (!this.isActive || this.reactionYield === 0) return;

    // Assume a full reaction to see what the maximum possible product is
    const maxFromReaction = this.baseProduction * this.reactionYield * this.reactionEfficiency;
    const prodBefore = this._product.amount;
    const prodAfter = prodBefore + maxFromReaction;

    // Check each reagent for if a full reaction would drop it below the product amount.  If so, reduce reaction yield
    let cappedYield = this.reactionYield;
    for (const reagent of this._reagents) {
      const reagentBefore = reagent.resource.amount;
      const reagentAfter = reagent.resource.amount - this.reactionYield * reagent.cost;
      const diffBefore = reagentBefore - prodBefore;
      const diffAfter = reagentAfter - prodAfter;
      cappedYield = Math.min(cappedYield, this.reactionYield * diffBefore / (diffBefore - diffAfter));
    }

    // Perform the reaction with potentially reduced yield due to the cap
    for (const reagent of this._reagents) {
      reagent.resource.amount -= cappedYield * reagent.cost;
    }
    this._product.amount += this.baseProduction * cappedYield * this.reactionEfficiency;
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
  all: Object.values(AlchemyResource),
  base: Object.values(AlchemyResource).filter(r => r.isBaseResource)
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
    // TODO: `all` sould be the one that is `compact()`ed
    all: AlchemyResources.all
      .map(r => (r.isBaseResource ? null : new AlchemyReaction(r, mapReagents(r))))
  };
}());

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

  get before() {
    return this.config.before;
  }

  set before(value) {
    this.config.before = value;
  }

  get flow() {
    return this.config.flow;
  }

  set flow(value) {
    this.config.flow = value;
  }

  get isUnlocked() {
    return this.config.isUnlocked();
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    // Disable Exponential alchemy effect in V reality.
    if (V.isRunning && this.config.id === 14) return 0;
    return this.config.effect(this.amount);
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

  // Returns a percentage of a reaction that can be done, accounting for limiting reagents.  This normally caps at
  // 100%, but the reaction will be forced to occur at higher than 100% if there is significantly more reagent than
  // product. This allows resources to be created quickly when its reaction is initially turned on with saved reagents.
  get reactionYield() {
    if (!this._product.isUnlocked || this._reagents.some(r => !r.resource.isUnlocked)) return 0;
    const forcingFactor = (this._reagents
      .map(r => r.resource.amount)
      .min() - this._product.amount) / 100;
    const totalYield = this._reagents
      .map(r => r.resource.amount / r.cost)
      .min();
    return Math.min(totalYield, Math.max(forcingFactor, 1));
  }

  // Check each reagent for if a full reaction would drop it below the product amount.  If so, reduce reaction yield
  get actualYield() {
    // Assume a full reaction to see what the maximum possible product is
    const maxFromReaction = this.baseProduction * this.reactionYield * this.reactionEfficiency;
    const prodBefore = this._product.amount;
    const prodAfter = prodBefore + maxFromReaction;
    let cappedYield = this.reactionYield;
    for (const reagent of this._reagents) {
      const reagentBefore = reagent.resource.amount;
      const reagentAfter = reagent.resource.amount - this.reactionYield * reagent.cost;
      const diffBefore = reagentBefore - prodBefore;
      const diffAfter = reagentAfter - prodAfter;
      cappedYield = Math.min(cappedYield, this.reactionYield * diffBefore / (diffBefore - diffAfter));
    }
    return Math.clampMin(cappedYield, 0);
  }

  // Assign reactions priority in descending order based on the largest reagent total after the reaction.  The logic
  // is that if we assume that all the reactions are cap-limited, then by assigning priority in this way, reactions
  // get applied so that earlier reactions are less likely to reduce the yield of later reactions.
  get priority() {
    let maxReagent = Glyphs.levelCap;
    for (const reagent of this._reagents) {
      const afterReaction = reagent.resource.amount - reagent.cost * this.actualYield;
      maxReagent = Math.min(maxReagent, afterReaction);
    }
    return maxReagent;
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
    return this.isReality ? 1 : 5 * Effects.sum(GlyphSacrifice.reality);
  }

  get reactionEfficiency() {
    return this.isReality ? 1 : AlchemyResource.synergism.effectValue;
  }

  get reactionProduction() {
    return this.baseProduction * this.reactionEfficiency;
  }

  // Cap products at the minimum amount of all reagents before the reaction occurs, eg. 200Ξ and 350Ψ will not bring
  // ω above 200.  In fact, since some Ξ will be used during the reaction, the actual cap will be a bit lower.
  combineReagents() {
    if (!this.isActive || this.reactionYield === 0) return;
    const unpredictabilityEffect = AlchemyResource.unpredictability.effectValue;
    const times = 1 + poissonDistribution(unpredictabilityEffect / (1 - unpredictabilityEffect));
    for (let i = 0; i < times; i++) {
      const reactionYield = this.actualYield;
      for (const reagent of this._reagents) {
        reagent.resource.amount -= reactionYield * reagent.cost;
      }
      this._product.amount += reactionYield * this.reactionProduction;
      // Within a certain amount of the cap, just give the last bit for free so the cap is actually reached
      if (Ra.alchemyResourceCap - this._product.amount < 0.05) this._product.amount = Ra.alchemyResourceCap;
    }
  }
}

const AlchemyResource = (function() {
  function createResource(resource) {
    const config = GameDatabase.celestials.alchemy.resources[resource];
    config.id = resource;
    config.before = 0;
    config.flow = 0;
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

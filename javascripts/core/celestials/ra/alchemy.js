"use strict";

class AlchemyResource {
  get name() { throw NotImplementedCrash(); }
  get amount() { throw NotImplementedCrash(); }
  set amount(value) { throw NotImplementedCrash(); }
  get symbol() { throw NotImplementedCrash(); }
  get isBaseResource() { throw NotImplementedCrash(); }
  get boostFormula() { throw NotImplementedCrash(); }
  get boostText() { throw NotImplementedCrash(); }

  // Base decay for now, will add player-controllable stuff later
  get decayRate() {
    return Alchemy.resources.decoherence.boostFormula;
  }
}

// Note: Base reaction efficiency should be 30% (or something like that?)
class AlchemyReaction {
  get product() { throw NotImplementedCrash(); }
  get reagentCosts() { throw NotImplementedCrash(); }
  get reagentResources() { throw NotImplementedCrash(); }

  // Returns a percentage of a reaction that can be done, accounting for limiting reagents
  get reactionYield() {
    const numReagents = this.reagentCosts.length;
    let maxYield = 1;
    for (let i = 0; i < numReagents; i++) {
      maxYield = Math.min(maxYield, this.reagentResources[i].amount / this.reagentCosts[i]);
    }
    return maxYield;
  }

  // Reactions are per-10 products because that avoids decimals in the UI for reactions
  get baseProduction() {
    return 10;
  }

  get reactionEfficiency() {
    return Alchemy.resources.synergism.boostFormula;
  }

  // Cap products at the minimum amount of all reagents before the reaction occurs, eg. 200Ξ and 350Ψ will not
  // bring ω above 200.  This only checks for reagent totals before the reaction and not after, so reagents being
  // used up during a reaction may make the cap appear to be slightly too generous.
  combineReagents() {
    const maxFromReaction = this.baseProduction * this.reactionYield * this.reactionEfficiency;
    const productCap = this.reagentResources.reduce((min, res) => Math.min(min, res.amount), Number.MAX_VALUE);
    const maxFromCap = Math.max(0, productCap - this.product);
    const adjustedYield = maxFromReaction > maxFromCap
      ? this.reactionYield * (maxFromCap / maxFromReaction)
      : this.reactionYield;
    const numReagents = this.reagentCosts.length;
    for (let i = 0; i < numReagents; i++) {
      this.reagentResources[i].amount -= adjustedYield * this.reagentCosts[i];
    }
    this.product.amount += this.baseProduction * adjustedYield * this.reactionEfficiency;
  }
}

// Note: Inflation has a second parameter which is probably going to be constant
const Alchemy = {
  resources: {
    // T1 resources (Non-Effarig "base" resources)
    power: new class PowerAlchemyResource extends AlchemyResource {
      get name() { return "Power"; }
      get amount() { return player.celestials.ra.alchemy.power; }
      set amount(value) { player.celestials.ra.alchemy.power = value; }
      get symbol() { return "Ω"; }
      get isBaseResource() { return true; }
      get boostFormula() { return 1; }
      get boostText() { return `Normal dimensions ^${this.boostFormula.toFixed(4)}`; }
    }(),
    infinity: new class InfinityAlchemyResource extends AlchemyResource {
      get name() { return "Infinity"; }
      get amount() { return player.celestials.ra.alchemy.infinity; }
      set amount(value) { player.celestials.ra.alchemy.infinity = value; }
      get symbol() { return "∞"; }
      get isBaseResource() { return true; }
      get boostFormula() { return 1; }
      get boostText() { return `Infinity dimensions ^${this.boostFormula.toFixed(4)}`; }
    }(),
    time: new class TimeAlchemyResource extends AlchemyResource {
      get name() { return "Time"; }
      get amount() { return player.celestials.ra.alchemy.time; }
      set amount(value) { player.celestials.ra.alchemy.time = value; }
      get symbol() { return "Δ"; }
      get isBaseResource() { return true; }
      get boostFormula() { return 1; }
      get boostText() { return `Time dimensions ^${this.boostFormula.toFixed(4)}`; }
    }(),
    replication: new class ReplicationAlchemyResource extends AlchemyResource {
      get name() { return "Replication"; }
      get amount() { return player.celestials.ra.alchemy.replication; }
      set amount(value) { player.celestials.ra.alchemy.replication = value; }
      get symbol() { return "Ξ"; }
      get isBaseResource() { return true; }
      get boostFormula() { return new Decimal(1); }
      get boostText() { return `Replication speed ${formatX(this.boostFormula)}`; }
    }(),
    dilation: new class DilationAlchemyResource extends AlchemyResource {
      get name() { return "Dilation"; }
      get amount() { return player.celestials.ra.alchemy.dilation; }
      set amount(value) { player.celestials.ra.alchemy.dilation = value; }
      get symbol() { return "Ψ"; }
      get isBaseResource() { return true; }
      get boostFormula() { return new Decimal(1); }
      get boostText() { return `Dilated Time ${formatX(this.boostFormula)}`; }
    }(),

    // T2 resources (combinations of pairs of T1 resources)
    cardinality: new class CardinalityAlchemyResource extends AlchemyResource {
      get name() { return "Cardinality"; }
      get amount() { return player.celestials.ra.alchemy.cardinality; }
      set amount(value) { player.celestials.ra.alchemy.cardinality = value; }
      get symbol() { return "α"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return `Uncapped replicanti slowdown ${formatX(1.2)} ➜ ` +
          `${formatX(this.boostFormula)} per ${shorten(Number.MAX_VALUE)}`;
      }
    }(),
    eternity: new class EternityAlchemyResource extends AlchemyResource {
      get name() { return "Eternity"; }
      get amount() { return player.celestials.ra.alchemy.eternity; }
      set amount(value) { player.celestials.ra.alchemy.eternity = value; }
      get symbol() { return "τ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Eternitied stat gain ^${formatX(this.boostFormula)}`; }
    }(),
    dimensionality: new class DimensionalityAlchemyResource extends AlchemyResource {
      get name() { return "Dimensionality"; }
      get amount() { return player.celestials.ra.alchemy.dimensionality; }
      set amount(value) { player.celestials.ra.alchemy.dimensionality = value; }
      get symbol() { return "ρ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return new Decimal(1); }
      get boostText() { return `All dimensions ${formatX(this.boostFormula)}`; }
    }(),
    inflation: new class InflationAlchemyResource extends AlchemyResource {
      get name() { return "Inflation"; }
      get amount() { return player.celestials.ra.alchemy.inflation; }
      set amount(value) { player.celestials.ra.alchemy.inflation = value; }
      get symbol() { return "λ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return new Decimal(1); }
      get boostText() { return `^1.002 for multipliers above ${shorten(this.boostFormula)}`; }
    }(),
    alternation: new class AlternationAlchemyResource extends AlchemyResource {
      get name() { return "Alternation"; }
      get amount() { return player.celestials.ra.alchemy.alternation; }
      set amount(value) { player.celestials.ra.alchemy.alternation = value; }
      get symbol() { return "ω"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return `Dilation penalty reduced by ${formatPercents(this.boostFormula)} ` +
          `per ${shorten("1e1000000")} replicanti`;
        }
    }(),

    // T3 resources (Effarig and conbinations of T1/T2 with Effarig)
    effarig: new class EffarigAlchemyResource extends AlchemyResource {
      get name() { return "Effarig"; }
      get amount() { return player.celestials.ra.alchemy.effarig; }
      set amount(value) { player.celestials.ra.alchemy.effarig = value; }
      get symbol() { return "Ϙ"; }
      get isBaseResource() { return true; }
      get boostFormula() { return new Decimal(1); }
      get boostText() { return `Relic Shards ${formatX(this.boostFormula)}`; }
    }(),
    synergism: new class SynergismAlchemyResource extends AlchemyResource {
      get name() { return "Synergism"; }
      get amount() { return player.celestials.ra.alchemy.synergism; }
      set amount(value) { player.celestials.ra.alchemy.synergism = value; }
      get symbol() { return "π"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Alchemy reaction efficiency 30% ➜ ${formatPercents(this.boostFormula)}`; }
    }(),
    momentum: new class MomentumAlchemyResource extends AlchemyResource {
      get name() { return "Momentum"; }
      get amount() { return player.celestials.ra.alchemy.momentum; }
      set amount(value) { player.celestials.ra.alchemy.momentum = value; }
      get symbol() { return "μ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return `Game speed ${formatX(this.boostFormula)} for every real-time minute ` +
          "spent in your current reality";
        }
    }(),
    decoherence: new class DecoherenceAlchemyResource extends AlchemyResource {
      get name() { return "Decoherence"; }
      get amount() { return player.celestials.ra.alchemy.decoherence; }
      set amount(value) { player.celestials.ra.alchemy.decoherence = value; }
      get symbol() { return "ξ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Alchemy decay reduced by ${formatPercents(this.boostFormula)}`; }
    }(),

    // T4 resources (resources which feed directly into the final resource)
    exponential: new class ExponentialAlchemyResource extends AlchemyResource {
      get name() { return "Exponential"; }
      get amount() { return player.celestials.ra.alchemy.exponential; }
      set amount(value) { player.celestials.ra.alchemy.exponential = value; }
      get symbol() { return "Γ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `IP gain multiplied by replicanti^${formatPercents(this.boostFormula)}`; }
    }(),
    force: new class ForceAlchemyResource extends AlchemyResource {
      get name() { return "Force"; }
      get amount() { return player.celestials.ra.alchemy.force; }
      set amount(value) { player.celestials.ra.alchemy.force = value; }
      get symbol() { return "ξ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Multiply normal dimensions by RM^${shorten(this.boostFormula)}`; }
    }(),
    uncountability: new class UncountabilityAlchemyResource extends AlchemyResource {
      get name() { return "Uncountability"; }
      get amount() { return player.celestials.ra.alchemy.uncountability; }
      set amount(value) { player.celestials.ra.alchemy.uncountability = value; }
      get symbol() { return "Θ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Generate ${shorten(this.boostFormula)} realities and perk points per second`; }
    }(),
    boundless: new class BoundlessAlchemyResource extends AlchemyResource {
      get name() { return "Boundless"; }
      get amount() { return player.celestials.ra.alchemy.boundless; }
      set amount(value) { player.celestials.ra.alchemy.boundless = value; }
      get symbol() { return "Π"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() { return `Glyph level cap increased by ${shortenSmallInteger(this.boostFormula)}`; }
    }(),
    multiversal: new class MultiversalAlchemyResource extends AlchemyResource {
      get name() { return "Multiversal"; }
      get amount() { return player.celestials.ra.alchemy.multiversal; }
      set amount(value) { player.celestials.ra.alchemy.multiversal = value; }
      get symbol() { return "Σ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return `Each reality simulates ${shortenSmallInteger(this.boostFormula)} additional realities`;
      }
    }(),
    unpredictability: new class UnpredictabilityAlchemyResource extends AlchemyResource {
      get name() { return "Unpredictability"; }
      get amount() { return player.celestials.ra.alchemy.unpredictability; }
      set amount(value) { player.celestials.ra.alchemy.unpredictability = value; }
      get symbol() { return "Λ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return Ra.has(RA_UNLOCKS.LAITELA_UNLOCK)
          ? "?????"
          : `Boost matter dimension generation chance by +${formatPercents(this.boostFormula)}`;
      }
    }(),

    // T5 (Reality)
    reality: new class RealityAlchemyResource extends AlchemyResource {
      get name() { return "Reality"; }
      get amount() { return player.celestials.ra.alchemy.reality; }
      set amount(value) { player.celestials.ra.alchemy.reality = value; }
      get symbol() { return "Ϟ"; }
      get isBaseResource() { return false; }
      get boostFormula() { return 1; }
      get boostText() {
        return `Can be used to create a level ${shortenSmallInteger(this.boostFormula)} Reality glyph`;
      }
    }()
  },

  reactions: {
    // T2 reactions
    cardinality: new class CardinalityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.cardinality; }
      get reagentCosts() { return [8, 7]; }
      get reagentResources() { return [Alchemy.resources.time, Alchemy.resources.replication]; }
    }(),
    eternity: new class EternityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.eternity; }
      get reagentCosts() { return [11, 4]; }
      get reagentResources() { return [Alchemy.resources.time, Alchemy.resources.infinity]; }
    }(),
    dimensionality: new class DimensionalityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.dimensionality; }
      get reagentCosts() { return [10, 5]; }
      get reagentResources() { return [Alchemy.resources.power, Alchemy.resources.infinity]; }
    }(),
    inflation: new class InflationAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.inflation; }
      get reagentCosts() { return [9, 6]; }
      get reagentResources() { return [Alchemy.resources.power, Alchemy.resources.dilation]; }
    }(),
    alternation: new class AlternationAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.alternation; }
      get reagentCosts() { return [5, 10]; }
      get reagentResources() { return [Alchemy.resources.replication, Alchemy.resources.dilation]; }
    }(),

    // T3 reactions
    synergism: new class SynergismAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.synergism; }
      get reagentCosts() { return [3, 16, 14]; }
      get reagentResources() {
        return [Alchemy.resources.effarig, Alchemy.resources.replication, Alchemy.resources.infinity];
      }
    }(),
    momentum: new class MomentumAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.momentum; }
      get reagentCosts() { return [11, 4, 20]; }
      get reagentResources() {
        return [Alchemy.resources.effarig, Alchemy.resources.power, Alchemy.resources.time];
      }
    }(),
    decoherence: new class DecoherenceAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.decoherence; }
      get reagentCosts() { return [13, 8]; }
      get reagentResources() { return [Alchemy.resources.effarig, Alchemy.resources.alternation]; }
    }(),

    // T4 reactions
    exponential: new class ExponentialAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.exponential; }
      get reagentCosts() { return [18, 3]; }
      get reagentResources() { return [Alchemy.resources.inflation, Alchemy.resources.synergism]; }
    }(),
    force: new class ForceAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.force; }
      get reagentCosts() { return [7, 8]; }
      get reagentResources() { return [Alchemy.resources.dimensionality, Alchemy.resources.momentum]; }
    }(),
    uncountability: new class UncountabilityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.uncountability; }
      get reagentCosts() { return [20, 6, 16]; }
      get reagentResources() {
        return [Alchemy.resources.infinity, Alchemy.resources.effarig, Alchemy.resources.cardinality];
      }
    }(),
    boundless: new class BoundlessAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.boundless; }
      get reagentCosts() { return [13, 18]; }
      get reagentResources() { return [Alchemy.resources.eternity, Alchemy.resources.inflation]; }
    }(),
    multiversal: new class MultiversalAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.multiversal; }
      get reagentCosts() { return [16, 3]; }
      get reagentResources() { return [Alchemy.resources.alternation, Alchemy.resources.decoherence]; }
    }(),
    unpredictability: new class UnpredictabilityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.unpredictability; }
      get reagentCosts() { return [15, 3, 10]; }
      get reagentResources() {
        return [Alchemy.resources.effarig, Alchemy.resources.decoherence, Alchemy.resources.synergism];
      }
    }(),

    // T5 reaction
    reality: new class RealityAlchemyReaction extends AlchemyReaction {
      get product() { return Alchemy.resources.reality; }
      get reagentCosts() { return [1, 1, 1, 1, 1, 1]; }
      get reagentResources() {
        return [Alchemy.resources.exponential, Alchemy.resources.force, Alchemy.resources.uncountability,
          Alchemy.resources.boundless, Alchemy.resources.multiversal, Alchemy.resources.unpredictability];
      }

      get baseProduction() { return 1; }
      get reactionEfficiency() { return 1; }
    }(),
  }
};

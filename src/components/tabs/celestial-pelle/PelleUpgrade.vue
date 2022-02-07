<script>
import CostDisplay from "../../CostDisplay.vue";
import DescriptionDisplay from "../../DescriptionDisplay.vue";

export default {
  name: "PelleUpgrade",
  components: {
    DescriptionDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    faded: {
      type: Boolean,
      required: false
    },
    galaxyGenerator: {
      type: Boolean,
      required: false,
    },
    showImprovedEstimate: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      canBuy: false,
      isBought: false,
      purchases: 0,
      currentTimeEstimate: new Decimal(0),
      projectedTimeEstimate: new Decimal(0),
      isCapped: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    effect() {
      if (!this.config.formatEffect) return false;
      return this.config.formatEffect(this.purchases);
    },
    timeEstimate() {
      if (this.canBuy ||
        this.isBought ||
        Pelle.realityShardGainPerSecond.eq(0) ||
        this.isCapped ||
        this.galaxyGenerator
      ) return null;
      return this.currentTimeEstimate;
    },
    estimateImprovement() {
      // If the improved value is still "> 1 year" then we only show it once
      if (this.projectedTimeEstimate.startsWith(">")) return this.projectedTimeEstimate;
      return `${this.currentTimeEstimate} ➜ ${this.projectedTimeEstimate}`;
    }
  },
  methods: {
    update() {
      this.canBuy = this.upgrade.canBeBought && !this.faded;
      this.isBought = this.upgrade.isBought;
      this.isCapped = this.upgrade.isCapped;
      this.purchases = player.celestials.pelle.rebuyables[this.upgrade.config.id];
      this.currentTimeEstimate = TimeSpan
        .fromSeconds(this.secondsUntilCost(Pelle.realityShardGainPerSecond).toNumber())
        .toTimeEstimate();
      this.projectedTimeEstimate = TimeSpan
        .fromSeconds(this.secondsUntilCost(Pelle.nextRealityShardGain).toNumber())
        .toTimeEstimate();
    },
    secondsUntilCost(rate) {
      return Decimal.sub(this.upgrade.cost, Currency.realityShards.value).div(rate);
    },
  }
};
</script>

<template>
  <button
    class="c-pelle-upgrade"
    :class="{
      'c-pelle-upgrade--unavailable': !canBuy,
      'c-pelle-upgrade--bought': isBought || isCapped,
      'c-pelle-upgrade--faded': faded,
      'c-pelle-upgrade--galaxyGenerator': galaxyGenerator
    }"
    :ach-tooltip="timeEstimate"
    @click="!faded && upgrade.purchase()"
  >
    <div
      v-if="showImprovedEstimate"
      class="c-pelle-upgrade-time-tooltip"
    >
      {{ estimateImprovement }}
    </div>
    <DescriptionDisplay :config="config" /><br><br>
    <span v-if="effect">Currently: {{ effect }}<br></span>
    <CostDisplay
      v-if="!isCapped"
      :config="config"
      :name="galaxyGenerator ? config.currencyLabel : 'Reality Shard'"
      br
    />
  </button>
</template>

<style scoped>
  .c-pelle-upgrade {
    padding: 2rem;
    color: white;
    background: black;
    border: 1px solid var(--color-pelle-secondary);
    border-radius: .5rem;
    font-family: Typewriter;
    cursor: pointer;
    width: 25rem;
    height: 15rem;
    margin: 1rem;
    font-size: 1.1rem;
  }

  .c-pelle-upgrade:hover {
    box-shadow: 1px 1px 5px var(--color-pelle-secondary);
    transition-duration: 0.12s;
  }


  .c-pelle-upgrade--galaxyGenerator {
    background: linear-gradient(var(--color-pelle-secondary), var(--color-pelle--base));
    color: black;
    font-weight: bold;
  }

  .c-pelle-upgrade--unavailable {
    background: #565656;
    cursor: default;
  }

  .c-pelle-upgrade--faded {
    opacity: 0.3;
    cursor: default;
  }

  .c-pelle-upgrade--bought {
    background: var(--color-pelle-secondary);
    cursor: default;
    color: black;
  }

  .c-pelle-upgrade-time-tooltip {
    position: absolute;
    visibility: visible;
    bottom: 100%;
    left: 50%;
    margin-bottom: 0.5rem;
    margin-left: -8.5rem;
    padding: 0.7rem;
    width: 16rem;
    border-radius: 0.3rem;
    background-color: hsla(0, 0%, 5%, 0.9);
    color: #fff;
    content: attr(ach-tooltip);
    text-align: center;
    font-size: 1.4rem;
    line-height: 1.2;
    transition-duration: 0.4s;
    z-index: 3;
  }
</style>

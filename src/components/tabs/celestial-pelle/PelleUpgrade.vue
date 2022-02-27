<script>
import CostDisplay from "../../CostDisplay";
import DescriptionDisplay from "../../DescriptionDisplay";

export default {
  name: "PelleUpgrade",
  components: {
    DescriptionDisplay,
    CostDisplay,
    Gap: {
      props: {
        height: {
          type: String,
          default: "0.7rem"
        }
      },
      template: `<div :style="{
        height,
        flexShrink: 0
      }" />`
    }
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
      isCapped: false,
      hovering: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    effectText() {
      if (!this.config.formatEffect) return "";
      const prefix = this.isCapped ? "Capped:" : "Currently:";
      const formattedEffect = x => this.config._formatEffect(this.config._effect(x));
      let value = formattedEffect(this.purchases);
      if (!this.isCapped && this.hovering && this.canBuy) {
        value = `<b><i style="color: #2f4;">${formattedEffect(this.purchases)}
        ➜ ${formattedEffect(this.purchases + 1)}</i></b>`;
      }
      return `${prefix} ${value}`;
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
      if (this.canBuy ||
        this.isBought ||
        Pelle.realityShardGainPerSecond.eq(0) ||
        this.isCapped ||
        this.galaxyGenerator
      ) return "";
      if (!Pelle.canArmageddon) return `${this.currentTimeEstimate}`;
      // If the improved value is still "> 1 year" then we only show it once
      if (this.projectedTimeEstimate.startsWith(">")) return this.projectedTimeEstimate;
      return `${this.currentTimeEstimate} ➜ ${this.projectedTimeEstimate}`;
    },
    estimateImprovementTooltipStyle() {
      return {
        visibility: this.showImprovedEstimate ? "visible" : "hidden",
        opacity: this.showImprovedEstimate ? 1 : 0
      };
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
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      :style="estimateImprovementTooltipStyle"
      class="c-pelle-upgrade-time-tooltip"
    >
      {{ estimateImprovement }}
    </div>
    <DescriptionDisplay :config="config" />
    <Gap />
    <div v-if="effectText">
      <span v-html="effectText" />
      <Gap />
    </div>
    <CostDisplay
      v-if="!isCapped"
      :config="config"
      :name="galaxyGenerator ? config.currencyLabel : 'Reality Shard'"
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
    width: 20rem;
    height: 12rem;
    margin: 1rem;
    font-size: 1rem;
    box-shadow: inset 0px 0px 10px 1px var(--color-pelle-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .c-pelle-upgrade:hover {
    box-shadow: inset 0px 0px 20px 1px var(--color-pelle-secondary);
    transition-duration: 0.3s;
  }


  .c-pelle-upgrade--galaxyGenerator {
    background: linear-gradient(var(--color-pelle-secondary), var(--color-pelle--base));
    color: black;
    font-weight: bold;
    box-shadow: none;
  }

  .c-pelle-upgrade--unavailable {
    background: #565656;
    cursor: default;
    box-shadow: none;
  }

  .c-pelle-upgrade--faded {
    opacity: 0.3;
    cursor: default;
    box-shadow: none;
  }

  .c-pelle-upgrade--bought {
    background: var(--color-pelle-secondary);
    cursor: default;
    color: black;
  }
  .c-pelle-upgrade--galaxyGenerator:hover, .c-pelle-upgrade--unavailable:hover,
  .c-pelle-upgrade--faded:hover, .c-pelle-upgrade--bought:hover {
    box-shadow: 1px 1px 5px var(--color-pelle-secondary);
    transition-duration: 0.3s;
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

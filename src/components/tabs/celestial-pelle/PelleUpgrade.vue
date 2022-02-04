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

<script>
import CostDisplay from "../../CostDisplay.vue";
import DescriptionDisplay from "../../DescriptionDisplay.vue";
export default {
  components: {
    DescriptionDisplay,
    CostDisplay
  },
  props: {
    upgrade: Object,
    faded: Boolean,
    galaxyGenerator: Boolean
  },
  data() {
    return {
      canBuy: false,
      isBought: false,
      purchases: 0,
      timeUntilCost: new Decimal(0),
      isCapped: false
    };
  },
  methods: {
    update() {
      this.canBuy = this.upgrade.canBeBought && !this.faded;
      this.isBought = this.upgrade.isBought;
      this.isCapped = this.upgrade.isCapped;
      this.purchases = player.celestials.pelle.rebuyables[this.upgrade.config.id];
      this.timeUntilCost = Decimal.sub(this.upgrade.cost, Currency.realityShards.value)
        .div(Pelle.realityShardGainPerSecond);
    },
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
      if (this.timeUntilCost.lt(1)) return `< ${formatInt(1)} second`;
      if (this.timeUntilCost.gt(86400 * 365.25)) return `> ${formatInt(1)} year`;
      return TimeSpan.fromSeconds(this.timeUntilCost.toNumber()).toStringShort();
    }
  }
};
</script>

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

</style>
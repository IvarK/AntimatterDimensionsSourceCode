<template>
  <button
    class="c-pelle-upgrade"
    :class="{
      'c-pelle-upgrade--unavailable': !canBuy,
      'c-pelle-upgrade--bought': isBought,
      'c-pelle-upgrade--faded': faded
    }"
    @click="!faded && upgrade.purchase()"
  >
    <DescriptionDisplay :config="config" /><br><br>
    <span v-if="effect">Currently: {{ effect }}<br></span>
    <CostDisplay
      :config="config"
      name="Reality Shard"
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
  },
  data() {
    return {
      canBuy: false,
      isBought: false,
      purchases: 0
    };
  },
  methods: {
    update() {
      this.canBuy = this.upgrade.canBeBought && !faded;
      this.isBought = this.upgrade.isBought;
      this.purchases = player.celestials.pelle.rebuyables[this.upgrade.config.id];
    },
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    effect() {
      if (!this.config.formatEffect) return false;
      return this.config.formatEffect(this.purchases);
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
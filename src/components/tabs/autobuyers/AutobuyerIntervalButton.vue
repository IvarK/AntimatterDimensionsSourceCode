<script>
export default {
  name: "AutobuyerIntervalButton",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDoomed: false,
      cost: 0,
      isMaxed: false,
      isUnlocked: false
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
    upgradeInterval() {
      this.autobuyer.upgradeInterval();
    }
  }
};
</script>

<template>
  <button
    v-if="!isMaxed && isUnlocked"
    class="o-autobuyer-btn l-autobuyer-box__button"
    @click="upgradeInterval"
  >
    {{ formatPercents(0.4) }} smaller interval
    <br>
    Cost: {{ format(cost, 2, 0) }} IP
  </button>
  <button
    v-else-if="!isMaxed"
    class="o-autobuyer-btn l-autobuyer-box__button"
  >
    <span v-if="isDoomed">You cannot upgrade this Autobuyers interval yet</span>
    <span v-else>Complete the challenge to upgrade interval</span>
  </button>
</template>

<style scoped>

</style>

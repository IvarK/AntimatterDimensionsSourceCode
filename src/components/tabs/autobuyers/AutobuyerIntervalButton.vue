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
      cost: 0,
      isMaxed: false,
      isUnlocked: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-autobuyer-btn": true,
        "l-autobuyer-box__button": true,
        "o-non-clickable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
      this.isUnlocked = this.autobuyer.isUnlocked;
      this.isAffordable = Currency.infinityPoints.gte(this.cost);
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
    :class="classObject"
    @click="upgradeInterval"
  >
    {{ formatPercents(0.4) }} smaller interval
    <br>
    Cost: {{ format(cost, 2, 0) }} IP
  </button>
  <button
    v-else-if="!isMaxed"
    class="o-autobuyer-btn l-autobuyer-box__button o-non-clickable"
  >
    Complete the challenge to upgrade interval
  </button>
</template>

<style scoped>
.o-non-clickable {
  cursor: auto;
}
</style>

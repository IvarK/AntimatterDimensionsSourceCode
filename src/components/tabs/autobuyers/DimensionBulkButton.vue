<script>
export default {
  name: "DimensionBulkButton",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hasMaxedInterval: false,
      hasMaxedBulk: false,
      isUnlocked: false,
      bulkUnlimited: false,
      bulk: 1,
      cost: 1,
      isAffordable: false
    };
  },
  computed: {
    bulkDisplay() {
      if (this.hasMaxedBulk) {
        return `${formatX(this.bulk, 2, 0)} bulk buy (capped)`;
      }
      const newBulk = Math.min(this.bulk * 2, this.autobuyer.bulkCap);
      return `${formatX(this.bulk, 2, 0)} ➜ ${formatX(newBulk, 2, 0)} bulk buy`;
    },
    classObject() {
      return {
        "o-autobuyer-btn": true,
        "o-autobuyer-btn--unavailable": !this.isAffordable && !this.hasMaxedBulk,
        "o-non-clickable": this.hasMaxedBulk
      };
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.hasMaxedInterval = autobuyer.hasMaxedInterval;
      this.isUnlocked = autobuyer.isUnlocked;
      this.hasMaxedBulk = autobuyer.hasMaxedBulk;
      this.bulkUnlimited = autobuyer.hasUnlimitedBulk;
      this.bulk = autobuyer.bulk;
      this.cost = autobuyer.cost;
      this.isAffordable = Currency.infinityPoints.gte(this.cost);
    },
    upgradeBulk() {
      this.autobuyer.upgradeBulk();
    }
  }
};
</script>

<template>
  <button
    v-if="hasMaxedInterval && !bulkUnlimited && isUnlocked"
    :class="classObject"
    @click="upgradeBulk"
  >
    <span>{{ bulkDisplay }}</span>
    <template v-if="!hasMaxedBulk">
      <br>
      <span>Cost: {{ format(cost, 2, 0) }} IP</span>
    </template>
  </button>
  <button
    v-else-if="hasMaxedInterval && !bulkUnlimited"
    class="o-autobuyer-btn l-autobuyer-box__button o-autobuyer-btn--unavailable"
  >
    Complete the challenge to upgrade bulk
  </button>
</template>

<style scoped>
.o-non-clickable {
  cursor: auto;
}
</style>

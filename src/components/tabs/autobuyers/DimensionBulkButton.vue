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
      cost: 1
    };
  },
  computed: {
    bulkDisplay() {
      if (this.hasMaxedBulk) {
        return `${formatX(this.bulk, 2, 0)} bulk buy (capped)`;
      }
      let newBulk = this.bulk;
      newBulk = Math.min(newBulk * 2, this.autobuyer.bulkCap);
      return `${formatX(this.bulk, 2, 0)} ➜ ${formatX(newBulk, 2, 0)} bulk buy`;
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
    class="o-autobuyer-btn"
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
    class="o-autobuyer-btn l-autobuyer-box__button"
  >
    Complete the challenge to upgrade bulk
  </button>
</template>

<style scoped>

</style>

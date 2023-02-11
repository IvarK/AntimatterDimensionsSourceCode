<script>
// This component is used for every instance of interval/bulk display; uses passed-in values, only defaulting to
// autobuyer attributes if there isn't anything passed in
export default {
  name: "AutobuyerIntervalLabel",
  props: {
    autobuyer: {
      type: Object,
      required: false,
      default: null
    },
    intervalIn: {
      type: Number,
      required: false,
      default: null
    },
    bulkIn: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      interval: 0,
      bulk: 0,
      isShowingBulk: false,
    };
  },
  computed: {
    intervalText() {
      // We want to special-case auto-crunch because break infinity relies on getting its interval below 0.1s, which
      // may otherwise render as "Instant" with slow update rates
      if (this.interval < player.options.updateRate && this.autobuyer.name !== "Infinity") return "Instant";
      return `${format(TimeSpan.fromMilliseconds(this.interval).totalSeconds, 2, 2)} seconds`;
    },
    bulkText() {
      return `Current bulk: ${Number.isFinite(this.bulk) ? formatX(this.bulk, 2) : "Unlimited"}`;
    },
  },
  methods: {
    update() {
      const buyer = this.autobuyer;
      this.interval = (this.intervalIn || buyer?.interval) ?? 0;
      this.bulk = this.bulkIn ?? (buyer.hasUnlimitedBulk ? Infinity : buyer.bulk);
      this.isShowingBulk = this.bulk !== 0 && Number.isFinite(this.bulk);
    }
  }
};
</script>

<template>
  <div class="c-autobuyer-box__small-text">
    Current interval: {{ intervalText }}
    <span v-if="isShowingBulk">
      <br>
      {{ bulkText }}
    </span>
  </div>
</template>

<style scoped>

</style>

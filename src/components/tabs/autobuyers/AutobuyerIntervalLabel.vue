<script>
export default {
  name: "AutobuyerIntervalLabel",
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    showInterval: {
      type: Boolean,
      required: false,
      default: true
    },
    showBulk: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      interval: 0,
      bulk: 0,
      bulkUnlimited: false,
      displayInterval: false,
    };
  },
  computed: {
    // Rounds UP to the nearest 0.01 so that eg. 0.103 doesn't display as 0.10, appearing maxed when it isn't
    intervalDisplay() {
      const sec = TimeSpan.fromMilliseconds(this.interval).totalSeconds;
      return format(Math.ceil(100 * sec) / 100, 2, 2);
    },
    bulkText() {
      return `Current bulk: ${this.bulkUnlimited ? "Unlimited" : formatX(this.bulk, 2)}`;
    },
  },
  methods: {
    update() {
      const buyer = this.autobuyer;
      this.interval = buyer.interval;
      this.bulk = buyer.bulk;
      this.bulkUnlimited = buyer.hasUnlimitedBulk;
      // We should only be displaying the interval if the interval is greater than 0 and we are told to show it
      this.displayInterval = this.showInterval && this.interval > 0;
    }
  }
};
</script>

<template>
  <div
    v-if="displayInterval || showBulk"
    class="c-autobuyer-box__small-text"
  >
    <span v-if="displayInterval">
      Current interval: {{ intervalDisplay }} seconds
    </span>
    <span v-if="showBulk">
      <br v-if="displayInterval">
      {{ bulkText }}
    </span>
  </div>
</template>

<style scoped>

</style>

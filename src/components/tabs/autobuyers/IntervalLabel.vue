<script>
export default {
  name: "IntervalLabel",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      interval: 0,
      hasMaxedInterval: false,
      bulk: 0,
      bulkUnlimited: false,
    };
  },
  computed: {
    intervalDisplay() {
      const sec = TimeSpan.fromMilliseconds(this.interval).totalSeconds;
      const formatted = format(sec, 2, 2);
      // The concern here is that the Big Crunch autobuyer (or any other)
      // might seem to be capped but not actually be. We fix this by checking
      // if it appears capped (formatted === format(0.1, 2, 2))
      // but isn't (sec > 0.1), and if so we use 0.11 instead.
      // This doesn't work in e.g. Roman notation (formatting 0.11 still looks capped)
      // but showing something else in Roman notation would be very inaccurate.
      if (formatted === format(0.1, 2, 2) && sec > 0.1) {
        return format(0.11, 2, 2);
      }
      return formatted;
    }
  },
  methods: {
    update() {
      this.interval = this.autobuyer.interval;
      this.hasMaxedInterval = this.autobuyer.hasMaxedInterval;
      this.bulk = this.autobuyer.bulk;
      this.bulkUnlimited = this.autobuyer.hasUnlimitedBulk;
    }
  }
};
</script>

<template>
  <div class="c-autobuyer-box__small-text">
    Current interval: {{ intervalDisplay }} seconds
    <span v-if="hasMaxedInterval && bulk">
      <br>Current bulk: {{ bulkUnlimited ? "Unlimited" : formatX(bulk, 2) }}
    </span>
  </div>
</template>

<style scoped>

</style>

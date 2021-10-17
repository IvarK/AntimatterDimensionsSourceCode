"use strict";

Vue.component("autobuyer-interval-label", {
  props: {
    autobuyer: Object,
    showInterval: {
      type: Boolean,
      default: true,
    },
    showBulk: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      interval: 0,
      bulk: 0,
      bulkUnlimited: false,
      displayInterval: false,
      displayBulk: false,
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
      // We should only show the bulk if it is unlimited (to show "Unlimited"), or has a bulk amount, to show the bulk
      // amount. Additionally, it should only be shown if we are told to do so.
      this.displayBulk = this.showBulk && (this.bulkUnlimited || this.bulk > 0);
    }
  },
  template: `
    <div class="c-autobuyer-box__small-text" v-if="displayInterval || displayBulk">
      <span v-if="displayInterval">
        Current interval: {{ intervalDisplay }} seconds
      </span>
      <span v-if="displayBulk">
        <br v-if="displayInterval">
        {{ bulkText }}
      </span>
    </div>`
});

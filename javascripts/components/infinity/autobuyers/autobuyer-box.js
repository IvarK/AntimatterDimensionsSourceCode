"use strict";

Vue.component("autobuyer-box", {
  components: {
    "interval-label": {
      props: {
        autobuyer: Object
      },
      data() {
        return {
          interval: 0
        };
      },
      computed: {
        intervalDisplay() {
          let seconds = TimeSpan.fromMilliseconds(this.interval).totalSeconds;
          if (BreakInfinityUpgrade.autobuyerSpeed.isBought) {
            seconds /= 2;
          }
          return seconds.toFixed(2);
        }
      },
      methods: {
        update() {
          this.interval = this.autobuyer.interval;
        }
      },
      template:
        `<div class="c-autobuyer-box__small-text">Current interval: {{intervalDisplay}} seconds</div>`
    }
  },
  props: {
    setup: Object
  },
  data() {
    return {
      isUnlocked: false,
      isOn: false
    };
  },
  computed: {
    autobuyer() {
      return this.setup.autobuyer;
    },
    hasInterval() {
      return this.autobuyer.hasInterval;
    }
  },
  methods: {
    update() {
      if (this.setup === undefined) return;
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      if (!this.isUnlocked) return;
      this.isOn = autobuyer.isOn;
    },
    changeActive() {
      const newValue = !this.autobuyer.isOn;
      this.autobuyer.isOn = newValue;
      this.active = newValue;
    }
  },
  template:
    `<div v-if="isUnlocked" class="c-autobuyer-box l-autobuyer-box">
      <div>{{setup.name}}</div>
      <template v-if="hasInterval">
        <slot name="beforeInterval" />
        <interval-label :autobuyer="autobuyer"/>
      </template>
      <slot />
      <div class="o-autobuyer-toggle-checkbox" @click="changeActive">
        <span class="o-autobuyer-toggle-checkbox__label">Is active:</span>
        <input :checked="isOn" type="checkbox"/>
      </div>
    </div>`
});

class AutobuyerBoxSetup {
  /**
   * @param {string} name
   * @param {AutobuyerState|Autobuyer.eternity|Autobuyer.reality} autobuyer
   */
  constructor(name, autobuyer) {
    this.name = name;
    this.autobuyer = autobuyer;
  }
}

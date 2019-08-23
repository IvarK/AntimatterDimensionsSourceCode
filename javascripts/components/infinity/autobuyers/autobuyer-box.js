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
          return TimeSpan.fromMilliseconds(this.interval).totalSeconds.toFixed(2);
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
    autobuyer: Object,
    name: String,
    showInterval: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isUnlocked: false,
      isActive: false,
      globalToggle: false
    };
  },
  watch: {
    isActive(newValue) {
      this.autobuyer.isActive = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      this.isActive = autobuyer.isActive;
      this.globalToggle = player.options.autobuyersOn;
    },
    toggle() {
      if (!this.globalToggle) return;
      this.isActive = !this.isActive;
    }
  },
  template:
    `<div v-if="isUnlocked" class="c-autobuyer-box l-autobuyer-box">
      <div class="l-autobuyer-box__header">{{name}}</div>
      <slot name="beforeInterval" />
      <interval-label v-if="showInterval" :autobuyer="autobuyer"/>
      <div class="l-autobuyer-box__content">
        <slot />
      </div>
      <div class="o-autobuyer-toggle-checkbox l-autobuyer-box__footer" @click="toggle">
        <span class="o-autobuyer-toggle-checkbox__label">Is active:</span>
        <input
          :checked="isActive && globalToggle"
          :disabled="!globalToggle"
          type="checkbox"
        />
      </div>
    </div>`
});

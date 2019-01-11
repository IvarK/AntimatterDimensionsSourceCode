Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isAvailable: false,
      isBought: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": this.isBought,
        "o-infinity-upgrade-btn--available": !this.isBought && this.isAvailable,
        "o-infinity-upgrade-btn--unavailable": !this.isBought && !this.isAvailable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isMaxed;
      this.isAvailable = upgrade.isAvailable;
    },
  },
  template:
    `<button :class="classObject" @click="upgrade.purchase()">
      <description-display :config="config" />
      <effect-display br :config="config" />
      <cost-display br
        v-if="!isBought"
        :config="config"
        singular="IP"
        plural="IP"
      />
      <slot />
    </button>`
});
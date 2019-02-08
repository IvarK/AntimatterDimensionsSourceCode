Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      canBeBought: false,
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
        "o-infinity-upgrade-btn--available": !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isBought && !this.canBeBought
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isMaxed;
      this.canBeBought = upgrade.canBeBought;
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
Vue.component("eternity-upgrade-button", {
  props: {
    getUpgrade: Function
  },
  data() {
    return {
      isBought: false,
      isAffordable: false,
      effectValue: new Decimal(0)
    };
  },
  computed: {
    upgrade() {
      return this.getUpgrade();
    },
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--bought": this.isBought,
        "o-eternity-upgrade--available": !this.isBought && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable
      };
    },
    effectDisplay() {
      return this.config.formatEffect(this.effectValue);
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAffordable = upgrade.isAffordable;
      this.effectValue.copyFrom(new Decimal(upgrade.effectValue));
    }
  },
  template:
    `<button :class="classObject" @click="upgrade.purchase()">
      {{config.description}}
      <br>
      Currently: {{effectDisplay}}
      <template v-if="!isBought">
        <br>
        Cost: {{config.cost}} EP
      </template>
    </button>`
});
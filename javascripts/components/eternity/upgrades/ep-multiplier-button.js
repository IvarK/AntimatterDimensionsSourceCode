"use strict";

Vue.component("ep-multiplier-button", {
  data() {
    return {
      isAutobuyerOn: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(0),
      cost: new Decimal(0)
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      this.upgrade.autobuyer.isOn = newValue;
    }
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--available": this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      const autobuyer = upgrade.autobuyer;
      this.isAutoUnlocked = autobuyer.isUnlocked;
      this.isAutobuyerOn = autobuyer.isOn;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    },
  },
  template:
    `<div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()">
        Multiply Eternity Points from all sources by {{ formatX(5) }}
        <br>
        Currently: {{formatX(multiplier, 2, 0)}}
        <br>
        Cost: {{format(cost, 2, 0)}} EP
      </button>
      <primary-button
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        @click="upgrade.buyMax()"
      >Max EP mult</primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Autobuy EP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});

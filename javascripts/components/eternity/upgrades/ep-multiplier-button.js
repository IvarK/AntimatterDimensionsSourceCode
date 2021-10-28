"use strict";

Vue.component("ep-multiplier-button", {
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(0),
      cost: new Decimal(0)
    };
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.epMult.isActive = newValue;
    }
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    autobuyer() {
      return Autobuyer.epMult;
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
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutobuyerActive = this.autobuyer.isActive;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    },
  },
  template: `
    <div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()">
        Multiply Eternity Points from all sources by {{ formatX(5) }}
        <br>
        Currently: {{ formatX(multiplier, 2, 0) }}
        <br>
        Cost: {{ "Eternity Point" | quantify(cost, 2, 0) }}
      </button>
      <primary-button
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        @click="upgrade.buyMax()"
      >
        Max Eternity Point mult
      </primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerActive"
        text="Autobuy EP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});

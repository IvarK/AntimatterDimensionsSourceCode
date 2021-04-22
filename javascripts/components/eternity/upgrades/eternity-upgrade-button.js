"use strict";

Vue.component("eternity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isBought: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--bought": this.isBought,
        "o-eternity-upgrade--available": !this.isBought && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAffordable = upgrade.isAffordable;
    }
  },
  template:
    `<button :class="classObject" @click="upgrade.purchase()">
      <description-display :config="upgrade.config" />
      <effect-display br :config="upgrade.config" />
      <cost-display br
        v-if="!isBought"
        :config="upgrade.config"
        singular="Eternity Point"
        plural="Eternity Points"
      />
    </button>`
});
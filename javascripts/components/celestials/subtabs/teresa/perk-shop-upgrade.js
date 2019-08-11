"use strict";

Vue.component("perk-shop-upgrade", {
  props: {
    upgrade: Object
  },
  computed: {
    classObject() {
      return "o-teresa-shop-button";
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()">
        <description-display 
          :config="upgrade.config"
          :length="70"
          name="o-compression-upgrade__description"
        />
        <br>
        <effect-display :config="upgrade.config"
          v-if="upgrade.config.cost() !== 1" />
        <br>
        <cost-display
          v-if="upgrade.config.cost() < upgrade.config.cap()"
          :config="upgrade.config"
          singular="Perk point"
          plural="Perk points"
        />
      </button>
    </div>`
});
"use strict";

Vue.component("perk-shop-upgrade", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isAvailable: false,
    };
  },
  methods: {
    update() {
      this.isAvailable = this.upgrade.isAvailable;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <button class="o-teresa-shop-button" @click="upgrade.purchase()">
        <description-display 
          :config="upgrade.config"
          :length="70"
          name="o-compression-upgrade__description"
        />
        <br>
        <effect-display :config="upgrade.config" />
        <br>
        <cost-display
          v-if="isAvailable"
          :config="upgrade.config"
          singular="Perk point"
          plural="Perk points"
        />
      </button>
    </div>`
});
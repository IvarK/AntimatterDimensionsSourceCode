"use strict";

Vue.component("perk-shop-upgrade", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      cost: 0,
      cap: 0
    };
  },
  methods: {
    update() {
      this.cost = this.upgrade.config.cost();
      this.cap = this.upgrade.config.cap();
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
        <effect-display :config="upgrade.config"
          v-if="cost !== 1" />
        <br>
        <cost-display
          v-if="cost < cap"
          :config="upgrade.config"
          singular="Perk point"
          plural="Perk points"
        />
      </button>
    </div>`
});
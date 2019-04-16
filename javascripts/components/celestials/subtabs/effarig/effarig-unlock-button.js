"use strict";

Vue.component("effarig-unlock-button", {
  props: {
    unlock: Object
  },
  data: function() {
    return {
      isBought: false
    };
  },
  methods: {
    update() {
      this.isBought = this.unlock.isUnlocked;
    },
    purchase() {
      this.unlock.purchase();
    }
  },
  computed: {
    config() {
      return this.unlock.config;
    }
  },
  template: `
    <button
      class="o-effarig-shop-button"
      :class="{ 'effarig-unlock-bought': isBought }"
      @click="purchase"
    >
      <description-display :config="config"/>
      <cost-display
        v-if="!isBought"
        :config="config"
        singular="Relic Shard"
        title=""
      />
      <div v-else>
        (Unlocked)
      </div>
    </button>`
});
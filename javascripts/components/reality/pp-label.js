"use strict";

Vue.component("pp-label", {
  data() {
    return {
      pp: 0,
      fixedLoadPos: false,
    };
  },
  watch: {
    fixedLoadPos(newValue) {
      player.options.fixedPerkStartingPos = newValue;
    },
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.fixedLoadPos = player.options.fixedPerkStartingPos;
    }
  },
  template: `
    <div class="c-perk-tab__header">
      You have <span class="c-perk-tab__perk-points">{{ format(pp, 2, 0) }}</span> {{ "Perk Point" | pluralize(pp) }}.
      <br>
      Perk choices are permanent and cannot be respecced.
      <br>
      <primary-button-on-off
        v-model="fixedLoadPos"
        class="o-primary-btn"
        text="Lay out tree as untangled:"
      />
    </div>`
});

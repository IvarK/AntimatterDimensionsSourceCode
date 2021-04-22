"use strict";

Vue.component("pp-label", {
  data() {
    return {
      pp: 0
    };
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
    }
  },
  template: `
    <div class="c-perk-tab__header">
      You have <span class="c-perk-tab__perk-points">{{ format(pp, 2, 0) }}</span> {{"Perk Point" | pluralize(pp)}}.
    </div>
  `
});

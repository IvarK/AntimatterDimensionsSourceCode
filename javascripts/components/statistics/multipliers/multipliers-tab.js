"use strict";

Vue.component("multipliers-tab", {
  data() {
    return {
      id: EffectScopes.all.indexOf(EffectScopes.find("Antimatter Dimension 1 Multipliers"))
    };
  },
  template: `
    <multiplier-breakdown :id="id" />`
});

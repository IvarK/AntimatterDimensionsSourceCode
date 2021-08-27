"use strict";

Vue.component("multipliers-tab", {
  data() {
    return {
      id: EffectScopes.all.indexOf(EffectScopes.find("Antimatter Dimension 1 Multipliers"))
    };
  },
  template: `
    <div class="c-multiplier-tab">
      <multiplier-breakdown :id="id" />
    </div>
      `
});

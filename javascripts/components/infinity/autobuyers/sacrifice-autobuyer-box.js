"use strict";

Vue.component("sacrifice-autobuyer-box", {
  computed: {
    autobuyer: () => Autobuyer.sacrifice
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" name="Automatic Sacrifice">
      <template slot="intervalSlot">
        <span>Dimensional Sacrifice at X multiplier:</span>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="decimal"
          property="multiplier"
        />
      </template>
    </autobuyer-box>`
});

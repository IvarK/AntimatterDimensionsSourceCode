"use strict";

Vue.component("sacrifice-autobuyer-box", {
  computed: {
    autobuyer: () => Autobuyer.sacrifice
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Sacrifice">
      <div>
        <span>Sacrifice at X multiplier:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="float"
         property="multiplier"
        />
      </div>
    </autobuyer-box>`
});

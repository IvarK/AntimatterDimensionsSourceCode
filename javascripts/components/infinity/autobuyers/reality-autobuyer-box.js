"use strict";

Vue.component("reality-autobuyer-box", {
  computed: {
    autobuyer: () => Autobuyer.reality
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Reality">
      <div>
        <span>Target reality machines:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="decimal"
         property="rm"
        />
      </div>
      <div>
        <span>Target glyph level:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="int"
         property="glyph"
        />
      </div>
    </autobuyer-box>`
});

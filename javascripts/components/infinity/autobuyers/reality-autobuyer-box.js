"use strict";

Vue.component("reality-autobuyer-box", {
  data() {
    return {
      levelCap: 0,
      isOverCap: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.reality
  },
  methods: {
    update() {
      this.levelCap = glyphLevelCap();
      this.isOverCap = this.autobuyer.glyph > this.levelCap;
    }
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
      <div v-if="isOverCap">
        Autobuyer will trigger at the glyph level cap ({{shortenSmallInteger(levelCap)}}).
      </div>
    </autobuyer-box>`
});

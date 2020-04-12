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
      this.levelCap = Glyphs.levelCap;
      this.isOverCap = this.autobuyer.glyph > this.levelCap;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Reality">
      <template slot="intervalSlot">
        <div>Target reality machines:</div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="decimal"
         property="rm"
        />
      </template>
      <template slot="toggleSlot">
        <div>Target glyph level:</div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="int"
         property="glyph"
        />
        <div v-if="isOverCap">
          Autobuyer will trigger at the glyph level cap of {{formatInt(levelCap)}}.
        </div>
      </template>
    </autobuyer-box>`
});

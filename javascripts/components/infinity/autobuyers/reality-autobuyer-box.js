"use strict";

Vue.component("reality-autobuyer-box", {
  data() {
    return {
      mode: AUTO_REALITY_MODE.RM,
      levelCap: 0,
      isOverCap: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.reality,
    modes: () => [
      AUTO_REALITY_MODE.RM,
      AUTO_REALITY_MODE.GLYPH,
      AUTO_REALITY_MODE.EITHER,
      AUTO_REALITY_MODE.BOTH
    ]
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.levelCap = Glyphs.levelCap;
      this.isOverCap = this.autobuyer.glyph > this.levelCap;
    },
    modeName(mode) {
      switch (mode) {
        case AUTO_REALITY_MODE.RM: return "Reality Machines";
        case AUTO_REALITY_MODE.GLYPH: return "Glyph level";
        case AUTO_REALITY_MODE.EITHER: return "Either";
        case AUTO_REALITY_MODE.BOTH: return "Both";
      }
      throw new Error("Unknown auto reality mode");
    },
    changeMode(event) {
      const mode = parseInt(event.target.value, 10);
      this.autobuyer.mode = mode;
      this.mode = mode;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Reality">
      <template slot="intervalSlot">
        <select
          class="c-autobuyer-box__mode-select"
          @change="changeMode"
          >
          <option
            v-for="optionMode in modes"
            :value="optionMode"
            :selected="mode === optionMode"
          >{{modeName(optionMode)}}</option>
        </select>
      </template>
      <template slot="toggleSlot">
        <div>Target reality machines:</div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="decimal"
         property="rm"
        />
      </template>
      <template slot="prioritySlot">
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

"use strict";

Vue.component("modal-glyph-undo", {
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  methods: {
    update() {
      this.showStoredGameTime = Enslaved.isUnlocked;
    },
    handleYesClick() {
      Glyphs.undo();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to undo equipping a Glyph</h2>
      <div class="c-modal-message__text">
        The last equipped Glyph will be removed.
        Reality will be reset, but some things will be restored to what they were when it was equipped:
        <br>
        <div style="text-align: left">
          <br>- Antimatter, Infinity Points, and Eternity Points
          <br>- Dilation Upgrades, Tachyon Particles, and Dilated Time
          <br>- Time Theorems and Eternity Challenge completions
          <br>- Time Dimension and Reality unlocks
          <br>- time in current Reality
          <span v-if="showStoredGameTime"><br>- stored game time</span>
        </div>
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Confirm
        </primary-button>
      </div>
    </div>`
});

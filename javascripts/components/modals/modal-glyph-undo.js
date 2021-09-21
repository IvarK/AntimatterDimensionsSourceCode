"use strict";

Vue.component("modal-glyph-undo", {
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.realityInvalidate);
  },
  methods: {
    update() {
      this.showStoredGameTime = Enslaved.isUnlocked;
    },
    realityInvalidate() {
      this.emitClose();
      Modal.message.show("Glyph Undo can only undo with a Reality!");
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.undo();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to undo equipping a Glyph</h2>
      <div
        class="c-modal-message__text"
        style="text-align: left"
      >
        The last equipped Glyph will be removed.
        Reality will be reset, but some things will be restored to what they were when it was equipped:
        <br>
        <div style="text-align: left">
          <br>- Antimatter, Infinity Points, and Eternity Points
          <br>- Dilation Upgrades, Tachyon Particles, and Dilated Time
          <br>- Time Theorems and Eternity Challenge completions
          <br>- Time Dimension and Reality unlocks
          <br>- Time in current Infinity/Eternity/Reality
          <span v-if="showStoredGameTime"><br>- Stored game time</span>
        </div>
        <br>
        Note that if you invalidate special requirements for certain things (such as the achievement for completing
        a Reality without producing antimatter), they will remain invalid even after undoing. In those cases, you will
        need to complete the conditions in a single Reality without using undo.
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

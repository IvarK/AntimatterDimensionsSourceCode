"use strict";

Vue.component("modal-preferred-tree", {
  data() {
    return {
      isPreferred: [false, false, false, false, false, false]
    };
  },
  methods: {
    toggle(index) {
      this.isPreferred[index] = true;
    },
    confirmPrefs() {
      this.emitClose();
      // I have no idea how the backend works even after looking at it lolol
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
  <h2>First split preference:</h2>
  <div style="display: flex; flex-direction: column; align-items: left;">
  <div style="display: flex; flex-direction: row; align-items: center;">
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__ad"
    @click="toggle(0)"
    :preferred="this.isPreferred[0]"
    >Antimatter Dimensions</button>
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__id"
    @click="toggle(1)"
    :preferred="this.isPreferred[1]"
    >Infinity Dimensions</button>
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__td"
    @click="toggle(2)"
    :preferred="this.isPreferred[2]"
    >Time Dimensions</button>
    </div>
    </div>
  <br>
  <h2>Second split preference:</h2>
  <div style="display: flex; flex-direction: column; align-items: left;">
  <div style="display: flex; flex-direction: row; align-items: center;">
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__active"
    @click="toggle(3)"
    :unlocked="this.isPreferred[3]"
    >Active</button>
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__passive"
    @click="toggle(4)"
    :preferred="this.isPreferred[4]"
    >Passive</button>
    <button
    class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked__idle"
    @click="toggle(5)"
    :preferred="this.isPreferred[5]"
    >Idle</button>
    </div>
    </div>
  <primary-button
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn c-modal__confirm-btn"
        @click="confirmPrefs"
      >Confirm</primary-button>
  </div>
  `
});

// So, to recap:
// In the beginning, the universe was created.
// This has made a lot of people very angry,
// and has been widely regarded as a bad move.
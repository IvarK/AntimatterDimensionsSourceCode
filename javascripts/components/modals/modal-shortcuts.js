"use strict";

Vue.component("open-modal-shortcuts", {
  template: `
    <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
      Press <kbd>?</kbd> to open shortcut list.
    </p>`
});


Vue.component("modal-shortcuts", {
  data() {
    return {
      shortcuts: []
    };
  },
  methods: {
    update() {
      for (const x in shortcuts) {
        this.shortcuts[x] = [];
        const here = this.shortcuts[x];
        const there = shortcuts[x];
        here.name = there.name;
        here.keys = there.keys;
        here.visible = there.visible;
      }
    }
  },
  template: `
    <div class="c-modal-shortcuts l-modal-shortcuts">
      <div class="l-modal-shortcuts__column">
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Buy 1 Dimension</span>
          <kbd>shift</kbd><kbd>1</kbd>-<kbd>shift</kbd><kbd>8</kbd>
        </div>
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Buy 10 Dimensions</span>
          <kbd>1</kbd>-<kbd>8</kbd>
        </div>
        <div
          v-for="shortcut in shortcuts"
          class="l-modal-shortcuts-row"
          v-if="shortcut.visible()"
        >
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">{{ shortcut.name }}</span>
          <kbd v-for="key in shortcut.keys">{{ key }}</kbd>
        </div>
      </div>
      <div class="l-modal-shortcuts__column l-modal-shortcuts__column--right">
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Modifier key</span>
          <kbd>shift</kbd>
        </div>
        <span class="c-modal-shortcuts__shift-description">
          Shift is a modifier key that shows additional information on certain things
          and adjusts the function of certain buttons.
          <br>
          You can hold shift while buying Time Studies to buy all up until that point,
          save Time Study trees, and delete Glyphs.
        </span>
        <br><br>
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Autobuyer Controls</span>
          <kbd>alt</kbd>
        </div>
        <span class="c-modal-shortcuts__shift-description">
          Alt is a modifier key that, when pressed in conjunction with any key that has a corresponding autobuyer,
          will toggle said autobuyer. This works for all autobuyers in the Autobuyer tab, but only if they are active.
          <br>
          When pressing both Alt and Shift, you can toggle buying singles or buying max for the Antimatter Dimension
          and Tickspeed Autobuyers instead.
        </span>
        <br><br>
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Tab Movement</span>
          <div>
            <kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd>
          </div>
        </div>
        <span class="c-modal-shortcuts__shift-description">
          Using the Arrow Keys will cycle you through the game's pages.
          The Up and Down arrows cycle you through tabs,
          and the Left and Right arrows cycle you through that tab's subtabs.
        </span>
      </div>
    </div>`
});

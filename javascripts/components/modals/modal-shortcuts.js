"use strict";

Vue.component("modal-shortcuts", {
  computed: {
    shortcuts: () => [
      { name: "Buy one Tickspeed", keys: ["shift", "t"] },
      { name: "Buy max Tickspeed", keys: ["t"] },
      { name: "Max all", keys: ["m"] },
      { name: "Dimensional Sacrifice", keys: ["s"] },
      { name: "Dimension Boost", keys: ["d"] },
      { name: "Antimatter Galaxy", keys: ["g"] },
      { name: "Big Crunch", keys: ["c"] },
      { name: "Toggle Autobuyers", keys: ["a"] },
      { name: "Replicanti Galaxy", keys: ["r"] },
      { name: "Eternity", keys: ["e"] },
      { name: "Start/Pause Automator", keys: ["u"] },
      { name: "Restart Automator", keys: ["shift", "u"] },
      { name: "Toggle Black Hole", keys: ["b"] },
      { name: "Save game", keys: ["ctrl", "s"] },
      { name: "Export game", keys: ["ctrl", "e"] },
      { name: "Open \"How to Play\" pop-up", keys: ["h"] },
      { name: "Close pop-up or open options", keys: ["esc"] }
    ]
  },
  template:
    `<div class="c-modal-shortcuts l-modal-shortcuts">
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
        >
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">{{shortcut.name}}</span>
          <kbd v-for="key in shortcut.keys">{{key}}</kbd>
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
          You can hold shift while buying time studies to buy all up until that point,
          save study trees, and delete glyphs.
        </span>
        <br>
        <br>
        <div class="l-modal-shortcuts-row">
          <span class="c-modal-shortcuts-row__name l-modal-shortcuts-row__name">Autobuyer Controls</span>
          <kbd>alt</kbd>
        </div>
        <span class="c-modal-shortcuts__shift-description">
          Alt is a modifier key that, when pressed in conjunction with any key that has a corresponding autobuyer,
          will toggle said autobuyer. This includes all autobuyers in the Autobuyer tab besides the
          Reality autobuyer, as well as the Replicanti Galaxy Autobuyer.
          <br>
          When pressing both Alt and Shift, you can toggle buying singles or buying max for the Antimatter Dimension
          and Tickspeed Autobuyers instead.
        </span>
      </div>
    </div>`
});

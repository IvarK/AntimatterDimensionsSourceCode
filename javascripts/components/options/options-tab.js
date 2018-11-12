Vue.component('options-tab', {
  template:
    `<div class="l-options-tab">
      <options-button-grid />
      <p>
        Hotkeys: 1-8 for buy 10 dimension, shift+1-8 for buy 1 dimension, T to buy max tickspeed, shift+T to buy one tickspeed, M for max all
        <br>
        S for sacrifice, D for dimension boost, G for antimatter galaxy, C for crunch, A for toggle autobuyers, R for replicanti galaxies, E for eternity.
        <br>
        Shift is a modifier key that shows additional information on certain things and adjusts the function of certain buttons.
        <br>
        You can hold shift while buying time studies to buy all up until that point, save study trees, cycle backwards through themes and notations, and delete glyphs.
        <br>
        Hotkeys do not work while holding control.
      </p>
    </div>`
});
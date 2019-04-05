Vue.component('options-tab', {
  template:
    `<div class="l-options-tab">
      <options-button-grid />
      <p>
        Hotkeys: 1-8 to buy 10 Dimensions, shift + 1-8 to buy 1 Dimension, T to buy max tickspeed, shift + T to buy one tickspeed, M for max all,
        <br>
        S for sacrifice, D for Dimension Boost, G for Antimatter Galaxy, C for Big Crunch, A for toggle autobuyers, R for Replicanti galaxies, E for Eternity, and B to pause the Black Hole.
        <br>
        Shift is a modifier key that shows additional information on certain things and adjusts the function of certain buttons.
        <br>
        You can hold shift while buying time studies to buy all up until that point, save study trees, cycle backwards through themes and notations, and delete glyphs.
        <br>
        Hotkeys do not work while holding control.
      </p>
    </div>`
});
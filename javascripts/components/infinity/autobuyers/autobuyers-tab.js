"use strict";

Vue.component("autobuyers-tab", {
  data: () => ({
    hasContinuum: false
  }),
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
    }
  },
  template:
    `<div class="l-autobuyers-tab">
      <autobuyer-toggles />
      <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
        Press <kbd>?</kbd> to open shortcut list.
      </p>
      <reality-autobuyer-box />
      <eternity-autobuyer-box />
      <big-crunch-autobuyer-box />
      <galaxy-autobuyer-box />
      <dimboost-autobuyer-box />
      <dimension-autobuyer-box v-if="!hasContinuum" v-for="tier in 8" :key="tier" :tier="tier"/>
      <tickspeed-autobuyer-box v-if="!hasContinuum" />
      <sacrifice-autobuyer-box />
      <template v-if="hasContinuum">
        Continuum makes Antimatter Dimension and Tickspeed Autobuyers obsolete, as you now automatically have a
        <br>
        certain amount of simulated Antimatter Dimension and Tickspeed purchases based on your antimatter.
      </template>
    </div>`
});

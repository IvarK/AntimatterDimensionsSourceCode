"use strict";

Vue.component("automator-button", {
  template: `
    <button class="c-automator__button l-automator__button fas" @click="emitClick" />
  `
});

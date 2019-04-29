"use strict";

Vue.component("select-notation", {
  computed: {
    notations: () => Notations.list,
  },
  template: `
    <div class="l-select-notation">
      <div v-for="notation in notations" :key="notation.name"
           class="o-primary-btn l-select-notation__item c-select-notation__item"
           @click="notation.setCurrent()">
        {{notation.name}}
      </div>
    </div>
  `
});
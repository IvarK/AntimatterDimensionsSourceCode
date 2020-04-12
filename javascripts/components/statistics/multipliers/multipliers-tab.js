"use strict";

Vue.component("multipliers-tab", {
  data() {
    return {
      all: Multipliers.list
    };
  },
  template: `<div class="multiplier-tab">
    <multipliers-subtab v-for="multi in all" :name="multi.name" :key="multi.name" />
  </div>
`
});

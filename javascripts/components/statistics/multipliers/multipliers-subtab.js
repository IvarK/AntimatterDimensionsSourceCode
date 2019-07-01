"use strict";

Vue.component("multipliers-subtab", {
  props: {
    name: String,
  },
  data() {
    return {
      active: false,
      dataObject: Multiplier.find(this.name)
    };
  },
  methods: {
    setActive() {
      this.active = !this.active;
    }
  },
  template: `<div>
    <button @click="setActive()" class="tabbtn" style="align:center">{{this.name}}</button>
    <div v-if="this.active">
      <h3> {{dataObject.infoText}} </h3>
      <div v-for="effect in dataObject.effects">
        <b> {{effect.name}}: </b> {{effect.total()}}
      </div>
    </div>
  </div>
`
});
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
    },
    update() {
      this.dataObject = Object.create(Multiplier.find(this.name));
    }
  },
  template: `<div>
    <button @click="setActive()" class="tabbtn" style="margin:10px">{{this.name}}</button>
    <div v-if="this.active">
      <div class="title"> {{dataObject.infoText}} </div>
      <div v-for="effect in dataObject.effects.list">
        <multipliers-breakdown :parentName="name" :effectName="effect.name" />
      </div>
    </div>
  </div>
`
});
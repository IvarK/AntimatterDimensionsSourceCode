"use strict";

Vue.component("multipliers-breakdown", {
  props: {
    parentName: String,
    effectName: String
  },
  data() {
      return {
        active: false,
        effect: Multiplier.find(this.parentName).effects.find(this.effectName)
      };
    },
  methods: {
    setActive() {
      this.active = !this.active;
    },
    update() {
      this.effect = Object.create(Multiplier.find(this.parentName).effects.find(this.effectName));
    }
  },
  template: `<div>
    <div v-if="active">
      <div v-for="multi in effect.breakdown" v-if="multi.show()"> <b> {{multi.name}}: </b> {{multi.effect()}} </div>
    </div>
    <div @click="setActive()" class="total"> <b> {{effect.name}}: </b> {{effect.total()}} </div>
  </div>
`
});
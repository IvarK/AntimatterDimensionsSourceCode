"use strict";

Vue.component("galaxy-autobuyer-box", {
  data() {
    return {
      limitGalaxies: false,
      isBuyMaxUnlocked: false,
      buyMax: false
    };
  },
  watch: {
    limitGalaxies(newValue) {
      this.autobuyer.limitGalaxies = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.galaxy
  },
  methods: {
    update() {
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitGalaxies = this.autobuyer.limitGalaxies;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Galaxies" showInterval>
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template v-if="isBuyMaxUnlocked" slot="intervalSlot">
        <div>Activates every X seconds:</div>
        <autobuyer-input
        :autobuyer="autobuyer"
        type="float"
        property="buyMaxInterval"
        />
      </template>
      <template :slot=" isBuyMaxUnlocked ? 'toggleSlot' : 'intervalSlot' ">
        <div class="o-autobuyer-toggle-checkbox" @click="limitGalaxies = !limitGalaxies">
          <input type="checkbox" :checked="limitGalaxies"/>
          <span>Limit galaxies to:</span>
        </div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="int"
         property="maxGalaxies"
        />
      </template>
    </autobuyer-box>`
});

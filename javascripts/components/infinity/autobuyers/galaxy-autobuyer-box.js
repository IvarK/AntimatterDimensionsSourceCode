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
    },
    buyMax(newValue) {
      this.autobuyer.buyMax = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.galaxy
  },
  methods: {
    update() {
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitGalaxies = this.autobuyer.limitGalaxies;
      this.buyMax = this.autobuyer.buyMax;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :showInterval="!buyMax" name="Automatic Galaxies">
      <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
      <div>
        <div class="o-autobuyer-toggle-checkbox" @click="limitGalaxies = !limitGalaxies">
          <input type="checkbox" :checked="limitGalaxies"/>
          <span>Limit galaxies to:</span>
        </div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="int"
         property="maxGalaxies"
        />
      </div>
      <div v-if="isBuyMaxUnlocked">
        <div class="o-autobuyer-toggle-checkbox" @click="buyMax = !buyMax">
          <input type="checkbox" :checked="buyMax"/>
          <span>Buy max</span>
        </div>
        <span>Activates every x seconds:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="float"
         property="buyMaxInterval"
        />
      </div>
    </autobuyer-box>`
});

"use strict";

Vue.component("galaxy-autobuyer-box", {
  data() {
    return {
      limitGalaxies: false,
      isBuyMaxUnlocked: false,
      buyMax: false,
      showInterval: false
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
      this.showInterval = !this.autobuyer.isBuyMaxActive;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :showInterval="showInterval" name="Automatic Galaxies">
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template :slot="showInterval ? 'toggleSlot' : 'intervalSlot'">
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
      <template v-if="isBuyMaxUnlocked" :slot="showInterval ? 'prioritySlot' : 'toggleSlot'">
        <div class="o-autobuyer-toggle-checkbox" @click="buyMax = !buyMax">
          <input type="checkbox" :checked="buyMax"/>
          <span>Buy max</span>
        </div>
        <div>Activates every x seconds:</div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="float"
         property="buyMaxInterval"
        />
      </template>
    </autobuyer-box>`
});

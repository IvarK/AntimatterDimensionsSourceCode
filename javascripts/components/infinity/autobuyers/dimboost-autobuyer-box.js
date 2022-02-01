import "./autobuyer-interval-button.js";
import "./autobuyer-input.js";
import "./autobuyer-box.js";

Vue.component("dimboost-autobuyer-box", {
  data() {
    return {
      limitDimBoosts: false,
      limitUntilGalaxies: false,
      isBuyMaxUnlocked: false
    };
  },
  watch: {
    limitDimBoosts(newValue) {
      this.autobuyer.limitDimBoosts = newValue;
    },
    limitUntilGalaxies(newValue) {
      this.autobuyer.limitUntilGalaxies = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.dimboost
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isBuyMaxUnlocked = autobuyer.isBuyMaxUnlocked;
      this.limitDimBoosts = autobuyer.limitDimBoosts;
      this.limitUntilGalaxies = autobuyer.limitUntilGalaxies;
    }
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" :showInterval="!isBuyMaxUnlocked" name="Automatic Dimension Boosts">
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template v-if="isBuyMaxUnlocked" slot="checkboxSlot">
        <div class="c-autobuyer-box__small-text" style="margin-top: 1.2rem;">Activates every X seconds:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="float"
          property="buyMaxInterval"
        />
      </template>
      <template v-else slot="checkboxSlot" style="margin-top: 1.2rem;">
        <div
          class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
          style="margin-top: 1.2rem;"
          @click="limitDimBoosts = !limitDimBoosts"
        >
          <input type="checkbox" :checked="limitDimBoosts" />
          <span>Limit Dimension Boosts to:</span>
        </div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="maxDimBoosts"
        />
      </template>
      <template slot="toggleSlot">
        <div
          class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
          style="height: 3rem;"
          @click="limitUntilGalaxies = !limitUntilGalaxies"
        >
          <input type="checkbox" :checked="limitUntilGalaxies" />
          <span v-if="isBuyMaxUnlocked">
            Only Dimboost to unlock new<br>
            Dimensions until X Galaxies:
          </span>
          <span v-else>
            Galaxies required to always<br>
            Dimboost, ignoring the limit:
          </span>
        </div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="galaxies"
        />
      </template>
    </autobuyer-box>`
});

import "./autobuyer-toggles.js";
import "./multiple-autobuyers-box.js";
import "./single-autobuyer-box.js";
import "./big-crunch-autobuyer-box.js";
import "./sacrifice-autobuyer-box.js";
import "./tickspeed-autobuyer-box.js";
import "./dimension-autobuyer-box.js";
import "./galaxy-autobuyer-box.js";
import "./dimboost-autobuyer-box.js";
import "./eternity-autobuyer-box.js";
import "./reality-autobuyer-box.js";

Vue.component("autobuyers-tab", {
  data() {
    return {
      hasContinuum: false,
      displayADAutobuyersIndividually: false,
    };
  },
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
      this.checkADAutoStatus();
    },
    checkADAutoStatus() {
      const ad = Autobuyer.antimatterDimension;
      const allMaxedInterval = ad.allMaxedInterval();
      const allUnlocked = ad.allUnlocked();
      const allUnlimitedBulk = ad.allUnlocked();
      this.displayADAutobuyersIndividually = !(allMaxedInterval && allUnlocked && allUnlimitedBulk);
    },
  },
  template: `
    <div class="l-autobuyers-tab">
      <autobuyer-toggles />
      <open-modal-shortcuts />
      <reality-autobuyer-box />
      <eternity-autobuyer-box />
      <big-crunch-autobuyer-box />
      <galaxy-autobuyer-box />
      <dimboost-autobuyer-box />
      <sacrifice-autobuyer-box />
      <tickspeed-autobuyer-box v-if="!hasContinuum" />
      <dimension-autobuyer-box
        v-if="displayADAutobuyersIndividually"
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
      <simple-autobuyers-multi-box />
    </div>`
});

Vue.component("simple-autobuyers-multi-box", {
  // There are two types of display: multiple and single. They must be treated differently.
  computed: {
    mutliple() {
      return Autobuyers.display[0];
    },
    singles() {
      return Autobuyers.display[1];
    }
  },
  template: `
    <span>
      <span class="l-autobuyers-tab">
        <multiple-autobuyers-box
          v-for="(type, id) in mutliple"
          :type="type"
          :key="1+id"
        />
        <single-autobuyer-box
          v-for="(type, id) in singles"
          :autobuyer="type"
          :key="-id"
        />
      </span>
    </span>`
});

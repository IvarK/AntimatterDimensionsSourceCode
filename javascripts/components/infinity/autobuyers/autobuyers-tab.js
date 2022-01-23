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
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";


Vue.component("autobuyers-tab", {
  components: {
    OpenModalHotkeysButton
  },
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
      const allUnlimitedBulk = ad.allUnlimitedBulk();
      this.displayADAutobuyersIndividually = !(allMaxedInterval && allUnlocked && allUnlimitedBulk);
    },
  },
  template: `
    <div class="l-autobuyers-tab">
      <autobuyer-toggles />
      <OpenModalHotkeysButton />
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
  },
  template: `
    <span class="l-autobuyers-tab">
      <multiple-autobuyers-box
        v-for="(type, id) in mutliple"
        :type="type"
        :key="id"
      />
      <multiple-single-autobuyers-group />
    </span>`
});


Vue.component("multiple-single-autobuyers-group", {
  computed: {
    singles() {
      return Autobuyers.display[1];
    },
    entryCount() {
      return this.singles.length;
    },
    rowCount() {
      return Math.ceil(this.entryCount / 4);
    },
    entryCountPerRow() {
      return this.rowCount === 1 ? this.entryCount : 4;
    },
    boxSize() {
      // The 2% reduced flex-basis is used to prevent wrapping due to the margins.
      // It would be 1%, but apparently the margins are larger here.
      return `flex: 1 0 ${100 / this.entryCountPerRow - 2}%`;
    }
  },
  template: `
    <span class="l-autobuyer-singlet-group">
      <template
        v-for="(type, id) in singles"
      >
        <single-autobuyer-box :autobuyer="type" :style="boxSize" />
        <br v-if="id % entryCountPerRow === entryCountPerRow" />
      </template>
    </span>`
});

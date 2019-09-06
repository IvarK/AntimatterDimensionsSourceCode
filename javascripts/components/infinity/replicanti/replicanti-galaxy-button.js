"use strict";

Vue.component("replicanti-galaxy-button", {
  data() {
    return {
      isAvailable: false,
      isAutoUnlocked: false,
      isAutoOn: false,
      isAutoEnabled: false,
      isDivideUnlocked: false,
      boughtGalaxies: 0,
      extraGalaxies: 0
    };
  },
  computed: {
    resetActionDisplay() {
      return this.isDivideUnlocked
        ? `Divide Replicanti by ${shorten(Number.MAX_VALUE, 0, 1)}`
        : "Reset Replicanti amount";
    },
    galaxyCountDisplay() {
      const bought = this.boughtGalaxies;
      const extra = this.extraGalaxies;
      const galaxyNoun = (extra + bought === 1) ? "galaxy" : "galaxies";
      const galaxyCount = extra > 0 ? `${shortenSmallInteger(bought)}+${shortenSmallInteger(extra)}` : bought;
      return `${galaxyCount} replicated ${galaxyNoun} created.`;
    },
    autobuyer() {
      return Replicanti.galaxies.autobuyer;
    },
    autobuyerOnTextDisplay() {
      return this.isAutoEnabled ? "Auto galaxy ON" : "Auto galaxy ON (disabled)";
    },
    autobuyerOffTextDisplay() {
      return this.isAutoEnabled ? "Auto galaxy OFF" : "Auto galaxy OFF (disabled)";
    }
  },
  methods: {
    update() {
      this.isAvailable = Replicanti.galaxies.canBuyMore;
      this.boughtGalaxies = Replicanti.galaxies.bought;
      this.extraGalaxies = Replicanti.galaxies.extra;
      this.isDivideUnlocked = Achievement(126).isEnabled;
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutoOn = this.autobuyer.isOn;
      this.isAutoEnabled = this.autobuyer.isEnabled;
    },
    handleAutoToggle(value) {
      this.autobuyer.isOn = value;
      this.update();
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <primary-button
        :enabled="isAvailable"
        class="o-primary-btn--replicanti-galaxy"
        onclick="replicantiGalaxy()"
      >
        {{resetActionDisplay}}, but get a free galaxy
        <br>
        {{galaxyCountDisplay}}
      </primary-button>
      <primary-button-on-off-custom
        v-if="isAutoUnlocked"
        :value="isAutoOn"
        :on="autobuyerOnTextDisplay"
        :off="autobuyerOffTextDisplay"
        class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-galaxy-toggle"
        @input="handleAutoToggle"
      />
    </div>`
});
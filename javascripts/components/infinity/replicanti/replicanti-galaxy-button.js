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
        ? `Divide Replicanti by ${format(Number.MAX_VALUE, 1, 1)}`
        : "Reset Replicanti amount";
    },
    galaxyCountDisplay() {
      const bought = this.boughtGalaxies;
      const extra = this.extraGalaxies;
      const galaxyCount = extra > 0 ? `${formatInt(bought)}+${formatInt(extra)}` : formatInt(bought);
      return `Currently: ${galaxyCount}`;
    },
    autobuyer() {
      return Replicanti.galaxies.autobuyer;
    },
    autobuyerOnTextDisplay() {
      return this.isAutoEnabled ? "Auto Galaxy ON" : "Auto Galaxy ON (disabled)";
    },
    autobuyerOffTextDisplay() {
      return this.isAutoEnabled ? "Auto Galaxy OFF" : "Auto Galaxy OFF (disabled)";
    }
  },
  methods: {
    update() {
      this.isAvailable = Replicanti.galaxies.canBuyMore;
      this.boughtGalaxies = Replicanti.galaxies.bought;
      this.extraGalaxies = Replicanti.galaxies.extra;
      this.isDivideUnlocked = Achievement(126).isUnlocked;
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
        {{resetActionDisplay}} for a Replicanti Galaxy
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

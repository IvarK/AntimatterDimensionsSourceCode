Vue.component("ip-multiplier-button", {
  data: function() {
    return {
      isAutobuyerOn: false,
      isAutoUnlocked: false,
    };
  },
  watch: {
    isAutobuyerOn: function (newValue) {
      player.infMultBuyer = newValue;
    }
  },
  computed: {
    setup: function() {
      return infinityMultSetup();
    }
  },
  methods: {
    update() {
      this.isAutoUnlocked = player.eternities > 0;
      this.isAutobuyerOn = player.infMultBuyer;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <infinity-upgrade-button
        :upgrade="setup"
        class="o-infinity-upgrade-btn--multiplier"
      />
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Autobuy IP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});

class InfinityMultiplierSetup extends InfinityUpgradeSetup {
  constructor(props) {
    super(props);
  }

  get isCapped() {
    return this._upgrade.isCapped;
  }

  formatCapValue(formatter) {
    return `(Capped at ${formatter.shortenCosts(this._upgrade.capValue)} IP)`;
  }

  formatCost(formatter) {
    return formatter.shortenCosts(this._upgrade.cost);
  }

  get hasDynamicEffect() {
    return true;
  }

  get isBought() {
    return this.isCapped;
  }

  get isAvailable() {
    return super.isAvailable && !player.infMultBuyer;
  }
}

const infinityMultSetup = () => new InfinityMultiplierSetup({
  upgrade: InfinityUpgrade.ipMult,
  description: "Multiply Infinity Points from all sources by 2",
  formatEffect: (value, formatter) => `${formatter.shorten(value)}x`,
});
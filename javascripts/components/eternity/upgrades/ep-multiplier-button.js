Vue.component("ep-multiplier-button", {
  data() {
    return {
      isAutobuyerOn: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(0),
      cost: new Decimal(0)
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.reality.epmultbuyer = newValue;
    }
  },
  computed: {
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--available": this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      const upgrade = EternityUpgrade.epMult;
      const autobuyer = upgrade.autobuyer;
      this.isAutoUnlocked = autobuyer.isUnlocked;
      this.isAutobuyerOn = autobuyer.isOn;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <button :class="classObject">
        You gain 5 times more EP
        <br>
        Currently: {{shortenDimensions(multiplier)}}x
        <br>
        Cost: {{shortenDimensions(cost)}} EP
      </button>
      <primary-button
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        onclick="buyMaxEPMult()"
      >Max EP mult</primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Autobuy EP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});
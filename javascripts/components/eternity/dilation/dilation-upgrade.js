"use strict";

Vue.component("dilation-upgrade", {
  props: {
    isRebuyable: {
      type: Boolean,
      default: false
    },
    upgrade: Object
  },
  data() {
    return {
      isBought: false,
      isCapped: false,
      isAffordable: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      this.upgrade.isAutobuyerOn = newValue;
    }
  },
  computed: {
    classObject() {
      return {
        "o-dilation-upgrade": true,
        "o-dilation-upgrade--rebuyable": this.isRebuyable,
        "o-dilation-upgrade--available": !this.isBought && !this.isCapped && this.isAffordable,
        "o-dilation-upgrade--unavailable": !this.isBought && !this.isCapped && !this.isAffordable,
        "o-dilation-upgrade--bought": this.isBought,
        "o-dilation-upgrade--capped": this.isCapped,
      };
    }
  },
  methods: {
    update() {
      if (this.isRebuyable) {
        this.isAffordable = this.upgrade.isAffordable;
        this.isCapped = this.upgrade.isCapped;
      } else {
        this.isBought = this.upgrade.isBought;
        if (!this.isBought) {
          this.isAffordable = this.upgrade.isAffordable;
        }
      }
      this.isAutoUnlocked = Perk.autobuyerDilation.isBought;
      this.isAutobuyerOn = this.upgrade.isAutobuyerOn;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()">
        <description-display 
          :config="upgrade.config"
          :length="70"
          name="o-dilation-upgrade__description"
        />
        <effect-display br :config="upgrade.config" />
        <cost-display br
          v-if="!isBought && !isCapped"
          :config="upgrade.config"
          singular="Dilated Time"
          plural="Dilated Time"
        />
      </button>
      <primary-button-on-off
        v-if="isRebuyable && isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon o-primary-btn--dilation-upgrade-toggle"
      />
    </div>`
});
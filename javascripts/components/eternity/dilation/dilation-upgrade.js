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
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-dilation-upgrade": true,
        "o-dilation-upgrade--rebuyable": this.isRebuyable,
        "o-dilation-upgrade--bought": this.isBought,
        "o-dilation-upgrade--available": !this.isBought && this.isAffordable,
        "o-dilation-upgrade--unavailable": !this.isBought && !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      if (this.isRebuyable) {
        this.isAffordable = this.upgrade.isAffordable;
      } else {
        this.isBought = this.upgrade.isBought;
        if (!this.isBought) {
          this.isAffordable = this.upgrade.isAffordable;
        }
      }
    }
  },
  template:
    `<button :class="classObject" @click="upgrade.purchase()">
      <description-display 
        :config="upgrade.config"
        :length="70"
        name="o-dilation-upgrade__description"
      />
      <effect-display br :config="upgrade.config" />
      <cost-display br
        v-if="!isBought"
        :config="upgrade.config"
        singular="Dilated Time"
        plural="Dilated Time"
      />
    </button>`
});
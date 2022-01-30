<script>
import IntervalLabel from "./IntervalLabel";

export default {
  name: "AutobuyerBox",
  components: {
    IntervalLabel
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    showInterval: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isUnlocked: false,
      isActive: false,
      globalToggle: false,
      canBeBought: false,
      isUnlockable: false,
      antimatterCost: new Decimal(),
      isBought: false,
      antimatter: new Decimal()
    };
  },
  computed: {
    autobuyerBuyBoxClass() {
      return {
        "c-autobuyer-buy-box": true,
        "o-primary-btn": true,
        "o-primary-btn--enabled": this.isUnlockable,
        "o-primary-btn--disabled": !this.isUnlockable
      };
    },
    autobuyerToggleClass() {
      if (!this.globalToggle) {
        return this.isActive ? "fas fa-pause" : "fas fa-times";
      }
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      if (!this.globalToggle) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.isActive,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": !this.isActive,
          "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
      };
    },
    showEternity() {
      return PlayerProgress.eternityUnlocked()
        ? "this Eternity"
        : "";
    }
  },
  watch: {
    isActive(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.autobuyer.isActive = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      this.isActive = autobuyer.isActive;
      this.globalToggle = player.auto.autobuyersOn;
      this.canBeBought = autobuyer.canBeBought;
      this.isUnlockable = autobuyer.canUnlockSlowVersion;
      this.antimatterCost = autobuyer.antimatterCost;
      this.isBought = autobuyer.isBought;
      this.antimatter.copyFrom(player.records.thisEternity.maxAM);
    },
    toggle() {
      this.isActive = !this.isActive;
    },
    purchase() {
      this.autobuyer.purchase();
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked || isBought"
    class="c-autobuyer-box-row"
  >
    <div class="l-autobuyer-box__header">
      {{ name }}
      <IntervalLabel
        v-if="showInterval"
        :autobuyer="autobuyer"
      />
    </div>
    <div class="c-autobuyer-box-row__intervalSlot">
      <slot name="intervalSlot" />
    </div>
    <div class="c-autobuyer-box-row__toggleSlot">
      <slot name="toggleSlot" />
    </div>
    <div class="c-autobuyer-box-row__checkboxSlot">
      <slot name="checkboxSlot" />
    </div>
    <div class="c-autobuyer-box-row__optionSlot">
      <slot name="optionSlot" />
    </div>
    <div
      class="l-autobuyer-box__footer"
      @click="toggle"
    >
      <label :class="autobuyerStateClass">
        <span :class="autobuyerToggleClass" />
      </label>
      <input
        :checked="isActive && globalToggle"
        :disabled="!globalToggle"
        :name="name"
        type="checkbox"
      >
    </div>
  </div>
  <div
    v-else-if="canBeBought"
    :class="autobuyerBuyBoxClass"
    @click="purchase"
  >
    {{ name }}
    <br>
    Requirement: {{ format(antimatterCost) }} Total Antimatter {{ showEternity }}
  </div>
</template>

<style scoped>

</style>

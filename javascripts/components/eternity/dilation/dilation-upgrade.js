import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

Vue.component("dilation-upgrade", {
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
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
      boughtAmount: 0,
      timeUntilCost: new Decimal(0),
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.dilationUpgrade(this.upgrade.id).isActive = newValue;
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
    },
    timeEstimate() {
      if (this.isAffordable || this.isCapped || this.upgrade.isBought || getDilationGainPerSecond().eq(0)) return null;
      if (this.timeUntilCost.lt(1)) return `< ${formatInt(1)} second`;
      if (this.timeUntilCost.gt(86400 * 365.25)) return `> ${formatInt(1)} year`;
      return TimeSpan.fromSeconds(this.timeUntilCost.toNumber()).toStringShort();
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.timeUntilCost = Decimal.sub(upgrade.cost, Currency.dilatedTime.value)
        .div(getDilationGainPerSecond().times(getGameSpeedupForDisplay()));
      if (this.isRebuyable) {
        this.isAffordable = upgrade.isAffordable;
        this.isCapped = upgrade.isCapped;
        const autobuyer = Autobuyer.dilationUpgrade(upgrade.id);
        this.isAutoUnlocked = autobuyer.isUnlocked;
        this.isAutobuyerOn = autobuyer.isActive;
        this.boughtAmount = upgrade.boughtAmount;
        return;
      }
      this.isBought = upgrade.isBought;
      if (!this.isBought) {
        this.isAffordable = upgrade.isAffordable;
      }
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()" :ach-tooltip="timeEstimate">
        <DescriptionDisplay
          :config="upgrade.config"
          :length="70"
          name="o-dilation-upgrade__description"
        />
        <EffectDisplay
          br
          :config="upgrade.config"
          :key="boughtAmount"
        />
        <CostDisplay
          br
          v-if="!isBought && !isCapped"
          :config="upgrade.config"
          name="Dilated Time"
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

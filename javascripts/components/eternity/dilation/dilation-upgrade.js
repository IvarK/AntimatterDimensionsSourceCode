import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("dilation-upgrade", {
  components: {
    PrimaryToggleButton,
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
      isUseless: false,
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
      return TimeSpan.fromSeconds(this.timeUntilCost.toNumber()).toTimeEstimate();
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
        this.boughtAmount = upgrade.boughtAmount;
        if (!autobuyer) return;
        this.isAutoUnlocked = autobuyer.isUnlocked;
        this.isAutobuyerOn = autobuyer.isActive;
        return;
      }
      this.isBought = upgrade.isBought;
      if (!this.isBought) {
        this.isAffordable = upgrade.isAffordable;
      }
      this.isUseless = (upgrade.id === 7) && Pelle.isDoomed;
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()" :ach-tooltip="timeEstimate">
        <span v-if="isUseless">
          This upgrade has no effect while in Doomed
        </span>
        <span v-else>
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
        </span>
        <CostDisplay
          br
          v-if="!isBought && !isCapped"
          :config="upgrade.config"
          name="Dilated Time"
        />
      </button>
      <PrimaryToggleButton
        v-if="isRebuyable && isAutoUnlocked"
        v-model="isAutobuyerOn"
        label="Auto:"
        class="l--spoon-btn-group__little-spoon o-primary-btn--dilation-upgrade-toggle"
      />
    </div>`
});

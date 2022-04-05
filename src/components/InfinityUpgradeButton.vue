<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "InfinityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUseless: false,
      canBeBought: false,
      chargePossible: false,
      canBeCharged: false,
      isBought: false,
      isCharged: false,
      isDisabled: false,
      showingCharged: false,
      hasTS31: false
    };
  },
  computed: {
    isBasedOnInfinities() {
      return /(18|27|36|45)Mult/u.test(this.upgrade.id);
    },
    shiftDown() {
      return ui.view.shiftDown;
    },
    showChargedEffect() {
      return this.chargePossible && (this.isCharged || this.showingCharged || this.shiftDown);
    },
    config() {
      const config = this.upgrade.config;
      return this.showChargedEffect
        ? config.charged
        : config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": !this.isDisabledInDoomed && this.isBought,
        "o-infinity-upgrade-btn--available": !this.isDisabledInDoomed && !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isDisabledInDoomed && !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--useless-bought": this.isDisabledInDoomed && this.isBought,
        "o-infinity-upgrade-btn--useless-available": this.isDisabledInDoomed && !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--useless-unavailable": this.isDisabledInDoomed && !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--chargeable": !this.isCharged && this.chargePossible &&
          (this.showingCharged || this.shiftDown),
        "o-infinity-upgrade-btn--charged": this.isCharged,
      };
    },
    isDisabledInDoomed() {
      const description = this.config.description;
      if (typeof description === "function") {
        return description().includes("has no effect");
      }
      return description.includes("has no effect");
    },
    isImprovedByTS31() {
      return this.hasTS31 && this.isBasedOnInfinities && !this.showChargedEffect;
    }
  },
  methods: {
    update() {
      // Note that this component is used by both infinity upgrades and break infinity upgrades
      // (putting this comment here rather than at the top of the component since this function
      // seems more likely to be read).
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.chargePossible = Ra.chargeUnlocked && upgrade.hasChargeEffect && !Pelle.isDoomed;
      this.canBeBought = upgrade.canBeBought;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
      // A bit hacky, but the offline passive IP upgrade (the one that doesn't work online)
      // should hide its effect value if offline progress is disabled, in order to be
      // consistent with the other offline progress upgrades which hide as well.
      // Also, the IP upgrade that works both online and offline should not
      // show 0 if its value is 0. This is a bit inconvenient because sometimes,
      // like after eternity, it can be bought but have value 0, but not showing the effect
      // in this case doesn't feel too bad. Other upgrades, including the cost scaling
      // rebuyables, should never hide their effect.
      this.isDisabled = upgrade.config.isDisabled && upgrade.config.isDisabled(upgrade.config.effect());
      this.isUseless = Pelle.uselessInfinityUpgrades.includes(upgrade.id) && Pelle.isDoomed;
      this.hasTS31 = TimeStudy(31).canBeApplied;
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @mouseenter="showingCharged = canBeCharged"
    @mouseleave="showingCharged = false"
    @click="upgrade.purchase()"
  >
    <span v-if="isUseless">
      This upgrade has no effect while in Doomed
    </span>
    <span v-else>
      <DescriptionDisplay
        :config="config"
      />
      <EffectDisplay
        v-if="!isDisabled"
        br
        :config="config"
      />
      <template v-if="!isDisabled && isImprovedByTS31">
        <br>
        After TS31: {{ formatX(config.effect().pow(4), 2, 2) }}
      </template>
    </span>
    <CostDisplay
      v-if="!isBought"
      br
      :config="config"
      name="Infinity Point"
    />
    <slot />
  </button>
</template>

<style scoped>

</style>

"use strict";

Vue.component("dark-matter-dimension-group", {
  data() {
    return {
      activeDimensions: [],
      nextDimensionThreshold: 0,
      unlockedAnnihilation: false,
      minAnnihilationDM: 0,
      hasAnnihilationDM: false,
    };
  },
  computed: {
    dimensions: () => MatterDimensionState.list,
  },
  methods: {
    update() {
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.nextDimensionThreshold = Array.range(0, 4)
        .filter(i => MatterDimension(i + 1).amount.eq(0))
        .map(i => MatterDimension(i + 1).adjustedStartingCost)
        .min();
      this.unlockedAnnihilation = ImaginaryUpgrade(19).isBought;
      this.minAnnihilationDM = Laitela.annihilationDMRequirement;
      this.hasAnnihilationDM = Currency.darkMatter.gte(this.minAnnihilationDM);
    },
  },
  template: `
    <span>
      <matter-dimension-row
        v-for="i in activeDimensions"
        :key="i"
        :dimension="dimensions[i]"
      />
      <div v-if="nextDimensionThreshold === 0 && !unlockedAnnihilation">
        <b>
          Unlock Dark Matter Annihilation from an Imaginary Upgrade.
          <br>
          (Also requires {{ format(minAnnihilationDM, 2) }} Dark Matter)
        </b>
        <br><br>
      </div>
      <div v-else-if="nextDimensionThreshold === 0 && !hasAnnihilationDM">
        <b>
          Annihilation requires {{ format(minAnnihilationDM, 2) }} Dark Matter.
        </b>
        <br><br>
      </div>
      <div v-else-if="nextDimensionThreshold !== 0">
        <b>
          Unlock the next Dark Matter Dimension from an Imaginary Upgrade.
          <br>
          (Starting cost: {{ format(nextDimensionThreshold, 2) }} Dark Matter)
        </b>
        <br><br>
      </div>
    </span>`
});


Vue.component("annihilation-button", {
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      hasAnnihilated: false,
      showAnnihilation: false,
      matterRequirement: 0,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.celestials.laitela.autoAnnihilationSetting,
      isEnabled: true,
      isMouseoverDisabled: false
    };
  },
  computed: {
    annihilationInputStyle() {
      return {
        width: "6rem",
        "background-color": this.isEnabled ? "" : "var(--color-disabled)",
      };
    }
  },
  methods: {
    update() {
      this.darkMatter.copyFrom(Currency.darkMatter);
      this.darkMatterMult = Laitela.darkMatterMult;
      this.darkMatterMultGain = Laitela.darkMatterMultGain;
      this.hasAnnihilated = Laitela.darkMatterMult > 1;
      this.showAnnihilation = Laitela.canAnnihilate &&
        (this.hasAnnihilated || !MatterDimensionState.list.some(d => d.amount.eq(0)));
      this.matterRequirement = Laitela.annihilationDMRequirement;
      this.darkMatterMultRatio = Laitela.darkMatterMultRatio;
      this.isEnabled = player.celestials.laitela.automation.annihilation;
    },
    annihilate() {
      if (this.isMouseoverDisabled) return;
      Laitela.annihilate();
    },
    handleAutoAnnihilationInputChange() {
      const float = parseFloat(this.autoAnnihilationInput);
      if (isNaN(float)) {
        this.autoAnnihilationInput = player.celestials.laitela.autoAnnihilationSetting;
      } else {
        player.celestials.laitela.autoAnnihilationSetting = float;
      }
    }
  },
  template: `
    <button
      class="c-laitela-annihilation-button"
      @click="annihilate()"
      v-if="showAnnihilation"
    >
      <h2>Annihilation</h2>
      <span v-if="hasAnnihilated">
        Current multiplier to all Dark Matter multipliers: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
        <br><br>
      </span>
      <span>
        Resets your Dark Matter and Dark Matter Dimension amounts,
      </span>
      <span v-if="!hasAnnihilated">
        unlocking Auto-Annihilation, and
      </span>
      <span v-if="hasAnnihilated && darkMatter.gte(matterRequirement)">
        but adds <b>{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
        (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
      </span>
      <span v-else-if="hasAnnihilated">
        adding to your current Annihilation multiplier (requires {{ format(matterRequirement) }} Dark Matter).
      </span>
      <span v-else-if="darkMatter.gte(matterRequirement)">
        multiplying Dark Matter multipliers by <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b>.
      </span>
      <span v-else>
        giving a multiplier to all Dark Matter multipliers (requires {{ format(matterRequirement) }} Dark Matter).
      </span>
      <div v-if="hasAnnihilated">
        <br>
        Auto-Annihilate when adding
        <input
          type="text"
          v-model="autoAnnihilationInput"
          @change="handleAutoAnnihilationInputChange()"
          @mouseover="isMouseoverDisabled = true"
          @mouseleave="isMouseoverDisabled = false"
          :style="annihilationInputStyle"
        />
        to the multiplier.
      </div>
    </button>`
});

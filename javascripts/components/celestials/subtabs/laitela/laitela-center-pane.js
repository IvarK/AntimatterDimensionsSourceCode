import "../dark-matter-dimension-row.js";

Vue.component("dark-matter-dimension-group", {
  template: `
    <span>
      <matter-dimension-row
        v-for="tier in 4"
        :key="tier"
        :tier="tier"
      />
    </span>`
});


Vue.component("annihilation-button", {
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      hasAnnihilated: false,
      annihilationButtonVisible: false,
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
      this.annihilationButtonVisible = Laitela.canAnnihilate || this.hasAnnihilated;
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
      class="l-laitela-annihilation-button c-laitela-annihilation-button"
      @click="annihilate()"
      v-if="annihilationButtonVisible"
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
    </button>

    <button
      v-else
      class="l-laitela-annihilation-button"
    >
      Annihilation requires {{ format(matterRequirement, 2) }} Dark Matter.
    </button>`
});

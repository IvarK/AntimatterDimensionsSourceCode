import "../dark-matter-dimension-row.js";

Vue.component("dark-matter-dimension-group", {
  template: `
    <span>
      <dark-matter-dimension-row
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
    };
  },
  computed: {
    annihilationInputStyle() {
      return { "background-color": this.isEnabled ? "" : "var(--color-bad)" };
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
    <div class="l-laitela-annihilation-container">
      <button
        @click="annihilate"
        class="l-laitela-annihilation-button c-laitela-annihilation-button"
      >
        <span v-if="darkMatter.lt(matterRequirement)">
          Annihilation requires {{ format(matterRequirement, 2) }} Dark Matter
        </span>
        <b v-else>Annihilate your Dark Matter Dimensions</b>
      </button>
      <br>
      <br>
      <span v-if="hasAnnihilated">
        Current multiplier to all Dark Matter multipliers: <b>{{ formatX(darkMatterMult, 2, 2) }}</b>
        <br>
        <br>
        Annihilation resets your Dark Matter and Dark Matter Dimension amounts, but adds
        <b>{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
        (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
        <br>
        <br>
        Auto-Annihilate when adding
        <input
          type="text"
          v-model="autoAnnihilationInput"
          @change="handleAutoAnnihilationInputChange()"
          :style="annihilationInputStyle"
          class="c-laitela-annihilation-input"
        />
        to the multiplier.
      </span>
      <span v-else>
        Annihilation resets your Dark Matter and Dark Matter Dimension amounts, unlocking Auto-Annihilation
        and multiplying all Dark Matter multipliers by <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b>.
      </span>
    </div>`
});

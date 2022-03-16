<script>
export default {
  name: "AnnihilationButton",
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      hasAnnihilated: false,
      annihilationButtonVisible: false,
      matterRequirement: 0,
      darkMatterMultRatio: 0,
      autoAnnihilationInput: player.auto.annihilation.multiplier,
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
      this.isEnabled = player.auto.annihilation.isActive;
    },
    annihilate() {
      Laitela.annihilate();
    },
    handleAutoAnnihilationInputChange() {
      const float = parseFloat(this.autoAnnihilationInput);
      if (isNaN(float)) {
        this.autoAnnihilationInput = player.auto.annihilation.multiplier;
      } else {
        player.auto.annihilation.multiplier = float;
      }
    }
  }
};
</script>

<template>
  <div class="l-laitela-annihilation-container">
    <button
      class="l-laitela-annihilation-button c-laitela-annihilation-button"
      @click="annihilate"
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
      Annihilation resets your Dark Matter, Dark Energy, and Dark Matter Dimension amounts, but adds
      <b>{{ format(darkMatterMultGain, 2, 2) }}</b> to your Annihilation multiplier.
      (<b>{{ formatX(darkMatterMultRatio, 2, 2) }}</b> from previous multiplier)
      <br>
      <br>
      Auto-Annihilate when adding
      <input
        v-model="autoAnnihilationInput"
        type="text"
        :style="annihilationInputStyle"
        class="c-laitela-annihilation-input"
        @change="handleAutoAnnihilationInputChange()"
      >
      to the multiplier.
    </span>
    <span v-else>
      Annihilation resets your Dark Matter and Dark Matter Dimension amounts, unlocking Auto-Annihilation
      and multiplying all Dark Matter multipliers by <b>{{ formatX(1 + darkMatterMultGain, 2, 2) }}</b>.
    </span>
  </div>
</template>

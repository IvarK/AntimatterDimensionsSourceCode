<script>
export default {
  name: "AnnihilationButton",
  data() {
    return {
      darkMatter: new Decimal(0),
      darkMatterMult: 0,
      darkMatterMultGain: 0,
      autobuyerUnlocked: false,
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
      this.autobuyerUnlocked = Autobuyer.annihilation.isUnlocked;
      this.annihilationButtonVisible = Laitela.canAnnihilate || this.autobuyerUnlocked;
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
      v-if="darkMatter.lt(matterRequirement)"
      class="l-laitela-annihilation-button"
    >
      Annihilation requires {{ format(matterRequirement, 2) }} Dark Matter
    </button>
    <button
      v-else
      class="l-laitela-annihilation-button c-laitela-annihilation-button"
      @click="annihilate"
    >
      <b>Annihilate your Dark Matter Dimensions</b>
    </button>
    <br>
    <br>
    <span v-if="autobuyerUnlocked">
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
        class="c-small-autobuyer-input c-laitela-annihilation-input"
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

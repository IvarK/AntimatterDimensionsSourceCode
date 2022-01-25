<template>
  <div class="l-pelle-celestial-tab">
    <div v-if="isDoomed">
      Pelle here
    </div>
    <button
      v-else
      class="c-pelle-doom-button"
      @click="getDoomedScrub"
    >
      Doom your Reality
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDoomed: false
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
    },
    getDoomedScrub() {
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      Glyphs.unequipAll();
      respecTimeStudies(true);
      Currency.infinityPoints.reset();
      player.infMult = 0;
      Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
      disChargeAll();
    },
  },
};
</script>
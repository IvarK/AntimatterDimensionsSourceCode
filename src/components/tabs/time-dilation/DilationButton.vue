<script>
export default {
  name: "DilationButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(),
      canEternity: false,
      eternityGoal: new Decimal(),
      tachyonGain: new Decimal(),
      remnantRequirement: 0,
      showRequirement: false,
      creditsClosed: false
    };
  },
  computed: {
    disableText() {
      // Doesn't need to be reactive or check strike status; it's always permanent once entered in Doomed
      return Pelle.isDoomed ? "Dilation is permanent." : "Disable Dilation.";
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.dilationUnlocked();
      this.isRunning = player.dilation.active;
      this.remnantRequirement = Pelle.remnantRequirementForDilation;
      this.showRequirement = Pelle.isDoomed && !Pelle.canDilateInPelle;
      if (!this.isRunning) return;
      this.canEternity = Player.canEternity;
      // This lets this.hasGain be true even before eternity.
      this.hasGain = getTachyonGain(false).gt(0);
      if (this.canEternity && this.hasGain) {
        this.tachyonGain.copyFrom(getTachyonGain(true));
      } else if (this.hasGain) {
        this.eternityGoal.copyFrom(Player.eternityGoal);
      } else {
        this.requiredForGain.copyFrom(getTachyonReq());
      }
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    dilate() {
      if (this.creditsClosed) return;
      startDilatedEternityRequest();
    }
  }
};
</script>

<template>
  <button
    class="o-dilation-btn"
    :class="isUnlocked ? 'o-dilation-btn--unlocked' : 'o-dilation-btn--locked'"
    @click="dilate()"
  >
    <span v-if="!isUnlocked">Purchase the Dilation Study to unlock.</span>
    <span v-else-if="!isRunning">
      Dilate time.
      <div v-if="showRequirement">
        Requires {{ format(remnantRequirement, 2) }} Remnants
      </div>
    </span>
    <span v-else-if="canEternity && hasGain">
      {{ disableText }}
      <br>
      Gain {{ quantify("Tachyon Particle", tachyonGain, 2, 1) }}.
    </span>
    <span v-else-if="hasGain">
      {{ disableText }}
      <br>
      Reach {{ quantify("Infinity Point", eternityGoal, 1, 0) }} to Eternity and gain Tachyon Particles.
    </span>
    <span v-else>
      {{ disableText }}
      <br>
      Reach {{ format(requiredForGain, 2, 1) }} antimatter to gain more Tachyon Particles.
    </span>
  </button>
</template>

<style scoped>

</style>

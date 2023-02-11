<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SpectateGame",
  components: { PrimaryButton },
  data() {
    return {
      showSpectate: Boolean
    };
  },
  methods: {
    update() {
      this.showSpectate = GameEnd.endState > END_STATE_MARKERS.SPECTATE_GAME;
      this.endState = GameEnd.endState;
    },
    swap() {
      GameEnd.creditsClosed = !GameEnd.creditsClosed;
      if (!GameEnd.creditsEverClosed) GameEnd.creditsEverClosed = true;
    }
  }
};
</script>

<template>
  <div
    v-if="showSpectate"
    :key="endState"
  >
    <PrimaryButton
      class="c-swap-button o-primary-btn--modal-close c-modal__close-btn tutorial--glow"
      @click="swap"
    >
      <i class="fas fa-sync" />
    </PrimaryButton>
  </div>
</template>

<style scoped>
.c-swap-button {
  position: fixed;
  top: 1rem;
  right: 4.5rem;
  z-index: 10;
  font-size: 2rem;
  opacity: 0.8;
  pointer-events: auto;
  cursor: pointer;
}
</style>
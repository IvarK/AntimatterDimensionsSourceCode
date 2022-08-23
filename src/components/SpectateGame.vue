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
      this.showSpectate = GameEnd.endState > 13.75;
    },
    swap() {
      player.celestials.pelle.creditsClosed = !player.celestials.pelle.creditsClosed;
    }
  }
};
</script>

<template>
  <div
    v-if="showSpectate"
  >
    <PrimaryButton
      class="c-swap-button o-primary-btn--modal-close c-modal__close-btn"
      @click="swap"
    >
      &times;
    </PrimaryButton>
  </div>
</template>

<style scoped>
.c-swap-button {
  position: fixed;
  top: 1rem;
  right: 4.5rem;
  font-size: 2rem;
  opacity: 0.8;
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
}
</style>
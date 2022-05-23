<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "SpectateGame",
  components: { ModalCloseButton },
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
    class="c-spectate-game-container"
  >
    <ModalCloseButton @click="swap" />
  </div>
</template>

<style scoped>
.c-spectate-game-container {
  z-index: 9999;
}
</style>
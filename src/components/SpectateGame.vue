<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "SpectateGame",
  components: { ModalCloseButton },
  data() {
    return {
      creditsClosed: Boolean,
      showSpectate: Boolean
    };
  },
  methods: {
    update() {
      this.creditsClosed = player.celestials.pelle.creditsClosed;
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
    <span
      v-if="creditsClosed"
      ach-tooltip="Go back to New Game selection"
    >
      <ModalCloseButton @click="swap" />
    </span>
    <span
      v-if="!creditsClosed"
      ach-tooltip="Go back to the game"
    >
      <ModalCloseButton @click="swap" />
    </span>
  </div>
</template>

<style scoped>
.c-spectate-game-container {
  z-index: 9999;
}
</style>
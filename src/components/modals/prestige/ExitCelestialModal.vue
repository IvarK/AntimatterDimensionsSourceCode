<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitCelestialModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRestarting: false,
    };
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.isRestarting = player.options.retryCelestial;
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    @close="emitClose"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to exit a Celestial Reality
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        Restarting a Celestial's Reality will reset your Reality and
        immediately enter you into this Celestial again, without the benefits of completing the Celestial.
      </span>
      <span v-else>
        Exiting a Celestial's Reality early will reset your Reality and
        exit the Celestial without the benefits of completing the Celestial.
      </span>
    </div>
    <template #confirm-text>
      {{ isRestarting ? "Restart" : "Exit" }}
    </template>
  </ModalWrapperChoice>
</template>

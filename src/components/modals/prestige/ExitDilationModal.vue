<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitDilationModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      tachyonGain: new Decimal(0),
      isDoomed: false
    };
  },
  computed: {
    gainText() {
      if (this.tachyonGain.lte(0)) return `not gain anything`;
      return `gain ${quantify("Tachyon Particle", this.tachyonGain, 2, 1)}`;
    }
  },
  methods: {
    update() {
      this.tachyonGain.copyFrom(getTachyonGain());
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      if (!player.dilation.active) return;
      const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
      if (playAnimation) {
        animateAndUndilate();
      } else {
        eternity(false, false, { switchingDilation: true });
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dilation"
    @confirm="handleYesClick"
  >
    <template #header>
      <span v-if="isDoomed">
        You cannot exit Dilation while Doomed
      </span>
      <span v-else>
        You are about to exit Dilation
      </span>
    </template>
    <div class="c-modal-message__text">
      <span v-if="isDoomed">
        Dilation is permanent. You will {{ gainText }} and reset your current eternity. You will not gain any
        Eternity Points.
      </span>
      <span v-else>
        If you exit Dilation now, you will {{ gainText }}.
      </span>
      Are you sure you want to proceed?
    </div>
    <template #confirm-text>
      Exit
    </template>
  </ModalWrapperChoice>
</template>

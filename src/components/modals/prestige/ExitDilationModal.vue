<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitDilationModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      tachyonGain: new Decimal(0)
    };
  },
  computed: {
    gainText() {
      if (this.tachyonGain.lte(0)) return `not give you anything`;
      return `give you ${quantify("Tachyon Particle", this.gainTexttachyonGain, 2, 1)}`;
    }
  },
  methods: {
    update() {
      this.tachyonGain.copyFrom(getTachyonGain());
    },
    handleYesClick() {
      if (!player.dilation.active) return;
      const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
      // TODO Dilation modal
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
      You are about to exit Dilation
    </template>
    <div class="c-modal-message__text">
      Exiting Dilation now will {{ gainText }}. Are you sure you want to proceed?
    </div>
    <template #confirm-text>
      Exit
    </template>
  </ModalWrapperChoice>
</template>

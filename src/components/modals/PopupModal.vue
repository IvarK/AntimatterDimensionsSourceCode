<script>
export default {
  name: "PopupModal",
  props: {
    modal: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      showModal: false,
      positionStyle: {},
    };
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
  },
  mounted() {
    this.updatePositionStyles();
  },
  destroyed() {
    document.activeElement.blur();
  },
  methods: {
    update() {
      const oldShowModal = this.showModal;
      // 2.5 is the cutoff point where the screen starts fading (interactivity disabled). However, we specifically
      // want to allow glyph customization to appear at the very end (and nothing else)
      this.showModal = GameEnd.endState <= END_STATE_MARKERS.INTERACTIVITY_DISABLED ||
        this.modal.component.name === "CosmeticSetChoiceModal";
      if (this.showModal !== oldShowModal) this.$nextTick(() => this.updatePositionStyles());
      this.updatePositionStyles();
    },
    updatePositionStyles() {
      if (!this.$refs.modal) return;
      if (!this.showModal || this.$viewModel.theme !== "S12") {
        this.positionStyle = {};
        return;
      }
      const w = this.$refs.modal.offsetWidth, h = this.$refs.modal.offsetHeight;
      // We need to set position style specifically for S12 because using a transform messes things up and
      // makes everything really blurry
      this.positionStyle = {
        left: `${Math.round(innerWidth / 2 - w / 2)}px`,
        top: `${Math.round(innerHeight / 2 - h / 2)}px`,
        transform: "none",
      };
    },
    hide() {
      if (!this.modal.isOpen) return;
      if (this.modal.hide) this.modal.hide();
      else Modal.hide();
    }
  },
};
</script>

<template>
  <div
    v-if="showModal"
    ref="modal"
    class="c-modal l-modal"
    :style="positionStyle"
  >
    <component
      :is="modal.component"
      v-bind="modal.props"
      @close="hide"
    />
  </div>
</template>

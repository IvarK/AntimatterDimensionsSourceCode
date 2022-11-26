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
      showModal: false
    };
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
  },
  destroyed() {
    document.activeElement.blur();
  },
  methods: {
    update() {
      // 2.5 is the cutoff point where the screen starts fading (interactivity disabled). However, we specifically
      // want to allow glyph customization to appear at the very end (and nothing else)
      this.showModal = GameEnd.endState <= END_STATE_MARKERS.INTERACTIVITY_DISABLED ||
        this.modal.component.name === "CosmeticSetChoiceModal";
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
    class="c-modal l-modal"
  >
    <component
      :is="modal.component"
      v-bind="modal.props"
      @close="hide"
    />
  </div>
</template>

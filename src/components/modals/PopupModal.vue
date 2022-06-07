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
      forceDontShowModal: false
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
      // 2.5 is the cutoff point where the screen starts fading
      this.forceDontShowModal = GameEnd.endState > 2.5;
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
  <component
    :is="modal.component"
    v-if="modal.isBare && !forceDontShowModal"
    v-bind="modal.props"
  />
  <div
    v-else-if="!forceDontShowModal"
    class="c-modal l-modal"
  >
    <component
      :is="modal.component"
      v-bind="modal.props"
      @close="hide"
    />
  </div>
</template>

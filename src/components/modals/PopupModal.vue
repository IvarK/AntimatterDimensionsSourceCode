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
      limitSize: false,
      forceDontShowModal: false
    };
  },
  computed: {
    classObject() {
      return {
        "c-modal l-modal": true,
        "c-limit-size": this.limitSize,
      };
    }
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
    // The H2P modal scales dynamically to screen size and limiting it here can cause a double-scrollbar to appear
    this.limitSize = this.modal._component.name !== "H2PModal";
  },
  destroyed() {
    document.activeElement.blur();
  },
  methods: {
    update() {
      // 2.5 is the cutoff point where the screen starts fading (interactivity disabled)
      this.forceDontShowModal = GameEnd.endState > END_STATE_MARKERS.INTERACTIVITY_DISABLED;
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
    v-if="!forceDontShowModal"
    :class="classObject"
  >
    <component
      :is="modal.component"
      v-bind="modal.props"
      @close="hide"
    />
  </div>
</template>

<style scoped>
.c-limit-size {
  max-height: 65rem;
  overflow-y: scroll;
}
</style>
<script>
export default {
  name: "PopupModal",
  props: {
    modal: {
      type: Object,
      required: true,
    }
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
  },
  methods: {
    hide() {
      if (this.modal.hide) this.modal.hide();
      else Modal.hide();
    }
  },
};
</script>

<template>
  <component
    :is="modal.component"
    v-if="modal.isBare"
    :modal-config="modal.props"
  />
  <div
    v-else
    class="c-modal l-modal"
  >
    <component
      :is="modal.component"
      :modal-config="modal.props"
      @close="hide"
    />
  </div>
</template>

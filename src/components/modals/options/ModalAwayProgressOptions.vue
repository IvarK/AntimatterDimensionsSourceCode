<script>
import ModalAwayProgressOptionsEntries from "@/components/modals/options/ModalAwayProgressOptionsEntries";
import ModalOptions from "@/components/modals/options/ModalOptions";

export default {
  components: {
    ModalAwayProgressOptionsEntries,
    ModalOptions,
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    }
  },
};
</script>

<template>
  <ModalOptions
    style="width: 75rem"
    @close="emitClose"
  >
    <div class="c-modal-options__button-container">
      <ModalAwayProgressOptionsEntries
        v-for="name of all"
        :key="name"
        :name="name"
      />
    </div>
    Note: Selected resources will only show if they've increased.
  </ModalOptions>
</template>

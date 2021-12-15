<script>
import ModalTabGroup from "@/components/modals/options/hidden-tabs/ModalTabGroup";
import ModalOptions from "@/components/modals/options/ModalOptions";

export default {
  components: {
    ModalTabGroup,
    ModalOptions,
  },
  data() {
    return {
      tabs: null,
      isEnslaved: false,
    };
  },
  methods: {
    update() {
      // TODO: This makes the entire Tab structure reactive. Fix this.
      this.tabs = Tab;
      this.isEnslaved = Enslaved.isRunning;
    },
  },
};
</script>

<template>
  <ModalOptions
    style="width: auto"
    @close="emitClose"
  >
    <h2>Modify Visible Tabs</h2>
    Click a button to toggle showing a tab on/off.
    <br>
    Some tabs cannot be hidden, and you cannot hide your current tab.
    <br>
    <div v-if="isEnslaved">
      <br>
      <i>You must... see everywhere...</i>
      <br>
      (You cannot hide your tabs within this Reality)
    </div>
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="l-hide-modal-tab-container"
    >
      <ModalTabGroup :tab="tab" />
    </div>
  </ModalOptions>
</template>

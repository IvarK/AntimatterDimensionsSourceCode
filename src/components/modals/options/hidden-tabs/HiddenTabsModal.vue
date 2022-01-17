<script>
import HiddenTabGroup from "@/components/modals/options/hidden-tabs/HiddenTabGroup";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "HiddenTabsModal",
  components: {
    HiddenTabGroup,
    ModalWrapperOptions,
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
  <ModalWrapperOptions
    style="width: auto"
    @close="emitClose"
  >
    <template #header>
      Modify Visible Tabs
    </template>
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
      <HiddenTabGroup :tab="tab" />
    </div>
  </ModalWrapperOptions>
</template>

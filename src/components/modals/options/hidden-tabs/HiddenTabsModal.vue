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
      isEnslaved: false,
      isDoomed: false,
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
  },
  methods: {
    update() {
      this.isEnslaved = Enslaved.isRunning;
      this.isDoomed = Pelle.isDoomed;
    },
  },
};
</script>

<template>
  <ModalWrapperOptions style="width: auto">
    <template #header>
      Modify Visible Tabs
    </template>
    Click a button to toggle showing a tab on/off.
    <br>
    Some tabs cannot be hidden, and you cannot hide your current tab.
    <br>
    Unhiding a tab in which all subtabs are hidden will also unhide all subtabs,
    and hiding all subtabs will also hide the tab.
    <br>
    <div v-if="isDoomed">
      You cannot hide your tabs within Doomed.
    </div>
    <div v-if="isEnslaved">
      <br>
      <i>You must... see everywhere...</i>
      <br>
      (You cannot hide your tabs within this Reality)
    </div>
    <HiddenTabGroup
      v-for="(tab, index) in tabs"
      :key="index"
      :tab="tab"
      class="l-hide-modal-tab-container"
    />
  </ModalWrapperOptions>
</template>

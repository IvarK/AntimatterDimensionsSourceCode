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
      isAlmostEnd: false,
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
  },
  methods: {
    update() {
      this.isEnslaved = Enslaved.isRunning;
      this.isAlmostEnd = Pelle.hasGalaxyGenerator;
    },
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      Modify Visible Tabs
    </template>
    <div class="c-modal--short">
      Click a button to toggle showing a tab on/off.
      <br>
      Some tabs cannot be hidden, and you cannot hide your current tab.
      <br>
      Unhiding a tab in which all subtabs are hidden will also unhide all subtabs,
      and hiding all subtabs will also hide the tab.
      <br>
      <div v-if="isAlmostEnd">
        You cannot hide your tabs after unlocking the Galaxy Generator.
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
        :change-enabled="!isEnslaved && !isAlmostEnd"
        class="l-hide-modal-tab-container"
      />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 62rem;
}

.t-s12 .l-wrapper {
  width: 65rem;
}
</style>
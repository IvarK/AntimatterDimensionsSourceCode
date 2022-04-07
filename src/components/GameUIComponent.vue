<script>
import ClassicUi from "@/components/ui-modes/classic/ClassicUi";
import ModernUi from "@/components/ui-modes/modern/ModernUi";
import TabComponents from "@/components/tabs";
import GameUIFixedComponents from "@/components/GameUIFixedComponents";
import HowToPlay from "@/components/HowToPlay";
import InfoButton from "@/components/InfoButton";

export default {
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    ClassicUi,
    ModernUi,
    GameUIFixedComponents,
    HowToPlay,
    InfoButton
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    uiLayout() {
      return this.view.newUI ? "ModernUi" : "ClassicUi";
    },
    containerClass() {
      return this.view.newUI ? "new-ui" : "old-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    }
  }
};
</script>

<template>
  <div
    v-if="view.initialized"
    id="ui-container"
    :class="containerClass"
    class="ui-wrapper"
  >
    <div
      id="ui"
      class="c-game-ui"
    >
      <component :is="uiLayout">
        <component :is="page" />
      </component>
      <HowToPlay />
      <InfoButton />
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUIFixedComponents />
  </div>
</template>

<style scoped>
.ui-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
}
</style>
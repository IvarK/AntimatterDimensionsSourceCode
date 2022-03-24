import "./save-timer.js";
import "./speedrun-status.js";
import "./help-me.js";
import "./tt-shop.js";
import "./background-animations";
import ClassicUi from "@/components/ui-modes/classic/ClassicUi";
import ModernUi from "@/components/ui-modes/modern/ModernUi";
import ModernSidebar from "@/components/ui-modes/modern/ModernSidebar";
import TabComponents from "@/components/tabs";
import PopupModal from "@/components/modals/PopupModal";
import FadeToBlack from "@/components/tabs/celestial-pelle/FadeToBlack";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";

Vue.component("game-ui", {
  components: {
    ...TabComponents,
    ClassicUi,
    ModernUi,
    ModernSidebar,
    PopupModal,
    FadeToBlack,
    CreditsContainer,
    NewGame
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
  },
  template: `
    <div
      v-if="view.initialized"
      id="ui-container"
      :class="containerClass"
      style="display: flex; justify-content: center;"
    >
      <div id="ui" class="c-game-ui">
        <component :is="uiLayout">
          <component :is="page" />
        </component>
        <PopupModal v-if="view.modal.current" :modal="view.modal.current" />
        <modal-progress-bar v-if="view.modal.progressBar" />
        <link v-if="view.theme !== 'Normal'" type="text/css" rel="stylesheet" :href="themeCss">
        <help-me />
        <background-animations />
      </div>
      <div id="notification-container" class="l-notification-container" />
      <tt-shop v-if="view.subtab === 'studies'" class="l-time-studies-tab__tt-shop" />
      <ModernSidebar v-if="view.newUI" />
      <save-timer />
      <speedrun-status />
      <FadeToBlack />
      <CreditsContainer />
      <NewGame />
    </div>`
});

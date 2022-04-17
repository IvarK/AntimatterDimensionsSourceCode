<script>
import HowToPlay from "@/components/HowToPlay";
import InfoButton from "@/components/InfoButton";
import TimeTheoremShop from "@/components/tabs/time-studies/tt-shop/TimeTheoremShop";
import ModernSidebar from "@/components/ui-modes/modern/ModernSidebar";
import SaveTimer from "@/components/SaveTimer";
import SpeedrunStatus from "@/components/SpeedrunStatus";
import BackgroundAnimations from "@/components/BackgroundAnimations";
import PopupModal from "@/components/modals/PopupModal";
import ModalProgressBar from "@/components/modals/ModalProgressBar";
import FadeToBlack from "@/components/tabs/celestial-pelle/FadeToBlack";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";

export default {
  name: "GameUiFixedComponents",
  components: {
    HowToPlay,
    InfoButton,
    TimeTheoremShop,
    ModernSidebar,
    SaveTimer,
    SpeedrunStatus,
    BackgroundAnimations,
    PopupModal,
    ModalProgressBar,
    FadeToBlack,
    CreditsContainer,
    NewGame
  },
  computed: {
    view() {
      return this.$viewModel;
    }
  }
};
</script>


<template>
  <!-- Hide the button if the automator is in fullscreen mode: Nothing here needs to be visible during fullscreen -->
  <div
    id="ui-fixed"
    class="c-game-ui--fixed"
    :style="{
      visibility: view.tabs.reality.automator.fullScreen ? 'hidden' : 'visible'
    }"
  >
    <div
      id="notification-container"
      class="l-notification-container"
    />
    <HowToPlay />
    <InfoButton />
    <TimeTheoremShop
      v-if="view.subtab === 'studies'"
      class="l-time-studies-tab__tt-shop"
    />
    <ModernSidebar v-if="view.newUI" />
    <SaveTimer />
    <SpeedrunStatus />
    <BackgroundAnimations />
    <PopupModal
      v-if="view.modal.current"
      :modal="view.modal.current"
    />
    <ModalProgressBar v-if="view.modal.progressBar" />
    <FadeToBlack />
    <CreditsContainer />
    <NewGame />
  </div>
</template>

<style scoped>
.c-game-ui--fixed {
  width: 100%;
  height: 100%;
  position: fixed;
  pointer-events: none;

  z-index: 5;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
}
</style>
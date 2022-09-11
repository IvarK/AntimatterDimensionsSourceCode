<script>
import CelestialQuoteHistoryDisplay from "@/components/modals/celestial-quotes/CelestialQuoteHistoryDisplay";
import CelestialQuoteModal from "@/components/modals/celestial-quotes/CelestialQuoteModal";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import FadeAway from "@/components/tabs/celestial-pelle/FadeAway";
import HowToPlay from "@/components/HowToPlay";
import InfoButton from "@/components/InfoButton";
import ModalProgressBar from "@/components/modals/ModalProgressBar";
import ModernSidebar from "@/components/ui-modes/modern/ModernSidebar";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";
import PopupModal from "@/components/modals/PopupModal";
import SaveTimer from "@/components/SaveTimer";
import SpectateGame from "@/components/SpectateGame";
import SpeedrunStatus from "@/components/SpeedrunStatus";
import TimeTheoremShop from "@/components/tabs/time-studies/tt-shop/TimeTheoremShop";

export default {
  name: "GameUiComponentFixed",
  components: {
    HowToPlay,
    InfoButton,
    TimeTheoremShop,
    ModernSidebar,
    SaveTimer,
    SpeedrunStatus,
    PopupModal,
    ModalProgressBar,
    CelestialQuoteModal,
    CelestialQuoteHistoryDisplay,
    FadeAway,
    CreditsContainer,
    SpectateGame,
    NewGame
  },
  data() {
    return {
      rollingCredits: false
    };
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    hideIfMatoFullscreen() {
      return {
        visibility: ui.view.tabs.reality.automator.fullScreen ? "hidden" : "visible"
      };
    }
  },
  methods: {
    update() {
      this.rollingCredits = GameEnd.endState >= 2.5 && !GameEnd.creditsClosed;
    }
  }
};
</script>


<template>
  <!-- Hide the button if the automator is in fullscreen mode: Nothing here needs to be visible during fullscreen -->
  <div
    id="ui-fixed"
    class="c-game-ui--fixed"
  >
    <div
      id="notification-container"
      class="l-notification-container"
    />
    <HowToPlay :style="hideIfMatoFullscreen" />
    <InfoButton :style="hideIfMatoFullscreen" />
    <TimeTheoremShop
      v-if="view.subtab === 'studies'"
      class="l-time-studies-tab__tt-shop"
    />
    <ModernSidebar
      v-if="view.newUI"
      :style="hideIfMatoFullscreen"
    />
    <SaveTimer :style="hideIfMatoFullscreen" />
    <SpeedrunStatus :style="hideIfMatoFullscreen" />
    <ModalProgressBar v-if="view.modal.progressBar" />
    <CelestialQuoteModal
      v-else-if="view.quotes.current"
      :quote="view.quotes.current"
    />
    <CelestialQuoteHistoryDisplay
      v-else-if="view.quotes.history"
      :quotes="view.quotes.history"
    />
    <PopupModal
      v-else-if="view.modal.current"
      :modal="view.modal.current"
    />
    <ModalProgressBar v-if="view.modal.progressBar" />
    <FadeAway v-if="rollingCredits" />
    <CreditsContainer v-if="rollingCredits" />
    <NewGame v-if="rollingCredits" />
    <SpectateGame />
  </div>
</template>

<style scoped>
.c-game-ui--fixed {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  justify-content: center;
  pointer-events: none;
}
</style>

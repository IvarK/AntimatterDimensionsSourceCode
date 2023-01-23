<script>
import CelestialQuoteHistoryDisplay from "@/components/modals/celestial-quotes/CelestialQuoteHistoryDisplay";
import CelestialQuoteModal from "@/components/modals/celestial-quotes/CelestialQuoteModal";
import CreditsContainer from "@/components/tabs/celestial-pelle/CreditsContainer";
import FadeAway from "@/components/tabs/celestial-pelle/FadeAway";
import ModalProgressBar from "@/components/modals/ModalProgressBar";
import NewGame from "@/components/tabs/celestial-pelle/NewGame";
import PopupModal from "@/components/modals/PopupModal";
import SpectateGame from "@/components/SpectateGame";

export default {
  name: "S12UiFixed",
  components: {
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
      ending: false
    };
  },
  computed: {
    view() {
      return this.$viewModel;
    }
  },
  methods: {
    update() {
      this.ending = GameEnd.endState >= END_STATE_MARKERS.FADE_AWAY && !GameEnd.creditsClosed;
    }
  }
};
</script>


<template>
  <span>
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
    <FadeAway v-if="ending" />
    <CreditsContainer v-if="ending" />
    <NewGame v-if="ending" />
    <SpectateGame />
  </span>
</template>

<style scoped>
</style>

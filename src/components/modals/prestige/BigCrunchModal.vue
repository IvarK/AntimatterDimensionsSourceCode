<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

// Note: This modal only shows up on the first infinity and post-break infinities; it won't appear pre-break otherwise
export default {
  name: "BigCrunchModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      gainedInfinities: new Decimal(),
      gainedInfinityPoints: new Decimal()
    };
  },
  computed: {
    isFirstInfinity() {
      return !PlayerProgress.infinityUnlocked();
    },
    message() {
      const info = this.isFirstInfinity ? this.firstIntinityInfo : this.ipGainInfo;
      return `Upon Infinity, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. ${info}`;
    },
    firstIntinityInfo() {
      return `In return, you gain an Infinity Point (IP). This allows you to buy multiple upgrades that you can
        find in the Infinity tab. You will also gain one Infinity, which is the stat shown in the Statistics tab.`;
    },
    ipGainInfo() {
      return `You will gain ${quantify("Infinity Point", this.gainedInfinityPoints, 2, 2)}
        and ${quantify("Infinity", this.gainedInfinities)}.`;
    }
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = gainedInfinityPoints().round();
    },
    handleYesClick() {
      bigCrunchResetRequest();
      EventHub.ui.offAll(this);
      if (this.isFirstInfinity) {
        setTimeout(() => Modal.message.show(`This animation will occur after every manually-triggered Infinity. If
          you would like to disable it, there is a setting to do so in the Options tab. This can be done for any
          visual animation effect in the game after seeing it for the first time.`, {}, 3), 2000);
      }
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="isFirstInfinity ? undefined : 'bigCrunch'"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to Infinity
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>

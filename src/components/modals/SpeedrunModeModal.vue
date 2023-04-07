<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
  },
  data() {
    return {
      onInfoPage: true,
      name: "",
      confirmPhrase: "",
    };
  },
  computed: {
    willStartRun() {
      return this.confirmPhrase === "Gotta Go Fast!";
    },
  },
  methods: {
    nextPage() {
      this.onInfoPage = false;
    },
    startRun() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(Speedrun.generateName(this.name));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!onInfoPage && !willStartRun"
    :show-confirm="!onInfoPage && willStartRun"
    confirm-class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
    @confirm="startRun"
  >
    <template #header>
      Entering Speedrun Mode
    </template>
    <div
      v-if="onInfoPage"
      class="c-modal-message__text"
    >
      This will start a save with additional statistics tracking for when you reach certain points of
      the game. These will be visible in the bottom-right of the screen and on a dedicated subtab of Statistics.
      <br>
      <br>
      Almost all animations and confirmations are disabled by default, but you can change any of these settings before
      you reach their required progression. When you begin the run, the game remains paused until
      your antimatter changes, allowing you to configure all your settings before starting. In order to avoid having
      to wait for a long time before actually starting an optimized run, a few achievements are given for free.
      <br>
      <br>
      <i>
        There is no additional content in Speedrun Mode.
      </i>
      <br>
      <br>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="nextPage"
      >
        Continue
      </PrimaryButton>
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      You can type in text below to name your speedrun save. This will have no effects on gameplay and only identifies
      this particular save as yours. If no name is given, a random name will be generated instead. This name can be
      changed by clicking your name in the speedrun info box, as long as the timer has not started yet.
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
      <br>
      <br>
      Speedrun saves can be imported and exported like regular saves. Importing a speedrun save will mark it as a
      Segmented run, as importing and exporting allows for optimization of individual segments of the game.
      Without importing, saves will remain as Single-segment runs.
      <br>
      <br>
      You can modify the Glyph RNG seed in the Options tab before starting your run, if desired.
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        Starting a speedrun will reset your save to the beginning of the game. Some things will remain, such as
        full-game completion stats, visual settings, automator scripts, and Glyph cosmetics, but otherwise it
        will be as if you had just finished the entire game and chose to restart at the credits screen. Type
        in "Gotta Go Fast!" below to confirm and (re)start the run.
      </div>
      <input
        ref="confirmPhrase"
        v-model="confirmPhrase"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
    </div>
    <template #confirm>
      Start Run!
    </template>
    <template #cancel>
      Cancel
    </template>
  </ModalWrapperChoice>
</template>

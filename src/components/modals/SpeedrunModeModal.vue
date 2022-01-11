<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
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
    cancel() {
      this.emitClose();
    },
    hardReset() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(this.name);
    },
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <ModalCloseButton @click="cancel" />
    <h3>Entering Speedrun Mode</h3>
    <div class="c-modal-message__text">
      Confirming this modal will start a save with additional statistics tracking for when you reach certain points of
      the game. These will be visible in the bottom-right of the screen and on a dedicated subtab of Statistics.
      <br>
      <br>
      All animations and confirmations are disabled by default. When you start the run, the game remains paused until
      your antimatter changes, allowing you to configure all your settings before starting the run. Because of this,
      "Fake News" is given immediately instead of forcing you to wait.
      <br>
      <br>
      You can type in a name below to earmark your speedrun save, if desired. This will have no effects on
      gameplay and only serves to identify this particular save as yours. If no name is given, your save will
      be given a random name instead.
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="cancel"
      >
      <br>
      <br>
      <i>
        There is no additional content in Speedrun Mode which cannot be seen by playing through the
        game normally. This is not a special prestige layer; there are no upgrades or penalties which will
        significantly change the game pace.
      </i>
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        Starting a speedrun will overwrite your current save, replacing the data in the save slot with the new
        speedrun save. Export this save first if you want to keep a save with a beaten game. Type in "Gotta Go Fast!"
        to confirm.
      </div>
    </div>
    <input
      ref="confirmPhrase"
      v-model="confirmPhrase"
      type="text"
      class="c-modal-input c-modal-hard-reset__input"
      @keyup.esc="cancel"
    >
    <PrimaryButton
      v-if="!willStartRun"
      class="o-primary-btn--width-medium c-modal-hard-reset-btn"
      @click="cancel"
    >
      Cancel
    </PrimaryButton>
    <PrimaryButton
      v-else
      class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
      @click="hardReset"
    >
      Start Run!
    </PrimaryButton>
  </div>
</template>

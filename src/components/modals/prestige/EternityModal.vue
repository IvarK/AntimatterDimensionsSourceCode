<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EternityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      exitingEC: false,
      startingIP: new Decimal(),
      gainedEternityPoints: new Decimal(),
    };
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? `Eternity will reset everything except Achievements, Challenge records, and anything under the General header
          on the Statistics tab.`
        : `Eternity will reset everything except Achievements, Challenge records, and anything under the General header
          on the Statistics tab. You will also gain an Eternity Point and unlock various upgrades.`;
    },
    gainedEPOnEternity() {
      return `You will gain ${quantify("Eternity Point", this.gainedEternityPoints, 2)} on Eternity.`;
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? `You will start your next Eternity with ${quantify("Infinity Point", this.startingIP, 2)}.`
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return `Eternity Challenge ${ec.id} is already fully completed.`;
      }
      if (!Perk.studyECBulk.isBought) {
        return `You will gain one completion of Eternity Challenge ${ec.id}.`;
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return `You will gain ${quantifyInt("completion", gainedCompletions)} for Eternity Challenge ${ec.id}.`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
      this.gainedEternityPoints = gainedEternityPoints();
    },
    handleYesClick() {
      if (player.dilation.active && player.options.animations.dilation && document.body.style.animation === "") {
        animateAndUndilate();
        setTimeout(eternity, 1000);
      } else if (!player.dilation.active && player.options.animations.eternity &&
        document.body.style.animation === "") {
        eternityAnimation();
        setTimeout(eternity, 2250);
      } else {
        eternity();
      }
    }
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ exitingEC ? "Complete Eternity Challenge" :"You are about to Eternity" }}
    </template>
    <div v-if="!exitingEC">
      <div class="c-modal-message__text">
        {{ message }}
        <!-- TODO: DILATION EXIT MODAL HI GAMER -->
        <br>
      </div>
      <br>
      <div class="c-modal-message__text">
        {{ gainedEPOnEternity }}
      </div>
      <br>
      <div class="c-modal-message__text">
        {{ startWithIP }}
      </div>
    </div>
    <div v-else>
      <div class="c-modal-message__text">
        {{ eternityChallenge }}
      </div>
    </div>
  </ModalWrapperChoice>
</template>

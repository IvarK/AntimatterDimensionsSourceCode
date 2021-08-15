"use strict";

Vue.component("modal-eternity", {
  data() {
    return {
      exitingEC: false,
      startingIP: new Decimal(0)
    };
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? `Eternity will reset everything except Achievements and challenge records.`
        : `Eternity will reset everything except Achievements and challenge records.
          You will also gain an Eternity Point and unlock various upgrades.`;
    },
    gainedEPOnEternity() {
      return `You will gain ${format(gainedEternityPoints(), 2)} Eternity Points on Eternity.`;
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? `You will start your next Eternity with ${format(this.startingIP, 2)} Infinity Points.`
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return `Eternity Challenge ${ec.id} is already fully completed.`;
      }
      if (!Perk.studyECBulk.isBought) {
        return `You will gain one completion of Eternity Challenge ${EternityChallenge.current.id}.`;
      }

      return `You will gain ${ec.gainedCompletionStatus.gainedCompletions}
        ${pluralize("completion", ec.gainedCompletionStatus.gainedCompletions)} for Eternity Challenge ${ec.id}.`;
    }
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
    },
    handleNoClick() {
      this.emitClose();
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
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <div v-if="!exitingEC">
        <h2>You are about to Eternity</h2>
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
        <h2>Complete Eternity Challenge</h2>
        <div class="c-modal-message__text">
          {{ eternityChallenge }}
        </div>
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Confirm
        </primary-button>
      </div>
    </div>`
});

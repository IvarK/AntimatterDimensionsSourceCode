"use strict";

Vue.component("modal-eternity", {
    computed: {
        message() {
            return `Eternity will reset everything except achievements and challenge records.
            You will also gain an Eternity point and unlock various upgrades.`;
        },
        gainedEPOnEternity() {
            return `You will gain ${format(gainedEternityPoints(), 2)} Eternity Points on Eternity.`;
        },
        startWithIP() {
            return Player.startingIP.gt(0) ? `You will start your next Eternity with ${format(Player.startingIP, 2)} IP.` : ``;
        }
    },
    methods: {
        handleNoClick() {
            this.emitClose();
        },
        handleYesClick() {
            if (player.dilation.active && player.options.animations.dilation && document.body.style.animation === "") {
                undilationAnimation();
                setTimeout(eternity, 1000);
            } else if (!player.dilation.active && player.options.animations.eternity && document.body.style.animation === "") {
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
    <h2>You are about to Eternity</h2>
    <div class="c-modal-message__text">
    {{ message }}
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
    <div class="l-options-grid__row">
    <primary-button
            class="o-primary-btn--width-medium c-modal-message__okay-btn"
            @click="handleNoClick"
          >Cancel</primary-button>
          <primary-button
            class="o-primary-btn--width-medium c-modal-message__okay-btn"
            @click="handleYesClick"
          >Confirm</primary-button>
    </div>
    </div>
    `
});
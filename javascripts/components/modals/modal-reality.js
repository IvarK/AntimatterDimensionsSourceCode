"use strict";

Vue.component("modal-reality", {
    computed: {
        message() {
            return `Reality will reset everything except challenge records. Your achievements are also reset,
                but you will automatically get one back every 30 minutes.
                You will also gain Reality Machines based on your Eternity Points, a glyph with a power level
                based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend on quality of
                life upgrades, and unlock various upgrades.`;
        },
        gainedRMOnReality() {
            return `You will gain ${format(gainedRealityMachines(), 2)} Reality Machines on Reality.`;
        },
        gainedPPOnReality() {
            AlchemyResource.multiversal.isEffectActive ? `` : ``;
            return `You will gain ${format(1)} Perk ${pluralize("Point", player.reality.pp, "Points")}`;
        }
    },
    methods: {
        handleNoClick() {
            this.emitClose();
        },
        handleYesClick() {
            this.emitClose();
            GameUI.notify.info("yes click on modal-reality");
        }
    },
    template: `
        <div class="c-modal-message l-modal-content--centered">
        <h2>You are about to Reality</h2>
        <div class="c-modal-message__text">
        {{ message }}
        <br>
        </div>
    `
});
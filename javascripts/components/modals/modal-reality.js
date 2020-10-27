"use strict";

Vue.component("modal-reality", {
    computed: {
        message() {
            let c = 30;
            if (Perk.achievementGroup1.isBought) c = 20;
            if (Perk.achievementGroup2.isBought) c = 14;
            if (Perk.achievementGroup3.isBought) c = 9;
            if (Perk.achievementGroup4.isBought) c = 5;
            if (Perk.achievementGroup5.isBought) c = 2;
            let d = `Your achievements are also reset, but you will automatically get one back every ${c} minutes.`;
            if (Perk.achievementGroup6.isBought) d = ``;
            return `Reality will reset everything except challenge records. ${d}
                You will also gain Reality Machines based on your Eternity Points, a glyph with a power level
                based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend on quality of
                life upgrades, and unlock various upgrades.`;
        },
        gainedPPAndRealitiesAndRMOnReality() {
            const a = `You will gain ${format(gainedRealityMachines(), 2)} Reality Machines on Reality.`;
            const c = simulatedRealityCount();
            const b = `You will gain ${format(gainedRealityMachines(), 2)} Reality Machines on Reality,
            ${format(c, 2)} Perk ${pluralize("Point", c, "Points")} on Reality, 
            and ${format(c, 2)} ${pluralize("Reality", c, "Realities")} on Reality.`;
            return this.simulatedRealityCount() ? `${b}` : `${a}`;
        },
    },
    methods: {
        handleNoClick() {
            this.emitClose();
        },
        handleYesClick() {
            this.emitClose();
            requestManualReality();
        },
        simulatedRealityCount() {
            return simulatedRealityCount() >= 1;
        },
    },
    template: `
        <div class="c-modal-message l-modal-content--centered">
            <h2>You are about to Reality</h2>
            <div class="c-modal-message__text">
                {{ message }}
                <br>
            </div>
        <br>
        <div class="c-modal-message__text">
            {{ gainedPPAndRealitiesAndRMOnReality }}
        </div>
        <br>
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
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
        gainedPPAndRealitiesOnReality() {
            const b = AlchemyResource.multiversal.effectValue;
            const a = `You will gain ${format(b, 2)} Perk ${pluralize("Point", b, "Points")} on Reality, 
            and ${format(b, 2)} ${pluralize("Reality", b, "Realities")} on Reality.`;
            return AlchemyResource.multiversal.isEffectActive ? `${a}` : ``;
        },
        startWithIP() {
            return Player.startingIP.gte(2e15) ? `You will start your next Reality with 
            ${format(Player.startingIP, 2)} Infinity Points.` : ``;
        },
        startWithEP() {
            return Player.startingEP.gt(0) ? `You will start your next Reality with 
            ${format(Player.startingEP, 2)} Eternity Points.` : ``;
        },
        startWithAM() {
            return Currency.antimatter.startingValue.gte(1e15) ? `You will start your next Reality
            with ${format(Currency.antimatter.startingValue, 2)}` : ``;
        },
        startWithEU() {
            if (Perk.autounlockEU1.isBought && !Perk.autounlockEU2.isbought) {
                return `You will start your next Reality with the first row of Eternity Upgrades.`;
            }
            if (Perk.autounlockEU2.isBought) {
                return `You will start your next Reality with both rows of Eternity Upgrades.`;
            }
            return ``;
        },
        startWithAch() {
            if (!Perk.achievementGroup6.isBought) return ``;
            if (Perk.achievementGroup6.isBought) {
                return `You will start your next Reality with all Normal Achievements.`;
            }
            return ``;
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
        <br>
        <div class="c-modal-message__text">
            {{ gainedRMOnReality }}
        </div>
        <br>
         <div class="c-modal-message__text">
            {{ gainedPPAndRealitiesOnReality }}
        </div>
        <br>
        <div class="c-modal-message__text">
            {{ startWithAM }}
        </div>
        <br> 
        <div class="c-modal-message__text">
            {{ startWithIP }}
        </div>
        <br>
        <div class="c-modal-message__text">
            {{ startWithEP }}
        </div>
        <br>
        <div class="c-modal-message__text">
            {{ startWithEU }}
        </div>
        <br>
        <div class="c-modal-message__text">
            {{ startWithAch }}
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
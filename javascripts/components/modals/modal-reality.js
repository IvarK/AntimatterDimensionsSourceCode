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
        gainedRMOnReality() {
            return `You will gain ${format(gainedRealityMachines(), 2)} Reality Machines on Reality.`;
        },
        gainedPPAndRealitiesOnReality() {
            const b = simulatedRealityCount();
            const a = `You will gain ${format(b, 2)} Perk ${pluralize("Point", b, "Points")} on Reality, 
            and ${format(b, 2)} ${pluralize("Reality", b, "Realities")} on Reality.`;
            return b >= 1 ? `${a}` : ``;
        },
        startWithIP() {
            return this.isPerkBought("startIP1") ? `You will start your next Reality with 
            ${format(Player.startingIP, 2)} Infinity Points.` : ``;
        },
        startWithEP() {
            return this.isPerkBought("startEP1") ? `You will start your next Reality with 
            ${format(Player.startingEP, 2)} Eternity Points.` : ``;
        },
        startWithAM() {
            return this.isPerkBought("startAM1") || this.isPerkBought("achgroup6") ? `You will start your next Reality
            with ${format(Currency.antimatter.startingValue, 2)} Antimatter.` : ``;
        },
        startWithEU() {
            if (this.isPerkBought("autounlockEU1") && !this.isPerkBought("autounlockEU2")) {
                return `You will start your next Reality with the first row of Eternity Upgrades.`;
            }
            if (this.isPerkBought("autounlockEU1") && this.isPerkBought("autounlockEU2")) {
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
            requestManualReality();
        },
        simulatedRealityCount() {
            return simulatedRealityCount() >= 1;
        },
        isPerkBought(perk) {
            if (perk === "startAM1") return Perk.startAM1.isBought;
            if (perk === "startIP1") return Perk.startIP1.isBought;
            if (perk === "autounlockEU1") return Perk.autounlockEU1.isBought;
            if (perk === "autounlockEU2") return Perk.autounlockEU2.isBought;
            if (perk === "achgroup6") return Perk.achievementGroup6.isBought;
            if (perk === "startEP1") return Perk.startEP1.isBought;
            return `Undefined perk in method isPerkBought (${perk})`;
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
            {{ gainedRMOnReality }}
        </div>
        <br>
         <div class="c-modal-message__text" v-if="simulatedRealityCount">
            {{ gainedPPAndRealitiesOnReality }}
            <br>
        </div>
        <div class="c-modal-message__text" v-if="isPerkBought('startAM1')">
            {{ startWithAM }}
            <br>
        </div>
        <div class="c-modal-message__text" v-if="isPerkBought('startIP1')">
            {{ startWithIP }}
        </div>
        <div class="c-modal-message__text" v-if="isPerkBought('startEP1')">
            {{ startWithEP }}
        </div>
        <div class="c-modal-message__text" v-if="isPerkBought('autounlockEU1')">
            {{ startWithEU }}
            <br>
        </div>
        <div class="c-modal-message__text" v-if="isPerkBought('achgroup6')">
            {{ startWithAch }}
            <br>
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
"use strict";

Vue.component("modal-celestials", {
    props: {
        modalConfig: Object,
    },
    data() {
        return {
            description: GameDatabase.celestials.descriptions[this.modalConfig.number].description()
        };
    },
    computed: {
        topLabel() {
            return `${this.modalConfig.name} Reality.`;
        },
        message() {
            return `Perform a Reality reset, and enter ${this.modalConfig.name} Reality, in which
            ${isEnslaved ? `` : this.description}`;
        },
        goal() {
            return ``;
        },
        reward() {
            return ``;
        },
        descriptionLines() {
            return this.description.split("\n");
        },
        isEnslaved() {
            return this.modalConfig.number === 2;
        }
    },
    methods: {
        handleYesClick() {
            if (this.modalConfig.number === 0) Teresa.initializeRun();
            if (this.modalConfig.number === 1) Effarig.initializeRun();
            if (this.modalConfig.number === 2) {
                // This needs to be added here before the reset so that TD autobuyers don't buy too much on start
                player.celestials.enslaved.run = true;
                Enslaved.initializeRun();
            }
            if (this.modalConfig.number === 3) V.initializeRun();
            this.emitClose();
        },
        handleNoClick() {
            this.emitClose();
        }
    },
    template: `
        <div class="c-modal-message l-modal-content--centered">
            <h2>{{ topLabel }}</h2>
            <div class="c-modal-message__text">
                {{ message }}
            <div v-if="isEnslaved" v-for="description in descriptionLines">
                {{ description }}
            </div>
                <br>
            </div>
            <div class="l-options-grid__row">
                <primary-button
                    class="o-primary-btn--width-medium c-modal-message__okay-btn"
                    @click="handleNoClick"
                >Cancel</primary-button>
                <primary-button
                    class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
                    @click="handleYesClick"
                >Begin</primary-button>
            </div>
        </div>
    `
});
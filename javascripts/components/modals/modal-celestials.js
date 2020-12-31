"use strict";

Vue.component("modal-celestials", {
    props: {
        modalConfig: Object,
    },
    data() {
        return {
            description: GameDatabase.celestials.descriptions[this.modalConfig.number].description().split("\n"),
        };
    },
    computed: {
        topLabel() {
            return `${this.modalConfig.name} Reality.`;
        },
        message() {
            return `Perform a Reality reset, and enter ${this.modalConfig.name} Reality, in which`;
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
        pets: () => [
          {
            pet: Ra.pets.teresa,
            color: `color: ${Ra.pets.teresa.color}`,
            memory: "Eternity Points"
          },
          {
            pet: Ra.pets.effarig,
            color: `color: ${Ra.pets.effarig.color}`,
            memory: "Relic Shards gained"
          },
          {
            pet: Ra.pets.enslaved,
            color: `color: ${Ra.pets.enslaved.color}`,
            memory: "Time Shards"
          },
          {
            pet: Ra.pets.v,
            color: `color: ${Ra.pets.v.color}`,
            memory: "Infinity Power"
          }
        ],
    },
    methods: {
        handleYesClick() {
          switch (this.modalConfig.number) {
            case 0:
              Teresa.initializeRun();
              break;
            case 1:
              Effarig.initializeRun();
              break;
            case 2:
              player.celestials.enslaved.run = true;
              Enslaved.initializeRun();
              break;
            case 3:
              V.initializeRun();
              break;
            case 4:
              Ra.initializeRun();
              break;
            case 5:
              Laitela.initializeRun();
              break;
            case 6:
              throw new Error(`Pelle confirmations not implemented yet.`);
            default:
              throw new Error(`Attempted to start an Unknown Celestial in Celestial Modal Confirmation.`);
          }
          this.emitClose();
        },
        handleNoClick() {
            this.emitClose();
        },
    },
    template: `
        <div class="c-modal-message l-modal-content--centered">
            <h2>{{ topLabel }}</h2>
            <div class="c-modal-message__text">
                {{ message }}
            <span v-for="desc in description">
                {{ desc }} <br>
            </span>
            <div v-for="pet in pets" v-if="modalConfig.number === 4">
              <span :style="pet.color" v-if="pet.pet.isUnlocked">
              {{ pet.pet.name }} gains Memories Chunks based on {{ pet.memory}}.
              <br></span>
            </div>
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
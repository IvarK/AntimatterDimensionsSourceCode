"use strict";

Vue.component("modal-celestials", {
  components: {
    "modal-ra-pet-display": {
      props: {
        petId: Number
      },
      data() {
        return {
          pet: Ra.pets.all[this.petId],
          isUnlocked: Boolean,
          name: String,
          color: String,
          chunkGain: String,
        };
      },
      methods: {
        update() {
          const pet = this.pet;
          this.isUnlocked = pet.isUnlocked;
          this.name = pet.name;
          this.color = `color: ${pet.color}`;
          this.chunkGain = pet.chunkGain;
        }
      },
      template: `
        <span :style="color" v-if="isUnlocked">
          {{ name }} gains Memories Chunks based on {{ chunkGain }}.
          <br>
        </span>`
    },
  },
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
        <modal-ra-pet-display v-if="modalConfig.number === 4" v-for="id in 4" :key="id" :petId="id - 1" />
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

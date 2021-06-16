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
      return `${this.modalConfig.name} Reality`;
    },
    message() {
      return `Perform a Reality reset, and enter ${this.modalConfig.name} Reality, in which`;
    },
  },
  methods: {
    extraLine() {
      const teresaBestAM = player.celestials.teresa.bestRunAM;
      const teresaRunMult = Teresa.runRewardMultiplier;
      const effarigStage = Effarig.currentStage;
      const effarigDone = effarigStage === EFFARIG_STAGES.COMPLETED;
      const effarigLayer = [null, "Infinity", "Eternity", "Reality"][effarigStage];
      const enslavedDone = Enslaved.isCompleted;
      const vAlchemy = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      const laitelaFastest = player.celestials.laitela.fastestCompletion;
      const laitalaTime = TimeSpan.fromSeconds(laitelaFastest).toStringShort();

      switch (this.modalConfig.number) {
        case 0: return `Your highest Teresa completetion was for ${format(teresaBestAM, 2, 2)}
                        antimatter, gaining you a ${formatX(teresaRunMult, 2)} multiplier to Glyph Sacrifice power.`;
        case 1: return `${effarigDone ? "Effarig is completed!" : `You are currently on the ${effarigLayer} Layer.`}`;
        case 2: return `${enslavedDone ? "Have... I... not helped enough..." : "I... can help... Let me... help..."}`;
        case 3: return `${vAlchemy ? "The Exponential Glyph Alchemy effect is disabled." : ""}`;
        case 4: return `Inside of Ra's Reality, some resources will generate Memory Chunks
                        for a specific Pet based on their amount.`;
        case 5: return `${laitelaFastest >= 300
          ? "You have not completed Lai'tela at this tier" : `Your fastest completion on this tier is ${laitalaTime}`
        }.`;
        case 6: return `Pe-lle is Dea-th. You is Doo-med.`;
        default: throw new Error(`Attempted to start an Unknown Celestial in Celestial Modal Confirmation.`);
      }
    },
    handleYesClick() {
      this.emitClose();
      beginProcessReality(getRealityProps(true));
      switch (this.modalConfig.number) {
        case 0: return Teresa.initializeRun();
        case 1: return Effarig.initializeRun();
        case 2: return Enslaved.initializeRun();
        case 3: return V.initializeRun();
        case 4: return Ra.initializeRun();
        case 5: return Laitela.initializeRun();
        case 6: throw new Error(`Pelle confirmations not implemented yet.`);
        default: throw new Error(`Attempted to start an Unknown Celestial in Celestial Modal Confirmation.`);
      }
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
        <div>{{ extraLine() }}</div>
        <modal-ra-pet-display v-if="modalConfig.number === 4" v-for="id in 4" :key="id" :petId="id - 1" />
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
          Begin
        </primary-button>
      </div>
    </div>`
});

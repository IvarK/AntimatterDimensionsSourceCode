<script>
import PrimaryButton from "@/components/PrimaryButton";
import EnterCelestialsRaPet from "@/components/modals/prestige/EnterCelestialsRaPet";

export default {
  name: "EnterCelestialsModal",
  components: {
    PrimaryButton,
    EnterCelestialsRaPet,
  },
  props: {
    modalConfig: {
      type: Object,
      required: true,
    }
  },
  computed: {
    description() {
      return GameDatabase.celestials.descriptions[this.modalConfig.number].description().split("\n");
    },
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
        case 1: return `${effarigDone
          ? "Effarig is completed!"
          : `You are currently on the ${effarigLayer} Layer.`
        }`;
        case 2: return `${enslavedDone
          ? "Have... I... not helped enough..."
          : "I... can help... Let me... help..."
        }`;
        case 3: return `${vAlchemy
          ? "The Exponential Glyph Alchemy effect is disabled."
          : ""
        }`;
        case 4: return `Inside of Ra's Reality, some resources will generate Memory Chunks
          for a specific Pet based on their amount.`;
        case 5: return `${laitelaFastest >= 300
          ? "You have not completed Lai'tela at this tier"
          : `Your fastest completion on this tier is ${laitalaTime}`
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
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ topLabel }}</h2>
    <div class="c-modal-message__text">
      {{ message }}
      <span
        v-for="(desc, i) in description"
        :key="i"
      >
        {{ desc }} <br>
      </span>
      <div>
        {{ extraLine() }}
      </div>
      <span v-if="modalConfig.number === 4">
        <EnterCelestialsRaPet
          v-for="id in 4"
          :key="id"
          :pet-id="id - 1"
        />
      </span>
    </div>
    <div class="l-options-grid__row">
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >
        Cancel
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >
        Begin
      </PrimaryButton>
    </div>
  </div>
</template>

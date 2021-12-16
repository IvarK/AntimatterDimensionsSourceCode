<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
    };
  },
  computed: {
    message() {
      if (Achievement(118).isUnlocked) {
        return `Dimensional Sacrifice will give you a boost to the 8th Antimatter Dimension based on the amount of
          1st Antmatter Dimensions you had at the time of Sacrificing.`;
      }
      return `Dimensional Sacrifice will remove all of your 1st through 7th Antimatter Dimensions
        (with the cost and multiplier unchanged), for a boost to the 8th Antimatter Dimension based on the total
        amount of 1st Antimatter Dimensions sacrificed. It will take time to regain production.`;
    },
    currently() {
      return `Multiplier is currently ${formatX(this.currentMultiplier, 2, 2)}.`;
    },
    afterSacrifice() {
      return `Multiplier will increase to ${formatX(this.nextMultiplier, 2, 2)}
        on Dimensional Sacrifice.`;
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, this.emitClose);
    this.on$(GAME_EVENT.GALAXY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(Sacrifice.totalBoost);
      this.nextMultiplier.copyFrom(Sacrifice.nextBoost.times(Sacrifice.totalBoost));
    },
    handleNoClick() {
      this.emitClose();
    },
    handleYesClick() {
      sacrificeReset();
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>Dimensional Sacrifice</h2>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ currently }}
      <br>
      {{ afterSacrifice }}
      <br>
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
        Confirm
      </PrimaryButton>
    </div>
  </div>
</template>

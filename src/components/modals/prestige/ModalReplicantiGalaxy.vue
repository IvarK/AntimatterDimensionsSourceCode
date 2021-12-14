<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
  data() {
    return {
      replicanti: new Decimal(),
      divideReplicanti: false,
      canBeBought: 0,
    };
  },
  computed: {
    topLabel() {
      return `You are about to purchase ${quantifyInt("Replicanti Galaxy", this.canBeBought)}`;
    },
    message() {
      const reductionString = this.divideReplicanti
        ? `divide your Replicanti by ${format(Number.MAX_VALUE, 2, 2)} for each Replicanti Galaxy purchased
          (${format(this.replicanti, 2, 2)} to
          ${format(this.replicanti.divide(Decimal.NUMBER_MAX_VALUE.pow(this.canBeBought)), 2, 2)})`
        : `reset your Replicanti to ${formatInt(1)}`;
      return `A Replicanti Galaxy boosts Tickspeed the same way an Antimatter Galaxy does. However, it does not
        increase the cost of Antimatter Galaxies, nor is it affected by multipliers to Antimatter Galaxies specifically.
        It will ${reductionString}.`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.divideReplicanti = Achievement(126).isUnlocked;
      this.canBeBought = Replicanti.galaxies.gain;
      if (this.replicanti.lt(Number.MAX_VALUE)) this.emitClose();
    },
    handleYesClick() {
      replicantiGalaxy();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ topLabel }}</h2>
    <div class="c-modal-message__text">
      {{ message }}
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

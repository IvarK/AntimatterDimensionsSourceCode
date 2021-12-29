<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AntimatterGalaxyModal",
  components: {
    PrimaryButton
  },
  props: {
    modalConfig: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      newGalaxies: 0,
      keepAntimatter: false,
      perkANRBought: false,
      keepDimBoost: false,
    };
  },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      if (this.bulk) return `You are about to purchase ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}`;
      return `You are about to purchase an Antimatter Galaxy`;
    },
    message() {
      const resetResouces = [];
      if (!this.perkANRBought) resetResouces.push("Antimatter Dimensions", "Tickspeed");
      if (!this.keepDimBoost) resetResouces.push("Dimension Boosts");
      if (!this.keepAntimatter && !this.perkANRBought) resetResouces.push("Antimatter");
      const resetList = makeEnumeration(resetResouces);
      const tickspeedInfo = "you will receive a small boost to Tickspeed upgrades.";
      const message = (resetList === "")
        ? `This will reset nothing, and ${tickspeedInfo}`
        : `This will reset your ${resetList}. However, ${tickspeedInfo}`;

      if (this.bulk) return `Are you sure you want to purchase
      ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}? ${message}`;
      return `Are you sure you want to purchase an Antimatter Galaxy? ${message}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, () =>
      (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought ? undefined : this.emitClose()));
    this.on$(GAME_EVENT.BIG_CRUNCH_AFTER, this.emitClose);
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = bulkBuyBinarySearch(dim.totalAmount, {
          costFunction: x => Galaxy.requirementAt(x).amount,
          cumulative: false,
        }, player.galaxies);
        if (bulk) {
          this.newGalaxies = Galaxy.buyableGalaxies(Math.round(dim.totalAmount.toNumber())) - player.galaxies;
        }
      }
      this.keepAntimatter = Achievement(111).isUnlocked;
      this.perkANRBought = Perk.antimatterNoReset.isBought;
      this.keepDimBoost = Achievement(143).isUnlocked;
    },
    handleYesClick() {
      this.emitClose();
      requestGalaxyReset(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
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

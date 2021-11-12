"use strict";

Vue.component("modal-antimatter-galaxy", {
  props: { modalConfig: Object },
  data() {
    return {
      newGalaxies: 0,
      achievement111Unlocked: false,
      perkANRBought: false,
    };
  },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      if (this.bulk) return `You are about to purchase ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}`;
      return `You are about to purchase an Antimatter Galaxy`;
    },
    message() {
      let message = "";
      if (this.perkANRBought) message = `This will reset nothing, and you will receive a small
         boost to Tickspeed upgrades.`;
      else if (this.achievement111Unlocked) message = `This will reset all of your Antimatter Dimensions, 
        your Dimension Boosts, and Tickspeed. However, you will receive a small boost 
        to Tickspeed upgrades.`;
      else message = `This will reset all of your Antimatter Dimensions, your Dimension Boosts, 
        Tickspeed, and Antimatter. However, you will receive a small boost to Tickspeed upgrades.`;
      if (this.bulk) return `Are you sure you want to purchase 
      ${quantifyInt("Antimatter Galaxy", this.newGalaxies)}? ${message}`;
      return `Are you sure you want to purchase an Antimatter Galaxy? 
      ${message}`;
    }
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = bulkBuyBinarySearch(dim.amount, {
          costFunction: x => Galaxy.requirementAt(x).amount,
          cumulative: false,
        }, player.galaxies);
        if (bulk) {
          this.newGalaxies = Math.max(this.newGalaxies,
            Galaxy.buyableGalaxies(Math.round(dim.amount.toNumber())) - player.galaxies);
        }
      }
      this.achievement111Unlocked = Achievement(111).isUnlocked;
      this.perkANRBought = Perk.antimatterNoReset.isBought;
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
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ topLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
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
          Confirm
        </primary-button>
      </div>
    </div>`
});
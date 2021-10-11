"use strict";

Vue.component("modal-antimatter-galaxy", {
  props: { modalConfig: Object },
  data() {
    return {
      newGalaxies: 0,
    };
  },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      if (this.bulk) return `You are about to purchase ${formatInt(this.newGalaxies, 2)} 
      ${pluralize("Antimatter Galaxy", this.newGalaxies, "Antimatter Galaxies")}`;
      return `You are about to purchase an Antimatter Galaxy`;
    },
    message() {
      let message = "";
      if (Perk.antimatterNoReset.isBought) message = `This will reset nothing, and you will receive a small
         (but impactful) boost to tickspeed upgrades.`;
      if (Achievement(111).isUnlocked) message = `This will reset all of your Antimatter Dimensions, 
        your Dimension Boosts, and tickspeed. However, you will receive a small (but impactful) boost 
        to tickspeed upgrades.`;
      message = `This will reset all of your Antimatter Dimensions, your Dimension Boosts, 
        tickspeed, and Antimatter. However, you will receive a small (but impactful) boost to tickspeed upgrades.`;
      if (this.bulk) return `Are you sure you want to purchase ${formatInt(this.newGalaxies, 2)} 
      ${pluralize("Antimatter Galaxy", this.newGalaxies, "Antimatter Galaxies")}? ${message}`;
      return `Are you sure you want to purchase an Antimatter Galaxy? 
      ${message}`;
    }
  },
  methods: {
    update() {
      const req = Galaxy.requirement;
      const dim = AntimatterDimension(req.tier);
      const bulk = bulkBuyBinarySearch(new Decimal(dim.amount.toNumber()), {
        costFunction: x => Galaxy.requirementAt(x).amount,
        cumulative: false,
      }, player.galaxies);
      // This is so finicky lul but it WORKS! Basically bulk is just the thing from buyableGalaxies, and that's
      // what causes the error (https://i.imgur.com/xjR3NYu.gif) so basically I was like "well hey if it causes it
      // there let's stop that from ever happening in the first place" and lo and behold this is what I got.
      if (bulk) {
        if (Galaxy.buyableGalaxies(Math.round(dim.amount.toNumber())) > this.newGalaxies) {
          this.newGalaxies = Galaxy.buyableGalaxies(Math.round(dim.amount.toNumber())) - player.galaxies;
        }
      }
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
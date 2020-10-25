"use strict"; 

Vue.component("modal-sacrifice", {
    computed: {
        message() {
            if (!Achievement(118).isUnlocked) {
            return `Dimensional Sacrifice will remove all of your 1st through 7th Antimatter Dimensions
            (with the cost and multiplier unchanged), for a boost to the 8th Antimatter Dimension based on the total
            amount of 1st Antimatter Dimensions sacrificed. It will take time to regain production.`;
            }
            return `Dimensional Sacrifice will give you a boost to the 8th Antimatter Dimension based on the amount of 
            1st Antmatter Dimensions you had at the time of Sacrificing.`;
        },
        currently() {
            return `Multiplier is currently ${formatX(Sacrifice.totalBoost, 2)}.`;
        },
        afterSacrifice() {
            return `Multiplier increases to ${formatX(Sacrifice.nextBoost.times(Sacrifice.totalBoost), 2)} 
            on Dimensional Sacrifice.`;
        }
    },
    methods: {
        handleNoClick() {
            this.emitClose();
        },
        handleYesClick() {
            sacrificeReset();
            this.emitClose();
        }
    },
    template:
        `<div class="c-modal-message l-modal-content--centered">
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
            <primary-button
            class="o-primary-btn--width-medium c-modal-message__okay-btn"
            @click="handleNoClick"
          >Cancel</primary-button>
          <primary-button
            class="o-primary-btn--width-medium c-modal-message__okay-btn"
            @click="handleYesClick"
          >Confirm</primary-button>
          </div>
        </div>
        `
    }
);
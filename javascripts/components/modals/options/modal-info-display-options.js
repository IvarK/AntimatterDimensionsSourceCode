"use strict";

Vue.component("modal-info-display-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      achievements: false,
      challenges: false,
      studies: false,
      realityUpgrades: false,
      perks: false,
      alchemy: false,
    };
  },
  watch: {
    achievements(newValue) {
      player.options.showHintText.achievements = newValue;
    },
    challenges(newValue) {
      player.options.showHintText.challenges = newValue;
    },
    studies(newValue) {
      player.options.showHintText.studies = newValue;
    },
    realityUpgrades(newValue) {
      player.options.showHintText.realityUpgrades = newValue;
    },
    perks(newValue) {
      player.options.showHintText.perks = newValue;
    },
    alchemy(newValue) {
      player.options.showHintText.alchemy = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options.showHintText;
      this.achievements = options.achievements;
      this.challenges = options.challenges;
      this.studies = options.studies;
      this.realityUpgrades = options.realityUpgrades;
      this.perks = options.perks;
      this.alchemy = options.alchemy;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="achievements" text="Achievement IDs:"/>
      <on-off-button v-if="infinityUnlocked" v-model="challenges" text="Challenge IDs:"/>
      <on-off-button v-if="eternityUnlocked" v-model="studies" text="Time Study IDs:"/>
      <on-off-button v-if="realityUnlocked" v-model="realityUpgrades" text="Reality Upgrade IDs:"/>
      <on-off-button v-if="realityUnlocked" v-model="perks" text="Perk IDs:"/>
      <on-off-button v-if="alchemyUnlocked" v-model="alchemy" text="Alchemy resource amounts:"/>
      Note: All types of additional info above will always display when holding shift.
    </modal-options>`
});

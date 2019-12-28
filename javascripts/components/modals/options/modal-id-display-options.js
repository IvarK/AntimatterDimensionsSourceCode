"use strict";

Vue.component("modal-id-display-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      achievements: false,
      challenges: false,
      studies: false,
      realityUpgrades: false,
      perks: false,
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
  },
  methods: {
    update() {
      const options = player.options.showHintText;
      this.achievements = options.achievements;
      this.challenges = options.challenges;
      this.studies = options.studies;
      this.realityUpgrades = options.realityUpgrades;
      this.perks = options.perks;
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="achievements" text="Achievements:"/>
      <on-off-button v-if="infinityUnlocked" v-model="challenges" text="Challenges:"/>
      <on-off-button v-if="eternityUnlocked" v-model="studies" text="Time Studies:"/>
      <on-off-button v-if="realityUnlocked" v-model="realityUpgrades" text="Reality Upgrades:"/>
      <on-off-button v-if="realityUnlocked" v-model="perks" text="Perks:"/>
      Note: IDs will always display when holding shift.
    </modal-options>`
});

import { modalOptionsMixin } from "./modal-options.js";

Vue.component("modal-info-display-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      achievements: false,
      achievementUnlockStates: false,
      challenges: false,
      studies: false,
      newGlyphs: false,
      glyphEffectDots: false,
      realityUpgrades: false,
      perks: false,
      alchemy: false,
    };
  },
  watch: {
    achievements(newValue) {
      player.options.showHintText.achievements = newValue;
    },
    achievementUnlockStates(newValue) {
      player.options.showHintText.achievementUnlockStates = newValue;
    },
    challenges(newValue) {
      player.options.showHintText.challenges = newValue;
    },
    studies(newValue) {
      player.options.showHintText.studies = newValue;
    },
    newGlyphs(newValue) {
      player.options.showNewGlyphIcon = newValue;
    },
    glyphEffectDots(newValue) {
      player.options.showHintText.glyphEffectDots = newValue;
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
      this.achievementUnlockStates = options.achievementUnlockStates;
      this.challenges = options.challenges;
      this.studies = options.studies;
      this.newGlyphs = player.options.showNewGlyphIcon;
      this.glyphEffectDots = options.glyphEffectDots;
      this.realityUpgrades = options.realityUpgrades;
      this.perks = options.perks;
      this.alchemy = options.alchemy;
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 50rem">
      <div class="c-modal-options__button-container">
        <wide-on-off-button v-model="achievements" text="Achievement IDs:" />
        <wide-on-off-button v-model="achievementUnlockStates" text="Achievement unlock state indicators:" />
        <wide-on-off-button v-if="infinityUnlocked" v-model="challenges" text="Challenge IDs:" />
        <wide-on-off-button v-if="eternityUnlocked" v-model="studies" text="Time Study IDs:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="newGlyphs" text="New Glyph identifier:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="glyphEffectDots" text="Glyph effect dots:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="realityUpgrades" text="Reality Upgrade names:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="perks" text="Perk IDs:" />
        <wide-on-off-button v-if="alchemyUnlocked" v-model="alchemy" text="Alchemy resource amounts:" />
      </div>
      Note: All types of additional info above will always display when holding shift.
    </modal-options>`
});

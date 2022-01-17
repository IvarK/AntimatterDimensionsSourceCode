<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "InfoDisplayOptionsModal",
  components: {
    ModalOptionsToggleButton,
    ModalWrapperOptions,
  },
  data() {
    return {
      infinityUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      alchemyUnlocked: false,

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
      const progress = PlayerProgress.current;
      this.infinityUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      this.realityUnlocked = progress.isRealityUnlocked;
      this.alchemyUnlocked = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);

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
};
</script>

<template>
  <ModalWrapperOptions
    class="c-modal-options__large"
    @close="emitClose"
  >
    <template #header>
      Info Display Options Modal
    </template>
    <div class="c-modal-options__button-container">
      <ModalOptionsToggleButton
        v-model="achievements"
        text="Achievement IDs:"
      />
      <ModalOptionsToggleButton
        v-model="achievementUnlockStates"
        text="Achievement unlock state indicators:"
      />
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="challenges"
        text="Challenge IDs:"
      />
      <ModalOptionsToggleButton
        v-if="eternityUnlocked"
        v-model="studies"
        text="Time Study IDs:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="newGlyphs"
        text="New Glyph identifier:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="glyphEffectDots"
        text="Glyph effect dots:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="realityUpgrades"
        text="Reality Upgrade names:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="perks"
        text="Perk IDs:"
      />
      <ModalOptionsToggleButton
        v-if="alchemyUnlocked"
        v-model="alchemy"
        text="Alchemy resource amounts:"
      />
    </div>
    Note: All types of additional info above will always display when holding shift.
  </ModalWrapperOptions>
</template>

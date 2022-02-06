<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ChallengeTabHeader",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isInChallenge: false,
      isShowAllVisible: false,
      isAutoECVisible: false,
      showAllChallenges: false,
      autoEC: false,
    };
  },
  watch: {
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.isInChallenge = Player.isInAnyChallenge;
      this.isShowAllVisible = PlayerProgress.eternityUnlocked();
      this.isAutoECVisible = Perk.autocompleteEC1.isBought && !Pelle.isDoomed;
      this.autoEC = player.reality.autoEC;
    },
    restartChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
        current.start();
      }
    },
    exitChallenge() {
      const current = Player.anyChallenge;
      if (Player.isInAnyChallenge) {
        current.exit();
      }
    },
  }
};
</script>

<template>
  <div class="l-challenges-tab__header">
    <div
      v-if="isShowAllVisible || isAutoECVisible || isInChallenge"
      class="c-subtab-option-container"
    >
      <PrimaryToggleButton
        v-if="isShowAllVisible"
        v-model="showAllChallenges"
        class="o-primary-btn--subtab-option"
        label="Show all known challenges:"
      />
      <PrimaryToggleButton
        v-if="isAutoECVisible"
        v-model="autoEC"
        class="o-primary-btn--subtab-option"
        label="Auto Eternity Challenges:"
      />
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="restartChallenge"
      >
        Restart Challenge
      </PrimaryButton>
      <PrimaryButton
        v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="exitChallenge"
      >
        Exit Challenge
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>

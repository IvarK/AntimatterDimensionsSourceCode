"use strict";

Vue.component("infinity-challenges-tab", {
  components: {
    "infinity-challenge-box": {
      props: {
        challengeId: Number
      },
      data() {
        return {
          isUnlocked: false,
          isRunning: false,
          isCompleted: false
        };
      },
      computed: {
        challenge() {
          return InfinityChallenge(this.challengeId);
        },
        config() {
          return this.challenge.config;
        },
        name() {
          return `IC${this.challengeId}`;
        }
      },
      methods: {
        update() {
          const challenge = this.challenge;
          this.isUnlocked = challenge.isUnlocked;
          this.isRunning = challenge.isRunning;
          this.isCompleted = challenge.isCompleted;
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="isUnlocked"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          class="c-challenge-box--infinity"
          @start="challenge.requestStart()"
        >
          <template slot="top">
            <description-display :config="config" />
            <effect-display v-if="isRunning" :config="config" />
          </template>
          <div slot="bottom" class="l-challenge-box__bottom--infinity">
            <span>Goal: {{format(config.goal, 0, 0)}} antimatter</span>
            <description-display :config="config.reward" title="Reward:"/>
            <effect-display v-if="isCompleted" :config="config.reward" />
          </div>
        </challenge-box>`
    }
  },
  data() {
    return {
      postChallUnlocked: 0,
      showAllChallenges: false
    };
  },
  computed: {
    nextAtDisplay() {
      const next = this.postChallUnlocked < 8
        ? InfinityChallenge(this.postChallUnlocked + 1).config.unlockAM
        : undefined;
      return next === undefined
        ? "All Infinity Challenges unlocked"
        : `Next challenge unlocks at ${format(next, 0, 0)} antimatter.`;
    }
  },
  methods: {
    update() {
      this.postChallUnlocked = player.postChallUnlocked;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(id) {
      return player.postChallUnlocked >= id || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  },
  template:
    `<div class="l-challenges-tab">
      <challenges-header/>
      <div>{{nextAtDisplay}}</div>
      <challenge-grid :count="8" :isChallengeVisible="isChallengeVisible">
        <infinity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

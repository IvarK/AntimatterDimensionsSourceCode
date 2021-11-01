"use strict";

Vue.component("eternity-challenges-tab", {
  components: {
    "eternity-challenge-box": {
      props: {
        challengeId: Number
      },
      data() {
        return {
          isUnlocked: false,
          isRunning: false,
          isCompleted: false,
          canBeUnlocked: false,
          completions: 0,
          showGoalSpan: false,
          enslavedSpanOverride: false,
        };
      },
      computed: {
        challenge() {
          return EternityChallenge(this.challengeId);
        },
        config() {
          return this.challenge.config;
        },
        rewardConfig() {
          return this.config.reward;
        },
        goalDisplay() {
          const config = this.config;
          let goal = `Goal: ${this.goalAtCompletions(this.completions)} IP`;
          if (config.restriction) {
            goal += ` ${config.formatRestriction(config.restriction(this.completions))}`;
          }
          return goal;
        },
        firstGoal() {
          return this.goalAtCompletions(0);
        },
        lastGoal() {
          const goal = this.goalAtCompletions(this.challenge.maxCompletions - 1);
          if (this.enslavedSpanOverride) {
            // Fuck up the text
            let mangled = "";
            for (let idx = 0; idx < goal.length; ++idx) {
              const badChar = Math.random() > 0.4 ? goal.charCodeAt(idx) : Math.floor(Math.random() * 65000 + 65);
              mangled += String.fromCharCode(badChar);
            }
            return mangled;
          }
          return goal;
        },
        currentRewardConfig() {
          const challenge = this.challenge;
          const config = this.config.reward;
          return {
            effect: () => config.effect(challenge.completions),
            formatEffect: config.formatEffect,
            cap: config.cap,
          };
        },
        nextRewardConfig() {
          const challenge = this.challenge;
          const config = this.config.reward;
          return {
            effect: () => config.effect(challenge.completions + 1),
            formatEffect: config.formatEffect,
            cap: config.cap,
          };
        },
        name() {
          return `EC${this.challengeId}`;
        }
      },
      methods: {
        update() {
          const challenge = this.challenge;
          this.isUnlocked = challenge.isUnlocked;
          this.isRunning = challenge.isRunning;
          this.isCompleted = challenge.isFullyCompleted;
          this.completions = challenge.completions;
          this.showGoalSpan = PlayerProgress.realityUnlocked();
          this.enslavedSpanOverride = Enslaved.isRunning && challenge.id === 1;
          this.canBeUnlocked = TimeStudy.eternityChallenge(challenge.id).canBeBought;
        },
        start() {
          if (this.canBeUnlocked) {
            TimeStudy.eternityChallenge(this.challenge.id).purchase();
          } else this.challenge.requestStart();
        },
        goalAtCompletions(completions) {
          return format(this.challenge.goalAtCompletions(completions), 2, 1);
        }
      },
      template:
        `<eternity-challenge-box
          :name="name"
          :isUnlocked="isUnlocked"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          :canBeUnlocked="canBeUnlocked"
          @start="start"
        >
          <description-display :config="config" slot="top" />
          <template slot="bottom">
            <div :style="{ visiblity: completions < 5 ? 'visible' : 'hidden' }">
              <div>
                Completed {{ "time" | quantifyInt(completions) }}
              </div>
              <div v-if="!isCompleted">
                {{ goalDisplay }}
              </div>
            </div>
            <span v-if="showGoalSpan">
              Goal Span: {{ firstGoal }} IP - {{ lastGoal }} IP
            </span>
            <span>
              Reward:
              <description-display
                :config="config.reward"
                :length="55"
                name="c-challenge-box__reward-description"
              />
            </span>
            <span>
              <effect-display v-if="completions > 0" :config="currentRewardConfig" />
              <span v-if="completions > 0 && completions < 5">|</span>
              <effect-display v-if="completions < 5" :config="nextRewardConfig" title="Next" />
            </span>
          </template>
        </eternity-challenge-box>`
    }
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false
    };
  },
  methods: {
    update() {
      this.unlockedCount = [...Array(12).keys()]
        .filter(id => this.isChallengeVisible(id + 1))
        .length;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(id) {
      const challenge = EternityChallenge(id);
      return challenge.completions > 0 ||
        challenge.isUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  },
  template: `
    <div class="l-challenges-tab">
      <challenges-header />
      <div>Complete Eternity Challenges again for a bigger reward, maximum of {{ formatInt(5) }} times.</div>
      <div v-if="unlockedCount !== 12">
        You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
      </div>
      <div v-else>
        You have seen all {{ formatInt(12) }} Eternity Challenges.
      </div>
      <challenge-grid :count="12" :isChallengeVisible="isChallengeVisible">
        <eternity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

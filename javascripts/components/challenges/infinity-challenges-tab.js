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
          @start="challenge.start()"
        >
          <template slot="top">
            <description-display :config="config" />
            <effect-display v-if="isRunning" :config="config" />
          </template>
          <div slot="bottom" class="l-challenge-box__bottom--infinity">
            <span>Goal: {{shorten(config.goal, 0, 0)}} antimatter</span>
            <span>Reward: <description-display :config="config.reward" /></span>
            <effect-display v-if="isCompleted" :config="config.reward" />
          </div>
        </challenge-box>`
    }
  },
  data() {
    return {
      postChallUnlocked: 0
    };
  },
  computed: {
    nextAtDisplay() {
      const next = nextAt[this.postChallUnlocked];
      return next !== undefined ?
        `Next challenge unlocks at ${this.shorten(next, 0, 0)} antimatter.` :
        "All Infinity Challenges unlocked";
    }
  },
  methods: {
    update() {
      this.postChallUnlocked = player.postChallUnlocked;
    },
    isChallengeVisible(id) {
      return player.postChallUnlocked >= id;
    }
  },
  template:
    `<div>
      <div>{{nextAtDisplay}}</div>
      <challenge-grid :count="8" :isChallengeVisible="isChallengeVisible">
        <infinity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});
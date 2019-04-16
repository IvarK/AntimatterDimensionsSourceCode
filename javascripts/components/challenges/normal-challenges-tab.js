Vue.component("normal-challenges-tab", {
  components: {
    "normal-challenge-box": {
      props: {
        challengeId: Number
      },
      data() {
        return {
          isRunning: false,
          isCompleted: false,
          isImpossible: false,
        };
      },
      computed: {
        challenge() {
          return Challenge(this.challengeId);
        },
        name() {
          return `C${this.challengeId}`;
        },
        overrideLabel() {
          return this.isImpossible ? "Impossible" : "";
        }
      },
      methods: {
        update() {
          this.isRunning = this.challenge.isRunning;
          this.isCompleted = this.challenge.isCompleted;
          this.isImpossible = Enslaved.isRunning &&
            !Enslaved.IMPOSSIBLE_CHALLENGE_EXEMPTIONS.includes(this.challengeId);
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="true"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          :overrideLabel="overrideLabel"
          class="c-challenge-box--normal"
          @start="challenge.start()"
        >
          <span slot="top">{{challenge.config.description}}</span>
          <span slot="bottom">Reward: {{challenge.config.reward}}</span>
        </challenge-box>`
    }
  },
  template:
    `<challenge-grid :count="12">
      <normal-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
    </challenge-grid>`
});
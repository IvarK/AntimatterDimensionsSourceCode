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
        };
      },
      computed: {
        challenge() {
          return Challenge(this.challengeId);
        },
        name: function() {
          return `C${this.challengeId}`;
        }
      },
      methods: {
        update() {
          this.isRunning = this.challenge.isRunning;
          this.isCompleted = this.challenge.isCompleted;
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="true"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
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
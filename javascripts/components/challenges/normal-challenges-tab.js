"use strict";

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
          isBroken: false,
        };
      },
      computed: {
        challenge() {
          return NormalChallenge(this.challengeId);
        },
        name() {
          return `C${this.challengeId}`;
        },
        overrideLabel() {
          return this.isBroken ? "Broken" : "";
        }
      },
      methods: {
        update() {
          this.isRunning = this.challenge.isRunning;
          this.isBroken = Enslaved.isRunning &&
            !Enslaved.BROKEN_CHALLENGE_EXEMPTIONS.includes(this.challengeId);
          this.isCompleted = this.challenge.isCompleted && !this.isBroken;
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
    `<div class="l-challenges-tab">
      <challenges-header/>
      <challenge-grid :count="12">
        <normal-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

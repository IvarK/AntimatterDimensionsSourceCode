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
          isUnlocked: false,
        };
      },
      computed: {
        challenge() {
          return NormalChallenge(this.challengeId);
        },
        config() {
          return this.challenge.config;
        },
        name() {
          return `C${this.challengeId}`;
        },
        overrideLabel() {
          return this.isBroken ? "Broken" : "";
        },
      },
      methods: {
        update() {
          this.isUnlocked = this.challenge.isUnlocked;
          this.isRunning = this.challenge.isRunning;
          this.isBroken = Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.challengeId);
          this.isCompleted = this.challenge.isCompleted && !this.isBroken;
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="isUnlocked"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          :overrideLabel="overrideLabel"
          class="c-challenge-box--normal"
          @start="challenge.requestStart()"
        >
          <description-display :config="config" slot="top" />
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

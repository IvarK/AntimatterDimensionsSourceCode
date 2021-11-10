import "./challenges-header.js";
import "./challenge-grid.js";
import "./challenge-box.js";
import "../common/description-display.js";

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
          if (this.challenge.isUnlocked) return this.challenge.config;
          return {
            name: `${this.challenge.config.name}`,
            description: `Infinity ${formatInt(this.challenge.config.lockedAt)} times to unlock.`
          };
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
          <span slot="bottom">Reward: {{ challenge.config.reward }}</span>
        </challenge-box>`
    }
  },
  template: `
    <div class="l-challenges-tab">
      <challenges-header />
      <div>
        If you have an active Big Crunch Autobuyer, it will attempt to Crunch
        as soon as possible when reaching Infinite antimatter.
      </div>
      <challenge-grid :count="12">
        <normal-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});

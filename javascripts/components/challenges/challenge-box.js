import HintText from "@/components/HintText";

Vue.component("challenge-box", {
  components: {
    HintText
  },
  props: {
    name: String,
    isUnlocked: false,
    isRunning: false,
    isCompleted: false,
    overrideLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      challengeId: Number,
      inC1: Boolean,
    };
  },
  computed: {
    buttonClassObject() {
      const challengeLocked = !(this.isCompleted || this.isRunning || this.inC1 || this.isUnlocked);
      // It's important to disable the cursor for Normal Challenge 1, challenges that are running, or
      // for challenges unable to be unlocked and not unlocked.
      const challengeNotEnterable = !this.isUnlocked || this.isRunning || this.name === "C1";
      return {
        "o-challenge-btn": true,
        "o-challenge-btn--running": this.isRunning || this.inC1,
        "o-challenge-btn--completed": this.isCompleted && this.isUnlocked,
        "o-challenge-btn--unlocked": !this.isCompleted && this.isUnlocked,
        "o-challenge-btn--locked": challengeLocked,
        "o-challenge-btn--unenterable": challengeNotEnterable,
      };
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning || this.inC1) return "Running";
      if (this.isCompleted) return "Completed";
      if (this.isUnlocked) return "Start";
      return "Locked";
    }
  },
  methods: {
    update() {
      this.inC1 = this.name === "C1" && !this.isCompleted && !Player.isInAntimatterChallenge;
    },
  },
  template: `
    <div class="c-challenge-box l-challenge-box">
      <HintText type="challenges" class="l-hint-text--challenge">
        {{ name }}
      </HintText>
      <slot name="top" />
      <div class="l-challenge-box__fill" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >
        {{ buttonText }}
      </button>
      <slot name="bottom" />
    </div>`
});

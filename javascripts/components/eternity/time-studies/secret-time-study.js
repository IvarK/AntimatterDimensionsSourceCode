import { rem } from "./rem.js";

Vue.component("secret-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      isVisible: player.secretUnlocks.viewSecretTS,
      isEnslaved: false,
    };
  },
  computed: {
    enslavedTT: () => 100,
    description() {
      return this.isEnslaved
        ? "... you ... have great potential ..."
        : "Unlock a Secret Achievement";
    },
    hide() {
      return this.isEnslaved ? "" : "(Double click to hide)";
    },
    cost() {
      return this.isEnslaved ? -this.enslavedTT : 0;
    },
    styleObject() {
      return {
        top: rem(this.setup.top),
        left: rem(this.setup.left)
      };
    },
    classObject() {
      return {
        "l-time-study": true,
        "o-time-study": true,
        "o-time-study--bought": true,
        "o-time-study-normal": true,
        "o-time-study-normal--bought": true,
        "o-time-study--secret": !this.isEnslaved && !this.isVisible,
        "o-time-study--secret-enslaved": this.isEnslaved && !this.isVisible,
        "o-time-study--secret-unlocked": this.isVisible,
        "o-time-study--secret-enslaved-unlocked": this.isEnslaved && this.isVisible,
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.secretUnlocks.viewSecretTS;
      this.isEnslaved = Enslaved.isRunning;
    },
    handleClick() {
      if (this.isEnslaved && !this.isVisible) {
        // If you're in Enslaved and haven't gotten the secret study
        player.secretUnlocks.viewSecretTS = true;
        EnslavedProgress.secretStudy.giveProgress();
        Currency.timeTheorems.add(this.enslavedTT);
      } else if (!this.isEnslaved && this.isVisible) {
        // If you aren't in Enslaved, double clicking will hide the study
        const clickTime = Date.now();
        if (clickTime - ui.lastClickTime < 750) {
          ui.lastClickTime = 0;
          player.secretUnlocks.viewSecretTS = false;
        } else {
          ui.lastClickTime = clickTime;
        }
      } else {
        // If you aren't in Enslaved and it isn't visible, show it and give the achievement
        ui.lastClickTime = 0;
        if (!player.secretUnlocks.viewSecretTS) {
          player.secretUnlocks.viewSecretTS = true;
          this.$refs.study.addEventListener("transitionend", function achGiver(e) {
            SecretAchievement(21).unlock();
            e.target.removeEventListener(e.type, achGiver);
          });
        }
      }
    },
  },
  template: `
    <button :class="classObject" :style="styleObject" @click="handleClick" ref="study">
      <span>
        {{ description }}
        <br>
        {{ hide }}
        <br>
        <span v-if="cost !== 0">
          Cost: {{ cost }} Time Theorems
        </span>
      </span>
    </button>`
});

Vue.component("secret-time-study-connection", {
  props: {
    setup: Object
  },
  data() {
    return {
      isVisible: player.secretUnlocks.viewSecretTS,
    };
  },
  computed: {
    classObject() {
      return {
        "o-time-study-connection": true,
        "o-time-study-connection--bought": true,
        "o-time-study-connection--secret": true,
        "o-time-study-connection--secret-unlocked": this.isVisible
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.secretUnlocks.viewSecretTS;
    },
    percents(value) {
      return `${value * 100}%`;
    }
  },
  template:
    `<line
      :x1="percents(setup.x1)"
      :y1="percents(setup.y1)"
      :x2="percents(setup.x2)"
      :y2="percents(setup.y2)"
      :class="classObject"
    />`
});

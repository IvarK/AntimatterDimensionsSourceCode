"use strict";

Vue.component("secret-time-study", {
  mixins: [remMixin],
  props: {
    setup: Object
  },
  data() {
    return {
      isVisible: player.secretUnlocks.viewSecretTS,
      lastClick: 0,
      isEnslaved: false,
    };
  },
  computed: {
    enslavedTT: () => 100,
    description() {
      return this.isEnslaved
        ? "... you ... have great potential ..."
        : "Unlock a secret achievement";
    },
    hide() {
      return this.isEnslaved ? "" : "(Double click to hide)";
    },
    cost() {
      return this.isEnslaved ? -this.enslavedTT : 0;
    },
    styleObject() {
      return {
        top: this.rem(this.setup.top),
        left: this.rem(this.setup.left)
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
      if (this.isVisible) {
        if (this.isEnslaved) return;
        // Hide the secret time study on double click
        const clickTime = Date.now();
        if (clickTime - this.lastClick < 750) {
          this.lastClick = 0;
          player.secretUnlocks.viewSecretTS = false;
        } else {
          this.lastClick = clickTime;
        }
      } else {
        // If a click made the study visible, it's not part of the double click to hide
        this.lastClick = 0;
        if (!player.secretUnlocks.viewSecretTS && !this.isEnslaved) {
          player.secretUnlocks.viewSecretTS = true;
          this.$refs.study.addEventListener("transitionend", function achGiver(e) {
            SecretAchievement(21).unlock();
            e.target.removeEventListener(e.type, achGiver);
          });
        }
        if (this.isEnslaved) {
          player.secretUnlocks.viewSecretTS = true;
          EnslavedProgress.secretStudy.giveProgress();
          player.timestudy.theorem = player.timestudy.theorem.plus(this.enslavedTT);
        }
      }
    },
  },
  template:
    `<button :class="classObject" :style="styleObject" @click="handleClick" ref="study">
      <span>
        {{description}}
        <br>
        {{hide}}
        <br>
        Cost: {{cost}} Time Theorems
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
      return value * 100 + "%";
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

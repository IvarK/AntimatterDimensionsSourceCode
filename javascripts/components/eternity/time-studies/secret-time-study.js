Vue.component("secret-time-study", {
  mixins: [remMixin],
  props: {
    setup: Object
  },
  data: function() {
    return {
      isUnlocked: player.achievements.includes("s21")
    };
  },
  computed: {
    styleObject: function() {
      return {
        top: this.rem(this.setup.top),
        left: this.rem(this.setup.left)
      };
    },
    classObject: function() {
      return {
        "l-time-study": true,
        "o-time-study": true,
        "o-time-study--bought": true,
        "o-time-study--secret": true,
        "o-time-study--secret-unlocked": this.isUnlocked
      };
    }
  },
  methods: {
    handleClick() {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      this.$refs.study.addEventListener("transitionend", () => {
        giveAchievement("Go study in real life instead");
      });
    }
  },
  template:
    `<button :class="classObject" :style="styleObject" @click="handleClick" ref="study">
      Unlock a secret achievement
      <br>
      Cost: 0 Time Theorems
    </button>`
});

Vue.component("secret-time-study-connection", {
  mixins: [remMixin],
  props: {
    setup: Object
  },
  data: function() {
    return {
      isUnlocked: player.achievements.includes("s21")
    };
  },
  computed: {
    classObject: function() {
      return {
        "o-time-study-connection": true,
        "o-time-study-connection--bought": true,
        "o-time-study-connection--secret": true,
        "o-time-study-connection--secret-unlocked": this.isUnlocked
      };
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, () => {
      this.isUnlocked = player.achievements.includes("s21");
    });
  },
  template:
    `<line
      :x1="rem(setup.x1)"
      :y1="rem(setup.y1)"
      :x2="rem(setup.x2)"
      :y2="rem(setup.y2)"
      :class="classObject"
    />`
});
Vue.component('secret-achievement', {
  props: {
    row: Number,
    column: Number
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    achId() {
      return this.row * 10 + this.column;
    },
    achievement() {
      return SecretAchievement(this.achId);
    },
    styleObject: function() {
      return {
        "background-image": `url(images/s${this.achId}.png)`,
      };
    },
    classObject: function() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked
      };
    },
    tooltip: function() {
      const config = this.achievement.config;
      return this.isUnlocked ? config.tooltip : config.name;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      this.isUnlocked = this.achievement.isUnlocked;
    },
    onClick: function() {
      if (this.achId === 11 && !this.isUnlocked) {
        giveAchievement("The first one's always free");
      }
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      :ach-tooltip="tooltip"
      @click="onClick">
      <br>
     </div>`
});
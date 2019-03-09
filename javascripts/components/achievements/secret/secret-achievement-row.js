Vue.component('secret-achievement-row', {
  props: {
    row: Number
  },
  data: function() {
    return {
      isCompleted: false
    };
  },
  computed: {
    classObject: function() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      const unlockState = Array.from({length: 8}, (v, i) => this.row * 10 + i + 1)
        .map(achId => player.secretAchievements.has(achId));
      this.isCompleted = !unlockState.includes(false);
    }
  },
  template:
    `<div :class="classObject">
      <secret-achievement
        v-for="column in 8"
        :key="column"
        :row="row"
        :column="column"
        class="l-achievement-grid__cell"
      />
    </div>`
});

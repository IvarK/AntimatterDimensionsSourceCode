Vue.component('reality-achievement-row', {
  props: {
    row: Number
  },
  data: function() {
    return {
      isCompleted: false,
      updateStateAt: 0
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
    this.on$(GameEvent.REALITY, this.updateState);
    this.updateState();
  },
  methods: {
    update() {
      if (this.isCompleted || this.updateStateAt === 0) return;
      if (new Date().getTime() < this.updateStateAt) return;
      this.updateState();
    },
    updateState() {
      const unlockState = Array.range(1, 8).map(i => Achievement((this.row + 13) * 10 + i).isEnabled);
      if (!unlockState.includes(false)) {
        this.isCompleted = true;
        return;
      }
      this.isCompleted = false;
      if (player.realities === 0) {
        this.updateStateAt = 0;
        return;
      }
      this.updateStateAt = new Date().getTime() + nextAchIn();
    }
  },
  template:
    `<div :class="classObject">
      <normal-achievement
        v-for="column in 4"
        :key="column"
        :row="row"
        :column="column"
        class="l-achievement-grid__cell"
      />
    </div>`
});
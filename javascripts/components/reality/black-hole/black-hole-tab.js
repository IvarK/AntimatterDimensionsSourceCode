Vue.component("black-hole-tab", {
  data() {
    return {
      isUnlocked: false,
      isPaused: false
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list
  },
  mounted() {
    this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
  },
  destroyed() {
    this.animation.unmount();
  },
  methods: {
    update() {
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
    },
    togglePause() {
      BlackHoles.togglePause();
      this.update();
    }
  },
  template: `
    <div class="l-black-hole-tab">
      <black-hole-unlock-button v-if="!isUnlocked" />
      <template v-else>
        <canvas class="c-black-hole-canvas" ref="canvas" width="400" height="400" />
        <div class="l-black-hole-upgrade-grid">
          <black-hole-state-row
            v-for="(blackHole, i) in blackHoles"
            :key="'state' + i"
            :blackHole="blackHole"
          />
          <black-hole-upgrade-row
            v-for="(blackHole, i) in blackHoles"
            :key="'upgrades' + i"
            :blackHole="blackHole"
          />
          <button
            class="l-reality-upgrade-btn c-reality-upgrade-btn"
            @click="togglePause"
          >
            {{ isPaused ? "Resume" : "Pause" }}
          </button>
        </div>
      </template>
    </div>
  `
});
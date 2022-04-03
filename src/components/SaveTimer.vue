<script>
export default {
  name: "SaveTimer",
  data() {
    return {
      currentTime: 0,
      lastSave: 0,
      showTimeSinceSave: false
    };
  },
  computed: {
    time() {
      return timeDisplayShort(this.currentTime - this.lastSave);
    }
  },
  methods: {
    update() {
      this.lastSave = GameStorage.lastSaveTime;
      this.currentTime = Date.now();
      this.showTimeSinceSave = player.options.showTimeSinceSave;
    },
    save() {
      GameStorage.save();
    }
  }
};
</script>

<template>
  <div
    v-if="showTimeSinceSave"
    class="o-save-timer"
    @click="save"
  >
    Time since last save: {{ time }}
  </div>
</template>

<style scoped>
.o-save-timer {
  color: var(--color-text);
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: var(--color-base);
  white-space: nowrap;
  border-top: 0.1rem solid var(--color-accent);
  border-right: 0.1rem solid var(--color-accent);
  cursor: pointer;
  user-select: none;
  pointer-events: all;
  padding: 0 0.5rem;
  z-index: 5;
}

.t-inverted .o-save-timer,
.t-inverted-metro .o-save-timer {
  filter: invert(100%)
}

.t-s2 .o-save-timer {
  filter: sepia(100%) hue-rotate(180deg) saturate(250%);
}

.t-s3 .o-save-timer {
  animation: glasses 7s infinite;
}
</style>
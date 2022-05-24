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
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  color: var(--color-text);
  background-color: var(--color-base);
  border-top: 0.1rem solid var(--color-accent);
  border-right: 0.1rem solid var(--color-accent);
  padding: 0 0.5rem;
  pointer-events: auto;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.t-s2 .o-save-timer {
  filter: sepia(100%) hue-rotate(180deg) saturate(250%);
}

.t-s3 .o-save-timer {
  animation: a-glasses 7s infinite;
}
</style>

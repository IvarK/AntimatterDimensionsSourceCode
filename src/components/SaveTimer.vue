<script>
export default {
  name: "SaveTimer",
  data() {
    return {
      currentTime: 0,
      cloudSaveEnabled: false,
      lastLocalSave: 0,
      lastCloudSave: 0,
      showTimeSinceSave: false
    };
  },
  computed: {
    localString() {
      const desc = this.cloudSaveEnabled
        ? "Time since last local save:"
        : "Time since last save:";
      return `${desc} ${timeDisplayShort(this.currentTime - this.lastLocalSave)}`;
    },
    cloudString() {
      if (!this.cloudSaveEnabled) return null;
      return `Time since last cloud save: ${timeDisplayShort(this.currentTime - this.lastCloudSave)}`;
    },
  },
  methods: {
    update() {
      this.currentTime = Date.now();
      this.cloudSaveEnabled = player.options.cloudEnabled;
      this.lastLocalSave = GameStorage.lastSaveTime;
      this.lastCloudSave = GameStorage.lastCloudSave;
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
    {{ localString }}
    <br>
    {{ cloudString }}
  </div>
</template>

<style scoped>
.o-save-timer {
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: left;
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

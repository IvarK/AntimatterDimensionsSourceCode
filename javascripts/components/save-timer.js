"use strict";

Vue.component("save-timer", {
  data() {
    return {
      currentTime: 0,
      lastSave: 0,
      showTimeSinceSave: false,
    };
  },
  computed: {
    time() {
      return timeDisplayShort(this.currentTime - this.lastSave);
    },
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
  },
  template: `
    <div class="o-save-timer" v-if="showTimeSinceSave" @click="save">
      Time since last save: {{ time }}
    </div>`
});

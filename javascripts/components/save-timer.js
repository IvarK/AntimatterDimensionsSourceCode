"use strict";

Vue.component("save-timer", {
  data() {
    return {
      currentTime: 0,
      lastSave: 0,
    };
  },
  computed: {
    time() {
      return timeDisplayShort(this.currentTime % this.lastSave);
    },
  },
  methods: {
    update() {
      this.lastSave = GameStorage.lastSaveTime;
      this.currentTime = Date.now();
    }
  },
  template: `
    <div class="o-save-timer">
      Time since last save: {{ time }}
    </div>`
});

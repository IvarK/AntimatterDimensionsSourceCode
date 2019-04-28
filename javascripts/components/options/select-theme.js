"use strict";

Vue.component("select-theme", {
  data() {
    return {
      themes: Themes.available()
    };
  },
  methods: {
    update() {
      this.themes = Themes.available();
    }
  },
  template: `
    <div class="l-select-theme">
      <div v-for="theme in themes" :key="theme.name"
           class="o-primary-btn l-select-theme__item c-select-theme__item"
           @click="theme.set()">
        {{theme.displayName()}}
      </div>
    </div>
  `
});
"use strict";

Vue.component("select-theme", {
  data() {
    return {
      availableThemeNames: []
    };
  },
  computed: {
    themes() {
      return this.availableThemeNames.map(name => Themes.find(name));
    }
  },
  methods: {
    update() {
      this.availableThemeNames = Themes.available().map(t => t.name);
    },
    setTheme(theme) {
      theme.set();
      PerkNetwork.forceNetworkRemake();
      PerkNetwork.initializeIfNeeded();
    }
  },
  template: `
    <div class="l-select-theme">
      <div
        v-for="theme in themes"
        :key="theme.name"
        class="o-primary-btn l-select-theme__item c-select-theme__item"
        @click="setTheme(theme)"
      >
        {{ theme.displayName() }}
      </div>
    </div>`
});

Vue.component("old-ui-tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      hasNotification: false,
      tabName: ""
    };
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.hasNotification = this.tab.hasNotification;
      if (this.tab.config.endName) {
        this.tabName = Pelle.transitionText(
          this.tab.name,
          this.tab.config.endName,
          Math.max(Math.min(Pelle.endState - (this.tab.id) % 4 / 10, 1), 0)
        );
      } else {
        this.tabName = this.tab.name;
      }
    }
  },
  template: `
    <button
      v-if="isAvailable"
      :class="tab.config.UIClass"
      class="o-tab-btn"
      style="margin: 0.2rem"
      @click="tab.show(true)"
    >
      {{ tabName }} <i v-if="hasNotification" class="fas fa-exclamation"></i>
    </button>`
});

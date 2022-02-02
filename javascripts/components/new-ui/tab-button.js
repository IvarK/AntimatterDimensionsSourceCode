Vue.component("tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      isHidden: false,
      subtabVisibilities: [],
      showSubtabs: false,
      hasNotification: false,
      tabName: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn": true,
        "o-tab-btn--subtabs": this.showSubtabs,
      };
    },
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.showSubtabs = this.isAvailable && this.subtabVisibilities.length >= 1;
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
    <div v-if="!isHidden && isAvailable" :class="[classObject, tab.config.UIClass]">
      <div
        class="l-tab-btn-inner"
        @click="tab.show(true)"
      >
        {{ tabName }} <i v-if="hasNotification" class="fas fa-exclamation"></i>
      </div>
      <div class="subtabs" v-if="showSubtabs">
        <div
          v-for="(subtab, index) in tab.subtabs"
          v-if="subtabVisibilities[index]"
          class="o-tab-btn o-tab-btn--subtab"
          :class="tab.config.UIClass"
          @click="subtab.show(true)"
        >
          <span v-html="subtab.symbol">
            <i v-if="subtab.hasNotification" class="fas fa-exclamation"></i>
          </span>
          <div class="o-subtab__tooltip">
            {{ subtab.name }}
          </div>
        </div>
      </div>
    </div>`
});

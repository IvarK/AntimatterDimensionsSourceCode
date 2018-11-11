Vue.component("autobuyer-box", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      isVisible: false,
      isActive: false
    };
  },
  methods: {
    update() {
      const setup = this.setup;
      if (setup === undefined) return;
      const isVisible = setup.isVisible();
      this.isVisible = isVisible;
      if (!isVisible) return;
      this.isActive = setup.getActive();
    },
    changeActive: function() {
      const current = this.setup.getActive();
      const next = !current;
      this.setup.setActive(next);
      this.active = next;
    }
  },
  template:
    `<div v-if="isVisible" class="c-autobuyer-box l-autobuyer-box">
      <slot />
      <div class="o-autobuyer-toggle-checkbox" @click="changeActive">
        <span class="o-autobuyer-toggle-checkbox__label">Is active:</span>
        <input :checked="isActive" type="checkbox"/>
      </div>
    </div>`
});

class AutobuyerBoxSetup {
  /**
   * @param {Function} isVisible
   * @param {Function} getActive
   * @param {Function} setActive
   */
  constructor(isVisible, getActive, setActive) {
    this.isVisible = isVisible;
    this.getActive = getActive;
    this.setActive = setActive;
  }
}
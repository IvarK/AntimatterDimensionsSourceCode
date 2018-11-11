Vue.component("autobuyer-box", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      isUnlocked: false,
      isOn: false
    };
  },
  computed: {
    autobuyer: function() {
      return this.setup.autobuyer;
    }
  },
  methods: {
    update() {
      if (this.setup === undefined) return;
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      if (!this.isUnlocked) return;
      this.isOn = autobuyer.isOn;
    },
    changeActive: function() {
      const newValue = !this.autobuyer.isOn;
      this.autobuyer.isOn = newValue;
      this.active = newValue;
    }
  },
  template:
    `<div v-if="isUnlocked" class="c-autobuyer-box l-autobuyer-box">
      <div>{{setup.name}}</div>
      <slot />
      <div class="o-autobuyer-toggle-checkbox" @click="changeActive">
        <span class="o-autobuyer-toggle-checkbox__label">Is active:</span>
        <input :checked="isOn" type="checkbox"/>
      </div>
    </div>`
});

class AutobuyerBoxSetup {
  /**
   * @param {string} name
   * @param {AutobuyerInfo|Autobuyer.eternity|Autobuyer.reality} autobuyer
   */
  constructor(name, autobuyer) {
    this.name = name;
    this.autobuyer = autobuyer;
  }
}
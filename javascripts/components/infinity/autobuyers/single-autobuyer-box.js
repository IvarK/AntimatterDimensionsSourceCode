"use strict";


Vue.component("single-autobuyer-box", {
  props: {
    autobuyer: Object,
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
  },
  template: `
    <span v-if="isUnlocked" class="c-autobuyer-box-row">
      <autobuyer-toggle-label :autobuyer="autobuyer" />
      <div>
        {{ name }}
        <autobuyer-interval-label :autobuyer="autobuyer" />
      </div>
    </span>`
});

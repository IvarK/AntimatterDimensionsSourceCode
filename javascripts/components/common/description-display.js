"use strict";

Vue.component("description-display", {
  props: {
    config: Object,
    name: String,
    length: Number,
    title: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      description: ""
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        if (config === undefined) return;
        const description = config.description;
        if (description === undefined) return;
        if (typeof description !== "function") {
          this.description = description;
          return;
        }
        this.updateFn = () => this.description = description();
      }
    }
  },
  computed: {
    classObject() {
      const name = this.name;
      if (name === undefined) return undefined;
      const classObject = {};
      classObject[name] = true;
      if (this.length !== undefined && this.description.length >= this.length) {
        classObject[name + "--small-text"] = true;
      }
      return classObject;
    }
  },
  methods: {
    update() {
      if (this.updateFn) this.updateFn();
    }
  },
  template: `<span :class="classObject">{{title}} {{description}}</span>`
});
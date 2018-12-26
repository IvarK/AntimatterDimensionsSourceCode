Vue.component("description-display", {
  props: {
    config: Object,
    name: String,
    length: Number
  },
  data() {
    return {
      description: String.empty
    };
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
  created() {
    const description = this.config.description;
    if (description === undefined) return;
    if (typeof description !== "function") {
      this.description = description;
      return;
    }
    const update = () => this.description = description();
    this.on$(GameEvent.UPDATE, update);
    update();
  },
  template: `<span :class="classObject">{{description}}</span>`
});
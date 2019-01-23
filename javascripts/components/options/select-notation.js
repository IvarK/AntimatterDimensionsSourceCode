Vue.component("select-notation", {
  props: {},
  computed: {
    notations() {
      return Notations.list.map(n => n.name);
    }
  },
  methods: {
    setNotation(name) {
      GameOptions.setNotation(name);
    }
  },
  template: /*html*/`
    <div class="l-select-notation">
      <div v-for="notation in notations" :key="notation"
           class="o-primary-btn l-select-notation__item c-select-notation__item"
           @click="setNotation(notation)">
        {{notation}}
      </div>
    </div>
  `
});